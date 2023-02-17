![](https://upload-images.jianshu.io/upload_images/6943526-5febc5071c322ce9.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



>需求：Laravel关联模型中过滤结果为空的结果集

首先看代码：

```
$userCoupons = UserCoupons::with(['coupon' => function($query) use($groupId){   
       return $query->select('id', 'group_id', 'cover', 'group_number', 'group_cover')
                    ->where([ 'group_id' => $groupId]);
}])
// 更多查询省略...
```

数据结构是三张表用户优惠券表（user_coupons）、优惠券表(coupons)，商家表(corps)，组优惠券表(group_coupons) 

>需求：用模型关联查出用户优惠券中属于给定组gourpId的所有数据（如果为空该条数据就不返回）

但有些结果不是我想要的：

```
array(20) {
	["id"]=>int(6)
	["user_id"]=>int(1)
	["corp_id"]=>int(1)
	["coupon_id"]=>int(4)
	["obtain_time"]=>int(1539739569)
	["receive_time"]=>int(1539739569)
	["status"]=>int(1)
	["expires_time"]=>int(1540603569)
	["is_selling"]=>int(0)
	["from_id"]=>int(0)
	["sell_type"]=>int(0)
	["sell_time"]=>int(0)
	["sell_user_id"]=>int(0)
	["is_compose"]=>int(0)
	["group_cover"]=>string(0) ""
	["is_delete"]=>int(0)
	["score"]=>int(100)
	["created_at"]=>NULL
	["updated_at"]=>NULL
	["coupon"]=>NULL
	// 注意返回了coupons为空的数据
 }
```

记录中有的coupon有记录，有的为空。

想想也是，`with只是用sql的in()`实现的所谓预加载。

无论怎样主user_coupons的数据都是会列出的。

它会有两条sql查询，第一条查主数据，第二条查关联，这里第二条sql如下：

```
select `id`, `group_id`, `cover`, `group_number`, `group_cover` 

from `youquan_coupons` 

where `youquan_coupons`.`id` in (1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 13, 14) 

and (`group_id` = 1) and `youquan_coupons`.`deleted_at` is null
```

如果第二条为空，主记录的关联字段就是NULL。

后来看到了Laravel关联的模型的has()方法，`has()是基于存在的关联查询`，下面我们用whereHas()（一样作用，只是更高级，方便写条件）

这里我们思想是把判断有没有优惠券数据也放在第一次查询逻辑中，所以才能实现筛选空记录。

加上whereHas()后的代码如下

```
$userCoupons = UserCoupons::whereHas('coupon', function($query) use($groupId){
          return $query->select('id', 'group_id', 'cover', 'group_number', 'group_cover')
                       ->where(['group_id' => $groupId]);        
})->with(['coupon' => function($query) use($groupId){            
          return $query->select('id', 'group_id', 'cover', 'group_number', 'group_cover');        
}])-> 
// ...
```

看下最终的SQL:

```
select * from `youquan_user_coupons` 

where exists (

select `id`, `group_id`, `cover`, `group_number`, `group_cover` from `youquan_coupons` 

where `youquan_user_coupons`.`coupon_id` = `youquan_coupons`.`id` 

and (`group_ids` = 1) and `youquan_coupons`.`deleted_at` is null

) 

and (`status` = 1 and `user_id` = 1)
```

这里实际上是用`exists()`筛选存在的记录，然后走下一步的with()查询，因为此时都筛选一遍了，所以with可以去掉条件。

显然区分这两个的作用很重要，尤其是在列表中，不用特意去筛选为空的数据，而且好做分页。

![](https://upload-images.jianshu.io/upload_images/6943526-e54cbf238772152e.gif?imageMogr2/auto-orient/strip)
