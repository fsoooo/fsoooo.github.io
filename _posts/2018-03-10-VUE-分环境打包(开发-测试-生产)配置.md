最近要把Vue项目部署到服务器上，在测试好的项目中执行npm run build就开始打包了。但是每次只能打包到一个环境，不同环境需要配置不同的地址，还得手动更改接口的地址，这给部署带来了极大的不方便。

下面，我们要自己配置命令来实现分环境打包，项目结构如下：![image.png](https://upload-images.jianshu.io/upload_images/6943526-1198aa5b2f09e1af.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

1.在config目录内新建test.env.js文件(要保证和prod.env.js一致)：
```
'use strict'
module.exports = {
    NODE_ENV: '"testing"',
    ENV_CONFIG:'"test"'
}
```
2.修改config内的prod.env.js文件：
```
'use strict'
module.exports = {
   NODE_ENV: '"production"',
   ENV_CONFIG:'"prod"'
}
```
3.在build目录下修改webpack.prod.conf.js：
```
// const env = require('../config/prod.env')  注释这一行
//添加下面几行
if(process.env.NODE_ENV === 'testing') {
    var env = require('../config/test.env')
    console.log("test")
}else{
    var env = require('../config/prod.env')
    console.log("prod")
}
```
4.确认安装cross-env
```
cnpm install cross-env --save-dev 
```
5.修改package.json文件（在script里面添加）：

```
{
  "name": "vue",
  "version": "1.0.0",
  "description": "vue project",
  "author": "David <853020304@qq.com>",
  "scripts": {
    "dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js",
    "build": "node build/build.js",
    "build:report": "npm_config_report=true node build/build.js",
    "lint": "eslint --ext .js,.vue src",
    "build--test": "cross-env NODE_ENV=testing env_config=test node build/build.js",
    "build--prod": "cross-env NODE_ENV=production env_config=prod node build/build.js"
  }
```
6.在放置公共文件的目录下下新建env.js，对环境进行判断并切换，内容如下：
```
/*
 * 配置编译环境和线上环境之间的切换
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * DEBUG: debug状态
 * cancleHTTP: 取消请求头设置
 */
const baseUrl = '';
const routerMode = 'history';
const DEBUG = false;
const cancleHTTP = [];
if (process.env.NODE_ENV == 'development') {
    baseUrl = "http://61.incfotech.com/test";
    DEBUG = true;
}else if(process.env.NODE_ENV == 'testing'){
    baseUrl = "http://61.incfotech.com/test";
    DEBUG = false;
}else if(process.env.NODE_ENV == 'production'){
    baseUrl = "http://www.incfotech.com/hotel";
    DEBUG = false;
}
export{
    baseUrl,
    routerMode,
    DEBUG,
    cancleHTTP
}
```
7.在axios请求接口的文件内引入env.js
```
import axios from 'axios'
import {Message} from 'element-ui'
import store from '../store'
import {getToken, removeToken} from '@/utils/auth'
import {loginUrl} from '@/config/common'
import {baseUrl} from '@/config/env'

// 创建axios实例
const service = axios.create({
    // baseURL: process.env.BASE_API, // api的base_url
    baseURL: baseUrl, // api的base_url
    timeout: 50000, // 请求超时时间
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
    }
})
```
8.配置成功，运行命令如下：
```
测试环境打包，运行：cnpm run build--test
生产环境打包，运行：cnpm run build--prod
```
