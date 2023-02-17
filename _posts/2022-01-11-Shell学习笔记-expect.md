#expect 解释器
expect是一个能实现自动和交互式任务的解释器，它也能解释常见的shell语法命令，其特色在以下几个命令：

![](https://upload-images.jianshu.io/upload_images/6943526-4491305c0fcef675.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#####spawn命令：

spawn command命令会fork一个子进程去执行command命令，然后在此子进程中执行后面的命令；

在ssh自动登陆脚本中，我们使用 spawn ssh user_name@ip_str，fork一个子进程执行ssh登陆命令；

#####expect命令：

expect命令是expect解释器的关键命令，它的一般用法为 expect "string",**即期望获取到string字符串**,可在在string字符串里使用 * 等通配符;

string与命令行返回的信息匹配后，expect会立刻向下执行脚本；

#####set timeout命令：

set timeout n命令将expect命令的等待超时时间设置为n秒，在n秒内还没有获取到其期待的命令，expect 为false,脚本会继续向下执行；

#####send命令：

send命令的一般用法为 send "string"，它们会我们平常输入命令一样向命令行输入一条信息，当然**不要忘了在string后面添加上 \r 表示输入回车**；

#####interact命令：
interact命令很简单，执行到此命令时，脚本fork的子进程会将操作权交给用户，允许用户与当前shell进行交互；

#####结束符：
expect eof ：等待执行结束，若没有这一句，可能导致命令还没执行，脚本就结束了

interact ： 执行完成后保持交互状态, 这时可以手动输入信息

#####shell信号捕捉命令 trap

tarp命令用于在接收到指定信号后要执行的动作，通常用途是在shell脚本被中断时完成清理工作

例如：
脚本在执行时按下CTRL+c时，将显示"program exit…"，并退出(CTRL+c的信号是SIGINT)

```
#!/bin/bash
trap "ehco 'program exit...'; exit 2" SIGINT

....
```

## 常用信号

![](https://upload-images.jianshu.io/upload_images/6943526-b03a3a90db5d9289.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## shell 输出颜色文本
```
echo -e "\033[42;37m 绿底白字 \033[0m"](https://blog.csdn.net/doubi6/article/details/112135575)
```

## ANSI控制码
```
\33[0m 关闭所有属性
\33[1m 设置高亮度
\33[4m 下划线
\33[5m 闪烁
\33[7m 反显
\33[8m 消隐
\33[30m – \33[37m 设置前景色（字体色）30:黑 31:红 32:绿 33:黄 34:蓝色 35:紫色 36:深绿 37:白色
\33[40m – \33[47m 设置背景色 40:黑 41:深红 42:绿 43:黄色 44:蓝色 45:紫色 46:深绿 47:白色
\33[nA 光标上移n行
\33[nB 光标下移n行
\33[nC 光标右移n行
\33[nD 光标左移n行
\33[y;xH设置光标位置
\33[2J 清屏
\33[K 清除从光标到行尾的内容
\33[s 保存光标位置
\33[u 恢复光标位置
\33[?25l 隐藏光标
\33[?25h 显示光标
```
##shell 字符

####shell通配符

![](https://upload-images.jianshu.io/upload_images/6943526-c8fab68036f3b0dc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

####shell元字符

![](https://upload-images.jianshu.io/upload_images/6943526-e5abafa50d7af672.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

####shell 转义字符

![](https://upload-images.jianshu.io/upload_images/6943526-0ed80112dc9d4a15.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

####Shell正则表达式

![](https://upload-images.jianshu.io/upload_images/6943526-89fbb1046eab8e8d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](https://upload-images.jianshu.io/upload_images/6943526-c6f088bd30ffedbd.gif?imageMogr2/auto-orient/strip)
