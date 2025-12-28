---
slug: nvidiadriver
title: Ubuntu 安装 NVIDIA 驱动
authors: [rock]
tags: [tutorial]
---

给NU的两张tesla p4打上驱动

<!-- truncate -->

pve ubuntu2404

首先是ssh

要设置root密码

```
vim /etc/ssh/sshd_config

passwd root

service sshd restart
```

换源

```
sudo sed -i 's/http:\/\/archive.ubuntu.com/https:\/\/mirrors.tuna.tsinghua.edu.cn/g' /etc/apt/sources.list.d/ubuntu.sources
sudo sed -i 's/http:\/\/security.ubuntu.com/https:\/\/mirrors.tuna.tsinghua.edu.cn/g' /etc/apt/sources.list.d/ubuntu.sources
```

[下载 NVIDIA 官方驱动 | NVIDIA](https://www.nvidia.cn/drivers/lookup/)

[下载驱动](https://cn.download.nvidia.com/tesla/580.105.08/nvidia-driver-local-repo-ubuntu2404-580.105.08_1.0-1_amd64.deb)

------

### 1. 准备工作

首先确保系统已经安装了必要的内核头文件：

```
sudo apt update
sudo apt install linux-headers-$(uname -r) -y
```

### 2. 安装本地仓库包

进入该 `.deb` 文件所在的目录并执行安装：

```
cd /root/p4/
sudo dpkg -i nvidia-driver-local-repo-ubuntu2404-580.105.08_1.0-1_amd64.deb
```

### 3. 关键：注册 GPG 密钥

**这一步至关重要**。安装完上面的 deb 包后，系统会生成一个本地密钥。你需要将其复制到系统的密钥库中，否则 `apt` 无法识别这个本地源。

执行以下命令（注意路径中的版本号需匹配）：

```
sudo cp /var/nvidia-driver-local-repo-ubuntu2404-580.105.08/nvidia-driver-local-*-keyring.gpg /usr/share/keyrings/
```

### 4. 正式安装驱动

现在更新索引并安装 580 版本的驱动：

```
sudo apt update
sudo apt install nvidia-driver-580 -y
```

------

### 5. 重启与验证

完成后重启虚拟机：

```
sudo reboot
```

```
nvidia-smi
```

```
sudo apt install nvtop
```

---

## CUDA

```
sudo apt-get -y install cuda-toolkit-13-0
```

`~/.bashrc` 的最后添加

```
export PATH=/usr/local/cuda-13.0/bin:$PATH  
export LD_LIBRARY_PATH=/usr/local/cuda-13.0/lib64:$LD_LIBRARY_PATH
export CUDA_HOME=/usr/local/cuda
```

```
source ~/.bashrc
```

