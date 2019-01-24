## Vue.js路由(Vue-router)

## 1.路由安装

#### （1）直接引入
```
<script src="vue.js"></script>
<script src="vue-router.js"></script>
```

#### （2）npm下载

> npm install vue-router

如果在一个模块化工程中使用它，必须要通过 Vue.use() 明确地安装路由功能：
在你的文件夹下的 src 文件夹下的 main.js 文件内写入以下代码

```
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
```

## 2.开始使用

引入Vue和VueRouter插件

```
<script src="vue.js"></script>
<script src="vue-router.js"></script>
```

书写html

```
<div id="box"> 
</div>
<!--定义模版-->
<template id="a">
    <div>
        第一个router
    </div>
</template>
<template id="b">
    <div>
        第二个router
    </div>
</template>
```

书写js

```
var routes = [
    {
        path:"/one",
        component:{template:"#a"}
    },
    {
        path:"/two",
        component:{template:"#b"}
    },
];
// 定义路由组件
var router = new VueRouter({
    routes
});
// 定义路由
new Vue({
    el:"#box",
    router
});
// 创建和挂载实例
```
将模版增添链接

```
<div id="box"> 
    <router-link to="/one">One</router-link>
    <router-link to="/two">Two</router-link>
    <router-view></router-view>
</div>
```
> < router-link > 默认会被渲染成一个 `<a>` 标签 >>>to=""为我们定义的路由
>
> < router-view > 路由匹配到的组件将渲染在这里

## 动态路由匹配

我们经常需要把某种模式匹配到的所有路由，全都映射到同个组件。例如，我们有一个 User 组件，对于所有 ID 各不相同的用户，都要使用这个组件来渲染。那么，我们可以在 vue-router 的路由路径中使用『动态路径参数』（dynamic segment）来达到这个效果：

```
{
    path:"/two:id",
    component:{template:"#b"},
},
```

当我们在地址后面直接添加任意字符,我们会发现文档内容随着我们的更改而改变.

## 嵌套路由

我们经常将动态路由和嵌套路由共同使用,嵌套路由即是在原路由的基础上增加一个 children ,children 是一个数组.并且我们还需要在原来的组件上添加< router-view >来渲染 chlidren 里面的路由.

```
<template id="b">
    <div>
        第二个router
        <router-view>        
        </router-view> 
    </div>
</template>
<template id="c">
    <div>
        user:{{ $route.params.id }}
    </div>
</template>
{
    path:"/two",
    component:{template:"#b"},
    children:[
        {
            path:":id",
            component:{
                template:"#c"
            }
        }
    ]
},
```

## 编程式导航
除了使用 <router-link> 创建 a 标签来定义导航链接，我们还可以借助 router 的实例方法，通过编写代码来实现。
> router.push(location)

想要导航到不同的 URL，则使用 router.push 方法。这个方法会向 history 栈添加一个新的记录，所以，当用户点击浏览器后退按钮时，则回到之前的 URL。

当你点击 <router-link> 时，这个方法会在内部调用，所以说，点击 <router-link :to="..."> 等同于调用 router.push(...)。

该方法的参数可以是一个字符串路径，或者一个描述地址的对象。例如：

```
// 字符串
router.push('home')
// 对象
router.push({ path: 'home' })
// 命名的路由
router.push({ name: 'user', params: { userId: 123 }})
// 带查询参数，变成 /register?plan=private
router.push({ path: 'register', query: { plan: 'private' }})
```

> router.replace(location)

跟 router.push 很像，唯一的不同就是，它不会向 history 添加新记录，而是跟它的方法名一样 —— 替换掉当前的 history 记录。

> router.go(n)

这个方法的参数是一个整数，意思是在 history 记录中向前或者后退多少步，类似 window.history.go(n)。

```
// 在浏览器记录中前进一步，等同于 history.forward()
router.go(1)
// 后退一步记录，等同于 history.back()
router.go(-1)
// 前进 3 步记录
router.go(3)
// 如果 history 记录不够用，那就默默地失败呗
router.go(-100)
router.go(100)
```

## 命名路由
有时我们通过一个名称来标识一个路由显得更方便一些，特别是在链接一个路由，或者是执行一些跳转的时候。你可以在创建 Router 实例的时候，在 routes 配置中给某个路由设置名称。
我们直接在路由下添加一个 name 即可.

```
var routes = [
    {
        path:"/one",
        name:"one",
        component:{template:"#a"}
    },
    {
        path:"/two",
        name:"two",
        component:{template:"#b"},
    },
]
```

要链接到一个命名路由，可以给 router-link 的 to 属性传一个对象：

```
<router-link :to="{ name: 'one'}">User</router-link>
<router-link :to="{ name: 'two'}">User</router-link>
```
## 命名视图
有时候想同时（同级）展示多个视图，而不是嵌套展示，例如创建一个布局，有 sidebar（侧导航） 和 main（主内容） 两个视图，这个时候命名视图就派上用场了。你可以在界面中拥有多个单独命名的视图，而不是只有一个单独的出口。如果 router-view 没有设置名字，那么默认为 default。
```
    <router-view></router-view>
    <router-view></router-view>
```

当我们的视图如上时,我们会发现每一个路由被渲染了两次,所以我们需要为视图命名

```
    <router-view name="a"></router-view>
    <router-view name="b"></router-view>
var Foo = { template: '<div>foo</div>' }
var Bar = { template: '<div>bar</div>' }
var routes = [
        {
            path:"/one",
            name:"one",
            components:{
                a:Foo,
                b:Bar
            }
        },
    ]
```
## 重定向和别名
### 重定向
重定向(Redirect)就是通过各种方法将各种网络请求重新定个方向转到其它位置,用于网站调整或网页被移到一个新地址,它也是通过 routes 配置来完成，下面例子是从 /a 重定向到 /b：
```
var router = new VueRouter({
  routes: [
    { path: '/a', redirect: '/b' }
  ]
})
```

### 别名
/a 的别名是 /b，意味着，当用户访问 /b 时，URL 会保持为 /b，但是路由匹配则为 /a，就像用户访问 /a 一样。简单的说就是给 /a 起了一个外号叫做 /b ,但是本质上还是 /a
上面对应的路由配置为：
```
var router = new VueRouter({
  routes: [
    { path: '/a', component: A, alias: '/b' }
  ]
})
```
『别名』的功能让你可以自由地将 UI 结构映射到任意的 URL，而不是受限于配置的嵌套路由结构。
