# Hprose for Laravel

**HPROSE** 是 `High Performance Remote Object Service Engine` 的缩写，翻译成中文就是 **“高性能远程对象服务引擎”**。
![hprose.png](https://upload-images.jianshu.io/upload_images/6943526-b9276baa2dfb24b3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


Hprose是一个先进的轻量级的跨语言跨平台面向对象的高性能远程动态通讯中间件。它不仅简单易用，而且功能强大。它支持众多语言，例如nodeJs, C++, .NET, [Java](https://www.2cto.com/kf/ware/Java/), Delphi, Objective-C, ActionScript, [JavaScript](https://www.2cto.com/kf/qianduan/JS/), ASP, [PHP](https://www.2cto.com/kf/web/php/), [Python](https://www.2cto.com/kf/web/Python/), Ruby, Perl, Golang 等语言，通过 Hprose 可以在这些语言之间实现方便且高效的互通。
![hprose支持 (2).png](https://upload-images.jianshu.io/upload_images/6943526-4e408c4eb636587f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![hprose支持 (3).png](https://upload-images.jianshu.io/upload_images/6943526-7364f782ba6e83b6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![hprose支持.png](https://upload-images.jianshu.io/upload_images/6943526-a9f951bb991428df.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



下面介绍laravel框架使用Hprose的两种方法：
![laravel.jpg](https://upload-images.jianshu.io/upload_images/6943526-5e67d9ac8026b6f1.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


## 一.Composer引入

#### 步骤1 引入hprose

在你的 laravel目录中的 composer.json 文件中，添加这部分：：

```php
{
    "require": {
        "hprose/hprose": ">=2.0.0"
    }
}
```

然后在你的根目录使用composer update 命令下载 hprose 扩展包

#### 步骤2 创建服务端

在你的app目录下 创建一个[Services](https://www.baidu.com/s?wd=Services&tn=24004469_oem_dg&rsv_dl=gh_pl_sl_csd)目录(可手动创建)

在目录下面创建UserService.php作为服务端，内容如下：

```php
<?php
namespace App\Services;
use Hprose\Http\Server;
class UserService{
    public function init(){
        $server=new Server();
        $server->addMethod('test',$this);
        $server->start();  
    }
     public function test(){
        return 'hello';
    }
}
```

#### 步骤3 创建服务端路由

简单的服务端的代码就完成了，现在我们在api.php设置一下路由：

```php
Route::post('service', function (Request $request) {//服务端一定用post不然会报错
    $server = new \App\Services\UserService();
    $server->init();   //开启服务
})->middleware('api');
```

测试：访问<http://localhost/api/service>，如果出现“Fa1{s5”test”}z”就表示方法是成功添加到服务了。 

猜测这个序列化结果的含义： 
F表示function；a表示List/Array；1表示List/Array的长度；{和}是分隔符，便于解析；s表示String；4表示后接string的长度；z表示end。

#### 步骤4 创建客户端

这边我还是以laravel框架创建客户端为例。

还是在Service目录下面新建文件UserClien.php作为客户端，内容如下：

```php
<?php
namespace App\Services;
use Hprose\Http\Client;
class UserClien
{
    public function index($request){
        //服务端路由在api路由中配置，则此处路由应加上api/test
        //实例化可选参数 加上false 即创建创建一个同步的 HTTP 客户端
        //不写false  为创建一个异步的 HTTP 客户端
        $user =new Client('http://localhost/api/test',false);
        $res=$user->test();
        dd($res);
    }
}
```

#### 步骤5 创建客户端路由

在web.php中添加

```php
Route::post('Clien', function () {
    $server = new \App\Services\UserClien();
    $server->index();
});
```

测试：访问<http://localhost/clien>，如果输出“hello”就表示简单的分布式应用就开发好了。



## 二.使用laravel扩展：Laravel-hprose

基于 [hprose/hprose-php](https://github.com/hprose/hprose-php/wiki) 开发的Laravel扩展：[laravel-hprose](https://github.com/zhuqipeng/laravel-hprose)

#### 版本要求

```
Laravel>=5.2
```

#### 安装

```
composer require "zhuqipeng/laravel-hprose:v1.0-alpha"
```

或者编辑composer.json

```
"require": {
    "zhuqipeng/laravel-hprose": "v1.0-alpha"
}
```

#### 配置

1. 在 config/app.php 注册 ServiceProvider 和 Facade (Laravel 5.5 无需手动注册)

   ```
   'providers' => [
     // ...
   
     Zhuqipeng\LaravelHprose\ServiceProvider::class,
   ]
   ```

   ```
   'aliases' => [
     // ...
   
     'LaravelHproseMethodManage' => Zhuqipeng\LaravelHprose\Facades\HproseMethodManage::class,
   ]
   ```

2. 配置.env文件

   监听地址列表，字符串json格式数组

   ```
   HPROSE_URIS=["tcp://0.0.0.0:1314"]
   ```

   是否启用demo方法，true开启 false关闭，开启后将自动对外发布一个远程调用方法 `demo`

   客户端可调用：$client->demo()

   ```
   HPROSE_DEMO=true // true or false
   ```

3. 创建`配置`和`路由`文件：

   ```
   php artisan vendor:publish --provider="Zhuqipeng\LaravelHprose\ServiceProvider"
   ```

   > 应用根目录下的
   >
   > ```
   > config
   > ```
   >
   > 目录下会自动生成新文件
   >
   > ```
   > hprose.php
   > ```
   >
   > 应用根目录下的`routes`目录下会自动生成新文件`rpc.php`

#### 使用

###### 路由

> 和 `laravel` 路由的用法相似，基于 [dingo/api](https://github.com/dingo/api) 的路由代码上做了简单修改

路由文件

```
routes/rpc.php
```

添加路由方法

```
\LaravelHproseRouter::add(string $name, string|callable $action, array $options = []);
```

- string $name 可供客户端远程调用的方法名
- string|callable $action 类方法，格式：AppControllersUser@update
- array $options 是一个关联数组，它里面包含了一些对该服务函数的特殊设置，详情请参考hprose-php官方文档介绍 [链接](https://github.com/hprose/hprose-php/wiki/06-Hprose-%E6%9C%8D%E5%8A%A1%E5%99%A8#addfunction-%E6%96%B9%E6%B3%95)

发布远程调用方法 `getUserByName` 和 `update`

```
\LaravelHproseRouter::add('getUserByName', function ($name) {
    return 'name: ' . $name;
});

\LaravelHproseRouter::add('userUpdate', 'App\Controllers\User@update', ['model' => \Hprose\ResultMode::Normal]);
```

控制器

```
<?php

namespace App\Controllers;

class User
{
    public function update($name)
    {
        return 'update name: ' . $name;
    }
}
```

客户端调用

```
$client->getUserByName('zhuqipeng');
$client->userUpdate('zhuqipeng');
```

路由组

```
\LaravelHproseRouter::group(array $attributes, callable $callback);
```

- array $attributes 属性 ['namespace' => '', 'prefix' => '']
- callable $callback 回调函数

```
\LaravelHproseRouter::group(['namespace' => 'App\Controllers'], function ($route) {
    $route->add('getUserByName', function ($name) {
        return 'name: ' . $name;
    });

    $route->add('userUpdate', 'User@update');
});
```

客户端调用

```
$client->getUserByName('zhuqipeng');
$client->userUpdate('zhuqipeng');
```

前缀

```
\LaravelHproseRouter::group(['namespace' => 'App\Controllers', 'prefix' => 'user'], function ($route) {
    $route->add('getByName', function ($name) {
        return 'name: ' . $name;
    });

    $route->add('update', 'User@update');
});
```

客户端调用

```
$client->user->getByName('zhuqipeng');
$client->user->update('zhuqipeng');
// 或者
$client->user_getByName('zhuqipeng');
$client->user_update('zhuqipeng');
```

#### 启动服务

```
php artisan hprose:socket_server
```
