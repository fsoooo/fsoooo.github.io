最近遇到了把我坑惨的一个update语句：

**`update apps set owner = '10011' and owner_name = 'xiaoming' where owner_code = '10010' and owner_name = 'lihua';`**

 **在MySQL里面update一条记录，语法都正确的，但记录并没有被更新...**

刚遇到这个问题的时候，我拿到这条语句直接在测试库里面执行了好几次，发现确实有问题。

测试SQL：**`update apps set owner = '43212' and owner_name = '李四' where owner_code = '13245' and owner_name = '张三';`**

执行之前的记录是这样的：

![](https://upload-images.jianshu.io/upload_images/6943526-969e2b305b71121a?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

执行之后的记录是这样的：

![](https://upload-images.jianshu.io/upload_images/6943526-a06553381b4beb84?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

可以看到，结果并不像这位开发同学说的“好像没有效果”，实际上是有效果的：

![](https://upload-images.jianshu.io/upload_images/6943526-54b909045acbbe6d?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

####**why?**

看起来，语法是完全没有问题，翻了翻MySQL官方文档的update语法：

![](https://upload-images.jianshu.io/upload_images/6943526-4596a9eda9bdc5b9?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

看到assignment_list的格式是以逗号分隔的col_name=value列表，一下子豁然开朗，开发同学想要的多字段更新语句应该这样写：

![](https://upload-images.jianshu.io/upload_images/6943526-d5ca1848532a30b8?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

倒回去再重试验一把：

![](https://upload-images.jianshu.io/upload_images/6943526-dfbc7bbe14c5a405?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

果然，这下得到了想要的结果！

**小结 ：** 在一条UPDATE语句中，如果要更新多个字段，字段间不能使用“AND”，而应该用逗号分隔。

**后记 ：**后面等有空的时候，又回过头来看了一下，为什么使用“AND”分隔的时候，会出现owner_code=0的奇怪结果？多次尝试之后发现：

![](https://upload-images.jianshu.io/upload_images/6943526-deba384da97f20cf?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

等价于：

![](https://upload-images.jianshu.io/upload_images/6943526-51096dce711d24cd?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

而 ('43212' and owner_name='李四') 是一个逻辑表达式，而这里不难知道owner_name并不是‘李四’。

因此，这个逻辑表达式的结果为 false ， false在MySQL中等价于0！
