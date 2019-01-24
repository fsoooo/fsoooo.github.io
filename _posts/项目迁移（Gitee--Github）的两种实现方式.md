之前在简书上写了一篇 [项目迁移：从码云迁移到Github](https://www.jianshu.com/p/196d6f5f73a5)，今天早上过来发现几个简友给我留言：
![评论.png](https://upload-images.jianshu.io/upload_images/6943526-84eef4c003eb0c04.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
之前我对git了解的太浅，走的是野路子，可能会误导大家，现在对以前的做法做出矫正。

在这里要感谢： [Oo莫莫oO](https://www.jianshu.com/u/aaac1f3d152c) ,[Hans的博客](https://www.jianshu.com/u/28a4d1accff3),[龙哥盟飞龙](https://www.jianshu.com/u/b508a6aa98eb) 的指正，谢谢大家。

### 项目迁移（Gitee->Github）的两种实现方式

随着github的普及和流行，我们习惯把代码托管到类似github的远程仓库中。但是由于网络等种种原因，github在国内的访问并不稳定。于是国内各种托管平台应运而生，比较知名的有coding，码云等。很多国内程序员会把代码托管到多个平台，兼顾稳定性和流行性，有时候我们会有项目迁移这种需求.

### 一.Git设置多远程仓库

我有下面两个仓库： 
`https://gitee.com/fsoooo/test.git` 
`https://github.com/fsoooo/test.git`

**方法一: 使用 `git remote add` 命令**

1.1#添加多个远程仓库

先添加第一个仓库： 
`git remote add origin https://gitee.com/fsoooo/test.git` 
再添加第二个仓库： 
`git remote set-url --add origin https://github.com/fsooo/test.git`

如果还有其他，则可以像添加第二个一样继续添加其他仓库。

然后使用下面命令提交： 
`git push origin --all`

打开`.git/config`，可以看到这样的配置：

```
[core]
	repositoryformatversion = 0
	filemode = false
	bare = false
	logallrefupdates = true
	symlinks = false
	ignorecase = true
[remote "origin"]
	url = https://gitee.com/wangslei/test.git
	fetch = +refs/heads/*:refs/remotes/origin/*
	url = https://github.com/fsoooo/test.git
[branch "master"]
	remote = origin
	merge = refs/heads/master
```

刚才的命令其实就是添加了这些配置。如果不想用命令行，可以直接编辑该文件，添加对应的url即可。

1.2# 查看远程仓库的情况

```
git remote
origin

git remote
origin  https://gitee.com/fsoooo/test.git (fetch)
origin  https://gitee.com/fsoooo/test.git (push)
```

1.3# 查看远程仓库情况。可以看到 `github` 远程仓库有两个 `push` 地址。

```
git remote -v
gitee  https://gitee.com/fsoooo/test.git (fetch)
gitee  https://gitee.com/fsoooo/test.git (push)
gitee  https://github.com/fsoooo/test.git (push)
```

1.4 # 推送远程分支

**这种方法的好处是每次只需要 push 一次就行了（账号密码不同的话，可能会输两次账号密码）**

方法二: 修改配置文件**

2.1# 添加配置模块

打开 `.git/config` 找到 `[remote]`，添加对应的 **模块** 即可，效果如下：

```shell
[core]
	repositoryformatversion = 0
	filemode = false
	bare = false
	logallrefupdates = true
	symlinks = false
	ignorecase = true
[remote "origin"]
	url = https://gitee.com/wangslei/test.git
	fetch = +refs/heads/*:refs/remotes/origin/*
[remote "github"]
	url = https://github.com/fsoooo/test.git
	fetch = +refs/heads/*:refs/remotes/github/*
[branch "master"]
	remote = origin
	merge = refs/heads/master

```

2.2# 查看远程仓库的情况

```
git remote
origin
github

git remote
github  https://github.com/fsoooo/test.git (fetch)
github  https://github.com/fsoooo/test.git (push)
```
2.3# 再次查看远程仓库的情况，可以看到已经有两个远程仓库了。然后再使用相应的命令 `push` 到对应的仓库就行了。

```shell
git remote
github
gitee

git remote -v
github  https://github.com/fsoooo/test.git (fetch)
github  https://github.com/fsoooo/test.git (push)
gitee https://gitee.com/fsoooo/test.git (fetch)
gitee https://gitee.com/fsoooo/test.git (push)
```
![git  remode.png](https://upload-images.jianshu.io/upload_images/6943526-08049848b6caa56d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

2.4 # 推送远程分支

**这种方法的缺点是每次要 push 两次**

```shell
git push origin master
git push github master

```

#### 关于 `git pull`

方法一在 `push` 的时候比较方便。但是在 `pull` 的时候只能从方法一中的第一个 `url` 地址拉取代码。而方法二则不存在这种问题（可能要解决冲突）。
所以，如果只进行 `push` 操作，推荐方法一，如果也要进行 `pull` 操作，推荐方法二。

### 二.Github Import 

![Github-import.png](https://upload-images.jianshu.io/upload_images/6943526-2af52fff32089f09.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![Github-import2.png](https://upload-images.jianshu.io/upload_images/6943526-c9affc6951f5701e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



