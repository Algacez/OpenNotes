---
slug: miniopicgo
title: 搭建minio使用picgo作为图床
authors: [rock]
tags: [blog]
---

20250422是最后一个有控制台版本

喜欢商业化是吧😡

<!-- truncate -->

### docker

```
docker pull minio/minio:RELEASE.2025-04-22T22-12-26Z-cpuv1

chmod -R 777 ./data
```

```
version: '3.8'

services:
  minio:
    image: minio/minio:RELEASE.2025-04-22T22-12-26Z-cpuv1
    container_name: minio
    # 端口映射: 9000 是 API/S3 访问端口，9090 是 Console (Web UI) 访问端口
    ports:
      - "9000:9000"
      - "9090:9090"
    # 环境变量：设置根用户和密码
    environment:
      MINIO_ROOT_USER: admin
      MINIO_ROOT_PASSWORD: 
    # 卷挂载：使用当前目录下的 data 文件夹
    volumes:
      - ./data:/data
    # 容器启动命令
    command: server /data --console-address ":9090"
    # 后台运行
    restart: always
```

### picgo

新建桶

配置文件

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": [
                    "*"
                ]
            },
            "Action": [
                "s3:GetBucketLocation",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::picgo"
            ]
        },
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": [
                    "*"
                ]
            },
            "Action": [
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::picgo/*"
            ]
        }
    ]
}
```

或者在`Anonymous Access`设置

```
/

readonly
```

