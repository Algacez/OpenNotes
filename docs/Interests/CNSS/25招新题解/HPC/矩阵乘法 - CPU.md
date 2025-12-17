# 🧊矩阵乘法 - CPU

## ⚠ 题目描述

你需要写一个运行在**CPU**上的程序，实现两个32位浮点数矩阵的相乘并得到相应的输出。已知矩阵A的形状为 $M \times N$，矩阵B的形状为$ N \times K $，计算结果 $C = A \times B$，因此矩阵C的形状为 $ M \times K $。所有的矩阵都以**行主序**的形式排列。

你需要使用多线程完成这个问题，并且运行时间要小于单线程版本的**65%**。推荐使用OpenMP实现，但不限制实现方法，只要是使用了多线程进行优化即可。

建议在本地测试单线程和多线程版本的运行时间。


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

- $ 1 \leq M, N, K \leq 2048$
- 我们会在 M = 2048, N =1024, K = 2048的情形测评程序

**要求：**

- 不能使用除了 OpenMP 以外的外部库
- 推荐自己构建数据集，在本地初步测试程序的正确性后再提交。


## 🥨分数分布

- 如果你能成功写出正确的程序，获得 100% 的分数。
- 尝试分析你当前程序的性能，试图优化，将优化的过程总结成文档提交，最高能获得额外的20%分数



---



```c
#include <stdio.h>  
#include <stdlib.h>  
#include <time.h>  
#include <omp.h>  
  
#define M 2048 // A行  
#define N 1024  // A列，B行  
#define K 2048  // B列  
  
void init_matrix(float *matrix, int size) {  
    for (int i = 0; i < size; i++) {  
        matrix[i] = (float)rand() / RAND_MAX;  // 要求浮点数  
    }  
}  
  
// 单  
void matrix_multiply_single(float *A, float *B, float *C, int m, int n, int k) {  
    for (int i = 0; i < m; i++) {  
        for (int j = 0; j < k; j++) {  
            float sum = 0.0f;  
            for (int l = 0; l < n; l++) {  
                sum += A[i * n + l] * B[l * k + j];  
            }  
            C[i * k + j] = sum;  
        }  
    }  
}  
  
// 多  
void matrix_multiply_multi(float *A, float *B, float *C, int m, int n, int k) {  
#pragma omp parallel for collapse(2)  
    for (int i = 0; i < m; i++) {  
        for (int j = 0; j < k; j++) {  
            float sum = 0.0f;  
            for (int l = 0; l < n; l++) {  
                sum += A[i * n + l] * B[l * k + j];  
            }  
            C[i * k + j] = sum;  
        }  
    }  
}  
  
int main() {  
    int max_threads = omp_get_max_threads();  
    printf("最大线程数 %d \n", max_threads);  
  
    float *A = (float *)malloc(M * N * sizeof(float));  
    float *B = (float *)malloc(N * K * sizeof(float));  
    float *C_single = (float *)malloc(M * K * sizeof(float));  
    float *C_multi = (float *)malloc(M * K * sizeof(float));  
  
    init_matrix(A, M * N);  
    init_matrix(B, N * K);  
  
    // 单  
    clock_t start = clock();  
    matrix_multiply_single(A, B, C_single, M, N, K);  
    clock_t end = clock();  
    double single_time = (double)(end - start) / CLOCKS_PER_SEC;  
    printf("单线程版本运行时间: %.3f 秒\n", single_time);  
  
    // 多  
    start = clock();  
    matrix_multiply_multi(A, B, C_multi, M, N, K);  
    end = clock();  
    double multi_time = (double)(end - start) / CLOCKS_PER_SEC;  
    printf("多线程版本运行时间: %.3f 秒\n", multi_time);  
  
    printf("加速比: %.3fx\n", single_time / multi_time);  
  
    free(A);  
    free(B);  
    free(C_single);  
    free(C_multi);  
  
    return 0;  
}
```
