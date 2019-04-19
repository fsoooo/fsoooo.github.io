近期，公司出了一个新需求，我们需要开发一个数据统计平台，于是就需要使用图表来是数据更直观的呈现。Echarts是我们的首选。

##### 重点：用较少的代码实现比较酷炫的数据统计表.

[ECharts](https://echarts.baidu.com/index.html)，一个使用 JavaScript 实现的开源可视化库，可以流畅的运行在 PC 和移动设备上，兼容当前绝大部分浏览器（IE8/9/10/11，Chrome，Firefox，Safari等），底层依赖轻量级的矢量图形库 [ZRender](https://github.com/ecomfe/zrender)，提供直观，交互丰富，可高度个性化定制的数据可视化图表。

## 丰富的可视化类型

ECharts 提供了常规的[折线图](https://echarts.baidu.com/option.html#series-line)、[柱状图](https://echarts.baidu.com/option.html#series-line)、[散点图](https://echarts.baidu.com/option.html#series-scatter)、[饼图](https://echarts.baidu.com/option.html#series-pie)、[K线图](https://echarts.baidu.com/option.html#series-candlestick)，用于统计的[盒形图](https://echarts.baidu.com/option.html#series-boxplot)，用于地理数据可视化的[地图](https://echarts.baidu.com/option.html#series-map)、[热力图](https://echarts.baidu.com/option.html#series-heatmap)、[线图](https://echarts.baidu.com/option.html#series-lines)，用于关系数据可视化的[关系图](https://echarts.baidu.com/option.html#series-graph)、[treemap](https://echarts.baidu.com/option.html#series-treemap)、[旭日图](https://echarts.baidu.com/option.html#series-sunburst)，多维数据可视化的[平行坐标](https://echarts.baidu.com/option.html#series-parallel)，还有用于 BI 的[漏斗图](https://echarts.baidu.com/option.html#series-funnel)，[仪表盘](https://echarts.baidu.com/option.html#series-gauge)，并且支持图与图之间的混搭。

除了已经内置的包含了丰富功能的图表，ECharts 还提供了[自定义系列](https://echarts.baidu.com/option.html#series-custom)，只需要传入一个*renderItem*函数，就可以从数据映射到任何你想要的图形，更棒的是这些都还能和已有的交互组件结合使用而不需要操心其它事情。

你可以在下载界面下载包含所有图表的构建文件，如果只是需要其中一两个图表，又嫌包含所有图表的构建文件太大，也可以在在线构建中选择需要的图表类型后自定义构建。

## 多种数据格式无需转换直接使用

ECharts 内置的 dataset 属性（4.0+）支持直接传入包括二维表，key-value 等多种格式的数据源，通过简单的设置 encode 属性就可以完成从数据到图形的映射，这种方式更符合可视化的直觉，省去了大部分场景下数据转换的步骤，而且多个组件能够共享一份数据而不用克隆。

为了配合大数据量的展现，ECharts 还支持输入 TypedArray 格式的数据，TypedArray 在大数据量的存储中可以占用更少的内存，对 GC 友好等特性也可以大幅度提升可视化应用的性能。

下面介绍一下echarts的使用过程。

#### 安装echarts依赖

```
npm install echarts -S
```

或者使用国内的淘宝镜像：

- 安装

  ```
  npm install -g cnpm --registry=https://registry.npm.taobao.org
  ```

- 使用

  ```
  cnpm install echarts -S
  ```

  #### 创建图表

  

  main.js

  ```
  // 引入echarts
  import echarts from 'echarts'
  
  Vue.prototype.$echarts = echarts
  ```

#### 使用步骤：

**第一步：引用Js文件** 

```
<script type="text/javascript" src="js/echarts.js"></script>
```

**第二步：准备一个放图表的容器（画布）必须指定高度，否则不会显示** 

```
<div id="chartmain" style="width:600px; height: 400px;"></div>
```

**第三步：echarts.init(dom容器)，初始化echarts实例,一般放在最后（定义）** 

```
var myChart = echarts.init(document.getElementById('chartmain'));
```

**第四步： 使用制定的配置项和数据显示图表,这两步都放在最后（显示）** 

```
myChart.setOption(option);
```

**第五步：设置参数**

柱状图其实也很简单，只要修改一个参数就可以了。把series里的type 值修改为”bar” 

饼图和折线图、柱状图有一点区别。主要是在参数和数据绑定上。饼图没有X轴和Y轴的坐标，数据绑定上也是采用value 和name对应的形式。

```vue
<template>
    <div>
        <div class="pubPart section1">
            <h3>数据概括</h3>
            <el-row>
                <el-col :span="6">
                    <div class="content">
                        <h6>日期</h6>
                        <h3>昨日</h3>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="content">
                        <h6>开机量(次)</h6>
                        <h3>0</h3>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="content">
                        <h6>开机数(台)</h6>
                        <h3>0</h3>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="content">
                        <h6>开机酒店(间) </h6>
                        <h3>0</h3>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <div class="content">
                        <h3>今日</h3>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="content">
                        <h3>0</h3>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="content">
                        <h3>0</h3>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="content">
                        <h3>0</h3>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="pubPart section2">
            <h3>数据详情</h3>
            <div class="searchCondition">
                <el-row>
                    <el-col :span="12">
                        <el-radio-group size="big">
                            <el-radio-button label="昨日"></el-radio-button>
                            <el-radio-button label="近7日"></el-radio-button>
                            <el-radio-button label="近30日"></el-radio-button>
                        </el-radio-group>
                    </el-col>
                </el-row>
            </div>
            <el-row style="padding-top: 10px">
                <el-col :span="12">
                    <div id="chart1"
                         style="width: 500px;height:350px;border:1px solid rgba(144,144,144,0.42);">
                        <div id="myChart" :style="{width: '480px', height: '330px'}"></div>
                        <a style="margin-left: 80%" @click="toHistogram">查看更多...</a>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div id="chart2"
                         style="width: 500px;height:350px;border:1px solid rgba(144,144,144,0.42);">
                        <h3>酒店排行</h3>
                        <el-row :gutter="20" style="margin-bottom:20px;">
                            <el-col :span="4">
                                <el-button type="primary" @click="toHotel">酒店详情</el-button>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" style="margin-bottom:20px;">
                        </el-row>
                        <el-table
                                :data="hotelData"
                                style="width: 100%">
                            <el-table-column
                                    prop="order"
                                    label="序号"
                                    width="80">
                            </el-table-column>
                            <el-table-column
                                    prop="name"
                                    label="酒店名称"
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="openCount"
                                    label="开机量">
                            </el-table-column>
                            <el-table-column
                                    prop="openNumber"
                                    label="开机数">
                            </el-table-column>
                        </el-table>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="pubPart section3">
            <el-row style="padding-top: 30px">
                <el-col :span="12">
                    <div id="chart3"
                         style="width: 500px;height:400px; border:1px solid rgba(144,144,144,0.42);">
                        <h3>地区排行</h3>
                        <el-row :gutter="20" style="margin-bottom:20px;">
                            <el-col :span="2">
                                <el-button type="primary" @click="toArea">地区详情</el-button>
                            </el-col>
                        </el-row>
                        <el-table
                                :data="areaData"
                                style="width: 100%">
                            <el-table-column
                                    prop="order"
                                    label="序号"
                                    width="80">
                            </el-table-column>
                            <el-table-column
                                    prop="name"
                                    label="地区"
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="openCount"
                                    label="开机量">
                            </el-table-column>
                            <el-table-column
                                    prop="openNumber"
                                    label="开机数">
                            </el-table-column>
                        </el-table>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div id="chart4"
                         style="width: 500px;height:400px;border:1px solid rgba(144,144,144,0.42);">
                        <mapHot></mapHot>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
  import mapHot from '@/components/echats/mapHot'

  export default {
    components: {
      mapHot
    },
    data() {
      return {
        data: '数据统计首页',
        hotelData: [
          {
            'order': '1',
            'name': '智驿大酒店',
            'openCount': '100',
            'openNumber': '888800'
          }
        ],
        areaData: [
          {
            'order': '1',
            'name': '北京',
            'openCount': '100',
            'openNumber': '888800'
          }
        ],
        currentPage: 1
      }
    },
    mounted() {
      this.drawLine()
    },
    methods: {
      handleSizeChange() {
      },
      handleCurrentChange() {
      },
      toHotel() {
        this.$router.push({
          path: '/statistics/hotel'
        })
      },
      toArea() {
        this.$router.push({
          path: '/statistics/area'
        })
      },
      toHistogram() {
        this.$router.push({
          path: '/statistics/histogram'
        })
      },
      drawLine() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
          title: { text: '近7日酒店开机情况' },
          tooltip: {},
          xAxis: {
            data: ['3月1日', '3月2日', '3月3日', '3月4日', '3月5日', '3月6日', '3月7日']
          },
          yAxis: {},
          series: [{
            name: '开机情况',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20, 90]
          }]
        })
      }
    }
  }
</script>
```

```vue
<template>
    <div class="echarts">
        <div :style="{height:'400px',width:'100%'}" ref="myEchart"></div>
    </div>
</template>
<script>
  import 'echarts/map/js/china.js' // 引入中国地图数据

  export default {
    name: 'echarts',
    props: ['userJson'],
    data() {
      return {
        chart: null
      }
    },
    mounted() {
      this.chinaConfigure()
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      chinaConfigure() {
        console.log(this.userJson)
        let myChart = this.$echarts.init(this.$refs.myEchart) //这里是为了获得容器所在位置
        window.onresize = myChart.resize
        myChart.setOption({ // 进行相关配置
          backgroundColor: '#02AFDB',
          tooltip: {}, // 鼠标移到图里面的浮动提示框
          dataRange: {
            show: false,
            min: 0,
            max: 1000,
            text: ['High', 'Low'],
            realtime: true,
            calculable: true,
            color: ['orangered', 'yellow', 'lightskyblue']
          },
          geo: { // 这个是重点配置区
            map: 'china', // 表示中国地图
            roam: true,
            label: {
              normal: {
                show: true, // 是否显示对应地名
                textStyle: {
                  color: 'rgba(0,0,0,0.4)'
                }
              }
            },
            itemStyle: {
              normal: {
                borderColor: 'rgba(0, 0, 0, 0.2)'
              },
              emphasis: {
                areaColor: null,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 20,
                borderWidth: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          },
          series: [{
            type: 'scatter',
            coordinateSystem: 'geo' // 对应上方配置
          },
            {
              name: '启动次数', // 浮动框的标题
              type: 'map',
              geoIndex: 0,
              data: [{
                'name': '北京',
                'value': 599
              }, {
                'name': '上海',
                'value': 142
              }, {
                'name': '黑龙江',
                'value': 44
              }, {
                'name': '深圳',
                'value': 92
              }, {
                'name': '湖北',
                'value': 810
              }, {
                'name': '四川',
                'value': 453
              }]
            }
          ]
        })
      }
    }
  }
</script>

```
![](https://upload-images.jianshu.io/upload_images/6943526-388648fd06c6839e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)







