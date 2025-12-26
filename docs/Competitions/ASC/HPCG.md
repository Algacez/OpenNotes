```
git clone https://bgithub.xyz/hpcg-benchmark/hpcg.git
cd ~/hpcg
source /opt/intel/oneapi/setvars.sh
```

编辑`/hpcg/setup/Make.Linux_MPI`

```
which mpicc
which mpicxx
```

```
root@2d464e96b00c:~/hpcg# which mpicc
/opt/intel/oneapi/mpi/2021.11/bin/mpicc
root@2d464e96b00c:~/hpcg# which mpicxx
/opt/intel/oneapi/mpi/2021.11/bin/mpicxx
```

```
TOPdir       = /root/hpcg
MPdir        = /opt/intel/oneapi/mpi/2021.11
MPinc        = -I$(MPdir)/include
MPlib        = -L$(MPdir)/lib/release -lmpi
CXX          = $(MPdir)/bin/mpicxx
```

## 编译

```
cd /root/hpcg
./configure Linux_MPI
make
```

## 运行

```
/hpcg/bin/hpcg.dat
```

```
My HPCG test on 8 cores
104 104 104
2 2 2
```

```
mpirun -n 8 \
  -env I_MPI_OFI_PROVIDER tcp \
  -env I_MPI_OFI_LIBRARY_INTERNAL 1 \
  ./xhpcg
```

这是一个 **8 进程并行的 HPCG 基准测试（High Performance Conjugate Gradients）**，具体包括：

| 项目         | 说明                                                         |
| ------------ | ------------------------------------------------------------ |
| **问题规模** | 全局稀疏线性方程组，来自一个 **104×104×104 的 3D 网格**（共 1,124,864 个未知数） |
| **并行方式** | 使用 **8 个 MPI 进程**，按 **2×2×2 的 3D 拓扑** 分布（每个方向 2 个进程） |
| **计算核心** | 执行共轭梯度法（CG）求解 Ax = b，其中 A 是由 3D 27点 stencil 离散化得到的稀疏矩阵 |
| **性能指标** | 测量 **稀疏矩阵-向量乘（SpMV）**、**对称高斯-赛德尔（SymGS）**、**WAXPBY**、**点积（Dot Product）** 和 **多网格（MG）** 等核心操作的性能 |

> ✅ 这是一个 **标准的、有效的 HPCG 测试配置**，常用于评估 CPU 的浮点性能、内存带宽和 MPI 通信效率。