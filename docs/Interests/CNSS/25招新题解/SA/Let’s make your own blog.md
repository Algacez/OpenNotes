# 🌐 Let's make your own blog

我们知道nginx是一个网页服务器,如果你完成了`x代表什么`这一道题,相信你一定对nginx非常熟悉了,当然了即使没有完成也不影响你完成这一道题目
怎么你们的博客都那么好看,给俺也整一个

## ⭐ 基本要求

- 做一个博客，并用**你自己的**服务器提供静态页面(不同于前面CI Blog的静态页面,本题不可以使用github page或者cloudflare page等)

- 不得使用宝塔面板等一键工具！！！

## ❗拓展要求

- 请给你的博客加上 https，并配置可信证书,在`x代表什么`这道题目中配置过了的可以忽略
- 如果你完成了`x代表什么`,为什么不试试换成用apache作为静态web服务端玩玩呢

## 💡 Hint

- 博客的模版有很多,选自己喜欢的就行了
- 静态web服务端有很多种,想玩apache也可以,不做强制要求



---



## Apache

```
sudo apt update
sudo apt install apache2 -y
sudo a2enmod ssl rewrite headers
```
本地构建
```bash
npm run build
```
得到dist
压缩后上传
`/etc/apache2/ports.conf`
```
Listen 11457
```
`/etc/apache2/sites-available/blog.conf`
```
<VirtualHost *:11457>
    ServerName server0.282994.xyz
    ServerAlias www.server0.282994.xyz

    DocumentRoot /var/www/dist

    <Directory /var/www/dist>
        Options FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/blog_error.log
    CustomLog ${APACHE_LOG_DIR}/blog_access.log combined

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/server0.282994.xyz/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/server0.282994.xyz/privkey.pem
</VirtualHost>
```

```
sudo a2ensite blog.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
```

## nginx

在 `/etc/nginx/sites-available/ 新建配置文件：

```
server {
    listen 11456;
    listen [::]:11456;

    server_name _;

    root /var/www/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(?:ico|css|js|gif|jpe?g|png|woff2?|eot|ttf|svg|mp4)$ {
        expires 6M;
        access_log off;
        add_header Cache-Control "public";
    }
}
```

```
sudo ln -s /etc/nginx/sites-available/astro-blog /etc/nginx/sites-enabled/
```

```
sudo nginx -t
sudo systemctl reload nginx
```
