![](https://upload-images.jianshu.io/upload_images/6943526-237cc211e08e06e9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


### 1.首先安装swoole扩展

```
Swoole-1.x需要 PHP-5.3.10 或更高版本
Swoole-2.x需要 PHP-7.0.0 或更高版本

PHP有些版本（5.6*）需要编译安装，7以上直接使用命令 pecl install swoole

wget https://github.com/swoole/swoole-src/archive/v1.10.1.tar.gz

tar -zxvf v1.10.1.tar.gz

cd swoole-src-1.10.1

phpize

./configure --with-php-config=/usr/local/php/bin/php-config

make && make install

然后在php.ini添加swoole.so扩展即可

```

### 2.使用laravel的artisan创建命令

```
#创建一个命令swoole并会在app/Console/Commands增加一个Swoole.php的文件
php artisan make:command Swoole   

Commands\Swoole::Class  #在Kernel.php里增加命令列表
```

### 3.运行socket服务

#####3.1 编辑app/Console/Command里的Swoole.php文件

```
<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;

class Swoole extends Command
{
    public $ws;
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'swoole {action?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'swoole';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $action = $this->argument('action');
        switch ($action) {
            case 'close':

                break;

            default:
                $this->start();
                break;
        }

    }
    public function start()
    {
        //创建websocket服务器对象，监听0.0.0.0:9502端口
        $this->ws = new \swoole_websocket_server("0.0.0.0", 9502);

        //监听WebSocket连接打开事件
        $this->ws->on('open', function ($ws, $request) {
            var_dump($request->fd . "连接成功");
            // $ws->push($request->fd, "hello, welcome\n");
        });

        //监听WebSocket消息事件
        $this->ws->on('message', function ($ws, $frame) {
            // echo "Message: {$frame->data}\n";
            // $ws->push($frame->fd, "server: {$frame->data}");
            // var_dump($ws->connection_info($frame->fd));
            //fd绑定客户端传过来的标识uid
            $ws->bind($frame->fd, $frame->data);
        });

        $this->ws->on('request', function ($request, $response) {
                // 接收http请求从post获取参数
                // 获取所有连接的客户端，验证uid给指定用户推送消息
                // token验证推送来源，避免恶意访问
                if ($request->post['token'] == ### ) {
                    $clients = $this->ws->getClientList();
                    $clientId = [];
                    foreach ($clients as $value) {
                        $clientInfo = $this->ws->connection_info($value);
                        if (array_key_exists('uid', $clientInfo) && $clientInfo['uid'] == $request->post['s_id']) {
                            $clientId[] = $value;
                        }
                    }
                    if (!empty($clientId)) {
                        foreach ($clientId as $v) {
                            $this->ws->push($v, $request->post['info']);
                        }
                    }
                }
            });

        //监听WebSocket连接关闭事件
        $this->ws->on('close', function ($ws, $fd) {
            echo "client:{$fd} is closed\n";
        });

        $this->ws->start();
    }
}
```
######【注】此处为了结合app上传数据时使用curl触发request回调通知web端的实例所以使用了httpserver的onrequest事件，如果以后有更好的办法去触发服务端实时主动推送。

#####3.2 编辑html

```
<div id="test">
    <a href="javascript:void(0)">运行websocket</a>
</div>

$('#test').click(function(){
            if("WebSocket" in window){
                console.log("您的浏览器支持websocket\n");
                var ws = new WebSocket("ws://66.66.66.66:9502");//创建websocket对象 
                ws.onopen = function(){
                    // ws.send("连接已建立\n");
                    ws.send($("#content").attr("js-sid"));
                    console.log("数据发送中");
                }

                ws.onmessage = function(evt){
                    var recv_msg = evt.data;
                    console.log("接受到的数据为:"+recv_msg);
                }

                ws.onerror = function(evt,e){
                    console.log("错误信息为"+e);
                }

                ws.onclose = function(){
                    console.log("连接已关闭");
                }

            }else{
                console.log("您的浏览器不支持websocket\n");
            }
        });

```

#####3.3 curl方法（调用就行）

```
public function swooletest($param = ['s_id'=>2, 'info'=>'info'])
    {
        $param['token'] = ###;
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "http://127.0.0.1:9502");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HEADER, 1);
        curl_setopt($ch, CURLOPT_POST, 1);
        //设置post数据
        $post_data = $param;
        curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
        curl_exec($ch);
        curl_close($ch);
    }

```

###### 测试的时候直接在laravel的artisan所在目录使用命令`php artisan swoole`即可启动socket服务，然后页面运行客户端，最后调用curl推送数据。

###4.成功之后

用**supervisor**守护swoole命令，或者nohup后台启动。

supervisor配置麻烦不过可以自动重启，对supervisor感兴趣的小伙伴可以看看我的另一篇文章【[Laravel框架学习笔记之异步队列](https://www.jianshu.com/p/a53351b6810a)】

nohup一条命令解决
```
nohup php artisan swoole &    #一条命令解决
```

### 备注

1.此处采用的是bind方法，当客户端连接的时候send一个uid过来，然后在服务端处理的时候把uid和fd绑定在一起，当你想向某个客户端发送数据时传一个uid，通过uid找到fd进行指定发送，但是此处我用的是遍历getClientList所有连接用户（方法欠佳）的信息connection_info进行判定。（希望能改善这种方法）

2.因为是curl访问httpserver的形式，所以为了避免恶意访问，加一个token验证。

3.推送的信息转换成json再传，即info值

4.本实例的账户可能会在多个终端登录，有多个fd绑定uid，所以遍历推送push

![](https://upload-images.jianshu.io/upload_images/6943526-67434fef6859f056.gif?imageMogr2/auto-orient/strip)
