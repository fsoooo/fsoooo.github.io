最早的Web服务器，可以简单地响应浏览器发来的HTTP请求，并将存储在服务器上的HTML文件返回给浏览器，也就是静态html。

随着时间的变化，网站也越来越复杂，所以出现动态技术。但是服务器并不能直接运行 php，asp这样的文件，自己不能做，外包给别人吧，但是要与第三做个约定，我给你什么，然后你给我什么，就是握把请求参数发送给你，然后我接收你的处 理结果给客户端。那这个约定就是 **common gateway interface，简称cgi**。**（cgi只是接口协议）**         

![image.png](https://upload-images.jianshu.io/upload_images/6943526-fed24d39aa1f69e1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


cgi就像翻译机，将PHP语言给服务器解释，便于相互之间的理解和通讯，最后呈现给浏览器查看

![请求的动态页面模型.jpg](https://upload-images.jianshu.io/upload_images/6943526-bb44eb53e04f4077.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


WEB服务器将根据CGI程序的类型决定数据向CGI程序的传送方式，一般来讲是通过标准输入/输出流和环境变量来与CGI程序间传递数据。 如下图所示：

![image.png](https://upload-images.jianshu.io/upload_images/6943526-df5df3ebe194e6ce.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


CGI程序通过标准输入（STDIN）和标准输出（STDOUT）来进行输入输出。此外CGI程序还通过环境变量来得到输入，操作系统提供了许 多环境变量，它们定义了程序的执行环境，应用程序可以存取它们。

Web服务器和CGI接口又另外设置了一些环境变量，用来向CGI程序传递一些重要的参 数。CGI的GET方法还通过环境变量QUERY-STRING向CGI程序传递Form中的数据。 下面是一些常用的CGI环境变量：

| 变量名          | 描述                                                         |
| --------------- | ------------------------------------------------------------ |
| CONTENT_TYPE    | 这个环境变量的值指示所传递来的信息的MIME类型。目前，环境变量CONTENT_TYPE一般都是：application/x-www-form-urlencoded,他表示数据来自于HTML表单。 |
| CONTENT_LENGTH  | 如果服务器与CGI程序信息的传递方式是POST，这个环境变量即使从标准输入STDIN中可以读到的有效数据的字节数。这个环境变量在读取所输入的数据时必须使用。 |
| HTTP_COOKIE     | 客户机内的 COOKIE 内容。                                     |
| HTTP_USER_AGENT | 提供包含了版本数或其他专有数据的客户浏览器信息。             |
| PATH_INFO       | 这个环境变量的值表示紧接在CGI程序名之后的其他路径信息。它常常作为CGI程序的参数出现。 |
| QUERY_STRING    | 如果服务器与CGI程序信息的传递方式是GET，这个环境变量的值即使所传递的信息。这个信息经跟在CGI程序名的后面，两者中间用一个问号'?'分隔。 |
| REMOTE_ADDR     | 这个环境变量的值是发送请求的客户机的IP地址，例如上面的192.168.1.67。这个值总是存在的。而且它是Web客户机需要提供给Web服务器的唯一标识，可以在CGI程序中用它来区分不同的Web客户机。 |
| REMOTE_HOST     | 这个环境变量的值包含发送CGI请求的客户机的主机名。如果不支持你想查询，则无需定义此环境变量。 |
| REQUEST_METHOD  | 提供脚本被调用的方法。对于使用 HTTP/1.0 协议的脚本，仅 GET 和 POST 有意义。 |
| SCRIPT_FILENAME | CGI脚本的完整路径                                            |
| SCRIPT_NAME     | CGI脚本的的名称                                              |
| SERVER_NAME     | 这是你的 WEB 服务器的主机名、别名或IP地址。                  |
| SERVER_SOFTWARE | 这个环境变量的值包含了调用CGI程序的HTTP服务器的名称和版本号。例如，上面的值为Apache/2.2.14(Unix) |

## CGI

CGI全称是 **公共网关接口**`（Common Gateway Interface)`，HTTP服务器与你的或其它机器上的程序进行交谈的一种工具，其程序须运行在网络服务器上。

CGI可以用任何一种语言编写，只要这种语言具有标准输入、输出和环境变量。如php,perl,tcl等。

CGI是HTTP Server和一个独立的进程之间的协议，把HTTP Request的Header设置成进程的环境变量，HTTP Request的正文设置成进程的标准输入，而进程的标准输出就是HTTP Response包括Header和正文。

## FastCGI

FastCGI像是一个**常驻(long-live)**型的CGI，它可以一直执行着，只要激活后，不会每次都要花费时间去fork一次（这是CGI最为人诟病的fork-and-execute 模式）。它还支持分布式的运算，即 FastCGI 程序可以在网站服务器以外的主机上执行并且接受来自其它网站服务器来的请求。

FastCGI是语言无关的、可伸缩架构的CGI开放扩展，其主要行为是将CGI解释器进程保持在内存中并因此获得较高的性能。众所周知，CGI解释器的反复加载是CGI性能低下的主要原因，如果CGI解释器保持在内存中并接受FastCGI进程管理器调度，则可以提供良好的性能、伸缩性、Fail- Over特性等等。

FASTCGI是和HTTP协议类似的概念。无非就是规定了在同一个TCP连接里怎么同时传多个HTTP连接。这实际上导致了个问题，有个HTTP连接传个大文件不肯让出FASTCGI连接，在同一个FASTCGI连接里的其他HTTP连接就傻了。所以Lighttpd? 引入了 X-SENDFILE 。

#### FastCGI特点

FastCGI具有语言无关性.

FastCGI在进程中的应用程序，独立于核心web服务器运行，提供了一个比API更安全的环境。APIs把应用程序的代码与核心的web服务器链接在一起，这意味着在一个错误的API的应用程序可能会损坏其他应用程序或核心服务器。 恶意的API的应用程序代码甚至可以窃取另一个应用程序或核心服务器的密钥。

FastCGI技术目前支持语言有：C/C++、Java、Perl、Tcl、Python、SmallTalk、Ruby等。相关模块在Apache, ISS, Lighttpd等流行的服务器上也是可用的。

FastCGI的不依赖于任何Web服务器的内部架构，因此即使服务器技术的变化, FastCGI依然稳定不变。



#### FastCGI的工作原理

Web Server启动时载入FastCGI进程管理器（IIS ISAPI或Apache Module)

FastCGI进程管理器自身初始化，启动多个CGI解释器进程(可见多个php-cgi)并等待来自Web Server的连接。

当客户端请求到达Web Server时，FastCGI进程管理器选择并连接到一个CGI解释器。Web server将CGI环境变量和标准输入发送到FastCGI子进程php-cgi。

FastCGI子进程完成处理后将标准输出和错误信息从同一连接返回Web Server。当FastCGI子进程关闭连接时，请求便告处理完成。FastCGI子进程接着等待并处理来自FastCGI进程管理器(运行在Web Server中)的下一个连接。 在CGI模式中，php-cgi在此便退出了。

在上述情况中，你可以想象CGI通常有多慢。每一个Web请求PHP都必须重新解析php.ini、重新载入全部扩展并重初始化全部数据结构。使用FastCGI，所有这些都只在进程启动时发生一次。一个额外的好处是，持续数据库连接(Persistent database connection)可以工作。

#### FastCGI的不足

因为是多进程，所以比CGI多线程消耗更多的服务器内存，PHP-CGI解释器每进程消耗7至25兆内存，将这个数字乘以50或100就是很大的内存数。



### fastcgi跟cgi的区别是：​        

|          | 在web服务器方面                               | 在对数据进行处理的进程方面                        |
| -------- | --------------------------------------------- | ------------------------------------------------- |
| CGI      | fork一个新的进程进行处理                      | 读取参数，处理数据，然后就结束生命期              |
| FAST-CGI | 用tcp方式跟远程机子上的进程或本地进程建立连接 | 要开启tcp端口，进入循环，等待数据的到来，处理数据 |


举个例子: 服务端现在有个10万个字单词， 客户每次会发来一个字符串，问以这个字符串为前缀的单词有多少个。 那么可以写一个程序，这个程序会建一棵trie树，然后每次用户请求过来时可以直接到这个trie去查找。 但是如果以cgi的方式的话，这次请求结束后这课trie也就没了，等下次再启动该进程时，又要新建一棵trie树，这样的效率就太低下了。   而用fastcgi的方式的话，这课trie树在进程启动时建立，以后就可以直接在trie树上查询指定的前缀了。

##   apache 模块方式

　　记得曾在xp 配置 apache + php ，会在apache 配置下面一段：

```
LoadModule php5_module C:/php/php5apache2_2.dll
```

　　当PHP需要在Apache服务器下运行时，一般来说，它可以模块的形式集成， 此时模块的作用是接收Apache传递过来的PHP文件请求，并处理这些请求， 然后将处理后的结果返回给Apache。如果我们在Apache启动前在其配置文件中配置好了PHP模块， PHP模块通过注册apache2的ap_hook_post_config挂钩，在Apache启动的时候启动此模块以接受PHP文件的请求。

​     Apache 的Hook机制是指：Apache 允许模块(包括内部模块和外部模块，例如mod_php5.so，mod_perl.so等)将自定义的函数注入到请求处理循环中。 换句话说，模块可以在Apache的任何一个处理阶段中挂接(Hook)上自己的处理函数，从而参与Apache的请求处理过程。 mod_php5.so/ php5apache2.dll就是将所包含的自定义函数，通过Hook机制注入到Apache中，在Apache处理流程的各个阶段负责处理php请 求。

有人测试nginx+PHP-FPM在高并发情况下可能会达到Apache+mod_php5的5~10倍，现在nginx+PHP-FPM使用的人越来越多。

## cgi 与 fastcgi

CGI工作原理：每当客户请求CGI的时候，WEB服务器就请求操作系统生成一个新的CGI解释器进程(如php-cgi.exe)，CGI 的一个进程则处理完一个请求后退出，下一个请求来时再创建新进程。当然，这样在访问量很少没有并发的情况也行。可是当访问量增大，并发存在，这种方式就不 适合了。于是就有了fastcgi。

FastCGI像是一个常驻(long-live)型的CGI，它可以一直执行着，只要激活后，不会每次都要花费时间去fork一次（这是CGI最为人诟病的fork-and-execute 模式）。

　　**一般情况下，FastCGI的整个工作流程是这样的：**

　　**1.Web Server启动时载入FastCGI进程管理器（IIS ISAPI或Apache Module)**

​        **2.FastCGI进程管理器自身初始化，启动多个CGI解释器进程(可见多个php-cgi)并等待来自Web Server的连接。**

​        **3.当客户端请求到达Web Server时，FastCGI进程管理器选择并连接到一个CGI解释器。 Web server将CGI环境变量和标准输入发送到FastCGI子进程php-cgi。**

​        **4.FastCGI 子进程完成处理后将标准输出和错误信息从同一连接返回Web Server。当FastCGI子进程关闭连接时， 请求便告处理完成。FastCGI子进程接着等待并处理来自FastCGI进程管理器(运行在Web Server中)的下一个连接。 在CGI模式中，php-cgi在此便退出了。**

​        **PHP-FPM与Spawn-FCGI**

　　**Spawn-FCGI是一个通用的FastCGI管理服务器，它是lighttpd中的一部份，很多人都用Lighttpd的Spawn-FCGI进行FastCGI模式下的管理工作。 但是有缺点，于是PHP-fpm就是针对于PHP的，Fastcgi的一种实现，他负责管理一个进程池，来处理来自Web服务器的请求。目前，PHP-fpm是内置于PHP的。**





## PHP-CGI

PHP-CGI是PHP自带的FastCGI管理器。

PHP-CGI的不足：

php-cgi变更php.ini配置后需重启php-cgi才能让新的php-ini生效，不可以平滑重启。

直接杀死php-cgi进程，php就不能运行了。(PHP-FPM和Spawn-FCGI就没有这个问题，守护进程会平滑从新生成新的子进程。）

php-cgi是php提供给web serve也就是http前端服务器的cgi协议接口程序，当每次接到http前端服务器的请求都会开启一个php-cgi进程进行处理，而且开启的php-cgi的过程中会先要重载配置，数据结构以及初始化运行环境，如果更新了php配置，那么就需要重启php-cgi才能生效，例如phpstudy就是这种情况。

## PHP-FPM

PHP-FPM是一个PHP FastCGI管理器，是只用于PHP的，可以在 <http://php-fpm.org/download>下载得到。

PHP-FPM其实是PHP源代码的一个补丁，旨在将FastCGI进程管理整合进PHP包中。必须将它patch到你的PHP源代码中，在编译安装PHP后才可以使用。

现在我们可以在最新的PHP 5.3.2的源码树里下载得到直接整合了PHP-FPM的分支，据说下个版本会融合进PHP的主分支去。相对Spawn-FCGI，PHP-FPM在CPU和内存方面的控制都[更胜一筹](https://www.baidu.com/s?wd=%E6%9B%B4%E8%83%9C%E4%B8%80%E7%AD%B9&tn=24004469_oem_dg&rsv_dl=gh_pl_sl_csd)，而且前者很容易崩溃，必须用crontab进行监控，而PHP-FPM则没有这种烦恼。

PHP5.3.3已经集成php-fpm了，不再是第三方的包了。PHP-FPM提供了更好的PHP进程管理方式，可以有效控制内存和进程、可以平滑重载PHP配置，所以被PHP官方收录了。

PHP-FPM的使用非常方便，配置都是在PHP-FPM.ini的文件内，而启动、重启都可以从php/sbin/PHP-FPM中进行。更方便的是修改php.ini后可以直接使用PHP-FPM reload进行加载，无需杀掉进程就可以完成php.ini的修改加载

结果显示使用PHP-FPM可以使php有不小的性能提升。PHP-FPM控制的进程cpu回收的速度比较慢,内存分配的很均匀。

而PHP-FPM合理的分配，导致总体响应的提到以及任务的平均。

php-fpm是php提供给web serve也就是http前端服务器的fastcgi协议接口程序，它不会像php-cgi一样每次连接都会重新开启一个进程，处理完请求又关闭这个进程，而是允许一个进程对多个连接进行处理，而不会立即关闭这个进程，而是会接着处理下一个连接。它可以说是php-cgi的一个管理程序，是对php-cgi的改进。

php-fpm会开启多个php-cgi程序，并且php-fpm常驻内存，每次web serve服务器发送连接过来的时候，php-fpm将连接信息分配给下面其中的一个子程序php-cgi进行处理，处理完毕这个php-cgi并不会关闭，而是继续等待下一个连接，这也是fast-cgi加速的原理，但是由于php-fpm是多进程的，而一个php-cgi基本消耗7-25M内存，因此如果连接过多就会导致内存消耗过大，引发一些问题，例如nginx里的502错误。

同时php-fpm还附带一些其他的功能：

例如平滑过渡配置更改，普通的php-cgi在每次更改配置后，需要重新启动才能初始化新的配置，而php-fpm是不需要，php-fpm分将新的连接发送给新的子程序php-cgi，这个时候加载的是新的配置，而原先正在运行的php-cgi还是使用的原先的配置，等到这个连接后下一次连接的时候会使用新的配置初始化，这就是平滑过渡。

### 使用场景

1. 一般web服务器接受到浏览器的请求时，如果是静态资源的话就直接将其返回给浏览器，如果是动态资源的话那就没有现成的资源返回了，那这个时候cgi就出场了

2. cgi可以理解为一种协议or一类处理程序，就是动态去生成文件，从程序上来理解就是web服务器exec这样一个进程，然后交给他一些输入参数，他就慢慢的处理完后把结果返回给web服务器，那从协议层面来说cgi协议就是规范了web服务器和cgi程序的一些输入输出参数的含义
3. 所以可以有很多不同的cgi程序，别可以执行php脚本的or可以执行python脚本的，只要符合这类规范就能供web服务器调用，当然它的缺点就是每次都需要去启动这个cgi程序，这会使得处理速度很慢
4. 针对这种缺陷加以改进就成了fastcgi，同样的他也可以理解为一种协议or一个程序，它跟cgi的不同就是不需要每次去exec，它会事先启动起来，作为一个cgi的管理服务器存在，预先启动一系列的子进程来等待处理，然后等待web服务器发过来的请求，一旦接受到请求就交由子进程处理，这样由于不需要在接受到请求后启动cgi，会快很多。
5. phpfpm是php对fastcgi的一种具体实现，它的启动后会创建多个cgi子进程，然后主进程负责管理子进程，同时它对外提供一个socket，那web服务器当要转发一个动态请求时只需要按照fastcgi协议要求的格式将数据发往这个socket的就可以了，那phpfpm创建的子进程去争抢这个socket连接，谁抢到了谁处理并将结果返回给web服务器，那phpfpm主进程干什么了？比方说其中一个子进程异常退出了怎么办，那phpfpm会去监控他一旦发现一个cgi子进程就会又启动一个，还有其他诸多管理功能
6. phpfpm作为一个独立的进程存在 通过socket与nginx建立连接，而mod_php 是作为一个模块被加载进了apache服务器，同时他们两作为cgi调度管理器，他们对其管理的方式也不一样

通俗的可以把服务器看作餐厅，用户请求看作来用餐的顾客，服务器处理请求看作解决顾客的就餐问题（响应输出一份饭）。

服务器上静态资源看作已做好的饭，只要放到餐盒里就可以返回给顾客，动态资源需要厨房大厨现成做份再放到餐盒里返回给顾客。

php_mod这个大厨有个特点，看见有顾客进门就点火，不管顾客要不要现做的，有点浪费资源

php_fpm这个大厨有好多小弟一直点着火（多个处理进程），等有顾客说要现做，大厨就安排小弟做份返回给客户

cgi也是个大厨，不过他等到顾客要现做，他才点火，做饭，然后熄火。等待下一个要现做的到来

fastcgi呢就是个大厨雇了一帮小弟，专门做需要现场做的饭，大厨只管分派任务，小弟真正操锅做饭。
