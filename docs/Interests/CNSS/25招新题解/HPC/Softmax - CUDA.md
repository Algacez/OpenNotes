---
sidebar_position: 4
---

# 🧊Softmax - CUDA

## ⚠ 题目描述

你需要写一个运行在**GPU**上的程序，实现Softmax算子。已知输入的矩阵 `x` 形状为 N。

Softmax算子的公式：
$$
M = \max_{1 \leq j \leq N} x_j
$$

$$
z_i = e^{\,x_i - M}, \quad S = \sum_{j=1}^{N} e^{\,x_j - M}
$$

$$
y_i = \frac{z_i}{S} \;=\; \frac{e^{\,x_i - M}}{\sum_{j=1}^{N} e^{\,x_j - M}}, \quad i = 1, 2, \dots, N
$$

原生版本的代码实现，你需要将这段代码改为多线程执行：

```
void vanilla_softmax(float *input, float *output, int N) {
    float max_val = input[0];
    for(int i = 1; i < N; i++) {
        if(input[i] > max_val) {
            max_val = input[i];
        }
    }

    float sum_exp = 0;
    for(int i = 0; i < N; i++) {
        output[i] = expf(input[i] - max_val);
        sum_exp += output[i];
    }

    for(int i = 0; i < N; i++) {
        output[i] = output[i] /= sum_exp;
    }
}
```

其中 `input` 对应公式中的 `x`向量， `output` 对应公式中的 `y`向量



**数据限制**：

- $ 1 \leq N \leq 1000000$

**要求：**

- 不能使用外部库
- 不允许修改`Solve`函数
- 程序的输出应当存储在向量**C**中

**tips：**

- 推荐自己构建数据集，在本地初步测试程序的正确性后再提交。


## 🥨分数分布

- 如果你能成功写出正确的程序，获得 100% 的分数。
- 尝试分析你当前程序的性能，试图优化，将优化的过程总结成文档提交，最高能获得额外的20%分数。



---



```cpp
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <time.h>
#include <cuda_runtime.h>

void vanilla_softmax(float *input, float *output, int N) {
    float max_val = input[0];
    for(int i = 1; i < N; i++) {
        if(input[i] > max_val) {
            max_val = input[i];
        }
    }

    float sum_exp = 0;
    for(int i = 0; i < N; i++) {
        output[i] = expf(input[i] - max_val);
        sum_exp += output[i];
    }

    for(int i = 0; i < N; i++) {
        output[i] = output[i] /= sum_exp;
    }
}

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
        if (tid < stride) {
            sdata[tid] = fmaxf(sdata[tid], sdata[tid + stride]);
        }
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
        if (tid < stride) {
            sdata[tid] += sdata[tid + stride];
        }
        __syncthreads();
    }
    float sum_exp = sdata[0];
    __syncthreads();

    for (int i = tid; i < N; i += blockDim.x) {
        output[i] /= sum_exp;
    }
}

int main() {
    int N = 1000000; 
    float *input = (float*)malloc(N * sizeof(float));
    float *output_cpu = (float*)malloc(N * sizeof(float));
    float *output_gpu = (float*)malloc(N * sizeof(float));

    for (int i = 0; i < N; i++) {
        input[i] = (float)(rand() % 100) / 10.0f;
    }

    clock_t start = clock();
    vanilla_softmax(input, output_cpu, N);
    clock_t end = clock();
    double cpu_time = (double)(end - start) / CLOCKS_PER_SEC;
    printf("CPU用时 %.3f 秒\n", cpu_time);

    float *d_in, *d_out;
    cudaMalloc((void**)&d_in, N * sizeof(float));
    cudaMalloc((void**)&d_out, N * sizeof(float));
    cudaMemcpy(d_in, input, N * sizeof(float), cudaMemcpyHostToDevice);

    start = clock();
    cuda_softmax<<<1, 1024, 1024 * sizeof(float)>>>(d_in, d_out, N);
    cudaDeviceSynchronize();
    end = clock();
    double gpu_time = (double)(end - start) / CLOCKS_PER_SEC;
    printf("GPU用时 %.3f 秒\n", gpu_time);

    printf("加速比 %.3fx\n", cpu_time / gpu_time);
    
    cudaMemcpy(output_gpu, d_out, N * sizeof(float), cudaMemcpyDeviceToHost);
    
    free(input);
    free(output_cpu);
    free(output_gpu);
    cudaFree(d_in);
    cudaFree(d_out);

    return 0;
}
```
