# MySQL之索引添加与使用

## 一.索引的作用 

一般的应用系统，读写比例在10:1左右，而且插入操作和一般的更新操作很少出现性能问题，遇到最多的，也是最容易出问题的，还是一些复杂的查询操作，所以查询语句的优化显然是重中之重。

   在数据量和访问量不大的情况下，mysql访问是非常快的，是否加索引对访问影响不大。但是当数据量和访问量剧增的时候，就会发现mysql变慢，甚至down掉，这就必须要考虑优化sql了，给数据库建立正确合理的索引，是mysql优化的一个重要手段。  

   索引的目的在于提高查询效率，可以类比字典，如果要查“mysql”这个单词，我们肯定需要定位到m字母，然后从上往下找到y字母，再找到剩下的sql。如果没有索引，那么你可能需要把所有单词看一遍才能找到你想要的。除了词典，生活中随处可见索引的例子，如火车站的车次表、图书的目录等。它们的原理都是一样的，通过不断的缩小想要获得数据的范围来筛选出最终想要的结果，同时把随机的事件变成顺序的事件，也就是我们总是通过同一种查找方式来锁定数据。

 在创建索引时，需要考虑哪些列会用于 SQL 查询，然后为这些列创建一个或多个索引。**事实上，索引也是一种表，保存着主键或索引字段，以及一个能将每个记录指向实际表的指针。**数据库用户是看不到索引的，它们只是用来加速查询的。数据库搜索引擎使用索引来快速定位记录。

  INSERT 与 UPDATE 语句在拥有索引的表中执行会花费更多的时间，而SELECT 语句却会执行得更快。这是因为，在进行插入或更新时，数据库也需要插入或更新索引值。

## 二.索引的添加与删除

```
 索引的类型：
```

- UNIQUE(唯一索引)：不可以出现相同的值，可以有NULL值
- INDEX(普通索引)：允许出现相同的索引内容
- PROMARY KEY(主键索引)：不允许出现相同的值
- fulltext index(全文索引)：可以针对值中的某个单词，但效率确实不敢恭维
- 组合索引：实质上是将多个字段建到一个索引里，列值的组合必须唯一

**温馨提示：**根据《阿里巴巴Java开发手册》里的mysql规约，唯一索引建议命名为**uk_字段名**，普通索引名则为**idx_字段名**。（uk_即unique key; idx_即index的简称）。



**1.建表同时建立单索引**

```
CREATE TABLE t_user1(id INT ,
userName VARCHAR(20),
PASSWORD VARCHAR(20),
INDEX (userName) #关键字INDEX
);
```

建表同时建立唯一索引（可以是单或多）

```
CREATE TABLE t_user2(id INT ,
userName VARCHAR(20),
PASSWORD VARCHAR(20),
UNIQUE INDEX index_userName(userName) #关键字UNIQUE和INDEX
);
```

建表同时建立联合索引

```
CREATE TABLE t_user3(id INT ,
userName VARCHAR(20),
PASSWORD VARCHAR(20),
INDEX index_userName_password(userName,PASSWORD)
);
```

### 给已存在表添加索引

- 单列索引
  CREATE INDEX index_userName ON t_user(userName);
- 唯一索引
  CREATE UNIQUE INDEX index_userName ON t_user(userName);
- 联合索引
  CREATE INDEX index_userName_password ON t_user(userName,PASSWORD);

**另一种写法与上面相似 但是有区别**

- 单列索引
  ALTER TABLE t_user ADD INDEX index_userName(userName);
- 唯一索引
  ALTER TABLE t_user ADD UNIQUE INDEX index_userName(userName);
- 联合索引

两种区别：
1、CREATE INDEX必须提供索引名，对于ALTER TABLE，将会自动创建，如果你不提供；
2、CREATE INDEX一个语句一次只能建立一个索引，ALTER TABLE可以在一个语句建立多个，如：
ALTER TABLE HeadOfState ADD PRIMARY KEY (ID), ADD INDEX (LastName,FirstName);
3、只有ALTER TABLE 才能创建主键，ADD INDEX 不能；

ALTER TABLE t_user ADD INDEX index_userName_password(userName,PASSWORD);

## (1)使用ALTER TABLE语句创建索性 

```java
ALTER TABLE 表名 ADD 索引类型 （unique,primary key,fulltext,index）[索引名]（字段名）
//普通索引
alter table table_name add index index_name (column_list) ;
//唯一索引
alter table table_name add unique (column_list) ;
//主键索引
alter table table_name add primary key (column_list) ;
```

    ALTER TABLE可用于创建普通索引、UNIQUE索引和PRIMARY KEY索引3种索引格式，**table_name**是要增加索引的表名，**column_list**指出对哪些列进行索引，多列时各列之间用逗号分隔。索引名index_name**可选**，缺省时，MySQL将根据第一个索引列赋一个名称。另外，ALTER TABLE允许在单个语句中更改多个表，因此可以同时创建多个索引。

## (2)使用CREATE INDEX语句对表增加索引 

CREATE INDEX可用于对表增加**普通索引或UNIQUE索引**，可用于建表时创建索引。

```java
CREATE INDEX index_name ON table_name(username(length)); 
//如果是CHAR，VARCHAR类型，length可以小于字段实际长度；如果是BLOB和TEXT类型，必须指定 length。
```

```java
//只能添加这两种索引;
CREATE INDEX index_name ON table_name (column_list)
CREATE UNIQUE INDEX index_name ON table_name (column_list)
```

 table_name、index_name和column_list具有与ALTER TABLE语句中相同的含义，**索引名不可选**。另外，**不能用CREATE INDEX语句创建PRIMARY KEY索引**。

## (3)删除索引 

 删除索引可以使用ALTER TABLE或DROP INDEX语句来实现。DROP INDEX可以在ALTER TABLE内部作为一条语句处理，其格式如下：

```java
drop index index_name on table_name ;

alter table table_name drop index index_name ;

alter table table_name drop primary key ;
```

   其中，在前面的两条语句中，都删除了table_name中的索引index_name。而在最后一条语句中，只在删除PRIMARY KEY索引中使用，因为**一个表只可能有一个PRIMARY KEY索引**，因此不需要指定索引名。如果没有创建PRIMARY KEY索引，但表具有一个或多个UNIQUE索引，则MySQL将删除第一个UNIQUE索引。

  如果从表中删除某列，则索引会受影响。对于多列组合的索引，如果删除其中的某列，则该列也会从索引中删除。如果删除组成索引的所有列，则整个索引将被删除。

## (4) 组合索引与前缀索引 

 在这里要指出，组合索引和前缀索引是对建立索引技巧的一种称呼，并不是索引的类型。为了更好的表述清楚，建立一个demo表如下。

```
create table USER_DEMO
(
   ID                   int not null auto_increment comment '主键',
   LOGIN_NAME           varchar(100) not null comment '登录名',
   PASSWORD             varchar(100) not null comment '密码',
   CITY                 varchar(30) not null comment '城市',
   AGE                  int not null comment '年龄',
   SEX                  int not null comment '性别(0:女 1：男)',
   primary key (ID)
);
```

   为了进一步榨取mysql的效率，就可以考虑建立组合索引，即将LOGIN_NAME,CITY,AGE建到一个索引里： 	

ALTER TABLE USER_DEMO ADD INDEX name_city_age (LOGIN_NAME(16),CITY,AGE);

 建表时，LOGIN_NAME长度为100，这里用16，是因为一般情况下名字的长度不会超过16，这样会加快索引查询速度，还会减少索引文件的大小，提高INSERT，UPDATE的更新速度。

   如果分别给LOGIN_NAME,CITY,AGE建立单列索引，让该表有3个单列索引，查询时和组合索引的效率是大不一样的，甚至远远低于我们的组合索引。虽然此时有三个索引，但mysql只能用到其中的那个它认为似乎是最有效率的单列索引，另外两个是用不到的，也就是说还是一个全表扫描的过程。

   建立这样的组合索引，就相当于分别建立如下三种组合索引：

```java
LOGIN_NAME,CITY,AGE
LOGIN_NAME,CITY
LOGIN_NAME
```

  为什么没有CITY,AGE等这样的组合索引呢？这是因为mysql组合索引“最左前缀”的结果。简单的理解就是只从最左边的开始组合，并不是只要包含这三列的查询都会用到该组合索引。也就是说**name_city_age(LOGIN_NAME(16),CITY,AGE)从左到右进行索引，如果没有左前索引，mysql不会执行索引查询**。

### 删除索引

DROP INDEX index_userName ON t_user;
DROP INDEX index_userName_password ON t_user;

## 三.索引的使用及注意事项

1. 首先要确定优化的目标，在什么样的业务场景下，表的大小等。**如果表比较小的话，都不需要加索引。**
2. 哪些字段可以建索引？ 一般都where、order by 或者 group by 后面的字段。
3. 记录修改的时候需要维护索引，所以会有开销，要衡量建索引之后的得与失（空间+维护换时间）。
4. 比如学生表，可以认为name的重复度比较小，而age的重复度比较大，**对于单列索引来说，比较适合建在重读度低的列上。**
5. 对于`select from students where name='张三’and age=18;`该中情况下：
   **A.** name 和 age 各自单独建立索引:
   一般来说mysql会选择其中一个索引，name的可能性比较大，因为mysq会统计每个索引上的重复度，选用低重复度的字段。所以不使用age，否则增加太多成本。
   **B.** name和age的联合索引:
   这种索引的切合度最好。但是相对单索引来说，维护的成本大,索引数据占用的存储空间也要更大。
   可是！有必要使用联合索引吗？一般没必要：学校有10000个学生，叫谢春花的会超过5个吗？5个找一个比建立联合索引花销小的多。
6. 什么情况下使用联合索引比较好呢？ 举一个例子，大学修课，需要创建一个关系对应表，有2个字段,student_id 和 teacher_id，想要查询某个老师和某个学生是否存在师生关系。
   一个学生会选50老师，一个老师会带200个学生
   如果只为student_id建立索引的情况下，经过索引会选出50条记录，然后在内存中where一下，去除其余的老师。
   相反如果只为teacher_id建立索引，经过索引会选出200条记录，然后在内存中where一下，去除其余的学生。
   两种情况都不是最优的，因为使用索引后范围依然很大，这个时候使用联合索引最合适，通过索引直接找到对应记录，差不多提高了一倍效率。

# 三.索引的使用及注意事项     

EXPLAIN可以帮助开发人员分析SQL问题,explain显示了mysql如何使用索引来处理select语句以及连接表,可以帮助选择更好的索引和写出更优化的查询语句。

使用方法,在select语句前加上Explain就可以了：

```java
Explain select * from user where id=1;
```

  尽量避免这些不走索引的sql：

```java
SELECT `sname` FROM `stu` WHERE `age`+10=30;-- 不会使用索引,因为所有索引列参与了计算

SELECT `sname` FROM `stu` WHERE LEFT(`date`,4) <1990; -- 不会使用索引,因为使用了函数运算,原理与上面相同

SELECT * FROM `houdunwang` WHERE `uname` LIKE'后盾%' -- 走索引

SELECT * FROM `houdunwang` WHERE `uname` LIKE "%后盾%" -- 不走索引

-- 正则表达式不使用索引,这应该很好理解,所以为什么在SQL中很难看到regexp关键字的原因

-- 字符串与数字比较不使用索引;
CREATE TABLE `a` (`a` char(10));
EXPLAIN SELECT * FROM `a` WHERE `a`="1" -- 走索引
EXPLAIN SELECT * FROM `a` WHERE `a`=1 -- 不走索引

select * from dept where dname='xxx' or loc='xx' or deptno=45 --如果条件中有or,即使其中有条件带索引也不会使用。换言之,就是要求使用的所有字段,都必须建立索引, 我们建议大家尽量避免使用or 关键字

```

 -- 如果mysql估计使用全表扫描要比使用索引快,则不使用索引
 索引虽然好处很多，但过多的使用索引可能带来相反的问题，索引也是有缺点的：

- 虽然索引大大提高了查询速度，同时却会降低更新表的速度，如对表进行INSERT,UPDATE和DELETE。因为更新表时，mysql不仅要保存数据，还要保存一下索引文件

- 建立索引会占用磁盘空间的索引文件。一般情况这个问题不太严重，但如果你在要给大表上建了多种组合索引，索引文件会膨胀很宽

  索引只是提高效率的一个方式，如果mysql有大数据量的表，就要花时间研究建立最优的索引，或优化查询语句。

  #### **索引使用技巧：**

    1.索引不会包含有NULL的列

   只要列中包含有NULL值，都将不会被包含在索引中，复合索引中只要有一列含有NULL值，那么这一列对于此符合索引就是无效的。

    2.使用短索引

   对串列进行索引，如果可以就应该指定一个前缀长度。例如，如果有一个char（255）的列，如果在前10个或20个字符内，多数值是唯一的，那么就不要对整个列进行索引。短索引不仅可以提高查询速度而且可以节省磁盘空间和I/O操作。

    3.索引列排序

   **mysql一张表查询只能用到一个索引**。因此如果where子句中已经使用了索引的话，那么order by中的列是不会使用索引的。因此数据库默认排序可以符合要求的情况下不要使用排序操作，尽量不要包含多个列的排序，如果需要最好给这些列建复合索引。这一点是很多程序猿容易忽略的，如where子句的字段建了索引，排序的字段建了索引，但是分开建的，以为会走索引，其实这样的话排序的字段不会使用索引的，除非建复合索引，切记。

    4.like语句操作

  一般情况下不鼓励使用like操作，如果非使用不可，注意正确的使用方式。like ‘%aaa%’不会使用索引，而like ‘aaa%’可以使用索引。

    5.不要在列上进行运算

    6.不使用NOT IN 、<>、！=操作，但<,<=，=，>,>=,BETWEEN,IN是可以用到索引的

    7.索引要建立在经常进行select操作的字段上。

   这是因为，如果这些列很少用到，那么有无索引并不能明显改变查询速度。相反，由于增加了索引，反而降低了系统的维护速度和增大了空间需求。

    8.索引要建立在值比较唯一的字段上。

    9.对于那些定义为text、image和bit数据类型的列不应该增加索引。因为这些列的数据量要么相当大，要么取值很少。

    10.在where和join中出现的列需要建立索引。

    11.where的查询条件里有不等号(where column != …),mysql将无法使用索引。

    12.如果where字句的查询条件里使用了函数(如：where DAY(column)=…),mysql将无法使用索引。

    13.在join操作中(需要从多个数据表提取数据时)，mysql只有在**主键和外键的数据类型相同**时才能使用索引，否则即使建立了索引也不会使用。

    14.在进行联表查询时，建立关联的表的字段类型最好一样且长度一致，这样能更好的发挥索引的作用。

    15.**组合索引时****切****记此条约束：组合索引中有多个字段，其中一个字段是有范围判断，则需将此字段在最后面**。如

ALTER TABLE USER_DEMO ADD INDEX name_age (NAME,AGE);  因为age会有范围判断，则建组合索引时将AGE字段放在后面。

16.**字符集字段比较，UTF8与UTF-BIN联合查询是不能走索引的。**

如某张表的order_no字段类型为varchar(50),另一张表的order_no字段类型为varchar(50) COLLATE utf8_BIN。则此时联合查询时不能走索引的，切记。

即两张表的字段类型如下：

```
`order_no` varchar(50) COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT '订单号',
`order_no` varchar(50) NOT NULL DEFAULT '' COMMENT '订单号',
```

```
17.以下几种情况不适合建索引：
```

- 表记录太少

- 经常插入、删除、修改的表

- 数据重复且分布平均的表字段。如一个表有10万行记录，其中字段column1只有A和B两种值，且每个值的分布概率大约为50%，那么对这种表column1字段建索引一般不会提高数据库的查询速度

  18.给表创建主键，对于没有主键的表，在查询和索引定义上有一定的影响。

  19.避免表字段为null，建议设置默认值（如int类型设置默认值为0），这样在索引查询上，效率会高很多。

### 建立索引的几大原则：

1.最左前缀匹配原则，非常重要的原则，mysql会一直向右匹配直到遇到范围查询(>、<、between、like)就停止匹配，比如a = 1 and b = 2 and c > 3 and d = 4 如果建立(a,b,c,d)顺序的索引，d是用不到索引的，如果建立(a,b,d,c)的索引则都可以用到，a,b,d的顺序可以任意调整。
2.=和in可以乱序，比如a = 1 and b = 2 and c = 3 建立(a,b,c)索引可以任意顺序，mysql的查询优化器会帮你优化成索引可以识别的形式
3.尽量选择区分度高的列作为索引,区分度的公式是count(distinct col)/count(*)，表示字段不重复的比例，比例越大我们扫描的记录数越少，唯一键的区分度是1，而一些状态、性别字段可能在大数据面前区分度就是0，那可能有人会问，这个比例有什么经验值吗？使用场景不同，这个值也很难确定，一般需要join的字段我们都要求是0.1以上，即平均1条扫描10条记录
4.索引列不能参与计算，保持列“干净”，比如from_unixtime(create_time) = ’2014-05-29’就不能使用到索引，原因很简单，b+树中存的都是数据表中的字段值，但进行检索时，需要把所有元素都应用函数才能比较，显然成本太大。所以语句应该写成create_time = unix_timestamp(’2014-05-29’);
5.尽量的扩展索引，不要新建索引。比如表中已经有a的索引，现在要加(a,b)的索引，那么只需要修改原来的索引即可
