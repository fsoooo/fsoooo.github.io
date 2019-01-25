最近公司需要开发酒店客房管理的OTA系统，我们使用 vue.js 2.0 +`ElementUI` 开发时 ， 就遇到了问题 : 一个页面有很多表单 , 我试图将表单写成一个单文件组件 , 但是表单 ( 子组件 ) 里的数据和页面 ( 父组件 ) 按钮交互的时候 , vue 组件之间的通信让我感到崩溃:

```vue
<!--父组件中引入子组件-->
<template>
  <div>
    <a href="javascript:;" @click="show = true">点击</a>
    <t-dialog :show.sync="show"></t-dialog>
  </div>
</template>

<script>
import dialog from './components/dialog.vue'
export default {
  data(){
    return {
      show:false
    }
  },
  components:{
    "t-dialog":dialog
  }
}
</script>

<!--子组件-->
<template>
  <el-dialog :visible.sync="currentShow"></el-dialog>
</template>

<script>
export default {
  props:['show'],
  computed:{
      currentShow:{
          get(){
              return this.show
          },
          set(val){
              this.$emit("update:show",val)
          }
      }
  }
}
</script>
```

之所以这么麻烦 , 是因为父组件可以通过 `props` 给子组件传递参数 , 但子组件内却不能直接修改父组件传过来的参数。

### 使用Vuex解决问题

```vue
<!--父组件中引入子组件-->
<template>
  <div>
    <a href="javascript:;" @click="$store.state.show = true">点击</a>
    <t-dialog></t-dialog>
  </div>
</template>

<script>
import dialog from './components/dialog.vue'
export default {
  components:{
    "t-dialog":dialog
  }
}
</script>


<!--子组件-->
<template>
  <el-dialog :visible.sync="$store.state.show"></el-dialog>
</template>

<script>
export default {}
</script>
```

是不是方便了许多 , 这就是 vuex 最简单的应用 .

## 安装vuex

首先我们在 vue.js 2.0 开发环境中安装 vuex :

```
npm install vuex --save
```

然后 , 在 `main.js` 中加入 :

```
import vuex from 'vuex'
Vue.use(vuex);
var store = new vuex.Store({//store对象
    state:{
        show:false
    }
})
```

再然后 , 在实例化 Vue对象时加入 store 对象 :

```
new Vue({
  el: '#app',
  router,
  store,//使用store
  template: '<App/>',
  components: { App }
})
```

完成到这一步 , 上述例子中的 `$store.state.show` 就可以使用了。

## modules

前面为了方便 , 我们把 store 对象写在了 main.js 里面 , 但实际上为了便于日后的维护 , 我们分开写更好 , 我们在 `src` 目录下 , 新建一个 `store` 文件夹 , 然后在里面新建一个 `index.js` :

```
import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex);

export default new vuex.Store({
    state:{
        show:false
    }
})
```

那么相应的 , 在 main.js 里的代码应该改成 :

```
//vuex
import store from './store'

new Vue({
  el: '#app',
  router,
  store,//使用store
  template: '<App/>',
  components: { App }
})
```

这样就把 store 分离出去了 , 那么还有一个问题是 : 这里 `$store.state.show` 无论哪个组件都可以使用 , 那组件多了之后 , 状态也多了 , 这么多状态都堆在 store 文件夹下的 `index.js` 不好维护怎么办 ?

我们可以使用 vuex 的 `modules` , 把 store 文件夹下的 `index.js` 改成 :

```
import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex);

import dialog_store from '../components/dialog_store.js';//引入某个store对象

export default new vuex.Store({
    modules: {
        dialog: dialog_store
    }
})
```

这里我们引用了一个 `dialog_store.js` , 在这个 js 文件里我们就可以单独写 dialog 组件的状态了 :

```
export default {
    state:{
        show:false
    }
}
```

做出这样的修改之后 , 我们将之前我们使用的 `$store.state.show` 统统改为 `$store.state.dialog.show` 即可。

如果还有其他的组件需要使用 vuex , 就新建一个对应的状态文件 , 然后将他们加入 store 文件夹下的 index.js 文件中的 `modules` 中。

```
modules: {
    dialog: dialog_store,
    other: other,//其他组件
}
```

## mutations

前面我们提到的对话框例子 , 我们对vuex 的依赖仅仅只有一个 `$store.state.dialog.show` 一个状态 , 但是如果我们要进行一个操作 , 需要依赖很多很多个状态 , 那管理起来又麻烦了 !

`mutations` 登场 , 问题迎刃而解 :

```
export default {
    state:{//state
        show:false
    },
    mutations:{
        switch_dialog(state){//这里的state对应着上面这个state
            state.show = state.show?false:true;
            //你还可以在这里执行其他的操作改变state
        }
    }
}
```

使用 mutations 后 , 原先我们的父组件可以改为 :

```
<template>
  <div id="app">
    <a href="javascript:;" @click="$store.commit('switch_dialog')">点击</a>
    <t-dialog></t-dialog>
  </div>
</template>

<script>
import dialog from './components/dialog.vue'
export default {
  components:{
    "t-dialog":dialog
  }
}
</script>
```

使用 `$store.commit('switch_dialog')` 来触发 `mutations` 中的 `switch_dialog` 方法。

这里需要注意的是:

1. `mutations` 中的方法是不分组件的 , 假如你在 dialog_stroe.js 文件中的定义了
   `switch_dialog` 方法 , 在其他文件中的一个 `switch_dialog` 方法 , 那么
   `$store.commit('switch_dialog')` 会执行所有的 `switch_dialog` 方法。
2. `mutations`里的操作必须是同步的。

你一定好奇 , 如果在 `mutations` 里执行异步操作会发生什么事情 , 实际上并不会发生什么奇怪的事情 , 只是官方推荐 , 不要在 `mutationss` 里执行异步操作而已。

## actions

多个 `state` 的操作 , 使用 `mutations` 会来触发会比较好维护 , 那么需要执行多个 mutations 就需要用 `action` 了:

```
export default {
    state:{//state
        show:false
    },
    mutations:{
        switch_dialog(state){//这里的state对应着上面这个state
            state.show = state.show?false:true;
            //你还可以在这里执行其他的操作改变state
        }
    },
    actions:{
        switch_dialog(context){//这里的context和我们使用的$store拥有相同的对象和方法
            context.commit('switch_dialog');
            //你还可以在这里触发其他的mutations方法
        },
    }
}
```

那么 , 在之前的父组件中 , 我们需要做修改 , 来触发 action 里的 switch_dialog 方法:

```
<template>
  <div id="app">
    <a href="javascript:;" @click="$store.dispatch('switch_dialog')">点击</a>
    <t-dialog></t-dialog>
  </div>
</template>

<script>
import dialog from './components/dialog.vue'
export default {
  components:{
    "t-dialog":dialog
  }
}
</script>
```

使用 `$store.dispatch('switch_dialog')` 来触发 `action` 中的 `switch_dialog` 方法。

官方推荐 , 将异步操作放在 action 中。

## getters

`getters` 和 vue 中的 `computed` 类似 , 都是用来计算 state 然后生成新的数据 ( 状态 ) 的。

还是前面的例子 , 假如我们需要一个与状态 `show` 刚好相反的状态 , 使用 vue 中的 `computed` 可以这样算出来 :

```
computed(){
    not_show(){
        return !this.$store.state.dialog.show;
    }
}
```

那么 , 如果很多很多个组件中都需要用到这个与 show 刚好相反的状态 , 那么我们需要写很多很多个 `not_show` , 使用 `getters` 就可以解决这种问题 :

```
export default {
    state:{//state
        show:false
    },
    getters:{
        not_show(state){//这里的state对应着上面这个state
            return !state.show;
        }
    },
    mutations:{
        switch_dialog(state){//这里的state对应着上面这个state
            state.show = state.show?false:true;
            //你还可以在这里执行其他的操作改变state
        }
    },
    actions:{
        switch_dialog(context){//这里的context和我们使用的$store拥有相同的对象和方法
            context.commit('switch_dialog');
            //你还可以在这里触发其他的mutations方法
        },
    }
}
```

我们在组件中使用 `$store.state.dialog.show` 来获得状态 `show` , 类似的 , 我们可以使用 `$store.getters.not_show` 来获得状态 `not_show` 。

注意 : `$store.getters.not_show` 的值是不能直接修改的 , 需要对应的 state 发生变化才能修改。

## mapState、mapGetters、mapActions

很多时候 , `$store.state.dialog.show` 、`$store.dispatch('switch_dialog')` 这种写法又长又臭 , 很不方便 , 我们没使用 vuex 的时候 , 获取一个状态只需要 `this.show` , 执行一个方法只需要 `this.switch_dialog` 就行了 , 使用 vuex 使写法变复杂了 ?

使用 `mapState、mapGetters、mapActions` 就不会这么复杂了。

以 mapState 为例 :

```
<template>
  <el-dialog :visible.sync="show"></el-dialog>
</template>

<script>
import {mapState} from 'vuex';
export default {
  computed:{

    //这里的三点叫做 : 扩展运算符
    ...mapState({
      show:state=>state.dialog.show
    }),
  }
}
</script>
```

相当于 :

```
<template>
  <el-dialog :visible.sync="show"></el-dialog>
</template>

<script>
import {mapState} from 'vuex';
export default {
  computed:{
    show(){
        return this.$store.state.dialog.show;
    }
  }
}
</script>
```

mapGetters、mapActions 和 mapState 类似 , `mapGetters` 一般也写在 `computed` 中 , `mapActions` 一般写在 `methods`中。



# vue子组件改变父组件数据的两种方法

#### 如何在子组件中修改父组件的值

##### 第一步：首先得保证父组件中有值

这是userManage.vue

```
data（）{
    return{
        dialogCreate:'false'
    }
}
```

##### 第二步：在父组件中引用子组件

```
import Form from './userCreate'
```

##### 第三步：父组件中注册子组件并引用

```
<template>
    <app-form></app-form>
</template>

<script>
    export default{
        name:'user',
        components:{
            "app-form":Form
        },
        data（）{
            return{
                dialogCreate:'false'
            }
        }
    }
</script>
```

##### 第四步：把父组件的值绑定给子组件上

```
<app-form v-bind:dialogCreate = "dialogCreate" ></app-form>
```

##### 第五步：既然父组件把值给了子组件了，子组件得接受和用吧

子组件

```
1.先接受
export default{
    props:['dialogCreate']
}
2.就可以直接在自组建中用了
<p>{{dialogCreate}}</p>
```

##### 第六步：向父组件发射一个方法

比如我们在后台数据接收成功时，告诉父组件已经成功

```
this.$emit('success',false);
```

##### 第七步：父组件接收到这个方法并且执行改变父组件的值

```
<app-form v-bind:dialogCreate = "dialogCreate" v-on:success="success(res)"></app-form>

methods: {
     check(){
         alert(1);
     },
     success(res){
        this.dialogCreate = res;
     }
}
```

#### 

方法一

子组件代码

```
<template>
    <div @click="open"></div>
</template>

methods: {
   open() {
        this.$emit('showbox',true); //触发showbox方法，true为向父组件传递的数据
    }
}
```

父组件

```
<child @showbox="toshow" :msg="msg"></child> //监听子组件触发的showbox事件,然后调用toshow方法
<div>{{ msg }}</div>
data () {
    return {
      msg: false,
    }
}，
methods: {
    toshow(msg) {
        this.msg = msg;
    }
}
```

#### 方法二

这个方法不用在父组件那里写自定义事件，对于处理一些小数据简单易用，推荐方法一（毕竟更形象直观） 
子组件代码

```
<template>
    <div @click="open"></div>
</template>
methods: {
   open() {
        this.$emit('updata:mag',true); //触发showbox方法，true为向父组件传递的数据
    }
}
```

父组件

```
<child :msg="msg"></child> //监听子组件触发的showbox事件,然后调用toshow方法
<div>{{ msg }}</div>
data () {
    return {
      msg: false,
    }
}，
methods: {
    toshow(msg) {
        this.msg = msg;
    }
}
```



