最近在项目里需要用到地区选择器，就找到 **V - Distpicker 是一个简单易用的地区选择器**。使用非常简单，功能强大，推荐大家使用。

#### 官网: https://distpicker.pigjian.com

#### github: <https://github.com/jcc/v-distpicker>

##### Installation

```shell
npm install v-distpicker --save
```

Or

```shell
yarn add v-distpicker --save
```

##### Register global component（注册全局组件）

```javascript
import VDistpicker from 'v-distpicker'

Vue.component('v-distpicker', VDistpicker)
```

##### Register component（注册局部组件）

```javascript
import VDistpicker from 'v-distpicker'

export default {
  components: { VDistpicker }
}
```

示例：
![示例.png](https://upload-images.jianshu.io/upload_images/6943526-4ec27deb18392811.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![示例2.png](https://upload-images.jianshu.io/upload_images/6943526-bf16cbe0e21aef94.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
```javascript
<template>
  	<v-distpicker 
        :province="province" 
        :city="city" 
        :area="area"
        @selected="onSelected">
	</v-distpicker>
<template>

<script>
import VDistpicker from 'v-distpicker'

export default {
  	components: { VDistpicker },
    methods:{
        onSelected(data) {
                this.province = data.province.value;
                this.city = data.city.value;
                this.area = data.area.value;
                this.ruleForm.province = this.province;
                this.ruleForm.city = this.city;
                this.ruleForm.area = this.area;
            }
    }
}
</script>
```

### Attributes

| 参数                   | 说明                                                         | 类型    | 可选值               | 默认值                                     |
| ---------------------- | ------------------------------------------------------------ | ------- | -------------------- | ------------------------------------------ |
| **province**           | **省份（选填）**                                             | String  | 省份名               | null                                       |
| **city**               | **城市（选填）**                                             | String  | 城市名               | null                                       |
| **area**               | **地区（选填）**                                             | String  | 地区名               | null                                       |
| **type**               | **类型（选填，默认 select）**                                | String  | mobile               | null                                       |
| **disabled**           | **是否禁用（选填，默认 false，且 type='mobile' 时无效）**    | Boolean | true, false          | false                                      |
| **hide-area**          | **隐藏地区（选填）**                                         | Boolean | true, false          | false                                      |
| **onlu-province**      | **只显示省份（选填）**                                       | Boolean | true, false          | false                                      |
| **static-placeholder** | **是否将占位符显示为已经选择的项（仅 type='mobile' 时有效）** | Boolean | true, false          | false                                      |
| **placeholders**       | **占位符（选填）**                                           | Object  | province, city, area | { province: '省', city: '市', area: '区' } |
| **wrapper**            | **外层 Class（选填）**                                       | String  | customize            | address                                    |
| **address-header**     | **address-header 样式（选填，类型必须为 mobile）**           | String  | customize            | address-header                             |
| **address-container**  | **address-container 样式（选填，类型必须为 mobile）**        | String  | customize            | address-contaniner                         |

### Methods

| 方法         | 说明                   | 参数           |
| ------------ | ---------------------- | -------------- |
| **province** | **选择省份**           | 返回省份的值   |
| **city**     | **选择城市**           | 返回城市的值   |
| **city**     | **选择地区**           | 返回地区的值   |
| **selected** | **选择最后一项时触发** | 返回省市区的值 |


