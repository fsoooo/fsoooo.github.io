#### 小程序使用npm引入第三方UI，经常出现错误，没有node_modules,导致无法引入第三方UI等

![image.png](https://upload-images.jianshu.io/upload_images/6943526-6c7a1a4509961e8f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


#### 正确操作应该是：

##### 先新建一个小程序项目，初始化npm项目

```shell
npm init
```

执行成功，会生成一个package.json 文件

```json
{
  "name": "weapp-hotel",
  "version": "1.0.0",
  "description": "A Wechat Small programming : weapp-hotel",
  "main": "app.js",
  "scripts": {
    "test": ""
  },
  "repository": {
    "type": "git",
    "url": "https://gitee.com/wangslei/weapp-hotel.git"
  },
  "keywords": [
    "weapp-hotel"
  ],
  "author": "wangsl",
  "license": "ISC",
  "dependencies": {}
}
```

下来生成package-lock.json，记录使用的第三方插件

```
npm install --production
```

#### 内容如下

```json
{
  "name": "weapp-hotel",
  "version": "1.0.0",
  "lockfileVersion": 1,
  "requires": true,
  "dependencies": {}
  }
}
```

#### 接着引入第三方组件

```shell
npm i vant-weapp -S --production -verbose
```

> 此处请务必使用–production选项，可以减少安装一些业务无关的 npm 包，从而减少整个小程序包的大小。
> -verbose 是为了输出详细信息（可以不要），英文翻译是 冗余 的意思

#### 然后点击工具 => 构建npm

![image](http://upload-images.jianshu.io/upload_images/6943526-26631e17766f9629?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![image.png](https://upload-images.jianshu.io/upload_images/6943526-d116d165f6f309e3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### 最后会在项目目录中生成这样的目录

![image.png](https://upload-images.jianshu.io/upload_images/6943526-c808126bb07de165.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


勾选“使用 npm 模块”选项：
![微信截图_20181211134118.png](https://upload-images.jianshu.io/upload_images/6943526-df5d5010718ed81f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### 引用UI组件

###### 有赞让我们这样使用

```json
{
  "usingComponents": {
    "van-button": "/path/to/vant-weapp/dist/button/index"
  }
}
```

###### 对于我们的项目我们改成自己的目录

```js
{
  "usingComponents": {
    "van-button":"/miniprogram_npm/vant-weapp/button/index"
  }
}
```

#### 但是运行时我们会发现会报错
![image](http://upload-images.jianshu.io/upload_images/6943526-a0ee99eeca5d4d42?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


#### 这个需要添加一个目录dist
![image](http://upload-images.jianshu.io/upload_images/6943526-f188cc156c75667d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这样引用第三方组件就OK了！

### 最后推荐几个不错的第三方UI组件库

------

#### 1. WeUI WXSS

WeUI WXSS是腾讯官方UI组件库WeUI的小程序版，提供了跟微信界面风格一致的用户体验。

**GitHub地址**：<https://github.com/Tencent/weui-wxss>

**npm下载**：npm i weui-wxss

------

#### 2. iView WeApp

iView是TalkingData发布的一款高质量的基于Vue.js组件库，而iView weapp则是它们的小程序版本。

**GitHub地址**：<https://github.com/TalkingData/iview-weapp>

**npm下载**：npm i iview-weapp

------

#### 3. ZanUI WeApp

ZanUI WeApp是有赞移动 Web UI 规范 ZanUI 的小程序现实版本，结合了微信的视觉规范，为用户提供更加统一的使用感受。

现已包含 badge、btn、card、cell、dialog、icon、label、noticebar、panel、popup、switch、tab、toast、toptips 等组件或元素。

**GitHub地址**：<https://github.com/youzan/vant-weapp>

**npm下载**：npm i zanui-weapp

另外，zanui也使用 mpvue 重写 zanui-weapp，实现了其中所有组件。

**GitHub地址**：<https://github.com/samwang1027/mpvue-zanui>

**npm下载：**npm i mpvue-zanui

------

#### 4. MinUI

MinUI 是蘑菇街前端开发团队开发的基于微信小程序自定义组件特性开发而成的一套简洁、易用、高效的组件库，适用场景广，覆盖小程序原生框架，各种小程序组件主流框架等，并且提供了专门的命令行工具。

**GitHub地址**：<https://github.com/meili/minui>

------

#### 5. Wux WeApp

Wux WeApp也是一个非常不错的微信小程序自定义 UI 组件库，组件比较丰富，值得使用。

**GitHub地址**：<https://github.com/wux-weapp/wux-weapp>

**npm下载**：npm i wux-weapp
