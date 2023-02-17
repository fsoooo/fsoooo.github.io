在 MySQL 中，删除的方法总共有 3 种：delete、truncate、drop，都是删除，delete、drop、truncate有什么区别？

![](https://upload-images.jianshu.io/upload_images/6943526-1d3bef96bb859fce.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 1.delete

detele 可用于删除表的部分或所有数据，它的使用语法如下：

```
delete from table_name [where...] [order by...] [limit...]
```

> PS：[] 中的命令为可选命令，可以被省略。

如果我们要删除学生表中数学成绩排名最高的前 3 位学生，可以使用以下 SQL：

```
delete from student order by math desc limit 3;
```

### 1.1 delete 实现原理

在 InnoDB 引擎中，delete 操作并不是真的把数据删除掉了，而是给数据打上删除标记，标记为删除状态。

这一点我们可以通过将 MySQL 设置为非自动提交模式，来测试验证一下。

非自动提交模式的设置 SQL 如下：

```
set autocommit=0;
```

之后先将一个数据 delete 删除掉，然后再使用 rollback 回滚操作，最后验证一下我们之前删除的数据是否还存在。

如果数据还存在，就说明 delete 并不是真的将数据删除掉了，只是标识数据为删除状态而已

验证 SQL 和执行结果如下图所示：[图片上传失败...(image-cbec24-1655709716634)]

### 1.2 关于自增列

在 InnoDB 引擎中，使用了 delete 删除所有的数据之后，并不会重置自增列为初始值，我们可以通过以下命令来验证一下：

![](https://upload-images.jianshu.io/upload_images/6943526-c577d73f19c3524d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


## 2.truncate

truncate 执行效果和 delete 类似，也是用来删除表中的所有行数据的，它的使用语法如下：

```
truncate [table] table_name
```

>truncate 在使用上和 delete 最大的区别是：**delete 可以使用条件表达式删除部分数据，而 truncate 不能加条件表达式，所以它只能删除所有的行数据**，

比如以下 truncate 添加了 where 命令之后就会报错：

![](https://upload-images.jianshu.io/upload_images/6943526-f52ea1c5d9a9d2ed.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


### 2.1 truncate 实现原理

truncate 看似只删除了行数据，但它却是 DDL 语句，也就是 `Data Definition Language` 数据定义语言，它是用来维护存储数据的结构指令，所以这点也是和 delete 命令是不同的，delete 语句属于 DML，`Data Manipulation Language` 数据操纵语言，用来对数据进行操作的。

为什么 truncate 只是删除了行数据，没有删除列数据（字段和索引等数据）却是 DDL 语言呢？

这是因为 truncate 本质上是新建了一个表结构，再把原先的表删除掉，所以它属于 DDL 语言，而非 DML 语言。

### 2.2 重置自增列

truncate 在 InnoDB 引擎中会重置自增列，如下命令所示：![](https://upload-images.jianshu.io/upload_images/6943526-d52ce4397b90f200.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


## 3.drop

drop 和前两个命令只删除表的行数据不同，drop 会把整张表的行数据和表结构一起删除掉，它的语法如下：

```
DROP [TEMPORARY] TABLE [IF EXISTS] tbl_name [,tbl_name]
```

> 其中 TEMPORARY 是临时表的意思，一般情况下此命令都会被忽略。

drop 使用示例如下：![](https://upload-images.jianshu.io/upload_images/6943526-ec8c5e0c5aa5d154.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


## 三者的区别

1.  数据恢复方面：delete 可以恢复删除的数据，而 truncate 和 drop 不能恢复删除的数据。
2.  执行速度方面：drop > truncate > delete。
3.  删除数据方面：drop 是删除整张表，包含行数据和字段、索引等数据，而 truncate 和 drop 只删除了行数据。
4.  添加条件方面：delete 可以使用 where 表达式添加查询条件，而 truncate 和 drop 不能添加 where 查询条件。
5.  重置自增列方面：在 InnoDB 引擎中，truncate 可以重置自增列，而 delete 不能重置自增列。

## 小结

delete、truncate 可用于删除表中的行数据，而 drop 是把整张表全部删除了，删除的数据包含所有行数据和字段、索引等数据。

其中 delete 删除的数据可以被恢复，而 truncate 和 drop 是不可恢复的。

但在执行效率上，后两种删除方式又有很大的优势，所以要根据实际场景来选择相应的删除命令，当然 truncate 和 drop 这些不可恢复数据的删除方式使用的时候也要小心。

![](https://upload-images.jianshu.io/upload_images/6943526-4fa41881f634c5d8.gif?imageMogr2/auto-orient/strip)

