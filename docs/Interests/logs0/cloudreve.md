```
sudo vi /etc/systemd/system/cloudreve.service
```

```
[Unit]
Description=Cloudreve
After=network.target

[Service]
User=root
Group=root
WorkingDirectory=/root/cr
ExecStart=/root/cr/cloudreve

# 禁用日志输出
StandardOutput=null
StandardError=null

# 崩溃自动重启
Restart=always
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

```
# 重载系统配置
sudo systemctl daemon-reload

# 重启服务
sudo systemctl restart cloudreve
```

