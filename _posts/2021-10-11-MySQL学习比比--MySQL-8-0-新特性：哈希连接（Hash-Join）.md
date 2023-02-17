![](https://upload-images.jianshu.io/upload_images/6943526-cf979ca6acd18c59.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


MySQL 开发组于 2019 年 10 月 14 日 正式发布了 MySQL 8.0.18 GA 版本，带来了一些新特性和增强功能。

其中最引人注目的莫过于多表连接查询支持 hash join 方式了。

我们先来看看官方的描述： 

>点击查看 **[官方描述](https://dev.mysql.com/doc/refman/8.0/en/hash-joins.html)**

MySQL 实现了用于内连接查询的 hash join 方式。

例如，从 MySQL 8.0.18 开始以下查询可以使用 hash join 进行连接查询：

```
SELECT * 
    FROM t1 
    JOIN t2 
        ON t1.c1=t2.c1;
```

Hash join 不需要索引的支持。

大多数情况下，hash join 比之前的 Block Nested-Loop 算法在没有索引时的等值连接更加高效。

使用以下语句创建三张测试表：

```
CREATE TABLE t1 (c1 INT, c2 INT);
CREATE TABLE t2 (c1 INT, c2 INT);
CREATE TABLE t3 (c1 INT, c2 INT);
```

使用EXPLAIN FORMAT=TREE命令可以看到执行计划中的 hash join，例如：

```
mysql> EXPLAIN FORMAT=TREE
    -> SELECT * 
    ->     FROM t1 
    ->     JOIN t2 
    ->         ON t1.c1=t2.c1\G
*************************** 1. row ***************************
EXPLAIN: -> Inner hash join (t2.c1 = t1.c1)  (cost=0.70 rows=1)
    -> Table scan on t2  (cost=0.35 rows=1)
    -> Hash
        -> Table scan on t1  (cost=0.35 rows=1)
```

必须使用 EXPLAIN 命令的 FORMAT=TREE 选项才能看到节点中的 hash join。

另外，EXPLAIN ANALYZE命令也可以显示 hash join 的使用信息。

这也是该版本新增的一个功能。多个表之间使用等值连接的的查询也会进行这种优化。

例如以下查询：



```
SELECT * 
    FROM t1
    JOIN t2 
        ON (t1.c1 = t2.c1 AND t1.c2 < t2.c2)
    JOIN t3 
        ON (t2.c1 = t3.c1);
```



在以上示例中，任何其他非等值连接的条件将会在连接操作之后作为过滤器使用。

可以通过EXPLAIN FORMAT=TREE命令的输出进行查看：

```
mysql> EXPLAIN FORMAT=TREE
    -> SELECT * 
    ->     FROM t1
    ->     JOIN t2 
    ->         ON (t1.c1 = t2.c1 AND t1.c2 < t2.c2)
    ->     JOIN t3 
    ->         ON (t2.c1 = t3.c1)\G
*************************** 1. row ***************************
EXPLAIN: -> Inner hash join (t3.c1 = t1.c1)  (cost=1.05 rows=1)
    -> Table scan on t3  (cost=0.35 rows=1)
    -> Hash
        -> Filter: (t1.c2 < t2.c2)  (cost=0.70 rows=1)
            -> Inner hash join (t2.c1 = t1.c1)  (cost=0.70 rows=1)
                -> Table scan on t2  (cost=0.35 rows=1)
                -> Hash
                    -> Table scan on t1  (cost=0.35 rows=1)
```

从以上输出同样可以看出，包含多个等值连接条件的查询也可以（会）使用多个 hash join 连接。

但是，如果任何连接语句（ON）中没有使用等值连接条件，将不会采用 hash join 连接方式。

例如：


```
mysql> EXPLAIN FORMAT=TREE
    ->     SELECT * 
    ->         FROM t1
    ->         JOIN t2 
    ->             ON (t1.c1 = t2.c1)
    ->         JOIN t3 
    ->             ON (t2.c1 < t3.c1)\G
*************************** 1. row ***************************
EXPLAIN: <not executable by iterator executor>
```

</pre>

此时，将会采用性能更慢的 block nested loop 连接算法。

这与 MySQL 8.0.18 之前版本中没有索引时的情况一样：

```
mysql> EXPLAIN
    ->     SELECT * 
    ->         FROM t1
    ->         JOIN t2 
    ->             ON (t1.c1 = t2.c1)
    ->         JOIN t3 
    ->             ON (t2.c1 < t3.c1)\G             
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t1
   partitions: NULL
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 1
     filtered: 100.00
        Extra: NULL
*************************** 2. row ***************************
           id: 1
  select_type: SIMPLE
        table: t2
   partitions: NULL
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 1
     filtered: 100.00
        Extra: Using where; Using join buffer (Block Nested Loop)
*************************** 3. row ***************************
           id: 1
  select_type: SIMPLE
        table: t3
   partitions: NULL
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 1
     filtered: 100.00
        Extra: Using where; Using join buffer (Block Nested Loop)
```


Hash join 连接同样适用于不指定查询条件时的笛卡尔积（Cartesian product），例如：


```
mysql> EXPLAIN FORMAT=TREE
    -> SELECT *
    ->     FROM t1
    ->     JOIN t2
    ->     WHERE t1.c2 > 50\G
*************************** 1. row ***************************
EXPLAIN: -> Inner hash join  (cost=0.70 rows=1)
    -> Table scan on t2  (cost=0.35 rows=1)
    -> Hash
        -> Filter: (t1.c2 > 50)  (cost=0.35 rows=1)
            -> Table scan on t1  (cost=0.35 rows=1)
```


默认配置时，MySQL 所有可能的情况下都会使用 hash join。

同时提供了两种控制是否使用 hash join 的方法：

*   在全局或者会话级别设置服务器系统变量 optimizer_switch 中的 hash_join=on 或者 hash_join=off 选项。默认为 hash_join=on。

*   在语句级别为特定的连接指定优化器提示 HASH_JOIN 或者 NO_HASH_JOIN。

可以通过系统变量 join_buffer_size 控制 hash join 允许使用的内存数量；
hash join 不会使用超过该变量设置的内存数量。

如果 hash join 所需的内存超过该阈值，MySQL 将会在磁盘中执行操作。

需要注意的是，如果 hash join 无法在内存中完成，并且打开的文件数量超过系统变量 open_files_limit 的值，连接操作可能会失败。

为了解决这个问题，可以使用以下方法之一：

*   增加 join_buffer_size 的值，确保 hash join 可以在内存中完成。
*   增加 open_files_limit 的值。

接下来我们比较一下 hash join 和 block nested loop 的性能，首先分别为 t1、t2 和 t3 生成 1000000 条记录：

```
set join_buffer_size=2097152000;

SET @@cte_max_recursion_depth = 99999999;

INSERT INTO t1
-- INSERT INTO t2
-- INSERT INTO t3
WITH RECURSIVE t AS (
  SELECT 1 AS c1, 1 AS c2
  UNION ALL
  SELECT t.c1 + 1, t.c1 * 2
    FROM t
   WHERE t.c1 < 1000000
)
SELECT *
  FROM t;
```

</pre>

没有索引情况下的 hash join：

```
mysql> EXPLAIN ANALYZE
    -> SELECT COUNT(*)
    ->   FROM t1
    ->   JOIN t2 
    ->     ON (t1.c1 = t2.c1)
    ->   JOIN t3 
    ->     ON (t2.c1 = t3.c1)\G
*************************** 1. row ***************************
EXPLAIN: -> Aggregate: count(0)  (actual time=22993.098..22993.099 rows=1 loops=1)
    -> Inner hash join (t3.c1 = t1.c1)  (cost=9952535443663536.00 rows=9952435908880402) (actual time=14489.176..21737.032 rows=1000000 loops=1)
        -> Table scan on t3  (cost=0.00 rows=998412) (actual time=0.103..3973.892 rows=1000000 loops=1)
        -> Hash
            -> Inner hash join (t2.c1 = t1.c1)  (cost=99682753413.67 rows=99682653660) (actual time=5663.592..12236.984 rows=1000000 loops=1)
                -> Table scan on t2  (cost=0.01 rows=998412) (actual time=0.067..3364.105 rows=1000000 loops=1)
                -> Hash
                    -> Table scan on t1  (cost=100539.40 rows=998412) (actual time=0.133..3395.799 rows=1000000 loops=1)

1 row in set (23.22 sec)

mysql> SELECT COUNT(*)
    ->   FROM t1
    ->   JOIN t2 
    ->     ON (t1.c1 = t2.c1)
    ->   JOIN t3 
    ->     ON (t2.c1 = t3.c1);
+----------+
| COUNT(*) |
+----------+
|  1000000 |
+----------+
1 row in set (12.98 sec)
```

实际运行花费了 12.98 秒。这个时候如果使用 block nested loop：


```
mysql> EXPLAIN FORMAT=TREE
    -> SELECT /*+  NO_HASH_JOIN(t1, t2, t3) */ COUNT(*)
    ->   FROM t1
    ->   JOIN t2 
    ->     ON (t1.c1 = t2.c1)
    ->   JOIN t3 
    ->     ON (t2.c1 = t3.c1)\G
*************************** 1. row ***************************
EXPLAIN: <not executable by iterator executor>

1 row in set (0.00 sec)

SELECT /*+  NO_HASH_JOIN(t1, t2, t3) */ COUNT(*)
  FROM t1
  JOIN t2 
    ON (t1.c1 = t2.c1)
  JOIN t3 
    ON (t2.c1 = t3.c1);
```

EXPLAIN 显示无法使用 hash join。查询跑了几十分钟也没有出结果，其中一个 CPU 使用率到了 100%；因为一直在执行嵌套循环（1000000 的 3 次方）。再看有索引时的 block nested loop 方法，增加索引：

```
mysql> CREATE index idx1 ON t1(c1);
Query OK, 0 rows affected (7.39 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> CREATE index idx2 ON t2(c1);
Query OK, 0 rows affected (6.77 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> CREATE index idx3 ON t3(c1);
Query OK, 0 rows affected (7.23 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

查看执行计划并运行相同的查询语句：

```
mysql> EXPLAIN ANALYZE
    -> SELECT COUNT(*)
    ->   FROM t1
    ->   JOIN t2 
    ->     ON (t1.c1 = t2.c1)
    ->   JOIN t3 
    ->     ON (t2.c1 = t3.c1)\G
*************************** 1. row ***************************
EXPLAIN: -> Aggregate: count(0)  (actual time=47684.034..47684.035 rows=1 loops=1)
    -> Nested loop inner join  (cost=2295573.22 rows=998412) (actual time=0.116..46363.599 rows=1000000 loops=1)
        -> Nested loop inner join  (cost=1198056.31 rows=998412) (actual time=0.087..25788.696 rows=1000000 loops=1)
            -> Filter: (t1.c1 is not null)  (cost=100539.40 rows=998412) (actual time=0.050..5557.847 rows=1000000 loops=1)
                -> Index scan on t1 using idx1  (cost=100539.40 rows=998412) (actual time=0.043..3253.769 rows=1000000 loops=1)
            -> Index lookup on t2 using idx2 (c1=t1.c1)  (cost=1.00 rows=1) (actual time=0.012..0.015 rows=1 loops=1000000)
        -> Index lookup on t3 using idx3 (c1=t1.c1)  (cost=1.00 rows=1) (actual time=0.012..0.015 rows=1 loops=1000000)

1 row in set (47.68 sec)

mysql> SELECT COUNT(*)
    ->   FROM t1
    ->   JOIN t2 
    ->     ON (t1.c1 = t2.c1)
    ->   JOIN t3 
    ->     ON (t2.c1 = t3.c1);
+----------+
| COUNT(*) |
+----------+
|  1000000 |
+----------+
1 row in set (19.56 sec)
```

实际运行花费了 19.56 秒。所以在我们这个场景中的测试结果如下：

![](https://upload-images.jianshu.io/upload_images/6943526-24e3ff028ccd2aab?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

再增加一个 Oracle 12c 中无索引时 hash join 结果：1.282 s。

再增加一个 PostgreSQL 11.5 中无索引时 hash join 结果：6.234 s。

再增加一个 SQL 2017 中无索引时 hash join 结果：5.207 s。

![](https://upload-images.jianshu.io/upload_images/6943526-c8de5797014b7d42.gif?imageMogr2/auto-orient/strip)

