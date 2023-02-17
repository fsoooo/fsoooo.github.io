![](https://upload-images.jianshu.io/upload_images/6943526-eda388ee3a8fa2be.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

现在的网站和app开发中，签到是一个很常见的功能，用户签到是提高用户粘性的有效手段，用的好能事半功倍！

下面我们从技术方面看看常用的实现手段：

### **一. 方案1**

直接存到数据库MySQL

用户表如下：

![](https://upload-images.jianshu.io/upload_images/6943526-3c30dd5aecd779d1?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

last_checkin_time 上次签到时间

checkin_count 连续签到次数

记录每个用户签到信息

**签到流程**

**1.用户第一次签到**

```
last_checkin_time = time()

checkin_count=1
```

**2.用户非第一次签到，且当天已签到**

什么也不做，返回已签到。

**3.用户非第一次签到，且当天还未签到**

a.昨天也有签到

```
last_checkin_time = time()

checkin_count= checkin_count+1
```

b.昨天没有签到

```
last_checkin_time = time()

checkin_count=1
```

使用yii实现的代码如下：

```
//0点
$today_0 = strtotime(date('y-m-d'));
//昨天0点
$yesterday_0 = $today_0-24*60*60;
$last_checkin_time = $model->last_checkin_time;
if(empty($last_checkin_time)){
	//first checkin
	$model->last_checkin_time = time();
	$model->checkin_count = 1;		
}else{
	if($today_0 < $last_checkin_time){
		//checkin ed 当天已签到过
		return json_encode(['code' => 0, 'msg' => '已签到成功']);
	}
	//昨天签到过
	if($last_checkin_time < $today_0 && $last_checkin_time > $yesterday_0){
		$model->last_checkin_time = time();
		$model->checkin_count = $model->checkin_count + 1;	
	}else{
		//昨天没签到过，重新计数
		$model->last_checkin_time = time();
		$model->checkin_count = 1;
	}
}
$rs = $model->save();
```


![](https://upload-images.jianshu.io/upload_images/6943526-8ac2860e18a7eb24.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 二. 方案2

redis实现方案，使用bitmap来实现，bitmap是redis 2.2版本开始支持的功能，一般用于标识状态，

另外 ，用bitmap进行当天有多少人签到非常的方便，使用bitcount

$count = $redis->BITCOUNT($key);

#### 签到流程

设置两个bitmap ,

一个以每天日期为key ，每个uid为偏移量

一个以用户uid为key ，当天在一年中的索引为偏移量，

这样记录一个用户一年的签到情况仅需要365*1bit

以下是签到代码

```
//每天一个key
		$key = 'checkin_' . date('ymd');

		if($redis->getbit($key, $uid)){
			//已签到
			return json_encode(['code' => 0, 'msg' => '已签到成功']);
		}else{
			//签到
			$redis->setbit($key, $uid, 1);
			$redis->setbit('checkin_'.$uid	, date('z'), 1);
		}
```

以下是用户连续签到计算

```
public static function getUserCheckinCount($uid){
		$key = 	'checkin_'.$uid;
		$index = date('z');
		$n = 0;
		for($i = $index; $i>=0;$i--){
			$bit = Yii::$app->redis->getbit($key, $i);
			if($bit == 0) break;
			$n++;
		}
		return $n;
	}
```

以下是计算一天签到用户数

```
$key = 'checkin_' . date('ymd');
$redis = Yii::$app->redis;
$count = $redis->BITCOUNT($key);
```

![](https://upload-images.jianshu.io/upload_images/6943526-7023c49c93287af6.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### **三. 优缺点比较**

**1.直接MySQL**

思路简单，容易实现；

缺点：占用空间大，表更新比较多，影响性能，数据量大时需要用cache辅助；

**2.Redis bitmap**

优点是:

占用空间很小，纯内存操作，速度快；

缺点是 :

记录的信息有限，只有一个标识位；

偏移量不能大于2^32，512M；大概可以标识5亿个bit位，绝大多数的应用都是够用的啦；

偏移量很大的时候可能造成 Redis 服务器被阻塞；所以要考虑切分。

好啦，两种方式介绍完了，各有利弊，你喜欢哪种方式呢？

![](https://upload-images.jianshu.io/upload_images/6943526-6e4ea88761b61d49.gif?imageMogr2/auto-orient/strip)

