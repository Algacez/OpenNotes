---
sidebar_position: 3
---

```c
#include <stdio.h>  
#include <math.h>  
#include <omp.h>  
#include <time.h>  
#include <stdlib.h>  
  
void vanilla_softmax(float *input, float *output, int N) {  
    if (N <= 0) return;  
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
        output[i] = output[i] / sum_exp;  
    }  
}  
  
void parallel_softmax(float *input, float *output, int N) {  
    if (N <= 0) return;  
    float max_val = input[0];  
  
    #pragma omp parallel for reduction(max:max_val)  
    for(int i = 1; i < N; i++) {  
        if(input[i] > max_val) {  
            max_val = input[i];  
        }  
    }  
  
    float sum_exp = 0; 
    #pragma omp parallel for reduction(+:sum_exp)  
    for(int i = 0; i < N; i++) {  
        output[i] = expf(input[i] - max_val);  
        sum_exp += output[i];  
    } 
  
    #pragma omp parallel for  
    for(int i = 0; i < N; i++) {  
        output[i] /= sum_exp;  
    }  
}  
  
  
int main()  
{  
    int N = 5000000;  
  
    float *input = (float*)malloc(N * sizeof(float));  
    float *output_vanilla = (float*)malloc(N * sizeof(float));  
    float *output_parallel = (float*)malloc(N * sizeof(float));  
  
  
    srand(time(NULL));  
    for(int i = 0; i < N; i++) {  
        input[i] = (float)(rand() % 100) / 10.0f;  
    }  
  
  
    double start = omp_get_wtime();  
    vanilla_softmax(input, output_vanilla, N);  
    double end = omp_get_wtime();  
    double vanilla_time = end - start;  
    printf("单线程用时: %.3f 秒\n", vanilla_time);  
  
    double start_parallel = omp_get_wtime();  
    parallel_softmax(input, output_parallel, N);  
    double end_parallel = omp_get_wtime();  
    double parallel_time = end_parallel - start_parallel;  
  
    printf("多线程用时: %.3f 秒\n", parallel_time);  
  
    printf("加速比: %.3fx\n", vanilla_time / parallel_time);  
  
    free(input);  
    free(output_vanilla);  
    free(output_parallel);  
  
    return 0;  
}
```