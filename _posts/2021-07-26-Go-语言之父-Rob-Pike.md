近几年来在计算机语言排行榜上成长最快的语言就是 Go 语言。它勇往直前势如破竹，从几年前的 50 名之外快速跃进前十的宝座，而且还在马不停蹄向上攀登。

大家都知道 Go 语言是 Google 推出来的，它是由 Google 包养了一群骨灰级程序员组成了一个叫着「Go Team」的精英团队共同打造。这个队伍里有鼎鼎大名的 Unix 操作系统发明人 Ken Thompson，大胡子形象的他在人群之中拥有极高的辨识度。Ken Thompson 今年已经 75 岁了，刚参与 Go 项目时他正处于个人职业生涯的半退休状态，头发几乎全部掉光。

 ![](http://upload-images.jianshu.io/upload_images/6943526-cdc12fec6ab60eb7?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这个队伍里还有另外一个其貌不扬头发不多的灵魂人物，从 Go 团队建立之初，他就一直在里面了。这个人名气没有 Ken Thompson 那么大，知道他的人并不是太多，而这个人其实才是 Go 语言「元团队」里最为核心的人物 ，他就是今天要讲的程序英雄 —— 加拿大人 Rob Pike。

 ![](http://upload-images.jianshu.io/upload_images/6943526-5c0c023b2e7cf594?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

我们现在看到的他已经是一个 60 多岁的老头了，年纪虽然只有我们的 2 倍多一点，但是在程序界工作的经验已经是我们大多数人的 5 ～ 6 倍。我们中国的程序员多半工作了十多年就几乎不愿再继续写代码了，但是他整整写了40多年还没有金盆洗手。别看他现在头发已经掉光了，遥想当年，他的头发也曾茂密过，从照片中看似乎还是一个不错的帅哥。
 ![](http://upload-images.jianshu.io/upload_images/6943526-4fc0311db7778af4?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

他来 Google 之前一直在贝尔实验室捣鼓它的 Plan9 操作系统，虽然几乎没人听说过世界上还有这么一个操作系统，Plan9 这个项目已经活了很多年，到现在还有不少人在继续维护，Plan9 的官方主页是 https://9p.io/plan9/。我翻阅了官网上对 Plan9 的说明文档，里面有关 Plan9 的论文多达几十篇，这些论文中 Rob Pike 的名字署满了近一半。这足以说明 Rob Pike 不容小嘘，他就是 Plan9 操作系统的灵魂人物。

![](http://upload-images.jianshu.io/upload_images/6943526-fe217902dbd69c6a?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

他是一个全能型程序员，从操作系统写到编译器，又从文本编辑器写到了 UI 界面。看到 Rob Pike 的伟大功绩，我不免要开始感叹自己的渺小，在他老人家面前我就是一个小学生 —— 都不如。

我本以为他只是一个单纯的程序员，但是查阅资料后发现，他居然还是一位业余天文学家，发明过珈玛射线射电望远镜。

 ![](http://upload-images.jianshu.io/upload_images/6943526-55d5a9e263efac10?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

更要命的是他还参加了 1980 年的奥运会射箭项目夺得了银牌。

 ![](http://upload-images.jianshu.io/upload_images/6943526-f7477d76aebbe4b7?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

1990年他上了电视，参与了大卫莱特曼的电视节目《Late Night with David Letterman》。

 ![](http://upload-images.jianshu.io/upload_images/6943526-4489e8ede1b4958c?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

他写过两本书，分别是《Unix 编程环境》和《程序编程实践》，感兴趣的同学可以买来读一读，字字珠玑，读后必定受益匪浅。

他说过一句话让我等数据结构学的很一般的后辈特别受鼓舞 ——  只要掌握了数据结构中的四大法宝，就可以包打天下，他们是：array 、linked list 、hash table、binary tree 。这四大法宝可不是各自为战的，灵活结合才能游刃有余。比如，一个用 hash table 组织的 symbol table，其中个个都是由字符型 array 构成的 linked list 组成的。

他和 Linus 大神有相似的观点 —— 以数据为中心。如果已经选择了正确的数据结构并且把一切都组织得井井有条，正确的算法也就不言自明。编程的核心是数据结构，而不是算法。

如果你喜欢玩弄高级的算法和数据结构，他说过的话可能会打击你 —— 花哨的算法比简单算法更容易出 bug 、更难实现。尽量使用简单的算法配合简单的数据结构。

在他心目中，他一直以 Ken Thompson 为自己的导师

> 在我加入贝尔实验室一年多后，我开始和 Ken Thompson 一起在开发一个针对由 Gerard Holzmann 设计的很小的图形化交换语言的即时编译器上做结对编程。我打字比较快，所以我坐在电脑前，Ken 站在我身后看我编程。我们开发的很快，但经常会遇到问题，而且可以看出来出错了 —— 毕竟这是一个图形化的编程语言。当程序出错时，我本能的一头扎进问题，检查报错跟踪信息，添加调试打印语句，启动调试器，等等，但 Ken 只是站在那思考，完全不理会我也不查看我们写的出问题的代码。一段时间后我发现一个规律，Ken 经常会比我先找到问题出在什么地方，而且会突然的喊一嗓子，“我知道什么地方的问题了。”每次他的判断都很准确。我认识到，Ken 已经在脑海里构建了代码的模型，当有问题出现时，那是他脑子里的模型出了问题。在思考为什么会发生这些错误时，他能凭直觉找到模型中什么地方不对或发现写的代码跟这个模式什么地方有出入。

> Ken 教会了我一个极其重要的习惯：纠错前先思考。如果你一头扎进问题中，你可能只解决了当前出现问题的代码，但如果你先思考这个错误，这个 bug 是怎么引入的？你通常发现和纠正一个更高层次的问题，进而改进了系统设计，防止了更多 bug 的出现。

> 我认识到这种编程思考模式非常的重要。有些人痴迷于一行行的、使用各种工具来调试所有的东西。但我现在相信，思考 —— 不看代码的思考 —— 是最好的调试途径，因为它能让你开发出更好的软件。

他和 Ken Thompson 一起发明了全世界无猿不知的 UTF8 编码格式。在前沿科技的量子计算和通讯领域也做过一些深入研究。

 ![](http://upload-images.jianshu.io/upload_images/6943526-6a83ce2f465ced3e?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

通过仔细翻阅他在贝尔实验室的个人主页，我发现 在 2003 年发起了一次严重车祸 —— 下坡的时候他从自行车上摔了下来！摔断了三根肋骨、锁骨碎裂、肩胛骨纵向分裂。辛亏当时带了头盔，不然有没有今天的 Go 语言都不好说。事后他饶有兴趣地将自己骨头的 X 射线底片放到了个人博客上和粉丝们一起仔细研究观赏。
 ![](http://upload-images.jianshu.io/upload_images/6943526-27e512035f25cd3a?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
