![](https://upload-images.jianshu.io/upload_images/6943526-95c3e13faaf1bcbe.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#HTTP请求—Request

###1.访问请求实例

在控制器中获取当前 HTTP 请求实例，需要在构造函数或方法中对 `Illuminate\Http\Request` 类进行依赖注入，这样当前请求实例会被服务容器自动注入：

```
<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller {

    public function store(Request $request) {
        $name = $request->input('name');
    }
}
```

###2.依赖注入 & 路由参数

如果还期望在控制器方法中获取路由参数，只需要将路由参数置于其它依赖之后即可，如下：

```
Route::put('user/{id}','UserController@update');
```

仍然可以对 Illuminate\Http\Request 进行依赖注入并通过如下方式定义控制器方法来访问路由参数 id:
```
<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller {

    public function update(Request $request, $id) {       
         echo $id;
    }
}
```


###3.通过路由闭包访问请求

可以在路由闭包中注入 Illuminate\Http\Request，在执行闭包函数的时候服务容器会自动注入输入请求：

```
<?php
use Illuminate\Http\Request;
Route::get('/', function (Request $request) {
    echo 9999;
});
```

###4.获取请求 URL和方法

想要获取完整的 URL，而不是路径，可以使用请求实例提供的 url 或 fullUrl 方法， url 方法返回不带查询字符串的 URL，而 fullUrl 方法返回结果则包含查询字符串：

```
<?php
// 不包含查询字符串
$url = $request->url();

// 包含查询字符串
$url_with_query = $request->fullUrl();

$method = $request->method(); // GET/POST
```
例如，我们请求 http://xxx.com/user/1?token=laravelacademy.org，则上述 $url 的值是 http://xxx.com/user/1

###5.获取请求输入

**1)、使用 all 方法以数组格式获取所有输入值：**

```
<?php
$input = $request->all();
```

**2)、获取单个输入值**

```

<?php
// 获取name的值
$name = $request->input('name'); 

// 获取name的值 设置默认值
$name = $request->input('name', '默认值');

// 处理表单数组输入时，可以使用“.”来访问数组
$input = $request->input('products.0.name'); 

```

**3)、从查询字符串中获取输入**

input 方法会从整个请求负载（包括查询字符串）中获取数值，query则只会从查询字符串中获取数值

```
<?php
// 获取name的值
$name = $request->query('name');

// 获取name的值 设置默认值
$name = $request->query('name', '默认值'); 

// 类似 all 方法所做的
$query = $request->query(); 
```

###6.通过动态属性获取输入

    
```
<?php
$name  =  $request->name;
```

**注意：**使用动态属性的时候，Laravel 首先会在请求中查找参数的值，如果不存在，还会到路由参数中查找。该功能的实现原理自然是魔术函数 __get。

###7.获取输入的部分数据

如果需要取出输入数据的子集，可以使用 only 或 except 方法，这两个方法都接收一个数组或动态列表作为唯一参数：

 ```
<?php
// 只需要的值
$input  =  $request->only(['username',  'password']);
$input  =  $request->only('username',  'password');
// 排除法所需要的值
$input  =  $request->except(['credit_card']);
$input  =  $request->except('credit_card');
```

**注：**only 方法返回所有你想要获取的参数键值对，不过，如果你想要获取的参数不存在，则对应参数会被过滤掉**.**

###8.判断请求参数是否存在

```
<?php
// 判断单个值是否存在
if  ($request->has('name'))  { // TODO
}

// 判断多个值是否存在
if  ($request->has(['name',  'email']))  {
 // TODO
}

// 如果你想要判断参数存在且参数值不为空
if  ($request->filled('name'))  { // TODO
}
```

###9.上一次请求输入
```

<?php
// 要从 Session 中取出上次请求的输入数据，可以使用 Request 实例提供的 old 方法
$username  =  $request->old('username');
```
**页面输出**

```
<input type="text" name="username" value="{{ old('username') }}">
```

###10.获取上传的文件

```
<?php
// 获取文件上传字段
$file = $request->file('photo');
$file = $request->photo;

// 判断是否存在
if ($request->hasFile('photo')) {
    //TODO
}

// 验证文件是否上传成功
if ($request->file('photo')->isValid()){
    //TODO
}

// 文件路径 & 扩展名
$path = $request->photo->path();
$extension = $request->photo->extension();
```

 <br/>

#HTTP响应—Response 

> 所有路由和控制器处理完业务逻辑之后都会返回一个发送到用户浏览器的响应，Laravel 提供了多种不同的方式来返回响应，最基本的响应就是从路由或控制器返回一个简单的字符串，框架会自动将这个字符串转化为一个完整的 HTTP 响应.

###1.字符串

```
<?php
Route::get('/', function () {
    return 'Hello World String All';
});
```

###2.数组

**除了从路由或控制器返回字符串之外，还可以返回数组。框架会自动将数组转化为一个 JSON 响应:**

```
<?php
Route::get('/', function () {
    return [1,2,3,4,5,6,7,8,9,10];
});
```

###3.Response 对象

**返回完整的 Response 实例允许你自定义响应的 HTTP 状态码和响应头信息。**

```
<?php
Route::get('home', function () {
    return response('Hello World Test', 200)
           ->header('Content-Type', 'text/plain');
});
```

###4.添加头信息

**大部分的响应方法都是可链式调用的，使得创建响应实例的过程更具可读性。**

```

<?php
return response($content)
            ->header('Content-Type', $type)
            ->header('X-Header-One', 'Header Val')
            ->header('X-Header-Two', 'Header Val');

```

**或者 使用 withHeaders 方法**

```
<?php
return response($content)
            ->withHeaders([
                'Content-Type' => $type,
                'X-Header-One' => 'Header Val',
                'X-Header-Two' => 'Header Val',
            ]);
```

###5.添加 Cookies 到响应

**可以使用响应上的 cookie 方法轻松地将为响应增加 Cookies：**

```
<?php
return response($content)
                ->header('Content-Type', $type)
                ->cookie('name', 'value', $minutes);
```

###6.重定向

**并且包含用户需要重定向至另一个 URL 所需的头信息。**
```
<?php
Route::get('admin', function () {
    return redirect('home/index');
});
```
**或者可以将用户重定向到之前的位置，提交的表单无效时，可以使用全局辅助函数 back 来执行此操作。**

```
<?php
Route::post('user/profile', function () {
    // 验证请求
    return back()->withInput();
});
```
###7.重定向到命名路由

```
<?php
// 以下三种方式进行操作
return redirect()->route('login');
return redirect()->route('profile', ['id' => 1]);
return redirect()->route('profile', [$user]);
```

###8.重定向到控制器

**需要把控制器和action的名称传递给 action 方法。**

```
<?php
// 不带参数的方法
return redirect()->action('HomeController@index');

// 传递参数的方法
return redirect()->action(
    'UserController@profile', ['id' => 1]);

// 重定向到应用外的域名
return redirect()->away('https://www.baidu.com');

// 重定向并使用闪存的 Session 数据,使用status把数据存入session中
Route::post('user/profile', function () {
    return redirect('dashboard')->with('status', 'Profile updated!');
});
```
###9.其它的响应

**视图响应**

```

<?php
return response()
            ->view('hello', $data, 200)
            ->header('Content-Type', $type);

```

**json响应**

```
<?php
return response()->json([
    'name'  => 'AAC',
    'state' => '200'
]);
```

**jsonp响应**

```
<?php
return response()
            ->json(['name' => 'Abigail', 'state' => 'CA'])
            ->withCallback($request->input('callback'));
```

###10.文件下载

**download 方法可以用于生成强制用户浏览器下载给定路径文件的响应**

```
<?php
return response()->download($pathToFile);

return response()->download($pathToFile, $name, $headers);

return response()->download($pathToFile)->deleteFileAfterSend();
```

![](https://upload-images.jianshu.io/upload_images/6943526-cb1494436a254cb5.gif?imageMogr2/auto-orient/strip)
