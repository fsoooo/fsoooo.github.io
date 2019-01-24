laravel国外最火的框架，语法优雅。使用了大量设计模式，框架完全符合设计模式的五大基本原则（面向对象设计模式有5大基本原则：单一职责原则、开发封闭原则、依赖倒置原则、接口隔离原则、Liskov替换原则。），模块之间耦合度很低，服务容器可以方便的扩展框架功能以及编写测试。能快速开发出功能，自带各种方便的服务，比如数据验证、队列、缓存、数据迁移、测试、artisan 命令行等等，还有强大的 ORM 。

Laravel注重代码的模块化和可扩展性。你可以在包含超过5500个程序包的Packalyst目录中找到你想要添加的任何文件。Laravel的目标是让你能够找到任何想要的文件。

laravel框架还提供微服务和程序接口：Lumen是一个由laravel衍生的专注于精简的微框架。它高性能的程序接口可让你更加简单快速的开发微型项目。Lumen使用最小的配置集成了所有laravel的重要特性，你可以通过将代码复制到laravel项目的方式将完整的框架迁移过来。

1.语法更富有表现力

2.高质量的文档

3.丰富的扩展包

4.Laravel是完全开源的，代码托管在Github上

5.强大的路由系统

6.Blade模板引擎

7.合理的ORM model层，Eloquent ORM

8.migration 数据库迁移系统（数据库版本控制）和填充（seeding）

9.使用composer包管理工具，方便使用丰富的扩展包

10.artisan命令号工具，高度自动化

11.代码比较明白易懂，跟英语句子差不多，很多方法都不用看文档直接就能推算出来，关键词就是函数。举个例子，获取数据库中某个表的所有数据：

```php
$article=new Article;
$articles=$article->all();  //这样就得到了articles表所有记录的所有字段；
$count = $article->where('class_id','=', 1)->count(); //是不是一看就明白了意思？查找分类id为1的记录，并计算出个数。
```

12.文档非常丰富，社区也是非常活跃，现在全球范围内占有率最高，基本上所有的问题都可以找到答案；

13.大量的第三方开源库（composer收录的超过5500个包），可以快速方便的实现模块功能，第三方优秀的包官方都有详细使用手册。例如：laravel/collective

14.安全机制非常齐全，提交表单的数据验证（验证有差不多80种，能想到的基本都有），提交数据时产生随机_token验证，避免非法提交,能避免跨域攻击和SQL注入；

15.中间件和路由，对访问进行过滤及控制，调用函数类和方法前进行判断请求的合法性，避免非法请求；

16.错误处理机制简单好用，如果出错直接调用$error->all()，即可输出全部错误，对表单验证尤其好用；

17.Laravel Debugbar 在 Laravel 5 中集成了 [PHP Debug Bar](http://phpdebugbar.com/)，用于显示调试及错误信息以方便开发。该扩展包包含了一个 ServiceProvider 用于注册调试条及开发过程中数据集合显示，你可以发布其前端资源和配置，还可以配置显示重定向及 Ajax 请求。

18.Laravel 集成了 [Monolog](https://github.com/Seldaek/monolog) 日志函数库，Monolog 支持和提供多种强大的日志处理功能。

19.数据库事务比较好用

20.读写分离，任务调度（定时），缓存（redis），异步队列，监听使用简单

**Laravel的主要技术特点：**

1、Bundle是Laravel的扩展包组织形式或称呼。Laravel的扩展包仓库已经相当成熟了，可以很容易的帮你把扩展包（bundle）安装到你的应用中。你可以选择下载一个扩展包（bundle）然后拷贝到bundles目录，或者通过命令行工具“Artisan”自动安装。
2、在Laravel中已经具有了一套高级的PHP ActiveRecord实现 -- Eloquent ORM。它能方便的将“约束（constraints）”应用到关系的双方，这样你就具有了对数据的完全控制，而且享受到ActiveRecord的所有便利。Eloquent原生支持Fluent中查询构造器（query-builder）的所有方法。
3、应用逻辑（Application Logic）可以在控制器（controllers）中实现，也可以直接集成到路由（route）声明中，并且语法和Sinatra框架类似。Laravel的设计理念是：给开发者以最大的灵活性，既能创建非常小的网站也能构建大型的企业应用。
4、反向路由（Reverse Routing）赋予你通过路由（routes）名称创建链接（URI)的能力。只需使用路由名称（route name），Laravel就会自动帮你创建正确的URI。这样你就可以随时改变你的路由（routes），Laravel会帮你自动更新所有相关的链接。
5、Restful控制器（Restful Controllers）是一项区分GET和POST请求逻辑的可选方式。比如在一个用户登陆逻辑中，你声明了一个get_login()的动作（action）来处理获取登陆页面的服务；同时也声明了一个post_login()动作（action）来校验表单POST过来的数据，并且在验证之后，做出重新转向（redirect）到登陆页面还是转向控制台的决定。
6、自动加载类（Class Auto-loading）简化了类（class）的加载工作，以后就可以不用去维护自动加载配置表和非必须的组件加载工作了。当你想加载任何库（library）或模型（model）时，立即使用就行了，Laravel会自动帮你加载需要的文件。
7、视图组装器（View Composers）本质上就是一段代码，这段代码在视图（View）加载时会自动执行。最好的例子就是博客中的侧边随机文章推荐，“视图组装器”中包含了加载随机文章推荐的逻辑，这样，你只需要加载内容区域的视图（view）就行了，其它的事情Laravel会帮你自动完成。
8、反向控制容器（IoC container）提供了生成新对象、随时实例化对象、访问单例（singleton）对象的便捷方式。反向控制（IoC）意味着你几乎不需要特意去加载外部的库（libraries），就可以在代码中的任意位置访问这些对象，并且不需要忍受繁杂、冗余的代码结构。
9、迁移（Migrations）就像是版本控制（version control）工具，不过，它管理的是数据库范式，并且直接集成在了Laravel中。你可以使用“Artisan”命令行工具生成、执行“迁移”指令。当你的小组成员改变了数据库范式的时候，你就可以轻松的通过版本控制工具更新当前工程，然后执行“迁移"指令即可，好了，你的数据库已经是最新的了！
10、单元测试（Unit-Testing）是Laravel中很重要的部分。Laravel自身就包含数以百计的测试用例，以保障任何一处的修改不会影响其它部分的功能，这就是为什么在业内Laravel被认为是最稳版本的原因之一。Laravel也提供了方便的功能，让你自己的代码容易的进行单元测试。通过Artisan命令行工具就可以运行所有的测试用例。
11、自动分页（Automatic Pagination）功能避免了在你的业务逻辑中混入大量无关分页配置代码。方便的是不需要记住当前页，只要从数据库中获取总的条目数量，然后使用limit/offset获取选定的数据，最后调用‘paginate'方法，让Laravel将各页链接输出到指定的视图（View)中即可，Laravel会替你自动完成所有工作。Laravel的自动分页系统被设计为容易实现、易于修改。虽然Laravel可以自动处理这些工作，但是不要忘了调用相应方法和手动配置分页系统哦！

**HTTP路径**
Laravel拥有类似于Ruby on Rails的，快速、高效的路由系统。它可以让用户通过在浏览器上输入路径的方式让应用程序的各部分相关联。

**HTTP中间件**

```
Route::get('/', function () { 
  return 'Hello World'; 
});
```

应用程序可受到中间件的保护――中间件会处理分析和过滤服务器上的HTTP请求。你可以安装中间件，用于验证注册用户，并避免如跨站脚本(XSS)或其它的安全状况的问题。

```
<?php 
namespace App\Http\Middleware; 
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

**缓存**你的应用程序可得到一个健壮的缓存系统，通过对其进行调整，可以让应用程序的加载更加快速，这可以给你的用户提供最好的使用体验。

```
Cache::extend('mongo', function($app) { 
  return Cache::repository(new MongoStore);
});
```

**身份验证**
安全是至关重要的。Laravel自带对本地用户的身份验证，并可以使用“remember” 选项来记住用户。它还可以让你例如一些额外参数，例如显示是否为活跃的用户。

```
if (Auth::attempt(['email' => $email, 'password' => $password, 'active' => 1 ], $remember)) { 
  // The user is being remembered... 
}
```

**各种集成**
Laravel Cashier可以满足你要开发支付系统所需要的一切需求。除此之外，它还同步并集成了用户身份验证系统。所以，你不再需要担心如何将计费系统集成到开发当中了。

```
$user = User::find(1);
$user->subscription('monthly')->create($creditCardToken);
```

**任务自动化**
Elixir是一个可让我们使用Gulp定义任务的Laravel程序接口，我们可以使用Elixir定义可精简CSS 和JavaScript的预处理器。

```
elixir(function(mix) { 
  mix.browserify('main.js');
 });
```


**加密**
一个安全的应用程序应该做到可把数据进行加密。使用Laravel，可以启用OpenSSL安全加密算法AES-256-CBC来满足你所有的需求。另外，所有的加密值都是由检测加密信息是否被改变的验证码所签署的。

```
use Illuminate\Contracts\Encryption\DecryptException; 
try { 
  $decrypted = Crypt::decrypt($encryptedValue);
} catch (DecryptException $e) { 
  // 
}
```

**事件处理**
应用程序中事件的定义、记录和聆听都非常迅速。EventServiceProvider事件中的listen包含记录在你应用程序上所有事件的列表。

```
protected $listen = [
 'App\Events\PodcastWasPurchased' => [ 
   'App\Listeners\EmailPurchaseConfirmation',
 ],
];
```

**分页**
在Laravel中分页是非常容易的因为它能够根据用户的浏览器当前页面生成一系列链接。

```
<?php 
namespace App\Http\Controllers; 
use DB; 
use App\Http\Controllers\Controller; 
class UserController extends Controller { 
 public function index() { 
  $users = DB::table('users')->paginate(15);
  return view('user.index', ['users' => $users]);
 }
}
```

**对象关系化映射（ORM）**Laravel包含一个处理数据库的层，它的对象关系化映射被称为Eloquent。另外这个也适用于PostgreSQL。

```
$users = User::where('votes', '>', 100)->take(10)->get();
foreach ($users as $user) { 
 var_dump($user->name);
}
```

**单元测试**
单元测试的开发是一个耗费大量时间的任务，但是它却是保证我们的应用程序保持正常工作的关键。Laravel中可使用PHPUnit执行单元测试。

```
<php 
use Illuminate\Foundation\Testing\WithoutMiddleware; 
use Illuminate\Foundation\Testing\DatabaseTransactions; 
class ExampleTest extends TestCase { 
 public function testBasicExample() { 
  $this->visit('/')->see('Laravel 5')->dontSee('Rails');
 }
}
```

**待办事项清单**
Laravel提供在后台使用待办事项清单（to do list）处理复杂、漫长流程的选择。它可以让我们异步处理某些流程而不需要用户的持续导航。

```
Queue :: push ( new SendEmail ( $ message ));
```
