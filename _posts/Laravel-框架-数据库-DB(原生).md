我们使用laravel框架进行开发时，有时需要运行原生 的SQL来进行数据处理。laravelde DB 门面为每种操作提供了相应方法：select, update, insert, delete 和 statement。
**Select 查询**
运行一个最基本的查询，可以使用 DB 门面的 select 方法：
```
namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
class UserController extends Controller
{
    /**
    * 展示应用的用户列表.
    * @return Response
    */
    public function index()
    {
        $users = DB::select('select * from users where active = ?', [1]);
        return view('user.index', ['users' => $users]);
    }
}
```
传递给 select 方法的第一个参数是原生的 SQL 语句，第二个参数需要绑定到查询的参数绑定，通常，这些都是 where 子句约束中的值。参数绑定可以避免 SQL 注入攻击（输入参数校验由实现方控制，用户无法传递任意查询参数）。
select 方法以数组的形式返回结果集，数组中的每一个结果都是一个 PHP stdClass 对象：
![image](http://upload-images.jianshu.io/upload_images/6943526-44920863bf508b6c?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

可以这样访问结果值：
```
foreach ($users as $user) {
    echo $user->name;
}
```
**使用命名绑定**
除了使用 ? 占位符来代表参数绑定外，还可以使用命名绑定来执行查询：
$results = DB::select('select * from users where id = :id', ['id' => 1]);
**Insert插入**
使用 DB 门面的 insert 方法执行插入语句。和 select 一样，该方法将原生 SQL 语句作为第一个参数，将参数绑定作为第二个参数：
```
DB::insert('insert into users (id, name) values (?, ?)', [1, '1']);
```
**update更新**
update 方法用于更新数据库中已存在的记录，该方法返回受更新语句影响的行数：
```
$affected = DB::update('update users set votes = 100 where name = ?', ['1']);
```
**运行删除语句**
delete 方法用于删除数据库中已存在的记录，和 update 一样，该语句返回被删除的行数：
```
$deleted = DB::delete('delete from users');
```
**PS：使用 delete 和 update 语句时，需要非常小心，因为条件设置不慎，导致的后果有可能是无法挽回的，比如不带条件的 delete 语句删除的将是数据表的所有记录！这些都是有血淋淋的教训摆在前面的。**

**通用语句**
有些数据库语句不返回任何值，比如新增表，修改表，删除表等，对于这种类型的操作，可以使用 DB 门面的 statement 方法：
```
DB::statement('drop table users');
```
####监听查询事件
如果你想要获取应用中每次 SQL 语句的执行，可以使用 listen 方法，该方法对查询日志和调试非常有用，你可以在服务提供者中注册查询监听器：
```
namespace App\Providers;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
class AppServiceProvider extends ServiceProvider
{
    /**
    * Bootstrap any application services.
    * @return void
    */
    public function boot()
    {
        DB::listen(function ($query) {
            // $query->sql
            // $query->bindings
            // $query->time
        });
    }
}
```
