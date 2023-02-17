![](https://upload-images.jianshu.io/upload_images/6943526-5a035adbe9ef8d6a.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

count()函数是用来统计表中记录的一个函数，返回匹配条件的行数。

很多人在使用count()方法时，会用 count(1) 替代 count(*)，认为 count(1) 比 count(*) 效率高。

下面我们来一探究竟。

<br/>

## count(1) 和 count(*)

当表的数据量大些时，对表作分析之后，使用count(1)还要比使用count(*)用时多了！！ 

从执行计划来看，count(1)和count()的效果是一样的。

但是在表做过分析之后，count(1)会比count()的用时少些（1w以内数据量），不过差不了多少。

如果count(1)是聚索引,id,那肯定是count(1)快，但是差的很小的。

因为count(),自动会优化指定到那一个字段。

所以没必要去count(1)，用count()，sql会帮你完成优化的 。

#####因此：count(1)和count(*)基本没有差别！

<br/>

## count(1) 和 count(字段)

两者的主要区别是

（1） count(1) 会统计表中的所有的记录数，包含字段为null 的记录

（2） count(字段) 会统计该字段在表中出现的次数，忽略字段为null 的情况。即不统计字段为null 的记录。

##count(*) 和 count(1) 和 count(列名)区别

执行效果上：

count(*)包括了所有的列，相当于行数，在统计结果的时候，不会忽略列值为NULL

count(1)包括了忽略所有列，用1代表代码行，在统计结果的时候，不会忽略列值为NULL

count(列名)只包括列名那一列，在统计结果的时候，会忽略列值为空（这里的空不是只空字符串或者0，而是表示null）的计数，即某个字段值为NULL时，不统计。

执行效率上：

列名为主键，count(列名)会比count(1)快

列名不为主键，count(1)会比count(列名)快

如果表多个列并且没有主键，则 count（1） 的执行效率优于 count（*）

如果有主键，则 select count（主键）的执行效率是最优的

如果表只有一个字段，则 select count（*）最优。

##总结

####count()语法：
```
（1）count(*)---包括所有列，返回表中的记录数，相当于统计表的行数，在统计结果的时候，不会忽略列值为NULL的记录。
（2）count(1)---忽略所有列，1表示一个固定值，也可以用count(2)、count(3)代替，在统计结果的时候，不会忽略列值为NULL的记录。
（3）count(列名)---只包括列名指定列，返回指定列的记录数，在统计结果的时候，会忽略列值为NULL的记录（不包括空字符串和0），即列值为NULL的记录不统计在内。
（4）count(distinct 列名)---只包括列名指定列，返回指定列的不同值的记录数，在统计结果的时候，在统计结果的时候，会忽略列值为NULL的记录（不包括空字符串和0），即列值为NULL的记录不统计在内。
```
 

####count(*)&count(1)&count(列名)执行效率比较：
```
（1）如果列为主键，count(列名)效率优于count(1)
（2）如果列不为主键，count(1)效率优于count(列名)
（3）如果表中存在主键，count(主键列名)效率最优
（4）如果表中只有一列，则count(*)效率最优
（5）如果表有多列，且不存在主键，则count(1)效率优于count(*)
```
因为count(*)和count(1)统计过程中不会忽略列值为NULL的记录，所以可以通过以下两种方式来统计列值为NULL的记录数:
```
（1）select count(*) from table where is_active is null;
（2）select count(1) from table where is_active is null;
```
####特例：
```
（1）select count('') from table;-返回表的记录数
（2）select count(0) from table;-返回表的记录数
（3）select count(null) from table;-返回0
```
## 实例分析

```
mysql> create table counttest(name char(1), age char(2));
Query OK, 0 rows affected (0.03 sec)

mysql> insert into counttest values
-> ('a', '14'),('a', '15'), ('a', '15'),
-> ('b', NULL), ('b', '16'),
-> ('c', '17'),
-> ('d', null),
->('e', '');
Query OK, 8 rows affected (0.01 sec)
Records: 8 Duplicates: 0 Warnings: 0

mysql> select * from counttest;
+------+------+
| name | age |
+------+------+
| a | 14 |
| a | 15 |
| a | 15 |
| b | NULL |
| b | 16 |
| c | 17 |
| d | NULL |
| e | |
+------+------+
8 rows in set (0.00 sec)

mysql> select name, count(name), count(1), count(*), count(age), count(distinct(age))
-> from counttest
-> group by name;
+------+-------------+----------+----------+------------+----------------------+
| name | count(name) | count(1) | count(*) | count(age) | count(distinct(age)) |
+------+-------------+----------+----------+------------+----------------------+
| a | 3 | 3 | 3 | 3 | 2 |
| b | 2 | 2 | 2 | 1 | 1 |
| c | 1 | 1 | 1 | 1 | 1 |
| d | 1 | 1 | 1 | 0 | 0 |
| e | 1 | 1 | 1 | 1 | 1 |
+------+-------------+----------+----------+------------+----------------------+
5 rows in set (0.00 sec)
```

![](https://upload-images.jianshu.io/upload_images/6943526-9151738afdde47eb.gif?imageMogr2/auto-orient/strip)


