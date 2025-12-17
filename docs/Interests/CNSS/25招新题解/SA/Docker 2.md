# :whale:Docker 2

请你完成这个[项目]('https://github.com/ZHOUGONG24/memo')的搭建

## ⭐ 基本要求

- 编写一个DockerFile，建立一个backend容器放代码主体
- 编写一个docker-compose.yml，要求一键建立容器网络，包含backend容器和一个mysql容器并可以使项目正常运行
- 用nginx为已有的backend进程进行反向代理,再把项目里面那个前段界面整出来
- 修改代码，写一个报错日志，并用数据卷的方法挂在容器外面

## ❗拓展要求

- 想办法让我可以在公网摸到你的项目进行访问，实现方法不做限制
- 采取CI/CD的方式自动更新
- 更新不中断服务(讲解你的实现思路,能有具体的实现就更好了)

## 💡 Hint

- 在一个空无一物的容器里面显然没有办法跑一个项目,所以通常需要你有一个requirements.txt
- 自动更新的方法有很多,github action或者用脚本等实现方式都可以
