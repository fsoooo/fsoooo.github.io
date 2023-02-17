**一、socket协议的简介**

WebSocket是什么，有什么优点

WebSocket是一个持久化的协议，这是相对于http非持久化来说的。

举个简单的例子，http1.0的生命周期是以request作为界定的，也就是一个request，一个response，对于http来说，本次client与server的会话到此结束；而在http1.1中，稍微有所改进，即添加了keep-alive，也就是在一个http连接中可以进行多个request请求和多个response接受操作。然而在实时通信中，并没有多大的作用，http只能由client发起请求，server才能返回信息，即server不能主动向client推送信息，无法满足实时通信的要求。而WebSocket可以进行持久化连接，即client只需进行一次握手，成功后即可持续进行数据通信，值得关注的是WebSocket实现client与server之间全双工通信，即server端有数据更新时可以主动推送给client端。

**二、介绍client与server之间的socket连接原理**

**1、下面是一个演示client和server之间建立WebSocket连接时握手部分**

![](https://upload-images.jianshu.io/upload_images/6943526-1e47d1d596d23acd?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**2、client与server建立socket时握手的会话内容，即request与response**

**a、client建立WebSocket时向服务器端请求的信息**
```
GET /chat HTTP/1.1

Host: server.example.com

Upgrade: websocket //告诉服务器现在发送的是WebSocket协议

Connection: Upgrade

Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw== //是一个Base64 encode的值，这个是浏览器随机生成的，用于验证服务器端返回数据是否是WebSocket助理

Sec-WebSocket-Protocol: chat, superchat

Sec-WebSocket-Version: 13

Origin: http://example.com
```
**b、服务器获取到client请求的信息后，根据WebSocket协议对数据进行处理并返回，其中要对Sec-WebSocket-Key进行加密等操作**
```
HTTP/1.1 101 Switching Protocols

Upgrade: websocket //依然是固定的，告诉客户端即将升级的是Websocket协议，而不是mozillasocket，lurnarsocket或者shitsocket

Connection: Upgrade

Sec-WebSocket-Accept: HSmrc0sMlYUkAGmm5OPpG2HaGWk= //这个则是经过服务器确认，并且加密过后的 Sec-WebSocket-Key,也就是client要求建立WebSocket验证的凭证

Sec-WebSocket-Protocol: chat
```
**3、socket建立连接原理图：**

![](https://upload-images.jianshu.io/upload_images/6943526-6ec0f19a39882665?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**三、PHP中建立socket的过程讲解**

**1、在PHP中，client与server之间建立socket通信，首先在PHP中创建socket并监听端口信息，代码如下：**

```
//传相应的IP与端口进行创建socket操作
function WebSocket($address,$port){
    $server = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
    socket_set_option($server, SOL_SOCKET, SO_REUSEADDR, 1);//1表示接受所有的数据包
    socket_bind($server, $address, $port);
    socket_listen($server);
    return $server;
```

**2、设计一个循环挂起WebSocket通道，进行数据的接收、处理和发送**

```
//对创建的socket循环进行监听，处理数据
function run(){
    //死循环，直到socket断开
    while(true){
        $changes=$this->sockets;
        $write=NULL;
        $except=NULL;
         
        /*
        //这个函数是同时接受多个连接的关键，我的理解它是为了阻塞程序继续往下执行。
        socket_select ($sockets, $write = NULL, $except = NULL, NULL);
 
        $sockets可以理解为一个数组，这个数组中存放的是文件描述符。当它有变化（就是有新消息到或者有客户端连接/断开）时，socket_select函数才会返回，继续往下执行。
        $write是监听是否有客户端写数据，传入NULL是不关心是否有写变化。
        $except是$sockets里面要被排除的元素，传入NULL是”监听”全部。
        最后一个参数是超时时间
        如果为0：则立即结束
        如果为n>1: 则最多在n秒后结束，如遇某一个连接有新动态，则提前返回
        如果为null：如遇某一个连接有新动态，则返回
        */
        socket_select($changes,$write,$except,NULL);
        foreach($changes as $sock){
             
            //如果有新的client连接进来，则
            if($sock==$this->master){
 
                //接受一个socket连接
                $client=socket_accept($this->master);
 
                //给新连接进来的socket一个唯一的ID
                $key=uniqid();
                $this->sockets[]=$client;  //将新连接进来的socket存进连接池
                $this->users[$key]=array(
                    'socket'=>$client,  //记录新连接进来client的socket信息
                    'shou'=>false       //标志该socket资源没有完成握手
                );
            //否则1.为client断开socket连接，2.client发送信息
            }else{
                $len=0;
                $buffer='';
                //读取该socket的信息，注意：第二个参数是引用传参即接收数据，第三个参数是接收数据的长度
                do{
                    $l=socket_recv($sock,$buf,1000,0);
                    $len+=$l;
                    $buffer.=$buf;
                }while($l==1000);
 
                //根据socket在user池里面查找相应的$k,即健ID
                $k=$this->search($sock);
 
                //如果接收的信息长度小于7，则该client的socket为断开连接
                if($len<7){
                    //给该client的socket进行断开操作，并在$this->sockets和$this->users里面进行删除
                    $this->send2($k);
                    continue;
                }
                //判断该socket是否已经握手
                if(!$this->users[$k]['shou']){
                    //如果没有握手，则进行握手处理
                    $this->woshou($k,$buffer);
                }else{
                    //走到这里就是该client发送信息了，对接受到的信息进行uncode处理
                    $buffer = $this->uncode($buffer,$k);
                    if($buffer==false){
                        continue;
                    }
                    //如果不为空，则进行消息推送操作
                    $this->send($k,$buffer);
                }
            }
        }    
    }   
}
```

**3、以上服务器端完成的WebSocket的前期工作后，就等着client连接进行，client创建WebSocket很简单，代码如下：**

```

var ws = new WebSocket("ws://IP:端口");
//握手监听函数
ws.onopen=function(){
     //状态为1证明握手成功，然后把client自定义的名字发送过去
    if(so.readyState==1){
         //握手成功后对服务器发送信息
     so.send('type=add&ming='+n);
    }
}
//错误返回信息函数
ws.onerror = function(){
    console.log("error");
};
//监听服务器端推送的消息
ws.onmessage = function (msg){
    console.log(msg);
}
 
//断开WebSocket连接
ws.onclose = function(){
    ws = false;
}
```

**四、聊天室实例代码**

**1、PHP部分**

```

<?php
error_reporting(E_ALL ^ E_NOTICE);
ob_implicit_flush();
 
//地址与接口，即创建socket时需要服务器的IP和端口
$sk=new Sock('127.0.0.1',8000);
 
//对创建的socket循环进行监听，处理数据
$sk->run();
 
//下面是sock类
class Sock{
    public $sockets; //socket的连接池，即client连接进来的socket标志
    public $users;   //所有client连接进来的信息，包括socket、client名字等
    public $master;  //socket的resource，即前期初始化socket时返回的socket资源
     
    private $sda=array();   //已接收的数据
    private $slen=array();  //数据总长度
    private $sjen=array();  //接收数据的长度
    private $ar=array();    //加密key
    private $n=array();
     
    public function __construct($address, $port){
 
        //创建socket并把保存socket资源在$this->master
        $this->master=$this->WebSocket($address, $port);
 
        //创建socket连接池
        $this->sockets=array($this->master);
    }
     
    //对创建的socket循环进行监听，处理数据
    function run(){
        //死循环，直到socket断开
        while(true){
            $changes=$this->sockets;
            $write=NULL;
            $except=NULL;
             
            /*
            //这个函数是同时接受多个连接的关键，我的理解它是为了阻塞程序继续往下执行。
            socket_select ($sockets, $write = NULL, $except = NULL, NULL);
 
            $sockets可以理解为一个数组，这个数组中存放的是文件描述符。当它有变化（就是有新消息到或者有客户端连接/断开）时，socket_select函数才会返回，继续往下执行。
            $write是监听是否有客户端写数据，传入NULL是不关心是否有写变化。
            $except是$sockets里面要被排除的元素，传入NULL是”监听”全部。
            最后一个参数是超时时间
            如果为0：则立即结束
            如果为n>1: 则最多在n秒后结束，如遇某一个连接有新动态，则提前返回
            如果为null：如遇某一个连接有新动态，则返回
            */
            socket_select($changes,$write,$except,NULL);
            foreach($changes as $sock){
                 
                //如果有新的client连接进来，则
                if($sock==$this->master){
 
                    //接受一个socket连接
                    $client=socket_accept($this->master);
 
                    //给新连接进来的socket一个唯一的ID
                    $key=uniqid();
                    $this->sockets[]=$client;  //将新连接进来的socket存进连接池
                    $this->users[$key]=array(
                        'socket'=>$client,  //记录新连接进来client的socket信息
                        'shou'=>false       //标志该socket资源没有完成握手
                    );
                //否则1.为client断开socket连接，2.client发送信息
                }else{
                    $len=0;
                    $buffer='';
                    //读取该socket的信息，注意：第二个参数是引用传参即接收数据，第三个参数是接收数据的长度
                    do{
                        $l=socket_recv($sock,$buf,1000,0);
                        $len+=$l;
                        $buffer.=$buf;
                    }while($l==1000);
 
                    //根据socket在user池里面查找相应的$k,即健ID
                    $k=$this->search($sock);
 
                    //如果接收的信息长度小于7，则该client的socket为断开连接
                    if($len<7){
                        //给该client的socket进行断开操作，并在$this->sockets和$this->users里面进行删除
                        $this->send2($k);
                        continue;
                    }
                    //判断该socket是否已经握手
                    if(!$this->users[$k]['shou']){
                        //如果没有握手，则进行握手处理
                        $this->woshou($k,$buffer);
                    }else{
                        //走到这里就是该client发送信息了，对接受到的信息进行uncode处理
                        $buffer = $this->uncode($buffer,$k);
                        if($buffer==false){
                            continue;
                        }
                        //如果不为空，则进行消息推送操作
                        $this->send($k,$buffer);
                    }
                }
            }
             
        }
         
    }
     
    //指定关闭$k对应的socket
    function close($k){
        //断开相应socket
        socket_close($this->users[$k]['socket']);
        //删除相应的user信息
        unset($this->users[$k]);
        //重新定义sockets连接池
        $this->sockets=array($this->master);
        foreach($this->users as $v){
            $this->sockets[]=$v['socket'];
        }
        //输出日志
        $this->e("key:$k close");
    }
     
    //根据sock在users里面查找相应的$k
    function search($sock){
        foreach ($this->users as $k=>$v){
            if($sock==$v['socket'])
            return $k;
        }
        return false;
    }
     
    //传相应的IP与端口进行创建socket操作
    function WebSocket($address,$port){
        $server = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
        socket_set_option($server, SOL_SOCKET, SO_REUSEADDR, 1);//1表示接受所有的数据包
        socket_bind($server, $address, $port);
        socket_listen($server);
        $this->e('Server Started : '.date('Y-m-d H:i:s'));
        $this->e('Listening on   : '.$address.' port '.$port);
        return $server;
    }
     
     
    /*
    * 函数说明：对client的请求进行回应，即握手操作
    * @$k clien的socket对应的健，即每个用户有唯一$k并对应socket
    * @$buffer 接收client请求的所有信息
    */
    function woshou($k,$buffer){
 
        //截取Sec-WebSocket-Key的值并加密，其中$key后面的一部分258EAFA5-E914-47DA-95CA-C5AB0DC85B11字符串应该是固定的
        $buf  = substr($buffer,strpos($buffer,'Sec-WebSocket-Key:')+18);
        $key  = trim(substr($buf,0,strpos($buf,"\r\n")));
        $new_key = base64_encode(sha1($key."258EAFA5-E914-47DA-95CA-C5AB0DC85B11",true));
         
        //按照协议组合信息进行返回
        $new_message = "HTTP/1.1 101 Switching Protocols\r\n";
        $new_message .= "Upgrade: websocket\r\n";
        $new_message .= "Sec-WebSocket-Version: 13\r\n";
        $new_message .= "Connection: Upgrade\r\n";
        $new_message .= "Sec-WebSocket-Accept: " . $new_key . "\r\n\r\n";
        socket_write($this->users[$k]['socket'],$new_message,strlen($new_message));
 
        //对已经握手的client做标志
        $this->users[$k]['shou']=true;
        return true;
         
    }
     
    //解码函数
    function uncode($str,$key){
        $mask = array(); 
        $data = ''; 
        $msg = unpack('H*',$str);
        $head = substr($msg[1],0,2); 
        if ($head == '81' && !isset($this->slen[$key])) { 
            $len=substr($msg[1],2,2);
            $len=hexdec($len);//把十六进制的转换为十进制
            if(substr($msg[1],2,2)=='fe'){
                $len=substr($msg[1],4,4);
                $len=hexdec($len);
                $msg[1]=substr($msg[1],4);
            }else if(substr($msg[1],2,2)=='ff'){
                $len=substr($msg[1],4,16);
                $len=hexdec($len);
                $msg[1]=substr($msg[1],16);
            }
            $mask[] = hexdec(substr($msg[1],4,2)); 
            $mask[] = hexdec(substr($msg[1],6,2)); 
            $mask[] = hexdec(substr($msg[1],8,2)); 
            $mask[] = hexdec(substr($msg[1],10,2));
            $s = 12;
            $n=0;
        }else if($this->slen[$key] > 0){
            $len=$this->slen[$key];
            $mask=$this->ar[$key];
            $n=$this->n[$key];
            $s = 0;
        }
         
        $e = strlen($msg[1])-2;
        for ($i=$s; $i<= $e; $i+= 2) { 
            $data .= chr($mask[$n%4]^hexdec(substr($msg[1],$i,2))); 
            $n++; 
        } 
        $dlen=strlen($data);
         
        if($len > 255 && $len > $dlen+intval($this->sjen[$key])){
            $this->ar[$key]=$mask;
            $this->slen[$key]=$len;
            $this->sjen[$key]=$dlen+intval($this->sjen[$key]);
            $this->sda[$key]=$this->sda[$key].$data;
            $this->n[$key]=$n;
            return false;
        }else{
            unset($this->ar[$key],$this->slen[$key],$this->sjen[$key],$this->n[$key]);
            $data=$this->sda[$key].$data;
            unset($this->sda[$key]);
            return $data;
        }
         
    }
     
    //与uncode相对
    function code($msg){
        $frame = array(); 
        $frame[0] = '81'; 
        $len = strlen($msg);
        if($len < 126){
            $frame[1] = $len<16?'0'.dechex($len):dechex($len);
        }else if($len < 65025){
            $s=dechex($len);
            $frame[1]='7e'.str_repeat('0',4-strlen($s)).$s;
        }else{
            $s=dechex($len);
            $frame[1]='7f'.str_repeat('0',16-strlen($s)).$s;
        }
        $frame[2] = $this->ord_hex($msg);
        $data = implode('',$frame); 
        return pack("H*", $data); 
    }
     
    function ord_hex($data)  { 
        $msg = ''; 
        $l = strlen($data); 
        for ($i= 0; $i<$l; $i++) { 
            $msg .= dechex(ord($data{$i})); 
        } 
        return $msg; 
    }
     
    //用户加入或client发送信息
    function send($k,$msg){
        //将查询字符串解析到第二个参数变量中，以数组的形式保存如：parse_str("name=Bill&age=60",$arr)
        parse_str($msg,$g);
        $ar=array();
 
        if($g['type']=='add'){
            //第一次进入添加聊天名字，把姓名保存在相应的users里面
            $this->users[$k]['name']=$g['ming'];
            $ar['type']='add';
            $ar['name']=$g['ming'];
            $key='all';
        }else{
            //发送信息行为，其中$g['key']表示面对大家还是个人，是前段传过来的信息
            $ar['nrong']=$g['nr'];
            $key=$g['key'];
        }
        //推送信息
        $this->send1($k,$ar,$key);
    }
     
    //对新加入的client推送已经在线的client
    function getusers(){
        $ar=array();
        foreach($this->users as $k=>$v){
            $ar[]=array('code'=>$k,'name'=>$v['name']);
        }
        return $ar;
    }
     
    //$k 发信息人的socketID $key接受人的 socketID ，根据这个socketID可以查找相应的client进行消息推送，即指定client进行发送
    function send1($k,$ar,$key='all'){
        $ar['code1']=$key;
        $ar['code']=$k;
        $ar['time']=date('m-d H:i:s');
        //对发送信息进行编码处理
        $str = $this->code(json_encode($ar));
        //面对大家即所有在线者发送信息
        if($key=='all'){
            $users=$this->users;
            //如果是add表示新加的client
            if($ar['type']=='add'){
                $ar['type']='madd';
                $ar['users']=$this->getusers();        //取出所有在线者，用于显示在在线用户列表中
                $str1 = $this->code(json_encode($ar)); //单独对新client进行编码处理，数据不一样
                //对新client自己单独发送，因为有些数据是不一样的
                socket_write($users[$k]['socket'],$str1,strlen($str1));
                //上面已经对client自己单独发送的，后面就无需再次发送，故unset
                unset($users[$k]);
            }
            //除了新client外，对其他client进行发送信息。数据量大时，就要考虑延时等问题了
            foreach($users as $v){
                socket_write($v['socket'],$str,strlen($str));
            }
        }else{
            //单独对个人发送信息，即双方聊天
            socket_write($this->users[$k]['socket'],$str,strlen($str));
            socket_write($this->users[$key]['socket'],$str,strlen($str));
        }
    }
     
    //用户退出向所用client推送信息
    function send2($k){
        $this->close($k);
        $ar['type']='rmove';
        $ar['nrong']=$k;
        $this->send1(false,$ar,'all');
    }
     
    //记录日志
    function e($str){
        //$path=dirname(__FILE__).'/log.txt';
        $str=$str."\n";
        //error_log($str,3,$path);
        //编码处理
        echo iconv('utf-8','gbk//IGNORE',$str);
    }
}
?>
```

**2、client部分**

```
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
<title>HTML5 websocket 网页聊天室 javascript php</title>
<style type="text/css">
body,p{margin:0px; padding:0px; font-size:14px; color:#333; font-family:Arial, Helvetica, sans-serif;}
#ltian,.rin{width:98%; margin:5px auto;}
#ltian{border:1px #ccc solid;overflow-y:auto; overflow-x:hidden; position:relative;}
#ct{margin-right:111px; height:100%;overflow-y:auto;overflow-x: hidden;}
#us{width:110px; overflow-y:auto; overflow-x:hidden; float:right; border-left:1px #ccc solid; height:100%; background-color:#F1F1F1;}
#us p{padding:3px 5px; color:#08C; line-height:20px; height:20px; cursor:pointer; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;}
#us p:hover,#us p:active,#us p.ck{background-color:#069; color:#FFF;}
#us p.my:hover,#us p.my:active,#us p.my{color:#333;background-color:transparent;}
button{float:right; width:80px; height:35px; font-size:18px;}
input{width:100%; height:30px; padding:2px; line-height:20px; outline:none; border:solid 1px #CCC;}
.rin p{margin-right:160px;}
.rin span{float:right; padding:6px 5px 0px 5px; position:relative;}
.rin span img{margin:0px 3px; cursor:pointer;}
.rin span form{position:absolute; width:25px; height:25px; overflow:hidden; opacity:0; top:5px; right:5px;}
.rin span input{width:180px; height:25px; margin-left:-160px; cursor:pointer}
 
#ct p{padding:5px; line-height:20px;}
#ct a{color:#069; cursor:pointer;}
#ct span{color:#999; margin-right:10px;}
.c2{color:#999;}
.c3{background-color:#DBE9EC; padding:5px;}
.qp{position:absolute; font-size:12px; color:#666; top:5px; right:130px; text-decoration:none; color:#069;}
#ems{position:absolute; z-index:5; display:none; top:0px; left:0px; max-width:230px; background-color:#F1F1F1; border:solid 1px #CCC; padding:5px;}
#ems img{width:44px; height:44px; border:solid 1px #FFF; cursor:pointer;}
#ems img:hover,#ems img:active{border-color:#A4B7E3;}
#ems a{color:#069; border-radius:2px; display:inline-block; margin:2px 5px; padding:1px 8px; text-decoration:none; background-color:#D5DFFD;}
#ems a:hover,#ems a:active,#ems a.ck{color:#FFF; background-color:#069;}
.tc{text-align:center; margin-top:5px;}
</style>
</head>
 
<body>
<div id="ltian">
    <div id="us" class="jb"></div>
    <div id="ct"></div>
    <a href="javascript:;" class="qp" onClick="this.parentNode.children[1].innerHTML=''">清屏</a>
</div>
<div class="rin">
    <button id="sd">发送</button>
    <span><img src="http://www.yxsss.com/ui/sk/t.png" title="表情" id="imgbq"><img src="http://www.yxsss.com/ui/sk/e.png" title="上传图片"><form><input type="file" title="上传图片" id="upimg"></form></span>
    <p><input id="nrong"></p>
</div>
<div id="ems"><p></p><p class="tc"></p></div>
<script>
if(typeof(WebSocket)=='undefined'){
    alert('你的浏览器不支持 WebSocket ，推荐使用Google Chrome 或者 Mozilla Firefox'); 
}
</script>
<script src="http://www.yxsss.com/ui/p/a.js" type="text/javascript"></script>
<script>
(function(){
    var key='all',mkey;
    var users={};
    var url='ws://127.0.0.1:8000';
    var so=false,n=false;
    var lus=A.$('us'),lct=A.$('ct');
    function st(){
        n=prompt('请给自己取一个响亮的名字：');
        n=n.substr(0,16);
        if(!n){
            return ;   
        }
        //创建socket，注意URL的格式：ws://ip:端口
        so=new WebSocket(url);
        //握手监听函数
        so.onopen=function(){
            //状态为1证明握手成功，然后把client自定义的名字发送过去
            if(so.readyState==1){
                so.send('type=add&ming='+n);
            }
        }
         
        //握手失败或者其他原因连接socket失败，则清除so对象并做相应提示操作
        so.onclose=function(){
            so=false;
            lct.appendChild(A.$$('<p class="c2">退出聊天室</p>'));
        }
         
        //数据接收监听，接收服务器推送过来的信息，返回的数据给msg，然后进行显示
        so.onmessage=function(msg){
            eval('var da='+msg.data);
            var obj=false,c=false;
            if(da.type=='add'){
                var obj=A.$$('<p>'+da.name+'</p>');
                lus.appendChild(obj);
                cuser(obj,da.code);
                obj=A.$$('<p><span>['+da.time+']</span>欢迎<a>'+da.name+'</a>加入</p>');
                c=da.code;
            }else if(da.type=='madd'){
                mkey=da.code;
                da.users.unshift({'code':'all','name':'大家'});
                for(var i=0;i<da.users.length;i++){
                    var obj=A.$$('<p>'+da.users[i].name+'</p>');
                    lus.appendChild(obj);
                    if(mkey!=da.users[i].code){
                        cuser(obj,da.users[i].code);
                    }else{
                        obj.className='my';
                        document.title=da.users[i].name;
                    }
                }
                obj=A.$$('<p><span>['+da.time+']</span>欢迎'+da.name+'加入</p>');
                users.all.className='ck';
            }
             
            if(obj==false){
                if(da.type=='rmove'){
                    var obj=A.$$('<p class="c2"><span>['+da.time+']</span>'+users[da.nrong].innerHTML+'退出聊天室</p>');
                    lct.appendChild(obj);
                    users[da.nrong].del();
                    delete users[da.nrong];
                }else{
                    da.nrong=da.nrong.replace(/{\\(\d+)}/g,function(a,b){
                        return '<img src="sk/'+b+'.gif">';
                    }).replace(/^data\:image\/png;base64\,.{50,}$/i,function(a){
                        return '<img src="'+a+'">';
                    });
                    //da.code 发信息人的code
                    if(da.code1==mkey){
                        obj=A.$$('<p class="c3"><span>['+da.time+']</span><a>'+users[da.code].innerHTML+'</a>对我说：'+da.nrong+'</p>');
                        c=da.code;
                    }else if(da.code==mkey){
                        if(da.code1!='all')
                        obj=A.$$('<p class="c3"><span>['+da.time+']</span>我对<a>'+users[da.code1].innerHTML+'</a>说：'+da.nrong+'</p>');
                        else
                        obj=A.$$('<p><span>['+da.time+']</span>我对<a>'+users[da.code1].innerHTML+'</a>说：'+da.nrong+'</p>');
                        c=da.code1;
                    }else if(da.code==false){
                        obj=A.$$('<p><span>['+da.time+']</span>'+da.nrong+'</p>');
                    }else if(da.code1){
                        obj=A.$$('<p><span>['+da.time+']</span><a>'+users[da.code].innerHTML+'</a>对'+users[da.code1].innerHTML+'说：'+da.nrong+'</p>');
                        c=da.code;
                    }
                }
            }
            if(c){
                    obj.children[1].onclick=function(){
                        users[c].onclick();
                    }
                }
            lct.appendChild(obj);
            lct.scrollTop=Math.max(0,lct.scrollHeight-lct.offsetHeight);
             
        }
    }
    A.$('sd').onclick=function(){
        if(!so){
             return st();
        }
        var da=A.$('nrong').value.trim();
        if(da==''){
            alert('内容不能为空');
            return false;  
        }
        A.$('nrong').value='';
        so.send('nr='+esc(da)+'&key='+key);
    }
    A.$('nrong').onkeydown=function(e){
        var e=e||event;
        if(e.keyCode==13){
            A.$('sd').onclick();
        }
    }
    function esc(da){
        da=da.replace(/</g,'<').replace(/>/g,'>').replace(/\"/g,'"');
        return encodeURIComponent(da);
    }
    function cuser(t,code){
        users[code]=t;
        t.onclick=function(){
            t.parentNode.children.rcss('ck','');
            t.rcss('','ck');
            key=code;
        }
    }
    A.$('ltian').style.height=(document.documentElement.clientHeight - 70)+'px';
    st();
     
 
    var bq=A.$('imgbq'),ems=A.$('ems');
    var l=80,r=4,c=5,s=0,p=Math.ceil(l/(r*c));
    var pt='sk/';
    bq.onclick=function(e){
        var e=e||event;
        if(!so){
             return st();
        }
        ems.style.display='block';
        document.onclick=function(){
            gb();  
        }
        ct();
        try{e.stopPropagation();}catch(o){}
    }
     
    for(var i=0;i<p;i++){
        var a=A.$$('<a href="javascript:;">'+(i+1)+'</a>');
        ems.children[1].appendChild(a);
        ef(a,i);
    }
    ems.children[1].children[0].className='ck';
     
    function ct(){
        var wz=bq.weiz();
        with(ems.style){
            top=wz.y-242+'px';
            left=wz.x+bq.offsetWidth-235+'px';
        }
    }
         
    function ef(t,i){
        t.onclick=function(e){
            var e=e||event;
            s=i*r*c;
            ems.children[0].innerHTML='';
            hh();
            this.parentNode.children.rcss('ck','');
            this.rcss('','ck');
            try{e.stopPropagation();}catch(o){}
        }
    }
     
    function hh(){
        var z=Math.min(l,s+r*c);
        for(var i=s;i<z;i++){
            var a=A.$$('<img src="'+pt+i+'.gif">');
            hh1(a,i);
            ems.children[0].appendChild(a);
        }
        ct();
    }
     
    function hh1(t,i){
        t.onclick=function(e){
            var e=e||event;
            A.$('nrong').value+='{\\'+i+'}';
            if(!e.ctrlKey){
                gb();
            }
            try{e.stopPropagation();}catch(o){}
        }
    }
     
    function gb(){
        ems.style.display='';
        A.$('nrong').focus();
        document.onclick='';
    }
    hh();
    A.on(window,'resize',function(){
        A.$('ltian').style.height=(document.documentElement.clientHeight - 70)+'px';
        ct();
    }) 
 
    var fimg=A.$('upimg');
    var img=new Image();
    var dw=400,dh=300;
    A.on(fimg,'change',function(ev){
        if(!so){
            st();
            return false;
        }
        if(key=='all'){
            alert('由于资源限制 发图只能私聊');
            return false;  
        }
        var f=ev.target.files[0];
        if(f.type.match('image.*')){
            var r = new FileReader();
            r.onload = function(e){
                img.setAttribute('src',e.target.result);
            };
            r.readAsDataURL(f);
        }
    });
    img.onload=function(){
        ih=img.height,iw=img.width;
        if(iw/ih > dw/dh && iw > dw){
            ih=ih/iw*dw;
            iw=dw;
        }else if(ih > dh){
            iw=iw/ih*dh;
            ih=dh;
        }
        var rc = A.$$('canvas');
        var ct = rc.getContext('2d');
        rc.width=iw;
        rc.height=ih;
        ct.drawImage(img,0,0,iw,ih);
        var da=rc.toDataURL();
        so.send('nr='+esc(da)+'&key='+key);
    }
     
})();
</script>
</body>
</html>
```

![](https://upload-images.jianshu.io/upload_images/6943526-c24406e5d5fb25be.gif?imageMogr2/auto-orient/strip)
