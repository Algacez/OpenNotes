# 🧊多头注意力 - CUDA

## ⚠ 题目描述

你需要写一个运行在**GPU**上的程序，实现多头注意力机制。具体来说，给出 $Q$ (Query), $K$(Key), $V$(Value) 三个形状为 $N * d_{model}$的矩阵，你需要计算：

$$
MultiHead_{i} = Concat(head_{1}, head_{2} ... head_{N})
$$
同时：
$$
head_{i} = softmax(\frac{Q_{i}K_{i}^{T}}{\sqrt d_{k}})V_{i}
$$
Example：
$$
N = 2, d_{model} = 4, h = 2
$$

$$
Q = 
\begin{bmatrix}
1.0 & 0.0 & 2.0 & 3.0 \\
4.0 & 5.0 & 6.0 & 7.0 \\
\end{bmatrix}
$$

$$
K =
\begin{bmatrix}
1.0 & 2.0 & 3.0 & 4.0\\
5.0 & 6.0 & 7.0 & 8.0
\end{bmatrix}
$$

$$
V =
\begin{bmatrix}
0.5 & 1.0 & 1.5 & 2.0\\
2.5 & 3.0 & 3.5 & 4.0
\end{bmatrix}
$$

$$
\text{Output} =
\begin{bmatrix}
2.39 & 2.89 & 3.50 & 4.00\\
2.50 & 3.00 & 3.50 & 4.00
\end{bmatrix}
$$



**数据限制**：

- `1 ≤ N ≤ 10000`
- `2 ≤ d_model ≤ 1024`
- `1 ≤ h ≤ d_model`
- `d_model % h == 0`
- `-10.0 ≤ values ≤ 10.0`

**要求：**

- 不能使用外部库
- 不允许修改`Solve`函数

**tips：**

- 推荐自己构建数据集，在本地初步测试程序的正确性后再提交。

CPU版本：

```
// Numerically stable softmax on a row of length N (in-place)
static void softmax_inplace(float* row, int N) {
    if (N <= 0) return;
    // find max
    float m = row[0];
    for (int i = 1; i < N; ++i) if (row[i] > m) m = row[i];
    // subtract max, exponentiate, sum
    double sum = 0.0;
    for (int i = 0; i < N; ++i) {
        double e = exp((double)row[i] - (double)m);
        row[i] = (float)e;
        sum += e;
    }
    if (sum == 0.0) return; // degenerate, shouldn't normally happen
    for (int i = 0; i < N; ++i) row[i] = (float)((double)row[i] / sum);
}

// CPU attention: Q,K,V are row-major arrays of shape (N x d_model).
// output is row-major (N x d_model) and will be written (accumulated over heads).
// All pointers must be valid and output should be pre-zeroed.
void attention_cpu(
    const float* Q, const float* K, const float* V,
    float* output,
    int N, int d_model, int h
) {
    if (N <= 0 || d_model <= 0 || h <= 0) return;
    if (d_model % h != 0) {
        cerr << "d_model must be divisible by h\n";
        return;
    }
    const int w = d_model / h;                  // per-head dimension
    const float scale = 1.0f / sqrtf((float)w); // scaling

    // Temporary N x N matrices (o and softmaxed_o)
    // Note: this is O(N^2) memory; for large N consider blockwise approaches.
    vector<float> o; o.assign((size_t)N * N, 0.0f);

    // For each head:
    for (int head = 0; head < h; ++head) {
        int col_off = head * w; // column offset in Q/K/V/output for this head

        // 1) compute o = scale * Q_head * K_head^T (size N x N)
        // o[i*N + j] = scale * sum_{k=0..w-1} Q[i, col_off+k] * K[j, col_off+k]
        for (int i = 0; i < N; ++i) {
            for (int j = 0; j < N; ++j) {
                double acc = 0.0;
                const float* qrow = Q + (size_t)i * d_model + col_off;
                const float* krow = K + (size_t)j * d_model + col_off; // K row j
                // inner loop over head-dim
                for (int k = 0; k < w; ++k) {
                    acc += (double)qrow[k] * (double)krow[k];
                }
                o[(size_t)i * N + j] = (float)(acc * (double)scale);
            }
        }

        // 2) softmax per row (in-place)
        for (int i = 0; i < N; ++i) {
            softmax_inplace(&o[(size_t)i * N], N);
        }

        // 3) multiply by V_head: out_part = o (N x N) * V_head (N x w) -> (N x w)
        // accumulate into output[:, col_off:col_off+w]
        for (int i = 0; i < N; ++i) {
            for (int col = 0; col < w; ++col) {
                double acc = 0.0;
                for (int j = 0; j < N; ++j) {
                    float oij = o[(size_t)i * N + j]; // softmaxed
                    float vjk = V[(size_t)j * d_model + col_off + col]; // V row j, col within head
                    acc += (double)oij * (double)vjk;
                }
                output[(size_t)i * d_model + col_off + col] += (float)acc;
            }
        }
    }
}
```




## 🥨分数分布

- 如果你能成功写出正确的程序，获得 100% 的分数。
- 尝试分析你当前程序的性能，试图优化，将优化的过程总结成文档提交，最高能获得额外的20%分数。



---



````

```cpp
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <cuda_runtime.h>
#include <time.h>

__global__ void cuda_softmax(const float *input, float *output, int N) {
    extern __shared__ float sdata[];
    int tid = threadIdx.x;

    float local_max = -INFINITY;
    for (int i = tid; i < N; i += blockDim.x) {
        local_max = fmaxf(local_max, input[i]);
    }
    sdata[tid] = local_max;
    __syncthreads();

    for (int stride = blockDim.x / 2; stride > 0; stride >>= 1) {
        if (tid < stride) 
        sdata[tid] = fmaxf(sdata[tid], sdata[tid + stride]);
        __syncthreads();
    }
    float max_val = sdata[0];
    __syncthreads();

    float local_sum = 0.0f;
    for (int i = tid; i < N; i += blockDim.x) {
        float val = expf(input[i] - max_val);
        output[i] = val;
        local_sum += val;
    }
    sdata[tid] = local_sum;
    __syncthreads();

    for (int stride = blockDim.x / 2; stride > 0; stride >>= 1) {
        if (tid < stride) sdata[tid] += sdata[tid + stride];
        __syncthreads();
    }
    float sum_exp = sdata[0];
    __syncthreads();

    for (int i = tid; i < N; i += blockDim.x) {
        output[i] /= sum_exp;
    }
}

__global__ void attention_1_kernel(
    const float* Q, const float* K, float* scores,
    int N, int d_model, int h, int head, float scale
) {
    int i = blockIdx.x;
    int j = threadIdx.x;
    if (i >= N || j >= N) return; // 越界判定

    int w = d_model / h;
    int col_off = head * w; // 当前头的列偏移

    const float* qrow = Q + i * d_model + col_off; // 头的向量部分的起始地址
    const float* krow = K + j * d_model + col_off;

    double acc = 0.0;
    for (int k = 0; k < w; ++k) acc += (double)qrow[k] * (double)krow[k];
    scores[i * N + j] = (float)(acc * (double)scale);
}

__global__ void attention_2_kernel(
    const float* scores, const float* V, float* output,
    int N, int d_model, int h, int head
) {
    int i = blockIdx.x;
    int col = threadIdx.x;
    int w = d_model / h;
    if (i >= N || col >= w) return;

    int col_off = head * w;
    double acc = 0.0;
    for (int j = 0; j < N; ++j) {
        float s = scores[i * N + j];
        float v = V[j * d_model + col_off + col];
        acc += (double)s * (double)v;
    }
    output[i * d_model + col_off + col] += (float)acc;
}

void attention_cuda(
    const float* h_Q, const float* h_K, const float* h_V,
    float* h_output, int N, int d_model, int h
) {
    int size = N * d_model * sizeof(float);
    int size_scores = N * N * sizeof(float);

    float *d_Q, *d_K, *d_V, *d_output, *d_scores;
    cudaMalloc(&d_Q, size);
    cudaMalloc(&d_K, size);
    cudaMalloc(&d_V, size);
    cudaMalloc(&d_output, size);
    cudaMalloc(&d_scores, size_scores);

    cudaMemcpy(d_Q, h_Q, size, cudaMemcpyHostToDevice);
    cudaMemcpy(d_K, h_K, size, cudaMemcpyHostToDevice);
    cudaMemcpy(d_V, h_V, size, cudaMemcpyHostToDevice);
    cudaMemset(d_output, 0, size);

    int w = d_model / h;
    float scale = 1.0f / sqrtf((float)w);

    int threads_per_block = (N < 1024) ? N : 1024; 
    size_t shared_mem_size = threads_per_block * sizeof(float);

    for (int head = 0; head < h; ++head) {
        attention_1_kernel<<<N, N>>>(d_Q, d_K, d_scores, N, d_model, h, head, scale);
        cudaDeviceSynchronize();

        for (int row = 0; row < N; ++row) {
            cuda_softmax<<<1, threads_per_block, shared_mem_size>>>(
                d_scores + row * N,
                d_scores + row * N,
                N
            );
        }
        cudaDeviceSynchronize();

        attention_2_kernel<<<N, w>>>(d_scores, d_V, d_output, N, d_model, h, head);
        cudaDeviceSynchronize();
    }

    cudaMemcpy(h_output, d_output, size, cudaMemcpyDeviceToHost);

    cudaFree(d_Q);
    cudaFree(d_K);
    cudaFree(d_V);
    cudaFree(d_output);
    cudaFree(d_scores);
}

int main() {
    int N = 2, d_model = 4, h = 2;
    
    float Q[8] = {1,0,2,3, 
                  4,5,6,7};
    float K[8] = {1,2,3,4, 
                  5,6,7,8};
    float V[8] = {0.5,1,1.5,2, 
                  2.5,3,3.5,4};
    float output[8] = {0};

    clock_t start, end;
    start = clock();
    attention_cuda(Q, K, V, output, N, d_model, h);
    end = clock();
    double GPU_TIME = (double)(end - start) / CLOCKS_PER_SEC;
    printf("GPU运行时间 %.3f 秒\n", GPU_TIME);

    printf("多头注意力:\n");
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < d_model; j++) {
            printf("%.2f ", output[i*d_model+j]);
        }
        printf("\n");
    }
    return 0;
}
```
````

