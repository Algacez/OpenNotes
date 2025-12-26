```
cd /workspace
wget https://bgithub.xyz/fatedier/frp/releases/download/v0.65.0/frp_0.65.0_linux_amd64.tar.gz
tar -zxvf frp_0.65.0_linux_amd64.tar.gz
```

```
cd frp_0.65.0_linux_amd64
```



```
# FRPC 客户端配置
serverAddr = ""  # 服务端公网IP或域名（自动获取，可手动修改）
serverPort = 7000                     # 服务端通信端口（tcp/kcp端口为7000端口，quic为7002端口）
transport.protocol = "kcp"        #服务端通信协议可选quic/tcp/kcp，需与上方端口对应
auth.token = ""          # frp认证密钥

[[proxies]]
name = "hpctest"
type = "tcp"
localIP = "127.0.0.1"
localPort = 22
remotePort = 46636
```



```
nohup /workspace/frp_0.65.0_linux_amd64/frpc -c /workspace/frp_0.65.0_linux_amd64/frpc.toml > /dev/null 2>&1 &
```



```
mkdir -p ~/.ssh
chmod 700 ~/.ssh
touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```



```
nohup /usr/sbin/sshd >/dev/null 2>&1 &
```

