在Angular中，组件装饰器一般这么写：

```
@Component({    
    selector: 'greet', 
    template: 'Hello {{name}}!'
})
```

这里，selector如果是个字符串，那么其他组件中使用这个组件，需要这么写

```
<greet></greet>
```

实际上，selector还有其他的写法，比如说

```
@Component({    
   selector: '.greet', 
    template: 'Hello {{name}}!'
})
```

这个时候，你要想使用这个组件，就需要这么用了：

```
<div class='greet'></div>
```

还有，你还可以这么写

```
@Component({    
  selector: ['greet'],
    template: 'Hello {{name}}!'
})
```

那么使用这个组件的时候，你还可以这么调用：

```
<div greet></div>
```
![](https://upload-images.jianshu.io/upload_images/6943526-6ef90d678f7e51aa.gif?imageMogr2/auto-orient/strip)


