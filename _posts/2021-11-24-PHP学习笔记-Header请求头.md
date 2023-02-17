```
header('HTTP/1.1 200 OK'); // ok 正常访问

header('HTTP/1.1 404 Not Found'); //通知浏览器 页面不存在

header('HTTP/1.1 301 Moved Permanently'); //设置地址被永久的重定向 301

header('Location: [http://www.ithhc.cn/](http://www.ithhc.cn/)'); //跳转到一个新的地址

header('Refresh: 10; url=[http://www.ithhc.cn/](http://www.ithhc.cn/)'); //延迟转向 也就是隔几秒跳转

header('X-Powered-By: PHP/6.0.0'); //修改 X-Powered-By信息

header('Content-language: en'); //文档语言

header('Content-Length: 1234'); //设置内容长度

header('Last-Modified: '.gmdate('D, d M Y H:i:s', $time).' GMT'); //告诉浏览器最后一次修改时间

header('HTTP/1.1 304 Not Modified'); //告诉浏览器文档内容没有发生改变

```
###内容类型

```
header('Content-Type: text/html; charset=utf-8'); //网页编码

header('Content-Type: text/plain'); //纯文本格式

header('Content-Type: image/jpeg'); //JPG、JPEG

header('Content-Type: application/zip'); // ZIP文件

header('Content-Type: application/pdf'); // PDF文件

header('Content-Type: audio/mpeg'); // 音频文件

header('Content-type: text/css'); //css文件

header('Content-type: text/javascript'); //js文件

header('Content-type: application/json'); //json

header('Content-type: application/pdf'); //pdf

header('Content-type: text/xml'); //xml

header('Content-Type: application/x-shockw**e-flash'); //Flash动画
```

###声明一个下载的文件

```
header('Content-Type: application/octet-stream'); //声明输出的是二进制字节流

header('Accept-Ranges:bytes');//声明浏览器返回大小是按字节进行计算

header('Content-Disposition: attachment; filename="ITblog.zip"');

// 声明作为附件处理和下载后文件的名称//告诉浏览器文件的总大小

//告诉浏览器文件的总大小    $fileSize = filesize($filePath);//坑 filesize 如果超过2G 低版本php会返回负数    

header('Content-Length:' . $fileSize); //注意是'Content-Length:' 非Accept-Length

header('Content-Transfer-Encoding: binary');

readfile('test.zip');
```
###对当前文档禁用缓存
```
header('Cache-Control: no-cache, no-store, max-age=0, must-revalidate');

header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
```
###显示一个需要验证的登陆对话框
```
header('HTTP/1.1 401 Unauthorized');

header('WWW-Authenticate: Basic realm="Top Secret"'); 
```
###声明一个需要下载的xls文件
```
header('Content-Disposition: attachment; filename=ithhc.xlsx');

header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

header('Content-Length: '.filesize('./test.xls'));

header('Content-Transfer-Encoding: binary');

header('Cache-Control: must-revalidate');

header('Pragma: public')
```
###实际使用：
```
<?php 
ini_set('memory_limit', '1024M'); // 设置php可以使用的内存大小为 1G

set_time_limit(0); // 超时时间不限制
 
$filename = DOCUMENT_ROOT . 'logs/start/start.zip';// 存储位置（DOCUMENT_ROOT【ci框架】）
 
// ###### 这里是下载zip文件  ###########

header('Content-Description: File Transfer'); // 响应头: 文件传输

header('Content-Type: application/octet-stream');  // 声明输出的是二进制字节流

header('Content-Disposition: attachment; filename=企业信息.zip'); // 文件名

header('Content-Transfer-Encoding: binary');  // 告诉浏览器，这是二进制文件

header('Expires: 0'); // 在代理服务器端防止缓冲

header('Cache-Control: must-revalidate, post-check=0, pre-check=0');// must-revalidate打开新窗口访问时都会重新访问服务器,pre-check扩展名定义了这样一段时间间隔（以秒记）

// 即post-check=0,pre-check=0是IE5.0才有的防cache声明
header('Pragma: public');// public 针对ie 相当于  no-cache

header('Content-Length: ' . filesize($filename)); // 描述HTTP消息实体的传输长度

ob_clean();   // 清空（擦掉）输出缓冲区

flush();      // 刷新输出缓冲

readfile($filename); // 输出文件

exit;
```
![endding.gif](https://upload-images.jianshu.io/upload_images/6943526-2d5e764a9c54cf8e.gif?imageMogr2/auto-orient/strip)
