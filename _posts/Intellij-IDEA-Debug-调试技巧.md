```
1. F9：恢复程序
2. Alt+F10：显示执行断点
3. F8： 跳到下一步
4. F7：进入到代码
5. Alt+shift+F7：强制进入代码
6. Shift+F8：跳到下一个断点
7. Atl+F9：运行到光标处
8. ctrl+shift+F9：debug运行java类
9. ctrl+shift+F10：正常运行java类
10. Alt+F8：debug时选中查看值
```

1、这里以一个web工程为例，点击图中按钮开始运行web工程。
![image.png](https://upload-images.jianshu.io/upload_images/6943526-b07233183e802d48.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


2、设置断点

![image.png](https://upload-images.jianshu.io/upload_images/6943526-d7781d4a4bdf479e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


3、使用postman发送http请求

![image.png](https://upload-images.jianshu.io/upload_images/6943526-ccc8e8806f479836.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


 4、请求发送之后会自动跳到断点处，并且在断点之前会有数据结果显示

![img](https://mmbiz.qpic.cn/mmbiz_jpg/TNUwKhV0JpRTWMM0PLBtL1sIR86K88FuOEcZ1HxZC0rWcA7z1wWylgo6w7grLR4gL9OjrT1owRy8xgib9d1odHQ/640?tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

5、按F8 在 Debug 模式下，进入下一步，如果当前行断点是一个方法，则不进入当前方法体内，跳到下一条执行语句。

![img](https://mmbiz.qpic.cn/mmbiz_jpg/TNUwKhV0JpRTWMM0PLBtL1sIR86K88FuTNiafPaSeojZLFSIXEGichGmlicIVM38BLZFF0f2HHNNqJDasnUynSicBQ/640?tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

6、按F7在 Debug 模式下，进入下一步，如果当前行断点是一个方法，则进入当前方法体内，如果该方法体还有方法，则会进入该内嵌的方法中 .

![img](https://mmbiz.qpic.cn/mmbiz_jpg/TNUwKhV0JpRTWMM0PLBtL1sIR86K88Fu3hlGpwphJD8EjhtoyKINYbXNHWp4SY8CUJnKibpw0t3lxQOeEMp3Mug/640?tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

7、继续按F7，则跳到StopWatch() 构造方法中。

![img](https://mmbiz.qpic.cn/mmbiz_png/TNUwKhV0JpRTWMM0PLBtL1sIR86K88FuvUX7xIibKALf5Qs63jC6WsLdWYbbmdIqERnZbyRUOfWvY1OeQ52cialw/640?tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

 8、跳出该方法，可以按Shift+F8，在 Debug 模式下，跳回原来地方。

![img](https://mmbiz.qpic.cn/mmbiz_jpg/TNUwKhV0JpRTWMM0PLBtL1sIR86K88Fu4bo4zr8UtAo0HtOBicIveeuAk8uUDxGletgZvW3HicHkXFl5cd0wicFBQ/640?tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

9、这时我们按F8，会继续执行下一条语句。

![img](https://mmbiz.qpic.cn/mmbiz_jpg/TNUwKhV0JpRTWMM0PLBtL1sIR86K88FumhntUlmmib5kcXtWibOE9iaUkDntZazfj656r2j6nyibMOZDAe2MQFF4Ug/640?tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

10、当我们执行到第二个断点处，如果想直接执行到第三个断点处，可以按F9。

![img](https://mmbiz.qpic.cn/mmbiz_jpg/TNUwKhV0JpRTWMM0PLBtL1sIR86K88FuV9ia5AuA5LQovckDH3LoFCC66ZnOzcFOmTtjLsW67bIAHsE7Lax8xzA/640?tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

补充：Alt+F8 可以通过在 Debug 的状态下，选中对象，弹出可输入计算表达式调试框，查看该输入内容的调试结果 。

第一个红框是我输入的参数，第二个是我执行之后显示得结果。

![img](https://mmbiz.qpic.cn/mmbiz_jpg/TNUwKhV0JpRTWMM0PLBtL1sIR86K88FudiaQJLkVic6yhgNPovWGtuKOc2S2IJ1zBtUqVj6uKDB1pJDueyEV3fgA/640?tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)
