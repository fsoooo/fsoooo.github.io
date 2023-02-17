## Go 语言的 Logo

最初 Go 语言的 Logo 是一只可爱的土拨鼠，土拨鼠昼伏夜出的习性让它显得很有 Geek 范。土拨鼠的行动其实并不敏捷，不过它繁殖能力很强，生长发育的很快。

![](http://upload-images.jianshu.io/upload_images/6943526-2047e08e7b63860a?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240 "图片")


到了 2018年，Go 语言重新制定了 Logo，消灭了土拨鼠，取而代之的是纯文字。这好像是在告诉用户 Go 语言不再是一个玩具语言，而是一个严肃的高效的正式语言。

![](http://upload-images.jianshu.io/upload_images/6943526-3ec7ad9f5391ba99?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240 "图片")

不过这个新 Logo 不是很受欢迎，它虽然给人一种快速的感觉，但是也显得很极为古板。到目前为止，你在 Google 图片里搜索 Golang Logo，铺天盖地的还是土拨鼠的形象。

## Go 语言的「元团队」

很多著名的计算机语言都是那么一两个人业余时间捣鼓出来的，但是 Go 语言是 Google 养着一帮团队打造出来的。这个团队非常豪华，它被称之为 Go Team，成员之一就有大名鼎鼎的 Unix 操作系统的创造者 Ken Thompson，C 语言就是他和已经过世的李奇一起发明的。

![](http://upload-images.jianshu.io/upload_images/6943526-8eae644d63fbe68b?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240 "图片")

图中翘着二郎腿的谢顶老头就是 **Ken Thompson**，它参与 Go 项目时个人已经处于半退休状态 —— 年纪大了。有条件的读者可以看看 Youtube 上 Go Team 的访谈视频一睹大师们的风采【[点击查看](https://www.youtube.com/watch?v=sln-gJaURzk)】。

## Hello World

学习任何一门语言的第一步是看它的 Hello World 程序怎么写。
下面是 Go 语言的 Hello World：

```
package main

import "fmt"

func main() {  
  fmt.Println("hello world!")
}
```

这个文件的名字是 main.go，使用下面的命令运行这个文件

```
$ go run main.go
```

输出

```
hello world!
```

是不是有一种操纵脚本的感觉，写完代码直接运行，中间的编译链接过程似乎都省去了。不过 go run 指令只是用来开发调试用的，在生产环境中程序可不是这样跑的。在开发完成后，需要将程序编译成没有任何依赖的二进制可执行文件，扔到服务器上运行起来。这个编译成二进制文件的指令就是

```
$ go build main.go
```

执行完毕后可以看到目录下多了一个 main 的可执行文件**（main.exe）**。运行它可以直接看到输出结果

```
$ ./mainhello world!
```

**PS:再强调一遍，这个二进制可执行文件是没有任何依赖的，即使服务器上没有 go 环境，它也是可以直接运行的。因为编译器已经将运行时依赖项都融进了这单一的可执行文件。这也是 go 语言的特色之处，让用户编写的程序可以轻装上阵。**
