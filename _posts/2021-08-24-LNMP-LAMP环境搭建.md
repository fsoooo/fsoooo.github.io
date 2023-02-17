## 名词解释：

LNMP：Linux+Nginx+MySql+PHP
LAMP：LInux+Apache+MySql+PHP

## 前置条件

1. 操作系统安装：CentOS 6.8 64位最小化安装。
2. 配置好IP、DNS、网关、主机名
3. 配置防火墙，开启80、3306端口

```shell
vim /etc/sysconfig/iptables
关闭访问墙
service iptables stop
/etc/init.d/iptables restart #最后重启防火墙使配置生效
```
4. 关闭SELinux
```
   vi /etc/selinux/configurations
   SELINUX=enforcing #注释掉
   SELINUXTYPE=targeted #注释掉
   SELINUX=disabled #增加
   :wq! #保存退出
   setenforce 0 #使配置立即生效
```
## 一.YUM安装
## 镜像源切换（把YUM源切换成国内的镜像源）


先备份一下原来的源镜像文件

``cp /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup``

下载新的CentOS-Base.repo
``wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo``

如果没有安装wget的话可以使用``yum install wget``安装完成之后，在执行CentOS-Base.repo的安装
对``/etc/yum.repos.d/CentOS-Media.repo``源文件配置文件，改为不生效

``enable=0``

YUM缓存生成
```
yum clean all
yum makecache
yum update
```
## 安装Nginx(最新版)


YUM源中没有Nginx，我们需要增加一个nginx的源nginx.repo

`` vi /etc/yum.repos.d/nginx.repo``

源文件的内容
```
 [nginx]
name=nginx repo
baseurl=[http://nginx.org/packages/centos/$releasever/$basearch/](https://link.jianshu.com/?t=http://nginx.org/packages/centos/%24releasever/%24basearch/)
gpgcheck=0
enabled=1
```
查看Nginx是否配置成功
``yum list nginx``

```
已加载插件：fastestmirror
nginx                                                                           | 2.9 kB  00:00:00     
nginx/7/x86_64/primary_db                                                       |  18 kB  00:00:04     
Loading mirror speeds from cached hostfile
 * base: mirrors.aliyun.com
 * extras: mirrors.aliyun.com
 * updates: mirrors.aliyun.com
可安装的软件包
nginx.x86_64                                  1:1.10.2-1.el7.ngx                                  nginx

```

``#yum list |grep nginx``

```
nginx.x86_64                               1:1.10.2-1.el7.ngx          nginx    
nginx-debug.x86_64                         1:1.8.0-1.el7.ngx           nginx    
nginx-debuginfo.x86_64                     1:1.10.2-1.el7.ngx          nginx    
nginx-module-geoip.x86_64                  1:1.10.2-1.el7.ngx          nginx    
nginx-module-geoip-debuginfo.x86_64        1:1.10.2-1.el7.ngx          nginx    
nginx-module-image-filter.x86_64           1:1.10.2-1.el7.ngx          nginx    
nginx-module-image-filter-debuginfo.x86_64 1:1.10.2-1.el7.ngx          nginx    
nginx-module-njs.x86_64                    1:1.10.2.0.0.20160414.1c50334fbea6-2.el7.ngx
                                                                       nginx    
nginx-module-njs-debuginfo.x86_64          1:1.10.2.0.0.20160414.1c50334fbea6-2.el7.ngx
                                                                       nginx    
nginx-module-perl.x86_64                   1:1.10.2-1.el7.ngx          nginx    
nginx-module-perl-debuginfo.x86_64         1:1.10.2-1.el7.ngx          nginx    
nginx-module-xslt.x86_64                   1:1.10.2-1.el7.ngx          nginx    
nginx-module-xslt-debuginfo.x86_64         1:1.10.2-1.el7.ngx          nginx    
nginx-nr-agent.noarch                      2.0.0-10.el7.ngx            nginx    
pcp-pmda-nginx.x86_64                      3.10.6-2.el7                base 

```

安装成功后，就可以直接安装nginx了

``yum -y install nginx``

安装的就是Nginx官网的最新版本

``nginx #启动Nginx``

可以使用curl命令查看是否安装成功

``curl 127.0.0.1``

如果安装成功的话，就会看到输出一个HTML的一个反馈

```
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>
<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>
<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

开机启动设置

```
systemctl enable nginx
systemctl daemon-reload
```
查看nginx状态

``ps -ef | grep nginx``



## 安装MySql（5.7）
官网：[http://dev.mysql.com/downloads/repo/yum/](https://link.jianshu.com/?t=http://dev.mysql.com/downloads/repo/yum/)
``rpm -Uvh http://dev.mysql.com/get/mysql57-community-release-el7-9.noarch.rpm``
查看5.7版本是否已经启用
``yum repolist all | grep mysql``
```
mysql-connectors-community/x86_64 MySQL Connectors Community         启用:    24
mysql-connectors-community-source MySQL Connectors Community - Sourc 禁用
mysql-tools-community/x86_64      MySQL Tools Community              启用:    38
mysql-tools-community-source      MySQL Tools Community - Source     禁用
mysql-tools-preview/x86_64        MySQL Tools Preview                禁用
mysql-tools-preview-source        MySQL Tools Preview - Source       禁用
mysql55-community/x86_64          MySQL 5.5 Community Server         禁用
mysql55-community-source          MySQL 5.5 Community Server - Sourc 禁用
mysql56-community/x86_64          MySQL 5.6 Community Server         禁用
mysql56-community-source          MySQL 5.6 Community Server - Sourc 禁用
mysql57-community/x86_64          MySQL 5.7 Community Server         启用:   146
mysql57-community-source          MySQL 5.7 Community Server - Sourc 禁用
mysql80-community/x86_64          MySQL 8.0 Community Server         禁用
mysql80-community-source          MySQL 8.0 Community Server - Sourc 禁用
```
如果没有启用的话，我们可以修改源文件

``etc/yum.repos.d/mysql-community.repo``

```
[mysql57-community]
name=MySQL 5.7 Community Server
baseurl=http://repo.mysql.com/yum/mysql-5.7-community/el/7/$basearch/
enabled=1
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql

```

把enabled改为1就可以了，其他的版本改为0

```
[mysql-connectors-community]
name=MySQL Connectors Community
baseurl=http://repo.mysql.com/yum/mysql-connectors-community/el/7/$basearch/
enabled=1
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql

[mysql-tools-community]
name=MySQL Tools Community
baseurl=http://repo.mysql.com/yum/mysql-tools-community/el/7/$basearch/
enabled=1
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql

# Enable to use MySQL 5.5
[mysql55-community]
name=MySQL 5.5 Community Server
baseurl=http://repo.mysql.com/yum/mysql-5.5-community/el/7/$basearch/
enabled=0
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql

# Enable to use MySQL 5.6
[mysql56-community]
name=MySQL 5.6 Community Server
baseurl=http://repo.mysql.com/yum/mysql-5.6-community/el/7/$basearch/
enabled=0
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql

[mysql57-community]
name=MySQL 5.7 Community Server
baseurl=http://repo.mysql.com/yum/mysql-5.7-community/el/7/$basearch/
enabled=1
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql

[mysql80-community]
name=MySQL 8.0 Community Server
baseurl=http://repo.mysql.com/yum/mysql-8.0-community/el/7/$basearch/
enabled=0
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql

[mysql-tools-preview]
name=MySQL Tools Preview
baseurl=http://repo.mysql.com/yum/mysql-tools-preview/el/7/$basearch/
enabled=0
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql

```

修改完成之后查看可用的版本

``yum repolist enabled | grep mysql``

```
mysql-connectors-community/x86_64 MySQL Connectors Community                  24
mysql-tools-community/x86_64      MySQL Tools Community                       38
mysql57-community/x86_64          MySQL 5.7 Community Server                 146

```

如果看到5.7版本启用了之后就可以安装MySql了

``yum -y install mysql-community-server``

安装完成之后，就可以启动mysql了

``service mysqld start``

查看MySql的启动状态

``service mysqld status``

```
Redirecting to /bin/systemctl status  mysqld.service
● mysqld.service - MySQL Server
   Loaded: loaded (/usr/lib/systemd/system/mysqld.service; enabled; vendor preset: disabled)
   Active: active (running) since 日 2017-05-23 22:51:48 CST; 3min 14s ago
  Process: 36884 ExecStart=/usr/sbin/mysqld --daemonize --pid-file=/var/run/mysqld/mysqld.pid $MYSQLD_OPTS (code=exited, status=0/SUCCESS)
  Process: 36810 ExecStartPre=/usr/bin/mysqld_pre_systemd (code=exited, status=0/SUCCESS)
 Main PID: 36887 (mysqld)
   CGroup: /system.slice/mysqld.service
           └─36887 /usr/sbin/mysqld --daemonize --pid-file=/var/run/mysqld/mysqld.pid

5月 23 22:51:45 192.168.0.14 systemd[1]: Starting MySQL Server...
5月 23 22:51:48 192.168.0.14 systemd[1]: Started MySQL Server.
5月 23 22:52:24 192.168.0.14 systemd[1]: Started MySQL Server.

```

开机启动设置

```
systemctl enable mysqld
systemctl daemon-reload
```
MySql安装完成之后会在LOG文件(/var/log/mysqld.log)中生成一个root的默认密码
``grep 'temporary password' /var/log/mysqld.log``
```
2017-05-23T14:51:45.705458Z 1 [Note] A temporary password is generated for root@localhost: d&sqr7dcf7P_
```

登录MySql并修改root密码

```
mysql -uroot -p
mysql>ALTER USER 'root'@'localhost' IDENTIFIED BY 'new psd';
```

扩展阅读：mysql的密码策略
```
  mysql>show variables like '%password%';
```
```
+---------------------------------------+--------+
| Variable_name                         | Value  |
+---------------------------------------+--------+
| default_password_lifetime             | 0      |
| disconnect_on_expired_password        | ON     |
| log_builtin_as_identified_by_password | OFF    |
| mysql_native_password_proxy_users     | OFF    |
| old_passwords                         | 0      |
| report_password                       |        |
| sha256_password_proxy_users           | OFF    |
| validate_password_check_user_name     | OFF    |
| validate_password_dictionary_file     |        |
| validate_password_length              | 8      |
| validate_password_mixed_case_count    | 1      |
| validate_password_number_count        | 1      |
| validate_password_policy              | MEDIUM |
| validate_password_special_char_count  | 1      |
+---------------------------------------+--------+
14 rows in set (0.01 sec)

```
默认的密码策略
```
validate_password_policy：密码策略，默认为MEDIUM策略 
validate_password_dictionary_file：密码策略文件，策略为STRONG才需要 
validate_password_length：密码最少长度 
validate_password_mixed_case_count：大小写字符长度，至少1个 
validate_password_number_count ：数字至少1个 
validate_password_special_char_count：特殊字符至少1个 
```

修改密码策略
在/etc/my.cnf文件添加validate_password_policy配置：
```
# 选择0（LOW），1（MEDIUM），2（STRONG）其中一种，选择2需要提供密码字典文件
validate_password_policy=0
```

修改默认编码
在/etc/my.cnf配置文件的[mysqld]下添加编码配置：

```
[mysqld]
character_set_server=utf8
init_connect='SET NAMES utf8'
```

重启mysql，是修改生效

``systemctl restart mysqld``

远程登录用户添加
```
mysql> GRANT ALL PRIVILEGES ON *.* TO 'lmc'@'%' IDENTIFIED BY '1qazXsw@' WITH GRANT OPTION;
mysql> FLUSH PRIVILEGES;
```
查看用户

`` mysql> select host,user from mysql.user;``

```
+-----------+-----------+
| host      | user      |
+-----------+-----------+
| %         | lmc       |
| localhost | mysql.sys |
| localhost | root      |
+-----------+-----------+
3 rows in set (0.00 sec)

```
## 安装PHP7
------
> \#rpm -Uvh [https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm](https://link.jianshu.com/?t=https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm)
> \#rpm -Uvh [https://mirror.webtatic.com/yum/el7/webtatic-release.rpm](https://link.jianshu.com/?t=https://mirror.webtatic.com/yum/el7/webtatic-release.rpm)

安装PHP7

> \#yum install php70w.x86_64 php70w-cli.x86_64 php70w-common.x86_64 php70w-gd.x86_64 php70w-ldap.x86_64 php70w-mbstring.x86_64 php70w-mcrypt.x86_64 php70w-mysql.x86_64 php70w-pdo.x86_64

安装php-fpm

``yum install php70w-fpm php70w-opcache``

启动php-fpm

``systemctl start php-fpm``

开机启动设置

```
systemctl enable php-fpm
systemctl daemon-reload
```

修改根目录
修改 /etc/nginx/conf.d/default.conf

```
location ~ \.php$ {
        root           /usr/share/nginx/html;
        fastcgi_pass   127.0.0.1:9000;
        fastcgi_index  index.php;
        fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
        include        fastcgi_params;
    }
```
重启Nginx使修改生效
经过NMP这三部的安装后，至此LNMP的搭建就完成了！

## 二.编译安装

## 系统约定
```shell
软件源代码包存放位置：/root/lnmp
源码包编译安装位置：/usr/local/软件名
数据库数据文件存储路径/data/mysql
```
## 安装编译工具及库文件

```shell
使用CentOS yum命令一键安装
yum install -y make apr* autoconf automake curl curl-devel gcc gcc-c++  cmake  gtk+-devel zlib-devel openssl openssl-devel pcre-devel gd kernel keyutils patch perl kernel-headers compat* cpp glibc libgomp libstdc++-devel keyutils-libs-devel  libarchive   libsepol-devel libselinux-devel krb5-devel libXpm* freetype freetype-devel freetype* fontconfig fontconfig-devel libjpeg* libpng* php-common php-gd gettext gettext-devel ncurses* libtool* libxml2 libxml2-devel patch policycoreutils bison
```
## 软件安装篇

```shell
1、安装cmake
tar -zxvf cmake-2.8.7.tar.gz
cd cmake-2.8.7
./configure --prefix=/usr/local/cmake
make #编译
make install #安装
vim /etc/profile 在path路径中增加cmake执行文件路径
export PATH=$PATH:/usr/local/cmake/bin
source /etc/profile使配置立即生效
```


```shell
2、安装pcre
tar -zxvf pcre-8.39.tar.gz
cd pcre-8.39
./configure --prefix=/usr/local/pcre 
make && make install

3、安装libmcrypt
tar -zxvf libmcrypt-2.5.8.tar.gz
cd libmcrypt-2.5.8
./configure #配置
make #编译
make install #安装

4、安装gd库
tar -zxvf gd-2.0.36RC1.tar.gz
cd gd-2.0.36RC1
./configure --enable-m4_pattern_allow --prefix=/usr/local/gd --with-jpeg=/usr/lib --with-png=/usr/lib --with-xpm=/usr/lib --with-freetype=/usr/lib --with-fontconfig=/usr/lib 
make #编译
make install #安装

5、安装Mysql
groupadd mysql #添加mysql组
useradd -g mysql mysql -s /sbin/nologin #创建用户mysql并加入到mysql组，不允许mysql用户直接登录系统
mkdir -p /var/mysql/data #创建MySQL数据库存放目录
chown -R mysql:mysql /var/mysql/data #设置MySQL数据库目录权限

tar -zxvf mysql-5.5.28.tar.gz #解压
```


```shell
cd mysql-5.5.28
cmake -DCMAKE_INSTALL_PREFIX=/usr/local/mysql \
-DMYSQL_UNIX_ADDR=/usr/local/mysql/mysql.sock \
-DDEFAULT_CHARSET=utf8 \
-DDEFAULT_COLLATION=utf8_general_ci \
-DWITH_MYISAM_STORAGE_ENGINE=1 \
-DWITH_INNOBASE_STORAGE_ENGINE=1 \
-DWITH_MEMORY_STORAGE_ENGINE=1 \
-DWITH_READLINE=1 -DENABLED_LOCAL_INFILE=1 \
-DMYSQL_DATADIR=/var/mysql/data \
-DMYSQL_USER=mysql -DMYSQL_TCP_PORT=3306

cmake -DCMAKE_INSTALL_PREFIX=/usr/local/mysql -DMYSQL_UNIX_ADDR=/usr/local/mysql/mysql.sock -DDEFAULT_CHARSET=utf8 -DDEFAULT_COLLATION=utf8_general_ci -DWITH_MYISAM_STORAGE_ENGINE=1 -DWITH_INNOBASE_STORAGE_ENGINE=1 -DWITH_MEMORY_STORAGE_ENGINE=1 -DWITH_READLINE=1 -DENABLED_LOCAL_INFILE=1 -DMYSQL_DATADIR=/var/mysql/data -DMYSQL_USER=mysql -DMYSQL_TCP_PORT=3306

make
make install

cp ./support-files/my-huge.cnf /etc/my.cnf #拷贝配置文件（注意：如果/etc目录下面默认有一个my.cnf，直接覆盖即可）

vi /etc/my.cnf #编辑配置文件,在 [mysqld] 部分增加
  #添加MySQL数据库路径
cd /usr/local/mysql
./scripts/mysql_install_db --user=mysql #生成mysql系统数据库
cd /root/lnmp/mysql-5.5.28
cp ./support-files/mysql.server /etc/rc.d/init.d/mysqld #把Mysql加入系统启动
chmod 755 /etc/init.d/mysqld #增加执行权限
chkconfig mysqld on #加入开机启动
vi /etc/rc.d/init.d/mysqld #编辑
basedir=/usr/local/mysql #MySQL程序安装路径
datadir=/var/mysql/data #MySQl数据库存放目录
service mysqld start #启动,可能无法写入pid文件，注意将mysql用户权限加入至/usr/local/mysql
chown -R mysql:mysql /usr/local/mysql

vi /etc/profile #把mysql服务加入系统环境变量：在最后添加下面这一行
export PATH=$PATH:/usr/local/cmake/bin:/usr/local/mysql/bin
source /etc/profile #使配置立即生效

mkdir /var/lib/mysql #创建目录
ln -s /tmp/mysql.sock /var/lib/mysql/mysql.sock #添加软链接
mysql_secure_installation #设置Mysql密码，根据提示按Y 回车输入2次密码
/usr/local/mysql/bin/mysqladmin -u root -p password "123456" #或者直接修改密码
到此，mysql安装完成！
```


```shell
6、安装 nginx
tar -zxvf nginx-1.11.5.tar.gz
groupadd www #添加www组
useradd -g www www -s /sbin/nologin #创建nginx运行账户www并加入到www组，不允许www用户直接登录系统
openssl-1.1.0b.tar.gz
cd nginx-1.11.5
./configure --prefix=/usr/local/nginx --without-http_memcached_module --user=www --group=www   --with-http_stub_status_module --with-openssl=/lnmp/src/openssl-1.1.0b --with-pcre=/lnmp/src/pcre-8.39   --with-http_ssl_module 
注意:--with-pcre=/lnmp/src/pcre-8.39指向的是源码包解压的路径，而不是安装的路径，否则会报错
```


```shell
make
make install
/usr/local/nginx/sbin/nginx #启动nginx
设置nginx开启启动
vi /etc/rc.d/init.d/nginx #编辑启动文件添加下面内容
=======================================================
#!/bin/bash
# nginx Startup script for the Nginx HTTP Server
# it is v.0.0.2 version.
# chkconfig: - 85 15
# description: Nginx is a high-performance web and proxy server.
# It has a lot of features, but it's not for everyone.
# processname: nginx
# pidfile: /var/run/nginx.pid
# config: /usr/local/nginx/conf/nginx.conf
nginxd=/usr/local/nginx/sbin/nginx
nginx_config=/usr/local/nginx/conf/nginx.conf
nginx_pid=/usr/local/nginx/logs/nginx.pid
RETVAL=0
prog="nginx"
# Source function library.
. /etc/rc.d/init.d/functions
# Source networking configuration.
. /etc/sysconfig/network
# Check that networking is up.
[ ${NETWORKING} = "no" ] && exit 0
[ -x $nginxd ] || exit 0
# Start nginx daemons functions.
start() {
if [ -e $nginx_pid ];then
echo "nginx already running...."
exit 1
fi
echo -n $"Starting $prog: "
daemon $nginxd -c ${nginx_config}
RETVAL=$?
echo
[ $RETVAL = 0 ] && touch /var/lock/subsys/nginx
return $RETVAL
}
# Stop nginxc daemons functions.
stop() {
echo -n $"Stopping $prog: "
killproc $nginxd
RETVAL=$?
echo
[ $RETVAL = 0 ] && rm -f /var/lock/subsys/nginx /usr/local/nginx/logs/nginx.pid
}
reload() {
echo -n $"Reloading $prog: "
#kill -HUP `cat ${nginx_pid}`
killproc $nginxd -HUP
RETVAL=$?
echo
}
# See how we were called.
case "$1" in
start)
start
;;
stop)
stop
;;
reload)
reload
;;
restart)
stop
start
;;
status)
status $prog
RETVAL=$?
;;
*)
echo $"Usage: $prog {start|stop|restart|reload|status|help}"
exit 1
esac
exit $RETVAL
=======================================================
:wq! #保存退出
chmod 775 /etc/rc.d/init.d/nginx #赋予文件执行权限
chkconfig nginx on #设置开机启动
/etc/rc.d/init.d/nginx restart #重新启动Nginx
service nginx restart
=======================================================
```


```shell
7、安装php
cd /lnmp/src
tar -jxvf php-7.0.7.tar.bz2	
cd php-7.0.7
./configure --prefix=/usr/local/php7 --with-config-file-path=/usr/local/php7/etc  --with-mysqli=/usr/local/mysql/bin/mysql_config --enable-mysqlnd --with-mysql-sock=/usr/local/mysql/mysql.sock --with-gd --with-iconv --with-zlib --enable-xml --enable-bcmath --enable-shmop --enable-sysvsem --enable-inline-optimization --enable-mbregex --enable-fpm --enable-mbstring --enable-ftp --enable-gd-native-ttf --with-openssl --enable-pcntl --enable-sockets --with-xmlrpc --enable-zip --enable-soap --without-pear --with-gettext --enable-session --with-mcrypt --with-curl --with-jpeg-dir --with-freetype-dir --with-pdo-mysql=/usr/local/mysql/ –-disable-fileinfo --with-iconv=/usr/local/

make #编译,，若遇到make: *** [ext/fileinfo/libmagic/apprentice.lo] 错误 ，这加参数–-disable-fileinfo
make install #安装

cd /root/lnmp/php-7.0.7
cp php.ini-production /usr/local/php7/etc/php.ini #复制php配置文件到安装目录
rm -rf /etc/php.ini #删除系统自带配置文件
ln -s /usr/local/php7/etc/php.ini /etc/php.ini #添加软链接
```


```shell
cp sapi/fpm/init.d.php-fpm /etc/init.d/php-fpm
cp /usr/local/php7/etc/php-fpm.conf.default /usr/local/php7/etc/php-fpm.conf #拷贝模板文件为php-fpm配置文件
cp /usr/local/php7/etc/php-fpm.d/www.conf.default /usr/local/php7/etc/php-fpm.d/www.conf  

vi /usr/local/php7/etc/php-fpm.d/www.conf  #编辑

user = www #设置php-fpm运行账号为www
group = www #设置php-fpm运行组为www

vim /usr/local/php7/etc/php-fpm.conf
pid = run/php-fpm.pid #取消前面的分号

加入服务并开机启动 ，设置 php-fpm开机启动
#cp /lnmp/src/php-7.0.7/sapi/fpm/init.d.php-fpm /etc/rc.d/init.d/php-fpm #拷贝php-fpm到启动目录
chmod +x /etc/rc.d/init.d/php-fpm #添加执行权限
chkconfig php-fpm on #设置开机启动

vi /usr/local/php7/etc/php.ini #编辑配置文件
```


```shell
这里暂时不给禁用
找到：disable_functions =
修改为：disable_functions = passthru,exec,system,chroot,scandir,chgrp,chown,shell_exec,proc_open,proc_get_status,ini_alter,ini_alter,ini_restore,dl,openlog,syslog,readlink,symlink,popepassthru,stream_socket_server,escapeshellcmd,dll,popen,disk_free_space,checkdnsrr,checkdnsrr,getservbyname,getservbyport,disk_total_space,posix_ctermid,posix_get_last_error,posix_getcwd, posix_getegid,posix_geteuid,posix_getgid, posix_getgrgid,posix_getgrnam,posix_getgroups,posix_getlogin,posix_getpgid,posix_getpgrp,posix_getpid, posix_getppid,posix_getpwnam,posix_getpwuid, posix_getrlimit, posix_getsid,posix_getuid,posix_isatty, posix_kill,posix_mkfifo,posix_setegid,posix_seteuid,posix_setgid,posix_setpgid,posix_setsid,posix_setuid,posix_strerror,posix_times,posix_ttyname,posix_uname
```

列出PHP可以禁用的函数，如果某些程序需要用到这个函数，可以删除，取消s禁用

	找到：;date.timezone =
	修改为：date.timezone = PRC #设置时区
	找到：expose_php = On
	修改为：expose_php = OFF #禁止显示php版本的信息
	找到：short_open_tag = Off
	修改为：short_open_tag = ON #支持php短标签
	
	<?= ?>
	
	八、配置nginx支持php
	vi /usr/local/nginx/conf/nginx.conf
	修改/usr/local/nginx/conf/nginx.conf 配置文件,需做如下修改


```shelle
	user www www; #首行user去掉注释,修改Nginx运行组为www www；必须与/usr/local/php/etc/php-fpm.conf中的user,group配置相同，否则php运行出错
	user www www;
	worker_processes 1;
	events {
	worker_connections 1024;
	}
	http {
		include mime.types;
		default_type application/octet-stream;
		sendfile on;
		keepalive_timeout 65;
		server {
			listen 80;
			server_name localhost;
				location / {
				root /data/www;
				index index.php index.html index.htm;
				}
				location ~ \.php$ {
				root /data/www;
				fastcgi_pass 127.0.0.1:9000;
				fastcgi_index index.php;
				fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
				include fastcgi_params;
				}
		}
	}

	mkdir -p /data/www
	chown www:www /data/www/ -R #设置目录所有者
	chmod 700 /data/www -R #设置目录权限
```

```shell
服务器相关操作命令
service nginx restart #重启nginx
service mysqld restart #重启mysql
/usr/local/php/sbin/php-fpm #启动php-fpm
/etc/rc.d/init.d/php-fpm restart #重启php-fpm
/etc/rc.d/init.d/php-fpm stop #停止php-fpm
/etc/rc.d/init.d/php-fpm start #启动php-fpm
```

