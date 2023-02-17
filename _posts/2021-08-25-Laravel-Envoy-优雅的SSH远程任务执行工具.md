## 前言

最近公司开发框架由Thinkphp换成了Laravel，每次项目更新上线，都会先更新代码，再执行命令来确保项目运行：

- 登录服务器，打开命令行;
- 进入项目所在文件夹（项目根目录）`cd /innfotech/www/xxx/` ;
- 把本地代码更新为最新的 `svn up`;
- 然后再执行一些命令：composer的，artisan的等

刚开始，手动做这些事情，觉得还行，久而久之, 会觉得这种方式太过麻烦，比较繁琐，还容易出现失误。所以针对这个问题，打算找一个解决方案。

**Laravel Envoy 就是我找到解决方案**

Laravel Envoy 为定义在远程服务器上运行的通用任务提供了一种简洁、轻便的语法。它使用了 Blade 风格的语法，让你可以很方便的启动任务来进行项目部署、Artisan 命令运行等操作。目前，Envoy 只支持 Mac 及 Linux 操作系统。

 TA 允许你通过最少的配置, 只需要在本地的命令行下执行如下的一行命令：`envoy run deploy`，就可以把上面所有的事情都做了。

话不多说，下面开始介绍 Laravel Envoy的安装和使用！

## 安装

Laravel Envoy Github地址：https://github.com/laravel/envoy

Laravel Envoy 的运行需要 `PHP 5.4` 以上, 使用 Composer Global 安装：

**安装composer**

```
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer

//将Composer配置给所有用户
composer global require "laravel/installer"
```

**安装 Laravel Envoy** 

```php
composer global require "laravel/envoy=~1.0"
```

![微信截图_20190123164325.png](https://upload-images.jianshu.io/upload_images/6943526-8bf4c4944268df35.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

> 注意: 需要把 ~/.composer/vendor/bin 放到你的 PATH 里面

```shell
//将bin放入当前用户Path
echo 'export PATH=$PATH:/root/.composer/vendor/bin' >> ~/.bashrc
//导入，免登出
source ~/.bashrc
//添加larvel执行权限
chmod +x /root/.composer/vendor/laravel/installer/laravel
//添加envoy执行权限
chomp +x /root/.composer/vendor/laravel/envoy/envoy
```

注意：

这里需要proc_open支持所以你查看是否支持

```
/usr/local/php/etc/php.ini
//删除
disable_functions中
proc_open proc_status
```

安装完成后测试

```php
➜ envoy --version
Laravel Envoy version 1.0.16
```

以后要更新的话, 只需要执行以下

```php
composer global update 
```

## 简单使用

1.初始化并创建 `deploy` 任务

首先, 在你的 项目 跟目录下, 执行以下命令进行初始化

```php
➜ envoy init vagrant@192.168.1.1（服务器IP）
Envoy file created!
```
![微信截图_20190123164309.png](https://upload-images.jianshu.io/upload_images/6943526-2dfa304ca1debc0c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

上面的命令会在此文件夹下生成一个 `Envoy.blade.php` 的文件, 内容如下

```php
@servers(['web' => 'vagrant@192.168.1.1'])

@task('deploy')
    <!--需要执行的命令-->
    cd /innfotech/www/xxx
    svn up
    composer update
    composer dump-autoload
    php artisan cache:clear
    php artisan migrate--seed
@endtask
```

`Envoy.blade.php`的语法很简单:

`@servers` 的数组被定义在文件的起始位置处，让你在声明任务时可以在 `on` 选项里参照使用这些服务器。` 

 `@task`声明里，你可以放置当任务运行时想要在远程服务器运行的 Bash 命令。

![微信截图_20190123164336.png](https://upload-images.jianshu.io/upload_images/6943526-2d4727986abac0c3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


然后运行命令：`envoy run deploy`就可以了

## 高级使用

你可以通过指定服务器的 IP 地址为 `127.0.0.1` 来执行本地任务：（目前，Envoy 只支持 Mac和Linux环境 ）

```php
@servers(['localhost' => '127.0.0.1'])
```

### 任务启动

有时，你可能想在任务启动前运行一些 PHP 代码。这时可以使用 `@setup` 区块在 Envoy 文件中声明变量以及运行普通的 PHP 程序：

```php
@setup
    $now = new DateTime();

    $environment = isset($env) ? $env : "testing";
@endsetup
```

如果你想在任务执行前引入其他 PHP 文件，可以直接在 `Envoy.blade.php` 文件起始位置使用 `@include` ：

```php
@include('vendor/autoload.php')

@task('foo')
    # ...
@endtask
```

### 任务变量

如果需要的话，你也可以通过命令行选项来传递变量至 Envoy 文件，以便自定义你的任务：

```php
envoy run deploy --branch=master
```

你可以通过 Blade 的「echo」语法使用这些选项， 当然也能在任务里用「if」 和循环操作。举例来说，我们在执行 `git pull` 命令前，先检查 `$branch` 变量是否存在：

```php
@servers(['web' => '192.168.1.1'])

@task('deploy', ['on' => 'web'])
    cd site

    @if ($branch)
        git pull origin {{ $branch }}
    @endif

    php artisan migrate
@endtask
```

### 任务宏

任务宏通过一个统一的、便捷的名字来划分一组任务，来让你把小而专的子任务合并到大的任务里。比如说，一个名为`deploy` 的任务宏可以在它定义范围内列出子任务名字 `git` 和 `composer` 来运行各自对应的任务：

```php
@servers(['web' => '192.168.1.1'])

@story('deploy')
    git
    composer
@endstory

@task('git')
    git pull origin master
@endtask

@task('composer')
    composer install
@endtask
```

当 story 写好后，像运行普通任务一样运行它就好了：

```php
envoy run deploy
```

### 多个服务器

你可以在多个服务器上运行任务。首先，增加额外的服务器至你的 `@servers` 声明，每个服务器必须分配一个唯一的名称。一旦你定义好其它服务器，就能够在任务声明的 `on` 数组中列出这些服务器：

```php
@servers(['web-1' => '192.168.1.1', 'web-2' => '192.168.1.2'])

@task('deploy', ['on' => ['web-1', 'web-2']])
    cd site
    git pull origin {{ $branch }}
    php artisan migrate
@endtask
```

#### 并行运行

默认情况下，任务会按照顺序在每个服务器上运行。这意味着任务会在第一个服务器运行完后才跳到第二个。如果你想在多个服务器上并行运行任务，只需简单的在任务声明里加上 `parallel` 选项即可：

```php
@servers(['web-1' => '192.168.1.1', 'web-2' => '192.168.1.2'])

@task('deploy', ['on' => ['web-1', 'web-2'], 'parallel' => true])
    cd site
    git pull origin {{ $branch }}
    php artisan migrate
@endtask
```

## 运行任务

要想运行一个在 `Envoy.blade.php` 文件中定义好的任务或者宏，就执行 Envoy 的 `run` 命令，并将这个任务的名字传递给它。Envoy 会去执行这个任务并且把任务执行过程中的输出给打印出来：

```php
envoy run task
```

### 任务确认

如果你想要在运行任务之前进行提示确认，则可以增加 `confirm` 命令到任务声明。这个选项对于破坏性的操作来说是相当有用的：

```php
@task('deploy', ['on' => 'web', 'confirm' => true])
    cd site
    git pull origin {{ $branch }}
    php artisan migrate
@endtask
```

## 通知

### Slack

![slack.jpg](https://upload-images.jianshu.io/upload_images/6943526-af9c673075626ee1.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

Envoy 也支持任务执行完毕后发送通知至 [Slack](https://slack.com/)。`@slack` 命令接收 Slack hook 网址和频道名称。你可以通在在 Slack 的控制面板上创建 「Incoming WebHooks」 时来检索 webhook 网址。webhook-url 参数必须是 `@slack` 的 Incoming WebHooks 所提供的完整网址：

```php
@finished
    @slack('webhook-url', '#bots')
@endfinished
```

你可以选择下方的任意一个来作为 channel 参数：

- 如果要发送通知至一个频道： `#channel`
- 如果要发送通知给一位用户： `@user`
