

## 什么是关联关系

这么说，一个数据库中表和表之间必然会存在一些联系，关联关系就是这个意思。

通过Eloquent我们可以方便的处理这些关系。

------

## 定义关联关系

### 一对一

比如说一个用户(User)会有一个手机(Phone),这种一对一的关系我们直接在User中定义一个phone方法就是可以了。

```php
namespace App;

use Illuminate\Database\Eloquent\Model;

class User extends Model{
    /**
     * 获取关联到用户的手机
     */
    public function phone()
    {
        return $this->hasOne('App\Phone');
        //在这个例子中Phone模型默认有一个user_id外键，
        //如果你希望重写这种约定，可以传递第二个参数到hasOne方法。
        return $this->hasOne('App\Phone', 'foreign_key');
        /*Eloquent 假设外键应该在父级上有一个与之匹配的id，换句话说，Eloquent 将会通过user表的id值去phone表中查询user_id与之匹配的Phone记录。如果你想要关联关系使用其他值而不是id，可以传递第三个参数到hasOne来指定自定义的主键：*/
        return $this->hasOne('App\Phone', 'foreign_key', 'local_key');
        //说白了就是hasOne('关联Eloquent', '被关联表的key', '本表key')
    }
}
```

使用时：

```php
//这样就可以获得phone的实例了
$phone = User::find(1)->phone;
```

### 相对的关联

一对一关联完了，我们就会想，user现在可以找到phone，那么我们怎么通过phone找到user。 
方法类似上面：

```php
namespace App;

use Illuminate\Database\Eloquent\Model;

class Phone extends Model{
    /**
     * 获取手机对应的用户
     */
    public function user()
    {
        /*，Eloquent 将会尝试通过Phone模型的user_id去User模型查找与之匹配的记录。Eloquent 通过关联关系方法名并在方法名后加_id后缀来生成默认的外键名。*/
        return $this->belongsTo('App\User');
        //参数类似上面的一对一
    }
}
```

### 一对多

比如说一片博客会有多条评论。hasMany 
通过文章访问评论。

```php
namespace App;

use Illuminate\Database\Eloquent\Model;

class Post extends Model{
    /**
     * 获取博客文章的评论
     */
    public function comments()
    {
        //类似hasOne存在如下参数
        return $this->hasMany('App\Comment', 'foreign_key', 'local_key');
    }
}
```

### 一对多（逆向）

通过评论访问文章。belongsTo

```php
namespace App;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model{
    /**
     * 获取评论对应的博客文章
     */
    public function post()
    {
        return $this->belongsTo('App\Post', 'foreign_key', 'other_key');
    }
}
```

### 多对多

> 一个用户有多个角色，同时一个角色被多个用户共用。例如，很多用户可能都有一个“Admin”角色。要定义这样的关联关系，需要三个数据表：users、roles和role_user，role_us 
> er表按照关联模型名的字母顺序命名，并且包含user_id和role_id两个列。

belongsToMany

就是两个表的数据是多对多的关系。 
a表的一个数据在b表可以查到多条数据，b表的数据也可以在a表查到多条数据。 
当然两个表的关系是通过一个中间表来组织起来的。 
中间表的默认命名方式为：a_b，可以修改 
多对多的逆向关联和正向是一样的。

用上面的例子：

对于User

```php
namespace App;

use Illuminate\Database\Eloquent\Model;

class User extends Model{
    /**
     * 用户角色
     */
    public function roles()
    {
        //可以看到第一个是关联的表，中间表，键，键
        return $this->belongsToMany('App\Role', 'user_roles', 'user_id', 'role_id');
    }
}
```

对于Role也一样。

```php
namespace App;

use Illuminate\Database\Eloquent\Model;

class Role extends Model{
    /**
     * 角色用户
     */
    public function users()
    {
        return $this->belongsToMany('App\User');
    }
}
```

**关于中间表**

上面提到了中间表，这里进行一下扩展：

如果我们想访问中间表的数据，可以使用pivot属性，他会获得一个中间表的实例。

```php
$user = App\User::find(1);

foreach ($user->roles as $role) {
    echo $role->pivot->created_at;
}
```

当然，在默认情况下通过pivot我们只能访问关联键也就是上例的user_id和role_id。 
要想访问其他列，例如上面的created_at需要在关联的时候定义。 
使如下方法定义：

```php
//如果想获得column1，column2
return $this->belongsToMany('App\Role')->withPivot('column1', 'column2');
//如果想获得created_at和updated_at
return $this->belongsToMany('App\Role')->withTimestamps();1234
```

同时，我们在关联的时候可以使用wherePivot和wherePivotIn方法过滤结果集。

```php
//要求中间表记录符合approved=1。
return $this->belongsToMany('App\Role')->wherePivot('approved', 1);
//要求中间表记录符合priority在1，2之中。
return $this->belongsToMany('App\Role')->wherePivotIn('priority', [1, 2]);
```

### 远层的一对多

总感觉’远层’打错字了……

比如说A学校的同学Tom发了一篇文章， 
学校表，学生表，文章表的关系是这样的： 
学校<->学生<->文章

所以说学校很文章没有直接的关联关系。但是通过学生有关联关系。 
所以当我们通过学校搜索文章的时候就需要用到远层关联。

```php
namespace App;

use Illuminate\Database\Eloquent\Model;

class School extends Model{
    /**
     * 获取指定学校的所有文章
     */
    public function posts()
    {
        //最终被关联的模型，中间模型，中间模型的外键，最终模型的外键
        return $this->hasManyThrough('App\Post', 'App\Student', 'country_id', 'user_id');
    }
}
```

### 多态关联

用户既可以对文章进行评论也可以对视频进行评论，使用多态关联，你可以在这两种场景下使用单个comments表。

两个重要的需要注意的列是 comments 表上的 commentable_id 和 commentable_type。commentable_id列对应 Post 或Video 的 ID 值，而 commentable_type 列对应所属模型的类名。当访问 commentable 关联时，ORM 根据commentable_type 字段来判断所属模型的类型并返回相应模型实例。

在被关联表中使用morphTo()

```php
namespace App;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    /**
     * Get all of the owning commentable models.
     */
    public function commentable()
    {
        return $this->morphTo();
    }
}

class Post extends Model
{
    /**
     * Get all of the post's comments.
     */
    public function comments()
    {
        return $this->morphMany('App\Comment', 'commentable');
    }
}

class Video extends Model
{
    /**
     * Get all of the video's comments.
     */
    public function comments()
    {
        return $this->morphMany('App\Comment', 'commentable');
    }
}
```

使用:

```php
$post = App\Post::find(1);

foreach ($post->comments as $comment) {
    //
}
//或者直接取出对应的实例
$commentable = $comment->commentable;
```

**自定义多态类型**

上面有一个commentable_type这个列，在上面的方法中会被赋值：`App\Post`或者`App\Video`。

我们也可以自定义他，通过morphMap方法来：

```php
use Illuminate\Database\Eloquent\Relations\Relation;

Relation::morphMap([
    'posts' => App\Post::class,
    'videos' => App\Video::class,
]);
```

当然，我们需要在服务提供者中注册这个morphMap，例如常用的AppServiceProvider

### 多对多的多态关联

> 除了传统的多态关联，还可以定义“多对多”的多态关联，例如，一个博客的 Post 和 Video 模型可能共享一个 Tag模型的多态关联。使用对多对的多态关联允许你在博客文章和视频之间有唯一的标签列表。

表结构：

```
posts
    id - integer
    name - string

videos
    id - integer
    name - string

tags
    id - integer
    name - string

taggables
    tag_id - integer
    taggable_id - integer
    taggable_type - string
```

第一步先在Post和videos中添加morphToMany 方法：

```php
namespace App;

use Illuminate\Database\Eloquent\Model;

class Post extends Model{
    /**
     * 获取指定文章所有标签
     */
    public function tags()
    {
        return $this->morphToMany('App\Tag', 'taggable');
    }
}
```

```
namespace App;

use Illuminate\Database\Eloquent\Model;

class Video extends Model{
    /**
     * 获取指定文章所有标签
     */
    public function tags()
    {
        return $this->morphToMany('App\Tag', 'taggable');
    }
}
```



然后在Tag模型中每一个关联模型定义一个方法，例如，我们定义一个posts方法和videos方法：

```php
namespace App;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model{
    /**
     * 获取所有分配该标签的文章
     */
    public function posts()
    {
        return $this->morphedByMany('App\Post', 'taggable');
    }

    /**
     * 获取分配该标签的所有视频
     */
    public function videos()
    {
        return $this->morphedByMany('App\Video', 'taggable');
    }
}
```

使用时：

```php
$post = App\Post::find(1);

foreach ($post->tags as $tag) {
    //
}

//或者
$tag = App\Tag::find(1);

foreach ($tag->videos as $video) {
    //
}
```

------

## 关联查询

### 基本查询

其实上面已经用到，就是当关联关系建立了之后我们可以通过其中一个实例快速的获得其他它关联的实例。

比如说上面提到的post和user

```php
//先获得一个user
$user = App\User::find(1);
//通过关联关系或者他的post
$user->posts()->where('active', 1)->get();1234
```

当然，如果如果你不需要通过其他约束筛选post也可以直接使用属性来访问对应的user

```php
$user = App\User::find(1);

foreach ($user->posts as $post) {
    //
}
```

### 通过关联关系进行约束

有时你可能希望获得至少有一条comment的post。 
这时，如果你建立了两个表的关联关系，就可以通过has方法来进行筛选：

```php
/* comments是关联方法 */
// 获取所有至少有一条评论的文章...
$posts = App\Post::has('comments')->get();
// 获取所有至少有三条评论的文章...
// 关联方法，比较符，数值
$posts = Post::has('comments', '>=', 3)->get();
// 获取所有至少有一条评论获得投票的文章..
// 使用.来嵌套has：Post<->comment<->vote
$posts = Post::has('comments.votes')->get();
// 获取所有至少有一条评论包含foo字样的文章
// 使用闭包函数来实现高级查询，同样适合orWhereHas()
$posts = Post::whereHas('comments', function ($query) {
    $query->where('content', 'like', 'foo%');
})->get();
```

当然也可以查询没有comment的post, 
就是上面选项的反向选择。

```php
$posts = App\Post::doesntHave('comments')->get();
$posts = Post::whereDoesntHave('comments', function ($query) {
    $query->where('content', 'like', 'foo%');
})->get();
```

**统计关联模型**

就是说只获得关联的数目不获得具体信息 
简单的类似这样：

```php
$posts = App\Post::withCount('comments')->get();

foreach ($posts as $post) {
    echo $post->comments_count;
}
```

你可以像添加约束条件到查询一样来添加多个关联关系的“计数”：

```php
$posts = Post::withCount(['votes', 'comments' => function ($query) {
    $query->where('content', 'like', 'foo%');
}])->get();

echo $posts[0]->votes_count;
echo $posts[0]->comments_count;
```

### 渴求式加载

先要搞清楚什么是 **渴求式加载**什么是 **懒惰式加载**.

用用户和书的例子：

**懒惰式加载：**先搜索用户，当每次请求书时再搜索书。

**渴求式加载：**在搜索用户时主动搜索他的文章 
如果搜索到20个用户那么搜索次数为2. 
`select * from user where age > 20` 
`select * from book where user_id in (1, 2, 3, 4, 5, ...)`

所以对于在一定要获取被关联项的时候，可以使用渴求式加载:

```php
//使用with来设置渴求式加载的关联
$users = App\User::with('book')->get();

foreach ($users as $user) {
    echo $user->book->title;
}

//如果要加载多个：
$users = App\User::with('book', 'phone')->get();

//如果嵌套关联：book的出版社
$users = App\User::with('book.press')->get();

//带条件约束的渴求式加载
//书名必须含有first
$users = App\User::with(['book' => function ($query) {
    $query->where('title', 'like', '%first%');
}])->get();
```

有时后，我们需要对一个已经懒惰加载的实例的某个关联进行渴求式加载。 
使用load方法可以实现：

```php
$users = App\User::all();

if ($someCondition) {
    $users->load('book', 'phone');
}

$users->load(['book' => function ($query) {
    $query->orderBy('published_date', 'asc');
}]);
```

### 插入&更新

> 例如，也许你需要插入新的Comment到Post模型，你可以从关联关系的save方法直接插入Comment而不是手动设置Comment的post_id属性

使传入更新更方便：

```php
//感觉这个例子有点蠢
$comment = new App\Comment(['message' => 'A new comment.']);
$post = App\Post::find(1);
$post->comments()->save($comment);
//保存多个
$post->comments()->saveMany([
    new App\Comment(['message' => 'A new comment.']),
    new App\Comment(['message' => 'Another comment.']),
]);


//也可以使用create
$post = App\Post::find(1);

$comment = $post->comments()->create([
    'message' => 'A new comment.',
]);
```

**反向更新**

这时我自己起的名字，上面的父模型更新子模型我姑且认为是正向更新。 
所以通过子模型更新父模型我认为是反向更新。

总感觉有些不对。(怎么说。。。反向绑定？)

其实就是更新belongsTo关联的方法：

使用associate方法：

```php
$account = App\Account::find(10);
$user->account()->associate($account);
$user->save();
```

移除belongsTo关联：

```php
$user->account()->dissociate();
$user->save();
```

**多对多关联**

多对多的关系上面已经说了，因为存在一个中间表，所以必定比较复杂。

*附加*

比如想一个用户赋予一个新的身份。使用attach方法完成:

```php
//获得用户
$user = App\User::find(1);
//附加一个身份到用户
$user->roles()->attach($roleId);

//也可以这样来传递额外的字段
$user->roles()->attach($roleId, ['expires' => $expires]);
```

其实说白了就是在中间表插入一条用户和身份的关系。

*分离*

就是删除一个用户的某一身份：

```php
// 从指定用户中移除角色...
$user->roles()->detach($roleId);
// 从指定用户移除所有角色...
$user->roles()->detach();
```

其实就是删除中间表的一些记录。

为了方便，attach和detach还接收数组形式的 ID 作为输入：

```php
$user = App\User::find(1);
$user->roles()->detach([1, 2, 3]);
$user->roles()->attach([1 => ['expires' => $expires], 2, 3]);
```

*同步*

通过数组同步中间件，在同步过后中间表只保留数组中包含的记录。

```php
$user->roles()->sync([1, 2, 3]);
$user->roles()->sync([1 => ['expires' => true], 2, 3]);
//如果只想添加不想删除
$user->roles()->syncWithoutDetaching([1, 2, 3]);
```

*在中间表上保存额外数据*

```php
App\User::find(1)->roles()->save($role, ['expires' => $expires]);
```

*更新中间表记录*

```php
$user = App\User::find(1);
//外键，属性（数组）
$user->roles()->updateExistingPivot($roleId, $attributes);
```

### 触发父级时间戳

就是在子模型更新的时候更新父类的时间戳。 
比如说一片post添加了一个comment，这时更新一下post的updated_at. 
通过添加touches属性实现。

```php
namespace App;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model{
    /**
     * 要触发的所有关联关系
     *
     * @var array
     */
    protected $touches = ['post'];

    /**
     * 评论所属文章
     */
    public function post()
    {
        return $this->belongsTo('App\Post');
    }
}
```
