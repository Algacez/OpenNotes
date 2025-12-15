# Sunshine + Moonlight + FRP + 公网服务器实现远程串流

## 被控端

前往[sunshine官网](https://app.lizardbyte.dev/Sunshine/?lng=zh-CN)进行下载

## 控制端

前往[moonlight官网](https://moonlight-stream.org/)下载对应操作系统的安装包

## frpc配置

```toml
serverAddr = ""
serverPort = 7000

[[proxies]]
name = "tcp-47984"
type = "tcp"
localIP = "127.0.0.1"
localPort = 47984
remotePort = 47984

[[proxies]]
name = "tcp-47989"
type = "tcp"
localIP = "127.0.0.1"
localPort = 47989
remotePort = 47989

[[proxies]]
name = "tcp-48010"
type = "tcp"
localIP = "127.0.0.1"
localPort = 48010
remotePort = 48010

[[proxies]]
name = "udp-47998"
type = "udp"
localIP = "127.0.0.1"
localPort = 47998
remotePort = 47998

[[proxies]]
name = "udp-47999"
type = "udp"
localIP = "127.0.0.1"
localPort = 47999
remotePort = 47999

[[proxies]]
name = "udp-48000"
type = "udp"
localIP = "127.0.0.1"
localPort = 48000
remotePort = 48000

[[proxies]]
name = "udp-48002"
type = "udp"
localIP = "127.0.0.1"
localPort = 48002
remotePort = 48002

[[proxies]]
name = "udp-48010"
type = "udp"
localIP = "127.0.0.1"
localPort = 48010
remotePort = 48010

[[proxies]]
name = "test-27036-tcp"
type = "tcp"
localIP = "127.0.0.1"
localPort = 27036
remotePort = 27036

[[proxies]]
name = "test-27036-udp"
type = "udp"
localIP = "127.0.0.1"
localPort = 27036
remotePort = 27036

[[proxies]]
name = "test-27037-tcp"
type = "tcp"
localIP = "127.0.0.1"
localPort = 27037
remotePort = 27037

[[proxies]]
name = "test-27031-udp"
type = "udp"
localIP = "127.0.0.1"
localPort = 27031
remotePort = 27031
```

:::caution
frp客户端开启代理后无法接受入站请求
:::
