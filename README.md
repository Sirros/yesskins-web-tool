# yesskins

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

进入服务器

项目在 /root/yesskins/front-end/中
使用 serve 启动前端项目
在 dist 目录下 使用 
```
nohup serve -p 7777 &
``` 
指定端口号启动项目
不加 & 在 ctrl+c 后就会结束
加了之后会运行在服务器后台


进入 /usr/sbin 有个nginx 
./nginx -s reload 重启nginx服务


进入项目 dist 文件夹  jobs -l 查看 nohup 的运行情况



阿里云部署：https://blog.csdn.net/qq_44785351/article/details/127786615
nginx命令 
检查 sudo nginx -t
重启 sudo service nginx restart
