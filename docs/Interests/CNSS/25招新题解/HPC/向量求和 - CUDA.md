#  向量求和

## ⚠ 题目描述
本题要求你在**GPU**上实现一个逐元素相加的向量求和，规定每个元素为32位浮点数。

程序应当接收两个向量作为输入，一个向量作为输出。

你需要补全下列代码中的`vector_add`函数来实现向量求和：

```C
#include <cuda_runtime.h>

__global__ void vector_add(const float* A, const float* B, float* C, int N) {

}

// A, B, C are device pointers (i.e. pointers to memory on the GPU)
extern "C" void solve(const float* A, const float* B, float* C, int N) {
    int threadsPerBlock = 256;
    int blocksPerGrid = (N + threadsPerBlock - 1) / threadsPerBlock;

    vector_add<<<blocksPerGrid, threadsPerBlock>>>(A, B, C, N);
    cudaDeviceSynchronize();
}
```

**示例：**

输入向量 A：
$$
\begin{bmatrix}
30.0 && 31.0 && 60.0 && 70.0 \\
\end{bmatrix}
$$
输入向量B：
$$
\begin{bmatrix}
20.0 && 45.0 && 12.0 && 31.9 \\
\end{bmatrix}
$$
输出向量C：
$$
\begin{bmatrix}
50.0 && 76.0 && 72.0 && 101.9 \\
\end{bmatrix}
$$
**数据限制**：

- 输入向量A和向量B有相同的长度
- 向量长度 $N \leq 100,000,000$

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



## 函数部分
```
__global__ void vector_add(const float* A, const float* B, float* C, int N) {
    int idx = blockIdx.x * blockDim.x + threadIdx.x;
    if (idx < N) {
        C[idx] = A[idx] + B[idx];
    }
}
```

## 优化
使用CUDA流，利用 `cudaMemcpyAsync` 实现计算和数据传输的重叠，提升程序总吞吐量。
### 完整程序
```
#include <cuda_runtime.h>
#include <iostream>
#include <vector>

__global__ void vector_add(const float* A, const float* B, float* C, int N) {
    int idx = blockIdx.x * blockDim.x + threadIdx.x;
    if (idx < N) {
        C[idx] = A[idx] + B[idx];
    }
}

extern "C" void solve(const float* A, const float* B, float* C, int N, cudaStream_t stream) {
    int threadsPerBlock = 256;
    int blocksPerGrid = (N + threadsPerBlock - 1) / threadsPerBlock;

    // 在给定 stream 中启动 kernel
    vector_add<<<blocksPerGrid, threadsPerBlock, 0, stream>>>(A, B, C, N);
}

int main() {
    // 主机数据
    std::vector<float> h_A = {30.0, 31.0, 60.0, 70.0};
    std::vector<float> h_B = {20.0, 45.0, 12.0, 31.9};
    int N = h_A.size();

    // 设备内存
    float *d_A, *d_B, *d_C;
    cudaMalloc(&d_A, N * sizeof(float));
    cudaMalloc(&d_B, N * sizeof(float));
    cudaMalloc(&d_C, N * sizeof(float));

    // 创建流
    cudaStream_t stream;
    cudaStreamCreate(&stream);

    // 异步拷贝到设备
    cudaMemcpyAsync(d_A, h_A.data(), N * sizeof(float), cudaMemcpyHostToDevice, stream);
    cudaMemcpyAsync(d_B, h_B.data(), N * sizeof(float), cudaMemcpyHostToDevice, stream);

    // 在流中执行计算
    solve(d_A, d_B, d_C, N, stream);

    // 异步拷贝结果回主机
    std::vector<float> h_C(N);
    cudaMemcpyAsync(h_C.data(), d_C, N * sizeof(float), cudaMemcpyDeviceToHost, stream);

    // 等待流中所有任务完成
    cudaStreamSynchronize(stream);

    // 打印结果
    std::cout << "结果向量: ";
    for (float val : h_C) {
        std::cout << val << " ";
    }
    std::cout << std::endl;

    // 释放资源
    cudaStreamDestroy(stream);
    cudaFree(d_A);
    cudaFree(d_B);
    cudaFree(d_C);

    return 0;
}
```
