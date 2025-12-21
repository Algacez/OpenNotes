---
slug: wireguard
title: Wireguard搭建
authors: [rock]
tags: [tutorial]
---

## 安装

<!-- truncate -->

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

Peer]
# 客户端2公钥
PublicKey = 
AllowedIPs = 10.78.0.3/32
```

### 启动WireGuard服务

```bash
sudo wg-quick up wg0
```

# 客户端连接

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
