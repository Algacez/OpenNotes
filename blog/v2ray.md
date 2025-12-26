---
slug: v2ray
title: v2ray搭建
authors: [rock]
tags: [tutorial]
---

**声明：本教程仅供连接国内服务器使用！**

<!-- truncate -->

主播装了两个小时v2raya还是没装上😡

把过程放最后了

## 还是换v2ray

```
bash <(curl -L https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-release.sh)
```

```
systemctl enable v2ray
systemctl start v2ray
```

`/usr/local/etc/v2ray/config.json`

从v2ray Windows客户端导入

![image-20251217222351813](./assets/image-20251217222351813.png)





---

## v2raya

wget https://bgithub.xyz/v2rayA/v2rayA/releases/download/v2.2.7.4/installer_debian_arm64_2.2.7.4.deb

```
sudo apt install /path/download/installer_debian_xxx_vxxx.deb ### 自行替换 deb 包所在的实际路径
```

启动 v2rayA / 设置 v2rayA 自动启动

> 从 1.5 版开始将不再默认为用户启动 v2rayA 及设置开机自动。

- 启动 v2rayA

  ```bash
  sudo systemctl start v2raya.service
  ```

- 设置开机自动启动

  ```bash
  sudo systemctl enable v2raya.service
  ```

默认端口2017

---

检测到 geosite.dat, geoip.dat 文件或 v2ray-core 可能未正确安装，请检查

切换到 root 账号
`su root`
下载缺失文件

```
cd /etc/v2raya/
wget https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geoip.dat
wget https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geosite.dat
```

安装 V2Ray-Core。注意：**修改为你自己的架构，以下为 ARM 64 版本**

```
mkdir v2ray
cd v2ray
wget https://github.com/v2fly/v2ray-core/releases/download/v5.25.1/v2ray-linux-arm64-v8a.zip
unzip v2ray-linux-*
mv v2ray /usr/bin/
```

配置 V2RayA
编辑 `/etc/v2raya/config.json`，添加以下内容：

```
{
  "v2ray_path": "/usr/bin/v2ray"
}
```

保存，重启 v2raya
`systemctl restart v2raya`

---

报错

```
[io.go:431] Failed to start: main/commands: failed to load config: [/etc/v2raya/config.json] > infra/conf/rule: invalid field rule > infra/conf/rule: failed to parse domain rule: ext:LoyalsoldierSite.dat:geolocation-!cn > infra/conf/rule: failed to load external geosite: geolocation-!cn from LoyalsoldierSite.dat > proto: cannot parse invalid wire-format data
2025/12/17 21:34:06.702 [W] [asm_arm64.s:1268] v2ray-core: exit status 1
2025/12/17 21:34:06.780 [E] [connection.go:88] failed to start v2ray-core: unexpected exiting: check the log for more information
```
