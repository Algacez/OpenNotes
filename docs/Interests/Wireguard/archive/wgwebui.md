---
slug: wgwebui
title: Wireguard-web-ui
authors: [rock]
tags: [tutorial]
---

<!-- truncate -->

```
version: "3"
services:
  wireguard-ui:
    image: ngoduykhanh/wireguard-ui:latest
    container_name: wireguard-ui
    restart: unless-stopped
    ports:
      - "8088:5000"  # 注意：wireguard-ui 默认监听 5000！
    environment:
      # Web UI 认证
      - WGUI_USERNAME=admin
      - WGUI_PASSWORD=

      # WireGuard 全局配置（影响生成的 wg0.conf）
      - WGUI_SERVER_INTERFACE_ADDRESSES=10.78.0.1/16
      - WGUI_SERVER_LISTEN_PORT=13451
      - WGUI_ENDPOINT_ADDRESS=8.137.177.205:13451
      - WGUI_DNS=223.5.5.5,1.1.1.1

      # 客户端默认 AllowedIPs（关键！）
      - WGUI_DEFAULT_CLIENT_ALLOWED_IPS=10.78.0.0/16

      # 路径设置
      - WGUI_CONFIG_FILE_PATH=/etc/wireguard/wg0.conf

      # 不自动管理 WireGuard（由你手动用 wireguard-go 控制）
      - WGUI_MANAGE_START=false
      - WGUI_MANAGE_RESTART=false
    volumes:
      - ./conf:/etc/wireguard   # 配置文件输出到这里
      - ./db:/app/db            # 数据库存放
```



## 自动检测并更新

```
#!/bin/bash

# 配置路径
SRC_CONF="/opt/wg-gen-web/conf/wg0.conf"
DST_CONF="/etc/wireguard/wg0-go.conf"
INTERFACE="wg0"
SERVER_IP="10.78.0.1/16"
LOG_TAG="wireguard-go-auto"

log() {
  echo "[$(date -Iseconds)] $1"
  logger -t "$LOG_TAG" "$1"
}

# 确保 wireguard-go 接口存在
ensure_wg_interface() {
  if ! ip link show "$INTERFACE" &>/dev/null; then
    log "Creating wireguard interface $INTERFACE via wireguard-go..."
    wireguard-go "$INTERFACE" || { log "Failed to create $INTERFACE"; exit 1; }
  fi
}

# 从 SRC 提取合法 WireGuard 配置（兼容 wg setconf）
generate_clean_config() {
  log "Generating clean config from $SRC_CONF"
  grep -E '^\[Interface\]|^\[Peer\]|^PrivateKey\s*=|^ListenPort\s*=|^PublicKey\s*=|^PresharedKey\s*=|^AllowedIPs\s*=|^PersistentKeepalive\s*=' \
    "$SRC_CONF" \
    | grep -v -E 'Address|DNS|MTU|Table|PostUp|PreDown|PostDown|SaveConfig' \
    > "$DST_CONF"

  if [ ! -s "$DST_CONF" ]; then
    log "ERROR: Clean config is empty!"
    return 1
  fi
}

# 应用配置并设置 IP
apply_config() {
  log "Applying config to interface $INTERFACE"
  wg setconf "$INTERFACE" "$DST_CONF" || { log "Failed to setconf"; return 1; }

  # 设置 IP（仅当不存在时）
  if ! ip addr show "$INTERFACE" 2>/dev/null | grep -q "$SERVER_IP"; then
    log "Adding IP address $SERVER_IP to $INTERFACE"
    ip addr add "$SERVER_IP" dev "$INTERFACE" || log "Warning: Failed to add IP (may already exist)"
  fi

  ip link set "$INTERFACE" up
  log "✅ Successfully reloaded WireGuard config"
}

# 主循环
main() {
  if [ ! -f "$SRC_CONF" ]; then
    log "ERROR: Source config $SRC_CONF not found. Start wireguard-ui first."
    exit 1
  fi

  # 初始加载
  ensure_wg_interface
  generate_clean_config && apply_config

  log "Watching $SRC_CONF for changes..."

  # 使用 inotifywait 循环监听
  while inotifywait -q -e close_write "$SRC_CONF"; do
    sleep 3  # 确保文件写完
    if generate_clean_config; then
      apply_config
    else
      log "Skipping reload due to config generation error"
    fi
  done
}

# 依赖检查
if ! command -v inotifywait &> /dev/null; then
  echo "Error: inotify-tools not installed. Run: apt install -y inotify-tools"
  exit 1
fi

if ! command -v wireguard-go &> /dev/null; then
  echo "Error: wireguard-go not found in PATH"
  exit 1
fi

# 启动主逻辑
main
```

```
# 1. 安装 inotify-tools
sudo apt update && sudo apt install -y inotify-tools

# 2. 保存脚本并授权
sudo install -m 755 /dev/stdin /opt/wg-gen-web/watch-and-reload.sh << 'EOF'
# 将上面整个脚本粘贴在这里
EOF

# 3. 后台运行（建议用 systemd，见下方）
nohup /opt/wg-gen-web/watch-and-reload.sh >> /var/log/wg-auto.log 2>&1 &
```

```
sudo tee /etc/systemd/system/wg-go-auto.service <<EOF
[Unit]
Description=Auto-reload WireGuard config for wireguard-go
After=network.target docker.service
BindsTo=docker.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/wg-gen-web
ExecStart=/opt/wg-gen-web/watch-and-reload.sh
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
```

```
sudo systemctl daemon-reexec
sudo systemctl enable --now wg-go-auto.service
```

