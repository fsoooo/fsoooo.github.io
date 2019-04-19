刚开始使用vue对接后端接口时，PHP后端一直接受不到前端传的参数。找了很久，发现vue请求接口传参的形式是流的方式，因此后端要在接受数据的方面做一些改变。这里我用的是PHP原生方法file_get_contents。
####file_get_contents("php://input")的使用方法
php://input 是个可以访问请求的原始数据的只读流。 POST 请求的情况下，最好使用 php://input 来代替 ，因为它不依赖于特定的 php.ini 指令。 
而且，enctype="multipart/form-data" 的时候 php://input 是无效的。
下面是使用中的一些要点：
```
1.php://input 可以读取http entity body中指定长度的值,由Content-Length指定长度,不管是POST方式或者GET方法提交过来的数据。但是，一般GET方法提交数据 时，http request entity body部分都为空。 
2.php://input 与$HTTP_RAW_POST_DATA读取的数据是一样的，都只读取Content-Type不为multipart/form-data的数据。
3.Coentent-Type仅在取值为application/x-www-data-urlencoded和multipart/form-data两种情况下，PHP才会将http请求数据包中相应的数据填入全局变量$_POST 
4.PHP不能识别的Content-Type类型的时候，会将http请求包中相应的数据填入变量$HTTP_RAW_POST_DATA 
5. 只有Coentent-Type为multipart/form-data的时候，PHP不会将http请求数据包中的相应数据填入php://input，否则其它情况都会。填入的长度，由Coentent-Length指定。 
6.只有Content-Type为application/x-www-data-urlencoded时，php://input数据才跟$_POST数据相一致。 
7.php://input数据总是跟$HTTP_RAW_POST_DATA相同，但是php://input比$HTTP_RAW_POST_DATA更凑效，且不需要特殊设置php.ini 
8.PHP会将PATH字段的query_path部分，填入全局变量$_GET。通常情况下，GET方法提交的http请求，body为空。
 ```
####代码实例
  1.接收XML数据(php用file_get_contents("php://input")或者$HTTP_RAW_POST_DATA可以接收xml数据)
```
<!--?php
     $xml = '<xml-->xmldata';//要发送的xml
     $url = 'http://localhost/test/getXML.php';//接收XML地址
     $header = 'Content-type: text/xml';//定义content-type为xml
     $ch = curl_init(); //初始化curl
     curl_setopt($ch, CURLOPT_URL, $url);//设置链接
     curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);//设置是否返回信息
     curl_setopt($ch, CURLOPT_HTTPHEADER, $header);//设置HTTP头
     curl_setopt($ch, CURLOPT_POST, 1);//设置为POST方式
     curl_setopt($ch, CURLOPT_POSTFIELDS, $xml);//POST数据
     $response = curl_exec($ch);//接收返回信息
     if(curl_errno($ch)){//出错则显示错误信息
     print curl_error($ch);
     }
     curl_close($ch); //关闭curl链接
     echo $response;//显示返回信息
?>
```
 2.上传文件
```
<!--?php
     //@file phpinput_post.php
     $data=file_get_contents('btn.png');
     $http_entity_body = $data;
     $http_entity_type = 'application/x-www-form-urlencoded';
     $http_entity_length = strlen($http_entity_body);
     $host = '127.0.0.1';
     $port = 80;
     $path = '/image.php';
     $fp = fsockopen($host, $port, $error_no, $error_desc, 30);
     if ($fp){
        fputs($fp, "POST {$path} HTTP/1.1\r\n");
        fputs($fp, "Host: {$host}\r\n");
        fputs($fp, "Content-Type: {$http_entity_type}\r\n");
        fputs($fp, "Content-Length: {$http_entity_length}\r\n");
        fputs($fp, "Connection: close\r\n\r\n");
        fputs($fp, $http_entity_body . "\r\n\r\n");
        while (!feof($fp)) {
         $d .= fgets($fp, 4096);
        }
        fclose($fp);
        echo $d;
     }
?-->
```
3.接收文件
```
<!--?php
        /**
         *Recieve image data
        **/   
        error_reporting(E_ALL);
     function get_contents() {   
        $xmlstr= file_get_contents("php://input");
        $filename=time().'.png';
        if(file_put_contents($filename,$xmlstr)){
         echo 'success';
        }else{
         echo 'failed';
        }
        }
        get_contents();
?-->
```
 3.获取HTTP请求原文
```
/**
     * 获取HTTP请求原文
     * @return string
     */
    function get_http_raw() {
     $raw = '';
     // (1) 请求行
     $raw .= $_SERVER['REQUEST_METHOD'].' '.$_SERVER['REQUEST_URI'].' '.$_SERVER['SERVER_PROTOCOL']."\r\n";
     // (2) 请求Headers
     foreach($_SERVER as $key => $value) {
        if(substr($key, 0, 5) === 'HTTP_') {
         $key = substr($key, 5);
         $key = str_replace('_', '-', $key);
         $raw .= $key.': '.$value."\r\n";
        }
     }
     // (3) 空行
     $raw .= "\r\n";
     // (4) 请求Body
     $raw .= file_get_contents('php://input');
     return $raw;
}
```
