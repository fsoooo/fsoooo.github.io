最近在做的项目，有很多统计数据的地方，由于数据量相对较多，之前写的查询语句查询五十万条数据大概需要十秒左右的样子，严重影响了效率。后来在网上寻找解决方案，利用sum,case...when...重写SQL性能一下子提高到一秒钟就解决了。

这里为了简洁明了的阐述问题和解决的方法，我简化一下需求模型。

现在数据库有一张订单表（经过简化的中间表），表结构如下：

```
CREATE TABLE `statistic_order` (
  `oid` bigint(20) NOT NULL,
  `o_source` varchar(25) DEFAULT NULL COMMENT '来源编号',
  `o_actno` varchar(30) DEFAULT NULL COMMENT '活动编号',
  `o_actname` varchar(100) DEFAULT NULL COMMENT '参与活动名称',
  `o_n_channel` int(2) DEFAULT NULL COMMENT '商城平台',
  `o_clue` varchar(25) DEFAULT NULL COMMENT '线索分类',
  `o_star_level` varchar(25) DEFAULT NULL COMMENT '订单星级',
  `o_saledep` varchar(30) DEFAULT NULL COMMENT '营销部',
  `o_style` varchar(30) DEFAULT NULL COMMENT '车型',
  `o_status` int(2) DEFAULT NULL COMMENT '订单状态',
  `syctime_day` varchar(15) DEFAULT NULL COMMENT '按天格式化日期',
  PRIMARY KEY (`oid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
```

#### 项目需求是这样的:

统计某段时间范围内每天的来源编号数量，其中来源编号对应数据表中的o_source字段，字段值可能为CDE,SDE,PDE,CSE,SSE。

![](https://upload-images.jianshu.io/upload_images/2624945-4cc5c82246c4665d.png?imageMogr2/auto-orient/strip%7CimageView2/2)

一开始写了这样一段SQL：

```
select S.syctime_day,
  (select count(*) from statistic_order SS where SS.syctime_day = S.syctime_day and SS.o_source = 'CDE') as 'CDE',
  (select count(*) from statistic_order SS where SS.syctime_day = S.syctime_day and SS.o_source = 'CDE') as 'SDE',
  (select count(*) from statistic_order SS where SS.syctime_day = S.syctime_day and SS.o_source = 'CDE') as 'PDE',
  (select count(*) from statistic_order SS where SS.syctime_day = S.syctime_day and SS.o_source = 'CDE') as 'CSE',
  (select count(*) from statistic_order SS where SS.syctime_day = S.syctime_day and SS.o_source = 'CDE') as 'SSE'
 from statistic_order S where S.syctime_day > '2016-05-01' and S.syctime_day < '2016-08-01' 
 GROUP BY S.syctime_day order by S.syctime_day asc;
```

这种写法采用了子查询的方式，在没有加索引的情况下，55万条数据执行这句SQL，在workbench下等待了将近十分钟，最后报了一个连接中断，通过explain解释器可以看到SQL的执行计划如下：

![](https://upload-images.jianshu.io/upload_images/2624945-042ec9c6dfd5bc8a.png?imageMogr2/auto-orient/strip%7CimageView2/2)

每一个查询都进行了全表扫描，五个子查询DEPENDENT SUBQUERY说明依赖于外部查询，这种查询机制是先进行外部查询，查询出group by后的日期结果，然后子查询分别查询对应的日期中CDE，SDE等的数量，其效率可想而知。

在o_source和syctime_day上加上索引之后，效率提高了很多，大概*五秒钟*就查询出了结果：

![](https://upload-images.jianshu.io/upload_images/2624945-a621440e35ceedbf.png?imageMogr2/auto-orient/strip%7CimageView2/2)

查看执行计划发现扫描的行数减少了很多，不再进行全表扫描了：

![](https://upload-images.jianshu.io/upload_images/2624945-3223606753a93948.png?imageMogr2/auto-orient/strip%7CimageView2/2)

这当然还不够快，如果当数据量达到百万级别的话，查询速度肯定是不能容忍的。一直在想有没有一种办法，能否直接遍历一次就查询出所有的结果，类似于遍历java中的list集合，遇到某个条件就计数一次，这样进行一次全表扫描就可以查询出结果集，结果索引，效率应该会很高。

利用sum聚合函数，加上case...when...then...这种“陌生”的用法，有效的解决了这个问题。
具体SQL如下：

```
 select S.syctime_day,
   sum(case when S.o_source = 'CDE' then 1 else 0 end) as 'CDE',
   sum(case when S.o_source = 'SDE' then 1 else 0 end) as 'SDE',
   sum(case when S.o_source = 'PDE' then 1 else 0 end) as 'PDE',
   sum(case when S.o_source = 'CSE' then 1 else 0 end) as 'CSE',
   sum(case when S.o_source = 'SSE' then 1 else 0 end) as 'SSE'
 from statistic_order S where S.syctime_day > '2015-05-01' and S.syctime_day < '2016-08-01' 
 GROUP BY S.syctime_day order by S.syctime_day asc;
```

关于MySQL中 **`case...when...then`** 的用法就不做过多的解释了，这条SQL很容易理解，先对一条一条记录进行遍历，group by对日期进行了分类，sum聚合函数对某个日期的值进行求和，重点就在于case...when...then对sum的求和巧妙的加入了条件，当o_source = 'CDE'的时候，计数为1，否则为0；当o_source='SDE'的时候......
这条语句的执行只花了一秒多，对于五十多万的数据进行这样一个维度的统计还是比较理想的。

![](https://upload-images.jianshu.io/upload_images/2624945-5237c297875e2902.png?imageMogr2/auto-orient/strip%7CimageView2/2)

通过执行计划发现，虽然扫描的行数变多了，但是只进行了一次全表扫描，而且是SIMPLE简单查询，所以执行效率自然就高了：

![](https://upload-images.jianshu.io/upload_images/2624945-ac01baac62b6353d.png?imageMogr2/auto-orient/strip%7CimageView2/2)

针对这个问题，如果大家有更好的方案或思路，欢迎留言。
