# ⎈k8s? k8s!

> **Kubernetes**（常简称为**K8s**）是用于自动部署、扩展和管理“容器化（containerized）应用程序”的开源系统。它旨在提供“跨主机集群的自动部署、扩展以及运行应用程序容器的平台”。它支持一系列容器工具，包括Docker等。

CNSS娘是一个萌新,她想尝试在Kubernetes上部署她的第一个应用,你能帮帮她吗

之前CNSS娘已经在 Linux 系统上安装了Nginx ,她想知道能不能在集群内部署一个nginx,应该怎么做呢?

要完成这道题,你需要一个可以正常工作的k8s集群(可以使用minikube或者kind在本地快速搭建一个)

## ⭐ 基本要求

- 部署一个 Nginx Web 服务器，并通过浏览器访问它

- 提交运行截图以及相关的yaml文件


## ❗拓展要求

- 能不能把默认的欢迎界面换成我们在nginx中使用的[这个](https://recruit-1330121870.cos.ap-chengdu.myqcloud.com/site.zip)欢迎界面呢:thinking:

## 💡 Hint

- 什么是Deployment和Service呢
- 试试ConfigMap?



---



# k8s? k8s!

## 安装 Kubernetes 本地环境

### Minikube

```
sudo apt-get update
sudo apt-get install -y curl apt-transport-https virtualbox virtualbox-ext-pack
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

## 启动

```
minikube start --driver=docker
```

### 注意！

而 `minikube --driver=docker` 默认不允许 root 使用。😭

```
minikube start --driver=docker --force
```

```
kubectl get nodes
```

## 部署

`nginx-deployment.yaml`

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:latest
        ports:
        - containerPort: 80
        volumeMounts:
        - name: nginx-index
          mountPath: /usr/share/nginx/html/index.html
          subPath: index.html
      volumes:
      - name: nginx-index
        configMap:
          name: nginx-index
```

```
kubectl create configmap nginx-index --from-file=/usr/k8s/index.html
```

`nginx-service.yaml`

```
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  type: LoadBalancer  
  selector:
    app: nginx
  ports:
    - port: 80          
      targetPort: 80   
      nodePort: 0       
```

```
kubectl apply -f nginx-deployment.yaml
kubectl apply -f nginx-service.yaml
```

## 访问

```
minikube service nginx-service --url
```

```
nohup kubectl port-forward service/nginx-service 11455:80 > /usr/k8s/portforward.log 2>&1 &
```
