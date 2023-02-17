> RESTful是一种设计思想、一种普遍接受的规范。我们的资源控制器，和RESTful有着莫大的联系，要理解资源控制器，必须先了解RESTful。

![](https://upload-images.jianshu.io/upload_images/6943526-33aa8c425c7a5bd4.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


###前言

REST这个词，是Roy Thomas Fielding在他2000年的博士论文中提出的。

Fielding是一个非常重要的人，他是HTTP协议（1.0版和1.1版）的主要设计者、Apache服务器软件的作者之一、Apache基金会的第一任主席。所以，他的这篇论文一经发表，就引起了关注，并且立即对互联网开发产生了深远的影响。

Fielding将他对互联网软件的架构原则，定名为REST，即Representational State Transfer的缩写，翻译过来就是"表现层状态转移"，即资源在网络中以某种形式进行状态转移。

如果一个架构符合REST原则，就称它为RESTful架构。

要理解RESTful架构，最好的方法就是去理解Representational State Transfer这个词组到底是什么意思，它的每一个词代表了什么涵义。如果你把这个名称搞懂了，也就不难体会REST是一种什么样的设计。

>**Resource：资源，即数据。**
>**Representational：某种表现形式，比如用JSON，XML，JPEG等；**
>**State Transfer：状态变化。通过HTTP动词实现。**

###生成控制器

`Laravel`的资源控制器原生的支持了`RESTful`架构。其实laravel的资源控制器和其他控制器没什么直接区别，只是对控制器类的方法和结构略有规定，不过我们并不要手动创建资源控制器，我们可以利用laravel的命令行工具——`artisan`。

在`laravel`框架根目录下，通过命令行输入命令

```
php artisan make:controller ArticleController 
```

> 注意:在`laravel5.1`中用`php artisan`生成的控制器会有默认的方法`index`、`create`、`show`、`edit`...等等;

如果不是使用`Restful`不需要默认的方法可以在`laravel`框架根目录下，通过命令行输入命令

```
php artisan make:controller ArticleController --plain  
```

> laravel5.2以后生成控制器是默认没有`index`、`create`、`show`、`edit`..等几个方法的，如果想生成默认的方法 可以在`laravel`框架根目录下，通过命令行输入命令

```
php artisan make:controller ArticleController --resource  
```

就可以创建一个名为ArticleController 的资源控制器，文件默认在app/Http/Controllers下。

```
<?php
namespace App\Http\Controllers\Admin;
 
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
 
class ArticleController extends Controller
{
    /**
     * 显示文章列表.
     *
     * @return Response
     */
    public function index()
    {
        //
    }
 
    /**
     * 创建新文章表单页面
     *
     * @return Response
     */
    public function create()
    {
        //
    }
 
    /**
     * 将新创建的文章存储到存储器
     *
     * @param Request $request
     * @return Response
     */
    public function store(Request $request)
    {
        //
    }
 
    /**
     * 显示指定文章
     *
     * @param int $id
     * @return Response
     */
    public function show($id)
    {
        //
    }
 
    /**
     * 显示编辑指定文章的表单页面
     *
     * @param int $id
     * @return Response
     */
    public function edit($id)
    {
        //
    }
 
    /**
     * 在存储器中更新指定文章
     *
     * @param Request $request
     * @param int $id
     * @return Response
     */
    public function update(Request $request, $id)
    {
        //
    }
 
    /**
     * 从存储器中移除指定文章
     *
     * @param int $id
     * @return Response
     */
    public function destroy($id)
    {
        //
    }
}
```
>**注意：这几个方法不是自己随便定义的，是Resource路由规则规定好的，所以不要随便改变喔。**

我们打开ArticleController .php，发现里面已经写好了许多方法，比如index、create、show等等，这些方法分别是什么意思？如何在路由定义才能访问到？

<br/>

###配置路由

我们如果要在路由里定义一个资源控制器只需要一条：

```
// 普通注册
Route::resource('article', 'ArticleController');
 
// 限制指定路由
Route::resource('article', 'ArticleController', ['only' => [
    'index', 'show', 'store', 'update', 'destroy'
]]);

```

>**注意，这里的Route后面不再是get、post等，而是resource**

下面介绍下RESTful的跳转规则:

```
请求URL: /article
请求方式:GET  
默认进入控制器的方法:index()  
一般用于:页面展示/列表展示

请求URL: /article/create 
请求方式:GET  
默认进入控制器的方法:create()  
一般用于:添加/新建

请求URL: /article
请求方式:POST  
默认进入控制器的方法:store()

请求URL: /article/{id}/edit  
请求方式:GET  
默认进入控制器的方法:edit($id)
一般用于:修改页面

请求URL: /article/{id}  
请求方式:PUT  
PUT方法需要定义一个隐藏表单  
<input type="hidden" name="_method" value="put"/>  
默认进入控制器的方法:update($id) 
一般用于:接收修改的方法

请求URL: /article/{id}  
请求方式:GET  
默认进入控制器的方法:show($id)
一般用于:XX详情 

请求URL: /article/{id}  
请求方式:GET  
默认进入控制器的方法:destroy($id)
一般用于:删除
```
![](https://upload-images.jianshu.io/upload_images/6943526-8e727e91a70c860f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

<br/>

###举例
```
Route::resource('/article', 'ArticleController');  
```

当我访问地址`http://www.blog8090.com/article`，相当于访问控制器`ArticleController`的`index`方法。

当我访问地址`http://www.blog8090.com/article/create`，就会访问到`create`方法。

当我通过`POST`提交数据至地址`http://www.blog8090.com/article`，相当于由`store`方法处理。

现在理解了吗？通过资源控制器，我们很容易实现一个符合`RESTful`架构的接口，这种很适合作为`APP`后端开发时使用。这种规范下，不但访问策略清晰易理解，更容易维护。也使你的架构更为合理和现代化。

简单举例如果在路由中全部定义
```
Route::get('/article', 'ArticleController');  
Route::post('/article', 'ArticleController');  
Route::get('/articleEdit', 'ArticleController@edit');  
Route::post('/articleUp', 'ArticleController@up');  
Route::controller('/addarticle','ArticleController');  
```

和`Restful`写法(写一个路由可以包含很多种动作,当然有些特定方法不够用的时候也得指定方法)会让臃肿的路由更加简易

```
Route::resource('/article', 'ArticleController');  
Route::resource('/article_blog', 'ArticleController@blog'); 
```
<br/>
###补充
 如果需要额外再添加其他方法，可以 在资源路由前面 定义方法，如：
```
Route::post('test', 'ArticleController@test');
Route::resource('article', 'ArticleController');
```
>**注意：一定要放在resource资源路由上面哈**

![](https://upload-images.jianshu.io/upload_images/6943526-c343beacec7a7a93.gif?imageMogr2/auto-orient/strip)
