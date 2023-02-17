不同的并行协程之间交流的方式有两种，一种是通过共享变量，另一种是通过队列。Go 语言鼓励使用队列的形式来交流，它单独为协程之间的队列数据交流定制了特殊的语法 —— 通道。

通道是协程的输入和输出。作为协程的输出，通道是一个容器，它可以容纳数据。作为协程的输入，通道是一个生产者，它可以向协程提供数据。通道作为容器是有限定大小的，满了就写不进去，空了就读不出来。通道还有它自己的类型，它可以限定进入通道的数据的类型。

![](https://upload-images.jianshu.io/upload_images/6943526-ac7fc4651f830044?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240 "图片")



## 创建通道

创建通道只有一种语法，那就是 make 全局函数，提供第一个类型参数限定通道可以容纳的数据类型，再提供第二个整数参数作为通道的容器大小。大小参数是可选的，如果不填，那这个通道的容量为零，叫着「非缓冲型通道」，非缓冲型通道必须确保有协程正在尝试读取当前通道，否则写操作就会阻塞直到有其它协程来从通道中读东西。非缓冲型通道总是处于既满又空的状态。与之对应的有限定大小的通道就是缓冲型通道。在 Go 语言里不存在无界通道，每个通道都是有限定最大容量的。

```
// 缓冲型通道，里面只能放整数
var bufferedChannel = make(chan int, 1024)
// 非缓冲型通道
var unbufferedChannel = make(chan int)
```

## 读写通道

Go 语言为通道的读写设计了特殊的箭头语法糖 <-，让我们使用通道时非常方便。把箭头写在通道变量的右边就是写通道，把箭头写在通道的左边就是读通道。一次只能读写一个元素。

```
package main

import "fmt"

func main() {
    var ch chan int = make(chan int, 4)
    for i:=0; i<cap(ch); i++ {
        ch <- i   // 写通道
    }
    for len(ch) > 0 {
        var value int = <- ch  // 读通道
        fmt.Println(value)
    }
}
```

通道作为容器，它可以像切片一样，使用 cap() 和 len() 全局函数获得通道的容量和当前内部的元素个数。通道一般作为不同的协程交流的媒介，在同一个协程里它也是可以使用的。

## 读写阻塞

通道满了，写操作就会阻塞，协程就会进入休眠，直到有其它协程读通道挪出了空间，协程才会被唤醒。如果有多个协程的写操作都阻塞了，一个读操作只会唤醒一个协程。

通道空了，读操作就会阻塞，协程也会进入睡眠，直到有其它协程写通道装进了数据才会被唤醒。如果有多个协程的读操作阻塞了，一个写操作也只会唤醒一个协程。

```
package main

import "fmt"
import "time"
import "math/rand"

func send(ch chan int) {
    for {
        var value = rand.Intn(100)
        ch <- value
        fmt.Printf("send %d\n", value)
    }
}

func recv(ch chan int) {
    for {
        value := <- ch
        fmt.Printf("recv %d\n", value)
        time.Sleep(time.Second)
    }
}

func main() {
    var ch = make(chan int, 1)
    // 子协程循环读
    go recv(ch)
    // 主协程循环写
    send(ch)
}

--------
send 81
send 87
recv 81
recv 87
send 47
recv 47
send 59
```

## 关闭通道

Go 语言的通道有点像文件，不但支持读写操作， 还支持关闭。读取一个已经关闭的通道会立即返回通道类型的「零值」，而写一个已经关闭的通道会抛异常。如果通道里的元素是整型的，读操作是不能通过返回值来确定通道是否关闭的。

```
package main

import "fmt"

func main() {
    var ch = make(chan int, 4)
    ch <- 1
    ch <- 2
    close(ch)

    value := <- ch
    fmt.Println(value)
    value = <- ch
    fmt.Println(value)
    value = <- ch
    fmt.Println(value)
}

-------
1
2
0
```

这时候就需要引入一个新的知识点 —— 使用 for range 语法糖来遍历通道

for range 语法我们已经见了很多次了，它是多功能的，除了可以遍历数组、切片、字典，还可以遍历通道，取代箭头操作符。当通道空了，循环会暂停阻塞，当通道关闭时，阻塞停止，循环也跟着结束了。当循环结束时，我们就知道通道已经关闭了。

```
package main

import "fmt"

func main() {
    var ch = make(chan int, 4)
    ch <- 1
    ch <- 2
    close(ch)

 // for range 遍历通道
    for value := range ch {
        fmt.Println(value)
    }
}

------
1
2
```

通道如果没有显式关闭，当它不再被程序使用的时候，会自动关闭被垃圾回收掉。不过优雅的程序应该将通道看成资源，显式关闭每个不再使用的资源是一种良好的习惯。

## 通道写安全

上面提到向一个已经关闭的通道执行写操作会抛出异常，这意味着我们在写通道时一定要确保通道没有被关闭。

```
package main

import "fmt"

func send(ch chan int) {
    i := 0
    for {
        i++
        ch <- i
    }
}

func recv(ch chan int) {
    value := <- ch
    fmt.Println(value)
    value = <- ch
    fmt.Println(value)
    close(ch)
}

func main() {
    var ch = make(chan int, 4)
    go recv(ch)
    send(ch)
}

---------
1
2
panic: send on closed channel

goroutine 1 [running]:
main.send(0xc42008a000)
    /Users/qianwp/go/src/github.com/pyloque/practice/main.go:9 +0x44
main.main()
    /Users/qianwp/go/src/github.com/pyloque/practice/main.go:24 +0x66
exit status 2
```

那如何确保呢？Go 语言并不存在一个内置函数可以判断出通道是否已经被关闭。即使存在这样一个函数，当你判断时通道没有关闭，并不意味着当你往通道里写数据时它就一定没有被关闭，并发环境下，它是可能被其它协程随时关闭的。

确保通道写安全的最好方式是由负责写通道的协程自己来关闭通道，读通道的协程不要去关闭通道。

```
package main

import "fmt"

func send(ch chan int) {
 ch <- 1
 ch <- 2
 ch <- 3
 ch <- 4
 close(ch)
}

func recv(ch chan int) {
 for v := range ch {
  fmt.Println(v)
 }
}

func main() {
 var ch = make(chan int, 1)
 go send(ch)
 recv(ch)
}

-----------
1
2
3
4
```

这个方法确实可以解决单写多读的场景，可要是遇上了多写单读的场合该怎么办呢？任意一个读写通道的协程都不可以随意关闭通道，否则会导致其它写通道协程抛出异常。这时候就必须让其它不相干的协程来干这件事，这个协程需要等待所有的写通道协程都结束运行后才能关闭通道。那其它协程要如何才能知道所有的写通道已经结束运行了呢？这个就需要使用到内置 sync 包提供的 WaitGroup 对象，它使用计数来等待指定事件完成。

```
package main

import "fmt"
import "time"
import "sync"

func send(ch chan int, wg *sync.WaitGroup) {
    defer wg.Done() // 计数值减一
    i := 0
    for i < 4 {
        i++
        ch <- i
    }
}

func recv(ch chan int) {
    for v := range ch {
        fmt.Println(v)
    }
}

func main() {
    var ch = make(chan int, 4)
    var wg = new(sync.WaitGroup)
    wg.Add(2) // 增加计数值
    go send(ch, wg)  // 写
    go send(ch, wg)  // 写
    go recv(ch)
    // Wait() 阻塞等待所有的写通道协程结束
 // 待计数值变成零，Wait() 才会返回
 wg.Wait()
    // 关闭通道
 close(ch)
 time.Sleep(time.Second)
}

---------
1
2
3
4
1
2
3
4
```

## 多路通道

在真实的世界中，还有一种消息传递场景，那就是消费者有多个消费来源，只要有一个来源生产了数据，消费者就可以读这个数据进行消费。这时候可以将多个来源通道的数据汇聚到目标通道，然后统一在目标通道进行消费。

```
package main

import "fmt"
import "time"

// 每隔一会生产一个数
func send(ch chan int, gap time.Duration) {
    i := 0
    for {
        i++
        ch <- i
        time.Sleep(gap)
    }
}

// 将多个原通道内容拷贝到单一的目标通道
func collect(source chan int, target chan int) {
    for v := range source {
        target <- v
    }
}

// 从目标通道消费数据
func recv(ch chan int) {
    for v := range ch {
        fmt.Printf("receive %d\n", v)
    }
}


func main() {
    var ch1 = make(chan int)
    var ch2 = make(chan int)
    var ch3 = make(chan int)
    go send(ch1, time.Second)
    go send(ch2, 2 * time.Second)
    go collect(ch1, ch3)
    go collect(ch2, ch3)
    recv(ch3)
}

---------
receive 1
receive 1
receive 2
receive 2
receive 3
receive 4
receive 3
receive 5
receive 6
receive 4
receive 7
receive 8
receive 5
receive 9
....
```

但是上面这种形式比较繁琐，需要为每一种消费来源都单独启动一个汇聚协程。Go 语言为这种使用场景带来了「多路复用」语法糖，也就是下面要讲的 select 语句，它可以同时管理多个通道读写，如果所有通道都不能读写，它就整体阻塞，只要有一个通道可以读写，它就会继续。下面我们使用 select 语句来简化上面的逻辑

```
package main

import "fmt"
import "time"

func send(ch chan int, gap time.Duration) {
    i := 0
    for {
        i++
        ch <- i
        time.Sleep(gap)
    }
}

func recv(ch1 chan int, ch2 chan int) {
    for {
        select {
            case v := <- ch1:
                fmt.Printf("recv %d from ch1\n", v)
            case v := <- ch2:
                fmt.Printf("recv %d from ch2\n", v)
        }
    }
}

func main() {
    var ch1 = make(chan int)
    var ch2 = make(chan int)
    go send(ch1, time.Second)
    go send(ch2, 2 * time.Second)
    recv(ch1, ch2)
}

------------
recv 1 from ch2
recv 1 from ch1
recv 2 from ch1
recv 3 from ch1
recv 2 from ch2
recv 4 from ch1
recv 3 from ch2
recv 5 from ch1
```

上面是多路复用 select 语句的读通道形式，下面是它的写通道形式，只要有一个通道能写进去，它就会打破阻塞。

```
select {
  case ch1 <- v:
      fmt.Println("send to ch1")
  case ch2 <- v:
      fmt.Println("send to ch2")
}
```

## 非阻塞读写

前面我们讲的读写都是阻塞读写，Go 语言还提供了通道的非阻塞读写。当通道空时，读操作不会阻塞，当通道满时，写操作也不会阻塞。非阻塞读写需要依靠 select 语句的 default 分支。当 select 语句所有通道都不可读写时，如果定义了 default 分支，那就会执行 default 分支逻辑，这样就起到了不阻塞的效果。下面我们演示一个单生产者多消费者的场景。生产者同时向两个通道写数据，写不进去就丢弃。

```
package main

import "fmt"
import "time"

func send(ch1 chan int, ch2 chan int) {
    i := 0
    for {
        i++
        select {
            case ch1 <- i:
                fmt.Printf("send ch1 %d\n", i)
            case ch2 <- i:
                fmt.Printf("send ch2 %d\n", i)
            default:
        }
    }
}

func recv(ch chan int, gap time.Duration, name string) {
    for v := range ch {
        fmt.Printf("receive %s %d\n", name, v)
        time.Sleep(gap)
    }
}

func main() {
 // 无缓冲通道
    var ch1 = make(chan int)
    var ch2 = make(chan int)
    // 两个消费者的休眠时间不一样，名称不一样
 go recv(ch1, time.Second, "ch1")
    go recv(ch2, 2 * time.Second, "ch2")
    send(ch1, ch2)
}

------------
send ch1 27
send ch2 28
receive ch1 27
receive ch2 28
send ch1 6708984
receive ch1 6708984
send ch2 13347544
send ch1 13347775
receive ch2 13347544
receive ch1 13347775
send ch1 20101642
receive ch1 20101642
send ch2 26775795
receive ch2 26775795
...
```

从输出中可以明显看出有很多的数据都丢弃了，消费者读到的数据是不连续的。如果将 select 语句里面的 default 分支干掉，再运行一次，结果如下

```
send ch2 1
send ch1 2
receive ch1 2
receive ch2 1
receive ch1 3
send ch1 3
receive ch2 4
send ch2 4
send ch1 5
receive ch1 5
receive ch1 6
send ch1 6
receive ch1 7
```

可以看到消费者读到的数据都连续了，但是每个数据只给了一个消费者。select 语句的 default 分支非常关键，它是决定通道读写操作阻塞与否的关键。

## Java 也有通道

通道在其它语言里面的表现形式是队列，在 Java 语言里，带缓冲通道就是并发包内置的 java.util.concurrent.ArrayBlockingQueue，无缓冲通道也是并发包内置的 java.util.concurrent.SynchronousQueue。ArrayBlockingQueue 的内部实现形式是一个数组，多线程读写时需要使用锁来控制并发访问。不过像 Go 语言提供的多路复用效果，Java 语言就没有内置的实现了。

## 通道内部结构

Go 语言的通道内部结构是一个循环数组，通过读写偏移量来控制元素发送和接受。它为了保证线程安全，内部会有一个全局锁来控制并发。对于发送和接受操作都会有一个队列来容纳处于阻塞状态的协程。

![](https://upload-images.jianshu.io/upload_images/6943526-90cd50a4fa7cb52b?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240 "图片")


```
type hchan struct {
  qcount uint  // 通道有效元素个数
  dataqsize uint   // 通道容量，循环数组总长度
  buf unsafe.Pointer // 数组地址
  elemsize uint16 // 内部元素的大小
  closed uint32 // 是否已关闭 0或者1
  elemtype *_type // 内部元素类型信息
  sendx uint // 循环数组的写偏移量
  recvx uint // 循环数组的读偏移量
  recvq waitq // 阻塞在读操作上的协程队列
  sendq waitq // 阻塞在写操作上的协程队列

  lock mutex // 全局锁
}
```

这个循环队列和 Java 语言内置的 ArrayBlockingQueue 结构如出一辙。从这个数据结构中我们也可以得出结论：队列在本质上是使用共享变量加锁的方式来实现的，共享变量才是并行交流的本质。

```
class ArrayBlockingQueue extends AbstractQueue {
  Object[] items;
  int takeIndex;
  int putIndex;
  int count;
  ReentrantLock lock;
  ...
}
```

所以读者请不要认为 Go 语言的通道很神奇，Go 语言只是对通道设计了一套便于使用的语法糖，让这套数据结构显的平易近人。它在内部实现上和其它语言的并发队列大同小异。
