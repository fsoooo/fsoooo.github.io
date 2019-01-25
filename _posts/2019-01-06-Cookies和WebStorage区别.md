**Cookie的诞生**
由于HTTP协议是无状态的，而服务器端的业务必须是要有状态的。Cookie诞生的最初目的是为了存储web中的状态信息，以方便服务器端使用。比如判断用户是否是第一次访问网站。目前最新的规范是RFC 6265，它是一个由浏览器服务器共同协作实现的规范。
**Cookie的实行步骤**
1.服务器像客户端发送cookie。
2.浏览器将将cookie以key/value保存到某个目录的文本文件内。
3.之后每次http请求浏览器都会将cookie发送给服务器端。（前提是浏览器设置为启用cookie）
4.cookie通过HTTP请求报文和响应报文配合完成会话过程。
**cookie 的缺点**
1.cookie体积过大会造成请求和响应速度变慢。
2.默认浏览器会任何请求都把cookie带上去（即使不需要），哪怕是静态资源。
3.cookie可以在前后端修改，数据容易篡改或伪造。
4.cookie对于敏感数据的保护基本是无效的。
5.有些用户是禁用掉cookie的。
6.cookie 不能跨越多个域名使用。
7.单个 cookie 保存的数据不能超过 4k ，很多浏览器都限制一个站点最多保存 20 个 cookie。

为了破解Cookie的一系列限制，HTML5通过JS的新的API就能直接存储大量的数据到客户端浏览器，而且支持复杂的本地数据库，让JS更有效率。 HTML5支持两种的**WebStorage**：
**1.永久性的本地存储（localStorage）：持久化的本地存储（浏览器关闭重新打开数据依然存在），:永久的，除非手动删除 。**
特点：
① 域内安全、永久保存。即客户端或浏览器中来自同一域名的所有页面都可访问localStorage数据且数据除了删除否则永久保存，但客户端或浏览器之间的数据相互独立。
② 数据不会随着Http请求发送到后台服务器；
③ 存储数据的大小机会不用考虑，因为在HTML5的标准中要求浏览器至少要支持到4MB。
**2.会话级别的本地存储（sessionStorage）： 针对一个session的本地存储，临时的，窗口关闭就没有了。（会话级别）。**
特点：
①会话控制、短期保存。会话概念与服务器端的session概念相似，短期保存指窗口或浏览器或客户端关闭后自动消除数据。 

**Cookie和webstorage区别 **
![image.png](https://upload-images.jianshu.io/upload_images/6943526-2f289367062d4d05.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**webStorage的优势：**
相比cookie存储容量增加
可以将请求的表单数据存于本地，减少http请求，节约带宽
webStorage拥有易用的API
**webStorage的局限性：**
不同浏览器webStorage 和LocalStorage的大小不统一。
在浏览器的隐私模式下面是不可读取的
本质上是对字符串的读取，因此存储内容过多时页面会变卡
不能被爬虫抓取到
