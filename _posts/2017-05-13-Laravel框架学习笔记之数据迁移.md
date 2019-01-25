# 数据库迁移 —— 以版本控制的方式维护数据表

### 简介

所谓迁移就像是数据库的版本控制，这种机制允许团队简单轻松的编辑并共享应用的数据库表结构。迁移通常和 Laravel 的 schema 构建器结对从而可以很容易地构建应用的数据库表结构。如果你曾经频繁告知团队成员需要手动添加列到本地数据库表结构以维护本地开发环境，那么这正是数据库迁移所致力于解决的问题。

Laravel 的 Schema 门面提供了与数据库系统无关的创建和操纵表的支持，在 Laravel 所支持的所有数据库系统中提供一致的、优雅的、流式的 API。

### 生成迁移

使用 Artisan 命令 `make:migration` 就可以创建一个新的迁移：

```
php artisan make:migration create_users_table
```

新的迁移位于 `database/migrations` 目录下，每个迁移文件名都包含时间戳从而允许 Laravel 判断其顺序。

`--table` 和 `--create` 选项可以用于指定表名以及该迁移是否要创建一个新的数据表。这些选项只需要简单放在上述迁移命令后面并指定表名：

```
php artisan make:migration create_users_table --create=users
php artisan make:migration add_votes_to_users_table --table=users
```

如果你想要指定生成迁移的自定义输出路径，在执行 `make:migration` 命令时可以使用 `--path` 选项，提供的路径应该是相对于应用根目录的。

### 迁移结构

迁移类包含了两个方法：`up` 和 `down`。`up` 方法用于新增表，列或者索引到数据库，而 `down` 方法就是 `up` 方法的逆操作，和 `up` 里的操作相反。

在这两个方法中你都要用到 Laravel 的 Schema 构建器来创建和修改表，要了解更多 Schema 构建器提供的方法，参考其[文档](http://laravelacademy.org/post/8179.html#toc_6)。下面让我们先看看创建 `flights` 表的简单示例：

```php
<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFlightsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('flights', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('airline');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('flights');
    }
}
```

### 运行迁移

要运行应用中所有未执行的迁移，可以使用 Artisan 命令提供的 `migrate` 方法：

```php
php artisan migrate
```

> 注：如果你正在使用 [Homestead 虚拟机](http://laravelacademy.org/post/7658.html)，需要在虚拟机中运行上面这条命令。

**在生产环境中强制运行迁移**

有些迁移操作是毁灭性的，这意味着它们可能造成数据的丢失，为了避免在生产环境数据库中运行这些命令，你将会在运行这些命令之前被提示并确认。想要强制运行这些命令而不被提示，可以使用 `--force` 标记：

```php
php artisan migrate --force
```

#### 回滚迁移

想要回滚最新的一次迁移”操作“，可以使用 `rollback` 命令，注意这将会回滚最后一批运行的迁移，可能包含多个迁移文件：

```
php artisan migrate:rollback
```

你也可以通过 `rollback` 命令上提供的 `step` 选项来回滚指定数目的迁移，例如，下面的命令将会回滚最后五条迁移：

```
php artisan migrate:rollback --step=5
```

`migrate:reset` 命令将会回滚所有的应用迁移：

```
php artisan migrate:reset
```

**在单个命令中回滚 & 迁移**

`migrate:refresh` 命令将会先回滚所有数据库迁移，然后运行 `migrate` 命令。这个命令可以有效的重建整个数据库：

```php
php artisan migrate:refresh

// 重建数据库并填充数据...
php artisan migrate:refresh --seed
```

当然，你也可以回滚或重建指定数量的迁移 —— 通过 `refresh` 命令提供的 `step` 选项，例如，下面的命令将会回滚或重建最后五条迁移：

```
php artisan migrate:refresh --step=5
```

**删除所有表 & 迁移**

`migrate:fresh` 命令将会先从数据库中删除所有表然后执行 `migrate` 命令：

```
php artisan migrate:fresh

php artisan migrate:fresh --seed
```

### 数据表

#### 创建表

使用 Schema 门面上的 `create` 方法来创建新的数据表。`create` 方法接收两个参数，第一个是表名，第二个是获取用于定义新表的 `Blueprint` 对象的闭包：

```
Schema::create('users', function ($table) {
    $table->increments('id');
});
```

当然，创建新表的时候，可以使用 Schema 构建器中的任意[列方法](http://laravelacademy.org/post/8179.html#toc_9)来定义数据表的列。

**检查表/列是否存在**

你可以轻松地使用 `hasTable` 和 `hasColumn` 方法检查表或列是否存在：

```
if (Schema::hasTable('users')) {
    //
}

if (Schema::hasColumn('users', 'email')) {
    //
}
```

**数据库连接 & 表选项**

如果你想要在一个数据库连接上执行表结构操作，而该数据库连接并不是默认数据库连接，可以使用 `connection` 方法：

```
Schema::connection('foo')->create('users', function (Blueprint $table) {
    $table->increments('id');
});
```

要设置表的存储引擎、字符编码等选项，可以在 Schema 构建器上使用如下命令：

| 命令                                     | 描述                            |
| ---------------------------------------- | ------------------------------- |
| `$table->engine = 'InnoDB';`             | 指定表的存储引擎（MySQL）       |
| `$table->charset = 'utf8';`              | 指定数据表的默认字符集（MySQL） |
| `$table->collation = 'utf8_unicode_ci';` | 指定数据表的字符序（MySQL）     |
| `$table->temporary();`                   | 创建临时表（除SQL Server）      |

#### 重命名/删除表

要重命名一个已存在的数据表，使用 `rename` 方法：

```
Schema::rename($from, $to);
```

要删除一个已存在的数据表，可以使用 `drop` 或 `dropIfExists` 方法：

```
Schema::drop('users');
Schema::dropIfExists('users');
```

**通过外键重命名表**

在重命名表之前，需要验证该表包含的外键在迁移文件中有明确的名字，而不是 Laravel 基于惯例分配的名字。否则，外键约束名将会指向旧的数据表。

### 数据列

#### 创建数据列

要更新一个已存在的表，使用 Schema 门面上的 `table` 方法，和 `create` 方法一样，`table` 方法接收两个参数：表名和获取用于添加列到表的 `Blueprint` 实例的闭包：

```
Schema::table('users', function (Blueprint $table) {
    $table->string('email');
});
```

**可用的数据列类型**

当然，Schema 构建器包含一系列你可以用来构建表的列类型：

| 命令                                       | 描述                                                         |
| ------------------------------------------ | ------------------------------------------------------------ |
| `$table->bigIncrements('id');`             | 等同于自增 UNSIGNED BIGINT（主键）列                         |
| `$table->bigInteger('votes');`             | 等同于 BIGINT 类型列                                         |
| `$table->binary('data');`                  | 等同于 BLOB 类型列                                           |
| `$table->boolean('confirmed');`            | 等同于 BOOLEAN 类型列                                        |
| `$table->char('name', 4);`                 | 等同于 CHAR 类型列                                           |
| `$table->date('created_at');`              | 等同于 DATE 类型列                                           |
| `$table->dateTime('created_at');`          | 等同于 DATETIME 类型列                                       |
| `$table->dateTimeTz('created_at');`        | 等同于 DATETIME 类型（带时区）列                             |
| `$table->decimal('amount', 5, 2);`         | 等同于 DECIMAL 类型列，带精度和范围                          |
| `$table->double('column', 15, 8);`         | 等同于 DOUBLE 类型列，带精度, 总共15位数字，小数点后8位      |
| `$table->enum('level', ['easy', 'hard']);` | 等同于 ENUM 类型列                                           |
| `$table->float('amount', 8, 2);`           | 等同于 FLOAT 类型列，带精度和总位数                          |
| `$table->geometry('positions');`           | 等同于 GEOMETRY 类型列                                       |
| `$table->geometryCollection('positions');` | 等同于 GEOMETRYCOLLECTION 类型列                             |
| `$table->increments('id');`                | 等同于自增 UNSIGNED INTEGER （主键）类型列                   |
| `$table->integer('votes');`                | 等同于 INTEGER 类型列                                        |
| `$table->ipAddress('visitor');`            | 等同于 IP 地址类型列                                         |
| `$table->json('options');`                 | 等同于 JSON 类型列                                           |
| `$table->jsonb('options');`                | 等同于 JSONB 类型列                                          |
| `$table->lineString('positions');`         | 等同于 LINESTRING 类型列                                     |
| `$table->longText('description');`         | 等同于 LONGTEXT 类型列                                       |
| `$table->macAddress('device');`            | 等同于 MAC 地址类型列                                        |
| `$table->mediumIncrements('id');`          | 等同于自增 UNSIGNED MEDIUMINT 类型列（主键）                 |
| `$table->mediumInteger('numbers');`        | 等同于 MEDIUMINT 类型列                                      |
| `$table->mediumText('description');`       | 等同于 MEDIUMTEXT 类型列                                     |
| `$table->morphs('taggable');`              | 添加一个 UNSIGNED INTEGER 类型的 `taggable_id` 列和一个 VARCHAR 类型的 `taggable_type` 列 |
| `$table->multiLineString('positions');`    | 等同于 MULTILINESTRING 类型列                                |
| `$table->multiPoint('positions');`         | 等同于 MULTIPOINT 类型列                                     |
| `$table->multiPolygon('positions');`       | 等同于 MULTIPOLYGON 类型列                                   |
| `$table->nullableMorphs('taggable');`      | `morphs()` 列的 nullable 版本                                |
| `$table->nullableTimestamps();`            | `timestamps()` 的别名                                        |
| `$table->point('position');`               | 等同于 POINT 类型列                                          |
| `$table->polygon('positions');`            | 等同于 POLYGON 类型列                                        |
| `$table->rememberToken();`                 | 等同于添加一个允许为空的 `remember_token` VARCHAR(100) 列    |
| `$table->smallIncrements('id');`           | 等同于自增 UNSIGNED SMALLINT （主键）类型列                  |
| `$table->smallInteger('votes');`           | 等同于 SMALLINT 类型列                                       |
| `$table->softDeletes();`                   | 新增一个允许为空的 `deleted_at` TIMESTAMP 列用于软删除       |
| `$table->softDeletesTz();`                 | 新增一个允许为空的 `deleted_at` TIMESTAMP （带时区）列用于软删除 |
| `$table->string('name', 100);`             | 等同于 VARCHAR 类型列，带一个可选长度参数                    |
| `$table->text('description');`             | 等同于 TEXT 类型列                                           |
| `$table->time('sunrise');`                 | 等同于 TIME 类型列                                           |
| `$table->timeTz('sunrise');`               | 等同于 TIME 类型（带时区）                                   |
| `$table->timestamp('added_on');`           | 等同于 TIMESTAMP 类型列                                      |
| `$table->timestampTz('added_on');`         | 等同于 TIMESTAMP 类型（带时区）列                            |
| `$table->timestamps();`                    | 添加允许为空的 `created_at` 和 `updated_at` TIMESTAMP 类型列 |
| `$table->timestampsTz();`                  | 添加允许为空的 `created_at` 和 `updated_at` TIMESTAMP 类型列（带时区） |
| `$table->tinyIncrements('numbers');`       | 等同于自增的 UNSIGNED TINYINT 类型列（主键）                 |
| `$table->tinyInteger('numbers');`          | 等同于 TINYINT 类型列                                        |
| `$table->unsignedBigInteger('votes');`     | 等同于无符号的 BIGINT 类型列                                 |
| `$table->unsignedDecimal('amount', 8, 2);` | 等同于 UNSIGNED DECIMAL 类型列，带有总位数和精度             |
| `$table->unsignedInteger('votes');`        | 等同于无符号的 INTEGER 类型列                                |
| `$table->unsignedMediumInteger('votes');`  | 等同于无符号的 MEDIUMINT 类型列                              |
| `$table->unsignedSmallInteger('votes');`   | 等同于无符号的 SMALLINT 类型列                               |
| `$table->unsignedTinyInteger('votes');`    | 等同于无符号的 TINYINT 类型列                                |
| `$table->uuid('id');`                      | 等同于 UUID 类型列                                           |
| `$table->year('birth_year');`              | 等同于 YEAR 类型列                                           |

#### 列修改器

除了上面列出的数据列类型之外，在添加列的时候还可以使用一些其它的列“修改器”，例如，要使列允许为 NULL，可以使用 `nullable` 方法：

```
Schema::table('users', function (Blueprint $table) {
    $table->string('email')->nullable();
});
```

下面是所有可用的列修改器列表，该列表不包含[索引修改器](http://laravelacademy.org/post/8179.html#toc_14)：

| 修改器                           | 描述                                               |
| -------------------------------- | -------------------------------------------------- |
| `->after('column')`              | 将该列置于另一个列之后 (MySQL)                     |
| `->autoIncrement()`              | 设置 INTEGER 列为自增主键                          |
| `->charset('utf8')`              | 指定数据列字符集（MySQL）                          |
| `->collation('utf8_unicode_ci')` | 指定数据列字符序（MySQL/SQL Server）               |
| `->comment('my comment')`        | 添加注释信息                                       |
| `->default($value)`              | 指定列的默认值                                     |
| `->first()`                      | 将该列置为表中第一个列 (MySQL)                     |
| `->nullable($value = true)`      | 允许该列的值为 NULL                                |
| `->storedAs($expression)`        | 创建一个存储生成列（MySQL）                        |
| `->unsigned()`                   | 设置 INTEGER 列为 UNSIGNED（MySQL）                |
| `->useCurrent()`                 | 设置 TIMESTAMP 列使用 CURRENT_TIMESTAMP 作为默认值 |
| `->virtualAs($expression)`       | 创建一个虚拟生成列（MySQL）                        |

#### 修改数据列

**先决条件**

在修改列之前，确保已经将 `doctrine/dbal` 依赖添加到 `composer.json` 文件，Doctrine DBAL 库用于判断列的当前状态并创建对列进行指定调整所需的 SQL 语句：

```
 composer require doctrine/dbal
```

**更新列属性**

`change` 方法允许你修改已存在的列为新的类型，或者修改列的属性。例如，你可能想要增加 字符串类型列的尺寸，下面让我们将 `name` 列的尺寸从 25 增加到 50：

```
Schema::table('users', function (Blueprint $table) {
    $table->string('name', 50)->change();
});
```

我们还可以修改该列允许 NULL 值：

```
Schema::table('users', function (Blueprint $table) {
    $table->string('name', 50)->nullable()->change();
});
```

> 注：只有以下数据列类型能修改：`bigInteger`, `binary`, `boolean`, `date`, `dateTime`, `dateTimeTz`, `decimal`, `integer`, `json`, `longText`, `mediumText`, `smallInteger`, `string`, `text`, `time`, `unsignedBigInteger`, `unsignedInteger` 和 `unsignedSmallInteger`。

**重命名列**

要重命名一个列，可以使用表结构构建器上的 `renameColumn` 方法，在重命名一个列之前，确保 `doctrine/dbal` 依赖已经添加到 `composer.json` 文件并且已经运行了 `composer update` 命令：

```
Schema::table('users', function (Blueprint $table) {
    $table->renameColumn('from', 'to');
});
```

> 注：暂不支持 `enum` 类型的列的修改和重命名。

#### 删除数据列

要删除一个列，使用 Schema 构建器上的 `dropColumn` 方法，同样，在此之前，确保已经安装了 `doctrine/dbal` 依赖：

```
Schema::table('users', function (Blueprint $table) {
    $table->dropColumn('votes');
});
```

你可以通过传递列名数组到 `dropColumn` 方法以便可以一次从数据表中删除多个列：

```
Schema::table('users', function (Blueprint $table) {
    $table->dropColumn(['votes', 'avatar', 'location']);
});
```

> 注：SQLite 数据库暂不支持在单个迁移中删除或修改多个列。

**有效的命令别名**

| 命令                           | 描述                                 |
| ------------------------------ | ------------------------------------ |
| `$table->dropRememberToken();` | 删除 `remember_token` 列             |
| `$table->dropSoftDeletes();`   | 删除 `deleted_at` 列                 |
| `$table->dropSoftDeletesTz();` | `dropSoftDeletes()` 方法别名         |
| `$table->dropTimestamps();`    | 删除 `created_at` 和 `updated_at` 列 |
| `$table->dropTimestampsTz();`  | `dropTimestamps()` 方法别名          |

### 索引

#### 创建索引

Schema 构建器支持多种类型的索引，首先，让我们看一个指定列值为唯一索引的例子。要创建该索引，可以使用 `unique` 方法：

```
$table->string('email')->unique();
```

此外，你可以在定义列之后创建索引，例如：

```
$table->unique('email');
```

你甚至可以传递列名数组到索引方法来创建组合索引：

```
$table->index(['account_id', 'created_at']);
```

Laravel 会自动生成合理的索引名称，不过你也可以传递第二个参数到该方法用于指定索引名称：

```
$table->index('email', 'unique_email');
```

**可用索引类型**

| 命令                                  | 描述                         |
| ------------------------------------- | ---------------------------- |
| `$table->primary('id');`              | 添加主键索引                 |
| `$table->primary(['first', 'last']);` | 添加组合索引                 |
| `$table->unique('email');`            | 添加唯一索引                 |
| `$table->index('state');`             | 添加普通索引                 |
| `$table->spatialIndex('location');`   | 添加空间索引（不支持SQLite） |

**索引长度 & MySQL / MariaDB**

Laravel 默认使用 `utf8mb4` 字符集，支持在数据库中存储 emoji 表情。如果你现在运行的 MySQL 版本低于 5.7.7（或者低于 10.2.2 版本的 MariaDB），需要手动配置迁移命令生成的默认字符串长度，以便 MySQL 为它们创建索引。你可以通过在 `AppServiceProvider` 中调用 `Schema::defaultStringLength` 方法来完成配置：

```
use Illuminate\Support\Facades\Schema;

/**
 * Bootstrap any application services.
 *
 * @return void
 * @translator laravelacademy.org
 */
public function boot()
{
    Schema::defaultStringLength(191);
}
```

作为可选方案，你可以为数据库启用 `innodb_large_prefix` 选项，至于如何合理启用这个选项，可以参考数据库文档说明。

#### 删除索引

要删除索引，必须指定索引名。默认情况下，Laravel 自动分配适当的名称给索引 —— 连接表名、列名和索引类型。下面是一些例子：

| 命令                                                     | 描述                                      |
| -------------------------------------------------------- | ----------------------------------------- |
| `$table->dropPrimary('users_id_primary');`               | 从 “users” 表中删除主键索引               |
| `$table->dropUnique('users_email_unique');`              | 从 “users” 表中删除唯一索引               |
| `$table->dropIndex('geo_state_index');`                  | 从 “geo” 表中删除普通索引                 |
| `$table->dropSpatialIndex('geo_location_spatialindex');` | 从 “geo” 表中删除空间索引（不支持SQLite） |

如果要传递数据列数组到删除索引方法，那么相应的索引名称将会通过数据表名、列和键类型来自动生成：

```
Schema::table('geo', function (Blueprint $table) {
    $table->dropIndex(['state']); // Drops index 'geo_state_index'
});
```

#### 外键约束

Laravel 还提供了创建外键约束的支持，用于在数据库层面强制引用完整性。例如，我们在`posts` 表中定义了一个引用 `users` 表 `id` 列的 `user_id` 列：

```
Schema::table('posts', function (Blueprint $table) {
    $table->integer('user_id')->unsigned();
    $table->foreign('user_id')->references('id')->on('users');
});
```

你还可以为约束的“on delete”和“on update”属性指定期望的动作：

```
$table->foreign('user_id')
      ->references('id')->on('users')
      ->onDelete('cascade');
```

要删除一个外键，可以使用 `dropForeign` 方法。外键约束和索引使用同样的命名规则 —— 连接表名、外键名然后加上“_foreign”后缀：

```
$table->dropForeign('posts_user_id_foreign');
```

或者，你还可以传递在删除时会自动使用基于惯例的约束名数值数组：

```
$table->dropForeign(['user_id']);
```

你可以在迁移时通过以下方法启用或关闭外键约束：

```
Schema::enableForeignKeyConstraints();
Schema::disableForeignKeyConstraints();
```

> 注：由于使用外键风险级联删除风险较高，一般情况下我们很少使用外键，而是通过代码逻辑来实现级联操作。
