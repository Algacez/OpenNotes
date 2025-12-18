# 🔒 整个VPN?

相信现在你已经能够科学的使用网络了,你现在的解决方案是代理（proxy）还是私有局域网（VPN），这两者有什么区别和优势

## ⭐ 基本要求

- 搭建一个你自己的VPN服务

- 你的梯子应当满足一定的安全要求

- 请不要购买现成的服务!!!

## ❗拓展要求

- 异地组网

## 💡 Hint

- 本题仅为学习和研究服务器运行维护、计算机网络相关知识和技能而设置



---



## openVPN
```
wget https://raw.githubusercontent.com/Nyr/openvpn-install/master/openvpn-install.sh -O openvpn-install.sh
chmod +x openvpn-install.sh
bash openvpn-install.sh
```
https://openvpn.net/client/

## proxy
 `VLESS+reality+uTLS+Vision`😋
```
wget -P /root -N --no-check-certificate "https://raw.githubusercontent.com/mack-a/v2ray-agent/master/install.sh" && chmod 700 /root/install.sh && /root/install.sh
```
