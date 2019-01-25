### 单一职责原则

一个类和方法只负责一项职责。

坏代码：

```
public function getFullNameAttribute()
{
    if (auth()->user() && auth()->user()->hasRole('client') && auth()->user()->isVerified()) {
        return 'Mr. ' . $this->first_name . ' ' . $this->middle_name . ' ' $this->last_name;
    } else {
        return $this->first_name[0] . '. ' . $this->last_name;
    }
}
```

好代码：

```
public function getFullNameAttribute()
{
    return $this->isVerifiedClient() ? $this->getFullNameLong() : $this->getFullNameShort();
}

public function isVerfiedClient()
{
    return auth()->user() && auth()->user()->hasRole('client') && auth()->user()->isVerified();
}

public function getFullNameLong()
{
    return 'Mr. ' . $this->first_name . ' ' . $this->middle_name . ' ' . $this->last_name;
}

public function getFullNameShort()
{
    return $this->first_name[0] . '. ' . $this->last_name;
}
```

### 胖模型、瘦控制器

如果你使用的是查询构建器或原生 SQL 查询的话将所有 DB 相关逻辑都放到 Eloquent 模型或 Repository 类。

坏代码：

```
public function index()
{
    $clients = Client::verified()
        ->with(['orders' => function ($q) {
            $q->where('created_at', '>', Carbon::today()->subWeek());
        }])
        ->get();

    return view('index', ['clients' => $clients]);
}
```

好代码：

```
public function index()
{
    return view('index', ['clients' => $this->client->getWithNewOrders()]);
}

Class Client extends Model
{
    public function getWithNewOrders()
    {
        return $this->verified()
            ->with(['orders' => function ($q) {
                $q->where('created_at', '>', Carbon::today()->subWeek());
            }])
            ->get();
    }
}
```

### 验证

将验证逻辑从控制器转移到请求类。

坏代码：

```
public function store(Request $request)
{
    $request->validate([
        'title' => 'required|unique:posts|max:255',
        'body' => 'required',
        'publish_at' => 'nullable|date',
    ]);

    ....
}
```

好代码：

```
public function store(PostRequest $request)
{    
    ....
}

class PostRequest extends Request
{
    public function rules()
    {
        return [
            'title' => 'required|unique:posts|max:255',
            'body' => 'required',
            'publish_at' => 'nullable|date',
        ];
    }
}
```

### 业务逻辑需要放到服务类

一个控制器只负责一项职责，所以需要把业务逻辑都转移到服务类中。

坏代码：

```
public function store(Request $request)
{
    if ($request->hasFile('image')) {
        $request->file('image')->move(public_path('images') . 'temp');
    }

    ....
}
```

好代码：

```
public function store(Request $request)
{
    $this->articleService->handleUploadedImage($request->file('image'));

    ....
}

class ArticleService
{
    public function handleUploadedImage($image)
    {
        if (!is_null($image)) {
            $image->move(public_path('images') . 'temp');
        }
    }
}
```

### DRY

尽可能复用代码，单一职责原则可以帮助你避免重复，此外，尽可能复用 Blade 模板，使用 Eloquent 作用域。

坏代码：

```
public function getActive()
{
    return $this->where('verified', 1)->whereNotNull('deleted_at')->get();
}

public function getArticles()
{
    return $this->whereHas('user', function ($q) {
            $q->where('verified', 1)->whereNotNull('deleted_at');
        })->get();
}
```

好代码：

```
public function scopeActive($q)
{
    return $q->where('verified', 1)->whereNotNull('deleted_at');
}

public function getActive()
{
    return $this->active()->get();
}

public function getArticles()
{
    return $this->whereHas('user', function ($q) {
            $q->active();
        })->get();
}
```

### 优先使用 Eloquent 和 集合

通过 Eloquent 可以编写出可读性和可维护性更好的代码，此外，Eloquent 还提供了强大的内置工具如软删除、事件、作用域等。

坏代码：

```
SELECT *
FROM `articles`
WHERE EXISTS (SELECT *
              FROM `users`
              WHERE `articles`.`user_id` = `users`.`id`
              AND EXISTS (SELECT *
                          FROM `profiles`
                          WHERE `profiles`.`user_id` = `users`.`id`) 
              AND `users`.`deleted_at` IS NULL)
AND `verified` = '1'
AND `active` = '1'
ORDER BY `created_at` DESC
```

好代码：

```
 Article::has('user.profile')->verified()->latest()->get();
```

### 批量赋值

关于批量赋值细节可查看[对应文档](http://laravelacademy.org/post/8194.html#toc_11)。

坏代码：

```
$article = new Article;
$article->title = $request->title;
$article->content = $request->content;
$article->verified = $request->verified;
// Add category to article
$article->category_id = $category->id;
$article->save();
```

好代码：

```
$category->article()->create($request->all());
```

### 不要在 Blade 执行查询 & 使用渴求式加载

坏代码：

```
@foreach (User::all() as $user)
    {{ $user->profile->name }}
@endforeach
```

好代码：

```
$users = User::with('profile')->get();

...

@foreach ($users as $user)
    {{ $user->profile->name }}
@endforeach
```

### 注释你的代码

坏代码：

```
if (count((array) $builder->getQuery()->joins) > 0)
```

好代码：

```
// Determine if there are any joins.
if (count((array) $builder->getQuery()->joins) > 0)
```

最佳：

```
if ($this->hasJoins())
```

### 将前端代码和 PHP 代码分离：

不要把 JS 和 CSS 代码写到 Blade 模板里，也不要在 PHP 类中编写 HTML 代码。

坏代码：

```
let article = `{{ json_encode($article) }}`;
```

好代码：

```
<input id="article" type="hidden" value="{{ json_encode($article) }}">

或者

<button class="js-fav-article" data-article="{{ json_encode($article) }}">{{ $article->name }}<button>
```

在 JavaScript 文件里：

```
let article = $('#article').val();
```

### 使用配置、语言文件和常量取代硬编码

坏代码：

```
public function isNormal()
{
    return $article->type === 'normal';
}

return back()->with('message', 'Your article has been added!');
```

好代码：

```
public function isNormal()
{
    return $article->type === Article::TYPE_NORMAL;
}

return back()->with('message', __('app.article_added'));
```

### 使用被社区接受的标准 Laravel 工具

优先使用 Laravel 内置功能和社区版扩展包，其次才是第三方扩展包和工具。这样做的好处是降低以后的学习和维护成本。

| 任务         | 标准工具                              | 第三方工具                       |
| ------------ | ------------------------------------- | -------------------------------- |
| 授权         | 策略类                                | Entrust、Sentinel等              |
| 编译资源     | Laravel Mix                           | Grunt、Gulp等                    |
| 开发环境     | Homestead                             | Docker                           |
| 部署         | Laravel Forge                         | Deployer等                       |
| 单元测试     | PHPUnit、Mockery                      | Phpspec                          |
| 浏览器测试   | Laravel Dusk                          | Codeception                      |
| DB           | Eloquent                              | SQL、Doctrine                    |
| 模板         | Blade                                 | Twig                             |
| 处理数据     | Laravel集合                           | 数组                             |
| 表单验证     | 请求类                                | 第三方扩展包、控制器中验证       |
| 认证         | 内置功能                              | 第三方扩展包、你自己的解决方案   |
| API认证      | Laravel Passport                      | 第三方 JWT 和 OAuth 扩展包       |
| 创建API      | 内置功能                              | Dingo API和类似扩展包            |
| 处理DB结构   | 迁移                                  | 直接操作DB                       |
| 本地化       | 内置功能                              | 第三方工具                       |
| 实时用户接口 | Laravel Echo、Pusher                  | 第三方直接处理 WebSocket的扩展包 |
| 生成测试数据 | 填充类、模型工厂、Faker               | 手动创建测试数据                 |
| 任务调度     | Laravel Task Scheduler                | 脚本或第三方扩展包               |
| DB           | MySQL、PostgreSQL、SQLite、SQL Server | MongoDB                          |

### 遵循 Laravel 命名约定

遵循 [PSR 标准](http://www.php-fig.org/psr/psr-2/)。此外，还要遵循 Laravel 社区版的命名约定：

| What               | How                                                    | Good                                    | Bad                                                 |
| ------------------ | ------------------------------------------------------ | --------------------------------------- | --------------------------------------------------- |
| 控制器             | 单数                                                   | ArticleController                       | ~~ArticlesController~~                              |
| 路由               | 复数                                                   | articles/1                              | ~~article/1~~                                       |
| 命名路由           | 下划线+'.'号分隔                                       | users.show_active                       | ~~users.show-active,show-active-users~~             |
| 模型               | 单数                                                   | User                                    | ~~Users~~                                           |
| 一对一关联         | 单数                                                   | articleComment                          | ~~articleComments,article_comment~~                 |
| 其他关联关系       | 复数                                                   | articleComments                         | ~~articleComment,article_comments~~                 |
| 数据表             | 复数                                                   | article_comments                        | ~~article_comment,articleComments~~                 |
| 中间表             | 按字母表排序的单数格式                                 | article_user                            | ~~user_article,article_users~~                      |
| 表字段             | 下划线，不带模型名                                     | meta_title                              | ~~MetaTitle; article_meta_title~~                   |
| 外键               | 单数、带_id后缀                                        | article_id                              | ~~ArticleId, id_article, articles_id~~              |
| 主键               | -                                                      | id                                      | ~~custom_id~~                                       |
| 迁移               | -                                                      | 2017_01_01_000000_create_articles_table | ~~2017_01_01_000000_articles~~                      |
| 方法               | 驼峰                                                   | getAll                                  | ~~get_all~~                                         |
| 资源类方法         | [文档](http://laravelacademy.org/post/7836.html#toc_6) | store                                   | ~~saveArticle~~                                     |
| 测试类方法         | 驼峰                                                   | testGuestCannotSeeArticle               | ~~test_guest_cannot_see_article~~                   |
| 变量               | 驼峰                                                   | $articlesWithAuthor                     | ~~$articles_with_author~~                           |
| 集合               | 复数                                                   | $activeUsers = User::active()->get()    | ~~$active, $data~~                                  |
| 对象               | 单数                                                   | $activeUser = User::active()->first()   | ~~$users, $obj~~                                    |
| 配置和语言文件索引 | 下划线                                                 | articles_enabled                        | ~~ArticlesEnabled; articles-enabled~~               |
| 视图               | 下划线                                                 | show_filtered.blade.php                 | ~~showFiltered.blade.php, show-filtered.blade.php~~ |
| 配置               | 下划线                                                 | google_calendar.php                     | ~~googleCalendar.php, google-calendar.php~~         |
| 契约（接口）       | 形容词或名词                                           | Authenticatable                         | ~~AuthenticationInterface, IAuthentication~~        |
| Trait              | 形容词                                                 | Notifiable                              | ~~NotificationTrait~~                               |

### 使用缩写或可读性更好的语法

坏代码：

```
$request->session()->get('cart');
$request->input('name');
```

好代码：

```
session('cart');
$request->name;
```

更多示例：

| 通用语法                                                     | 可读性更好的                                       |
| ------------------------------------------------------------ | -------------------------------------------------- |
| `Session::get('cart')`                                       | `session('cart')`                                  |
| `$request->session()->get('cart')`                           | `session('cart')`                                  |
| `Session::put('cart', $data)`                                | `session(['cart' => $data])`                       |
| `$request->input('name'), Request::get('name')`              | `$request->name, request('name')`                  |
| `return Redirect::back()`                                    | `return back()`                                    |
| `is_null($object->relation) ? $object->relation->id : null }` | `optional($object->relation)->id`                  |
| `return view('index')->with('title', $title)->with('client', $client)` | `return view('index', compact('title', 'client'))` |
| `$request->has('value') ? $request->value : 'default';`      | `$request->get('value', 'default')`                |
| `Carbon::now(), Carbon::today()`                             | `now(), today()`                                   |
| `App::make('Class')`                                         | `app('Class')`                                     |
| `->where('column', '=', 1)`                                  | `->where('column', 1)`                             |
| `->orderBy('created_at', 'desc')`                            | `->latest()`                                       |
| `->orderBy('age', 'desc')`                                   | `->latest('age')`                                  |
| `->orderBy('created_at', 'asc')`                             | `->oldest()`                                       |
| `->select('id', 'name')->get()`                              | `->get(['id', 'name'])`                            |
| `->first()->name`                                            | `->value('name')`                                  |

### 使用 IoC 容器或门面

自己创建新的类会导致代码耦合度高，且难于测试，取而代之地，我们可以使用 IoC 容器或门面。

坏代码：

```
$user = new User;
$user->create($request->all());
```

好代码：

```
public function __construct(User $user)
{
    $this->user = $user;
}

....

$this->user->create($request->all());   
```

### 不要从直接从 .env 获取数据

代码示例

`.env` 文件中设置：

```php
CDN_DOMAIN=cdndomain.com
```

`config/app.php` 文件中设置：

```php
'cdn_domain' => env('CDN_DOMAIN', null),
```

程序中两种获取 `相同配置` 的方法：

1. `env('CDN_DOMAIN')`
2. `config('app.cdn_domain')`

在此统一规定：所有程序配置信息 **必须** 通过 `config()` 来读取，所有的 `.env` 配置信息 **必须** 通过 `config()` 来读取，**绝不** 在配置文件以外的范围使用 `env()`。

传递数据到配置文件然后使用 `config` 辅助函数获取数据。

坏代码：

```
$apiKey = env('API_KEY');
```

好代码：

```
// config/api.php
'key' => env('API_KEY'),

// Use the data
$apiKey = config('api.key');
```

## 有何优势

这样做主要有以下几个优势：

1. 定义分明，`config()` 是配置信息，`env()` 只是用来区分不同环境；
2. 统一放置于 `config` 中还可以利用框架的 [配置信息缓存功能](http://d.laravel-china.org/docs/5.5/installation#configuration-caching) 来提高运行效率；
3. 代码健壮性， `config()` 在 `env()` 之上多出来一个抽象层，会使代码更加健壮，更加灵活。

### 以标准格式存储日期

使用访问器和修改器来编辑日期格式。

坏代码：

```
{{ Carbon::createFromFormat('Y-d-m H-i', $object->ordered_at)->toDateString() }}
{{ Carbon::createFromFormat('Y-d-m H-i', $object->ordered_at)->format('m-d') }}
```

好代码：

```
// Model
protected $dates = ['ordered_at', 'created_at', 'updated_at']
public function getMonthDayAttribute($date)
{
    return $date->format('m-d');
}

// View
{{ $object->ordered_at->toDateString() }}
{{ $object->ordered_at->monthDay }}
```

### 其他好的实践

不要把任何业务逻辑写到路由文件中。

在 Blade 模板中尽量不要编写原生 PHP。
