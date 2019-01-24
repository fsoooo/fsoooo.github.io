最近在研究小程序和vue，发现vue和小程序很多地方都很相似，但是vue的双向数据绑定却比小程序的单向数据绑定好用，慢慢的还发现了其他的异同点，于是整理了这篇文章。

# 一.生命周期

#### [vue生命周期]( https://www.jianshu.com/p/49563e2ad40b)

#### [小程序生命周期]( https://www.jianshu.com/p/3c045cadda20)

- 生命周期：小程序的生命周期分为 应用的生命周期和页面生命周期。
- 钩子函数：相比之下，`小程序`的钩子函数要简单得多。`vue`的钩子函数在跳转新页面时，钩子函数都会触发，但是`小程序`的钩子函数，页面不同的跳转方式，触发的钩子并不一样。

- 数据请求:在页面加载请求数据时，两者钩子的使用有些类似，`vue`一般会在`created`或者`mounted`中请求数据，而在`小程序`，会在`onLoad`或者`onShow`中请求数据。

# 二.数据绑定

### 使用规则

`VUE`:vue动态绑定一个变量的值为元素的某个属性的时候，会在变量前面加上冒号：

```
<img :src="imgSrc"/>
```

`小程序`：绑定某个变量的值为元素属性时，会用两个大括号括起来，如果不加括号，为被认为是字符串。

```
<image src="{{imgSrc}}"></image>
```

### 数据双向绑定

#### 1.设置值

在`vue`中,只需要再`表单`元素上加上`v-model`,然后再绑定`data`中对应的一个值，当表单元素内容发生变化时，`data`中对应的值也会相应改变，这是`vue`非常nice的一点。

```
<div id="app">
    <input v-model="reason" placeholder="填写理由" class='reason'/>
</div>

new Vue({
  el: '#app',
  data: {
   reason:''
  }
})
```

但是在`小程序`中，却没有这个功能。那怎么办呢？
当表单内容发生变化时，会触发表单元素上绑定的方法，然后在该方法中，通过`this.setData({key:value})`来将表单上的值赋值给`data`中的对应值。
下面是代码，可以感受一下:

```
<input bindinput="bindReason" placeholder="填写理由" class='reason' value='{{reason}}' name="reason" />

Page({
data:{
    reason:''
},
bindReason(e) {
    this.setData({
      reason: e.detail.value
    })
  }
})
```

当页面表单元素很多的时候，更改值就是一件体力活了。和`小程序`一比较，`vue`的`v-model`简直爽的不要不要的。

#### 2.取值

`vue`中，通过`this.reason`取值

`小程序`中，通过`this.data.reason`取值

# 三.页面

#### 1.页面渲染

**vue：**

```
<ul id="example-1">
  <li v-for="item in items">
    {{ item.message }}
  </li>
</ul>

var example1 = new Vue({
  el: '#example-1',
  data: {
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})
```

**小程序：**

```
Page({
  data: {
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})

<text wx:for="{{items}}">{{item}}</text>
```

#### 2.显示与隐藏元素

`vue`中，使用`v-if` 和`v-show`控制元素的显示和隐藏

`小程序`中，使用`wx-if`和`hidden`控制元素的显示和隐藏

# 四.事件

`vue`：使用`v-on:event`绑定事件，（v-on：事件名字='回调函数名'）或者使用`@event`绑定事件,例如:

```
<button v-on:click="counter += 1">Add 1</button>
<button v-on:click.stop="counter+=1">Add1</button>  //阻止事件冒泡
```

`小程序`中，全用`bindtap(bind+event)`，或者`catchtap(catch+event)`绑定事件,例如：

```
<button bindtap="noWork">明天不上班</button>
<button catchtap="noWork">明天不上班</button>  //阻止事件冒泡
```

小程序以bin或catch开头，后面跟着事件类型，例如bindtap、catchtouchstart。自基础库版本1.5.0起，bind和catch后可以紧跟一个冒号，其含义不变，如bind:tap、catch:touchstart。同时bind和catch·前还可以加上capture-来表示捕获阶段。bind事件绑定不会阻止冒泡事件向上冒泡，catch事件绑定可以阻止冒泡事件向上冒泡。

#### 绑定事件传参

在`vue`中，绑定事件传参挺简单，只需要在触发事件的方法中，把需要传递的数据作为形参传入就可以了，例如：

```
<button @click="say('明天不上班')"></button>

new Vue({
  el: '#app',
  methods:{
    say(arg){
    consloe.log(arg)
    }
  }
})
```

在`小程序`中，不能直接在绑定事件的方法中传入参数，需要将参数作为属性值，绑定到元素上的`data-`属性上，然后在方法中，通过`e.currentTarget.dataset.*`的方式获取，从而完成参数的传递，很麻烦有没有...

```
<view class='tr' bindtap='toApprove' data-id="{{item.id}}"></view>
Page({
data:{
    reason:''
},
toApprove(e) {
    let id = e.currentTarget.dataset.id;
  }
})
```

# 五.组件

### 1.子组件的使用

在`vue`中，需要：

1. 编写子组件
2. 在需要使用的父组件中通过`import`引入
3. 在`vue`的`components`中注册
4. 在模板中使用

```
//子组件 bar.vue
<template>
  <div class="search-box">
    <div @click="say" :title="title" class="icon-dismiss"></div>
  </div>
</template>
<script>
export default{
props:{
    title:{
       type:String,
       default:''
      }
    }
},
methods:{
    say(){
       console.log('明天不上班');
       this.$emit('helloWorld')
    }
}
</script>

// 父组件 foo.vue
<template>
  <div class="container">
    <bar :title="title" @helloWorld="helloWorld"></bar>
  </div>
</template>

<script>
import Bar from './bar.vue'
export default{
data:{
    title:"我是标题"
},
methods:{
    helloWorld(){
        console.log('我接收到子组件传递的事件了')
    }
},
components:{
    Bar
}
</script>
```

在`小程序`中，需要：

1. 编写子组件

2. 在子组件的`json`文件中，将该文件声明为组件

   ```
   {
     "component": true
   }
   ```

3. 在需要引入的父组件的`json`文件中，在`usingComponents`填写引入组件的组件名以及路径

   ```
   "usingComponents": {
       "tab-bar": "../../components/tabBar/tabBar"
     }
   ```

4. 在父组件中，直接引入即可

   ```
   <tab-bar currentpage="index"></tab-bar>
   ```

   具体代码:

   ```
   // 子组件
   <!--components/tabBar/tabBar.wxml-->
   <view class='tabbar-wrapper'>
     <view class='left-bar {{currentpage==="index"?"active":""}}' bindtap='jumpToIndex'>
       <text class='iconfont icon-shouye'></text>
       <view>首页</view>
     </view>
     <view class='right-bar {{currentpage==="setting"?"active":""}}' bindtap='jumpToSetting'>
       <text class='iconfont icon-shezhi'></text>
       <view>设置</view>
     </view>
   </view>
   ```


### 2.父子组件间通信

#### **在vue中**

父组件向子组件传递数据，只需要在子组件通过`v-bind`传入一个值，在子组件中，通过`props`接收，即可完成数据的传递，示例:

```
// 父组件 foo.vue
<template>
  <div class="container">
    <bar :title="title"></bar>
  </div>
</template>
<script>
import Bar from './bar.vue'
export default{
data:{
    title:"我是标题"
},
components:{
    Bar
}
</script>

// 子组件bar.vue
<template>
  <div class="search-box">
    <div :title="title" ></div>
  </div>
</template>
<script>
export default{
props:{
    title:{
       type:String,
       default:''
      }
    }
}
</script>
```

子组件和父组件通信可以通过`this.$emit`将方法和数据传递给父组件。

#### **在小程序中**

父组件向子组件通信和`vue`类似，但是`小程序`没有通过`v-bind`，而是直接将值赋值给一个变量，如下：

```
<tab-bar currentpage="index"></tab-bar>

此处， “index”就是要向子组件传递的值
```

在子组件`properties`中，接收传递的值

```
properties: {
    // 弹窗标题
    currentpage: {            // 属性名
      type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: 'index'     // 属性初始值（可选），如果未指定则会根据类型选择一个
    }
  }
```

子组件向父组件通信和`vue`也很类似，代码如下:

```
//子组件中
methods: {   
    // 传递给父组件
    cancelBut: function (e) {
      var that = this;
      var myEventDetail = { pickerShow: false, type: 'cancel' } // detail对象，提供给事件监听函数
      this.triggerEvent('myevent', myEventDetail) //myevent自定义名称事件，父组件中使用
    },
}

//父组件中
<bar bind:myevent="toggleToast"></bar>

// 获取子组件信息
toggleToast(e){
    console.log(e.detail)
}
```

#### 如果父组件想要调用子组件的方法

`vue`会给子组件添加一个`ref`属性，通过`this.$refs.ref的值`便可以获取到该子组件，然后便可以调用子组件中的任意方法，例如：

```
//子组件
<bar ref="bar"></bar>

//父组件
this.$ref.bar.子组件的方法
```

`小程序`是给子组件添加`id`或者`class`，然后通过`this.selectComponent`找到子组件，然后再调用子组件的方法,示例：

```
//子组件
<bar id="bar"></bar>

// 父组件
this.selectComponent('#id').syaHello()
```

#### 3.小程序中的模板和vue中的组件异同

**小程序**
定义模板：`<template name="模板名字">中间很多想要的wxml</template>`，该模板也是.wxml文件

```
<template name="movieTemplate">
  <view class='movie-container' bindtap='onMovieDetail' data-id='{{movieId}}'>
    <view class='movie'>
      <image src="{{imageUrl}}" class="movie-img"></image>
      <text>{{title}}</text>
    </view>
  </view>
</template>
```

使用模板：只需要在文件顶部引用<import src='相对路径或绝对路径/xx.wxml/>' ,正文中添加 <template is="模板名字"/>

```
<import src='./movie/movieTemplate.wxml' />
 <template is="moreMovieTemplate" data="{{moreMovieList}}"/>
```

**Vue中的组件**
在js中定义，例如

```
Vue.component('my-component', {
  template: '<p class="foo bar">Hi</p>'
})
```

应用组件，在html中引入

```
<my-component class="baz boo"></my-component>
```

等号后面绑定的变量或者js表达式，均在data中初始化定义，对于js表达式，可以直接在等号后面写
