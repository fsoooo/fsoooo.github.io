最近公司在写OTA的项目，一些订单需要自动处理，于是就有了倒计时的需求。在github上找到了[vue2-countdown](https://github.com/cgygd/vue2-countdown)，就把这个插件引入到了我公司的项目中。

# vue2-countdown

- 基于vue2.0的活动倒计时组件

- 可以使用服务端当前时间

- 在倒计时开始或者结束的时候,可以自定义回调

- 文档：<https://cgygd.github.io/vue2-countdown/>

- demo：<https://cgygd.github.io/vue2-countdown/example/index.html>

![示例.png](https://upload-images.jianshu.io/upload_images/6943526-5e95d816da59c79c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


## 安装

1.cnpm/npm

```shell
npm install vue2-countdown --save
```

2.Git 下载源码

```shell
git clone https://github.com/cgygd/vue2-countdown
```

## 使用

```vue
<count-down v-on:end_callback="countDownE_cb()"
			    :currentTime="currentTime"
			   	:startTime="startTime"
			  	:endTime="endTime"
			  	:tipText="'距离订单开始还有'"
			  	:tipTextEnd="'距离订单关闭还剩'"
			  	:endText="'订单已关闭'"
			  	:dayTxt="'天'"
			  	:hourTxt="'小时'"
			  	:minutesTxt="'分钟'"
			  	:secondsTxt="'秒'">
</count-down>
```

```js
import CountDown from 'vue2-countdown'
components: {
    CountDown
},
data() {
     return {
                currentTime:0,
                startTime:0,
                endTime:0,
            }
        },
methods: {
  countDownS_cb: function (x) {
    console.log(x)
  },
  countDownE_cb: function (x) {
    console.log(x)
  }
}
```

### 参数解释

1. currentTime -- 当前时间戳,如果不传,默认获取用户本地的时间(建议传服务器的当前时间)

   **type**: Number

   **required** : false

   **default** : ( new Date() ).getTime()

2. startTime -- 开始时间戳

   **type**: Number

   **required** : true

3. endTime -- 结束时间戳

   **type**: Number

   **required** : true

4. tipText -- 开始倒计时之前的提示文字

   **type**: String

   **required** : false

   **default** : 距离开始

5. tipTextEnd -- 开始倒计时之后的提示文字

   **type**: String

   **required** : false

   **default** : 距离结束

6. endText -- 倒计时结束之后的提示文字

   **type**: String

   **required** : false

   **default** : 已结束

7. dayTxt -- 自定义显示的天数文字

   **type**: String

   **required** : false

   **default** : :

8. hourTxt -- 自定义显示的小时文字

   **type**: String

   **required** : false

   **default** : :

9. secondsTxt -- 自定义显示的分钟文字

   **type**: String

   **required** : false

   **default** : :

10. secondsFixed -- 自定义显示的秒数文字

    **type**: String

    **required** : false

    **default** : :

### 回调方法

1. start_callback() -- 开始倒计时结束之后的回调方法

   **type**: Function

   **required** : false

2. end_callback() -- 活动倒计时结束之后的回调方法

   **type**: Function

   **required** : false



   ### 问题修改

   **但是在使用过程中发现了vue2-countdown 项目存在的一些问题：**

   #### 1.无法自定义提示文字
  作者在项目中注释掉了，导致我们在引入组建添加了此配置的话也无法显示提示语。
   **解决方法：**
1.在node_modules中找到安装的vue2-countdown文件，修改vue2-countdown.vue文件，将注释消除。

![注释.png](https://upload-images.jianshu.io/upload_images/6943526-e9c880f9edf7380f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![取消注释.png](https://upload-images.jianshu.io/upload_images/6943526-3001473259bd5019.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

 2.其实整个项目有用的只有lib/vue2-countdown.vue文件，所有也可以将该文件内容复制一份到自己的项目，新建一个vue文件，作为组件，然后将组件的注释解除。
   
   #### 2.倒计时逻辑问题

   引入后发现无论我们传什么时间过去，倒计时都是结束时间-开始时间重新计算，并非根据当前时间计算结束时间-当前时间的值，所以我们怎么配置，怎么刷新结果都是（end-start)，其实好像都和当前时间没有关系

 **解决方法**：将原先的this.start改为this.current。作者原先虽然获取到了传入的当前时间戳，但在method中却没有使用。将start改为current可以保证输出的是当前时间距离结束时间的时间长度。

![修改js.png](https://upload-images.jianshu.io/upload_images/6943526-9e49d6544d9966ba.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

