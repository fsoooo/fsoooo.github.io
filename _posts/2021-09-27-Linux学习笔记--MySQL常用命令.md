最近开发新项目，数据库从Sqlite切换到了MySQL，就想整理一下MySQL常用的命令。

![](https://upload-images.jianshu.io/upload_images/6943526-9903f9c025d2a54e.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#导入导出

***

###1.导出整个数据库  
```
mysqldump -u 用户名 -p –default-character-set=utf-8 数据库名 > 导出的文件名

mysqldump -u root -p sop> sop.sql  
```
###2.导出一个表  
```
mysqldump -u 用户名 -p 数据库名 表名> 导出的文件名  

mysqldump -u wcnc -p smgp_apps_wcnc users> wcnc_users.sql
```
###3.导出一个数据库结构  

```
mysqldump -u wcnc -p -d –add-drop-table smgp_apps_wcnc >d:wcnc_db.sql  

-d 没有数据 –add-drop-table 在每个create语句之前增加一个drop table
```
###4.导入数据库  
```
A:常用source 命令  

进入mysql数据库控制台，  
如mysql -u root -p  
mysql>use 数据库  
然后使用source命令，后面参数为脚本文件(如这里用到的.sql)  
mysql>source wcnc_db.sql  

B:使用mysqldump命令  

mysqldump -u username -p dbname < filename.sql  

C:使用mysql命令  

mysql -u username -p -D dbname < filename.sql

D:也可以用文本方式将数据装入数据库表中（例如D:/mysql.txt）  

mysql> LOAD DATA LOCAL INFILE “D:/mysql.txt”INTO TABLE MYTABLE;  
```

<br/>

![](https://upload-images.jianshu.io/upload_images/6943526-7a25606612719b57.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#启动与退出
***

###1.进入MySQL
```
启动MySQL Command Line Client（MySQL的DOS界面），直接输入安装时的密码即可:

mysql -uroot -p

此时的提示符是：mysql>  
```
###2.退出MySQL

```
mysql>  quit或exit
```

<br/>

#库操作 
***

###1.创建数据库  
```
命令：create database <数据库名>  

例如：建立一个名为sqlroad的数据库  mysql> create database sqlroad; 
```
 ###2.显示所有的数据库  
```
命令：show databases （注意：最后有个s）  

mysql> show databases; 
```
 ###3.删除数据库  
```
命令：drop database <数据库名>  

例如：删除名为 sqlroad的数据库  mysql> drop database sqlroad; 
```
### 4.连接数据库 
```
命令：use <数据库名>  

例如：如果sqlroad数据库存在，尝试存取它： mysql> use sqlroad;  

屏幕提示：Database changed  
```
###5.查看当前使用的数据库  
```
命令：mysql> select database();  
```
###6.当前数据库包含的表信息
```
命令：mysql> show tables; （注意：最后有个s）  
```
###7.mysql数据库的授权  

```
mysql>grant select,insert,delete,create,drop  

on *.* (或test.*/user.*/..)  

to 用户名@localhost  

identified by ‘密码’；  

如：新建一个用户帐号以便可以访问数据库，需要进行如下操作：  

mysql> grant usage  
-> ON test.*  
-> TO testuser@localhost;  
Query OK, 0 rows affected (0.15 sec)  

此后就创建了一个新用户叫：testuser，这个用户只能从localhost连接到数据库并可以连接到test 数据库。

下一步，我们必须指定testuser这个用户可以执行哪些操作：  
mysql> GRANT select, insert, delete,update  
-> ON test.*  
-> TO testuser@localhost;  
Query OK, 0 rows affected (0.00 sec)  

此操作使testuser能够在每一个test数据库中的表执行SELECT，INSERT和DELETE以及UPDATE查询操作。

现在我们结束操作并退出MySQL客户程序：  
mysql> exit` 
```

<br/>

![](https://upload-images.jianshu.io/upload_images/6943526-cc3da27d4e0e491d.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


#表操作
***
>**操作之前应连接某个数据库**

###1.建表  
```
命令：create table <表名> ( <字段名> <类型> [,..<字段名n> <类型n>]);  

mysql> create table MyClass(  
id int(4) not null primary key auto_increment,  
name char(20) not null,  
sex int(4) not null default ’′,  
degree double(16,2));` 
```
###2.获取表结构  
```
命令：desc 表名，或者show columns from 表名  

mysql>DESCRIBE MyClass  

mysql> desc MyClass;  

mysql> show columns from MyClass;
```
###3.删除表  
```
命令：drop table <表名>  

例如：删除表名为 MyClass 的表  

mysql> drop table MyClass;` 
```
###4.插入数据  
```
命令：insert into <表名> [( <字段名>[,..<字段名n> ])] values ( 值 )[, ( 值n )]  

例如，往表 MyClass中插入二条记录,

这二条记录表示：编号为的名为Tom的成绩为.45, 编号为 的名为Joan 的成绩为.99，编号为 的名为Wang 的成绩为.5.  

mysql> insert into MyClass values(1,’Tom’,96.45),(2,’Joan’,82.99), (2,’Wang’, 96.59);` 
```
###5.查询表中的数据  
```
查询所有行  

命令：select <字段，字段，...> from < 表名 > where < 表达式 >  

例如：查看表 MyClass 中所有数据  

mysql> select * from MyClass;  

查询前几行数据  

例如：查看表 MyClass 中前行数据  

mysql> select * from MyClass order by id limit 0,2;  

或者：  

mysql> select * from MyClass limit 0,2;` 
```
###6.删除表中数据  
```
命令：delete from 表名 where 表达式  

例如：删除表 MyClass中编号为 的记录  

mysql> delete from MyClass where id=1;` 
```
###7.修改表中数据
```
命令：update 表名 set 字段=新值,…where 条件  

mysql> update MyClass set name=’Mary’where id=1;` 
```
###8.在表中增加字段： 
```
命令：alter table 表名 add字段 类型 其他;  

例如：在表MyClass中添加了一个字段passtest，类型为int(4)，默认值为  1

mysql> alter table MyClass add passtest int(4) default 1

```
###9.更改表名
```
命令：rename table 原表名 to 新表名;  

例如：在表MyClass名字更改为YouClass  

mysql> rename table MyClass to YouClass;  
```

###10.更新字段内容
```
update 表名 set 字段名 = 新内容  

update 表名 set 字段名 = replace(字段名,’旧内容’, 新内容’)  

update article set content=concat(‘　　’,content);
```
###11.删除清空全表
```
删除表  mysql>drop TABLE MYTABLE;  

清空表  mysql>delete from MYTABLE;  
```

<br/>

#数据库字段类型
***
```
1.INT[(M)] 型：正常大小整数类型  

2.DOUBLE[(M,D)] [ZEROFILL] 型：正常大小(双精密)浮点数字类型  

3.DATE 日期类型：支持的范围是-01-01到-12-31。

MySQL以YYYY-MM-DD格式来显示DATE值，但是允许你使用字符串或数字把值赋给DATE列  

4.CHAR(M) 型：定长字符串类型，当存储时，总是是用空格填满右边到指定的长度  

5.BLOB TEXT类型，最大长度为(2^16-1)个字符。 

6.VARCHAR型：变长字符串类型  
```
![](https://upload-images.jianshu.io/upload_images/6943526-2b0e0543a3b33097.gif?imageMogr2/auto-orient/strip)
