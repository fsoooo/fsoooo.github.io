BurpSuite是一款信息安全从业人员必备的集成型的渗透测试工具。

它采用自动测试和半自动测试的方式，包含了 Proxy,Spider,Scanner,Intruder,Repeater,Sequencer,Decoder,Comparer等工具模块。

通过拦截HTTP/HTTPS的web数据包，充当浏览器和相关应用程序的中间人，进行拦截、修改、重放数据包进行测试，是WEB安全人员不可或缺的神兵利器。

>工具以及破解包路径：
>https://down.52pojie.cn/Tools/Network_Analyzer/Burp_Suite_Pro_v1.7.37_Loader_Keygen.zip
>
>汉化包获取路径：
>链接：https://pan.baidu.com/s/1VYJGTzbdG5kVqVTVxxbsGQ 提取码：39en
>
>下载解压之后，其中BurpSuiteCn.jar就是汉化包（burp-loader-keygen.jar是破解包，可自行破解）


大多教程中使用的是bat运行，会有黑框，建议用vbs运行，将下面的代码保存为burp.vbs即可。
```
Set ws = CreateObject("Wscript.Shell")
ws.run "cmd /c java -Dfile.encoding=utf-8 -javaagent:BurpSuiteCn.jar -Xbootclasspath/p:burp-loader-keygen.jar -Xmx1024m -jar burpsuite_pro_v1.7.37.jar",vbhide
```

####burpsuite的主界面

![](https://upload-images.jianshu.io/upload_images/6943526-59eba8a8c302a181.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


####Proxy的主界面

![](https://upload-images.jianshu.io/upload_images/6943526-726f747e837f9e6b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

Proxy的主界面分为4个板块：**Intercept、Http History、Websocket History、Options**，这四个模块分别是"截断请求"、"HTTP历史"、"Stokets历史"、"选项"。

![](https://upload-images.jianshu.io/upload_images/6943526-3b7c035204462d08.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

###Intercept

对我来说，整个burp suite的使用最多就是这个位置。

Burp Proxy的拦截功能主要由Intercept选项卡中的Forward、Drop、Interception is on/off、Action构成

Forward的功能是当你查看过消息或者重新编辑过消息之后，点击此按钮，将发送消息至服务器端。 

Drop的功能是你想丢失当前拦截的消息，不再forward到服务器端。

Interception is on表示拦截功能打开，拦截所有通过Burp Proxy的请求数据；

Interception is off表示拦截功能关闭，不再拦截通过Burp Proxy的所有请求数据。 

![](https://upload-images.jianshu.io/upload_images/6943526-6678c4366734adfa.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

Action的功能是除了将当前请求的消息传递到Spider、Scanner、Repeater、Intruder、Sequencer、Decoder、Comparer组件外，还可以做一些请求消息的修改，如改变GET或者POST请求方式、改变请求body的编码，同时也可以改变请求消息的拦截设置，如不再拦截此主机的消息、不再拦截此IP地址的消息、不再拦截此种文件类型的消息、不再拦截此目录的消息，也可以指定针对此消息拦截它的服务器端返回消息。 对包体的任何修改都可以在这个窗口内进行直接修改，然后发送

![](https://upload-images.jianshu.io/upload_images/6943526-dcb6b1f1c4c853e4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

####Http History

![](https://upload-images.jianshu.io/upload_images/6943526-8e575f328a671d71.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


学习Proxy，首先看标红，intercept is on 为拦截状态 其对应的intercept is off 为非拦截状态,设置完代理后打开拦截状态，浏览器发起的请求会被burpsuite所拦截

forward: 进行请求后被拦截，点击forward可以继续此次请求，如果你点击drop则丢弃此请求数据。继续请求后能够看到返回结果

可以在消息分析选项卡查看这次请求的所有内容

1）.Raw 这个视图主要显示web请求的raw格式，包含请求地址， http协议版本， 主机头， 浏览器信息，accept可接受的内容类型，字符集，编码方式，cookies等, 可以手动修改这些内容，然后在点击forward进行渗透测试

2）. params 这个视图主要是显示客户端请求的参数信息，get或者post的参数，cookies参数，也可以修改

3）.headers是头部信息和Raw其实差不多，展示更直观

4）.Hex 这个视图显示Raw的二进制内容

![](https://upload-images.jianshu.io/upload_images/6943526-6f43b4bd2500149d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

注意： 默认情况下，BurpProxy只拦截请求的消息，普通的文件如css,js,图片是不会拦截的，当然，想拦截什么都可以设置,我们现在知道了怎么设置代理，怎么安装，怎么进行请求拦截，怎么修改请求发起的内容向服务端进行渗透，接下来我们学习一下怎么控制这些拦截

http history 所有拦截的历史均会被记录起来 

![](https://upload-images.jianshu.io/upload_images/6943526-351a5f2782becd30.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

####Websocket History
![](https://upload-images.jianshu.io/upload_images/6943526-a0db03d1a5f9b1d6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
                                                                                             
####Options

![](https://upload-images.jianshu.io/upload_images/6943526-423a8eb1c2d73b8f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](https://upload-images.jianshu.io/upload_images/6943526-a3e52e04f906ed45.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


>默认是127.0.0.1:8080，如果你的没有自己设置的话，那就添加就好了

####Firefox代理设置
（1）打开Firefox浏览器【设置-网络-代理】
（2）配置代理如下图

![](https://upload-images.jianshu.io/upload_images/6943526-238128a20191e756.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

####配置代理监听

![](https://upload-images.jianshu.io/upload_images/6943526-136c16f997542fe4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

以上两步配置完成后，burpsuit就可以监听Firefox的流量了，可以随意访问一个网页，然后在目标页签查看。

####流量拦截

1).在代理-截断页面，点击拦截禁用按钮之后，就会截断firefox上面对特定服务器后续的请求，并且把消息体显示在这个页面

![](https://upload-images.jianshu.io/upload_images/6943526-6517895a086aa004.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
2).点击放包，就会放行这条流量，点击废包就会阻断这条数据，可以根据实际情况选择
3).当取消点击拦截禁用（也就是点击拦截请求）之后，burpsuit又会恢复到对流量只监控不阻断的情况

####重发
1）.可以将第4步中拦截的消息体直接复制到重发器中，修改参数后进行重发
2）.也可以根据实际情况编辑消息体进行发送
3）.在右侧可以配置请求的目标地址

![](https://upload-images.jianshu.io/upload_images/6943526-210212682576cd74.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

无论是在拦截过程中、历史记录中还是站点地图中都有将请求发送到重放器的操作，以历史记录中的请求为例，选中请求后右键，点击【Send to Repeater】，重放器选项卡会短暂高亮，进入选项卡Request中会显示发送过来的请求信息，点击【Send】获取响应结果，可以直接修改请求信息后点击【Send】进行测试，通过获取响应信息判断请求是否有问题

![](https://upload-images.jianshu.io/upload_images/6943526-6ec83338956e6511.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](https://upload-images.jianshu.io/upload_images/6943526-5c68d23dec27c417.gif?imageMogr2/auto-orient/strip)



















