## 简介

Redis 是完全开源免费的，遵守BSD协议，是一个高性能的key-value数据库。

Redis 与其他 key - value 缓存产品有以下三个特点：

- Redis支持数据的持久化，可以将内存中的数据保存在磁盘中，重启的时候可以再次加载进行使用。
- Redis不仅仅支持简单的key-value string类型的数据，同时还提供list，set，zset，hash等数据结构的存储。
- Redis支持数据的备份，即master-slave模式的数据备份。

## 优势

- 性能极高 – Redis能读的速度是110000次/s,写的速度是81000次/s 。
- 丰富的数据类型 – Redis支持二进制案例的 Strings, Lists, Hashes, Sets 及 Ordered Sets 数据类型操作。
- 原子 – Redis的所有操作都是原子性的，同时Redis还支持对几个操作全并后的原子性执行。
- 丰富的特性 – Redis还支持 publish/subscribe, 通知, key 过期等等特性。

## 和其他的key-value存储有什么不同

- Redis有着更为复杂的数据结构并且提供对他们的原子性操作，这是一个不同于其他数据库的进化路径。Redis的数据类型都是基于基本数据结构的同时对程序员透明，无需进行额外的抽象。
- Redis运行在内存中但是可以持久化到磁盘，所以在对不同数据集进行高速读写时需要权衡内存，因为数据量不能大于硬件内存。在内存数据库方面的另一个优点是，相比在磁盘上相同的复杂的数据结构，在内存中操作起来非常简单，这样Redis可以做很多内部复杂性很强的事情。同时，在磁盘格式方面他们是紧凑的以追加的方式产生的，因为他们并不需要进行随机访问。

## 面试宝典
```
1. memcached单个key老版本是1M，新版本是2M。我们可以通过memcache.h文件去修改他的单个KEY的大小。
2. redis单个key大小为512M
3. memcached是一个多线程的缓存服务器，而redis是一个单线程的服务器
4. memcached数据不能持久化，断电后数据丢失
5. redis是可以进行持久化的。可以使用RDB机制和AOF机制进行数据持久化
6. memcached不支持集群，它的多服务器情况是在addServers的时候，由客户端使用hash的方式，分配至指定的服务器上的。
7. redis支持集群，并且redis有最多16个库。memcached没有库的概念
8. redis支持更多的数据类型，而memcached只有字符型，我们需要自行处理值。
9. redis在使用的时候，还能单作队列服务器使用，还支持消息订阅（聊天室，消息推送）。
10. redis内部实现的数据结构是字典
```
## 在linux下面安装radis

1. 下载redis

   ```bash
   wget -c http://download.redis.io/releases/redis-3.2.6.tar.gz
   ```

2. 移动redis到指定目录

   ```bash
   mv redis-3.2.6 /usr/local/redis
   ```

3. 安装redis

   ```bash
   cd /usr/local/redis
   make install
   ```

4. 至此，redis就成功的安装到linux上面。

# 常用的可执行文件

| 文件名称            | 用途               |
| --------------- | ---------------- |
| redis-server    | redis的服务器        |
| redis-cli       | redis的客户端        |
| redis-benchmark | redis的性能测试工具     |
| redis-check-aof | AOF修复工具          |
| redis-check-rdb | RDB文件检查工具        |
| redis-sentinel  | 哨兵服务器，2.8版本以后新出的 |

## 启动redis

- 直接启动

  ```bash
  cd /usr/local/redis/src
  ./redis-server	#以默认配置文件进行启动
  ```

- 参数详解

  ```bash
  ./redis-server -v	#查看版本号
  ./redis-server redis.conf	#指定配置文件启动，redis.conf是默认的配置文件
  ```
## RDB和AOF是什么？

redis本质上是不能进行数据持久化存储的，但是开启了RDB和AOF就可以进行数据的持久化存储。

redis 内部如果不开启RDB机制和AOF机制，本质上redis的数据是不能够持久化的（即不能长时间保存）。

我们引入了一个机制叫作：RDB，它本质上是一个文件。每隔一段时间，这个时间可以在redis的配置文件中进行设置。将内容从内存中刷入至文件中。如果这个值过大会造成部份数据丢失。

也可以人为的使用对应的命令，RDB本质上是快照机制，生成一个新的快照替换原有老的快照。

SAVE命令（同步进入写入，刷进文件的时候，会阻塞后面的所有操作）

BGSAVE命令（后台写入，不会阻塞主进程）

**AOF**（append of file）

将命令追加至文件中。会将所有的redis命令保存至一个文件，超过最大的保存条数后，它会将原有的内容给替换掉。 

如果重启了redis，则之前的AOF内存无用，从新开始进行操作和保存。



**redis默认端口是多少？**

**6379**

## 配置redis的开机启动

1. 找到redis提供的开机启动脚本

   ```bash
   utils/redis_init_script	#这是redis提供给我们的开机启动脚本
   ```

2. 复制一份出来，并且重新命名，因为我们可能要开启多个

   ```bash
   cd utils
   cp redis_init_script redis_init_script_6379	#以端口号命名的好处是，可以通过端口号来区分
   ```

3. 编辑开机启动脚本

   ```bash
   vim redis_init-script_6379	#使用vim打开这个文件，修改下面的配置

   REDISPORT=6379	#端口号
   EXEC=/usr/local/redis/src/redis-server	#服务器脚本路径
   CLIEXEC=/usr/local/redis/src/redis-cli	#客户端脚本路径

   PIDFILE=/var/run/redis_${REDISPORT}.pid		#指定启动后的进程文件路径
   CONF="/usr/local/redis/redis_${REDISPORT}.conf"	#指定配置文件路径
   ```

4. 修改配置文件以及参数解析

   ```bash 
   cp redis/redis.conf redis/redis_6379.conf
   vim redis/redis_6379.conf
   ```

| daemonize                       | 是否后台运行，以守护进程方式进行执行 |
| ------------------------------- | ------------------ |
| pidfile /var/run/redis_6379.pid | 这个守护进程的文件放在哪儿      |
| port                            | 端口                 |
| dir                             | 将redis数据库文件放在哪儿    |

5. 启动脚本测试

```bash
/usr/local/redis/utils/redis_init_script_6379 start

#需要以守护进程启动的话，修改配置文件里面的选项即可
daemonize yes
```

6. 加入开机启动

```bash
vim /etc/rc.local	#编辑这个文件加入下面的配置
/usr/local/redis/utils/redis_init_script_6379 start #加入这一行即可
```

## 客户端连接

连接命令

```bash
redis-cli	#直接连接
redis-cli -h 127.0.0.1	-p 6379	#指定主机IP和端口号连接
ping	#返回PONG说明正常
```

## 数据类型

redis支持五种数据类型

### string（字符串）

string是redis最基本的类型，你可以理解成与Memcached一模一样的类型，一个key对应一个value。

string类型是二进制安全的。意思是redis的string可以包含任何数据。比如jpg图片或者序列化的对象 。

string类型是Redis最基本的数据类型，一个键最大能存储512MB。

```bash
redis 127.0.0.1:6379> SET name "runoob"
OK
redis 127.0.0.1:6379> GET name
"runoob"
```

在以上实例中我们使用了 Redis 的 **SET** 和 **GET** 命令。键为 name，对应的值为 **runoob**。

**注意：**一个键最大能存储512MB

### hash（哈希）

Redis hash 是一个键值对集合。

Redis hash是一个string类型的field和value的映射表，hash特别适合用于存储对象。

**实例**

```bash
127.0.0.1:6379> HMSET user:1 username runoob password runoob points 200

OK

127.0.0.1:6379> HGETALL user:1

1) "username"

2) "runoob"

3) "password"

4) "runoob"

5) "points"

6) "200"
```

以上实例中 hash 数据类型存储了包含用户脚本信息的用户对象。 实例中我们使用了 Redis **HMSET, HGETALL** 命令，**user:1** 为键值。

每个 hash 可以存储 232 -1 键值对（40多亿）。

### list（列表）

Redis 列表是简单的字符串列表，按照插入顺序排序。你可以添加一个元素到列表的头部（左边）或者尾部（右边）。

**实例**

```bash
redis 127.0.0.1:6379> lpush runoob redis

(integer) 1

redis 127.0.0.1:6379> lpush runoob mongodb

(integer) 2

redis 127.0.0.1:6379> lpush runoob rabitmq

(integer) 3

redis 127.0.0.1:6379> lrange runoob 0 10

1) "rabitmq"

2) "mongodb"

3) "redis"

redis 127.0.0.1:6379>
```

列表最多可存储 232 - 1 元素 (4294967295, 每个列表可存储40多亿)。

### set（集合）

Redis的Set是string类型的无序集合。

集合是通过哈希表实现的，所以添加，删除，查找的复杂度都是O(1)。

**sadd 命令**

添加一个string元素到,key对应的set集合中，成功返回1,如果元素已经在集合中返回0,key对应的set不存在返回错误。

sadd key member

**实例**

```bash
redis 127.0.0.1:6379> sadd runoob redis

(integer) 1

redis 127.0.0.1:6379> sadd runoob mongodb

(integer) 1

redis 127.0.0.1:6379> sadd runoob rabitmq

(integer) 1

redis 127.0.0.1:6379> sadd runoob rabitmq

(integer) 0

redis 127.0.0.1:6379> smembers runoob

1) "rabitmq"

2) "mongodb"

3) "redis"
```

**注意：**以上实例中 rabitmq 添s加了两次，但根据集合内元素的唯一性，第二次插入的元素将被忽略。

### zset(sorted set：有序集合)

Redis zset 和 set 一样也是string类型元素的集合,且不允许重复的成员。

不同的是每个元素都会关联一个double类型的分数。redis正是通过分数来为集合中的成员进行从小到大的排序。

zset的成员是唯一的,但分数(score)却可以重复。

**zadd 命令**

添加元素到集合，元素在集合中存在则更新对应score

zadd key score member 

**实例**

```bash
redis 127.0.0.1:6379> zadd runoob 0 redis

(integer) 1

redis 127.0.0.1:6379> zadd runoob 0 mongodb

(integer) 1

redis 127.0.0.1:6379> zadd runoob 0 rabitmq

(integer) 1

redis 127.0.0.1:6379> zadd runoob 0 rabitmq

(integer) 0

redis 127.0.0.1:6379> ZRANGEBYSCORE runoob 0 1000

1) "redis"

2) "mongodb"

3) "rabitmq"
```

### 其他

```shell
expire	key	 30	#设置key的过期时间
ttl key	#查看key的剩余时间
rename	oldkey	newkey	#重新命令key
del	key	#删除key

type key	#查看key类型

zdiff	key key	#计算两个key的交集

select 0	#选择数据库
dbsize	#查看数据库大小
keys * 	#查看所有的key
keys a*	#查看所有以a开头的key
info keyspace	#查看数据库key详细信息
```



## 在php7中使用redis

Github仓库地址：https://github.com/phpredis/phpredis/tree/php7



1. 下载php7的扩展

   ```bash
   git clone -b php7 https://github.com/phpredis/phpredis.git
   ```

2. 编译安装

   ```bash
   $ cd phpredis-2.2.7                      # 进入 phpredis 目录

   $ /usr/local/php7/bin/phpize              # php安装后的路径

   $ ./configure --with-php-config=/usr/local/php7/bin/php-config

   $ make && make install
   ```

3. 修改php.ini文件

   ```bash
   vi /usr/local/php/etc/php.ini
   ```

   增加如下内容:

   ```bash
   extension_dir = "/usr/local/php/lib/php7/extensions/no-debug-zts-20090626"
   extension=redis.so
   ```

4. 重启php-fpm

   ```bash
   service php-fpm restart
   ```

## session使用redis进行存储

```ini
session.save_handler = redis
session.save_path = "tcp://host1:6379?weight=1, tcp://host2:6379?weight=2&timeout=2.5, tcp://host3:6379?weight=2"
```

## 使用php操作redis

连接redis

```php
<?php
  
    //连接本地的 Redis 服务
   $redis = new Redis();
   $redis->connect('127.0.0.1', 6379);
   echo "Connection to server sucessfully";
         //查看服务是否运行
   echo "Server is running: " . $redis->ping();
```
