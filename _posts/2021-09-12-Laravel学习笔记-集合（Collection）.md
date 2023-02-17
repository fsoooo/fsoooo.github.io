![](https://upload-images.jianshu.io/upload_images/6943526-2f76a8098e450463.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

> Laravel Eloquent通常返回一个集合作为结果，集合包含很多有用的、功能强大的方法。你可以很方便的**对集合进行过滤、修改等操作**。
> 
> 集合并不仅限于eloquent ，也可以单独使用。但 Eloquent 的结果就是一个集合。你可以使用助手函数 collect 将数组转化为集合。

比如以下帖子模型，你找到所有php类别的帖子。
```
$posts=App\Post::where('category','php')->get();
```
上面的命令返回一个集合。 
集合是一个laravel类，它在内部使用数组函数并为它们添加许多功能。
你可以简单的使用 collect 方法创建一个集合，如下：
```
$collection=collect([
[
    'user_id'=>'1',
    'title'=>'Helpers in Laravel',
    'content'=>'Create custom helpers in Laravel','category'=>'php'
],

[
    'user_id'=>'2',
    'title'=>'Testing in Laravel',
    'content'=>'Testing File Uploads in Laravel',
    'category'=>'php'
],

[
    'user_id'=>'3',
    'title'=>'Telegram Bot',
    'content'=>'Crypto Telegram Bot in Laravel',
    'category'=>'php'
],
]);
```
上面的数组实际上是 Post 模型的值。 
当我们在 eloquent 集合上使用辅助方法时，不会再查询数据库。 
我们首先要从数据库中获取所有结果，然后我们使用集合方法来过滤和修改它们，而无需查询数据库。
###Filter()
filter，最有用的 laravel 集合方法之一，允许您使用回调过滤集合。 
它只传递那些返回 true 的项。
filter 返回一个新实例而不更改原始实例，它接受 value 和 key 作为回调中的两个参数。
```
$filter=$collection->filter(function($value,$key){
    if($value['user_id']==2){
        returntrue;
    }
});

$filter->all();
```
all 方法返回底层数组。 上面的代码返回以下响应。

```
<?php
[
    1=>[
        "user_id"=>2,
        "title"=>"Testing in Laravel",
        "content"=>"Testing File Uploads in Laravel",
        "category"=>"php"
    ]
]
```
###Search()
search 方法可以用给定的值查找集合。
如果这个值在集合中，会返回对应的键。
如果没有数据项匹配对应的值，会返回 false。
```
$names=collect(['Alex','John','Jason','Martyn','Hanlin']);

$names->search('Jason');

返回
// 2
```
search 方法默认使用松散比较。
你可以在它的第二个参数传 true 使用严格比较。你也可以传你自己的回调函数到 search 方法中。
将返回通过回调真值测试的第一个项的键。

```
$names=collect(['Alex','John','Jason','Martyn','Hanlin']);

$names->search(function($value,$key){
    returnstrlen($value)==6;
});

// 3
```

###Chunk()

chunk 方法将集合分割为多个给定大小的较小集合。将集合显示到网格中非常有用。
```
$prices=collect([18,23,65,36,97,43,81]);

$prices=$prices->chunk(3);

$prices->toArray();
```
以上代码生成效果。
```
[
    0=>[
        0=>18,
        1=>23,
        2=>65
    ],
    1=>[
        3=>36,
        4=>97,
        5=>43
    ],
    2=>[
        6=>81
    ]
]
```
###Dump()
dump 打印集合的方法。它可用于在任何位置的调试和查找集合内的内容。

```
$collection->whereIn('user_id',[1,2])
    ->dump()
    ->where('user_id',1);
```

###Map()
map 方法用于遍历整个集合。 
它接受回调作为参数。value 和 key 被传递给回调。 
回调可以修改值并返回它们。 
最后，返回修改项的新集合实例。
```
$changed=$collection->map(function($value,$key){
    $value['user_id']+=1;
    return$value;
});
return$changed->all();
```
基本上，它将 user_id 增加 1。
上面代码的响应如下所示。
```
[
    
    [
        
        "user_id" => 2,
        
        "title" => "Helpers in Laravel",
       "content" => "Create custom helpers in Laravel",
        
        "category" => "php"
    
    ],
    
    [
        
        "user_id" => 3,
        
        "title" => "Testing in Laravel",
     "content" => "Testing File Uploads in Laravel",
        
        "category" => "php"
    
    ],
    
    [
        
        "user_id" => 4,
        
        "title" => "Telegram Bot",
        
        "content" => "Crypto Telegram Bot in Laravel",
        
        "category" => "php"
    
    ]
];
```

###Zip()
Zip 方法会将给定数组的值与集合的值合并在一起。
相同索引的值会添加在一起，这意味着，数组的第一个值会与集合的第一个值合并。
在这里，我会使用我们在上面刚刚创建的集合。
这对 Eloquent 集合同样有效。
```
$zipped=$collection->zip([1,2,3]);

$zipped->all();
```
JSON 响应会像这样。

所以，基本上就是这样。
如果数组的长度小于集合的长度，Laravel 会给剩下的 Collection 类型的元素末尾添加 null。
类似地，如果数组的长度比集合的长度大，Laravel 会给 Collection 类型的元素添加 null，然后再接着数组的值。

###WhereNotIn()

您可以使用 whereNotIn 方法简单地按照给定数组中未包含的键值过滤集合。 
它基本上与 whereIn 相反。
 此外，此方法在匹配值时使用宽松比较 ==。
让我们过滤 $collection，其中 user_id 既不是 1 也不是 2 的。
```
$collection->whereNotIn('user_id',[1,2]);
```
上面的语句将只返回 $collection 中的最后一项。 
第一个参数是键，第二个参数是值数组。 
如果是 eloquent 的话，第一个参数将是列的名称，第二个参数将是一个值数组。

###Max()
max 方法返回给定键的最大值。 
你可以通过调用 max 来找到最大的 user_id。 
它通常用于价格或任何其他数字之类的比较，我们使用 user_id。 
它也可以用于字符串，在这种情况下，Z> a。
```
$res =$collection->max('user_id');
dump($res);
// 3
```
###Pluck()
pluck 方法返回指定键的所有值。 它对于提取一列的值很有用。
```
$title=$collection->pluck('title');
$title->all();
//结果看起来像这样。
[
  "Helpers in Laravel",
  "Testing in Laravel",
  "Telegram Bot"
]
```
使用 eloquent 时，可以将列名作为参数传递以提取值。pluck 也接受第二个参数，对于 eloquent 的集合，它可以是另一个列名。 它将导致由第二个参数的值作为键的集合。
```
$title=$collection->pluck('user_id','title');
$title->all();
//结果如下：
[
    "Helpers in Laravel"=>1,
    "Testing in Laravel"=>2,
    "Telegram Bot"=>3,
]
```
###Each()
each 是一种迭代整个集合的简单方法。 
它接受一个带有两个参数的回调：
它正在迭代的项和键。Key 是基于 0 的索引。
```
$collection->each(function($item,$key){
    info($item['user_id']);
});
```
上面代码，只是记录每个项的 user_id。
在迭代 eloquent 集合时，您可以将所有列值作为项属性进行访问。 
以下是我们如何迭代所有帖子。
```
$posts=App\Post::all();
$posts->each(function($item,$key){
    // Do something
});
```
如果回调中返回 false，它将停止迭代项目。
```
$collection->each(function($item,$key){
    // Tasks
    if($key==1){
        returnfalse;
    }
});
```
###Tap()
tap() 方法允许你随时加入集合。 
它接受回调并传递并将集合传递给它。 
您可以对项目执行任何操作，而无需更改集合本身。 
因此，您可以在任何时候使用 tap 来加入集合，而不会改变集合。
```
$collection->whereNotIn('user_id',3)
    ->tap(function($collection){
        $collection=$collection->where('user_id',1);
        info($collection->values());
    })->all();
```
改了集合，然后记录了值。 您可以对 tap 中的集合做任何您想做的事情。 
上面命令的响应是：
```
[
    [
        "user_id"=>"1",
        "title"=>"Helpers in Laravel",
        "content"=>"Create custom helpers in Laravel",
        "category"=>"php"
    ],
    [
        "user_id"=>"2",
        "title"=>"Testing in Laravel",
        "content"=>"Testing File Uploads in Laravel",
        "category"=>"php"
    ]
]
```
###Pipe()
pipe 方法非常类似于 tap 方法，因为它们都在集合管道中使用。
pipe 方法将集合传递给回调并返回结果。
```
$collection->pipe(function($collection){
    return$collection->min('user_id');
})
```
###Contains()
contains 方法只检查集合是否包含给定值。 只传递一个参数时才会出现这种情况。
```
$contains=collect(['country'=>'USA','state'=>'NY']);
$contains->contains('USA');
// true
$contains->contains('UK');
// false
如果将 键 / 值 对传递给 contains 方法，它将检查给定的键值对是否存在。
$collection->contains('user_id','1');
// true
$collection->contains('title','Not Found Title');
// false
```
您还可以将回调作为参数传递给回调方法。 
将对集合中的每个项目运行回调，如果其中任何一个项目通过了真值测试，它将返回 true 否则返回 false。
```
$collection->contains(function($value,$key){
    returnstrlen($value['title'])<13;
});
// true
```
回调函数接受当前迭代项和键的两个参数值。 这里我们只是检查标题的长度是否小于 13。
在 Telegram Bot 中它是 12，所以它返回 true

###Forget()
forget 只是从集合中删除该项。 
您只需传递一个键，它就会从集合中删除该项目。
```
$forget=collect(['country'=>'usa','state'=>'ny']);
$forget->forget('country')->all();
//上面代码响应如下：
[
    "state"=>"ny"
]
```
###Avg()
avg 方法返回平均值。 
你只需传递一个键作为参数，avg 方法返回平均值。 
你也可以使用 average 方法，它基本上是 avg 的别名。
```
$avg = collect([
    ['shoes' => 10],
    ['shoes' => 35],
    ['shoes' => 7],
    ['shoes' => 68],
])->avg('shoes');
```
上面的代码返回 30 ，这是所有四个数字的平均值。 
如果你没有将任何键传递给 avg 方法并且所有项都是数字，它将返回所有数字的平均值。 
如果键未作为参数传递且集合包含键 / 值对，则 avg 方法返回 0。

```
$avg=collect([12,32,54,92,37]);$avg->avg();

//45.4
```
![](https://upload-images.jianshu.io/upload_images/6943526-80576cb982889c3b.gif?imageMogr2/auto-orient/strip)


