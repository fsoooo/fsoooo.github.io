---
layout: post
catalog: true
tags:
  - Laravel
  - Redis
  - Hash
  - 编程
---

## Redis 哈希(Hash)

Redis hash 是一个string类型的field和value的映射表，hash特别适合用于存储对象。

Redis 中每个 hash 可以存储 232 - 1 键值对（40多亿）。

![](https://upload-images.jianshu.io/upload_images/6943526-da4dc0bdc8f49a16.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



#### 实例：

```shell
127.0.0.1:6379>  HMSET runoobkey name "redis tutorial" description "redis basic commands for caching" likes 20 visitors 23000
OK
127.0.0.1:6379>  HGETALL runoobkey
1) "name"
2) "redis tutorial"
3) "description"
4) "redis basic commands for caching"
5) "likes"
6) "20"
7) "visitors"
8) "23000"
```

# 1.hset

**描述：**

​	将哈希表key中的域field的值设为value。

​	如果key不存在，一个新的哈希表被创建并进行HSET操作。

​	如果域field已经存在于哈希表中，旧值将被覆盖。

**参数：**key field value

**返回值：**

​	如果field是哈希表中的一个新建域，并且值设置成功，返回1。

​	如果哈希表中域field已经存在且旧值已被新值覆盖，返回0。


```php
$redis->hSet('h', 'key1', 'hello');
```
# 2.hSetNx

**描述：**

​	将哈希表key中的域field的值设置为value，当且仅当域field不存在。

​	若域field已经存在，该操作无效。如果key不存在，一个新哈希表被创建并执行HSETNX命令。

**参数：**key field value

**返回值：**

​	设置成功，返回1。如果给定域已经存在且没有操作被执行，返回0。

​	如果key不存在，一个新的哈希表被创建并进行HSET操作。成功返回1

​	如果域field已经存在于哈希表中，旧值将被覆盖。成功返回0

​	将哈希表key中的域field的值设置为value，当且仅当域field不存在。设置成功返回1

​	若域field已经存在，该操作无效。返回0
```php
$redis->hSetNx('h', 'key1', 'hello');
```
# 3.hGet

**描述：**给定域的值。

**参数：**key

**返回值：**当给定域不存在或是给定key不存在时，返回nil。

```php
$redis->hGet('h', 'key1');
```
# 4.hLen

**描述：**返回哈希表key中域的数量。

**参数：**key

**返回值：**哈希表中域的数量。当key不存在时，返回0。

```php
$redis->hSet('h', 'key1', 'hello');

$redis->hSet('h', 'key2', 'plop');

$redis->hLen('h'); /* returns 2 */
```
# 5.hDel

**描述：**删除哈希表key中的一个或多个指定域，不存在的域将被忽略。

**参数：**key field [field ...]

**返回值：**被成功移除的域的数量，不包括被忽略的域。

```php
$redis->delete('h')
```
# 6.hKeys

**描述:**

​	返回哈希表key中的所有域

​	一个包含哈希表中所有域的表。

​	当key不存在时，返回一个空表。

**参数**：key

**返回值：**一个包含哈希表中所有域的表。当key不存在时，返回一个空表。

```php
$redis->hSet('h', 'a', 'x');

$redis->hSet('h', 'b', 'y');

$redis->hSet('h', 'c', 'z');

$redis->hSet('h', 'd', 't');

var_dump($redis->hKeys('h'));

array(4) {

[0]=>

string(1) "a"

[1]=>

string(1) "b"

[2]=>

string(1) "c"

[3]=>

string(1) "d"

}
```
# 7.hVals

**描述：**

​	返回哈希表key中的所有值。

​	一个包含哈希表中所有值的表。

**返回值：**当key不存在时，返回一个空表。

```php
$redis->hSet('h', 'a', 'x');

$redis->hSet('h', 'b', 'y');

$redis->hSet('h', 'c', 'z');

$redis->hSet('h', 'd', 't');

var_dump($redis->hVals('h'));

array(4) {

[0]=>

string(1) "x"

[1]=>

string(1) "y"

[2]=>

string(1) "z"

[3]=>

string(1) "t"

}
```
# 8.hGetAll

**描述：**

​	返回哈希表key中，所有的域和值。

​	在返回值里，紧跟每个域名(field name)之后是域的值(value)，所以返回值的长度是哈希表大小的两倍。

**参数：**key

**返回值：**以列表形式返回哈希表的域和域的值。 若key不存在，返回空列表。

```php
$redis->delete('h');

$redis->hSet('h', 'a', 'x');

$redis->hSet('h', 'b', 'y');

$redis->hSet('h', 'c', 'z');

$redis->hSet('h', 'd', 't');

var_dump($redis->hGetAll('h'));

array(4) {

["a"]=>

string(1) "x"

["b"]=>

string(1) "y"

["c"]=>

string(1) "z"

["d"]=>

string(1) "t"

}
```
# 9.hExists

**描述：**查看哈希表key中，给定域field是否存在。

**参数：**key field

**返回值：**如果哈希表含有给定域，返回1。如果哈希表不含有给定域，或key不存在，返回0。

```php
$redis->hSet('h', 'a', 'x');

$redis->hExists('h', 'a'); /*  TRUE */

$redis->hExists('h', 'NonExistingKey'); /* FALSE */
```
# 10.hIncrBy

**描述：**

​	为哈希表key中的域field的值加上增量increment。

​	增量也可以为负数，相当于对给定域进行减法操作。

​	如果key不存在，一个新的哈希表被创建并执行HINCRBY命令。

​	如果域field不存在，那么在执行命令前，域的值被初始化为0。

​	对一个储存字符串值的域field执行HINCRBY命令将造成一个错误

**参数：**key field increment

**返回值：**执行HINCRBY命令之后，哈希表key中域field的值。

```php
$redis->hIncrBy('h', 'x', 2); /* returns 2: h[x] = 2 now. */

$redis->hIncrBy('h', 'x', 1); /* h[x] ← 2 + 1. Returns 3 */
```
# 11.hIncrByFloat

根据HASH表的KEY，为KEY对应的VALUE自增参数VALUE。浮点型Parameters

```php

$redis->hIncrByFloat('h','x', 1.5); /* returns 1.5: h[x] = 1.5 now */

$redis->hIncrByFLoat('h', 'x', 1.5); /* returns 3.0: h[x] = 3.0 now */

$redis->hIncrByFloat('h', 'x', -3.0); /* returns 0.0: h[x] = 0.0 now */

```
# 12.hMset

**描述：**

​	返回哈希表key中的所有值。

​	同时将多个field - value(域-值)对设置到哈希表key中。

​	此命令会覆盖哈希表中已存在的域。

​	如果key不存在，一个空哈希表被创建并执行HMSET操作。

​	如果命令执行成功，返回OK。

​	当key不是哈希表(hash)类型时，返回一个错误。

**参数：**key

**返回值：**一个包含哈希表中所有值的表。当key不存在时，返回一个空表。

```php
$redis->hMset('user:1', array('name' => 'Joe', 'salary' => 2000));

$redis->hIncrBy('user:1', 'salary', 100); // Joe earns 100 more now.
```

# 13.hMGet

**描述：**

​	返回哈希表key中，一个或多个给定域的值。

​	如果给定的域不存在于哈希表，那么返回一个nil值。

​	因为不存在的key被当作一个空哈希表来处理，所以对一个不存在的key进行HMGET操作将返回一个只带有nil值的表。
**参数：**key field [field ...]
**返回值：**一个包含多个给定域的关联值的表，表值的排列顺序和给定域参数的请求顺序一样。


```php
$redis->hSet('h', 'field1', 'value1');

$redis->hSet('h', 'field2', 'value2');

$redis->hmGet('h', array('field1', 'field2')); /* returns array('field1' => 'value1', 'field2' => 'value2') */
```

#### 示例：

```php
$redis->delete('test');
$redis->hset('test', 'key1', 'hello');//将哈希表key中的域field的值设为value。
echo $redis->hget('test', 'key1'); //结果：hello//返回哈希表key中给定域field的值。

echo "<br>";
$redis->hSetNx('test', 'key1', 'world');
//将哈希表key中的域field的值设置为value，当且仅当域field不存在。若域field已经存在，该操作无效。
echo $redis->hget('test', 'key1'); //结果：hello

$redis->delete('test');
$redis->hSetNx('test', 'key1', 'world');
echo "<br>";
echo $redis->hget('test', 'key1'); //结果：world
echo "<br>";

echo $redis->hlen('test'); //结果：1 //返回哈希表key中域的数量。
var_dump($redis->hdel('test', 'key1')); //结果：bool(true)

$redis->delete('test');
$redis->hSet('test', 'a', 'x');
$redis->hSet('test', 'b', 'y');
$redis->hSet('test', 'c', 'z');
//将哈希表 test 中的域 c 的值设为 z 。
print_r($redis->hkeys('test'));
//结果：Array ( [0] => a [1] => b [2] => c )
//返回哈希表key中的所有域。
print_r($redis->hvals('test'));
//结果：Array ( [0] => x [1] => y [2] => z )
//返回哈希表key中的所有值。
print_r($redis->hgetall('test'));
//结果：Array ( [a] => x [b] => y [c] => z )
//返回哈希表key中，所有的域和值。
var_dump($redis->hExists('test', 'a'));
//结果：bool(true)
//查看哈希表key中，给定域field是否存在。

$redis->delete('test');
echo $redis->hIncrBy('test', 'a', 3); //结果：3
echo $redis->hIncrBy('test', 'a', 1); //结果：4
//为哈希表key中的域field的值加上增量increment。
//增量也可以为负数，相当于对给定域进行减法操作。
//如果key不存在，一个新的哈希表被创建并执行HINCRBY命令。
//如果域field不存在，那么在执行命令前，域的值被初始化为0。
//对一个储存字符串值的域field执行HINCRBY命令将造成一个错误。
//本操作的值限制在64位(bit)有符号数字表示之内。

$redis->delete('test');
var_dump($redis->hmset('test', array('name' => 'tank', 'sex' => "man")));
//结果：bool(true)
//同时将多个field - value(域-值)对设置到哈希表key中。此命令会覆盖哈希表中已存在的域。
print_r($redis->hmget('test', array('name', 'sex')));
//结果：Array ( [name] => tank [sex] => man )
//返回哈希表key中，一个或多个给定域的值.如果给定的域不存在于哈希表，那么返回一个nil值。


```

