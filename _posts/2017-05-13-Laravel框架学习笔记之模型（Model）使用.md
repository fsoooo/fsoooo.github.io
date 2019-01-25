```php
一.定义模型
1.命令
php artisan make:model User
 
如果你想要在生成模型时生成数据库迁移，可以使用--migration 或-m 选项：
php artisan make:model User --migration或-m
 
2.Eloquent使用的表名
默认规则是模型类名的复数作为与其对应的表名，除非在模型类中明确指定了其它名称
在model中定义
$table = 'my_flights';
 
3.主键
Eloquent 默认每张表的主键名为id ，你可以在模型类中定义一个$primaryKey 属性来覆盖该约定
 
4.时间戳
默认情况下，Eloquent 期望created_at 和updated_at 已经存在于数据表中，如果你不想要这些 Laravel自动管理的列，在模型类中设置$timestamps 属性为false
 
如果你需要自定义时间戳格式，设置模型中的$dateFormat 属性,该属性决定日期被如何存储到数据库中，以及模型被序列化为数组或 JSON 时日期的格式
 
 
二.常用方法
1.获取所有记录
$flights = Flight::all();
 
2.访问列值
$flight->name;
 
3.每一个 Eloquent 模型都是一个查询构建器,所以适用于数据库操作中查询的所有方法
如
$flights = App\Flight::where('active', 1)
->orderBy('name', 'desc')
->take(10)
->get();
 
三.集合
组块结果集
如果你需要处理成千上万个 Eloquent 结果，可以使用chunk 命令。chunk 方法会获取一个“组块”的 Eloquent 模型，并将其填充到给定闭包进行处理。使用chunk 方法能够在处理大量数据集合时有效减少内存消耗：
 
Flight::chunk(200, function ($flights) {
    foreach ($flights as $flight) {
        //
    }
});
 
四.单条记录/聚合结果
 
1.单条记录
// 通过主键获取模型...
$flight = App\Flight::find(1);
// 获取匹配查询条件的第一个模型...
$flight = App\Flight::where('active', 1)->first();
 
firstOrFail/firstOrFail //如果记录没找到,返回404错误
 
2.聚合结果
$count = App\Flight::where('active', 1)->count();
$max = App\Flight::where('active', 1)->max('price');
 
 
五.插入/更新记录
 
1.基本插入
$flight = new Flight;
$flight->name = $request->name;
$flight->save();
 
2.基本更新
$flight = App\Flight::find(1);
$flight->name = 'New Flight Name';
$flight->save();
 
3.批量赋值
批量赋值,需要在模型中指定$fillable或guarded属性,前者表示那些字段能被赋值,后者表示那些字段不能被赋值
 
class Flight extends Model{
    /**
    * 不能被批量赋值的属性
    *
    * @var array
    */
    protected $guarded = ['price'];
 
}
 
使用create 方法在数据库中插入一条新的记录,create 方法返回保存后的模型实例
$flight = App\Flight::create(['name' => 'Flight 10']);
 
4.firstOrCreate/firstOrNew
firstOrCreate 方法先尝试通过给定列/值对在数据库中查找记录，如果没有找到的话则通过给定属性创建一个新的记录
firstOrNew 方法和firstOrCreate 方法一样先尝试在数据库中查找匹配的记录，如果没有找到，则返回一个的模型实例。注意通过firstOrNew 方法返回的模型实例并没有持久化到数据库中，你还需要调用save 方法手动持久化
 
// 通过属性获取航班, 如果不存在则创建...
$flight = App\Flight::firstOrCreate(['name' => 'Flight 10']);
// 通过属性获取航班, 如果不存在初始化一个新的实例...
$flight = App\Flight::firstOrNew(['name' => 'Flight 10']);
 
六.删除模型
 
1.通过主键删除
App\Flight::destroy(1);
App\Flight::destroy([1, 2, 3]);
App\Flight::destroy(1, 2, 3);
 
2.where删除
$deletedRows = App\Flight::where('active', 0)->delete();
 
3.软删除
如删除是,如果数据表有deleted_at字段,如果该字段为非空,那么该模型就表示已经被软删除了.
 
在模型中启用软删除
class Flight extends Model{
    use SoftDeletes;
}
 
这样在调用delete时,将会启用软删除
 
4.判断模型是否被软删除
if ($flight->trashed()){....}
 
5.软删除的记录,在使用模型查询时将会自动从查询结果中排除掉,如果要包含软删除的记录
$flights = App\Flight::withTrashed()->where('account_id', 1)->get();
$flight->history()->withTrashed()->get()
 
6.只获取软删除的记录
$flights = App\Flight::onlyTrashed()->where('airline_id', 1)->get();
 
7.恢复软删除记录
$flight->restore();
App\Flight::withTrashed()->where('airline_id', 1)->restore();
$flight->history()->restore();
 
8.彻底从数据库中删除
// 强制删除单个模型实例...
$flight->forceDelete();
// 强制删除所有关联模型...
$flight->history()->forceDelete();
 
七.查询作用域
1.基本
public function scopePopular($query)
{
    return $query->where('votes', '>', 100);
}
 
调用
$users = App\User::popular()->orderBy('created_at')->get();
 
2.动态作用域
public function scopeOfType($query, $type)
{
    return $query->where('type', $type);
}
$users = App\User::ofType('admin')->get();
 
 
八.事件
Eloquent 模型可以触发事件，允许你在模型生命周期中的多个时间点调用如下这些方法： creating , created ,updating , updated , saving , saved , deleting , deleted , restoring , restored 。事件允许你在一个指定模型类每次保存或更新的时候执行代码。
 
一个新模型被首次保存的时候， creating 和created 事件会被触发。如果一个模型已经在数据库中存在并调用save/方法， updating/updated 事件会被触发。 举个例子，我们在服务提供者中定义一个 Eloquent 事件监听器，在事件监听器中，我们会调用给定模型的isValid 方法，如果模型无效会返回false 。如果从 Eloquent 事件监听器中返回false 则取消save/update 操作：
 
<?php
namespace App\Providers;
use App\User;
use Illuminate\Support\ServiceProvider;
class AppServiceProvider extends ServiceProvider{
    /**
    * 启动所有应用服务
    *
    * @return void
    */
    public function boot()
    {
        User::creating(function ($user) {
            if ( ! $user->isValid()) {
            return false;
            }
        });
    }
    /**
    * 注册服务提供者.
    *
    * @return void
    */
    public function register()
    {
        //
    }
}
```

