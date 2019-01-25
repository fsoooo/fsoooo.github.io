Elment-UI 的 Form 组件提供了表单验证的功能：

1.将 Form-Item 的 `prop` 属性设置为需校验的字段名

2.通过 `rules` 属性传入约定的验证规则

```js
  rules: {
            name: [
                { 
                    required: true, //非空校验
                    message: '提示信息', //校验提示信息
                    trigger: 'blur'//触发条件：blur、change
                }
            ]
```

#### 踩坑：

**1.要验证输入只能为数字时**

````
{type:'number',message:'只能为数字'}
````

必须要在v-model后面加上.number,即v-moder.number。这里的验证会将你输入的value格式化为number值，在你做自定义校验的时候，要格外注意，有可能正则表达式没有起到效果，就是因为它自动给你转化格式了

**2.自定义校验**

必须要有回调，否则表单无法提交。

```js
data() {
    var newReg1 = (rule, value, callback) => {
      if (value < 0) {
        callback(new Error("不能为负数"));
      } else {
        callback();  //必须要有回调，要不然表单无法提交
      }
    };
   var newReg2 = (rule, value, callback) => {
      let pattrn = /^((?!0)\d+(\.\d{1,2})?)$/g
      if (!pattrn.test(value)) {
        callback(new Error("不能为负数"));
      } else {
        callback();
      }
    };
    return {
      amountCheck: [
        { validator: newReg1, trigger: "blur" },
        { validator: newReg2, trigger: "blur" },
	//此处可写多个校验方法
	......
      ]
    };
}
```

**3.数据绑定**

做表单验证时<el-form-item>必须添加prop属性，而且**prop的名字必须和input框v-model绑定的值一致**。否则的话，表单验证就会出错。

```
 <el-form-item label="活动名称" prop="name">
    	<el-input v-model="ruleForm.name"></el-input>
  </el-form-item>
```



#### 不同类型的表单校验

**1.普通输入验证**

```
<el-form-item label="活动名称" prop="name">
    <!-- validate-event属性的作用是: 输入时不触发表单验证.提交时再验证,你也可以设置成动态验证 -->
    <el-input v-model="registData.name" :validate-event="false"></el-input>
  </el-form-item>

  rules: { // 表单验证规则
    name: [
      { required: true, message: '请输入活动名称' }, // 'blur'是鼠标失去焦点的时候会触发验证
      { min: 3, max: 5, message: '长度在 3 到 5 个字符' }
    ]
  }
```

**2.数字类型验证**

```
<el-form-item label="区域面积" prop="area">
    <!-- 输入的类型为Number时,需要加一个数字转换的修饰符,输入框默认的类型是String类型,但是我试了一下,发现并不能做验证,所以自己写了函数方法验证 -->
    <!-- <el-input v-model.number="registData.area" autocomplete="off"></el-input> -->
    <!-- keyup是鼠标弹起事件, autocomplete是input自带的原生属性,自动补全功能,on为开启,off为关闭 -->
    <el-input v-model="registData.area" @keyup.native="InputNumber('area')" autocomplete="off"></el-input>
  </el-form-item>

  area: [
      // 数字类型 'number', 整数: 'integer', 浮点数: 'float'
      // {type: 'number', message: '请输入数字类型', trigger: 'blur'},
      // {type: 'integer', message: '请输入数字类型', trigger: 'change'}, // 'change'是表单的值改变的时候会触发验证
      {required: true, message: '请输入区域面积', trigger: 'blur'}
    ],

    // 自己写的正则验证,限制用户输入数字以外的字符
    // 过滤输入的金额
    InputNumber (property) {
      this.registData[property] = this.limitInputPointNumber(this.registData[property])
    },

    // 验证只能输入数字
    limitInputNumber (val) {
      if (val) {
        return String(val).replace(/\D/g, '')
      }
      return val
    },

    // 限制只能输入数字(可以输入两位小数)
    limitInputPointNumber (val) {
      if (val === 0 || val === '0' || val === '') {
        return ''
      } else {
        let value = null
        value = String(val).replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
        value = value.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
        value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
        value = value.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
        return Number(value)
      }
    },
```



**3.1 嵌套验证(独立验证)**

 

这种情况是一行里有多个输入框或选择的情况,这里有两种方法,第一种是el-form嵌套写法,验证是独立的

![image](http://upload-images.jianshu.io/upload_images/6943526-1c1ca05f4aeda453.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![image](http://upload-images.jianshu.io/upload_images/6943526-1a782f608ce12420.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```
<el-form-item label="活动时间" required>
    <el-col :span="11">
      <el-form-item prop="date1">
        <el-date-picker type="date" placeholder="选择日期" v-model="registData.date1" style="width: 100%;"></el-date-picker>
      </el-form-item>
    </el-col>
    <el-col class="line" :span="2">-</el-col>
    <el-col :span="11">
      <el-form-item prop="date2">
        <el-time-picker type="fixed-time" placeholder="选择时间" v-model="registData.date2" style="width: 100%;"></el-time-picker>
      </el-form-item>
    </el-col>
  </el-form-item>

  date1: [
    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
  ],
  date2: [
    { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
  ],
```

**3.2 嵌套验证(联动验证)**

这种是联动验证,适用省级联动场景,先选国家后触发城市验证 

 

![image](http://upload-images.jianshu.io/upload_images/6943526-d55ddcbd205c582d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![image](http://upload-images.jianshu.io/upload_images/6943526-70974f0b1f505e3f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


```
<!-- region是一个对象,国家和城市是它的属性 -->
  <el-form-item label="活动区域" prop="region">
    <el-select v-model="registData.region.country" placeholder="请选择国家">
      <el-option label="国家一" value="USA"></el-option>
      <el-option label="国家二" value="China"></el-option>
    </el-select>
    <el-select v-model="registData.region.city" placeholder="请选择城市">
      <el-option label="城市一" value="shanghai"></el-option>
      <el-option label="城市二" value="beijing"></el-option>
    </el-select>
  </el-form-item>

  region: [
    {
      type: 'object',
      required: true,
      // 这里有两种处理,一种是自定义验证,拿到值后自己对属性进行验证,比较麻烦
      // validator: (rule, value, callback) => {
      //   console.log(55, value)
      //   if (!value.country) {
      //     callback(new Error('请选择国家'))
      //   } else if (!value.city) {
      //     callback(new Error('请选择城市'))
      //   } else {
      //     callback()
      //   }
      // },
      trigger: 'change',
      // 官网提供了对象的嵌套验证,只需要把需要验证的属性,放在fields对象里,就会按顺序进行验证
      fields: {
        country: {required: true, message: '请选择国家', trigger: 'blur'},
        city: {required: true, message: '请选择城市', trigger: 'blur'}
      }
    }
  ],
```



**4.图片上传验证(手动触发部分验证方法)** 

有时候会需要在表单里上传图片,但是图片上传是一个异步过程,属性值改变后不会去触发验证规则

 ![image.png](https://upload-images.jianshu.io/upload_images/6943526-aca1fa33fcb3ef11.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

文件上传后，不会触发form表单的验证，需要手动调用校验方法。

```
<el-form-item label="活动图片" prop="fileUrl">
    <el-upload
      :action="action"
      :on-success="handleSuccess"
      :data="uploadData"
      :limit="20"
      list-type="picture-card"
      :on-preview="handlePreview"
      :on-remove="handleRemove">
      <i class="el-icon-plus"></i>
    </el-upload>
  </el-form-item>

  fileUrl: [
    { required: true, message: '请上传图片', trigger: 'change' }
  ],

  // 删除图片
  handleRemove (file, fileList) {
    this.registData.fileUrl = ''
    // 文件删除后也要触发验证,validateField是触发部分验证的方法,参数是prop设置的值
    this.$refs.registerRef.validateField('fileUrl')
  },

  // 图片上传
  handleSuccess (res, file, fileList) {
    // 这里可以写文件上传成功后的处理,但是一定要记得给fileUrl赋值
    this.registData.fileUrl = 'fileUrl'
    // 文件上传后不会触发form表单的验证,要手动添加验证
    this.$refs.registerRef.validateField('fileUrl')
  },
```



#### 表单校验示例：（包含自定义校验）

```vue
<el-form :model="ruleForm" :rules="rules" ref="ruleForm">
  <!--input输入框-->
  <el-form-item label="活动名称" prop="name">
    	<el-input v-model="ruleForm.name"></el-input>
  </el-form-item>
  
  <!--自定义校验-->
  <el-form-item label="联系电话" prop="phone">
    	<el-input v-model="ruleForm.phone"></el-input>
  </el-form-item>

  <!--select下拉框-->
  <el-form-item label="活动区域" prop="region">
        <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
        </el-select>
  </el-form-item>

  <!--checkout多选框-->
  <el-form-item label="活动性质" prop="type">
    <el-checkbox-group v-model="ruleForm.type">
      <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
      <el-checkbox label="地推活动" name="type"></el-checkbox>
      <el-checkbox label="线下主题活动" name="type"></el-checkbox>
      <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
    </el-checkbox-group>
  </el-form-item>

  <!--redio单选框-->
  <el-form-item label="特殊资源" prop="resource">
    <el-radio-group v-model="ruleForm.resource">
      <el-radio label="线上品牌商赞助"></el-radio>
      <el-radio label="线下场地免费"></el-radio>
    </el-radio-group>
  </el-form-item>
</el-form>

<script>
  export default {
    data() {
        //手机号
        var validatePhone = (rule, value, callback) => {
          if (/^1[34578]{1}\d{9}$/.test(value) == false) {
            callback(new Error("请输入正确的手机号"));
          } else {
            callback();
          }
        };
      return {
            rules: {
                name: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                      ],
                region: [
                        { required: true, message: '请选择活动区域', trigger: 'change' }
                      ],
                type: [
                        { type: 'array', required:true,message:'请选择活动性质', trigger: 'change' }
                      ],
                resource: [
                        { required: true, message: '请选择活动资源', trigger: 'change' }
                      ],
            }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
```



#### 完整代码：

```vue
<template>
  <div>
    <p>shopInfo</p>
    <div class="company" id="company">
      <!-- model是验证的数据来源 -->
      <el-form :model="registData" :rules="rules" ref="registerRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="活动名称" prop="name">
          <!-- validate-event输入时不触发表单验证,提交时再验证,也可以设置成动态验证 -->
          <el-input v-model="registData.name" :validate-event="false"></el-input>
        </el-form-item>
        <el-form-item label="区域面积" prop="area">
          <!-- 输入的类型为Number时,需要加一个数字转换的修饰符,输入框默认的类型是String类型,但是我试了一下,发现并不能做验证,所以自己写了函数方法验证 -->
          <!-- <el-input v-model.number="registData.area" autocomplete="off"></el-input> -->
          <el-input v-model="registData.area" @keyup.native="InputNumber('area')" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" prop="region">
          <el-select v-model="registData.region.country" placeholder="请选择国家">
            <el-option label="国家一" value="USA"></el-option>
            <el-option label="国家二" value="China"></el-option>
          </el-select>
          <el-select v-model="registData.region.city" placeholder="请选择城市">
            <el-option label="城市一" value="shanghai"></el-option>
            <el-option label="城市二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间" required>
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker type="date" placeholder="选择日期" v-model="registData.date1" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-time-picker type="fixed-time" placeholder="选择时间" v-model="registData.date2" style="width: 100%;"></el-time-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="即时配送" prop="delivery">
          <el-switch v-model="registData.delivery"></el-switch>
        </el-form-item>
        <el-form-item label="活动性质" prop="type">
          <el-checkbox-group v-model="registData.type">
            <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
            <el-checkbox label="地推活动" name="type"></el-checkbox>
            <el-checkbox label="线下主题活动" name="type"></el-checkbox>
            <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="特殊资源" prop="resource">
          <el-radio-group v-model="registData.resource">
            <el-radio label="线上品牌商赞助"></el-radio>
            <el-radio label="线下场地免费"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动图片" prop="fileUrl">
          <el-upload
            :action="action"
            :on-success="handleSuccess"
            :data="uploadData"
            :limit="20"
            list-type="picture-card"
            :on-preview="handlePreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="活动形式" prop="desc">
          <el-input type="textarea" v-model="registData.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <!-- 提交的时候传入的是表单的ref -->
          <el-button type="primary" @click="submitForm('registerRef')">立即创建</el-button>
          <el-button @click="resetForm('registerRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<style scoped>
  .company {
    padding: 30px;
    text-align: left;
    width: 600px;
  }
</style>
<script>
export default {
  name: 'shopInfo',

  data () {
    return {
      registData: {
        name: '', // 名称
        area: '', // 面积
        region: {}, // 地区
        date1: '', // 日期
        date2: '', // 时间
        delivery: false, // 即时配送
        type: [], // 活动性质
        resource: '', // 特殊资源
        fileUrl: '', // 活动图片
        desc: '' // 活动形式
      }, // 需要验证的表单属性,必须在data中定义
      rules: { // 表单验证规则
        name: [
          { required: true, message: '请输入活动名称' }, // 'blur'是鼠标失去焦点的时候会触发验证
          { min: 3, max: 5, message: '长度在 3 到 5 个字符' }
        ],
        area: [
          // 数字类型
          // {type: 'number', message: '请输入数字类型', trigger: 'blur'},
          // {type: 'integer', message: '请输入数字类型', trigger: 'change'}, // 'change'是表单的值改变的时候会触发验证
          {required: true, message: '请输入区域面积', trigger: 'blur'}
        ],
        region: [
          {
            type: 'object',
            required: true,
            trigger: 'change',
            fields: {
              country: {required: true, message: '请选择国家', trigger: 'blur'},
              city: {required: true, message: '请选择城市', trigger: 'blur'}
            }
          }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        fileUrl: [
          { required: true, message: '请上传图片', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      },
      action: `https://xxx.com`,
      uploadData: {userId: 1304, pathName: 'company'}
    }
  },
  methods: {
    // 过滤输入的金额
    InputNumber (property) {
      this.registData[property] = this.limitInputPointNumber(this.registData[property])
    },

    // 验证只能输入数字
    limitInputNumber (val) {
      if (val) {
        return String(val).replace(/\D/g, '')
      }
      return val
    },

    // 限制只能输入数字(可以输入两位小数)
    limitInputPointNumber (val) {
      if (val === 0 || val === '0' || val === '') {
        return ''
      } else {
        let value = null
        value = String(val).replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
        value = value.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
        value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
        value = value.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
        return Number(value)
      }
    }
}
```

