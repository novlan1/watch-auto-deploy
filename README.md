## 监听文件并自动部署

主要是在服务器上工作，监听目标文件夹/目标文件，发生变化就自动执行部署命令。



`fs.watch`不可靠，即使只改动一次，也会触发好几次。所以这里用时间信息作为判断，如果修改时间/size等信息变化了，则说明文件有变化。



