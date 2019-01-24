
第一步 composer 安装 
执行命令

```
curl -sS https://getcomposer.org/installer | php
```

第二步将composer设置为全局命令

```
mv composer.phar /usr/local/bin/composer
```

测试composer 正常则安装成功

```
composer
```

第三步进入 安装目录 编写composer.json 安装依赖包

```
cd /usr/local/bin/
vi composer.json
```

编辑添加json 比如

```
{
    "require": {
        "monolog/monolog": "1.0.*"
    }
}
```

这样就能安装composer依赖包了

执行命令

```
composer install
```

安装composer 依赖包

完成后 执行命令

```
composer global require "laravel/installer"
```

安装laravel

执行命令 laravel 测试命令是否正常，正常，可在项目目录执行命令

```
laravel new blog 
```

该命令将在当前目录下新建blog目录，里面存有崭新的laravel

如果出现permission denied 错误

比如

/root/.config/composer/vendor/bin/laravel /root/.config/composer/vendor/laravel/installer/laravel permission denied

错误请修改 laravel/installer 下laravel 权限 777

安装完laravel 后，需要修改storage 及其所有子文件目录权限777方可正常访问public目录

进入新安装的laravel blog 目录执行命令

```
chmod -R 777 ./storage
```

至此，访问public目录 出现laravel页面 安装完成 
