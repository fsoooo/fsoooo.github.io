---
layout: post
catalog: true
tags:
  - MySQL
  - 事务
  - InnoDB
---

这一篇主要讲一下InnoDB中的事务到底是如何实现ACID的

- 原子性（atomicity）
- 一致性（consistency）
- 隔离性（isolation）
- 持久性（durability）

### 一.隔离性

其实隔离性的实现原理就是锁，因而**隔离性也可以称为并发控制、锁**等。事务的隔离性要求**每个读写事务的对象对其他事务的操作对象能互相分离**。再者，比如操作缓冲池中的LRU列表，删除，添加、移动LRU列表中的元素**，为了保证一致性那么就要锁的介入**。InnoDB使用锁为了支持对共享资源进行并发访问，提供数据的完整性和一致性。

那么到底InnoDB支持什么样的锁呢？我们先来看下InnoDB的锁的介绍：

#### InnoDB中的锁

你可能听过各种各样的InnoDB的数据库锁，间隙（gap）锁啊，共享锁，排它锁，读锁，写锁等等。

但是InnoDB的标准实现的锁只有2类，一种是行级锁，一种是意向锁。

InnoDB实现了如下两种标准的行级锁：

- 共享锁（读锁 S Lock），允许事务读一行数据
- 排它锁（写锁 X Lock），允许事务删除一行数据或者更新一行数据

行级锁中，除了S和S兼容，其他都不兼容。

InnoDB支持两种意向锁（即为表级别的锁）：

- 意向共享锁（读锁 IS Lock），事务想要获取一张表的几行数据的共享锁，事务在给一个数据行加共享锁前必须先取得该表的IS锁。
- 意向排他锁（写锁 IX Lock），事务想要获取一张表中几行数据的排它锁，事务在给一个数据行加排他锁前必须先取得该表的IX锁。

　　首先解释一下意向锁，以下为意向锁的意图解释：

```
The main purpose of IX and IS locks is to show that someone is locking a row, or going to lock a row in the table.
```

大致意思是加意向锁为了表明某个事务正在锁定一行或者将要锁定一行数据。

首先申请意向锁的动作是InnoDB完成的，怎么理解意向锁呢？例如：事务A要对一行记录r进行上X锁，那么InnoDB会先申请表的IX锁，再锁定记录r的X锁。在事务A完成之前，事务B想要来个全表操作，此时直接在表级别的IX就告诉事务B需要等待而不需要在表上判断每一行是否有锁。意向排它锁存在的价值在于节约InnoDB对于锁的定位和处理性能。另外注意了，除了全表扫描以外意向锁都不会阻塞。

#### 锁的算法

InnoDB有3种行锁的算法：

- Record Lock：单个行记录上的锁
- Gap Lock：间隙锁，锁定一个范围，而非记录本身
- Next-Key Lock：结合Gap Lock和Record Lock，锁定一个范围，并且锁定记录本身。主要解决的问题是RR隔离级别下的幻读

这里主要讲一下Next-Key Lock。mysql默认隔离级别RR下，这时默认采用Next-Key locks。这种间隙锁的目的就是为了阻止多个事务将记录插入到同一范围内从而导致幻读。注意了，如果走唯一索引，那么Next-Key Lock会降级为Record Lock。**前置条件为事务隔离级别为RR且sql走的非唯一索引、主键索引。前置条件为事务隔离级别为RR且sql走的非唯一索引、主键索引。前置条件为事务隔离级别为RR且sql走的非唯一索引、主键索引。重要的事情说三遍。如果不是则根本不会有gap锁！**先举个例子来讲一下Next-Key Lock。

　　首先建立一张表：

```
mysql> show create table m_test_db.M;
+-------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Table | Create Table                                                                                                                                                                                                                                     |
+-------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| M     | CREATE TABLE `M` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(45) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_USER_ID` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 |
+-------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
1 row in set (0.00 sec)
```

首先session A去拿到user_id为26的X锁，用force index，强制走这个非唯一辅助索引，因为这张表里的数据很少。

```
mysql> begin;
Query OK, 0 rows affected (0.00 sec)

mysql> select * from m_test_db.M force index(IDX_USER_ID) where user_id = '26' for update;
+----+---------+-------+
| id | user_id | name  |
+----+---------+-------+
|  5 | 26      | jerry |
|  6 | 26      | ketty |
+----+---------+-------+
2 rows in set (0.00 sec)
```

然后session B插入数据

```
mysql> begin;
Query OK, 0 rows affected (0.00 sec)

mysql> insert into m_test_db.M values (8,25,'GrimMjx');
ERROR 1205 (HY000): Lock wait timeout exceeded; try restarting transaction
```

明明插入的数据和锁住的数据没有毛线关系，为什么还会阻塞等锁最后超时呢？这就是Next-Key Lock实现的。画张图你就明白了。


![](http://upload-images.jianshu.io/upload_images/6943526-401970ca58cd5740.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


gap锁锁住的位置，不是记录本身，而是两条记录之间的间隔gap，其实就是防止幻读（同一事务下，连续执行两句同样的sql得到不同的结果），为了保证图上3个小箭头中间不会插入满足条件的新记录，所以用到了gap锁防止幻读。

简单的insert会在insert的行对应的索引记录上加一个Record Lock锁，并没有gap锁，所以并不会阻塞其他session在gap间隙里插入记录。不过在insert操作之前，还会加一种锁，官方文档称它为insertion intention gap lock，也就是意向的gap锁。这个意向gap锁的作用就是预示着当多事务并发插入相同的gap空隙时，只要插入的记录不是gap间隙中的相同位置，则无需等待其他session就可完成，这样就使得insert操作无须加真正的gap lock。

Session A插入数据

```
mysql> begin;
Query OK, 0 rows affected (0.00 sec)

mysql> insert into m_test_db.M values (10,25,'GrimMjx');
Query OK, 1 row affected (0.00 sec)
```

Session B插入数据，完全没有问题，没有阻塞。

```
mysql> begin;
Query OK, 0 rows affected (0.00 sec)

mysql> insert into m_test_db.M values (11,27,'Mjx');
Query OK, 1 row affected (0.00 sec)
```

#### 死锁

了解了InnoDB是如何加锁的，现在可以去尝试分析死锁。死锁的本质就是两个事务相互等待对方释放持有的锁导致的，关键在于不同Session加锁的顺序不一致。不懂死锁概念模型的可以先看一幅图：

![](http://upload-images.jianshu.io/upload_images/6943526-3b720420b2cce516.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


左鸟线程获取了左肉的锁，想要获取右肉的锁，右鸟的线程获取了右肉的锁。右鸟想要获取左肉的锁。左鸟没有释放左肉的锁，右鸟也没有释放右肉的锁，那么这就是死锁。

接下来还用刚才的那张M表来分析一下数据库死锁，比较好理解：

![](http://upload-images.jianshu.io/upload_images/6943526-7b99d4277cbceb25.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


#### 四种隔离级别

　　那么按照最严格到最松的顺序来讲一下四种隔离级别

##### 1.Serializable(可序列化)

　　最高事务隔离级别。主要用在InnoDB存储引擎的分布式事务。强制事务排序，串行化执行事务。不需要冲突控制，但是慢速设备。但是根据Jim Gray在《Transaction Processing》一书中指出，Read Committed和Serializable的开销几乎是一样的，甚至Serializable更优。

 　　Session A设置隔离级别为Serializable，并开始事务执行一句sql

```
mysql> select @@tx_isolation;
+----------------+
| @@tx_isolation |
+----------------+
| SERIALIZABLE   |
+----------------+
1 row in set, 1 warning (0.00 sec)

mysql> start transaction;
Query OK, 0 rows affected (0.00 sec)

mysql> select * from m_test_db.M;
+----+---------+-------+
| id | user_id | name  |
+----+---------+-------+
|  1 | 20      | mjx   |
|  2 | 21      | ben   |
|  3 | 23      | may   |
|  4 | 24      | tom   |
|  5 | 26      | jerry |
|  6 | 26      | ketty |
|  7 | 28      | kris  |
+----+---------+-------+
7 rows in set (0.00 sec)
```

　　Session Binsert一条数据，超时。

```
mysql> start transaction;
Query OK, 0 rows affected (0.00 sec)

mysql> insert into m_test_db.M values (9,30,'test');
ERROR 1205 (HY000): Lock wait timeout exceeded; try restarting transaction
```

##### 2.Repeatable read(可重复读)

　　一个事务按相同的查询条件读取以前检索过的数据，其他事务插入了满足其查询条件的新数据。产生幻读。InnoDB存储引擎在RR隔离级别下，已经使用Next-Key Lock算法避免了幻读。了解概念即可。InnoDB使用MVCC来读取数据，RR隔离级别下，总是读取事务开始时的行数据版本。

　　Session A 查看id=1的数据

```
mysql> set tx_isolation='repeatable-read';
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> begin;
Query OK, 0 rows affected (0.00 sec)

mysql> select * from m_test_db.M where id =1;
+----+---------+---------+
| id | user_id | name    |
+----+---------+---------+
|  1 | 20      | GrimMjx |
+----+---------+---------+
1 row in set (0.01 sec)
```

　　Session B 修改id=1的数据

```
mysql> set tx_isolation='repeatable-read';
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> begin;
Query OK, 0 rows affected (0.00 sec)

mysql> update m_test_db.M set name = 'Mjx';
Query OK, 7 rows affected (0.00 sec)
Rows matched: 7  Changed: 7  Warnings: 0
```

　　然后现在Session A 再查看一下id=1的数据，数据还是事务开始时候的数据。

```
mysql> select * from m_test_db.M where id =1;
+----+---------+---------+
| id | user_id | name    |
+----+---------+---------+
|  1 | 20      | GrimMjx |
+----+---------+---------+
1 row in set (0.00 sec)
```

##### 3.Read Committed(读已提交)

　　事务从开始直到提交之前，所做的任何修改对其他事务都是不可见的。InnoDB使用MVCC来读取数据，RC隔离级别下，总是读取被锁定行最新的快照数据。

　　Session A 查看id=1的数据

```
mysql> set tx_isolation='read-committed';
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> begin;
Query OK, 0 rows affected (0.00 sec)

mysql> select * from m_test_db.M where id =1;
+----+---------+------+
| id | user_id | name |
+----+---------+------+
|  1 | 20      | Mjx  |
+----+---------+------+
1 row in set (0.00 sec)
```

　　Session B 修改id=1的name并且commit。

```
mysql> set tx_isolation='repeatable-read';
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> begin;
Query OK, 0 rows affected (0.00 sec)

mysql> update m_test_db.M set name = 'testM' where id =1;
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0

// 注意，这里commit了！
mysql> commit;
Query OK, 0 rows affected (0.00 sec)
```

　　Session A 再查询id=1的记录，发现数据已经是最新的数据。

```
mysql> select * from m_test_db.M where id =1;
+----+---------+-------+
| id | user_id | name  |
+----+---------+-------+
|  1 | 20      | testM |
+----+---------+-------+
1 row in set (0.00 sec)
```



##### 4.Read Uncommitted(读未提交)

　　事务中的修改，即使没有提交，对其他事务也都是可见的。

　　Session A 查看一下id=3的数据，没有commit。

```
mysql> set tx_isolation='read-uncommitted';
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> select @@tx_isolation;
+------------------+
| @@tx_isolation   |
+------------------+
| READ-UNCOMMITTED |
+------------------+
1 row in set, 1 warning (0.00 sec)

mysql> begin;
Query OK, 0 rows affected (0.00 sec)

mysql> select * from m_test_db.M where id =3;
+----+---------+------+
| id | user_id | name |
+----+---------+------+
|  3 | 23      | may  |
+----+---------+------+
1 row in set (0.00 sec)
```

　　Session B 修改id=3的数据，但是没有commit！

```
mysql> set tx_isolation='read-uncommitted';
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> begin;
Query OK, 0 rows affected (0.00 sec)

mysql> update m_test_db.M set name = 'GRIMMJX' where id = 3;
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0
```

　　Session A再次查看则看到了新的结果

```
mysql> select * from m_test_db.M where id =3;
+----+---------+---------+
| id | user_id | name    |
+----+---------+---------+
|  3 | 23      | GRIMMJX |
+----+---------+---------+
1 row in set (0.00 sec)
```

　　这里花了很多笔墨来介绍隔离性，这是比较重要，需要静下心来学习的特性。所以也是放在第一个的原因。

 

### 二.原子性、一致性、持久性

　　事务隔离性由锁实现，原子性、一致性和持久性由数据库的redo log和undo log。redo log称为重做日志，用来保证事务的原子性和持久性，恢复提交事务修改的页操作。undo log来保证事务的一致性，undo回滚行记录到某个特性版本及MVCC功能。两者内容不同。redo记录物理日志，undo是逻辑日志。

#### redo

　　重做日志由重做日志缓冲(redo log buffer)和重做日志文件(redo log file)组成，前者是易失的，后者是持久的。InnoDB通过Force Log at Commit机制来实现持久性，当commit时，必须先将事务的所有日志写到重做日志文件进行持久化，待commit操作完成才算完成。

　　当事务提交时，日志不写入重做日志文件，而是等待一个事件周期后再执行fsync操作，由于并非强制在事务提交时进行一次fsync操作，显然这可以提高数据库性能。

　　请记住3点：

- 重做日志是在InnoDB层产生的
- 重做日志是物理格式日志，记录的是对每个页的修改
- 重做日志在事务进行中不断被写入

#### undo

　　事务回滚和MVCC，这就需要undo。undo是逻辑日志，只是将数据库逻辑的恢复到原来的样子，但是数据结构和页本身在回滚之后可能不同。例如：用户执行insert 10w条数据的事务，表空间因而增大。用户执行ROLLBACK之后，会对插入的数据回滚，但是表空间大小不会因此收缩。

　　实际的做法就是做与之前想法的操作，insert对应delete，update对应反向update来实现原子性。

　　InnoDB中MVCC的实现就是靠undo，举个经典的例子：Bob给Smith转100元，那么就存在以下3个版本，RR隔离级别下，对于快照数据，总是读事务开始的行数据版本见黄标。RC隔离级别下，对于快照数据，总是读最新的一份快照数据见红标。

![image](http://upload-images.jianshu.io/upload_images/6943526-c749d231aaf40c2d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


　　undo log会产生redo log，因为undo log需要持久性保护 



