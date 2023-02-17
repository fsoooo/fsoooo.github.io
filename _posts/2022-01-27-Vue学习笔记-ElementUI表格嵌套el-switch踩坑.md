因为项目需求，需要在表格中嵌套表单，前端UI组件使用的是ElementUI。

![](https://upload-images.jianshu.io/upload_images/6943526-f3ae1a1f8cba6184.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

代码如下：

```
<el-form :model='data' ref='form'>
<el-table :data="data.tableData" style="width: 100%">
  <el-table-column prop="master_name" label="主审核人" width="180"></el-table-column>
  <el-table-column prop="slave_name" label="备审核人" width="180"></el-table-column>
  <el-table-column label="是否显示">
    <template slot-scope="scope">
      <el-switch
        v-model="scope.row.status"
        active-value="1"
        inactive-value="0"
        @change="changeSwitch(scope.row,scope.$index)">
      </el-switch>
    </template>
  </el-table-column>
  <el-table-column label="操作" width="180"></el-table-column>
</el-table>
</el-form>
```
实现的change方法如下：
```
change(row,index){
      console.log(row)
      console.log(index)
      this.data.tableData[index] = row
}
```

点击`el-switch`可以触发`change`方法，控制台有数据打印，赋值也可是正确的，但是`el-switch`就没有状态变化。提交数据，也是修改后的状态，就是页面不同步。

通过在网上找解决方案，发现把直接赋值改成**`this.$set()`**就可以解决这个问题。

问题虽然解决了，但是还是不知道为什么？

直接赋值和`this.$set`有什么区别？

`this.$set`使用场景是什么？



##**this.$set 应用场景及用法**


>**当你发现你给对象加了一个属性，在控制台能打印出来，但是却没有更新到视图上时，也许这个时候就需要用到 `this.$set()` 这个方法了，简单来说`this.$set`的功能就是解决这个问题的啦。**

**官方解释：向响应式对象中添加一个属性，并确保这个新属性同样是响应式的，且触发视图更新。**

```
this.$set( target, key, value )
target：要更改的数据源(可以是对象或者数组)
key: 要更改的具体数据 （索引）
value ：重新赋的值

小结
对象操作：this.$set("改变的对象"，"改变的对象属性"，"值")
数组操作：this.$set("数组"，"下标"，"值")
```

## this.$set和直接赋值的区别

```
<template>
	<div>
		<ul>
            <template v-for="item in userInfo">
               <li>{{item}}</li>
            </template>
        </ul>
        <el-button @click="addInfo" type="primary">添加用户性别</el-button>
	</div>
</template>

<script>
    export default {
      data(){
        return {
          userInfo:{
            name:'张三'
          }
        }
      },
      methods:{
        addInfo(){
          this.userInfo.sex='男';
          console.log(this.userInfo);
        }
      }
    }
</script>
```
单击按钮为userInfo添加sex属性，console.log输出的数据有sex，但是视图层没有更新，效果如下图：
![](https://upload-images.jianshu.io/upload_images/6943526-a785b48943f6ae06.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

此时可以看出：data数据区的 userInfo 已经添加了 sex 属性，且值为 男 ，但是并没有渲染到页面上。

由此可以得知，直接赋值可能会出现的问题是视图没有更新。

这是什么原因造成的？

根据官方文档定义：**如果在实例创建之后添加新的属性到实例上，它不会触发视图更新。**

由于受JavaScript的限制，vue.js不能监听对象属性的添加和删除，因为在vue组件初始化的过程中，会调用getter和setter方法，所以该属性必须是存在在data中，视图层才会响应该数据的变化。

这时就需要用 `this.$set()`.

```
addInfo(){
  this.$set(this.userInfo,'sex','男');
  console.log(this.userInfo);
}
```

单击按钮后，新添加的属性值会被Vue监听到并且同步渲染到页面上，如下图：

![](https://upload-images.jianshu.io/upload_images/6943526-e756bc9e8a5c85ae.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](https://upload-images.jianshu.io/upload_images/6943526-def197f32a9439d7.gif?imageMogr2/auto-orient/strip)





