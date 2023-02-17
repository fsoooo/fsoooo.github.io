[Github Pages](https://pages.github.com/) 提供免费无限流量的静态 HTML 网站托管，[Jekyll](https://jekyllrb.com/) 是基于 Ruby 的用于生成静态网站的程序，支持 Markdown 撰写内容，以及解析 Liquid 模板。

Github Pages 官方支持 Jekyll，只需上传 Jekyll 网站源文件到与 Github Pages 对应的代码仓库的对应分支即可自动生成网站，并可绑定自己的域名。

![image.png](https://upload-images.jianshu.io/upload_images/6943526-bcb5aeebbb3dedd3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


## 1. 创建 Github Pages 源代码仓库

在 Github 上新建一个 Repository ，命名为 `username.github.io`，其中 username 就是账户名。在 master 分支里放入静态 HTML
文件，通过网址 `http://username.github.io` 即可直接访问到。

## 2. 搭建本地测试环境

如果不搭建本地环境，更改任何代码、添加或编辑文章，只能通过 commit 和 push 上传到 Github 才能查看效果，速度很慢。

所以需要在本地搭建和Github Pages 相同的环境来进行测试。由于 Github 上不支持 Jekyll 插件（插件需要运行 Ruby 程序，这样 Github Pages 就成 Github Server 了）

## 3.搭建Jekyll 网站

### 整个网站结构

```
├── _config.yml
├── _drafts
|   ├── begin-with-the-crazy-ideas.textile
|   └── on-simplicity-in-technology.markdown
├── _includes
|   ├── footer.html
|   └── header.html
├── _layouts
|   ├── default.html
|   └── post.html
├── _posts
|   ├── 2007-10-29-why-every-programmer-should-play-nethack.textile
|   └── 2009-04-26-barcamp-boston-4-roundup.textile
├── _data
|   └── members.yml
├── _site
├── img
└── index.html
```

很复杂看不懂是不是，不要紧，你只要记住其中几个OK了

- `_config.yml` 全局配置文件
- `_posts` 放置博客文章的文件夹
- `img` 存放图片的文件夹

### 修改博客配置

来到你的仓库，找到`_config.yml`文件,这是网站的全局配置文件。修改配置文件，配置文件的内容：

#### 基础设置

```
# Site settings
title: You Blog                     #你博客的标题
SEOTitle: 你的博客 | You Blog        #显示在浏览器上搜索的时候显示的标题
header-img: img/post-bg-rwd.jpg     #显示在首页的背景图片
email: You@gmail.com    
description: "You Blog"              #网站介绍
keyword: "keywords" #关键词
url: "https://username.github.io"          # 这个就是填写你的博客地址
baseurl: ""      # 这个我们不用填写
```

#### 侧边栏

```
# Sidebar settings
sidebar: true                           # 是否开启侧边栏.
sidebar-about-description: ""  #人生格言
sidebar-avatar:xxx.JPG      # 你的个人头像
```

#### 社交账号

展示你的其他社交平台



![img](https://upload-images.jianshu.io/upload_images/2178672-ec775a22f76e2f40.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/270/format/webp)

在下面你的社交账号的用户名就可以了，若没有可不用填

```
# SNS settings
RSS: false
weibo_username:     username
zhihu_username:     username
github_username:    username
facebook_username:  username
jianshu_username:   jianshu_id
```

#### 好友

```
friends: [
    {
        title: "简书",
        href: "http://www.jianshu.com/u/jianshu_id"
    }
]
```

# 写文章

利用 Github网站 ，我们可以不用学习[git](https://git-scm.com/)，就可以轻松管理自己的博客

对于轻车熟路的程序猿来说，使用git管理会更加方便。。。

#### 创建

文章统一放在网站根目录下的 `_posts` 的文件夹中。

#### 格式

每一篇文章文件命名采用的是`2017-02-04-Hello-2017.md`时间+标题的形式，空格用`-`替换连接。

文件的格式是 `.md` 的 [**MarkDown**](http://sspai.com/25137/) 文件。

我们的博客文章格式采用是 **MarkDown**+ **YAML** 的方式。

[**YAML**](http://www.ruanyifeng.com/blog/2016/07/yaml.html?f=tt) 就是我们配置 `_config`文件用的语言。

[**MarkDown**](http://sspai.com/25137/) 是一种轻量级的「标记语言」，很简单。[花半个小时看一下](http://sspai.com/25137)就能熟练使用了

大概就是这么一个结构。

```
---
layout:     post                    # 使用的布局（不需要改）
title:      My First Post               # 标题 
subtitle:   Hello World, Hello Blog #副标题
date:       2017-02-06              # 时间
author:     Your  Name                      # 作者
header-img: img/post-bg-2015.jpg    #这篇文章标题背景图片
catalog: true                       # 是否归档
tags:                               #标签
    - 生活
---

## Hey
>这是我的第一篇博客。

进入你的博客主页，新的文章将会出现在你的主页上.
```

按格式创建文章后，提交保存。进入你的博客主页，新的文章将会出现在你的主页上.

到这里，恭喜你！你已经成功搭建了自己的个人博客！

![image.png](https://upload-images.jianshu.io/upload_images/6943526-41378d79c90aca4f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

