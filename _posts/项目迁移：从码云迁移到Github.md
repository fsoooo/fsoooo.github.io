之前因为某些原因，在码云gitee创建了一些项目，无奈到后来发觉码云生态活跃度还是不能和github比的，于是打算把项目迁移到github上。

但是项目迁移却遇到了问题，码云支持从Github导入,Github却不支持码云的导入。无奈之下，打算走野路子试一下，没想到居然成功了。
![image.png](https://upload-images.jianshu.io/upload_images/6943526-677851a9a33f00b2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


####下面是我的方法：
1.首先在github上创建一个新项目，如名为 Test，并克隆到本地

2.把码云上的需要迁移的项目拉下来，假设为名为 HelloWorld

3.把HelloWorld中的所有文件(除了.git文件夹)，覆盖粘贴到Test中

4.此时应该只剩下两个.git文件夹的差异了，其他东西完全一样

#####以下要小心操作
![image.png](https://upload-images.jianshu.io/upload_images/6943526-a69b68bd16312966.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

5.用sublime或其他编辑器 在HelloWorld的.git文件夹中搜索中的码云仓库地址假设是 gitee.com/xxxx/HelloWorld.git，暂时记录一下这些文件的位置

6.在HahaTest中同样操作第5步，但是这次要找的是 github 地址，如：github.com/xxxx/HahaTest.git ，暂时记录一下文件位置

7.对比5 、6的文件位置你会发觉，位置基本是一致的（有三四个地方，下面是其中一个）
```
[core]
    repositoryformatversion = 0
    filemode = true
    bare = false
    logallrefupdates = true
    ignorecase = true
    precomposeunicode = true
[remote "origin"]
    url = https://gitee.com/xxx/HelloWorld.git  <---  这个位置地址换一下
    fetch = +refs/heads/*:refs/remotes/origin/*
[branch "master"]
    remote = origin
    merge = refs/heads/master
```

8.这时，把gitee项目的.git 文件夹，整个强复制覆盖到github项目这边，然后把刚才5记录的gitee码云的.git地址，全部替换成github .git地址

9.用小乌龟或者sourcetree等git工具，在git项目中pull一下线上仓库，理论应该有history记录冲突，解决冲突，以本地最新为准，然后打个commit

10.大功告成，这时候，就连之前commit都能保留下来了，基本算是比较完整地完成了从码云到github的项目迁移
#####ps:最后，如果想要在Github首页显示每天的贡献次数，就必须保证码云gitee和Github 的邮箱地址保持一致。否则提交记录是不计算的。

![image.png](https://upload-images.jianshu.io/upload_images/6943526-4aecf777a725fee5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![image.png](https://upload-images.jianshu.io/upload_images/6943526-389f15d67f586592.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


