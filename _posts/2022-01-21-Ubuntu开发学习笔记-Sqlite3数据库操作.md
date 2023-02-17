**Sqlite**一款主要用于嵌入式的轻量级数据库，它占用资源非常的低，可能只需要几百K的内存就够了。**Sqlite**能够支持Windows/Linux/Unix等等主流的操作系统，同时能够跟很多程序语言相结合，比如 Tcl、C#、PHP、Java等，还有ODBC接口。

 ## 安装

在终端输入：（一般系统中自带，不需要手动安装）

```
sudo apt-get install sqlite3
```
我们也可以选择安装图形界面程序，如**sqlitebrowser**：

```
sudo apt-get install sqlitebrowser
```

安装完成后，查看版本：

```
sqlite3 -version
```
安装其它语言的支持：
```
//PHP支持   
sudo apt-get install php5-sqlite  
//Ruby支持   
sudo apt-get install libsqlite3-ruby  
//Python支持   
sudo apt-get install python-pysqlite2  
```

## 基本命令介绍

### 创建或打开数据库：
可以在任意目录下（如/usr/local/database），执行下面命令
```
sqlite3 test.db  
```
我们建立了test.db数据库文件，一般存放位置当前目录下。如果数据库文件存在则打开。
注意：该命令执行之后，如果在当前目录没有test.db的话，就会创建该文件，如果已经存在的话直接使用该数据库文件。

使用.database可以查看所创建的数据库


### 创建表

数据类型，可以参考官方文档。
```
create table mytable(name varchar(10),age smallint);  
```
> **注意：**；必须添加在行尾。

使用**`.table`**可以看看自己创建的表mytable
```
mytable  test
```
使用**`.schema mytable`**查看表结构
```
CREATE TABLE mytable(
        name varchar(10)，--姓名
        age smallint，--年龄
);
```
###向表中插入数据
```
insert into mytable values('mark',28);  
insert into mytable values('hello',30);  
```
### 查询数据表：

1.  简单的查询：
    ![](https://upload-images.jianshu.io/upload_images/6943526-f85c6ad44cc4aa7d?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

2.  设置显示模式为列表模式：
    ![](https://upload-images.jianshu.io/upload_images/6943526-35a79c1fca0cfafd?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

3.  以插入语句方式查询：
    ![](https://upload-images.jianshu.io/upload_images/6943526-7a9bb33d0a2b488b?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

4.  设置显示模式为行模式（更多模式详见帮助）：
    ![](https://upload-images.jianshu.io/upload_images/6943526-9394e5bf67af619f?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

5.  更改分界符：
    ![](https://upload-images.jianshu.io/upload_images/6943526-11ca4759660f5732?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

6.  在头部加上字段（on为开，off为关闭该选项）：
    ![](https://upload-images.jianshu.io/upload_images/6943526-706d2949c51b582c?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

7.  用指定的字符串代替输出的NULL值
    ![](https://upload-images.jianshu.io/upload_images/6943526-2cad6a56b11f732c?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 修改数据：

![](https://upload-images.jianshu.io/upload_images/6943526-da976562db182eb6?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


### 查询数据库信息：

![](https://upload-images.jianshu.io/upload_images/6943526-c94d5015fdaaf168?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 查询数据库中的表信息：

![](https://upload-images.jianshu.io/upload_images/6943526-7f519bb4fd97f968?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 显示当前显示格式的配置：

![](https://upload-images.jianshu.io/upload_images/6943526-dd0c56eadd334ed7?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 配置文件：

有了配置文件就不需要每次打开数据库再进行配置了。位置在：/home/.sqliterc.

### 在终端显示形成数据库的SQL脚本（后面加表名则为形成表的SQL脚本）：

![](https://upload-images.jianshu.io/upload_images/6943526-ea824862ff3be997?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 将输出打印到文件（默认为stdout）：

![](https://upload-images.jianshu.io/upload_images/6943526-a9a7a1639fed8283?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 执行指定文件中的SQL语句：

![](https://upload-images.jianshu.io/upload_images/6943526-4abc59e4f1c096b9?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 删除：

![](https://upload-images.jianshu.io/upload_images/6943526-63c642959332b16a?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 删除表：

![](https://upload-images.jianshu.io/upload_images/6943526-3b6927ab99996beb?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 备份数据库：

![](https://upload-images.jianshu.io/upload_images/6943526-8c88b7a5f8fc9b67?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 恢复数据库：

![](https://upload-images.jianshu.io/upload_images/6943526-083f140815e20119?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 帮助：

![](https://upload-images.jianshu.io/upload_images/6943526-c68eaf5505110c6f?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 退出：

![](https://upload-images.jianshu.io/upload_images/6943526-735334ab519e8915?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 删除数据库

很不幸运，SQLite无法同其他数据库那样删除数据库文件，即**`DROP DATABASE test;`**无效，但是我们可以直接像删除文件一样删除数据库文件，在/usr/local/database下面删除test.db文件即可。


