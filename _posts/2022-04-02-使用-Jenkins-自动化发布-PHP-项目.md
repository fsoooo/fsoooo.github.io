## 什么是 Jenkins

[Jenkins](https://www.centos.bz/tag/jenkins/)是一个开源软件项目，是基于Java开发的一种持续集成工具，用于监控持续重复的工作，旨在提供一个开放易用的软件平台，使软件的持续集成变成可能。

## 方式一：使用 Docker 安装 Jenkins

避免装环境的折腾, 直接使用 [docker](https://www.centos.bz/tag/docker/)-[compose](https://www.centos.bz/tag/compose/) 安装，具体如何安装在 Docker 快速搭建 LNMP 环境 已经描述了
docker-compose.yml
```
jenkins:
  image: jenkins:latest
  ports:
    - "8080:8080"
  volumes:
      - ./jenkins:/var/jenkins_home:rw
```

注意：volumes 配置 jenkins 目录映射到本地

```
docker-compose up -d 
# 等待下载镜像，创建容器
Creating dnmp_jenkins_1    ... done
# 安装就这么简单
```

## 方式二：手动安装

以下所有操作都使用 root 用户进行操作。

在各项目官网，下载 Java、Tomcat、Jenkins
```
Java: [http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
Tomcat: [http://tomcat.apache.org/download-90.cgi](http://tomcat.apache.org/download-90.cgi)
Jenkins: [https://jenkins.io/](https://jenkins.io/)
```
所用环境: jdk1.8.0_121 tomcat-9.0.0.M17 jenkins 2.32.2
我把所用的 tar.gz 压缩包都放在 /opt/ 目录中，然后解压到 /usr/local/src 中。

**安装 Java**

解压后的 Java 包默认为 jdk1.8.0_121
配置 Java 环境变量 `vim /etc/profile`，在其中加入:

```
#java
JAVA_HOME=/usr/local/src/jdk1.8.0_121 #这行根据实际情况修改
PATH=$JAVA_HOME/bin:$PATH
CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
```
修改完成后使用 `source /etc/profile` 让新配置生效。
**安装 Tomcat**
解压后的 Tomcat 包默认为 apache-tomcat-9.0.0.M17
使用 `chmod a+x apache-tomcat-9.0.0.M17/bin/*.sh` 命令给予 Tomcat 启动关闭 shell 脚本可执行权限。
执行 `bin/catalina.sh run` 可以从控制台看到tomcat启动，以确保 Tomcat 可以正确启动。
要让 Tomcat 在后台运行使用 `bin/startup.sh`

**安装 Jenkins**
将 jenkins 的 .war 包放到 Tomcat 的 webapps 目录中，运行 `bin/startup.sh`
然后就可以通过 `http://<你的ip地址>/jenkins/` 访问安装完毕的 jenkins
然后按照页面指引完成最后的安装
## Jenkins 插件
```
- **Subversion/Git**：用于集成项目版本控制软件，根据需要选择
- **Phing/Ant**：使用Phing或Apache Ant 对PHP项目做自动化构建
- **CheckStyle**：使用PHP CodeSniffer进行代码风格检查的工具。用于检查PHP代码是否有违反一组预先设置好的编码标准的一个PEAR包，内置了ZEND,PEAR的编码风格规则
- **Clover PHP**：使用phpunit进行单元测试的工具，可以被xdebug扩展用来生成代码覆盖率报告，并且可以与phing集成来自动测试，还可以和Selenium整合来完成大型自动化集成测试
- **DRY**：使用PHPCPD(php copy paste detector)来发现项目中的重复代码
- **HTML Publisher**：用来发布phpunit代码覆盖率报告
- **JDepend**：使用PHP Depend分析php中静态代码，用来检查项目中的代码规模和复杂程度
- **Plot**：使用phploc来统计php项目规模大小的工具，可以统计php的项目代码行数
- **PMD**：使用phpmd(php mess dector),对基于pdepend的结果进行分析，一旦项目超过了pdepend中各具体指标的规定，将发出警告信息.
- **Violations**：按照代码缺陷严重性集中显示pwd静态代码分析的结果
- **xUnit**：使用JUnit的格式来输出phpunit的日志文件
```
## 访问 8080 端口，进入初始化页面
访问: http://localhost:8080/
首次打开，需要输入秘钥，根据提示，可以在对应的目录 /jenkins/secrets 找到该文件
设置登录用户名密码后，进入几分钟的初始化过程…
![img](http://upload-images.jianshu.io/upload_images/6943526-60e8210cae1a7b0f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 配置自动化构建发布
#### 配置远程服务器 SSH
菜单 -> 系统管理 -> 系统设置 -> SSH Servers
![img](http://upload-images.jianshu.io/upload_images/6943526-476aa4df39894c2f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

如图，是我配置的内容

![img](http://upload-images.jianshu.io/upload_images/6943526-b65d4d3f91a4ebff.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

Remote Directory 这个配置很关键，表示构建时的相对目录。这里我配置 “/“
配置完成后，最好 Test Configuration , 返回 Success 就表示成功！
### 新建发布项目
填写项目名称如, test
并选择项目类型，这里我选择”自由风格项目”
![img](http://upload-images.jianshu.io/upload_images/6943526-f4dc7323691d181e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### General
选择对应项目路径，我使用 [GitHub](https://www.centos.bz/tag/github/) project
![img](http://upload-images.jianshu.io/upload_images/6943526-dbc481a4e65e0edf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 源码管理
使用 git 源码仓库管理

![img](http://upload-images.jianshu.io/upload_images/6943526-6c04577742cb4600.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 构建
这里是最关键的，你可以打包源码发布到对应的服务器之上

![img](http://upload-images.jianshu.io/upload_images/6943526-5bf463b8813af3ee.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
```
- [Source](https://www.centos.bz/tag/source/) files 表示打包好的源文件
- Remote directory 表示你需要将源文件上传的远程路径（这个路径相对于 SSH 配置目录）
- Exec [command](https://www.centos.bz/tag/command/) 上传完成后，执行的命令（ hexo g 这个是我发布博客时的构建命令）
```
### 立即构建

选择对应的项目，点击立即构建

![img](http://upload-images.jianshu.io/upload_images/6943526-af4fa3f4e4209ab9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

在构建执行状态中，可以点击 console output 看到构建的过程信息

![img](http://upload-images.jianshu.io/upload_images/6943526-6a7b9f23114d55c4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### Jenkins 部署 PHP 步骤:代码拉取>>执行检查(非必须)>> 打包 >> 远程或本地部署

本文我们主要来说一下远程部署
远程部署首先拉取代码，我们使用 git 管理代码。
用 ssh-keygen 生成公钥和私钥，git 和 登录远程服务器都会用到。
git 仓库上每个项目都有一个部署公钥，将生成的公钥添加到 git 仓库。
然后创建一个自由风格的 jenkins 部署项目，进入配置。
**拉取代码**

[![file](http://upload-images.jianshu.io/upload_images/6943526-9d49612657a8c9d1.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)](https://iocaffcdn.phphub.org/uploads/images/201702/22/5227/khKB3C1y5V.jpg) 

选择 git ，默认会拉取仓库的 master 分支，点击 add 添加一个拉取代码的凭证。

[![file](http://upload-images.jianshu.io/upload_images/6943526-89274aa7cda91262.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
```
Kind 选 SSH Username with private key
Private key 选择 From the Jenkins master ~/.ssh (已经使用 ssh-keygen 生成公私钥)
```
创建完成后选择凭证，输入 git 仓库的地址，然后就可以保存后点击立即构建，测试代码能不能正确拉取，拉取正确后点击工作空间就可以看见你的代码库中的代码了。

**构建**

[![file](http://upload-images.jianshu.io/upload_images/6943526-d80ea37569afa06c.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)](https://iocaffcdn.phphub.org/uploads/images/201702/22/5227/FZH36CzDVA.jpg) 

默认有这些构建选项，本地构建简单使用 Execute shell 执行 shell 指令。
远程构建需要新安装一个插件，在 系统管理-管理插件-可选插件 中搜索 Publish Over SSH 插件并安装，重启 Jenkins 以启用插件。
将本机的公钥复制到远程服务器root用户的 /root/.ssh/authorized_keys 文件中。
然后在 系统管理-系统设置-Publish over SSH

[![file](http://upload-images.jianshu.io/upload_images/6943526-a4da9e988c899786.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)](https://iocaffcdn.phphub.org/uploads/images/201702/22/5227/WqJsbk5U2z.jpg) 

填入私钥文件地址

[![file](http://upload-images.jianshu.io/upload_images/6943526-c655b3e2f1314749.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)](https://iocaffcdn.phphub.org/uploads/images/201702/22/5227/IXF0oAGgKK.jpg) 

增加一个 ssh 服务器配置

[![file](http://upload-images.jianshu.io/upload_images/6943526-390c6f2261836dfa.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)](https://iocaffcdn.phphub.org/uploads/images/201702/22/5227/CqYOaCjwqR.jpg) 

构建中选择 Send files or execute commands over SSH

[![file](http://upload-images.jianshu.io/upload_images/6943526-5765f6ec9011689b.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)](https://iocaffcdn.phphub.org/uploads/images/201702/22/5227/aDGt9HW83T.jpg) 

简单点可以直接执行 shell 指令，到想要部署的项目目录用 git 直接拉取远程代码，但这样用 Jenkins 意义真的不是特别大，可以在本机将代码打包，然后传输到远程机器，再解压开到项目目录。

```
cd /var/www/web
tar -czf project_`date +%F-%H-%M-%S`.bak.tar.gz --exclude='project/runtime' --exclude='project/.git' /home/www/web/project
tar xzf /var/www/web/project-tar/project.${BUILD_NUMBER}.${BUILD_ID}.tar.gz -C /home/www/web/project
chmod -R 755 /home/www/web/project/
chmod 777 /home/www/web/project/web/assets/
tail -n100 /home/www/web/project/runtime/logs/error.log
```

以上是一个示例，进行了线上代码备份打包、解包新部署包，修改权限、打印错误日志一系列操作。
构建打包操作是使用的 Phing 这个工具，有兴趣可以去了解一下这个工具。
