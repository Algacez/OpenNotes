---
sidebar_position: 9
---

# ⚡Flash Attention

本题要求你基于CUDA复现Flash Attention算法。Flash Attention v1论文见：

[FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness](https://arxiv.org/abs/2205.14135 )

**数据限制**：

- `1 ≤ N ≤ 1000`
- `2 ≤ d_model ≤ 1024`
- `1 ≤ h ≤ d_model`
- `d_model % h == 0`
- `-10.0 ≤ values ≤ 10.0`

**要求：**

- 不能使用外部库
- 不允许修改`Solve`函数

**tips：**

- 推荐自己构建数据集，在本地初步测试程序的正确性后再提交。

## 🥨分数分布

- 如果你能成功写出正确的程序，获得 100% 的分数。



---



## 论文思想
### IO
使用tile
### softmax
使用online softmax优化
前s-1个safe softmax

$$
d_{S-1} = \sum_{j=1}^{S-1} e^{x_j - m_{S-1}}
$$
然后更新前s-1个，再加上新的一个最大值
$$
\left(\sum_{j=1}^{S-1} e^{x_j-m_{S-1}}\right) \times e^{m_{S-1}-m_S} + e^{x_S-m_S}
$$
并行和CUDA Stream
```c
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <cuda_runtime.h>

#define BLOCK_SIZE_Q 128
#define BLOCK_SIZE_K 32

__global__ void flash_attention_kernel(
    const float* Q, const float* K, const float* V,
    float* output,
    int N, int d_model, int h, int head
) {
    int w = d_model / h;
    float scale = 1.0f / sqrtf((float)w);
    int row_start = blockIdx.x * BLOCK_SIZE_Q;
    int col_off = head * w;
    
    extern __shared__ float sdata[];
    float* q_block = sdata;
    float* k_block = q_block + BLOCK_SIZE_Q * w;
    float* v_block = k_block + BLOCK_SIZE_K * w;
    float* sum_vals = v_block + BLOCK_SIZE_K * w;
    float* max_vals = sum_vals + BLOCK_SIZE_Q;

    int tid = threadIdx.x;
    
    for (int i = tid; i < BLOCK_SIZE_Q; i += blockDim.x) {
        if (row_start + i < N) {
            sum_vals[i] = 0.0f;
            max_vals[i] = -INFINITY;
        }
    }
    __syncthreads();

    for (int k_start = 0; k_start < N; k_start += BLOCK_SIZE_K) {
        for (int i = 0; i < BLOCK_SIZE_Q; i++) {
            if (row_start + i < N) {
                for (int k = threadIdx.x; k < w; k += blockDim.x) {
                    q_block[i * w + k] = Q[(row_start + i) * d_model + col_off + k];
                }
            }
        }
        __syncthreads();

        for (int i = threadIdx.x; i < BLOCK_SIZE_K * w; i += blockDim.x) {
            int k_idx = k_start + i / w;
            int d_idx = i % w;
            if (k_idx < N && d_idx < w) {
                k_block[i] = K[k_idx * d_model + col_off + d_idx];
                v_block[i] = V[k_idx * d_model + col_off + d_idx];
            }
        }
        __syncthreads();

        int total_elements = BLOCK_SIZE_Q * BLOCK_SIZE_K;
        int elements_per_thread = (total_elements + blockDim.x - 1) / blockDim.x;
        int start_idx = tid * elements_per_thread;
        int end_idx = min(start_idx + elements_per_thread, total_elements); // 边界
        
        for (int idx = start_idx; idx < end_idx; idx++) {
            int i = idx / BLOCK_SIZE_K;
            int j = idx % BLOCK_SIZE_K;
            if (row_start + i < N && k_start + j < N) {
                float acc = 0.0f;
                for (int k = 0; k < w; k++) {
                    acc += q_block[i * w + k] * k_block[j * w + k];
                }
                acc *= scale;

                // Online softmax
                float old_max = max_vals[i];
                float new_max = fmaxf(old_max, acc);
                float exp_old = (old_max == -INFINITY) ? 0.0f : expf(old_max - new_max);
                float exp_new = expf(acc - new_max);
                
                sum_vals[i] = sum_vals[i] * exp_old + exp_new;
                max_vals[i] = new_max;

                for (int col = 0; col < w; col++) {
                    float old_output = output[(row_start + i) * d_model + col_off + col];
                    float new_output = old_output * exp_old + exp_new * v_block[j * w + col];
                    output[(row_start + i) * d_model + col_off + col] = new_output;
                }
            }
        }
        __syncthreads();
    }

    for (int i = tid; i < BLOCK_SIZE_Q; i += blockDim.x) {
        if (row_start + i < N && sum_vals[i] != 0.0f) {
            for (int col = 0; col < w; col++) {
                output[(row_start + i) * d_model + col_off + col] /= sum_vals[i];
            }
        }
    }
}

void flash_attention_cuda(
    const float* h_Q, const float* h_K, const float* h_V,
    float* h_output, int N, int d_model, int h
) {
    int size = N * d_model * sizeof(float);
    float *d_Q, *d_K, *d_V, *d_output;
    
    cudaMalloc(&d_Q, size);
    cudaMalloc(&d_K, size);
    cudaMalloc(&d_V, size);
    cudaMalloc(&d_output, size);
    
    cudaMemcpy(d_Q, h_Q, size, cudaMemcpyHostToDevice);
    cudaMemcpy(d_K, h_K, size, cudaMemcpyHostToDevice);
    cudaMemcpy(d_V, h_V, size, cudaMemcpyHostToDevice);
    cudaMemset(d_output, 0, size);

    int w = d_model / h;
    size_t shared_mem_size = (BLOCK_SIZE_Q * w + BLOCK_SIZE_K * w + BLOCK_SIZE_K * w +
                              BLOCK_SIZE_Q + BLOCK_SIZE_Q) * sizeof(float);
    
    dim3 grid((N + BLOCK_SIZE_Q - 1) / BLOCK_SIZE_Q);
    dim3 block(1024); 

    cudaStream_t streams[h];
    for (int i = 0; i < h; ++i) {
        cudaStreamCreate(&streams[i]);
    }

    for (int head = 0; head < h; ++head) {
        flash_attention_kernel<<<grid.x, block, shared_mem_size, streams[head]>>>(
            d_Q, d_K, d_V, d_output, N, d_model, h, head
        );
    }

    cudaMemcpy(h_output, d_output, size, cudaMemcpyDeviceToHost);

    for (int i = 0; i < h; ++i) {
        cudaStreamDestroy(streams[i]);
    }
    
    cudaFree(d_Q);
    cudaFree(d_K);
    cudaFree(d_V);
    cudaFree(d_output);
}

int main() {
    int N = 2, d_model = 4, h = 2;
    float Q[8] = {1, 0, 2, 3,
                  4, 5, 6, 7};
    float K[8] = {1, 2, 3, 4,
                  5, 6, 7, 8};
    float V[8] = {0.5, 1, 1.5, 2,
                  2.5, 3, 3.5, 4};
    float output[8] = {0};

    flash_attention_cuda(Q, K, V, output, N, d_model, h);

    printf("FlashAttention结果:\n");
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < d_model; j++) {
            printf("%.2f ", output[i * d_model + j]);
        }
        printf("\n");
    }
    
    return 0;
}
```
