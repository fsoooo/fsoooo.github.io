

### MULTI 、EXEC 、DISCARD 和WATCH 是 Redis 事务的基础

**1.MULTI**  命令用于开启一个事务，它总是返回 OK 。
MULTI 执行之后，客户端可以继续向服务器发送任意多条命令，这些命令不会立即被执行，而是被放到一个队列中

**2.EXEC** 命令被调用时，所有队列中的命令才会被执行。

```shell
redis 192.168.1.53:6379> multi
OK
redis 192.168.1.53:6379> incr foo
QUEUED
redis 192.168.1.53:6379> set t1 1
QUEUED
redis 192.168.1.53:6379> exec
1) (integer) 2
2) OK
```

```java
Jedis jedis = new Jedis("192.168.1.53", 6379);
Transaction tx = jedis.multi();
tx.incr( "foo");
tx.set( "t1", "2");
List<Object> result = tx.exec();

if (result == null || result.isEmpty()) {
     System. err.println( "Transaction error...");
     return ;
}

for (Object rt : result) {
     System. out.println(rt.toString());
}
```

使用事务时可能会遇上以下两种错误：

1.事务在执行EXEC 之前，入队的命令可能会出错。比如说，命令可能会产生语法错误（参数数量错误，参数名错误，等等），或者其他更严重的错误，比如内存不足

（如果服务器使用 maxmemory 设置了最大内存限制的话）。

2.命令可能在EXEC 调用之后失败。举个例子，事务中的命令可能处理了错误类型的键，比如将列表命令用在了字符串键上面，诸如此类。

### 第一种错误的情况:

**服务器端:**
在 Redis 2.6.5 以前，Redis 只执行事务中那些入队成功的命令，而忽略那些入队失败的命令

不过，从 Redis 2.6.5 开始，服务器会对命令入队失败的情况进行记录，并在客户端调用EXEC 命令时，拒绝执行并自动放弃这个事务。

```shell
redis 192.168.1.53:6379> multi
OK
redis 192.168.1.53:6379> incr foo
QUEUED
redis 192.168.1.53:6379> set ff 11 22
(error) ERR wrong number of arguments for 'set' command
redis 192.168.1.53:6379> exec
1) (integer) 4
```

因为我的版本是:2.6.4,所以Redis 只执行事务中那些入队成功的命令，而忽略那些入队失败的命令

**客户端(jredis):**

客户端以前的做法是检查命令入队所得的返回值：如果命令入队时返回 QUEUED ，那么入队成功；否则，就是入队失败。如果有命令在入队时失败，

那么大部分客户端都会停止并取消这个事务。

第二种错误的情况:

至于那些在EXEC 命令执行之后所产生的错误，并没有对它们进行特别处理：即使事务中有某个/某些命令在执行时产生了错误，事务中的其他命令仍然会继续执行。

```shell
redis 192.168.1.53:6379> multi
OK
redis 192.168.1.53:6379> set a 11
QUEUED
redis 192.168.1.53:6379> lpop a
QUEUED
redis 192.168.1.53:6379> exec
1) OK
2) (error) ERR Operation against a key holding the wrong kind of value
```

```java
Jedis jedis = new Jedis("192.168.1.53", 6379);
Transaction tx = jedis.multi();
tx.set( "t1", "2");
tx.lpop( "t1");
List<Object> result = tx.exec();

if (result == null || result.isEmpty()) {
    System. err.println( "Transaction error...");
    return ;
}

for (Object rt : result) {
    System. out.println(rt.toString());
}
```

**Redis 在事务失败时不进行回滚，而是继续执行余下的命令**

这种做法可能会让你觉得有点奇怪，以下是这种做法的优点:
1.Redis 命令只会因为错误的语法而失败（并且这些问题不能在入队时发现），或是命令用在了错误类型的键上面：这也就是说，从实用性的角度来说，

失败的命令是由编程错误造成的，而这些错误应该在开发的过程中被发现，而不应该出现在生产环境中。
2.因为不需要对回滚进行支持，所以 Redis 的内部可以保持简单且快速。

鉴于没有任何机制能避免程序员自己造成的错误，并且这类错误通常不会在生产环境中出现，所以 Redis 选择了更简单、更快速的无回滚方式来处理事务。

**3.DISCARD**  命令时，事务会被放弃，事务队列会被清空，并且客户端会从事务状态中退出

```shell
redis 192.168.1.53:6379> set foo 1
OK
redis 192.168.1.53:6379> multi
OK
redis 192.168.1.53:6379> incr foo
QUEUED
redis 192.168.1.53:6379> discard
OK
redis 192.168.1.53:6379> get foo
"1"
```

**4.WATCH**  命令可以为 Redis 事务提供 check-and-set （CAS）行为
被WATCH 的键会被监视，并会发觉这些键是否被改动过了。如果有至少一个被监视的键在EXEC 执行之前被修改了，那么整个事务都会被取消

第一条命令

```shell
redis 192.168.1.53:6379> watch foo
OK
redis 192.168.1.53:6379> set foo 5
OK
redis 192.168.1.53:6379> multi
OK
redis 192.168.1.53:6379> set foo 9
QUEUED
```

暂停（执行完第二条命令才执行下面的）

```shell
redis 192.168.1.53:6379> exec
(nil)
redis 192.168.1.53:6379> get foo
"8"
```

第二条命令

```shell
redis 192.168.1.53:6379> set foo 8
OK
```



```java
Jedis jedis = new Jedis("192.168.1.53", 6379);
jedis.watch( "foo");
Transaction tx = jedis.multi();
tx.incr( "foo");

List<Object> result = tx.exec();          //运行时在这边打断点，然后通过命令行改变foo的值
if (result == null || result.isEmpty()) {
    System. err.println( "Transaction error...");
     return;
}
for (Object rt : result) {
     System. out.println(rt.toString());
}
```

如果在WATCH 执行之后，EXEC 执行之前，有其他客户端修改了 mykey 的值，那么当前客户端的事务就会失败。程序需要做的，就是不断重试这个操作，直到没有发生碰撞为止。
这种形式的锁被称作乐观锁，它是一种非常强大的锁机制。并且因为大多数情况下，不同的客户端会访问不同的键，碰撞的情况一般都很少，所以通常并不需要进行重试。
