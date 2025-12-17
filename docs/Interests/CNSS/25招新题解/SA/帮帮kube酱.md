# ⎈帮帮kube酱

在成功部署了nginx之后,kube酱想要再尝试些别的东西,部署一个WordPress 博客系统,你能帮帮她吗?

## ⭐ 基本要求

- 部署一个完整的WordPress网站,他应该包含一个WordPress前端和一个MySQL数据库后端两个部分

## ❗拓展要求

- 部署MySQL的时候,能不能不在yaml里面硬编码MySQL的root密码呢?

## 💡 Hint

- 用PVC来持久化存储数据
- 确保你的集群中有一个可用的 StorageClass,可以用`kubectl get sc`来查看
