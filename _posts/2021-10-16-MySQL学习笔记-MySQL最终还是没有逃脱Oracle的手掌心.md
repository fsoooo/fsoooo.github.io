![](https://upload-images.jianshu.io/upload_images/6943526-2ba16910bf8c2ffb.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

芬兰程序员Monty有三个孩子，分别叫做My, Maria, Max。

这三个孩子非常幸运，因为他们的父亲把他们的名字永远地“刻”在了三个数据库产品之上：

>**MySQL**
>**MaxDB**
>**MariaDB**

![](https://upload-images.jianshu.io/upload_images/6943526-b3bf795a33c1365d?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这位父亲就是MySQL的主要作者Michael Widenius，大家经常叫他Monty。

![](https://upload-images.jianshu.io/upload_images/6943526-2133ca85b2dd1bc5?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](https://upload-images.jianshu.io/upload_images/6943526-aa8f47644cb6f6c0?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

今天我们来聊一聊为什么是Monty创建了MySQL，MySQL又是怎么发展成为世界上最流行的开源数据库的。

###01.编程达人

Monty1962年出生于芬兰的赫尔辛基， 1978年，16岁的他发现了一件高科技产品：ABC80计算机。

![](https://upload-images.jianshu.io/upload_images/6943526-62059b4c30e2841e?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这个计算机的CPU只有4M Hz, 内存只有8K ，但是对于只玩过可编程计算器的Monty来说， 这才是真正的计算机。

于是Monty 找了一个“勤工俭学”的活儿：在赫尔辛基的街道上铺沥青， 虽然赚来了一笔钱，但还是不够，Monty老爸又出了一半的钱，这才成功地把ABC80抱回了家。

从此，Monty 整天和这台计算机“厮混”在一起。

Monty是个不折不扣的编程天才，对别人来说非常难的东西，他都能轻松搞定，编程对于他来说，就像读一本有趣的小说，或者玩一个游戏，不知不觉几个小时就过去了。

由于ABC80上没有多少软件，Monty小试牛刀， 用汇编语言把把游戏机上的一些热门游戏在这个机器上实现了！

![](https://upload-images.jianshu.io/upload_images/6943526-f8efd8b2c03d0cdd?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

可见游戏有着多么强大的驱动力！

两年以后，Monty又把ABC80升级成了 ABC800，此时的Monty已经不满足当一个游戏Boy了，开始在上面开发真正的软件了，比如：

>字处理器
>硬盘控制器
>磁带备份
>......

在一次演讲中，Monty说到：**那真是美好的旧时光， 你想使用计算机的话，得从底层学习计算机硬件和软件的方方面面，对于现代的程序员来说，没有这样的机会了。**

###02.“桃园三结义”

由于ABC 电脑是瑞典制造的，很多配件只有瑞典才有，Monty经常乘船去瑞典买配件，有一次去买内存的时候，Monty结识了Allan Larsson。

Allan开着一个电脑商店，有一家叫做TcX的咨询公司，Monty逐渐和他变得熟络起来。

得知Monty是个编程天才以后，Allan给了他一个数据库程序，请他基于这个数据库为客户开发一个软件出来。

Monty把数据库程序拿来一看就发现，这程序写得太烂，难以理解，难以维护， 既然如此，还不如重写一个。

大牛就是这么任性。

Monty写的数据库程序叫做Unireg，最初用Basic在ABC800 编写，到了1983年，Monty又用C语言重写了一遍， 这样就可以运行在一个有着2M内存的强大机器上。

![](https://upload-images.jianshu.io/upload_images/6943526-06ac6533bddffe18?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这就是Unireg的界面，纯文本，有点像打印机的格式。 虽然有点丑，但可以轻松地创建，更新数据库的数据，并且产生报表。

Monty和Allan都不会想到，这个看起来很简陋的数据库将来会一飞冲天，变成软件世界的中流砥柱：MySQL！

有了数据库，Allan拉来了更多的活儿，Monty作为TcX唯一的开发人员，不仅开发客户的应用程序，还花费了大量的时间来完善Unireg。

1985年， Monty和Allan干脆合伙开了一个叫TCX DataKonsult AB ，专注数据仓库领域， Monty把Unireg移植到了更强大的Sun工作站上，以便能处理更大规模的数据。

![](https://upload-images.jianshu.io/upload_images/6943526-25d9b7e252b0b7a0?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](https://upload-images.jianshu.io/upload_images/6943526-3d6cd15a2bcbfe9c.gif?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

有多大规模呢？大概是每月百万行的数据。

可见这个时候的Unireg数据库，已经相当不错， 能处理大数据了！

在此期间， Monty又认识了David Axmark， 两人相见恨晚，经常在一起讨论技术问题，打电话到深夜。

![](https://upload-images.jianshu.io/upload_images/6943526-8814ad23d770fcd5.gif?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

David是一个自由软件的铁杆粉丝，他将来会对MySQL 的开源模型，盈利模式产生重大的影响。

Monty , David, Allan这三个人如同“桃园三结义”的兄弟，从此以后，他们将联手开启一段新历史。 

###03.MySQL问世

不知道Monty和Allan 用Unireg赚了多少钱，TcX这个小小的公司应该活得比较滋润。

如果就这么发展下去，估计MySQL就不会诞生了。

90年代中后期， 蓬勃发展的互联网将给Monty他们带来一个前所未有的挑战，当然也带来了前所未有的机遇。

1994年，客户希望TcX开始基于Unireg开发Web的应用，不幸的是，Unireg这个桌面软件的设计缺点暴漏出来了：**不支持SQL，没法和Web页面有效集成。**

要么固守桌面软件，慢慢落后于时代，要么主动拥抱Web，Monty和TcX走到了一个十字路口。

这时候Monty 发现了开源的miniSQL （简称mSQL）， Monty研究了一番后发现，mSQL最要命的问题是不支持索引，性能很差。

Monty联系mSQL的作者，问他能不能修改mSQL来使用Unireg的索引，mSQL的作者忙着开发mSQL 2.0，已经设计好了索引方案，就拒绝了。

自己动手，丰衣足食，Monty决心实现自己的数据库。

一年以后， 1995年1月，支持SQL接口，索引，有着C/S架构的MySQL 1.0 问世了。

狂热的开源软件爱好者David立刻找到Monty和Allan，给他俩施压，希望MySQL可以开源。

可是开源以后，大家都能用了，怎么赚钱呢？

David想了一个绝妙的注意：双重许可

客户可以以开源的方式使用MySQL，不需要付费。

但是，如果客户在自己的产品中使用了MySQL，还想通过闭源的方式来销售自己的产品，那对不起，需要付费购买商业许可。

这样，既能扩大软件的使用用户，收入还不至于颗粒无收。

###04.15分钟 和 3万封邮件

MySQL是幸运的，它踏上了互联网的风口：**Web网站如雨后春笋般出现，每个网站都需要一个免费的数据库，MySQL正好填补了这个空白**。

当时建站的主要语言是PHP，Perl ， 这些程序员也对MySQL做了大量宣传：简单、易用、高性能。

Monty和David设定了一个目标：**让用户在下载完MySQL以后，15分钟内就能运行起来**， 在现在RPM, DEB等安装包大行其道的时代，15分钟听起来非常漫长， 但是在1996年，通常需要从源代码安装，一点点小问题，就会花费数小时。

为了这15分钟，Monty他们付出了辛苦的努力，需要模拟用户在8~10个操作系统上编译，安装MySQL的不同版本。

Monty 对用户非常负责， 他在MySQL问世前5年的时间里，回复了30000多封邮件，来解决大家的疑问。

David 也没有闲着，马不停蹄地参加各种会议，到处宣传MySQL， 他在飞机上度过的时间超越了在家的时间。

免费的MySQL逐渐成为建站的第一选择。加上Apache和Linux， 形成了著名的LAMP。

###05.5000万美元

到了1999年，MySQL已经被一些人注意到了， 并且开出了5000万美元的高价想把MySQL买下。

如果是目光短浅的我，十有八九就卖了，多么诱人的报价，卖了以后就财务自由了！ 

但是Monty他们有着更大的愿景：做点儿事情，改变世界。

他们不想就此失去对公司的控制，于是他们拒绝了这次收购。

随着时间推移，MySQL越长越大， 公司从3个人发展到了15个人， 客户越来越多，需要的功能也水涨船高。MySQL公司需要更多人手去做技术支持、编写文档、销售。

市场上也出现了像PostgresSQL这样的竞争对手， 如果再不引入投资，靠之前的收入缓慢增长，MySQL迟早会被飞速发展的时代干掉。

2001 年 Mårten Mickos 被聘为MySQL CEO， 专门和投资者谈，最后从风险投资那里获得了400万欧元的A轮融资， 仅仅出让了10%的股权， 控制权依然在Monty他们手中。

MySQL从此进入了发展的快车道，到2003年，仅两年的时间，MySQL的安装数就翻了一番，达到400万， 成为了全世界最受欢迎的开源数据库。

这一年，MySQL又获得了1950万美元的B轮融资。

###06.和Oracle的暗战

Oracle是数据库领域的绝对老大， 统治着企业级数据库市场， 但是在Web领域却干不过免费、开源的MySQL。 

Google, Facebook, Snapchat, Quora, Dropbox ,Youtube , Twitter 等IT巨头都不使用Oracle，他们不约而同地选择了MySQL， 因为不用给Oracle交巨额的License费用，还可以修改源代码适合自己的场景。

更要命的是， MySQL正在从Web领域杀下企业级市场，很多重量级客户从Oracle 转向免费的MySQL，这给Oracle带来了巨大的威胁。

2006年， Oracle 试图收购MySQL，但是没有成功。

![](https://upload-images.jianshu.io/upload_images/6943526-ff1daf38289ac6ac.gif?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

Larry Ellison狂妄地说：

> 它（MySQL）只是一家小小的公司，年收入也就三四千万吧， 而我们Oracle的收入是150亿！
> 
> 我们只收购那些有商业价值的公司，MySQL并不在我们收购的列表中。

话虽这么说， Oracle 却在不断地挖MySQL的墙角。

2005年， Oracle收购了一个叫做innobase的芬兰公司，正是这家公司给MySQL提供了支持事务处理的InnoDB 引擎。

过了一年，Oracle又收购了Sleepycat，这家公司给MySQL提供了Berkeley DB事务引擎。

###07.并购

2008年， 年收入达到7500万美元的MySQL面临一个抉择：究竟是上市呢？还是卖个好价钱？

Mårten Mickos, Monty, David等人经过一番讨论以后，他们选择了Sun，这是因为：

**1\. Sun是一家技术导向的公司**

**2\. Sun是开源运动的推动者，没有把MySQL变成闭源软件的风险。**

2008年1月，MySQL以10亿美元卖给了Sun，Monty也凭借这笔收入成为这一年芬兰的10大富豪之一。

可是人算不如天算， 让人苦笑不得的是，仅仅一年以后，Sun居然又被Oracle给收购了！

MySQL最终还是没有逃脱Oracle的手掌心。

MySQL的前景一下子黯淡下来，Monty说道：

“很多核心的MySQL开发者，包括我自己，都不相信Oracle能善待MySQL，我们要确保MySQL的代码完全开源，永远开源。”

2009年，作为对Oracle收购Sun的回应， Monty立刻创建了一个MySQL的分支：MariaDB， 它和MySQL兼容，并且完全开源，一大批核心开发人员追随Monty，离开MySQL，加入MariaDB。

![](https://upload-images.jianshu.io/upload_images/6943526-0d5829e3b45dc8f5?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](https://upload-images.jianshu.io/upload_images/6943526-7ae9f05300023bc5?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

2009年Monty已经47岁了， 和MySQL说了再见，他踏上了新的征程。 

2020年，Monty已经58岁了，依然在一线奋战。

传奇将会继续......

![](https://upload-images.jianshu.io/upload_images/6943526-85b13429b918cc23.gif?imageMogr2/auto-orient/strip)
