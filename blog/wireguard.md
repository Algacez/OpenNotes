---
slug: wireguard
title: Wireguard搭建
authors: [rock]
tags: [tutorial]
---

## 安装

<!-- truncate -->

为什么有第一行呢😭

```
sudo apt-mark hold linux-image-rt-arm64 linux-headers-rt-arm64
```

```
sudo apt install wireguard-tools
```

```
sudo apt update
sudo apt install golang git
```

```
git clone https://git.zx2c4.com/wireguard-go
cd wireguard-go
make
sudo cp wireguard-go /usr/local/bin/
```

### Go版本过低

```
# 进入临时目录
cd /tmp

# 下载 Go 1.23.5（ARM64）
wget https://go.dev/dl/go1.23.5.linux-arm64.tar.gz

# 解压到 /usr/local
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf go1.23.5.linux-arm64.tar.gz

# 设置 PATH（临时）
export PATH=$PATH:/usr/local/go/bin

# 验证版本
go version
# 应输出：go version go1.23.5 linux/arm64

# 写入 shell 配置文件（根据你用的 shell 选择）
echo 'export GOPROXY=https://goproxy.cn,direct' >> ~/.bashrc
source ~/.bashrc

echo 'export PATH=$PATH:/usr/local/go/bin' | sudo tee -a /etc/profile
source /etc/profile

cd ~/wireguard-go
make
```

### 启动 wg0 接口（在后台运行）

```
sudo wireguard-go wg0
sudo wg setconf wg0 /etc/wireguard/wg0.conf
sudo ip link set up dev wg0

# 关闭并删除接口（会自动退出 wireguard-go）
sudo ip link delete wg0
```

### 生成密钥

#### 生成客户端密钥

```bash
sudo wg genkey | tee client01_privatekey | wg pubkey > client01_publickey
```

多客户端可以继续生成

```bash
sudo wg genkey | tee client02_privatekey | wg pubkey > client02_publickey
```

这将生成私钥（privatekey）和公钥（publickey）。重复此步骤以创建每个客户端的密钥对。

```
sudo wg setconf wg0 /etc/wireguard/wg0.conf
```



## 客户端连接

将 `PublicKey`替换成服务器公钥，`PrivateKey` 替换为每个客户端的**私钥**，并根据需要为每个客户端创建配置文件。

```bash
[Interface]
PrivateKey = 
Address = 10.78.0.2/32

[Peer]
PublicKey = VPcKzPGliNCec7GTRgLaeiQSuC8yi4uxg/SbG+j1zWs=
AllowedIPs = 192.168.77.0/24
Endpoint = 139.38.120.136:51820
PersistentKeepalive = 25
```

---

## kernel >= 6

```
sudo apt update
sudo apt install wireguard
```

### 生成服务器密钥

```bash
cd /etc/wireguard/
umask 077
sudo wg genkey | tee server_privatekey | wg pubkey > server_publickey
```

### 生成客户端密钥

```bash
sudo wg genkey | tee client01_privatekey | wg pubkey > client01_publickey
```

多客户端可以继续生成

```bash
sudo wg genkey | tee client02_privatekey | wg pubkey > client02_publickey
```

这将生成私钥（privatekey）和公钥（publickey）。重复此步骤以创建每个客户端的密钥对。

### 查看服务器及客户端公钥和私钥

```bash
# cat server_privatekey
# cat server_publickey
```

```
services:
  wg-gen-web:
    image: vx3r/wg-gen-web:latest
    container_name: wg-gen-web
    restart: always
    expose:
      - "8080/tcp"
    ports:
      - 8085:8080
    environment:
      - WG_CONF_DIR=/data
      - WG_INTERFACE_NAME=wg0.conf
      - OAUTH2_PROVIDER_NAME=fake
      - WG_STATS_API=http://<API_LISTEN_IP>:8182
    volumes:
      - /etc/wireguard:/data
    network_mode: bridge
  wg-json-api:
    image: james/wg-api:latest
    container_name: wg-json-api
    restart: always
    cap_add:
      - NET_ADMIN
    network_mode: "host"
    command: wg-api --device wg0 --listen <API_LISTEN_IP>:8182
```

## 配置Wireguard服务端

## 启用内核转发

```bash
echo net.ipv4.ip_forward = 1 >> /etc/sysctl.conf

sysctl -p
```

## 服务端配置文件

创建一个配置文件，例如 `/etc/wireguard/wg0.conf`，并将以下内容添加到文件中（请替换 `PrivateKey` 为**服务器私钥** 和 `PublicKey`为**客户端公钥**：

```
vim /etc/wireguard/wg0.conf
```

```bash
[Interface]
# 服务器私钥
PrivateKey = 
Address = 10.78.0.1
ListenPort = 51820
PostUp = echo 1 > /proc/sys/net/ipv4/ip_forward
PostUp = iptables -A FORWARD -i %i -j ACCEPT
# 替换为你的网卡
PostUp = iptables -t nat -I POSTROUTING -o ens160 -j MASQUERADE
PreDown = iptables -t nat -D POSTROUTING -o ens160 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT

[Peer]
# 客户端1公钥
PublicKey = 
AllowedIPs = 10.78.0.2/32

[Peer]
# 客户端2公钥
PublicKey = 
AllowedIPs = 10.78.0.3/32
```

### 启动WireGuard服务

```bash
sudo wg-quick up wg0
```
