

###通道关闭原则

*不要在消费端关闭信道，不要在有多个并行的生产者时对信道执行关闭操作。*

也就是说应该只在[唯一的或者最后唯一剩下]的生产者协程中关闭信道，来通知消费者已经没有值可以继续读了。只要坚持这个原则，就可以确保向一个已经关闭的信道发送数据的情况不可能发生。

###暴力关闭信道的正确方法

如果想要在消费端关闭信道，或者在多个生产者端关闭信道，可以使用恢复机制来上个保险，避免程序因为恐慌而崩溃。

```
func SafeClose(ch chan T) (justClosed bool) {
	defer func() {
		if recover() != nil {
			justClosed = false
		}
	}()
	
	// assume ch != nil here.
	close(ch) // panic if ch is closed
	return true // <=> justClosed = true; return
}
```



使用这种方法明显违背了上面的信道关闭原则，然后性能还可以，毕竟在每个协程只会调用一次SafeClose，性能损失很小。

同样也可以在生产消息的时候使用恢复方法。

```
func SafeSend(ch chan T, value T) (closed bool) {
	defer func() {
		if recover() != nil {
			// The return result can be altered 
			// in a defer function call.
			closed = true
		}
	}()
	
	ch <- value // panic if ch is closed
	return false // <=> closed = false; return
}
```



###礼貌的关闭信道方法

还有不少人经常使用用sync.Once来关闭信道，这样可以确保只会关闭一次

```
type MyChannel struct {
	C    chan T
	once sync.Once
}

func NewMyChannel() *MyChannel {
	return &MyChannel{C: make(chan T)}
}

func (mc *MyChannel) SafeClose() {
	mc.once.Do(func() {
		close(mc.C)
	})
}
```



同样我们也可以使用sync.Mutex达到同样的目的。



```
type MyChannel struct {
	C      chan T
	closed bool
	mutex  sync.Mutex
}

func NewMyChannel() *MyChannel {
	return &MyChannel{C: make(chan T)}
}

func (mc *MyChannel) SafeClose() {
	mc.mutex.Lock()
	if !mc.closed {
		close(mc.C)
		mc.closed = true
	}
	mc.mutex.Unlock()
}

func (mc *MyChannel) IsClosed() bool {
	mc.mutex.Lock()
	defer mc.mutex.Unlock()
	return mc.closed
}
```



要知道golang的设计者不提供SafeClose或者SafeSend方法是有原因的，他们本来就不推荐在消费端或者在并发的多个生产端关闭信道，比如关闭只读信道在语法上就彻底被禁止使用了。

###优雅的关闭信道的方法

上文的SafeSend方法一个很大的劣势在于它不能用在选择块的情况下，语句中。而另一个很重要的劣势在于像我这样对代码有洁癖的人来说，使用恐慌/恢复和同步/互斥来搞定不是那么的优雅。下面我们引入在不同的场景下可以使用的纯粹的优雅的解决方法。

*多个消费者，单个生产者。*这种情况最简单，直接让生产者关闭通道好了。

```
package main

import (
	"time"
	"math/rand"
	"sync"
	"log"
)

func main() {
	rand.Seed(time.Now().UnixNano())
	log.SetFlags(0)
	
	// ...
	const MaxRandomNumber = 100000
	const NumReceivers = 100
	
	wgReceivers := sync.WaitGroup{}
	wgReceivers.Add(NumReceivers)
	
	// ...
	dataCh := make(chan int, 100)
	
	// the sender
	go func() {
		for {
			if value := rand.Intn(MaxRandomNumber); value == 0 {
				// The only sender can close the channel safely.
				close(dataCh)
				return
			} else {			
				dataCh <- value
			}
		}
	}()
	
	// receivers
	for i := 0; i < NumReceivers; i++ {
		go func() {
			defer wgReceivers.Done()
			
			// Receive values until dataCh is closed and
			// the value buffer queue of dataCh is empty.
			for value := range dataCh {
				log.Println(value)
			}
		}()
	}
	
	wgReceivers.Wait()
}
```

*多个生产者，单个消费者。*这种情况要比上面的复杂一点。我们不能在消费端关闭信道，因为这违背了通道关闭原则。但是我们可以让消费端关闭一个附加的信号来通知发送端停止生产数据。



```
package main

import (
	"time"
	"math/rand"
	"sync"
	"log"
)

func main() {
	rand.Seed(time.Now().UnixNano())
	log.SetFlags(0)
	
	// ...
	const MaxRandomNumber = 100000
	const NumSenders = 1000
	
	wgReceivers := sync.WaitGroup{}
	wgReceivers.Add(1)
	
	// ...
	dataCh := make(chan int, 100)
	stopCh := make(chan struct{})
	// stopCh is an additional signal channel.
	// Its sender is the receiver of channel dataCh.
	// Its reveivers are the senders of channel dataCh.
	
	// senders
	for i := 0; i < NumSenders; i++ {
		go func() {
			for {
				// The first select here is to try to exit the goroutine
				// as early as possible. In fact, it is not essential
				// for this example, so it can be omitted.
				select {
				case <- stopCh:
					return
				default:
				}
				
				// Even if stopCh is closed, the first branch in the
				// second select may be still not selected for some
				// loops if the send to dataCh is also unblocked.
				// But this is acceptable, so the first select
				// can be omitted.
				select {
				case <- stopCh:
					return
				case dataCh <- rand.Intn(MaxRandomNumber):
				}
			}
		}()
	}
	
	// the receiver
	go func() {
		defer wgReceivers.Done()
		
		for value := range dataCh {
			if value == MaxRandomNumber-1 {
				// The receiver of the dataCh channel is
				// also the sender of the stopCh cahnnel.
				// It is safe to close the stop channel here.
				close(stopCh)
				return
			}
			
			log.Println(value)
		}
	}()
	
	// ...
	wgReceivers.Wait()
}
```



就上面这个例子，生产者同时也是退出信号信道的接受者，退出信号信道仍然是由它的生产端关闭的，所以这仍然没有违背通道关闭原则。值得注意的是，这个例子中生产端和接受端都没有关闭消息数据的信道，信道在没有任何的goroutine引用的时候会自行关闭，而不需要显示进行关闭。

####*多个生产者，多个消费者*

这是最复杂的一种情况，我们既不能让接受端也不能让发送端关闭信道。我们甚至都不能让接受者关闭一个退出信号来通知生产者停止生产。因为我们不能违反信道关闭原则。但是我们可以引入一个额外的协调者来关闭附加的退出信号通道。

```
package main

import (
	"time"
	"math/rand"
	"sync"
	"log"
	"strconv"
)

func main() {
	rand.Seed(time.Now().UnixNano())
	log.SetFlags(0)
	
	// ...
	const MaxRandomNumber = 100000
	const NumReceivers = 10
	const NumSenders = 1000
	
	wgReceivers := sync.WaitGroup{}
	wgReceivers.Add(NumReceivers)
	
	// ...
	dataCh := make(chan int, 100)
	stopCh := make(chan struct{})
		// stopCh is an additional signal channel.
		// Its sender is the moderator goroutine shown below.
		// Its reveivers are all senders and receivers of dataCh.
	toStop := make(chan string, 1)
		// The channel toStop is used to notify the moderator
		// to close the additional signal channel (stopCh).
		// Its senders are any senders and receivers of dataCh.
		// Its reveiver is the moderator goroutine shown below.
	
	var stoppedBy string
	
	// moderator
	go func() {
		stoppedBy = <- toStop
		close(stopCh)
	}()
	
	// senders
	for i := 0; i < NumSenders; i++ {
		go func(id string) {
			for {
				value := rand.Intn(MaxRandomNumber)
				if value == 0 {
					// Here, a trick is used to notify the moderator
					// to close the additional signal channel.
					select {
					case toStop <- "sender#" + id:
					default:
					}
					return
				}
				
				// The first select here is to try to exit the goroutine
				// as early as possible. This select blocks with one
				// receive operation case and one default branches will
				// be optimized as a try-receive operation by the
				// official Go compiler.
				select {
				case <- stopCh:
					return
				default:
				}
				
				// Even if stopCh is closed, the first branch in the
				// second select may be still not selected for some
				// loops (and for ever in theory) if the send to
				// dataCh is also unblocked.
				// This is why the first select block is needed.
				select {
				case <- stopCh:
					return
				case dataCh <- value:
				}
			}
		}(strconv.Itoa(i))
	}
	
	// receivers
	for i := 0; i < NumReceivers; i++ {
		go func(id string) {
			defer wgReceivers.Done()
			
			for {
				// Same as the sender goroutine, the first select here
				// is to try to exit the goroutine as early as possible.
				select {
				case <- stopCh:
					return
				default:
				}
				
				// Even if stopCh is closed, the first branch in the
				// second select may be still not selected for some
				// loops (and for ever in theory) if the receive from
				// dataCh is also unblocked.
				// This is why the first select block is needed.
				select {
				case <- stopCh:
					return
				case value := <-dataCh:
					if value == MaxRandomNumber-1 {
						// The same trick is used to notify
						// the moderator to close the
						// additional signal channel.
						select {
						case toStop <- "receiver#" + id:
						default:
						}
						return
					}
					
					log.Println(value)
				}
			}
		}(strconv.Itoa(i))
	}
	
	// ...
	wgReceivers.Wait()
	log.Println("stopped by", stoppedBy)
}
```
以上三种场景不能涵盖全部，但是它们是最常见最通用的三种场景，基本上所有的场景都可以划分为以上三类。

###结论
没有任何场景值得你去打破通道关闭原则，如果你遇到这样的一种特殊场景，还是建议你好好思考一下自己设计，是不是该重构一下了。

