Laravel 是一个有着美好前景的年轻框架，它的社区充满着活力，相关的文档和教程完整而清晰，并为快速、安全地开发现代应用程序提供了必要的功能。在近几年对PHP 框架流行度的统计中，Laravel始终遥遥领先。那么是什么让Laravel成为最成功的PHP框架？
        2011 年，Taylor Otwell将Laravel作为一种包含全新现代方法的框架介绍给大家。Laravel最初的设计是为了面向MVC架构的，它可以满足如事件处理、用户 身份验证等各种需求。另外它还有一个由管理数据库强力支持，用于管理模块化和可扩展性代码的软件包管理器。Laravel以其简洁、优雅的特性赢得了大家 的广泛关注，无论是专家还是新手，在开发PHP项目的时候，都会第一时间的想到Laravel。本文我们将讨论为什么Laravel会成为最成功的PHP框架。

## 模块化和可扩展性
 Laravel注重代码的模块化和可扩展性。你可以在包含超过5500个程序包的Packalyst目录中找到你想要添加的任何文件。Laravel的目标是让你能够找到任何想要的文件。

## 微服务和程序接口
 Lumen是一个由laravel衍生的专注于精简的微框架。它高性能的程序接口可让你更加简单快速的开发微型项目。Lumen使用最小的配置集成了所有laravel的重要特性，你可以通过将代码复制到laravel项目的方式将完整的框架迁移过来。

```php
<?php
$app->get('/', function() {
   return view('lumen');
});
$app->post('framework/{id}', function($framework) {
   $this->dispatch(new Energy($framework));
});
```

## HTTP路径
 Laravel拥有类似于Ruby on Rails的，快速、高效的路由系统。它可以让用户通过在浏览器上输入路径的方式让应用程序的各部分相关联。

## HTTP中间件

```php
Route::get('/', function () { 
   return 'Hello World'; 
});
```
应用程序可受到中间件的保护——中间件会处理分析和过滤服务器上的HTTP请求。你可以安装中间件，用于验证注册用户，并避免如跨站脚本(XSS)或其它的安全状况的问题。

```php
<?php 
namespace App/Http/Middleware; 
use Closure; 
class OldMiddleware { 
  public function handle($request, Closure $next) { 
    if ($request->input('age') <= 200) { 
         return redirect('home'); 
    } 
    return $next($request);
  }
}
```

## 缓存
你的应用程序可得到一个健壮的缓存系统，通过对其进行调整，可以让应用程序的加载更加快速，这可以给你的用户提供最好的使用体验。

```php
Cache::extend('mongo', function($app) { 
   return Cache::repository(new MongoStore);
});
```

## 身份验证
安全是至关重要的。Laravel自带对本地用户的身份验证，并可以使用“remember” 选项来记住用户。它还可以让你例如一些额外参数，例如显示是否为活跃的用户。

```php
if (Auth::attempt(['email' => $email, 'password' => $password, 'active' => 1 ], $remember)) { 
   // The user is being remembered... 
}
```

## 各种集成
 Laravel Cashier可以满足你要开发支付系统所需要的一切需求。除此之外，它还同步并集成了用户身份验证系统。所以，你不再需要担心如何将计费系统集成到开发当中了。

```php
$user = User::find(1);
$user->subscription('monthly')->create($creditCardToken);
```

## 任务自动化

Elixir是一个可让我们使用Gulp定义任务的Laravel程序接口，我们可以使用Elixir定义可精简CSS 和JavaScript的预处理器。

```php
elixir(function(mix) { 
   mix.browserify('main.js');
 });
```

## 加密
一个安全的应用程序应该做到可把数据进行加密。使用Laravel，可以启用OpenSSL安全加密算法AES-256-CBC来满足你所有的需求。另外，所有的加密值都是由检测加密信息是否被改变的验证码所签署的。

```php
use Illuminate/Contracts/Encryption/DecryptException; 
try { 
   $decrypted = Crypt::decrypt($encryptedValue);
} catch (DecryptException $e) { 
   // 
}
```

## 事件处理
应用程序中事件的定义、记录和聆听都非常迅速。**EventServiceProvider**事件中的listen包含记录在你应用程序上所有事件的列表。

```php
protected $listen = [
  'App/Events/PodcastWasPurchased' => [ 
     'App/Listeners/EmailPurchaseConfirmation',
  ],
];
```

## 分页

在Laravel中分页是非常容易的因为它能够根据用户的浏览器当前页面生成一系列链接。

```php
<?php 
namespace App/Http/Controllers; 
use DB; 
use App/Http/Controllers/Controller; 
class UserController extends Controller { 
  public function index() { 
    $users = DB::table('users')->paginate(15);
    return view('user.index', ['users' => $users]);
  }
}
```

## 对象关系化映射（ORM）

Laravel包含一个处理数据库的层，它的对象关系化映射被称为Eloquent。另外这个也适用于PostgreSQL。

```php
$users = User::where('votes', '>', 100)->take(10)->get();
foreach ($users as $user) { 
  var_dump($user->name);
}
```

## 单元测试

单元测试的开发是一个耗费大量时间的任务，但是它却是保证我们的应用程序保持正常工作的关键。Laravel中可使用**PHPUnit**执行单元测试。

```php
<php 
use Illuminate/Foundation/Testing/WithoutMiddleware; 
use Illuminate/Foundation/Testing/DatabaseTransactions; 
class ExampleTest extends TestCase { 
  public function testBasicExample() { 
    $this->visit('/')->see('Laravel 5')->dontSee('Rails');
  }

```

## 待办事项清单

Laravel提供在后台使用待办事项清单（to do list）处理复杂、漫长流程的选择。它可以让我们异步处理某些流程而不需要用户的持续导航。

```php
Queue::push(new  SendEmail ($message));
```
