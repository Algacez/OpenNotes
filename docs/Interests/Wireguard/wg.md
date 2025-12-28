```
sudo apt update
sudo apt install git
sudo apt install wireguard-tools
```



```
# 下载 Go 1.23.5（amd64）
wget https://go.dev/dl/go1.23.5.linux-amd64.tar.gz

mv go1.23.5.linux-amd64.tar.gz /tmp/
```



```
# 进入临时目录
cd /tmp


# 解压到 /usr/local
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf go1.23.5.linux-amd64.tar.gz

# 设置 PATH（临时）
export PATH=$PATH:/usr/local/go/bin

# 验证版本
go version
# 应输出：go version go1.23.5 linux/amd64

# 写入 shell 配置文件（根据你用的 shell 选择）
echo 'export GOPROXY=https://goproxy.cn,direct' >> ~/.bashrc
source ~/.bashrc

echo 'export PATH=$PATH:/usr/local/go/bin' | sudo tee -a /etc/profile

source /etc/profile

cd
git clone https://git.zx2c4.com/wireguard-go
cd wireguard-go
make
sudo cp wireguard-go /usr/local/bin/
```



```
cd
mv hpctest.conf /etc/wireguard/
sudo chmod 600 /etc/wireguard/hpctest.conf
sudo wg-quick up hpctest
```

