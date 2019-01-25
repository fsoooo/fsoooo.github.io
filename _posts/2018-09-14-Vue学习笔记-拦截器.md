
- **拦截器：** 对特定的http请求或响应消息或请求头进行验证，拦截不合法的http交互以保证web环境的安全。
- 拦截器起一个拦截作用拦，在请求接口时，多一次或多次验证。例如：你写了几个请求数据的接口，开启服务后，用户没登录直接访问这些接口，也是可以拿到数据的，但这就违背了后台管理系统必须先登录的原则，一些不良用心的人就会利用这个漏洞来窃取你的数据库数据了。这时就需要到拦截器了。
- 前后台交互一定要遵循一个原则：**互不信任原则**。前端发送到后台的参数（必须在前端验证合法的才能发送），后台必须验证是否合法（是否符合该参数的原定数据类型和值范围），后台返回给前端的数据，也必须验证是否为约定的数据结构和值类型。

## 拦截器原理和实现

- 这里引用第三方的ajax库 –> axios
- **axios：** 基于ES6新语法promise的一个前端ajax库 

```
    // http请求拦截
    axios.interceptors.request.use(config => {
        if (config.method == 'post' && config.url != '/login') {
            config.data = {
                ...config.data,
                ...{"user": "admin"},
                ...{ "datetime": new Date() }
            }
        } else if (config.method == 'get') {
            if (/\?/.test(config.url)) {
                config.url += 'user=admin&datetime=' + new Date();
            } else {
                config.url += '?user=admin&datetime=' + new Date();
            }
        }
        return config;
    });
    // http响应拦截
    axios.interceptors.response.use(response => {
        switch (response.data.requestIntercept) {
            case 1:
                console.log('登录信息已失效，请重新登录！');
        }
        return response;
    });
```

- 这个示例中设置了前端向服务端发起请求时的http请求拦截和服务端返回数据时的http响应拦截。
- interceptors是axios的一个拦截器对象，axios.interceptors.request是对http请求拦截配置的对象，这里我设置了给每个请求添加一个系统当前的时间和一个用户名（实际项目中添加用户名变量），这样可以避免get请求出现304，并且每次发起请求都向服务器发送一次用户名。
- axios.interceptors.response是对http响应拦截配置的对象，这里如果服务器返回json为{requestIntercept: 1}，则判定服务器拒绝了页面的http请求的执行，直接返回一个状态提示，否则就返回正常的 response。
- 前端这样设置了拦截器就一劳永逸了吗？当然不是的，前端的永远不是安全的

## 安全级别的拦截器 —- nodejs服务端的拦截器原理和实现

- **nodejs：** 基于谷歌V8引擎，使用javascript编程实现的一个web服务端编程语言 
- 服务端的拦截器才是安全的，先看下面这段简单的拦截器代码，主要拦截的是没有用户名或有用户名但在服务端没有对应的session的http请求

```js
    // 拦截器
    app.all('/*', function (req, res, next) {
        if (req.url == '/login') {
            next();
        } else {
            if (req.method == "GET") {
                username = req.query.user;
            } else if (req.method == "POST") {
                username = req.body.user;
            }
            if (sessionPool[username] && getSid(res.req.headers.cookie) == sessionPool[username]) {
                // 用户session存在
                next();
            } else {
                res.json({ requestIntercept: 1 });  // 页面拿到这个值在做拦截处理即可
            }
        }
    });
```

- app.all(‘/*’)，这里的app是 express() 对象，app.all() 是针对所有的http请求， ‘/*’匹配的是所有以“/”开头的http请求，后面执行的实际上相当于是一个接口，三个参数分别是request,response,next，其中next是拦截器通过的回调函数
- 这里的思路就是先判断请求是否为登录接口，不是的话就取出请求中的user参数，用这个user去验证两边的cookie是否相同，若不同则直接返回{ requestIntercept: 1 }这个json，告诉前端验证不通过；验证通过的调用next()回调函数进入下一个处理环节 — 数据读取接口

## 完整的前后端交互拦截器示例：

- 完整的拦截器设置：（以 `/getlist` 接口为例）
  1. 前端发起`/getlist` 接口的http请求，拦截并验证请求
  2. 服务端通过app.all(‘/*’)，匹配到`/getlist` 接口是 `/*` 开头的请求，立即拦截`/getlist` 接口的http请求并验证
  3. 验证通过后，调用next()方法将后续处理交给 `app.('/getlist')` 处理
  4. `app.('/getlist')` 处理完成后返回数据给前端
  5. 前端验证返回的json数据是不是{requestIntercept: 1}，若不是则交给 `axios.post('/getList').then()` 处理，至此一次http请求完成，若返回的json数据是{requestIntercept: 1}，那么在 `axios.interceptors.response` 就会被拦截，同时会告知`axios.post('/getList')` 对象将promise对象的状态由 `pending`(promise正在异步执行中) 改为 `resolved`(promise执行完毕)
- 前端: login.vue

```vue
 <template>
        <div id="app" class="login-form">
            <input type="username" v-model="user">
            <input type="password" v-model="pwd">
            <input type="button" value="登录" @click="login">
            <input type="button" value="获取数据" @click="getList">
            <input type="button" value="注销" @click="logout">
        </div>
</template>
     
        <script type='text/javascript'>
            // http请求拦截
            axios.interceptors.request.use(config => {
                if (config.method == 'post' && config.url != '/login') {
                    config.data = {
                        ...config.data,
                        ...{ "user": "admin" }
                    }
                } else if (config.method == 'get') {
                    if (/\?/.test(config.url)) {
                        config.url += 'user=admin'
                    } else {
                        config.url += '?user=admin'
                    }
                }
                return config;
            });

            // http响应拦截
            axios.interceptors.response.use(response => {
                switch (response.data.requestIntercept) {
                    case 1:
                        console.log('登录信息已失效，请重新登录！');
                }
                return response;
            });
            let Vm = new Vue({
                el: '#app',
                data() {
                    return {
                        user: 'admin',
                        pwd: 'admin'
                    }
                },
                methods: {
                    login() {
                        const that = this;
                        axios.post('/login', {
                            "user": that.user,
                            "pwd": that.pwd
                        }).then((res) => {
                            console.log(res.data);
                            if (res.data.status == 1) {
                                alert('登陆成功！');
                            }
                        }).catch((err) => {
                            console.log('出错了-,-！', err);
                        })
                    },
                    getList() {
                        axios.post('/getList', {
                            // "user": "admin"
                        }).then((res) => {
                            console.log(res.data);
                        }).catch((err) => {
                            console.log('出错了-,-！', err);
                        })
                    },
                    logout() {
                        axios.post('/logout', {
                            // "user": "admin"
                        }).then((res) => {
                            console.log(res.data);
                            if (res.data.logout == 1) {
                                alert('注销成功');
                            }
                        }).catch((err) => {
                            console.log('出错了-,-！', err);
                        })
                    }
                }
            })
        </script>
        
        <style>
            * {
                margin: 0;
                padding: 0;
            }
            input {
                -web-kit-appearance: none;
                -moz-appearance: none;
                font-size: 1.4em;
                height: 2em;
                margin: 0.5em 0;
                border-radius: 4px;
                border: 1px solid #c8cccf;
                color: #6a6f77;
                outline: 0;
            }
            input:focus {
                border: 1px solid #ff7496;
            }
            input[type="button"]:focus {
                background-color: #999999;
            }
            .login-form {
                width: 25%;
                margin: 100px auto;
                line-height: 3em;
            }
            .login-form input,
            .login-form button {
                width: 100%;
            }
        </style>
```

- 服务端：app.js

```js
    const express = require('express');
    const bodyParser = require('body-parser');
    const fs = require('fs');
    const path = require('path');
    const mysql = require('mysql');

    const app = express();
    app.use(express.static(path.resolve(__dirname, './www')));  // 默认首页为www下的index.html
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extend: true }));

    const sessionPool = {};

    const pool = mysql.createPool({
        host: 'mysql数据库IP',
        user: 'mysql连接用户，最高权限用户为root',
        password: '填写你的密码',
        port: '数据库端口，默认3306',
        database: '使用的mysql数据库名',
        multipleStatements: true
    });

    // 拦截器
    app.all('/*', function (req, res, next) {
        let url = req.url;
        if (url == '/login') {
            next();
        } else {
            if (req.method == "GET") {
                username = req.query.user;
            } else if (req.method == "POST") {
                username = req.body.user;
            }
            if (sessionPool[username] && getSid(res.req.headers.cookie) == sessionPool[username]) {
                // 用户session存在
                next();
            } else {
                res.json({ requestIntercept: 1 });  // 页面拿到这个值在做拦截处理即可
            }
        }
    });

    // 请求错误
    app.get('/error', function (req, res) {
        res.send(fs.readFileSync(path.resolve(__dirname, './www/error.html'), 'utf-8'))
    });

    // 测试接口
    app.get('/', function (req, res) {
        res.json({ test: `测试服务器正常！` });
    })

    // 登录接口
    app.post('/login', function (req, res) {
        // 判断是否已在线
        if (sessionPool[req.body.user]) {
            // 在线
            delete sessionPool[req.body.user];
        }
        // 使用数据库连接池
        pool.getConnection(function (err, connection) {
            // 多语句查询示例
            connection.query("select * from userlist where username = '" + req.body.user + "' and password = '" + req.body.pwd + "' and delMark = '0'; select count(1) from userlist", function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    if (rows[0].length > 0) {
                        // 设置cookie
                        let cookieSid = req.body.user + Date.parse(new Date());
                        res.setHeader("Set-Cookie", ["sid=" + cookieSid + ";path=/;expires=" + new Date("2030")]);
                        // 先存储session到sessionPool
                        sessionPool[req.body.user] = cookieSid;
                        // 返回登录成功的信息
                        res.json({ status: 1, dbData: rows[0], session: req.session });
                        res.end();
                    } else {
                        // 用户不存在
                        res.json({ status: 0 });
                        res.end();
                    }
                }
            });
            // 释放本次连接
            connection.release();
        });
    })

    // 退出登录
    app.post('/logout', function (req, res) {
        delete sessionPool[req.body.user];
        res.json({ logout: 1 });
        res.end();
    })

    app.post('/getList', function (req, res) {
        pool.getConnection(function (err, connection) {
            connection.query('select * from userlist', function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    res.json({ list: rows });
                    res.end();
                }
            });
            connection.release();
        })
        console.log('session池 ', sessionPool);
    });

    app.listen(8000, function () {
        console.log('ssh@git 0.0.0.0:8000 succeed');
    })

    /*
    * 公共方法
    */

    // 解析cookie中的sid
    function getSid(cookieStr) {
        let sid = '', cookieArr = cookieStr.split(';');
        for (let i = 0; i < cookieArr.length; i++) {
            if (cookieArr[i].trim().substring(0, 3) == 'sid') {
                return sid = cookieArr[i].trim().substring(4, cookieArr[i].length);
            }
        }
        return sid;
    }
```
