![](https://upload-images.jianshu.io/upload_images/6943526-9a35b644b4b94eef.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

> 在最近的项目开发中，需要用到自定义的方法，也就是在Helper中创建自定义的辅助方法。

Laravel框架中的Helper方法其实就是普通的PHP函数，开发者可以从Laravel应用程序的任何部分来调用它，比如我们已经在该框架中使用内置的`route(),url(),view(),dd()`等方法一样，不需要引用任何PHP文件或者声明任何namespace来使用，如同奇迹般，他们可以在你的应用程序中的任何部件中使用。

接下来，我开始讲述用于自定义创建辅助方法的用例。

>**如果代码中多次使用了通用逻辑，可以把它们提取到辅助方法中。**

我常在Blade视图中使用辅助方法来简化格式设置，例如在数字前添加货币符号，或者在特定的数字中格式化显示，以及在应用程序中设置人性化的日期等。

###创建自定义辅助方法

在Laravel中，在app目录中创建一个文件，然后通过composer让应用程序启动时自动加载。

创建自定义辅助方法并非易事，在我的经验中，将功能放在Helpers.php中，然后将该文件放在app/Support/目录下（你可以根据自身情况在app中任何目录都可以）。

接下来，需要将该文件登记到位于composer.json，这个在项目根目录的文件中。

```
"autoload": {
        "files": [
            "app/Support/helpers.php"
        ],
        "classmap": [
            "database"
        ],
        "psr-4": {
            "App\\": "app/"
        }
    },
```

![](https://upload-images.jianshu.io/upload_images/6943526-096e99e4a671d052.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

<br/>

接下来，运行`composer dump-autoload`并重新启动应用程序，这样确保Helpers.php在Laravel启动时加载。

```
composer dump-autoload
```

这样，你可以在Helpers.php中创建一个方法，然后在应用程序中访问调用此方法。

Laravel 框架中的Helpers是一个非常方便且强大的功能，能够帮助开发者节约大量时间，这也是本文分享的初衷，希望更多人使用和创建自定义方法。

<br/>

Laravel 包含各种全局辅助函数。 

laravel 中包含大量辅助函数，您可以使用它们来简化开发工作流程。 

在这里，分享 10 个最好的 laravel 帮助函数：
```
array_dot() 
//array_dot() array_dot () 辅助函数允许你将多维数组转换为使用点符号的一维数组。

$array = [
 'user' =  ['username' =  'something'],
 'app' =  ['creator' =  ['name' =  'someone'], 'created' =  'today']
];

$dot_array = array_dot($array);
// [user.username] =  something, [app.creator.name] =  someone, [app.created] =  today
```
```
array_get() 
//array_get() 函数使用点符号从多维数组中检索值。

$array = [
 'user' =  ['username' =  'something'],
 'app' =  ['creator' =  ['name' =  'someone'], 'created' =  'today']
];

$name = array_get($array, 'app.creator.name');

// someone
如果 key 不存在，array_get() 函数还接受可选的第三个参数作为默认值。

$name = array_get($array, 'app.created.name', 'anonymous');
// anonymous
```

```
public_path() 

//public_path() 返回 Laravel 应用程序中公共目录的完全限定的绝对路径。 
//你还可以将路径传递到公共目录中的文件或目录以获取该资源的绝对路径。 
//它将简单地将public_path() 添加到你的参数中。
$public_path = public_path();
$path = public_path('js/app.js');
```
```
Str::orderedUuid() 

//Str::orderedUuid() 函数首先生成一个时间戳 uuid。 
//这个 uuid 可以存储在索引数据库列中。 
//这些 uuid 是基于时间戳创建的，因此它们会保留你的内容索引。 
//在 Laravel 5.6 中使用它时，会引发Ramsey\Uuid\Exception\UnsatisfiedDependencyException。 
//要解决此问题，只需运行以下命令即可使用 moontoast/math 包：

composer require "moontoast/math"
use Illuminate\Support\Str;

return (string) Str::orderByUuid()
// A timestamp first uuid
```
```
str_plural() 
//str_plural 函数将字符串转换为复数形式。该功能只支持英文。

echo str_plural('bank');
// banks

echo str_plural('developer');
// developers
```
```
route() 
//route() 函数为指定的路由生成路由 URL。

$url = route('login');
//如果路由接受参数，你可以简单地将它们作为第二个参数传递给一个数组。

$url = route('products', ['id' =  1]);
//如果你想产生一个相对的 URL 而不是一个绝对的 URL，你可以传递 false 作为第三个参数。

$url = route('products', ['id' =  1], false);
```
```
tap() 

//tap() 函数接受两个参数：一个值和一个闭包。
//该值将被传递给闭包，然后该值将被返回。闭包返回值无关紧要。

$user = App\User::find(1);

return tap($user, function($user) {
 $user- update([
  'name' =  'Random'
 ]);
});
//它不会返回布尔值，而是返回 User Model 。

//如果你没有传递闭包，你也可以使用 User Model 的任何方法。 
//无论实际返回的方法如何，返回值都将始终为值。 
//在下面的例子中，它将返回 User Model 而不是布尔值。 
//update 方法返回布尔值，但由于用了 tap ，所以它将返回 User Model。

$user = App\User::find(1);

return tap($user)- update([
  'name' =  'SomeName'
]);
```
```
dump() 

//dump() 函数会 dump 给定的变量，同时也支持同时传入多个变量。这对调试非常有用。

dump($var1);
dump($var1, $var2, $var3);
```
```
str_slug() 

//str_slug() 函数将给定的字符串生成一个 URL 友好的 slug。 
//你可以使用此功能为帖子或产品标题创建一个 slug。

$slug = str_slug('Helpers in Laravel', '-');
// helpers-in-laravel
```
```
optional() 

//optional() 函数接受一个参数，你可以调用参数的方法或访问属性。 
//如果传递的对象为 null，则方法和属性将返回 null，而不是导致错误或抛出异常。

$user = User::find(1);
return optional($user)- name;
```

##Happy Coding:)

![](https://upload-images.jianshu.io/upload_images/6943526-2f3d47667abb572b.gif?imageMogr2/auto-orient/strip)
