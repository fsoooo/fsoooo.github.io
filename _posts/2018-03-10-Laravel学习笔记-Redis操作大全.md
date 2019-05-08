---
layout: post
catalog: true
tags:
  - Laravel
  - Redis
  - 编程
---

### 入门级操作

普通 set / get 操作； `set`操作，如果键名存在，则会覆盖原有的值；

```
$redis = app('redis.connection');
$redis->set('library', 'predis'); // 存储 key 为 library， 值为 predis 的记录；
$redis->get('library'); // 获取 key 为 library 的记录值
```

`set` / `get`多个 key-value

```php
$mkv = array(
    'usr:0001' => 'First user',
    'usr:0002' => 'Second user',
    'usr:0003' => 'Third user'
);

$redis->mset($mkv);  // 存储多个 key 对应的 value
$retval = $redis -> mget (array_keys( $mkv));  //获取多个key对应的value
```

存放带存储时效的记录

```
$redis->setex('library', 10, 'predis'); 
// 存储 key 为 library， 值为 predis 的记录, 有效时长为 10 秒
```

`add`操作,不会覆盖已有值

```
$redis->setnx('foo', 12) ;  // 返回 true ， 添加成功
$redis->setnx('foo', 34) ;  // 返回 false， 添加失败，因为已经存在键名为 foo 的记录
```

`set`的变种，结果返回替换前的值

```
$redis->getset('foo', 56) ; // 返回 34； 如果之前不存在记录，则返回 null
```

`incrby`/`incr`/`decrby`/`decr` 对值的递增和递减

```
$redis->incr('foo') ;  // 返回 57，同时 foo 的值为 57
$redis->incrby('foo', 2 ) ;  // 返回 59，同时 foo 的值为 59
```

检测是否存在值

```
$redis->exists('foo');
```

删除

```
$redis->del('foo'); // 成功删除返回 true, 失败则返回 false
```

`type`类型检测，字符串返回 `string`，列表返回 `list`，`set` 表返回 `set`/`zset`，`hash` 表返回 `hash`；

```
$redis->type('foo');
```

`append` 连接到已存在字符串

```
$redis->get('str'); // 返回 test
$redis->append('str', '_123');  // 返回累加后的字符串长度 8,此时 str 为 'test_123'
```

`setrange` 部分替换操作, 并返回字符串长度

```
$redis->setrange('str', 0, 'abc');  // 返回 3, 第2个参数为 0 时等同于 set 操作
$redis->setrange('str', 2, 'cd'); // 返回 4, 表示从第2个字符后替换，这时 'str' 为 'abcd'
```

`substr` 部分获取操作

```
$redis->substr('str', 0, 2); // 返回'abc'; 表示从第 0 个起，取到第 2 个字符
```

`strlen` 获取字符串长度

```
$redis->strlen ('str');  // 返回 4; 此时 'str' 为 'abcd'
```

`setbit`位存储

```
$redis->setbit('binary', 31, 1);   //表示在第31位存入1,这边可能会有大小端问题?不过没关系, getbit 应该不会有问题
```

`getbit`位获取

```
$redis->getbit('binary', 31);     //返回1
```

`keys` 模糊查找功能,支持 * 号以及 ? 号 (匹配一个字符)

```
$redis->set('foo1', 123);
$redis->set('foo2', 456);
$redis->keys('foo*');   // 返回 foo1 和 foo2 的 array
$redis->keys('f?o?');   // 同上
randomkey`随机返回一个`key
$redis->randomkey() ;  // 可能是返回 'foo1' 或者是 'foo2' 及其它任何已存在的 key
rename`/`renamenx`方法对`key`进行改名，所不同的是`renamenx`不允许改成已存在的`key
$redis->rename('str', 'str2');  // 把原先命名为'str'的 key 改成了 'str2'
```

`expire` 设置 key-value 的时效性
`ttl` 获取剩余有效期
`persist` 重新设置为永久存储

```
$redis->expire('foo', 10);  // 设置有效期为 10 秒
$redis->ttl('foo');  // 返回剩余有效期值 10 秒
$redis->persisit('foo');  // 取消 expire 行为
```

`dbsize` 返回`redis`当前数据库的记录总数

```
$redis->dbsize() ;
```

### 队列操作

`rpush`/`rpushx` 有序列表操作,从队列后插入元素；`lpush`/`lpushx` 和 `rpush`/`rpushx` 的区别是插入到队列的头部,同上,'x'含义是只对已存在的 key 进行操作

```
$redis->rpush('fooList', 'bar1');  // 返回列表长度 1
$redis->lpush('fooList', 'bar0');  // 返回列表长度 2
$redis->rpushx('fooList', 'bar2');  // 返回 3, rpushx只对已存在的队列做添加,否则返回 0
```

`llen`返回当前列表长度

```
$redis->llen('fooList'); // 返回 3
```

`lrange` 返回队列中一个区间的元素

```
$redis->lrange ('fooList', 0, 1);  // 返回数组包含第 0 个至第 1 个, 共2个元素
$redis->lrange ('fooList', 0, -1); //返回第0个至倒数第一个, 相当于返回所有元素
```

`lindex` 返回指定顺序位置的 list 元素

```
$redis->lindex('fooList', 1) ;  // 返回'bar1'
lset` 修改队列中指定位置的`value
$redis->lset('fooList', 1, '123'); // 修改位置 1 的元素, 返回 true
```

`lrem` 删除队列中左起指定数量的字符

```
$redis->lrem('fooList', 1, '_') ;  // 删除队列中左起(右起使用-1) 1个 字符'_'(若有)
```

`lpop`/`rpop` 类似栈结构地弹出(并删除)最左或最右的一个元素

```
$redis->lpop('fooList') ;  // 返回 'bar0'
$redis->rpop('fooList') ;  // 返回 'bar2'
```

`ltrim`队列修改，保留左边起若干元素，其余删除

```
$redis->ltrim('fooList',  0, 1) ;  // 保留左边起第 0 个至第 1 个元素
```

`rpoplpush` 从一个队列中 `pop` 出元素并 `push` 到另一个队列

```
$redis->rpush('list1', 'ab0');
$redis->rpush('list1', 'ab1');
$redis->rpush('list2', 'ab2');
$redis->rpush('list2', 'ab3');
$redis->rpoplpush('list1', 'list2'); 
// 结果list1 =>array('ab0'), list2 =>array('ab1','ab2','ab3')
$redis->rpoplpush('list2', 'list2');
// 也适用于同一个队列, 把最后一个元素移到头部 list2 =>array('ab3','ab1','ab2')
```

`linsert`在队列的中间指定元素前或后插入元素

```
$redis->linsert('list2', 'before', 'ab1', '123');  //表示在元素 'ab1' 之前插入 '123'
$redis->linsert('list2', 'after', 'ab1', '456');   //表示在元素 'ab1' 之后插入 '456'
```

`blpop`/`brpop` 阻塞并等待一个列队不为空时，再`pop`出最左或最右的一个元素（这个功能在php以外可以说非常好用）

```
$redis->blpop('list3', 10) ;  
// 如果 list3 为空则一直等待,直到不为空时将第一元素弹出, 10 秒后超时
```

### set 集合操作

```
//sadd`增加`set`集合元素， 返回`true`， 重复返回`false
$redis->sadd('set1', 'ab');
$redis->sadd('set1', 'cd');
$redis->sadd('set1', 'ef');
```

`srem` 移除指定元素

```
$redis->srem('set1', 'cd');  // 删除'cd'元素
```

`spop` 弹出首元素

```
$redis->spop('set1');  // 返回 'ab'
```

`smove` 移动当前`set`集合的指定元素到另一个`set`集合

```
$redis->sadd('set2', '123');
$redis->smove('set1', 'set2', 'ab'); // 移动'set1'中的'ab'到'set2', 返回true or false；此时 'set1'集合不存在 'ab' 这个值
```

`scard` 返回当前set表元素个数

```
$redis->scard('set2'); // 返回 2
```

`sismember` 判断元素是否属于当前`set`集合

```
$redis->sismember('set2', '123');  // 返回 true or false
```

`smembers` 返回当前`set`集合的所有元素

```
$redis->smembers('set2');  // 返回 array('123','ab')
```

`sinter`/`sunion`/`sdiff` 返回两个表中元素的交集/并集/补集

```
$redis->sadd('set1', 'ab') ;
$redis->sinter('set2', 'set1') ;  //返回array('ab')
```

`sinterstore`/`sunionstore`/`sdiffstore` 将两个表交集/并集/补集元素 copy 到第三个表中

```
$redis->set('foo', 0);
$redis->sinterstore('foo', 'set1');  // 等同于将'set1'的内容copy到'foo'中，并将'foo'转为set表
$redis->sinterstore('foo', array('set1', 'set2'));  // 将'set1'和'set2'中相同的元素 copy 到'foo'表中, 覆盖'foo'原有内容
```

`srandmember` 返回表中一个随机元素

```
$redis->srandmember('set1') ;
```

### 有序set表操作

`sadd` 增加元素，并设置序号，成功返回true，重复返回false

```
$redis->zadd('zset1', 1, 'ab');
$redis->zadd('zset1', 2, 'cd');
$redis->zadd('zset1', 3, 'ef');
```

`zincrby` 对指定元素索引值的增减,改变元素排列次序

```
$redis -> zincrby ( 'zset1' , 10 , 'ab' ) ; //返回11
```

`zrem` 移除指定元素

```
$redis->zrem('zset1', 'ef');  // 返回 true or false
```

`zrange` 按位置次序返回表中指定区间的元素

```
$redis->zrange('zset1', 0, 1);  // 返回位置 0 和 1 之间(两个)的元素
$redis->zrange('zset1', 0, -1); // 返回位置 0 和倒数第一个元素之间的元素(相当于所有元素)
```

`zrevrange` 同上,返回表中指定区间的元素,按次序倒排

```
$redis->zrevrange('zset1', 0, -1);  // 元素顺序和zrange相反
```

`zrangebyscore`/`zrevrangebyscore` 按顺序/降序返回表中指定索引区间的元素

```
$redis->zadd('zset1', 3, 'ef');
$redis->zadd('zset1', 5, 'gh');
$redis->zrangebyscore('zset1', 2, 9);  //返回索引值2-9之间的元素 array('ef','gh')
$redis->zrangebyscore('zset1', 2, 9, 'withscores'); // 返回索引值2-9之间的元素并包含索引值 array(array('ef',3),array('gh',5))
$redis->zrangebyscore('zset1', 2, 9, array('withscores'=>true, 'limit'=>array(1, 2)));  //返回索引值2-9之间的元素,'withscores' =>true表示包含索引值; 'limit'=>array(1, 2),表示偏移1条，返回2条,结果为array(array('ef',3),array('gh',5))
```

`zunionstore`/`zinterstore` 将多个表的并集/交集存入另一个表中

```php
$redis->zunionstore('zset3', array('zset1', 'zset2', 'zset0'));  //将'zset1','zset2','zset0'的并集存入'zset3'
$redis->zunionstore('zset3', array('zset1', 'zset2'), array('weights' => array(2, 1))); //weights参数表示权重，其中表示并集后 zset1集合的分 * 2 后存储到 zset3 集合， zset2集合的分 * 1 后存储到 zset3 集合
$redis->zunionstore('zset3', array('zset1', 'zset2'), array('aggregate' => 'max')); //'aggregate' => 'max'或'min'表示并集后相同的元素是取大值或是取小值
```

`zcount` 统计一个索引区间的元素个数

```
$redis->zcount('zset1', 3, 5); // 返回 2
$redis->zcount('zset1', '(3', 5));  //'(3'表示索引值在3-5之间但不含3,同理也可以使用'(5'表示上限为5但不含5
```

`zcard` 统计元素个数

```
$redis->zcard('zset1'); // 返回 4
```

`zscore` 查询元素的索引

```
$redis->zscore('zset1', 'ef'); // 返回 3
```

`zremrangebyscore` 删除一个索引区间的元素

```
$redis->zremrangebyscore('zset1', 0, 2);  // 删除索引在0-2之间的元素('ab','cd'), 返回删除元素个数2
```

`zrank`/`zrevrank` 返回元素所在表顺序/降序的位置(不是索引)

```
$redis->zrank('zset1', 'ef'); // 返回0,因为它是第一个元素；zrevrank则返回1(最后一个)
```

`zremrangebyrank` 删除表中指定位置区间的元素

```
$redis->zremrangebyrank('zset1', 0, 10);  //删除位置为0-10的元素,返回删除的元素个数2 
```

### Hash表操作

`hset`/`hget` 存取hash表的数据

```
$redis->hset('hash1', 'key1', 'v1');  //将key为'key1' value为'v1'的元素存入hash1表
$redis->hset('hash1', 'key2', 'v2');
$redis->hget('hash1', 'key1');   //取出表'hash1'中的key 'key1'的值,返回'v1'
```

`hexists` 返回hash表中的指定key是否存在

```
$redis->hexists('hash1', 'key1') ;  //true or false
```

`hdel` 删除hash表中指定key的元素

```
$redis->hdel('hash1', 'key2') ;  //true or false
```

`hlen` 返回hash表元素个数

```
$redis->hlen('hash1');  // 返回 1
```

`hsetnx` 增加一个元素,但不能重复

```
$redis->hsetnx('hash1', 'key1', 'v2') ;  // false
$redis->hsetnx('hash1', 'key2', 'v2') ;  // true
```

`hmset`/`hmget` 存取多个元素到hash表

```php
$redis->hmset('hash1', array('key3' => 'v3', 'key4' => 'v4')); 
$redis->hmget('hash1', array('key3', 'key4'));  // 返回相应的值 array('v3','v4')
```

`hincrby` 对指定key进行累加

```
$redis->hincrby('hash1', 'key5', 3);  // 不存在，则存储并返回 3；存在，即返回 原有值 + 3；
$redis->hincrby('hash1', 'key5', 10);  // 返回13
```

`hkeys` 返回hash表中的所有key

```
$redis->hkeys('hash1');  // 返回array('key1', 'key2', 'key3', 'key4', 'key5')
```

`hvals` 返回hash表中的所有value

```
$redis->hvals('hash1');  // 返回 array('v1','v2','v3','v4',13)
```

`hgetall` 返回整个hash表元素

```
$redis->hgetall('hash1');  // 返回 array('key1'=>'v1','key2'=>'v2','key3'=>'v3','key4'=>'v4','key5'=>13)
```

### 排序操作

`sort` 排序

```php
$redis->rpush('tab', 3);
$redis->rpush('tab', 2);
$redis->rpush('tab', 17);
$redis->sort('tab');   // 返回 array(2,3,17)
// 使用参数,可组合使用 array('sort' => 'desc','limit' => array(1, 2))
$redis->sort('tab', array('sort' => 'desc'));   // 降序排列，返回 array(17,3,2)
$redis->sort('tab', array('limit' => array(1, 2)));   //返回顺序位置中1的元素2个(这里的2是指个数,而不是位置)，返回array(3,17)
$redis->sort('tab', array('limit' => array('alpha' => true)));  //按首字符排序返回array(17,2,3)，因为17的首字符是'1'所以排首位置
$redis->sort('tab', array('limit' => array('store' => 'ordered')));  //表示永久性排序，返回元素个数
$redis->sort('tab', array('limit' => array('get' => 'pre_*')));  //使用了通配符'*'过滤元素，表示只返回以'pre_'开头的元素
```

### Redis管理操作

`info` 显示服务当状态信息

```
$redis->info();
```

`select` 指定要操作的数据库

```
$redis->select(4);  // 指定数据库的下标
```

`flushdb` 清空当前库

```
$redis->flushdb();
```

`move` 移动当库的元素到其它数据库

```
$redis->set('tomove', 'bar');
$redis->move('tomove', 4);
```

`slaveof` 配置从服务器

```
$redis->slaveof('127.0.0.1', 80);  // 配置 127.0.0.1 端口 80 的服务器为从服务器
$redis->slaveof();  // 清除从服务器
```

同步保存服务器数据到磁盘

```
$redis->save();
```

异步保存服务器数据到磁盘

```
$redis->bgsave ();
```

返回最后更新磁盘的时间

```
$redis->lastsave();
```
