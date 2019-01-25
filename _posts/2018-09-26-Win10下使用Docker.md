# win10下使用docker部署nginx，mysql
![20170714003942072.png](https://upload-images.jianshu.io/upload_images/6943526-0d9b38694e16a8d0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
###一、docker的步骤：
1.进入docker官网下载安装包
2.打开控制面板 - 程序和功能 - 启用或关闭Windows功能，勾选Hyper-V，然后点击确定即可，如图：
![1513668234-6433-20171206211858191-1177002365.png](http://upload-images.jianshu.io/upload_images/6943526-853edb1bd2023f9d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

3.重新启动电脑

4.启动Docker

 在桌面找到Docker for Windows快捷方式，双击启动即可！启动成功后托盘处会有一个小鲸鱼的图标。打开命令行输入命令：docker version可以查看当前docker版本号，如图：

![QQ图片20180228222655.png](http://upload-images.jianshu.io/upload_images/6943526-7b157752713f2108.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

 更换镜像源地址

![微信截图_20181115165945.png](https://upload-images.jianshu.io/upload_images/6943526-a74c2c8c33b6edaa.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![微信截图_20181115165952.png](https://upload-images.jianshu.io/upload_images/6943526-5296e99e1fbc4315.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![微信截图_20181115170437.png](https://upload-images.jianshu.io/upload_images/6943526-15e81ea6aca8e6ac.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![微信截图_20181115170448.png](https://upload-images.jianshu.io/upload_images/6943526-87e7e6b5389856a4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

中国官方镜像源地址为：[https://registry.docker-cn.com](https://registry.docker-cn.com/)

点击托盘处docker图标右键选择-Settings，然后修改如下：

![TIM图片20180301202438.png](http://upload-images.jianshu.io/upload_images/6943526-a99d62b623064e0c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

点击Apply后会重启Docker。

载入测试镜像测试

输入命名“docker run hello-world”可以加载测试镜像来测试。如图：

![QQ图片20180228223335.png](http://upload-images.jianshu.io/upload_images/6943526-95236fd55d4725b4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这样即表示安装成功了！

###二、docker常用指令：
```
docker ps //查看当前运行中的容器
docker ps -a //查看所有运行过的容器
docker inspect containerId(容器ID或容器名)//查看对应容器的具体配置信息
docker port containerId //查看对应容器端口映射
docker run --name containerName -it -p 80:80 -d // --name是为容器取一个别名，-p 80:80是端口映射，将宿主机的80端口映射到容器的80端口上，-d是指后台运行容器，即容器启动后不会停止，-it是-i 和-t的合并，以交互模式运行容器。
docker images //查看所有镜像
docker exec -it containerName /bin/bash //进入已启动的容器内，新启一个进程，执行命令。
docker stop containerName // 停止一个容器
docker start -i containerName //重启启动一个运行过的容器
docker rm containerName //移除一个容器
```
![20170714003422556.png](https://upload-images.jianshu.io/upload_images/6943526-5523226a501a1334.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

了解了上面指令之后，我们接下来进行nginx,mysql的环境配置
1.启动mysql实例：

```
docker run --name some-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 -d mysql:latest
```

2.查看是否正常启动

   docker ps 

   能看到some-mysql的实例说明启动成功

3.nginx配置
```
    docker pull nginx
    docker run --name web -it -p 80:80 -d nginx
    进入到容器里
    docker exec -it web /bin/bash 
    安装nginx
    apt-get install -y nginx  
     执行到这里安装完成,下面安装vim
     apt-get install -y vim (apt-get安装过程中可能会提示apt-get版本过低，此时只需apt-get update)
    创建一个静态页面
    mkdir -p /var/www/html
    cd /var/www/html
    vim index.html
    :wq 保存退出编辑
    whereis nginx  查看nginx
    ls /etc/nginx 目录下可以看到有个conf.d的文件夹，conf.d目录下有个default的文件
    vim /etc/nginx/conf.d/default
    将server root的路径换成我们刚才配置的路径
    :wq
    cd /
    nginx      （启动nginx）
```

![微信截图_20181115173217.png](https://upload-images.jianshu.io/upload_images/6943526-bbb4e34b6bfa58ff.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![微信截图_20181115173417.png](https://upload-images.jianshu.io/upload_images/6943526-804ddd74f88833a7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这时我们查看一下 
docker ps，会发现多了一个容器，就是我们刚才启动的nginx
最后直接使用localhost（默认80端口）访问即可，


![img](http://upload-images.jianshu.io/upload_images/6943526-4448a98ebee80dad?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

也可以使用 docker inspect web 找到ipaddress，使用容器的ip地址访问

![image](http://upload-images.jianshu.io/upload_images/6943526-6279b50d7d91b1ee?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


浏览器访问172.17.0.3即可

如果你的docker配置了默认的地址
![image](http://upload-images.jianshu.io/upload_images/6943526-3c5e06230234e879?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)




