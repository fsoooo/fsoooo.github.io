## **负载均衡**
负载均衡，英文名称为Load Balance，其意思就是分摊到多个操作单元上进行执行，例如Web服务器、FTP服务器、企业关键应用服务器和其它关键任务服务器等，从而共同完成工作任务。
负载均衡 建立在现有网络结构之上，它提供了一种廉价有效透明的方法扩展网络设备和服务器的带宽、增加吞吐量、加强网络数据处理能力、提高网络的灵活性和可用性。
## **架构图**

![image](http://upload-images.jianshu.io/upload_images/6943526-367344bd08d7f19a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## **负载均衡策略**

Nginx 提供轮询（round robin）、IP 哈希（client IP）和加权轮询 3 种方式，默认情况下，Nginx 采用的是轮询。

### 轮询（默认）

每个请求按时间顺序逐一分配到不同的后端服务器，如果后端服务器down掉，能自动剔除。

```
upstream backserver { 
    server 192.168.1.14; 
    server 192.168.1.15;
 } 
```

加权轮询

指定轮询几率，weight和访问比率成正比，用于后端服务器性能不均的情况。

```
upstream backserver { 
    server 192.168.1.14 weight=1;
    server 192.168.1.15 weight=2; 
} 
```

### ip_hash

每个请求按访问ip的hash结果分配，这样每个访客固定访问一个后端服务器，可以解决session的问题。

```
upstream backserver { 
    ip_hash; 
    server 192.168.0.14;
    server 192.168.0.15; 
} 
```

###fair（第三方） 
按后端服务器的响应时间来分配请求，响应时间短的优先分配。
```
upstream backserver {
    server server1;
    server server2;
    fair;
}
```
###url_hash
按访问url的hash结果来分配请求，使每个url定向到同一个后端服务器，后端服务器为缓存时比较有效。
```
upstream backserver {
    server squid1:3128;
    server squid2:3128;
    hash $request_uri;
    hash_method crc32;
}
```
## 重试策略

可以为每个 backserver 指定最大的重试次数，和重试时间间隔,所使用的关键字是 max*fails 和 fail*timeout。

```
upstream backserver { 
server 192.168.1.14  weight=1  max_fails=2 fail_timeout=30s; 
server 192.168.1.15  weight=2  max_fails=2 fail_timeout=30s;
} 
```

失败重试次数为3，且超时时间为30秒。

### 热机策略

```
upstream backserver {
 server 192.168.1.14  weight=1  max_fails=2 fail_timeout=30s;
 server 192.168.1.15  weight=2  max_fails=2 fail_timeout=30s;
server 192.168.1.16 backup;
}
```

当所有的非备机（non-backup）都宕机（down）或者繁忙（busy）的时候，就会使用由 backup 标注的备机。必须要注意的是，backup 不能和 ip_hash 关键字一起使用。

###注意
```
1.down 表示单前的server暂时不参与负载 
2.weight 默认为1.weight越大，负载的权重就越大。 
3.max_fails：允许请求失败的次数默认为1.当超过最大次数时，返回proxy_next_upstream模块定义的错误 
4.fail_timeout:max_fails次失败后，暂停的时间。 
5.backup： 其它所有的非backup机器down或者忙的时候，请求backup机器。所以这台机器压力会最轻。
```
###Nginx负载配置实例
nginx负载均衡配置,主要是**proxy_pass,upstream**的使用，在http段做如下配置，即可实现两个域名
 ```
upstream  www.linuxidc.com  
{
    server   10.0.1.50:8080;
    server   10.0.1.51:8080;
}
 
upstream  blog.linuxidc.com   
{
    server   10.0.1.50:8080;
    server   10.0.1.51:8080;
}
 
server
{
    listen  80;
    server_name  www.linuxidc.com;
 
    location / {
        proxy_pass        http://www.linuxidc.com;
        proxy_set_header   Host             $host;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
    }
}
 
server
{
    listen  80;
    server_name  blog.linuxidc.com wode.linuxidc.com;
 
    location / {
        proxy_pass        http://www.linuxidc.com;
        proxy_set_header   Host             $host;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
    }
}
```
###Nginx负载均衡的优缺点
**优点**
```
1、工作在网络的7层之上，可以针对http应用做一些分流的策略，比如针对域名、目录结构，它的正则规则比HAProxy更为强大和灵活，这也是它目前广泛流行的主要原因之一，Nginx单凭这点可利用的场合就远多于LVS了。
2、Nginx对网络稳定性的依赖非常小，理论上能ping通就能进行负载功能，这个也是它的优势之一；相反LVS对网络稳定性依赖比较大。
3、可以承担高负载压力且稳定，在硬件不差的情况下一般能支撑几万次的并发量，负载度比LVS相对小些。
4、Nginx可以通过端口检测到服务器内部的故障，比如根据服务器处理网页返回的状态码、超时等等，并且会把返回错误的请求重新提交到另一个节点，不过其中缺点就是不支持url来检测。比如用户正在上传一个文件，而处理该上传的节点刚好在上传过程中出现故障，Nginx会把上传切到另一台服务器重新处理，而LVS就直接断掉了，如果是上传一个很大的文件或者很重要的文件的话，用户可能会因此而不满。
```
**缺点**
```
1、Nginx仅能支持http、https和Email协议，这样就在适用范围上面小些，这个是它的缺点。
2、对后端服务器的健康检查，只支持通过端口来检测，不支持通过url来检测。不支持Session的直接保持，但能通过ip_hash来解决。
```
