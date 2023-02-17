channel[通道]是golang的一种重要特性，正是因为channel的存在才使得golang不同于其它语言。channel使得并发编程变得简单容易有趣。

###channel的概念和语法

一个channel可以理解为一个先进先出的消息队列。channel用来在协程[goroutine]之间传递数据，准确的说，是用来传递数据的所有权。一个设计良好的程序应该确保同一时刻channel里面的数据只会被同一个协程拥有，这样就可以避免并发带来的数据不安全问题[data races]。

###channel的类型

像数组、切片和字典一样，channel类型是一种组合类型，每一种channel类型都对应着一种简单的数据类型。比如元素的类型是string，那么对应的channel类型就是chan string，进入channel的数据也就必须是string类型的值。

*官方的go编译器限制channel里的单个元素最多65535个字节，也就是说如果channel缓冲数组里面容纳的是struct，那这个struct的size不能大过65535。*尽管如此，我们也不应该传递体积过大的元素值，因为channel的数据从进入到流出会涉及到数据拷贝操作。如果元素体积过大，最好的方法还是使用传递指针来取代传递值。

channel类型是可以带有方向的，假设T是一种类型

1. chan T是双向channel类型，编译器允许对双向channel同时进行发送和接收。
2. chan<- T是只写channel类型，编译器只允许往channel里面发送数据。
3. <-chan T是只读channel类型，编辑器只允许从channel里面接收数据。

双向类型的channel，可以被强制转换成只读channel或者是只写channel，但是反过来却不行，只读和只写channel是不可以转换成双向channel的。

channel类型的零值形式称为空channel。一个非空channel类型必须通过make关键字进行创建。例如make(chan int, 10)将会创建出一个可以容纳10个int值的channel。第二个整形的参数值代表的就是channel可以容纳数据的大小，如果不提供这个参数值，那默认值就是零。

```
var ch chan string; // nil channel
ch := make(chan string); // zero channel
ch := make(chan string, 10); // buffered channel
```

channel里面的value buffer的容量也就是channel的容量。channel的容量为零表示这是一个阻塞型通道，非零表示缓冲型通道[非阻塞型通道]。

###channel内部结构

每个channel内部实现都有三个队列

1. 接收消息的协程队列。这个队列的结构是一个限定最大长度的链表，所有阻塞在channel的接收操作的协程都会被放在这个队列里。
2. 发送消息的协程队列。这个队列的结构也是一个限定最大长度的链表。所有阻塞在channel的发送操作的协程也都会被放在这个队列里。
3. 环形数据缓冲队列。这个环形数组的大小就是channel的容量。如果数组装满了，就表示channel满了，如果数组里一个值也没有，就表示channel是空的。对于一个阻塞型channel来说，它总是同时处于即满又空的状态。

一个channel被所有使用它的协程所引用，也就是说，只要这两个装了协程的队列长度大于零，那么这个channel就永远不会被垃圾回收。另外，协程本身如果阻塞在channel的读写操作上，这个协程也永远不会被垃圾回收，即使这个channel只会被这一个协程所引用。

###**channel的使用**

channel支持以下操作

1. 使用cap(ch)函数查询channel的容量，cap是golang的内置函数
2. 使用len(ch)函数查询channel内部的数据长度，len函数也是内置的，表面上这个函数很有意义，但实际上它很少用。
3. 使用close(ch)关闭channel，close也是内置函数。一个非空channel只能够被关闭一次，如果关闭一个已经被关闭的或者是关闭一个空channel将会引发panic。另外关闭一个只读channel是非法的，编译器直接报错。
4. 使用ch <- v发送一个值v到channel。发送值到channel可能会有多种结果，即可能成功，也可能阻塞，甚至还会引发panic，取决于当前channel在什么状态。
5. 使用 v, ok <- ch 接收一个值。第二个遍历ok是可选的，它表示channel是否已关闭。接收值只会又两种结果，要么成功要么阻塞，而永远也不会引发panic。

所有的这些操作都是同步的协程安全的，不需要加任何其它同步控制。

#####For-Range

for-range语法可以用到通道上。循环会一直接收channel里面的数据，直到channel关闭。不同于array/slice/map上的for-range，channel的for-range只允许有一个变量。

```
for v = range aChannel {
	// use v
}
```

等价于

```
for {
	v, ok = <-aChannel
	if !ok {
		break
	}
	// use v
}
```

注意，for-range对应的channel不能是只写channel。

#####Select-Cases

select块是为channel特殊设计的语法，它和switch语法非常相近。分支上它们都可以有多个case块和做多一个default块，但是也有很多不同

1. select 到 括号{之间不得有任何表达式

2. fallthrough关键字不能用在select里面

3. 所有的case语句要么是channel的发送操作，要么就是channel的接收操作

4. select里面的case语句是随机执行的，而不能是顺序执行的。设想如果第一个case语句对应的channel是非阻塞的话，case语句的顺序执行会导致后续的case语句一直得不到执行除非第一个case语句对应的channel里面的值都耗尽了。

5. 如果所有case语句关联的操作都是阻塞的，default分支就会被执行。如果没有default分支，当前goroutine就会阻塞，当前的goroutine会挂接到所有关联的channel内部的协程队列上。 所以说单个goroutine是可以同时挂接到多个channel上的，甚至可以同时挂接到同一个channel的发送协程队列和接收协程队列上。当一个阻塞的goroutine拿到了数据接触阻塞的时候，它会从所有相关的channel队列中移除掉。

   

#####channel简单规则表,下标的活跃Channel表示即非空又非关闭的Channel
![image](http://upload-images.jianshu.io/upload_images/6943526-bc3a4bf1ae58a8f0?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



###channel规则详细解释

####空channel

1. 关闭一个空channel会导致当前goroutine引发panic
2. 向一个空channel发送值会导致当前的goroutine阻塞
3. 从一个空channel接收值也会导致当前的goroutine阻塞

在空channel上的调用len和cap函数都统一返回零。

####已关闭的Channel

1. 关闭一个已关闭的channel会引发panic

2. 向一个已关闭的channel发送值会引发panic。当这种send操作处于select块里面的case语句上时，它会随时导致select语句引发panic。

3. 从一个已关闭的channel上接收值既不会阻塞也不能panic，它一直能成功返回。只是返回的第二个值ok永远是false，表示接收到的v是在channel关闭之后拿到的，对应得值也是相应元素类型的零值。可以无限循环从已关闭的channel上接收值。

   

####活跃的Channel

1. 关闭操作

2. 1. 从channel的接收协程队列中移除所有的goroutine，并唤醒它们。
   2. 从channel的接收协程队列中移除所有的goroutine，并唤醒它们。
   3. 一个已关闭的channel内部的缓冲数组可能不是空的，没有接收的这些值会导致channel对象永远不会被垃圾回收。

3. 发送操作

4. 1. 如果是阻塞型channel，那就从channel的接收协程队列中移出第一个协程，然后把发送的值直接递给这个协程。
   2. 如果是阻塞型channel，并且channel的接收协程队列是空的，那么当前的协程将会阻塞，并进入到channel的发送协程队列里。
   3. 如果是缓冲型channel，并且缓冲数组里还有空间，那么将发送的值添加到数组最后，当前协程不阻塞。
   4. 如果是缓冲型channel，并且缓冲数组已经满了，那么当前的协程将会阻塞，并进入到channel的发送协程队列中。

5. 接收操作

6. 1. 如果是缓冲型channel，并且缓冲数组有值，那么当前的协程不会阻塞，直接从数组中拿出第一个值。如果发送队列非空，还需要将队列中的第一个goroutine唤醒。
   2. 如果是阻塞型channel，并且发送队列非空的话，那么唤醒发送队列第一个协程，该协程会将发送的值直接递给接收的协程。
   3. 如果是缓冲型channel，并且缓冲数组为空，或者是阻塞型channel，并且发送协程队列为空，那么当前协程将会阻塞，并加入到channel的接收协程队列中。

###总结
根据以上规则，我们可以得出以下结论:
- 如果channel关闭了，那么它的接收和发送协程队列必然空了，但是它的缓冲数组可能还没有空。
-  channel的接收协程队列和缓冲数组，同一个时间必然有一个是空的
-  channel的缓冲数组如果未满，那么它的发送协程队列必然是空的
-  对于缓冲型channel，同一时间它的接收和发送协程队列，必然有一个是空的
-  对于非缓冲型channel，一般来说同一时间它的接收和发送协程队列，也必然有一个是空的，但是有一个例外，那就是当它的发送操作和接收操作在同一个select块里出现的时候，两个队列都不是空的。

