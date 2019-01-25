#  Vue学习笔记-遍历el-checkout

```vue
<el-checkbox @change="handleCheckedCitiesChange"  
             v-model="checkAll"   
             :label="list.eventtypeid">
    全选
</el-checkbox>
 <el-checkbox-group v-model="checkOne" class="checkGroup">
      <el-checkbox  v-for="(operate,index1) in list.operation" 
                   :label="operate.actionid"   
                   :key="operate.actionid"  
                   @change="handleCheckedCitiesChange">
          {{operate.actionname}}
     </el-checkbox>
 </el-checkbox-group>
```

看上面的例子，都是把el-checkbox放在el-checkbox-group里面进行循环的。

1.@change事件要优于@click事件，可以把这个change加在el-checkbox-group上面。这样每次点击的checkbox框变化他都能捕捉到。也可以放在el-checkbox上面，这样点击时获取的是你当时点击的checkbox。

2.v-model上面的值是你checkebox的选中的值，这里label绑定的是id（也就是我们想要获取给后台的）而不是显示的内容。而且必须写个label赋值id，不然你写name的话，他选择时就把名字相同的都选中了。v-model写在了checkbox-group上面。这样获取的就是循环的里面所有选中的，不是一条数组选中的。有了v-model就可以不用写:checked属性来决定他是否选中了。如果选中了。你就在v-model绑定的那个数组里添加上这个id值就可以啦，如果取消选中就在数组里删除这个值。

```js
//删除：比如this.actionid是我们想删除的。
this.checkOne=this.checkOne.map(res=>{
        if(res!=this.actionid){return res;}
});
//添加：
this.checkOne.push(this.actionid);
```

#### element-ui 多选框组件el-checkbox-group,赋值取值

示例一：
![示例.png](https://upload-images.jianshu.io/upload_images/6943526-5249441ba2236299.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

示例二：
![示例2.png](https://upload-images.jianshu.io/upload_images/6943526-3696daa926485a7a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```js
servicesData:  [
                    {
                        "value":1,
                        "text":"视讯",
                        "name":"shix",
                        "type":"checkbox",
                        "child":[
                            {
                                "value":11,
                                "text":"智驿酒店电视系统"
                            }
                        ]
                    },
                    {
                        "value":2,
                        "text":"网络",
                        "name":"wangl",
                        "type":"checkbox",
                        "child":[
                            {
                                "value":21,
                                "text":"客房WIFI免费"
                            }
                        ]
                    }
                ];

//js
for (let key in this.servicesData) {
   		this.$set(this.services, key, [])
}
console.log(this.services);
console.log(JSON.stringify(this.services));
```
js打印:
![js打印.png](https://upload-images.jianshu.io/upload_images/6943526-5ba8098203cd36f1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

模板渲染
```vue
 <!--注意看 v-model ,这里绑定的是service[index]-->
<el-form-item :label="item.text" v-for="(item,index) in servicesData">
    <el-checkbox-group v-model="services[index]" @change="getSelectedServices()">
                 <el-checkbox v-for="itemChild in item.child" :label="itemChild">
                         {{itemChild.text}}
                 </el-checkbox>
    </el-checkbox-group>
</el-form-item>
```
参考：

![参考.png](https://upload-images.jianshu.io/upload_images/6943526-835a552da4339632.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
