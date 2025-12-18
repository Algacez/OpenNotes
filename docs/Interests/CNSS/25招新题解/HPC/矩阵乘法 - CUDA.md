---
sidebar_position: 6
---

# 矩阵乘法 - CUDA
## ⚠ 题目描述
你需要写一个运行在**GPU**上的程序，实现两个32位浮点数矩阵的相乘并得到相应的输出。已知矩阵A的形状为 $M \times N$，矩阵B的形状为$ N \times K $，计算结果 $C = A \times B$，因此矩阵C的形状为 $ M \times K $。所有的矩阵都以**行主序**的形式排列。

你需要实现`matrix_multiplication_kernel`函数来实现向量相乘。

```
#include <cuda_runtime.h>

__global__ void matrix_multiplication_kernel(const float* A, const float* B, float* C, int M, int N, int K) {

}

// A, B, C are device pointers (i.e. pointers to memory on the GPU)
extern "C" void solve(const float* A, const float* B, float* C, int M, int N, int K) {
    dim3 threadsPerBlock(16, 16);
    dim3 blocksPerGrid((K + threadsPerBlock.x - 1) / threadsPerBlock.x,
                       (M + threadsPerBlock.y - 1) / threadsPerBlock.y);
    
    matrix_multiplication_kernel<<<blocksPerGrid, threadsPerBlock>>>(A, B, C, M, N, K);
    cudaDeviceSynchronize();
}

```

**示例：**

矩阵A：
$$
\begin{bmatrix}
1 && 2 && 3 \\
4 && 5 && 6 \\
\end{bmatrix}
$$
矩阵B：
$$
\begin{bmatrix}
7 && 8 \\
9 && 10 \\
11 && 12 \\
\end{bmatrix}
$$
矩阵C:
$$
\begin{bmatrix}
58 && 64 \\
139 && 154
\end{bmatrix}
$$



**数据限制**：

- $ 1 \leq M, N, K \leq 8192$
- 我们会在 M = 8192, N = 6144, K = 4096的情形测评程序

**要求：**

- 不能使用外部库
- 不允许修改`solve`函数
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
#include <time.h>
#include <cuda_runtime.h>

void init_matrix(float *matrix, int size) {
    for (int i = 0; i < size; i++) {
        matrix[i] = (float)rand() / RAND_MAX;
    }
}

__global__ void matrix_multiplication_kernel(const float* A, const float* B, float* C, int M, int N, int K) {
    int row = blockIdx.y * blockDim.y + threadIdx.y; 
    int col = blockIdx.x * blockDim.x + threadIdx.x; 

    if (row < M && col < K) {
        float sum = 0.0f;
        for (int l = 0; l < N; l++) {
            sum += A[row * N + l] * B[l * K + col];
        }
        C[row * K + col] = sum;
    }
}

// A, B, C are device pointers (i.e. pointers to memory on the GPU)
extern "C" void solve(const float* A, const float* B, float* C, int M, int N, int K) {
    dim3 threadsPerBlock(16, 16);
    dim3 blocksPerGrid((K + threadsPerBlock.x - 1) / threadsPerBlock.x,
                       (M + threadsPerBlock.y - 1) / threadsPerBlock.y);
    
    matrix_multiplication_kernel<<<blocksPerGrid, threadsPerBlock>>>(A, B, C, M, N, K);
    cudaDeviceSynchronize();
}

int main() {
    int M = 4, N = 6, K = 8;

    float *h_A = (float *)malloc(M * N * sizeof(float));
    float *h_B = (float *)malloc(N * K * sizeof(float));
    float *h_C = (float *)malloc(M * K * sizeof(float));

    init_matrix(h_A, M * N);
    init_matrix(h_B, N * K);

    float *d_A, *d_B, *d_C;
    cudaMalloc((void**)&d_A, M * N * sizeof(float));
    cudaMalloc((void**)&d_B, N * K * sizeof(float));
    cudaMalloc((void**)&d_C, M * K * sizeof(float));

    cudaMemcpy(d_A, h_A, M * N * sizeof(float), cudaMemcpyHostToDevice);
    cudaMemcpy(d_B, h_B, N * K * sizeof(float), cudaMemcpyHostToDevice);

    clock_t start = clock();
    solve(d_A, d_B, d_C, M, N, K);
    clock_t end = clock();

    cudaMemcpy(h_C, d_C, M * K * sizeof(float), cudaMemcpyDeviceToHost);

    double gpu_time = (double)(end - start) / CLOCKS_PER_SEC;
    printf("GPU运行时间: %.6f 秒\n", gpu_time);

    free(h_A);
    free(h_B);
    free(h_C);
    cudaFree(d_A);
    cudaFree(d_B);
    cudaFree(d_C);

    return 0;
}
```
## 优化
**tile**https://hpcwiki.io/gpu/cuda/#3-shared-memory
```cpp
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <cuda_runtime.h>

#define TILE_WIDTH 16

void init_matrix(float *matrix, int size) {
    for (int i = 0; i < size; i++) {
        matrix[i] = (float)rand() / RAND_MAX;
    }
}

__global__ void matrix_multiplication_kernel(const float* A, const float* B, float* C, int M, int N, int K) {
    __shared__ float sA[TILE_WIDTH][TILE_WIDTH];
    __shared__ float sB[TILE_WIDTH][TILE_WIDTH];

    int bx = blockIdx.x, by = blockIdx.y;
    int tx = threadIdx.x, ty = threadIdx.y;
    int Row = by * TILE_WIDTH + ty;
    int Col = bx * TILE_WIDTH + tx;
    float value = 0.0f;

    int numTiles = (N + TILE_WIDTH - 1) / TILE_WIDTH;
    for (int t = 0; t < numTiles; ++t) {
        int aRow = Row;
        int aCol = t * TILE_WIDTH + tx;
        sA[ty][tx] = (aRow < M && aCol < N) ? A[aRow * N + aCol] : 0.0f;

        int bRow = t * TILE_WIDTH + ty;
        int bCol = Col;
        sB[ty][tx] = (bRow < N && bCol < K) ? B[bRow * K + bCol] : 0.0f;

        __syncthreads();

        for (int i = 0; i < TILE_WIDTH; ++i) {
            value += sA[ty][i] * sB[i][tx];
        }
        __syncthreads();
    }

    if (Row < M && Col < K) {
        C[Row * K + Col] = value;
    }
}

// A, B, C are device pointers (i.e. pointers to memory on the GPU)
extern "C" void solve(const float* A, const float* B, float* C, int M, int N, int K) {
    dim3 threadsPerBlock(16, 16);
    dim3 blocksPerGrid((K + threadsPerBlock.x - 1) / threadsPerBlock.x,
                       (M + threadsPerBlock.y - 1) / threadsPerBlock.y);
    
    matrix_multiplication_kernel<<<blocksPerGrid, threadsPerBlock>>>(A, B, C, M, N, K);
    cudaDeviceSynchronize();
}

int main() {
    int M = 128, N = 128, K = 128;

    float *h_A = (float *)malloc(M * N * sizeof(float));
    float *h_B = (float *)malloc(N * K * sizeof(float));
    float *h_C = (float *)malloc(M * K * sizeof(float));

    init_matrix(h_A, M * N);
    init_matrix(h_B, N * K);

    float *d_A, *d_B, *d_C;
    cudaMalloc((void**)&d_A, M * N * sizeof(float));
    cudaMalloc((void**)&d_B, N * K * sizeof(float));
    cudaMalloc((void**)&d_C, M * K * sizeof(float));

    cudaMemcpy(d_A, h_A, M * N * sizeof(float), cudaMemcpyHostToDevice);
    cudaMemcpy(d_B, h_B, N * K * sizeof(float), cudaMemcpyHostToDevice);

    clock_t start = clock();
    solve(d_A, d_B, d_C, M, N, K);
    clock_t end = clock();

    cudaMemcpy(h_C, d_C, M * K * sizeof(float), cudaMemcpyDeviceToHost);

    double gpu_time = (double)(end - start) / CLOCKS_PER_SEC;
    printf("GPU运行时间: %.6f 秒\n", gpu_time);

    free(h_A);
    free(h_B);
    free(h_C);
    cudaFree(d_A);
    cudaFree(d_B);
    cudaFree(d_C);

    return 0;
}
```
