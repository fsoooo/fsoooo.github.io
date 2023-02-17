以前的项目中有用到redis的keys命令来获取某些key，这个命令在数据库特别大的情况会block很长一段时间，所以有很大的安全隐患，所以打算优化一下。 

![](https://upload-images.jianshu.io/upload_images/6943526-670ecc49d4cd44e2.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

官网建议使用scan命令来代替。

于是就用了……

以下是使用scan命令来匹配相应模式的key的代码：

```
$redis = new Redis();
$redis->connect('localhost', 6379);
 
$iterator = null;
while ($keys = $redis->scan($iterator, 'test*')) 
{ 
    foreach ($keys as $key) { 
        echo $key . PHP_EOL;
    }
}
```

使用keys命令可以得到设置的”test1″,”test2″,…..,”test5″这5个key，但是使用scan却什么也没有输出。
```
……

…………

………………
```
经过多方分析，最终发现，是scan命令的返回值有问题。

其实redis的官方文档也明确说了，scan命令每次迭代的时候，有可能返回空，但这并不是结束的标志，而是当返回的迭代的值为”0″时才算结束。

因此，上面的代码在迭代的时候，若没有key返回，$keys是个空数组，所以while循环自然就中断了，所以没有任何输出。

这种情况在redis中key特别多的时候尤其明显，当key只有几十个上百个的时候，很少会出现这种情况，但是当key达到上千万，这种情况几乎必现。

要减少这种情况的出现，可以通过将scan函数的第三个参数count设定为一个较大的数。

但这不是解决此问题的根本办法，根本办法有以下两种：

### **1.setOption**

通过setOption函数来设定迭代时的行为。以下是示例代码：

```

$redis = new Redis();
$redis->connect('localhost', 6379);
$redis->setOption(Redis::OPT_SCAN,Redis::SCAN_RETRY);
 
$iterator = null;
while ($keys = $redis->scan($iterator, 'test*')) {
    foreach ($keys as $key) { 
        echo $key . PHP_EOL;
    }
}
```

和上面的代码相比，只是多了个setOption的操作，这个操作的作用是啥呢？

这个操作就是告诉redis扩展，当执行scan命令后，返回的结果集为空的话，函数不返回，而是直接继续执行scan命令，当然，这些步骤都是由扩展自动完成，当scan函数返回的时候，要么返回false，即迭代结束，未发现匹配模式pattern的key，要么就返回匹配的key，而不再会返回空数组了。

### **2.while(true)**

上面那种方式是由php的扩展自动完成的，那么我们也可以换一种写法来达到相同的效果。

```
$redis = new Redis();
$redis->connect('localhost', 6379);
 
$iterator = null;
while (true) {
    $keys = $redis->scan($iterator, 'test*'); 
    if ($keys === false) {
        //迭代结束，未找到匹配pattern的key
        return;
    }
    foreach ($keys as $key) {
        echo $key . PHP_EOL;
    }
}
```

![](https://upload-images.jianshu.io/upload_images/6943526-f838d4d111e0b152.gif?imageMogr2/auto-orient/strip)

