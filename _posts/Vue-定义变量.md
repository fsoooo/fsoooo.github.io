最近开始学习Vue，接触到了ES6。以前使用的JavaScript，定义变量使用的Var，现在Vue中还使用let 和 const来定义变量。
###var
var定义的变量可以修改，如果不初始化会输出undefined，不会报错
```
var a = 1;
// var a;//不会报错
console.log('函数外var定义a:' + a);//可以输出a=1
function change(){  
    a = 4;
    console.log('函数内var定义a:' + a);//可以输出a=4
}
change();
console.log('函数调用后var定义a为函数内部修改值：' + a);//可以输出a=4
```

###const
const定义的变量不可以修改，而且必须初始化
```
const b = 1;    //正确
const b;    //错误，必须初始化
console.log('函数外const定义b：' +　ｂ);/有输出值
//b = 5;
//console.log('函数外修改const定义b:' + b);//无法输出
```

###let
let是块级作用域，函数内部使用let定义后，对函数外部无影响
```
let c = 3;
console.log('函数外let定义c：' + c);//输出c=3
funcion change(){   
    let c = 6;
    console.log('函数内let定义c：' + c);//输出c=6
}
change();
console.log('函数调用后let定义c不受函数内部定义影响：' + c);//输出c=3
```
###let、const 和var的区别

let和var的一个明显的区别就是没有变量提升：
```
function fun1(){
	for(var i = 0; i <= 10;i++){
		
	}
	console.log(i);//11;--------var变量提升
};
fun1();
function fun2(){
	for(let i = 0; i <= 10;i++){
		
	}
	console.log(i);//i is not defined;--------let没有变量提升
};
fun2();
```

const和var的明显区别是，const声明的是常量，不可被后面的代码赋值改变：
 ```
var x = 1;
x = 2;
console.log(x);//2;-----var声明的是变量，可被赋值替换
 
const y = 1;
y = 2;
console.log(y);//Assignment to constant variable.;------const声明的是常量，不可改变
```






