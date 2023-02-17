![](https://upload-images.jianshu.io/upload_images/6943526-8ab135f731bd121c.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

在WEB开发中，经常会有过多少毫秒就重复执行一次某操作的需求，也就是定时器。

JS中的定时器有两个：

```
setInterval() ：按照指定的周期（以毫秒计）来调用函数或计算表达式。
方法会不停地调用函数，直到 clearInterval() 被调用或窗口被关闭。

setTimeout() ：在指定的毫秒数后调用函数或计算表达式。

```

### 为什么尽量别用setInterval?

#####原因之一：setInterval无视代码错误

setInterval有个讨厌的习惯，即对自己调用的代码是否报错这件事漠不关心。

换句话说，如果setInterval执行的代码由于某种原因出了错，它还会持续不断（不管不顾）地调用该代码。

```
function a() {
    try {
        a.error.here;
    }catch(e) {
        $('body').append('<div>' + e.toString() + '</div>');
        throw e;
    }
}

function b() {
    try {
        b.error.here;
    } catch(e) {
        $('body').append('<div>' + e.toString() + '</div>');
        throw e;
    }
    setTimeout(b, 2000);
}
setInterval(a, 2000);
setTimeout(b, 2000);
```

#####原因之二：setInterval无视网络延迟

假设你每隔一段时间就通过Ajax轮询一次服务器，看看有没有新数据

>注意：如果你真的这么做了，那恐怕你做错了；
建议使用“补偿性轮询”（backoff polling）[1]。

而由于某些原因（服务器过载、临时断网、流量剧增、用户带宽受限等等），你的请求要花的时间远比你想象的要长。

但setInterval不在乎。它仍然会按定时持续不断地触发请求，最终你的客户端网络队列会塞满Ajax调用。

```
var n = 0, t = 0, u = 0, i, 
s = 'Stopping after 25 requests, to avoid killing jsfiddle’s server';
function a() {
    $.post('/ajax_html_echo/', function() {
        --n;
    });
    ++n;
    ++t;
    $('#reqs').html(n + ' a() requests in progress!');
    if(t > 25){
        clearInterval(i);
        $('#reqs').html(s);
    }
}

function b() {
    ++u;
    $.post('/ajax_html_echo/', function() {
        $('#req2').html('b(): ' + new Date().toString());
        if(u <= 25){
            setTimeout(b, 500);
        }else {
            $('#req2').html(s);
        }
    });
}
i = setInterval(a, 500);
setTimeout(b, 500)
```
#####原因之三：setInterval不保证执行

与setTimeout不同，你并不能保证到了时间间隔，代码就准能执行。

如果你调用的函数需要花很长时间才能完成，那某些调用会被直接忽略。

```
function slow() {
    $.ajax({
        url: '/echo/html/',
        async: false,
        data: {
            delay: 1
        },
        complete: function () {
        }
    });

    $('#reqs').text(~~((new Date() - start) / 100) + ' expected, ' + iters + ' actual');

    if (iters++ > 4) {
        $('#reqs').append('<br>Stopping after 5 iterations');
        clearInterval(iv);
    }
};
```

![](https://upload-images.jianshu.io/upload_images/6943526-66facf56cce2b4d8.jpeg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#####解决之道很简单：用setTimeout

与其使用setInterval，不如在适当的时刻通过setTimeout来调用函数自身。

在前面两个示例中，使用setInterval的函数a都出错了，而使用setTimeout的函数b则表现很好。

如果必须保证间隔相等怎么办？

如果确实要保证事件“匀速”被触发，那可以用希望的延迟减去上次调用所花时间，然后将得到的差值作为延迟动态指定给setTimeout。

>**不过，要注意的是JavaScript的计时器并不是非常精确[2]。**

因此你不可能得到绝对“平均”的延迟，即使使用setInterval也不行，原因很多（比如垃圾回收、JavaScript是单线程的，等等）。

此外，当前浏览器也会将最小的超时时间固定在4ms到15ms之间。

因此不要指望一点误差也没有。

![](https://upload-images.jianshu.io/upload_images/6943526-0ff49595154fef9d.gif?imageMogr2/auto-orient/strip)

