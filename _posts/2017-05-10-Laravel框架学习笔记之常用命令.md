#####1、控制器（Controller） or 模型（Model）
```
// 创建一个空控制器
php artisan make:controller BlogController
// 指定创建位置 在app目录下创建TestController
php artisan make:controller App\TestController
//创建model
php artisan make:model User //laravel会默认在app目录下创建model
// 指定路径创建model
php artisan make:Model App\\Models\\User(linux or macOs 加上转义符)
```
#####2、数据迁移（Migration）
```
// 创建迁移
php artisan make:migration create_users_table
// 指定路径
php artisan make:migration --path=app\providers create_users_table
// 一次性创建
// 下述命令会做两件事情：
// 在 app 目录下创建模型类 App\Post
// 创建用于创建 posts 表的迁移，该迁移文件位于 database/migrations 目录下。
php artisan make:model --migration Post
// 执行数据迁移
php artisan migrate
//复位并重新运行所有的迁移
php artisan migrate:refresh 
//回滚全部数据库迁移
php artisan migrate:reset 
//回滚最后一个数据库迁移
php artisan migrate:rollback 
```
#####3、数据填充（Seeder）
```
// 创建要填充的数据类
php artisan make:seeder UsersTableSeeder
// 数据填充（全部表）
php artisan db:seed
// 指定要填充的表
php artisan db:seed --class=UsersTableSeeder
```
#####4、路由（Route）
```
// 查看所有路由
php artisan route:list
//路由执行缓存
php artisan route:cache
//路由清除缓存
php artisan route:clear
```
#####5、第三方依赖（Composer）
```
//配置Composer中国镜像（CDN加速）：
composer config -g repo.packagist composer https://packagist.phpcomposer.com
//更新Laravel依赖库：
composer install || composer update
//自动加载
composer dump
```
#####6、配置（Config）
```
//清除Laravel配置缓存：
php artisan config:clear 
//缓存配置
php artisan config:cache
```
#####7、任务调度（Command）
```
//执行所有任务调度php artisan schedule:run 
```
#####8、异步队列（Jobs）
```
//进行下一个队列任务
php artisan queue:work
//列出全部失败的队列工作
php artisan queue:failed 
//创建一个迁移的失败的队列数据库工作表
php artisan queue:failed-table
//清除全部失败的队列工作
php artisan queue:flush
//删除一个失败的队列工作
php artisan queue:forget
//监听一个确定的队列工作
php artisan queue:listen
//重启现在正在运行的所有队列工作
php artisan queue:restart
//重试一个失败的队列工作
php artisan queue:retry
```
9、 自定义artisan命令行
```
// 以下命令生成文件 app/Console/Commands/TestCommand.php
php artisan make:command TestCommand --command=test:command
//在 app/Console/Kernel.php 文件里面, 添加以下
protected $commands = [
        Commands\TestCommand::class,
    ];
```
```
<?php
/**
 * Created by PhpStorm.
 * Users: wangsl
 * Date: 2017/10/29
 * Time: 17:07
 */
namespace App\Console\Commands;

use App\Models\Users;
use Illuminate\Console\Command;

class TestCommand extends Command
{
    /**
     * 1. 这里是命令行调用的名字, 如这里的: `topics:excerpt`,
     * 命令行调用的时候就是 `php artisan topics:excerpt`
     *
     * @var string
     */
    protected $signature = 'test:command';

    /**
     * 2. 这里填写命令行的描述, 当执行 `php artisan` 时
     *   可以看得见.
     *
     * @var string
     */
    protected $description = '测试命令行的描述';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * 这里是放要执行的代码
     *
     * @return mixed
     */
     public function handle()
    {
        $users = Users::all();
        $count = 0;
        foreach ($users as $user) {
            if (empty($users->remember_token)) {
                $operate = Users::find($user['id']);
                $operate->remember_token = md5(time() . "abcAbc");
                $operate->save();
                $count++;
            }
        }
        $this->info("Saved remember_token count: " . $count);
        $this->info("It's Done, have a good day.");
    }
}
```
```
//运行命令
php artisan test:command
```
执行结果
![微信截图_20181101173250.png](https://upload-images.jianshu.io/upload_images/6943526-f0aad35967c900da.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
