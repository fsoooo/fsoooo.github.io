

PHP7是最新出来的一个新的PHP的一个版本，而且新增了一些新的版本特性，下面我们来介绍一下：

#### 1.速度快一些，大概是PHP5版本的9倍左右

下面是做的一个实验：

```
<?php
$a = array();
for($i = 0;$i<=50000;$i++){
    $a[$i] = $i;
}    
foreach($a as $i){
    array_key_exists($i,$a);
}
?>
```

![img](http://upload-images.jianshu.io/upload_images/6943526-2e4b264552837492.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

紧接着再做下一个实验：

```php
1 $a = array();
2 for($i=0;$i<=10000;$i++){
3     $a[$i] = $i;
4 }
5 
6 foreach($a as $i){
7     array_search($a,$i);
8 }
```

![img](http://upload-images.jianshu.io/upload_images/6943526-e63270da92fdaf43.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### 2.标量类型声明

什么是标量类型？

```php
四种标量类型：
boolean （布尔型）
integer （整型）
float （浮点型, 也称作 double)
string （字符串）
两种复合类型：
array （数组）
object （对象）
```

资源是一种特殊变量，保存了到外部资源的一个引用。资源是通过专门的函数来建立和使用的。资源类型变量为打开文件、数据库连接、图形画布区域等的特殊句柄。
说的通俗一点，标量类型，就是定义变量的一个数据类型。

在php5中，有类名，接口，数组 和回调函数。在php中，增加了 符串(string), 整数 (int), 浮点数 (float), 以及布尔值 (bool)。下面我们来举例子，万事万物看例子

```php
function typeInt(int $a)
{
    echo $a;
}

typeInt('sad');
// 运行，他讲会报错 Fatal error: Uncaught TypeError: Argument 1 passed to type() must be of the type integer, string given
```


在这里，我们定义了$a 必须为int类型，如果 type函数里面传了string 所以报错。让我们修改上述的代码就没错了

```php
function typeString(string $a)
{
    echo $a;
}

typeString('sad'); 
//sad
```

#### 3.返回值类型声明

PHP7增加了对返回类型声明的支持，返回类型声明指明了返回值的类型。可用的类型和参数声明中可用的类型相同。函数的方法返回值，可以定义，比如我某个函数必须要返回int类型，他就定死来返回int ，如果你返回string 则报错。下面看代码

```php
<?php
function returnArray(): array
{
	return [1, 2, 3, 4];
}
print_r(returnArray());
/*Array(
    [0] => 1
    [1] => 2
    [2] => 3
    [3] => 4
    )
*/
那当我们的定义了数组，返回了string或者其他类型呢？
那么他将会报错 比如
function returnErrorArray(): array
{
	return '1456546';
}
print_r(returnErrorArray());
/*
Array
Fatal error: Uncaught TypeError: Return value of returnArray() must be of the type array, string returned in 
*/
```

#### 4.null合并运算符(三元运算符的升级)

由于日常使用中存在大量同时使用三元表达式和 isset()的情况， 我们添加了null合并运算符 (??) 这个语法糖。如果变量存在且值不为NULL， 它就会返回自身的值，否则返回它的第二个操作数。

```php
<?php
$username = $_GET['user'] ?? 'nobody';
//这两个是等效的  当不存在user 则返回?? 后面的参数
$username = isset($_GET['user']) ? $_GET['user'] : 'nobody';
?>
```

#### 5.太空船操作符（组合比较符）

太空船操作符用于比较两个表达式。当$a大于，等于或者小于$b的时候，分别返回的值-1,0,1.比较的原则是沿用PHP的常规比较规则进行的.

```php
// 整数
echo 1 <=> 1; // 0 当左边等于右边的时候，返回0
echo 1 <=> 2; // -1  当左边小于右边，返回-1
echo 2 <=> 1; // 1  当左边大于右边，返回1

// 浮点数
echo 1.5 <=> 1.5; // 0
echo 1.5 <=> 2.5; // -1
echo 2.5 <=> 1.5; // 1

// 字符串
echo "a" <=> "a"; // 0
echo "a" <=> "b"; // -1
echo "b" <=> "a"; // 1
```

#### 6.define 定义数组

在php7 以前的版本 define 是不能够定义数组的 现在是可以的 比如

```php
define('ANIMALS', [
    'dog',
    'cat',
    'bird'
]);
echo ANIMALS[1]; // 输出 "cat"
```

#### 7.use方法 批量导入

```php
// PHP 7 之前的代码
use some\namespace\ClassA;
use some\namespace\ClassB;
use some\namespace\ClassC as C;

use function some\namespace\fn_a;
use function some\namespace\fn_b;
use function some\namespace\fn_c;

use const some\namespace\ConstA;
use const some\namespace\ConstB;
use const some\namespace\ConstC;

// PHP 7+ 及更高版本的代码
use some\namespace\{ClassA, ClassB, ClassC as C};
use function some\namespace\{fn_a, fn_b, fn_c};
use const some\namespace\{ConstA, ConstB, ConstC};
```

#### 8.Unicode codepoint 转译语法

```php
echo "\u{aa}"; //ª
echo "\u{0000aa}";  //ª  
echo "\u{9999}"; //香
```

#### 9.匿名类

```php
<?php
interface Logger {
    public function log(string $msg);
}

class Application {
    private $logger;
    public function getLogger(): Logger {
         return $this->logger;
    }
    public function setLogger(Logger $logger) {
         $this->logger = $logger;
    }
}
$app = new Application;
$app->setLogger(new class implements Logger {  //这里就是匿名类
    public function log(string $msg) {
        echo $msg;
    }
});
```

#### 10.Session options

现在，session_start()函数可以接受一个数组作为参数，可以覆盖php.ini中session的配置项。

比如，把cache_limiter设置为私有的，同时在阅读完session之后立即关闭

```php
<?php
session_start([
    'cache_limiter'=>'private',
    'read_and_close'=>true
])
?>
```

# php7.1的新特性

#### 可为空类型

参数以及返回值的类型现在可以通过在类型前加上一个问号使之允许为空。 当启用这个特性时，传入的参数或者函数返回的结果要么是给定的类型，要么是 null 。

```php
<?php

function testReturn(): ?string
{
    return 'elePHPant';
}

var_dump(testReturn()); //string(10) "elePHPant"

function testReturn(): ?string
{
    return null;
}

var_dump(testReturn()); //NULL

function test(?string $name)
{
    var_dump($name);
}

test('elePHPant'); //string(10) "elePHPant"
test(null); //NULL
test(); //Uncaught Error: Too few arguments to function test(), 0 passed in...
```

#### 增加了一个返回void的类型

```php
<?php
function swap(&$left, &$right) : void
{
    if ($left === $right) {
        return;
    }
    $tmp = $left;
    $left = $right;
    $right = $tmp;
}
$a = 1;
$b = 2;
var_dump(swap($a, $b), $a, $b);
```

#### 多异常捕获处理

这个功能还是比较常用的，在日常开发之中

```php
<?php
try {
    // some code
} catch (FirstException | SecondException $e) {  
    //用 | 来捕获FirstException异常，或者SecondException 异常
}
```

### Symmetric array destructuring

短数组语法（[]）现在作为list()语法的一个备选项，可以用于将数组的值赋给一些变量（包括在foreach中）。

```php
<?php
$data = [
    [1, 'Tom'],
    [2, 'Fred'],
];
 
// list() style
list($id1, $name1) = $data[0];
 
// [] style
[$id1, $name1] = $data[0];
 
// list() style
foreach ($data as list($id, $name)) {
    // logic here with $id and $name
}
 
// [] style
foreach ($data as [$id, $name]) {
    // logic here with $id and $name
}
```

### 类常量可见性

现在起支持设置类常量的可见性。

```php
<?php
class ConstDemo
{
    const PUBLIC_CONST_A = 1;
    public const PUBLIC_CONST_B = 2;
    protected const PROTECTED_CONST = 3;
    private const PRIVATE_CONST = 4;
}
```

### list()现在支持键名

现在list()和它的新的[]语法支持在它内部去指定键名。

这意味着它可以将任意类型的数组 都赋值给一些变量（与短数组语法类似）

```php
<?php
$data = [
    ["id" => 1, "name" => 'Tom'],
    ["id" => 2, "name" => 'Fred'],
];
 
// list() style
list("id" => $id1, "name" => $name1) = $data[0];
 
// [] style
["id" => $id1, "name" => $name1] = $data[0];
 
// list() style
foreach ($data as list("id" => $id, "name" => $name)) {
    // logic here with $id and $name
}
 
// [] style
foreach ($data as ["id" => $id, "name" => $name]) {
    // logic here with $id and $name
}
```



