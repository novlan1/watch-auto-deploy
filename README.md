# 监听文件并自动部署

主要是在服务器上工作，监听目标文件夹/目标文件，发生变化就自动执行部署命令。

## 注意点

1. `fs.watch`不可靠，即使只改动一次，也会触发好几次。所以这里用时间信息作为判断，如果修改时间/size等信息变化了，则说明文件有变化。
2. fs.existsSync 判断文件/文件夹是否存在



## Getting Started

部署本项目前，需要将服务器密码写在根目录下的server.pwd中，这个文件不会上传到Git中。比如：

```
hostName=xxxx
hostPwd=xxxx
```

- npm instll
  安装依赖
- npm run dev
  开发环境启动项目
- npm run start
  正式环境启动项目
- npm run deploy
  部署本项目


## 特征

- 支持多个监听目录
- 支持多个服务器，变量控制

## 核心原理

1. 解压，`tar -zxvf ${sourceFile} -C ${targetDir}`
2. 如果是后端项目，会执行`pm2 start`。


