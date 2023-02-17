### Swoole 概述
![](https://upload-images.jianshu.io/upload_images/6943526-662e081eed7cb7bf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

[Swoole](https://www.swoole.com/) 是面向**生产环境**的 PHP **异步网络通信引擎**。

使用纯 C 语言编写（Swoole 4 开始逐渐改为通过 C++ 编写），提供了 **PHP 语言的异步多线程服务器、异步 TCP/UDP 网络客户端、异步 MySQL、异步 Redis、数据库连接池、AsyncTask、消息队列、毫秒定时器、异步文件读写、异步 DNS 查询**。

除了异步 IO 的支持之外，Swoole 为 PHP 多进程的模式设计了多个并发数据结构和 IPC 通信机制，可以大大简化多进程并发编程的工作。其中包括了并发原子计数器，并发 HashTable、Channel、Lock、进程间通信 IPC 等丰富的功能特性。

PHP 一直被诟病的一个原因就是它是同步阻塞式语言，这在 Web 应用这种 IO 密集型的领域对于编写高并发高性能的应用而言，是一个重大阻碍。

有了 Swoole 之后，PHP 开发人员可以轻松编写高性能的异步并发 TCP、UDP、Unix Socket、HTTP 以及 WebSocket 服务，从而使得 PHP 语言在异步 IO 和网络通信领域开疆拓土，并且有望在工业级技术方面与 Node.js 和 Go 语言展开角逐。

从某种角度上说，Swoole 让 PHP 插上了异步的翅膀，让它飞得更高。

值得一提的是，Swoole 由中国的 **[韩天峰](http://rango.swoole.com/)** 创建并维护，目前已经以 **独立的开源项目** 形式进行运作和维护。

关于 Swoole 的最新进展可以看下作者韩天峰的这篇文章：[Swoole 2019 ：化繁为简、破茧成蝶](https://segmentfault.com/a/1190000017964685)。

Swoole 的官方中文文档可以看这里：[https://wiki.swoole.com](https://wiki.swoole.com/)。

### 1、安装Swoole扩展

Swoole扩展到GitHub首页下载Swoole扩展源码，地址：[https://github.com/swoole/swoole-src](https://github.com/swoole/swoole-src)  下载后按照标准的PHP扩展编译方式进行编译和安装。

```
unzip swoole-master.zip

/usr/local/php/bin/phpize

./configure --with-php-config=/usr/local/php/bin/php-config

sudo make install

```

编译安装完后，修改 php.ini 加入 extension=swoole.so 开启swoole扩展

### 2、laravel 安装laravel-swoole组件

1）Github下载：[laravel-swoole组件GitHub地址](https://github.com/swooletw/laravel-swoole)

2）composer 安装
```
composer require swooletw/laravel-swoole
```
然后，添加服务提供者：如果你使用 Laravel ，在 config/app.php 服务提供者数组添加该服务提供者

```
[
    'providers' => [
        SwooleTW\Http\LaravelServiceProvider::class,
    ],
]
```

### 3、启动

现在，你可以执行以下的命令来启动 Swoole HTTP 服务：

`/usr/local/php/bin/php artisan swoole:http start`

然后你可以看到以下信息：

```
Starting swoole http server...
Swoole http server started: <http://127.0.0.1:1215>
```

现在可以通过访问 `http://127.0.0.1:1215` 来进入 Laravel 应用

#### laravel-swoole 命令

```
# 启动
/usr/local/php/bin/php artisan swoole:http start

# 重启
/usr/local/php/bin/php artisan swoole:http restart

# 重载
/usr/local/php/bin/php artisan swoole:http reload

# 停止
/usr/local/php/bin/php artisan swoole:http stop

# 查看服务信息
/usr/local/php/bin/php artisan swoole:http infos
```

### 4、配合ngnix使用
1) 配置nginx.conf
```
gzip on;
gzip_min_length 1024;
gzip_comp_level 2;
gzip_types text/plain text/css text/javascript application/json application/javascript application/x-javascript application/xml application/x-httpd-php image/jpeg image/gif image/png font/ttf font/otf image/svg+xml;
gzip_vary on;
gzip_disable "msie6";
upstream labs {
    # Connect IP:Port
    server 127.0.0.1:1215 weight=5 max_fails=3 fail_timeout=30s;
    keepalive 16;
}

server {
    listen 80;

    server_name www.xxx.com;

    root /data/www/labs/public/;

    access_log  /var/log/nginx/xxx.cn.access.log main;
    error_log   /var/log/nginx/xxx.cn.error.log;

    autoindex off;
    index index.html index.htm;

    location / {
        try_files $uri @laravels;
    }

    location @laravels {
        # proxy_connect_timeout 60s;
        # proxy_send_timeout 60s;
        # proxy_read_timeout 120s;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Real-PORT $remote_port;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header Scheme $scheme;
        proxy_set_header Server-Protocol $server_protocol;
        proxy_set_header Server-Name $server_name;
        proxy_set_header Server-Addr $server_addr;
        proxy_set_header Server-Port $server_port;
        proxy_pass http://labs;
    }
}
```
2) 重启nginx

<br/>

### 下面详细介绍Laravel框架引入Swoole
1\. 在项目更目录创建一个 server 文件夹，然后在该文件夹中创建 `http_server.php` 文件，具体的文件内容如下

```
$http = new swoole_http_server('127.0.0.1', 9501);

$http->set([
    'worker_num' => 8,
    'max_request' => 5000,
//    'document_root' => '/Users/apple/Code/Teacher_Project/swoole_live/resources/live/',
//    'enable_static_handler' => true,
]);

//工作进程启动
$http->on('WorkerStart', function ($serv, $worker_id) {
    //加载index文件的内容
    require __DIR__ . '/../vendor/autoload.php';
    require_once __DIR__ . '/../bootstrap/app.php';
});

//监听http请求
$http->on('request', function ($request, $response) {

    //server信息
    if (isset($request->server)) {
        foreach ($request->server as $k => $v) {
            $_SERVER[strtoupper($k)] = $v;
        }
    }

    //header头信息
    if (isset($request->header)) {
        foreach ($request->header as $k => $v) {
            $_SERVER[strtoupper($k)] = $v;
        }
    }

    //get请求
    if (isset($request->get)) {
        foreach ($request->get as $k => $v) {
            $_GET[$k] = $v;
        }
    }

    //post请求
    if (isset($request->post)) {
        foreach ($request->post as $k => $v) {
            $_POST[$k] = $v;
        }
    }

    //文件请求
    if (isset($request->files)) {
        foreach ($request->files as $k => $v) {
            $_FILES[$k] = $v;
        }
    }

    //cookies请求
    if (isset($request->cookie)) {
        foreach ($request->cookie as $k => $v) {
            $_COOKIE[$k] = $v;
        }
    }

    ob_start();//启用缓存区

    //加载laravel请求核心模块
    $kernel = app()->make(Illuminate\Contracts\Http\Kernel::class);
    $laravelResponse = $kernel->handle(
        $request = Illuminate\Http\Request::capture()
    );
    $laravelResponse->send();
    $kernel->terminate($request, $laravelResponse);

    $res = ob_get_contents();//获取缓存区的内容
    ob_end_clean();//清除缓存区

    //输出缓存区域的内容
    $response->end($res);
});

$http->start();

```

2\.在路由文件加入路由:

```
Route::get('/test1', 'UsersController@test');
Route::get('/test2','UsersController@test2');
```

3\.在控制器添加方法:

```
    /**
     * 测试1
     * @param Request $request
     * @return string
     */
    public function test(Request $request)
    {
        return view('test');#在你的视图文件夹创建test.blade.php
    }

    /**
     * 测试2
     * @param Request $request
     * @return string
     */
    public function test2(Request $request)
    {
        return 'Hello World2:' . $request->get('name');
    }

```

 4\. 启动 swoole

在终端下输入:`php server/http_server.php`

5\.访问浏览器:

```
http://127.0.0.1:9501/test1
http://127.0.0.1:9501/test2?name=Jelly
```
![访问 test1 路由](https://upload-images.jianshu.io/upload_images/6943526-3705562abf6a54c7.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![访问 test2 路由](https://upload-images.jianshu.io/upload_images/6943526-83b78adbeea7a2d4.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](https://upload-images.jianshu.io/upload_images/6943526-2d2cdf980a1a75c5.gif?imageMogr2/auto-orient/strip)


