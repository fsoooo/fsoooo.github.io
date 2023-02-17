**一、安装node环境**

1、下载地址为：[https://nodejs.org/en/](https://nodejs.org/en/ "https://nodejs.org/en/")

　　2、检查是否安装成功：如果输出版本号，说明我们安装node环境成功

　　![image](http://upload-images.jianshu.io/upload_images/6943526-e7106d0464ab0a91.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

　　3、为了提高我们的效率，可以使用淘宝的镜像：[http://npm.taobao.org/](http://npm.taobao.org/ "http://npm.taobao.org/")

　　输入：npm install -g cnpm –registry=https://registry.npm.taobao.org，即可安装npm镜像，以后再用到npm的地方直接用cnpm来代替就好了。

　　![image](http://upload-images.jianshu.io/upload_images/6943526-17d11c317bdebf58.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

　　检查是否安装成功：

　　![image](http://upload-images.jianshu.io/upload_images/6943526-64a44c742cb8e222.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**二、搭建vue项目环境**

　　1、全局安装vue-cli

　　npm install --global vue-cli

![image](http://upload-images.jianshu.io/upload_images/6943526-707a70d7c7301121.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240) 

　　2、进入你的项目目录，创建一个基于 webpack 模板的新项目

　　![image](http://upload-images.jianshu.io/upload_images/6943526-7c7d8c8f1c5b2a16.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

　　说明：

　　　　Vue build ==> 打包方式，回车即可；

　　　　Install vue-router ==> 是否要安装 vue-router，项目中肯定要使用到 所以Y 回车；

　　　　Use ESLint to lint your code ==> 是否需要 js 语法检测 目前我们不需要 所以 n 回车；

　　　　Set up unit tests ==> 是否安装 单元测试工具 目前我们不需要 所以 n 回车；

　　　　Setup e2e tests with Nightwatch ==> 是否需要 端到端测试工具 目前我们不需要 所以 n 回车；

　　3、进入项目：cd vue-demo，安装依赖

　　![image](http://upload-images.jianshu.io/upload_images/6943526-92e66b4682600956.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

　　安装成功后，项目文件夹中会多出一个目录：　node_modules

　　![image](http://upload-images.jianshu.io/upload_images/6943526-34f52b071ab97228.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

　　4、npm run dev，启动项目

　　项目启动成功：

　　![image](http://upload-images.jianshu.io/upload_images/6943526-f9018ccde8e6fe55.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**三、vue项目目录讲解**

**![image](http://upload-images.jianshu.io/upload_images/6943526-ccca45ffdb956842.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)**   
```
1、build：构建脚本目录
　　　　1）build.js   ==>  生产环境构建脚本；
　　　　2）check-versions.js   ==>  检查npm，node.js版本；
　　　　3）utils.js   ==>  构建相关工具方法；
　　　　4）vue-loader.conf.js   ==>  配置了css加载器以及编译css之后自动添加前缀；
　　　　5）webpack.base.conf.js   ==>  webpack基本配置；
　　　　6）webpack.dev.conf.js   ==>  webpack开发环境配置；
　　　　7）webpack.prod.conf.js   ==>  webpack生产环境配置；
　　2、config：项目配置
　　　　1）dev.env.js   ==>  开发环境变量；
　　　　2）index.js   ==>  项目配置文件；
　　　　3）prod.env.js   ==>  生产环境变量；
　　3、node_modules：npm 加载的项目依赖模块
　　4、src：这里是我们要开发的目录，基本上要做的事情都在这个目录里。里面包含了几个目录及文件：
　　　　1）assets：资源目录，放置一些图片或者公共js、公共css。这里的资源会被webpack构建；
　　　　2）components：组件目录，我们写的组件就放在这个目录里面；
　　　　3）router：前端路由，我们需要配置的路由路径写在index.js里面；
　　　　4）App.vue：根组件；
　　　　5）main.js：入口js文件；
　　5、static：静态资源目录，如图片、字体等。不会被webpack构建
　　6、index.html：首页入口文件，可以添加一些 meta 信息等
　　7、package.json：npm包配置文件，定义了项目的npm脚本，依赖包等信息
　　8、README.md：项目的说明文档，markdown 格式
　　9、.xxxx文件：这些是一些配置文件，包括语法配置，git配置等
```
**四、开始我们的第一个vue项目**

　　1、在components目录下新建一个views目录，里面写我们的vue组件

　　　　1）开始我们的第一个组件：

　　　　a：在views目录下新建First.vue

　　　　b：在router目录下的index.js里面配置路由路径

![image](http://upload-images.jianshu.io/upload_images/6943526-51017a4561f585e7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240) 

　　　　 c：template 写 html，script写 js，style写样式

![image](http://upload-images.jianshu.io/upload_images/6943526-146b540acc9408d4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240) 

　　　　d：输入ip： http://localhost:8010/#/first，查看页面效果

![image](http://upload-images.jianshu.io/upload_images/6943526-bf62e46acfd242b2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240) 

　　　　注意：

　　　　一个组件下只能有一个并列的 div，以下写法是错误：

![image](http://upload-images.jianshu.io/upload_images/6943526-31b626d55a0ea89b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240) 

　　　　数据要写在 return 里面，而不是像文档那样子写，以下写法错误：

![image](http://upload-images.jianshu.io/upload_images/6943526-f0fb366ee4641f3e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240) 

　　2、讲讲父子组件

　　　　1）在components目录下新建sub文件夹，用于存放一下可以复用的子组件。比如新建一个Confirm.vue组件

　　　　![image](http://upload-images.jianshu.io/upload_images/6943526-22e28edca12aa707.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

　　　　3）在父组件中引入子组件

　　　　引入：import Confirm from '../sub/Confirm'

　　　　注册：在`<script></script>`标签内的 name代码块后面加上 components: {Confirm}

　　　　使用：在`<template></template>`内加上<confirm></confirm>

　　　　完整代码：

　　　　![image](http://upload-images.jianshu.io/upload_images/6943526-afb4cd2a2999ee9c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

　　　　2）父子组件通信

　　　　子组件：

　　　　![image](http://upload-images.jianshu.io/upload_images/6943526-780d8b3768449bf3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

　　　　父组件：

　　　　![image](http://upload-images.jianshu.io/upload_images/6943526-05af07b37875ff18.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

 　　3、使用路由搭建单页应用

　　　　1）按照以上方法，新建一个Second.vue组件

　　　　2）路由跳转：<router-link to="/second">去第二个页面</router-link>

　　　　![image](http://upload-images.jianshu.io/upload_images/6943526-1e66aac9fb3b97a0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

　　　　![image](http://upload-images.jianshu.io/upload_images/6943526-2179856c0ef08ea5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

　　　　路由跳转之后，注意观察路径变化：

　　　　![image](http://upload-images.jianshu.io/upload_images/6943526-34935ac557e57341.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

　　　　可以看到，在html中解析成了a标签

　　　　![image](http://upload-images.jianshu.io/upload_images/6943526-f4dd53319c5a6e6b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

　　　　这里只是简单的介绍了一下路由的使用，更多详细信息，请前往官网学习：[https://router.vuejs.org/zh-cn/](https://router.vuejs.org/zh-cn/ "https://router.vuejs.org/zh-cn/")

　　4、如何用less写样式

　　　　1）安装less依赖：npm install less less-loader --save

　　　　![image](http://upload-images.jianshu.io/upload_images/6943526-8423119296a9ad0c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

　　　　安装成功之后，可在package.json中看到，多增加了2个模块：

　　　　![image](http://upload-images.jianshu.io/upload_images/6943526-4386f9f6587fa52a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

　　　　2）编写less

　　　　![image](http://upload-images.jianshu.io/upload_images/6943526-de79447a62296964.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**五、补充**

　　1、解决vue不能自动打开浏览器的问题：当我们输入npm run dev，运行项目，命令行提示我们运行成功，但是浏览器也没有自动打开，只能自己手动输入。

　　解决：

　　　　1）打开config  ==> index.js

![image](http://upload-images.jianshu.io/upload_images/6943526-034bcf5d4e5ee7e2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240) 

　　　　2）module.exports配置中找到autoOpenBrowser，默认设置的是false

　　　　![image](http://upload-images.jianshu.io/upload_images/6943526-c38bbdf472ec978a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

　　　　3）将autoOpenBrowser改为true

　　　　![image](http://upload-images.jianshu.io/upload_images/6943526-c2dee2296bd8e588.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

　　　　4）Ctrl+C，然后我们重启一下，就能自动打开浏览器了

　　　　![image](http://upload-images.jianshu.io/upload_images/6943526-2fb94564ba2435b8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

　　2、为了避免端口冲突，也可以修改port，打开目录同上

![image](http://upload-images.jianshu.io/upload_images/6943526-52b4c335dc496aef.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240) 

　　　　修改成功：

![image](http://upload-images.jianshu.io/upload_images/6943526-e4ef6ecdbe4cf94b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
