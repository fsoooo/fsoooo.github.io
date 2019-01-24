## vue生命周期简介

![![生命周期详解.png](https://upload-images.jianshu.io/upload_images/6943526-b0f215dcc71c4e74.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
](https://upload-images.jianshu.io/upload_images/6943526-e7b5e7fb65938044.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)




## 生命周期探究

```
<template>
    <div id="app">
         <p>{{ message }}</p>
    </div>
</template>

<script type="text/javascript">
  var app = new Vue({
      el: '#app',
      data: {
          message : "xuxiao is boy" 
      },
       beforeCreate: function () {
                console.group('beforeCreate 创建前状态===============》');
               console.log("%c%s", "color:red" , "el     : " + this.$el); //undefined
               console.log("%c%s", "color:red","data   : " + this.$data); //undefined 
               console.log("%c%s", "color:red","message: " + this.message)  
        },
        created: function () {
            console.group('created 创建完毕状态===============》');
            console.log("%c%s", "color:red","el     : " + this.$el); //undefined
               console.log("%c%s", "color:red","data   : " + this.$data); //已被初始化 
               console.log("%c%s", "color:red","message: " + this.message); //已被初始化
        },
        beforeMount: function () {
            console.group('beforeMount 挂载前状态===============》');
            console.log("%c%s", "color:red","el     : " + (this.$el)); //已被初始化
            console.log(this.$el);
               console.log("%c%s", "color:red","data   : " + this.$data); //已被初始化  
               console.log("%c%s", "color:red","message: " + this.message); //已被初始化  
        },
        mounted: function () {
            console.group('mounted 挂载结束状态===============》');
            console.log("%c%s", "color:red","el     : " + this.$el); //已被初始化
            console.log(this.$el);    
               console.log("%c%s", "color:red","data   : " + this.$data); //已被初始化
               console.log("%c%s", "color:red","message: " + this.message); //已被初始化 
        },
        beforeUpdate: function () {
            console.group('beforeUpdate 更新前状态===============》');
            console.log("%c%s", "color:red","el     : " + this.$el);
            console.log(this.$el);   
               console.log("%c%s", "color:red","data   : " + this.$data); 
               console.log("%c%s", "color:red","message: " + this.message); 
        },
        updated: function () {
            console.group('updated 更新完成状态===============》');
            console.log("%c%s", "color:red","el     : " + this.$el);
            console.log(this.$el); 
               console.log("%c%s", "color:red","data   : " + this.$data); 
               console.log("%c%s", "color:red","message: " + this.message); 
        },
        beforeDestroy: function () {
            console.group('beforeDestroy 销毁前状态===============》');
            console.log("%c%s", "color:red","el     : " + this.$el);
            console.log(this.$el);    
               console.log("%c%s", "color:red","data   : " + this.$data); 
               console.log("%c%s", "color:red","message: " + this.message); 
        },
        destroyed: function () {
            console.group('destroyed 销毁完成状态===============》');
            console.log("%c%s", "color:red","el     : " + this.$el);
            console.log(this.$el);  
               console.log("%c%s", "color:red","data   : " + this.$data); 
               console.log("%c%s", "color:red","message: " + this.message)
        }
    })
</script>
```

### create 和 mounted 相关

> ```
> beforecreated：el 和 data 并未初始化
> ```
>
> ```
> created:完成了 data 数据的初始化，el没有
> ```
>
> ```
> beforeMount：完成了 el 和 data 初始化
> ```
>
> ```
> mounted：完成挂载
> ```
>

![示例.png](https://upload-images.jianshu.io/upload_images/6943526-e0d8c91013adf39e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


### update 相关

在 chrome console里执行以下命令

```
app.message= 'yes !! I do';
```

下面就能看到data里的值被修改后，将会触发update的操作。

![示例2.png](https://upload-images.jianshu.io/upload_images/6943526-4287ead2006dbc9e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


#### destroy 相关

有关于销毁，暂时还不是很清楚。我们在console里执行下命令对 vue实例进行销毁。销毁完成后，我们再重新改变message的值，vue不再对此动作进行响应了。但是原先生成的dom元素还存在，可以这么理解，执行了destroy操作，后续就不再受vue控制了。

```
app.$destroy();
```
![示例3.png](https://upload-images.jianshu.io/upload_images/6943526-a9d47dee48d6361a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


### 钩子函数详解：

1. `beforeCreate`
   **官方说明：**在实例初始化之后，数据观测(data observer) 和 event/watcher 事件配置之前被调用。
   **解释：**注意是 **之前**，这个时期，this变量还不能使用，在data下的数据，和methods下的方法，watcher中的事件都不能获得到；这个时候的vue实例还什么都没有，但是$route对象是存在的，可以根据路由信息进行重定向之类的操作。

   ```js
    beforeCreate() {
      console.log(this.page); // undefined
      console.log{this.showPage); // undefined
    },
    data() {
      return {
        page: 123
      }
    },
    methods: {
      showPage() {
        console.log(this.page);
      }
    }
   ```

2. `created`
   **官方说明：**在实例已经创建完成之后被调用。在这一步，实例已完成以下配置：**数据观测(data observer)** ，**属性和方法的运算**， **watch/event 事件回调**。然而，挂载阶段还没开始，$el属性目前不可见。
   **解释说明：** 这个时候可以操作vue实例中的数据和各种方法，但是还不能对"dom"节点进行操作；此时 this.$data 可以访问，watcher、events、methods也出现了，若根据后台接口动态改变data和methods的场景下，可以使用。

   ```
    created() {
      console.log(this.page); // 123
      console.log{this.showPage); // ...
      $('select').select2(); // jQuery插件需要操作相关dom，不会起作用
    },
    data() {
      return {
        page: 123
      }
    },
    methods: {
      showPage() {
        console.log(this.page);
      }
    }
   ```

3. `beforeMounte`
   **官方说明：**在挂载开始之前被调用：相关的 render 函数首次被调用。

   **解释说明：**但是render正在执行中，此时DOM还是无法操作的。我打印了此时的vue实例对象，相比于created生命周期，此时只是多了一个$el的属性，然而其值为undefined。页面渲染时所需要的数据，应尽量在这之前完成赋值。

4. `mounted`
   **官方说明：**`el` 被新创建的 `vm.$el` 替换，并挂载到实例上去之后调用该钩子。如果`root`实例挂载了一个文档内元素，当 `mounted` 被调用时 `vm.$el` 也在文档内。

   **解释说明：**挂载完毕，这时`dom`节点被渲染到文档内，一些需要`dom`的操作在此时才能正常进行。此时元素已经渲染完成了，依赖于DOM的代码就放在这里吧~比如监听DOM事件。

   ```js
    mounted() {
      $('select').select2(); // jQuery插件可以正常使用
    },
   ```

5.`beforeUpdate`

**官方说明：**$vm.data更新之后，**虚拟DOM重新渲染** 和打补丁之前被调用。

**解释说明：**可以在这个钩子中进一步地修改$vm.data，这不会触发附加的重渲染过程。

6.`updated`

**官方说明：****虚拟DOM重新渲染** 和打补丁之后被调用。

**解释说明：**当这个钩子被调用时，组件DOM的data已经更新，所以你现在可以执行依赖于DOM的操作。但是不要在此时修改data，否则会继续触发beforeUpdate、updated这两个生命周期，进入死循环！

7.`beforeDestroy`

**官方说明：**实例被销毁之前调用。

**解释说明：**在这一步，实例仍然完全可用。实例要被销毁了，在被销毁之前做一些校验和判断。

8.`destroyed`

**官方说明：**Vue实例销毁后调用。

**解释说明：**此时，Vue实例指示的所有东西已经解绑定，所有的事件监听器都已经被移除，所有的子实例也已经被销毁。这时候能做的事情已经不多了，只能加点儿提示toast之类的东西吧。

## 总结

> `beforecreate` : 页面加载完成之前，可以在这里加个**loading**事件 
>
> `created` ：在这结束loading，还做一些**初始化**，实现**函数自执行** 
>
> `mounted` ： 在这**发起后端请求，拿回数据**，配合路由钩子做一些事情
>
> `beforeDestroy`： 销毁之前使用 
>
> `destroyed` ：当前组件已被删除，清空相关内容

**PS：**beforeMount、mounted、beforeUpdate、updated、beforeDestroy、destroyed这几个钩子函数，在**服务器端渲染期间**不被调用。
