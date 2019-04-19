![pythonVSjava.jpg](https://upload-images.jianshu.io/upload_images/6943526-3d6572ac3d7450d4.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


曾几何时，软件开发人员一直在使用C语言环境。几年之后，Java出现在一个更好的选择，具有一些独特的优势。

![img](http://upload-images.jianshu.io/upload_images/6943526-f93f7abeb013219c.jpeg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

例如：

Java具有更好的OOP支持，紧凑和全面的编码模式。 

Java具有强大的库，使开发人员能够超越桌面，Web甚至移动应用程序开发。 

 Java是一种编译语言，要在任何计算机/设备上运行Java代码，必须先安装Java虚拟机。

再后来Python出现了，与Java不同，Pythons是一种解释语言。 因此，Python不需要任何虚拟机来运行代码。 相反，Python代码直接由机器解释并转换为机器可以遵循/理解的字节代码。

 Java之所以能得到广泛的应用，一个重要的原因是Java的互联网基因，从Applet到Servlet、JSP，从RMI到JMS再到ejb，从Struts到Spring，java这一路走来正是互联网技术发展的缩影。

Java以丰富的功能、强大的性能、可靠的表现、优秀的扩展性赢得了研发人员的青睐，目前互联网大型商业服务平台大多采用了Java技术，这就是对Java性能的高度认可。

Python的流行有一个重要的原因就是简单，Python做场景开发比Java要简单太多，尤其是做大数据和人工智能领域的研发。一方面Python的语法结构比较简单，比较符合程序员对开发语言的预期，另一方面Python的库非常丰富，写程序就像在“搭积木”一样。

![img](http://upload-images.jianshu.io/upload_images/6943526-8f0d11bd45738c52.jpeg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

Python拥有简单、免费、兼容性、面向对象、库丰富等突出优点，这几年可以说是红得一塌糊涂，一路高歌猛进，主流深度学习框架比如TensorFlow、Theano、Keras等等都是基于它开发的。

在未来在大数据、机器学习方面Pyton应该会得到更广泛的使用。



![pythonVsJava.png](https://upload-images.jianshu.io/upload_images/6943526-6634d9df69b33890.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)




![Java好还是Python好？一张图告诉你！](http://upload-images.jianshu.io/upload_images/6943526-6d9b0fd06d69b5b7?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# **Python**

**优点 ：**

语法简洁优美, 功能强大, 标准库跟第三方库灰常强大, 应用领域非常广，跟PHP形成了鲜明的对比!

语言方面, 举几个例子：

**一切都是对象!!!**

类(class本身)/函数/类方法是callable的对象

因为是对象,所以你当然可以传来传去啦. 比如:

![Java好还是Python好？一张图告诉你！](http://upload-images.jianshu.io/upload_images/6943526-0e676e8f8b9c0fea?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**List表达式**(其他好多语言也有,但是我最喜欢python的写法):

把”1023″变成 [1, 2, 3]

![Java好还是Python好？一张图告诉你！](http://upload-images.jianshu.io/upload_images/6943526-8f7f8f23873de141?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

(当前你可以用Lisp风格的: map(int, filter(lambda x: x != “0”, “1024”)))

**对dict也是类似:**

![Java好还是Python好？一张图告诉你！](http://upload-images.jianshu.io/upload_images/6943526-de5c3d8bbaa1147f?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**yield关键字:**

当你需要返回很多东西然后一个一个用的时候, 你可以一次返回一个

![Java好还是Python好？一张图告诉你！](http://upload-images.jianshu.io/upload_images/6943526-cc60166b2689eb79?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**装饰器@:**

把something_heavy()返回的结果缓存起来(以函数名+args为缓存的键值,只缓存最近使用的10条)

![Java好还是Python好？一张图告诉你！](http://upload-images.jianshu.io/upload_images/6943526-241a5883a172ee38?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**运算符重载:**

试试numpy, 你会惊呆的, 操作向量/矩阵跟基本类型一样方便

**缺点:**

**慢**

目测python是最慢的脚本语言,比V8上的JS还慢不少。 (研究一下描述符,你会发现python调用对象方法的开销好大!)

但是python创始人说了, 一般程序的瓶颈在于20%的代码, 所以你可以把那20%的代码用C重写(因为python是胶水语言，顾名思义，在多个语言之间左右逢源，游刃有余，用C重写部分代码当然很easy啦)

同时,你可以试试PyPy, 引入了JIT技术。

**动态类型**

有人说: 动态类型写时爽, 重构起来是灾难。

对于不写unittest, 不做代码覆盖率测试的人来说, 动态语言当然是危险的, 拼写错误都可能被隐藏, 重构?别捣乱!

python创始人有话说: “如果你认为编译器可以帮你解决所有问题,那你一定干编程没多久，不管什么程序，都需要写testcase， 既然要写testcase， 那么动态类型不是问题！”

# **Java:**

**优点**

用几个词形容一下Java语言：优美，严谨，健壮，不易出错。

当然，使用也非常的广泛： 常年盘踞编程人员数量排行榜第一名！

各种库也灰常多: akullpp/awesome-java · GitHub

**同样的代码, 相比C++(甚至python), Java代码出BUG的概率要小点**(当然,写的时候一般会比python长)

Java从语言设计上尽量避免了程序员犯错，比如自动垃圾回收， 抛弃无符号类型， 安全的枚举，编译期泛型检查(Java1.5之后加入的泛型，但是只是用来做编译器检查，运行时跟以前一样)，强制的异常处理(遇到异常必须catch或者申明throws) 等等(当然，某些特性python也有)

Java标准库和好多第三方代码都充斥着浓浓的设计感!!! 各种设计模式到处可见。 从下面的语句可以看出一点来:

![Java好还是Python好？一张图告诉你！](http://upload-images.jianshu.io/upload_images/6943526-15084ac5c2557ab0?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

好多字, 看它们的:

C:

![Java好还是Python好？一张图告诉你！](http://upload-images.jianshu.io/upload_images/6943526-899844d427710cbd?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

Python:

![Java好还是Python好？一张图告诉你！](http://upload-images.jianshu.io/upload_images/6943526-d4fcd8348c150cd8?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

Java代码多，但是API可复用行更强，选择更多(我想一次读完文件，不要buffer呢？)

因为健壮安全，所以Java成了企业级后台的标准。想想银行后台, 关键地方出点bug可不得了。

**缺点:**

**要敲好多代码, 参考上面的例子…**

**没有Python那些奇葩特性，灵活性不足，怎么写你还是Java， 而Python可以写的像Javascript/Lisp/Matlab…..**



**简单来说， Python是给人设计的(人生苦短,请用Python)， C/C++更像是为机器设计的，而Java则介于两者之间。**





#### Java趋势：

 Java正在逐渐走向中年，逐渐走向规划市场逐渐消失的趋势。但是，Java在企业和移动应用程序开发中的普及是巨大的。 在静态类型的编程脚本中，Java仍然是一个王者。

 Java是一种定义良好的语言，因此如果不先定义类，就无法编写代码。 作为一种令人敬畏的OOP语言，准备开发人员的导师将首先学习Java。因此，开发人员可以习惯于最新的编码样式，模式和最佳实践。

 Java是多线程语言，运行在8核CPU上 由于市场竞争激烈，真正的Java开发人员正在使代码紧凑，编码速度更快，并且从以前的版本中获得更大的灵活性。 由于功能强大的JVM，跨平台和设备的交叉兼容性在市场上是不兼容和无与伦比的。 

因此，90％的财富500强公司或企业更喜欢Java。 谷歌从一开始就选择Java作为其Android平台，因为它在技术和一般意义上都有巨大的优势。

#### Python趋势： 

今天，Python正在发达国家和富裕国家获得惊人的增长和普及，人们开放并提供即将到来的技术，如AI，物联网，机器学习和基于大数据的应用程序开发以及创新初创公司的实施。

 Python在桌面应用程序，Web应用程序，网络服务器和媒体工具中非常有用。 Python非常适合提高开发人员的工作效率，提高语言的灵活性，支持优秀的库，并且易于学习，特别是谁知道至少有一个像Java这样的OOP脚本。 

Python由于其全局解释器锁（GIL）而是单线程的，并且目前在单个CPU核上运行。 

Python是新一代开发人员的最爱，Python开发人员的需求高于Java。因此，Python开发人员的薪水高于Java开发人员。Python编码需要更少的代码行来表达Java的相同内容。当任何错误或异常发生时，它可以节省大量编写和检查代码的时间。

 Python是一种有文化的编程语言 在早期，编程语言仅用于应用程序开发，但是今天，除了开发之外，它还有各种各样的应用程序。这意味着非程序员也会在没有编程技巧的情况下跳上代码。



 Java具有简洁的语法和开发人员，可以创建软件应用程序。但是，Python在这方面有所不同。它简单易懂，易于编码，学习曲线流畅。 

Python的另一个重要方面是能够为强大的应用程序/用途构建良好的编码技术。因此，Python正在成为技术学校和大学中流行的编程语言。学生从不觉得他们正在做一些像编程这样的特殊事情。相反，他们在写一篇文章时接近它。 在有文化的编程技术中，代码，解释性散文，图像，图形和其他表示材料属于单个文档，并且代码仍然可以与环境一起执行。

Python支持使用Leo和Jupiter Notebook（如IDE）的文字编程环境。 因此，Python是一种有文化的编程语言，在演示，演示，教学，协作和研究等各个领域都表现出色。

 Python和Java性能方面的比较 当我们从技术上说Java正在使用虚拟机（JVM）在任何机器上执行代码时，我们知道它总是会保持快速的性能。解释性编程的性能总是很慢。因此，与Java相比，Python仍然较慢。 不幸的是，它总是不正确。根据规则，语言的性能依赖于环境。需要考虑的另一个问题是库的类型和功能，编码样式和应用的范例。 

Python支持多种范例，例如功能，OOP和它的混合。而Java只有一个而且它是OOP。但是，如果您已经在Python中开发了一个应用程序，但是当您要扩展它时，您必须使用Java。因此，从某种意义上说，性能成为一个复杂的指标，与Java直接比较是一场噩梦。

#### 市场份额和社区支持比较 

Java与Python 当我们考虑一种语言的市场份额时，可靠的市场调查是很容易知道的工具。根据两年前和今年进行的此类调查，我们观察到Java仍处于领先地位，而2017年的Python排名第五，但在2019年，它紧挨着Java。 测量员根据招聘人员在一段时间内的招聘数量方面的需求，考虑了一种语言的流行程度。因此，我们可以说Java和Python之间的差异很小。

另一个用于比较的指标是开发者社区。语言社区的数量比其他语言的数量更多表明开发人员如何采用它以及您可以从社区获得多少强有力的支持。 毫无疑问，就用户组而言，Java拥有比Python更大的开发人员社区。这些小组可在各种技术论坛和平台上使用。他们还能够向另一位开发人员伸出援助之手，无论是免费还是收取合理费用。 

当我们比较编程脚本的流行度时，还需要在这里公开一个事实。一些编程领域比其他语言更适合特定语言。 适用于Java和Python的多语言FTW 今天，全栈开发是市场上的流行语。这意味着全栈开发人员具有各种语言，平台和框架的工作能力。

因此，当一组开发人员发现适合特定项目及其目标时，他们可能更喜欢某种语言。 例如，Python是数据科学家，AI专家和机器学习应用程序开发的最佳选择。当动态/服务器端，嵌入式和跨平台应用程序开发成为必需品时，Java可能会非常出色。
