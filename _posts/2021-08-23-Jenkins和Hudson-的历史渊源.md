
![img](http://upload-images.jianshu.io/upload_images/6943526-a635e6452e9f5330?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### Jenkins和Hudson的历史渊源

Jenkins的前身是Hudson，采用JAVA编写的持续集成开源工具。

Hudson由Sun公司在2004年启动，第一个版本于2005年在java.net发布。

2007年开始Hudson逐渐取代CruiseControl和其他的开源构建工具的江湖地位。

在2008年的JavaOne大会上在开发者解决方案中获得杜克选择大奖（Duke's Choice Award）。

在2010年11月期间，因为Oracle对Sun的收购带来了Hudson的所有权问题。

主要的项目贡献者和Oracle之间，尽管达成了很多协议，但有个关键问题就是商标名称“Hudson”。

甲骨文在2010年12月声明拥有该名称并申请商标的权利。

 因此，2011年1月11日，有人要求投票将项目名称从“Hudson”改为“Jenkins”。

2011年1月29日，该建议得到社区投票的批准，创建了Jenkins项目。

2011年2月1日，甲骨文表示，他们打算继续开发Hudson，并认为Jenkins只是一个分支，而不是重命名。

因此，Jenkins和Hudson继续作为两个独立的项目，**每个都认为对方是自己的分支**。

到2013年12月，GitHub上的Jenkins拥有567个项目成员和约1,100个公共仓库，与此相对的Hudson有32个项目成员和17个公共仓库。到现在两者的差异更多，应该说Jenkins已经全面超越了Hudson。此外，大家可能是出于讨厌Oracle的情绪，作为Java开发者天然地应该支持和使用Jenkins。

从上面两个项目的logo，大家也可以看到两个项目之间的亲戚关系，都是两个老头。

左边的是Jenkins，右边是Hudson。后面Hudson被Oracle捐给了Eclipse基金会，所以右边这老头有个Eclipse的光环加持。

#### Jenkins和Hudson的受欢迎程度

下面讨论一下起源相同的两个CI工具，为什么Jenkins更受大家欢迎。

由开发者主导、面向开发者

![img](http://upload-images.jianshu.io/upload_images/6943526-9dc6d0eed8bb11f0?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

首先，曾经是Hudson开发人员中的99%都转向了Jenkins的开发，其中包括最初的创建者川口清子（Kohsuke Kawaguchi）。他独自写了大部分代码，并且他的经验是Hudson各种高级特性的关键来源。

Jenkins的开发社区更活跃。所以对很多人而言，从血统上看Hudson是后娘养的，Jenkins才是亲生的！

治理和社区

Jenkins开发社区的管理是很开放的。 有一个独立的董事会，其中包括来自Yahoo!, CloudBees，Cloudera和Apture等多家公司的长期以来的Hudson开发人员。每次会议后，他们定期举行治理会议并发表意见，征询公众意见。他们还将所有代码都捐赠给公共利益软件组织（SPI），以确保社区持续开放。

稳定性

分手后，针对Jenkins的贡献不断持续增加，Jenkins制定了新的长期支持发布线。社区定大约每三个月发布一次稳定版本的补丁。

插件的平台

Jenkins支持超过1000个插件。凭借多样而强大的插件Jenkins成了整个开发生命周期中的一个中心点。

到了2017年，两者的发展差异更大了。Jenkins应该说是CI工具中公认的老大，而Hudson不仅不能与Jenkins比，跟其他CI工具比也没什么优势，完全沉沦了。

#### Jenkins和Hudson的对比

slant网站对一系列CI工具做了一次对比，其中Jenkins和Hudson的情况如下。

##### 1.基本面问题

| 工具               | Jenkins | Hudson |
| ------------------ | ------- | ------ |
| 最好的CI工具       | 1       | 22     |
| 最好的JAVA CI工具  | 1       | 7      |
| 最好的自托管CI工具 | 3       | 4      |

##### 2.其他支持

| 工具                     | Jenkins | Hudson |
| ------------------------ | ------- | ------ |
| 对Window支持最好         | 1       | 无排名 |
| 最好的开源CI工具         | 1       | 无排名 |
| 对BitBucket的支持        | 2       | 无排名 |
| 对移动开发者支持最好的CI | 4       | 无排名 |

##### 3.更多特征

| Jenkins                                                      | Hudson                                    |
| ------------------------------------------------------------ | ----------------------------------------- |
| 免费且开源                                                   | 与Jenkins共享了很多代码，安装还是挺简单的 |
| 关键的环境变量可以安全存储                                   |                                           |
| 支持多个SCM，包括SVN, Mercurial, Git。集成了GitHub和Bitbucket |                                           |
| 高度可配置                                                   |                                           |
| 资源和教程很多                                               |                                           |
| 安装运行简单                                                 |                                           |
| 分布式的构建也能高效运行                                     |                                           |
| 可跨平台部署                                                 |                                           |
| 很多高质量的插件                                             |                                           |
| 得奖无数                                                     |                                           |
| 庞大的社区                                                   |                                           |
