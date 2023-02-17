# 一、问题背景

![](https://upload-images.jianshu.io/upload_images/6943526-a61b9030e7109c8f.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

在500万数量级的情况下，单表查询速度在30多秒，需要对sql进行优化，sql如下：

![](https://upload-images.jianshu.io/upload_images/6943526-593819133674cdbb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

在测试环境构造了500万条数据，模拟了这个慢查询。

简单来说，就是查询一定条件下，都有哪些用户的，很简单的sql，可以看到，查询耗时为37秒。

说一下app_account字段的分布情况，随机生成了5000个不同的随机数，然后分布到了这500万条数据里，平均来说，每个app_account都会有1000个是重复的值，种类共有5000个。

# 二、看执行计划

![](https://upload-images.jianshu.io/upload_images/6943526-b9729995b20993a3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

可以看到，group by字段上加了索引的，也用到了。

# 三、优化

## 思路一：

后面应该加上 order by null；避免无用排序，但其实对结果耗时影响不大，还是很慢。

![](https://upload-images.jianshu.io/upload_images/6943526-93de8d40ab4d526c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 思路二：

where条件太复杂，没索引，导致查询慢，给where条件的所有字段加上了组合索引，也还是没用

![](https://upload-images.jianshu.io/upload_images/6943526-1f0709eb1c684064.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](https://upload-images.jianshu.io/upload_images/6943526-38f1b37b72b4bb30.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 思路三：

既然group by慢，换distinct试试？？

![](https://upload-images.jianshu.io/upload_images/6943526-845de32f4094c999.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

卧槽？？？！！！

这是什么情况，瞬间这么快了？？！！！

虽然知道group by和distinct有很小的性能差距，但是真没想到，差距居然这么大！！！

大发现啊！！

你以为这就结束了吗？

这个bug转给测试后，测试一测，居然还是30多秒！？这是什么情况！！？？？

什么情况，同一个库，同一个sql，怎么在两台电脑执行的差距这么大！

后来直接在服务器上执行：

![](https://upload-images.jianshu.io/upload_images/6943526-24ac69add38a6b9b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

 醉了，居然还是30多秒。。。。

那看来就是设备的问题了。

后来经过多次实验，最后得出的结论是：**是因为用的SQLyog！**

哎，现在发现了，只有用sqlyog执行这个“优化后”的sql会是0.8秒，在navicat和服务器上直接执行，都是30多秒。

那就是sqlyog的问题了，现在也不清楚sqlyog是不是做什么优化了，这个慢查询的问题还在解决中（觉得问题可能是出在mysql自身的参数上吧）。

这里只是记录下这个坑，sqlyog执行sql速度，和服务器执行sql速度，在有的sql中差异巨大，并不可靠。

# 四、解决

1.所谓的sqlyog查询快，命令行查询慢的现象，已经找到原因了。

是因为sqlyog会在查询语句后默认加上limit 1000，所以导致很快。

2.已经试验过的方法（都没有用）：

①给app_account字段加索引。

②给sql语句后面加order by null。

③调整where条件里字段的查询顺序，有索引的放前面。

④给所有where条件的字段加组合索引。

⑤用子查询的方式，先查where条件里的内容，再去重。

测试环境和现网环境数据还是有点不一样的，贴一张现网执行sql的图（1分钟。。。）：

![](https://upload-images.jianshu.io/upload_images/6943526-f911219852d2d212.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

后来发现，explain执行计划里，索引好像并没有用到创建的idx_end_time。

然后果断在现网试了下，强制指定使用idx_end_time索引，结果只要0.19秒！

![](https://upload-images.jianshu.io/upload_images/6943526-9897d89d4fd87126.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

至此问题解决，其实昨天也在怀疑，是不是这个表索引建的太多了，导致用的不对，原本用的是idx_org_id和idx_mvno_id。

现在强制指定idx_end_time就ok了！

最后再对比下改前后的执行计划：

改之前（查询要1分钟左右）：

![](https://upload-images.jianshu.io/upload_images/6943526-d49bd177eca6d049.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

改之后（查询只要几百毫秒）：

![](https://upload-images.jianshu.io/upload_images/6943526-fc23c34063c3452e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](https://upload-images.jianshu.io/upload_images/6943526-2adc2a68f731cc26.gif?imageMogr2/auto-orient/strip)

