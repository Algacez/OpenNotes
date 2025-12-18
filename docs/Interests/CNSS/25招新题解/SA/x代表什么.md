# 🤔 x代表什么

> **Nginx**（发音同“engine X”）是异步框架的网页服务器，也可以用作反向代理、负载平衡器和HTTP缓存.其特点是内存占有少，并发能力强，启动极快，在互联网项目中广泛应用

Fw190是一个刚刚接触的萌新,你能教教他怎么使用nginx吗:kissing_closed_eyes:

要完成这道题,你需要一台Linux操作系统的主机(使用虚拟机或者服务器都可以),以及一点点docker相关的知识(主要是要整个docker-compose)

## ⭐ 基本要求

- 在 Linux 系统上安装 Nginx 免费开源版（编译安装/包管理器安装），安装后在浏览器访问 Nginx 初始欢迎页面
- 了解 Nginx 常见使用命令，寻找你的 Nginx 配置文件路径
- Nginx 的欢迎页面太丑了，能不能换一个呢 ？请修改配置文件，让浏览器访问显示该[静态页面](https://recruit-1330121870.cos.ap-chengdu.myqcloud.com/site.zip)（[示例](https://fw190.top/site/)）
- 使用一个 Nginx 代理3个页面，不同的端口号访问到不同的页面（3个 HTML 页面的[文件链接](https://recruit-1330121870.cos.ap-chengdu.myqcloud.com/p1-3.zip))
- 实现 URL 转发： 当 URI 请求为 `/google` 时，跳转到[谷歌](https://www.google.com/)；当 URI 请求为 `/github` 时，跳转到 [GitHub](https://github.com/) ；当 URI 请求为`/cnss`或`/cnss/xxx` 时，`xxx` 是任意字符串，跳转到 [CNSS 招新官网](https://recruit.cnss.studio/) ；其余**任意**请求跳转到[该静态页面](https://cnss.studio)
- 搭建一个简易文件下载服务器，访问 `/downloads` 能够显示文件目录，[示例](https://fw190.top/downloads/))
- 实现一个简单的负载均衡器，当访问同一个 URL 时，按照流量比 1 : 2 : 3 分别访问到 3 个不同的页面（这里是3个页面的[文件链接](https://recruit-1330121870.cos.ap-chengdu.myqcloud.com/a1-3.zip)，建议使用 Docker/Docker-Compose 模拟多台服务器）
- 添加域名解析，安装 CA 证书实现 HTTPS 访问

## ❗拓展要求

- 实现高可用性(例如Keepalived)
- 你自己的奇思妙想


## 💡 Hint

- 这里能申请 [免费域名](https://www.freenom.com/zh/index.html?lang=zh) 和 [免费证书](https://freessl.cn/)
- 如果想要域名解析的话最好不要用内地服务器(需要备案),可以选择香港等地的服务器



---



apt安装
配置文件`/etc/nginx/sites-enabled/default`

## 欢迎页

```
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    root /var/www/cnss;

    index index.html;
}
```
## 代理页面

```
# 定义第一个服务器，监听 11451 端口
server {
    listen       11451;
    server_name  localhost;

    # 设置根目录
    root /var/www/cnss/port;

    # 访问 page1.html
    location / {
        try_files /page1.html =404;
    }
}

server {
    listen       11452;
    server_name  localhost;

    root /var/www/cnss/port;

    location / {
        try_files /page2.html =404;
    }
}

server {
    listen       11453;
    server_name  localhost;

    root /var/www/cnss/port;

    location / {
        try_files /page3.html =404;
    }
}
```
## URL转发
```
    location = /google {
        return 301 https://www.google.com/;
    }

    location = /github {
        return 301 https://github.com/;
    }

    # 当请求路径以 /cnss 开头时（/cnss 或 /cnss/xxx），重定向到 CNSS 招新官网
    location ~ ^/cnss(/.*)?$ {
        return 301 https://recruit.cnss.studio/;
    }

    #所有其他未匹配的请求，全部重定向到 https://cnss.studio/
    location / {
        return 301 https://cnss.studio/;
    }
```

## 下载

```
    location /downloads {
        autoindex on;
        autoindex_exact_size on;
        autoindex_localtime on;
    }
```

## 负载均衡

1. **Dockerfile**（后端容器，基于 Nginx 镜像）：
   
   ```dockerfile
   FROM nginx:alpine
   COPY . /usr/share/nginx/html
   ```
   
2. **nginx.conf**（负载均衡器配置，监听 11454 端口）：
   ```nginx
   events {}
   http {
       upstream backend {
           server backend1:80 weight=1;
           server backend2:80 weight=2;
           server backend3:80 weight=3;
       }
       server {
           listen 11454;  # 改为 11454 端口
           location / {
               proxy_pass http://backend;
               proxy_set_header Host $host;
               proxy_set_header X-Real-IP $remote_addr;
           }
       }
   }
   ```

3. **docker-compose.yml**（定义服务，映射主机 11454 端口）：
   ```yaml
   version: '3'
   services:
     loadbalancer:
       image: nginx:alpine
       ports:
         - "11454:11454"  # 主机端口 11454 映射到容器 11454
       volumes:
         - ./nginx.conf:/etc/nginx/nginx.conf:ro
       depends_on:
         - backend1
         - backend2
         - backend3
   
     backend1:
       build: .
       volumes:
         - /var/www/cnss/loadbalancing/app1:/usr/share/nginx/html:ro
   
     backend2:
       build: .
       volumes:
         - /var/www/cnss/loadbalancing/app2:/usr/share/nginx/html:ro
   
     backend3:
       build: .
       volumes:
         - /var/www/cnss/loadbalancing/app3:/usr/share/nginx/html:ro
   ```
   - `loadbalancer`：监听 11454 端口，挂载自定义 nginx.conf。
   - `backend1/2/3`：每个后端挂载对应的 app{1,2,3} 文件夹，包含 index.html。

### 运行：

```bash
docker-compose build
docker-compose up -d
```

```bash
docker-compose down
```

## SSL



---



```
server {
    server_name server0.282994.xyz;

    root /var/www/cnss;
    index index.html;

    location = /google {
        return 301 https://www.google.com/;
    }

    location = /github {
        return 301 https://github.com/;
    }

    location ~ ^/cnss(/.*)?$ {
        return 301 https://recruit.cnss.studio/;
    }

    location /downloads {
        autoindex on;
        autoindex_exact_size on;
        autoindex_localtime on;
    }

    location / {
        try_files $uri $uri/ @redirect;
    }

    location @redirect {
        return 301 https://cnss.studio$request_uri;
    }

    listen [::]:443 ssl ipv6only=on; 
    listen 443 ssl; 
    ssl_certificate /etc/letsencrypt/live/server0.282994.xyz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/server0.282994.xyz/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

```



```
##
# You should look at the following URL's in order to grasp a solid understanding
# of Nginx configuration files in order to fully unleash the power of Nginx.
# https://www.nginx.com/resources/wiki/start/
# https://www.nginx.com/resources/wiki/start/topics/tutorials/config_pitfalls/
# https://wiki.debian.org/Nginx/DirectoryStructure
#
# In most cases, administrators will remove this file from sites-enabled/ and
# leave it as reference inside of sites-available where it will continue to be
# updated by the nginx packaging team.
#
# This file will automatically load configuration files provided by other
# applications, such as Drupal or Wordpress. These applications will be made
# available underneath a path with that package name, such as /drupal8.
#
# Please see /usr/share/doc/nginx-doc/examples/ for more detailed examples.
##

# Default server configuration
#

server {
    listen 80 default_server;
    # 监听所有 IPv6 地址的 80 端口，并设为默认服务器
    listen [::]:80 default_server;

    # 处理所有流量，server_name 可以设为 _
    server_name server0.282994.xyz;

    # 网站根目录
    root /var/www/cnss;

    # 默认首页文件
    index index.html;

    location = /google {
        return 301 https://www.google.com/;
    }

    location = /github {
        return 301 https://github.com/;
    }

    # 当请求路径以 /cnss 开头时（/cnss 或 /cnss/xxx），重定向到 CNSS 招新官网
    location ~ ^/cnss(/.*)?$ {
        return 301 https://recruit.cnss.studio/;
    }

    # 精确匹配根路径 /
    location = / {
        root /var/www/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # 其他路径重定向到 https://cnss.studio/
    location / {
        return 301 https://cnss.studio/;
    }

    location /downloads {
        root /var/www/cnss;  # 文件实际位于 /var/www/cnss/downloads
        autoindex on;         # 启用目录列表，显示文件和文件夹
        autoindex_exact_size on;   # 显示文件的精确大小（如 1.2K）
        autoindex_localtime on;    # 使用本地时间显示文件修改时间
    }

}

# 定义第一个服务器，监听 11451 端口
server {
    listen       11451;
    server_name  localhost;

    # 设置根目录
    root /var/www/cnss/port;

    # 访问 page1.html
    location / {
        try_files /page1.html =404;
    }
}

# 定义第二个服务器，监听 11452 端口
server {
    listen       11452;
    server_name  localhost;

    # 设置根目录
    root /var/www/cnss/port;

    # 访问 page2.html
    location / {
        try_files /page2.html =404;
    }
}

# 定义第三个服务器，监听 11453 端口
server {
    listen       11453;
    server_name  localhost;

    # 设置根目录
    root /var/www/cnss/port;

    # 访问 page3.html
    location / {
        try_files /page3.html =404;
    }
}
# Virtual Host configuration for example.com
#
# You can move that to a different file under sites-available/ and symlink that
# to sites-enabled/ to enable it.
#
#server {
#	listen 80;
#	listen [::]:80;
#
#	server_name example.com;
#
#	root /var/www/example.com;
#	index index.html;
#
#	location / {
#		try_files $uri $uri/ =404;
#	}
#}

```
