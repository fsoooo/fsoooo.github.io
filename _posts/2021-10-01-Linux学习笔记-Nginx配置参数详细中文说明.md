```
# Nginx配置参数中文详细说明：

#定义Nginx运行的用户和用户组
user www www;
#
#nginx进程数,建议设置为等于CPU总核心数.
worker_processes 8;
#
#全局错误日志定义类型,[ debug | info | notice | warn | error | crit ]
error_log /var/log/nginx/error.log info;
#
#进程文件
pid /var/run/nginx.pid;
#
#一个nginx进程打开的最多文件描述符数目,理论值应该是最多打开文件数（系统的值ulimit -n）与nginx进程数相除,但是nginx分配请求并不均匀,所以建议与ulimit -n的值保持一致.
worker_rlimit_nofile 65535;
#
#工作模式与连接数上限
events {
    #参考事件模型,use [ kqueue | rtsig | epoll | /dev/poll | select | poll ]; epoll模型是Linux 2.6以上版本内核中的高性能网络I/O模型,如果跑在FreeBSD上面,就用kqueue模型.
    use epoll;
    #单个进程最大连接数（最大连接数=连接数*进程数）
    worker_connections 65535;
}
#
#设定http服务器
http {
    include mime.types; #文件扩展名与文件类型映射表
    default_type application/octet-stream; #默认文件类型
    #charset utf-8; #默认编码
    server_names_hash_bucket_size 128; #服务器名字的hash表大小
    client_header_buffer_size 32k; #上传文件大小限制
    large_client_header_buffers 4 64k; #设定请求缓
    client_max_body_size 8m; #设定请求缓
    
    # 开启目录列表访问,合适下载服务器,默认关闭.
    autoindex on; # 显示目录
    autoindex_exact_size on; # 显示文件大小 默认为on,显示出文件的确切大小,单位是bytes 改为off后,显示出文件的大概大小,单位是kB或者MB或者GB
    autoindex_localtime on; # 显示文件时间 默认为off,显示的文件时间为GMT时间 改为on后,显示的文件时间为文件的服务器时间
    
    sendfile on; # 开启高效文件传输模式,sendfile指令指定nginx是否调用sendfile函数来输出文件,对于普通应用设为 on,如果用来进行下载等应用磁盘IO重负载应用,可设置为off,以平衡磁盘与网络I/O处理速度,降低系统的负载.注意：如果图片显示不正常把这个改成off.
    tcp_nopush on; # 防止网络阻塞
    tcp_nodelay on; # 防止网络阻塞
    
    keepalive_timeout 120; # (单位s)设置客户端连接保持活动的超时时间,在超过这个时间后服务器会关闭该链接
    
    # FastCGI相关参数是为了改善网站的性能：减少资源占用,提高访问速度.下面参数看字面意思都能理解.
    fastcgi_connect_timeout 300;
    fastcgi_send_timeout 300;
    fastcgi_read_timeout 300;
    fastcgi_buffer_size 64k;
    fastcgi_buffers 4 64k;
    fastcgi_busy_buffers_size 128k;
    fastcgi_temp_file_write_size 128k;
    
    # gzip模块设置
    gzip on; #开启gzip压缩输出
    gzip_min_length 1k; #允许压缩的页面的最小字节数,页面字节数从header偷得content-length中获取.默认是0,不管页面多大都进行压缩.建议设置成大于1k的字节数,小于1k可能会越压越大
    gzip_buffers 4 16k; #表示申请4个单位为16k的内存作为压缩结果流缓存,默认值是申请与原始数据大小相同的内存空间来存储gzip压缩结果
    gzip_http_version 1.1; #压缩版本（默认1.1,目前大部分浏览器已经支持gzip解压.前端如果是squid2.5请使用1.0）
    gzip_comp_level 2; #压缩等级.1压缩比最小,处理速度快.9压缩比最大,比较消耗cpu资源,处理速度最慢,但是因为压缩比最大,所以包最小,传输速度快
    gzip_types text/plain application/x-javascript text/css application/xml;
    #压缩类型,默认就已经包含text/html,所以下面就不用再写了,写上去也不会有问题,但是会有一个warn.
    gzip_vary on;#选项可以让前端的缓存服务器缓存经过gzip压缩的页面.例如:用squid缓存经过nginx压缩的数据
    
    #开启限制IP连接数的时候需要使用
    #limit_zone crawler $binary_remote_addr 10m;
    
    ##upstream的负载均衡,四种调度算法(下例主讲)##
    
    #虚拟主机的配置
    server {
        # 监听端口
        listen 80;
        # 域名可以有多个,用空格隔开
        server_name ably.com;
        # HTTP 自动跳转 HTTPS
        rewrite ^(.*) https://$server_name$1 permanent;
    }
    
    server {
        # 监听端口 HTTPS
        listen 443 ssl;
        server_name ably.com;
        
        # 配置域名证书
        ssl_certificate      C:\WebServer\Certs\certificate.crt;
        ssl_certificate_key  C:\WebServer\Certs\private.key;
        ssl_session_cache    shared:SSL:1m;
        ssl_session_timeout  5m;
        ssl_protocols SSLv2 SSLv3 TLSv1;
        ssl_ciphers ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP;
        ssl_prefer_server_ciphers  on;
    
        index index.html index.htm index.php;
        root /data/www/;
        location ~ .*\.(php|php5)?$ {
            fastcgi_pass 127.0.0.1:9000;
            fastcgi_index index.php;
            include fastcgi.conf;
        }
        
        # 配置地址拦截转发，解决跨域验证问题
        location /oauth/{
            proxy_pass https://localhost:13580/oauth/;
            proxy_set_header HOST $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
        
        # 图片缓存时间设置
        location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$ {
            expires 10d;
        }
        
        # JS和CSS缓存时间设置
        location ~ .*\.(js|css)?$ {
            expires 1h;
        }

        # 日志格式设定
        log_format access '$remote_addr - $remote_user [$time_local] "$request" '
        '$status $body_bytes_sent "$http_referer" '
        '"$http_user_agent" $http_x_forwarded_for';
        # 定义本虚拟主机的访问日志
        access_log /var/log/nginx/access.log access;
        
        # 设定查看Nginx状态的地址.StubStatus模块能够获取Nginx自上次启动以来的工作状态，此模块非核心模块，需要在Nginx编译安装时手工指定才能使用
        location /NginxStatus {
            stub_status on;
            access_log on;
            auth_basic "NginxStatus";
            auth_basic_user_file conf/htpasswd;
            #htpasswd文件的内容可以用apache提供的htpasswd工具来产生.
        }
    }
}
```

## Nginx多台服务器实现负载均衡：

1.Nginx负载均衡服务器：

```
1.Nginx负载均衡服务器：
IP：192.168.0.4（Nginx-Server）

2.Web服务器列表：
Web1:192.168.0.5（Nginx-Node1/Nginx-Web1） ；Web2:192.168.0.7（Nginx-Node2/Nginx-Web2）

3.实现目的：用户访问Nginx-Server（"http://xxx.com"）时，通过Nginx负载均衡到Web1和Web2服务器

```
Nginx负载均衡服务器的`nginx.conf`配置注释如下：

```
events {
    use epoll;
    worker_connections 65535;
}
http {
    ##upstream的负载均衡,四种调度算法##
    #调度算法1:轮询.每个请求按时间顺序逐一分配到不同的后端服务器,如果后端某台服务器宕机,故障系统被自动剔除,使用户访问不受影响
    upstream webhost {
        server 192.168.0.5:6666 ;
        server 192.168.0.7:6666 ;
    }
    #调度算法2:weight(权重).可以根据机器配置定义权重.权重越高被分配到的几率越大
    upstream webhost {
        server 192.168.0.5:6666 weight=2;
        server 192.168.0.7:6666 weight=3;
    }
    #调度算法3:ip_hash. 每个请求按访问IP的hash结果分配,这样来自同一个IP的访客固定访问一个后端服务器,有效解决了动态网页存在的session共享问题
    upstream webhost {
        ip_hash;
        server 192.168.0.5:6666 ;
        server 192.168.0.7:6666 ;
    }
    #调度算法4:url_hash(需安装第三方插件).此方法按访问url的hash结果来分配请求,使每个url定向到同一个后端服务器,可以进一步提高后端缓存服务器的效率.Nginx本身是不支持url_hash的,如果需要使用这种调度算法,必须安装Nginx 的hash软件包
    upstream webhost {
        server 192.168.0.5:6666 ;
        server 192.168.0.7:6666 ;
        hash $request_uri;
    }
    #调度算法5:fair(需安装第三方插件).这是比上面两个更加智能的负载均衡算法.此种算法可以依据页面大小和加载时间长短智能地进行负载均衡,也就是根据后端服务器的响应时间来分配请求,响应时间短的优先分配.Nginx本身是不支持fair的,如果需要使用这种调度算法,必须下载Nginx的upstream_fair模块
    #
    #虚拟主机的配置(采用调度算法3:ip_hash)
    server {
        listen 80;
        server_name xxx.com;
        #对 "/" 启用反向代理
        location / {
            proxy_pass http://webhost;
            proxy_redirect off;
            proxy_set_header X-Real-IP $remote_addr;
            #后端的Web服务器可以通过X-Forwarded-For获取用户真实IP
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            #以下是一些反向代理的配置,可选.
            proxy_set_header Host $host;
            client_max_body_size 10m; #允许客户端请求的最大单文件字节数
            client_body_buffer_size 128k; #缓冲区代理缓冲用户端请求的最大字节数,
            proxy_connect_timeout 90; #nginx跟后端服务器连接超时时间(代理连接超时)
            proxy_send_timeout 90; #后端服务器数据回传时间(代理发送超时)
            proxy_read_timeout 90; #连接成功后,后端服务器响应时间(代理接收超时)
            proxy_buffer_size 4k; #设置代理服务器（nginx）保存用户头信息的缓冲区大小
            proxy_buffers 4 32k; #proxy_buffers缓冲区,网页平均在32k以下的设置
            proxy_busy_buffers_size 64k; #高负荷下缓冲大小（proxy_buffers*2）
            proxy_temp_file_write_size 64k;
            #设定缓存文件夹大小,大于这个值,将从upstream服务器传
        }
    }
}
```
负载均衡操作演示如下：

```
操作对象：192.168.0.4（Nginx-Server）
# 创建文件夹准备存放配置文件
$ mkdir -p /opt/confs
$ vim /opt/confs/nginx.conf

# 编辑内容如下：
events {
  use epoll;
  worker_connections 65535;
}

http {
    upstream webhost {
        ip_hash;
        server 192.168.0.5:6666 ;
        server 192.168.0.7:6666 ;
    }
    
    server {
        listen 80;
        server_name xxx.com;
        location / {
            proxy_pass http://webhost;
            proxy_redirect off;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header Host $host;
            client_max_body_size 10m;
            client_body_buffer_size 128k;
            proxy_connect_timeout 90;
            proxy_send_timeout 90;
            proxy_read_timeout 90;
            proxy_buffer_size 4k;
            proxy_buffers 4 32k;
            proxy_busy_buffers_size 64k;
            proxy_temp_file_write_size 64k;
        }
    }
}
# 然后保存并退出

# 启动负载均衡服务器192.168.0.4（Nginx-Server）
docker run -d -p 8888:80 --name nginx-server -v /opt/confs/nginx.conf:/etc/nginx/nginx.conf --restart always nginx
```

```
操作对象：192.168.0.5（Nginx-Node1/Nginx-Web1）

# 创建文件夹用于存放web页面
$ mkdir -p /opt/html
$ vim /opt/html/index.html

# 编辑内容如下：
<div>
  <h1>
    The host is 192.168.0.5(Docker02) - Node 1!
  </h1>
</div>
# 然后保存并退出

# 启动192.168.0.5（Nginx-Node1/Nginx-Web1）
$ docker run -d -p 6666:80 --name nginx-node1 -v /opt/html:/usr/share/nginx/html --restart always nginx
```


```
操作对象：192.168.0.7（Nginx-Node2/Nginx-Web2）

# 创建文件夹用于存放web页面
$ mkdir -p /opt/html
$ vim /opt/html/index.html

# 编辑内容如下：
<div>
  <h1>
    The host is 192.168.0.7(Docker03) - Node 2!
  </h1>
</div>
# 然后保存并退出

# 启动192.168.0.7（Nginx-Node2/Nginx-Web2）
$ docker run -d -p 6666:80 --name nginx-node2 -v $(pwd)/html:/usr/share/nginx/html --restart always nginx
```

测试：
```
域名:xxx.com，这里是用Windows系统主机访问服务器，要在当前主机的hosts中添加解析 “xxx.com 192.168.0.4”，hosts文件所在的路径为 “C:\Windows\System32\drivers\etc”。

这里在Windows主机上通过浏览器访问 “http://xxx.com” 这个站点的时候，Nginx会根据来访的主机的ip_hash值，负载均衡到192.168.0.5（Nginx-Node1/Nginx-Web1）和192.168.0.7（Nginx-Node2/Nginx-Web2）服务器上。

如果其中一个Web服务器无效后，负载均衡服务器会自动将请求转发到正常的Web服务器。
```
下图是另外做的一组demo的访问效果图，而且容器的端口和IP不同（所有信息都做了相应修改）：

```
1.Nginx-Server：192.168.2.129（Docker01）；
2.Nginx-Node1：192.168.2.56（Docker02）；
3.Nginx-Node2：192.168.2.77（Docker03）；
```
![](https://upload-images.jianshu.io/upload_images/6943526-4371eca575dd04c2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](https://upload-images.jianshu.io/upload_images/6943526-58a90654f728b97b.gif?imageMogr2/auto-orient/strip)


##Nginx 简介以及特点

Nginx (engine x) 是一个高性能的 Web 服务器和反向代理服务器，也是一个 IMAP/POP3/SMTP 服务器：

*   它由俄罗斯程序员 Igor Sysoev 于 2002 年开始开发。

*   Nginx 是增长最快的 Web 服务器，市场份额已达 33.3％。

*   全球使用量排名第二，2011 年成立商业公司。

Nginx 社区分支：

*   **Openresty：**作者 @agentzh（章宜春）开发的，最大特点是引入了 ngx_lua 模块，支持使用 Lua 开发插件，并且集合了很多丰富的模块，以及 Lua 库。

*   **Tengine：**主要是淘宝团队开发。特点是融入了因淘宝自身的一些业务带来的新功能。

*   **Nginx 官方版本，**更新迭代比较快，并且提供免费版本和商业版本。

Nginx 源码结构（代码量大约 11 万行 C 代码）：

*   **源代码目录结构 Core（主干和基础设置）**

*   **Event（事件驱动模型和不同的 IO 复用模块）**

*   **HTTP（HTTP 服务器和模块）**

*   **Mail（邮件代理服务器和模块）**

*   **OS（操作系统相关的实现）**

*   **Misc（杂项）**

Nginx 特点如下：

*   **反向代理，负载均衡器**

*   **高可靠性、单 Master 多 Worker 模式**

*   **高可扩展性、高度模块化**

*   **非阻塞**

*   **事件驱动**

*   **低内存消耗**

*   **热部署**

Nginx 应用场景

Nginx 的应用场景如下：

*   **静态文件服务器**

*   **反向代理，负载均衡**

*   **安全防御**

*   **智能路由（企业级灰度测试、地图 POI 一键切流）**

*   **灰度发布**

*   **静态化**

*   **消息推送**

*   **图片实时压缩**

*   **防盗链**

Nginx 框架模型介绍

进程组件角色：

*   **Master 进程：**监视工作进程的状态；当工作进程死掉后重启一个新的；处理信号和通知工作进程。

*   **Worker 进程：**处理客户端请求，从主进程处获得信号做相应的事情。

*   **Cache Loader 进程：**加载缓存索引文件信息，然后退出。

*   **Cache Manager进程：**管理磁盘的缓存大小，超过预定值大小后最少使用数据将被删除。

Nginx 的框架模型如下图：

![](https://upload-images.jianshu.io/upload_images/6943526-d412fcd4edc22348?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

框架模型流程如下图：

![](https://upload-images.jianshu.io/upload_images/6943526-61929a9c6cccbccf?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

Nginx 内部流程介绍

## Nginx 框架模型流程如下图：

![](https://upload-images.jianshu.io/upload_images/6943526-f326f62222c6d6d7?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](https://upload-images.jianshu.io/upload_images/6943526-41925c230e533a4d?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## Master 初始化流程，如下图：

![](https://upload-images.jianshu.io/upload_images/6943526-6bc3e17f450f0e0d?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## Worker 初始化：

![](https://upload-images.jianshu.io/upload_images/6943526-bcab9a87397db461?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## Worker 初始化流程图如下：

![](https://upload-images.jianshu.io/upload_images/6943526-d046f8def6112a43?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 静态文件请求 IO 流程如下图：

![](https://upload-images.jianshu.io/upload_images/6943526-249464aecb9b37b7?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## HTTP 请求流程如下图：

![](https://upload-images.jianshu.io/upload_images/6943526-59dac497973efbea?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## HTTP 请求 11 个阶段，如下图所示：

![](https://upload-images.jianshu.io/upload_images/6943526-9ad4fbd392e2df83?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## upstream模块：

*   **访问第三方 Server 服务器**

*   **底层 HTTP 通信非常完善**

*   **异步非阻塞**

*   **上下游内存零拷贝，节省内存**

*   **支持自定义模块开发**

### upstream 框架流程，如下图：

![](https://upload-images.jianshu.io/upload_images/6943526-0de1793c71a5bdcd?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### upstream 内部流程，如下图：

![](https://upload-images.jianshu.io/upload_images/6943526-33416fae0a8ae18c?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 反向代理流程，如下图：

![](https://upload-images.jianshu.io/upload_images/6943526-010cdf40cd5ec1e0?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

Nginx 定制化模块开发

## Nginx 的模块化设计特点如下：

*   高度抽象的模块接口

*   模块接口非常简单，具有很高的灵活性

*   配置模块的设计

*   核心模块接口的简单化

*   多层次、多类别的模块设计

## 内部核心模块：

![](https://upload-images.jianshu.io/upload_images/6943526-f58a578707a63c9a?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](https://upload-images.jianshu.io/upload_images/6943526-e5cec48af53c2adb?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## **Handler 模块：**接受来自客户端的请求并构建响应头和响应体。

![](https://upload-images.jianshu.io/upload_images/6943526-f2031005a456f7c9?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## **Filter 模块：**过滤（filter）模块是过滤响应头和内容的模块，可以对回复的头和内容进行处理。它的处理时间在获取回复内容之后，向用户发送响应之前。

![](https://upload-images.jianshu.io/upload_images/6943526-d4c3931d14f4ec89?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## **Upstream 模块：**使 Nginx 跨越单机的限制，完成网络数据的接收、处理和转发，纯异步的访问后端服务。

![](https://upload-images.jianshu.io/upload_images/6943526-6568fb4207993cf9?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**Load_Balance：**负载均衡模块，实现特定的算法，在众多的后端服务器中，选择一个服务器出来作为某个请求的转发服务器。

![](https://upload-images.jianshu.io/upload_images/6943526-45d6cb172e5eb3a5?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## ngx_lua 模块：

*   **脚本语言**

*   **内存开销小**

*   **运行速度快**

*   **强大的 Lua 协程**

*   **非阻塞**

*   **业务逻辑以自然逻辑书写**

![](https://upload-images.jianshu.io/upload_images/6943526-dcb003dcc98ea557?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## **定制化开发 Demo**

Handler 模块：

*   **编写 config 文件**

*   **编写模块产生内容响应信息**

```
#配置文件：server {    ...        location test {        test_counter on;    }}#configngx_addon_name=ngx_http_test_moduleHTTP_MODULES="$HTTP_MODULES ngx_http_test_module"NGX_ADDON_SRCS="$NGX_ADDON_SRCS $ngx_addon_dir/ngx_http_test_module.c"#ngx_http_test_module.cstatic ngx_int_tngx_http_test_handler(ngx_http_request_t *r){    ngx_int_t                               rc;    ngx_buf_t                               *b;    ngx_chain_t                             out;    ngx_http_test_conf_t                    *lrcf;    ngx_str_t                               ngx_test_string = ngx_string("hello test");    lrcf = ngx_http_get_module_loc_conf(r, ngx_http_test_module);    if ( lrcf->test_counter == 0 ) {        return NGX_DECLINED;    }    /* we response to 'GET' and 'HEAD' requests only */    if ( !(r->method & (NGX_HTTP_GET|NGX_HTTP_HEAD)) ) {            return NGX_HTTP_NOT_ALLOWED;    }    /* discard request body, since we don't need it here */    rc = ngx_http_discard_request_body(r);    if ( rc != NGX_OK ) {        return rc;    }    /* set the 'Content-type' header */    /*     *r->headers_out.content_type.len = sizeof("text/html") - 1;     *r->headers_out.content_type.data = (u_char *)"text/html";    */    ngx_str_set(&r->headers_out.content_type, "text/html");    /* send the header only, if the request type is http 'HEAD' */    if ( r->method == NGX_HTTP_HEAD ) {        r->headers_out.status = NGX_HTTP_OK;        r->headers_out.content_length_n = ngx_test_string.len;        return ngx_http_send_header(r);    }    /* set the status line */    r->headers_out.status = NGX_HTTP_OK;    r->headers_out.content_length_n =  ngx_test_string.len;    /* send the headers of your response */    rc = ngx_http_send_header(r);    if ( rc == NGX_ERROR || rc > NGX_OK || r->header_only ) {        return rc;    }    /* allocate a buffer for your response body */    b = ngx_pcalloc(r->pool, sizeof(ngx_buf_t));    if ( b == NULL ) {        return NGX_HTTP_INTERNAL_SERVER_ERROR;    }    /* attach this buffer to the buffer chain */    out.buf = b;    out.next = NULL;    /* adjust the pointers of the buffer */    b->pos = ngx_test_string.data;    b->last = ngx_test_string.data + ngx_test_string.len;    b->memory = 1;    /* this buffer is in memory */    b->last_buf = 1;  /* this is the last buffer in the buffer chain */    /* send the buffer chain of your response */    return ngx_http_output_filter(r, &out);}
```

Nginx 核心时间点模块介绍

解决接入层故障定位慢的问题，帮助 OP 快速判定问题根因，优先自证清白，提高接入层高效的生产力。

![](https://upload-images.jianshu.io/upload_images/6943526-1008301d28ecf027?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

Nginx 分流模块介绍

Nginx 分流模块特点如下： 

*   **实现非常灵活的动态的修改策略从而进行切流量。**

*   **实现平滑无损的方式进行流量的切换。**

*   **通过秒级切换流量可以缩小影响范围，从而减少损失。**

*   **按照某一城市或者某个特征，秒级进行切换流量或者禁用流量。**

*   **容忍单机房级别容量故障，缩短了单机房故障的止损时间。**

*   **快速的将流量隔离或者流量抽样。**

*   **高效的灰度测试，提高生产力。**

![](https://upload-images.jianshu.io/upload_images/6943526-a4874fe723ae4df3?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

Nginx 动态 upstream 模块介绍

让接入层可以适配动态调度的云环境，实现服务的平滑上下线、弹性扩/缩容。

从而提高接入层高效的生产力以及稳定性，保证业务流量的平滑无损。

![](https://upload-images.jianshu.io/upload_images/6943526-ccfaec03f291c4cf?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

Nginx query_upstream 模块介绍

链路追踪，梳理接口到后端链路的情况。查询 location 接口对应 upstream server 信息。![](https://upload-images.jianshu.io/upload_images/6943526-6e518522a9d4c378?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

Nginx query_conf 模块介绍

获取 Nginx 配置文件格式化为 json 格式信息：![](https://upload-images.jianshu.io/upload_images/6943526-15c486aea0069ef3?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

Nginx 共享内存支持 Redis 协议模块介绍

根据配置文件来动态的添加共享内存：

```
https://github.com/lidaohang/ngx_shm_dict 
```

**ngx_shm_dict：**共享内存核心模块（红黑树，队列）**ngx_shm_dict_manager：**添加定时器事件，定时的清除共享内存中过期的 Key，添加读事件，支持 Redis 协议，通过 redis-cli get，set，del，ttl**ngx_shm_dict_view：**共享内存查看![](https://upload-images.jianshu.io/upload_images/6943526-980753c0c5a25ee4?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

Nginx 日志回放压测工具

解析日志进行回放压测，模拟后端服务器慢等各种异常情况 ： 

```
https://github.com/lidaohang/playback-testing
```

#### 方案说明：

*   客户端解析 access.log 构建请求的 host，port，url，body。

*   把后端响应时间，后端响应状态码，后端响应大小放入 header 头中。

*   后端服务器获取相应的 header，进行模拟响应 body 大小，响应状态码，响应时间。

#### 使用方式：

*   拷贝需要测试的 access.log 的日志到 logs 文件夹里面。

*   搭建需要测试的 Nginx 服务器，并且配置 upstream 指向后端服务器断端口

*   启动后端服务器实例 

```
server/backserver/main.go
```

*   进行压测

```
bin/wrk -c30 -t1 -s conf/nginx_log.lua http://localhost:8095
```
