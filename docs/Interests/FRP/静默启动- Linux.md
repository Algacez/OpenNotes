# FRP服务

## 静默启动- Linux

```
sudo vim /etc/systemd/system/frps.service
```
`frps.service` **删除注释！！！**
```
[Unit]
Description=Frp Server Service
After=network.target

[Service]
Type=simple
User=your_user  # <!--- 重要：替换成运行frp的用户，例如 ubuntu, root, 或 frp
Group=your_user # <!--- 重要：同上
WorkingDirectory=/usr/local/frp
ExecStart=/usr/local/frp/frps -c /usr/local/frp/frps.toml
Restart=on-failure
RestartSec=5s
StandardOutput=null
StandardError=null

[Install]
WantedBy=multi-user.target
```

```
sudo systemctl daemon-reload
sudo systemctl start frps
sudo systemctl status frps
sudo systemctl enable frps
```

---

```
sudo vim /etc/systemd/system/frpc.service
```



```
[Unit]  
Description=Frp Client Service  
After=network.target  
  
[Service]  
Type=simple  
User=ubuntu # <!--- 重要：替换成运行frp的用户，例如 ubuntu, root, 或 frp  
Group=ubuntu # <!--- 重要：同上  
WorkingDirectory=/home/ubuntu/frp_0.65.0_linux_amd64  
ExecStart=/home/ubuntu/frp_0.65.0_linux_amd64/frpc -c /home/ubuntu/frp_0.65.0_linux_amd64/frpc.toml  
Restart=on-failure  
RestartSec=5s  
StandardOutput=null  
StandardError=null  
  
[Install]  
WantedBy=multi-user.target
```

## Windows
```
' 创建一个 Shell 对象
Set shell = WScript.CreateObject("WScript.Shell")

' 定义要运行的命令
' 使用引号包裹路径和参数，以防止路径中带空格导致错误
command = "frpc.exe -c frpc.toml"

' 使用 Run 方法执行命令
' 第一个参数：要执行的命令
' 第二个参数：窗口样式，0 表示隐藏窗口，实现静默效果
' 第三个参数：是否等待程序执行完毕（设置为 False 时，脚本会立即返回，frpc 在后台独立运行）
shell.Run command, 0, False

' 释放对象
Set shell = Nothing
```