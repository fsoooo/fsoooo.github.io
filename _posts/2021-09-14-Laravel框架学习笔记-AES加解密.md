最近在开发账户中心，需要使用到AES对称加密。于是就对Laravel框架里的加密方式做了一点探究。

Laravel 的加密机制使用 OpenSSL 提供 AES-256 和 AES-128 的加密，本文将详细介绍关于Laravel中encrypt和decrypt的实现，分享出来供大家参考学习。

**1. 使用方法**

首先是生成秘钥。要需要在.env目录里提供APP_KEY，这个如果没有的话，可以通过命令`php artisan key:generate`生成，也可以自己设置。生成后例子应该是这样的


```php
APP_KEY=base64:5BM1BXGOBrGeeqJMAWJZSzyzh5yPcCGOcOGPtUij65g=
```

在文件配置加密key和加密算法，在config/app.php的目录里有配置


```php
$ 'key' => env('APP_KEY'),
  
  'cipher' => 'AES-256-CBC',
```

使用方法，在laravel里已经有使用方法了，这里就不在过多的说了。主要使用的两个方法，一个是encrypt的加密，一个是decrypt的解密

**2. 查找加密解密的文件**

实现方法的位置是在vendor/illuminate/encryption/的目录下发现两个文件，一个是EncryptionServiceProvider另外一个是Encrypter

**3. 分析EncryptionServiceProvider文件**


```php
public function register()
{
 $this->app->singleton('encrypter', function ($app) {
  $config = $app->make('config')->get('app'); //从config/app.php里拿到配置文件
 
  if (Str::startsWith($key = $config['key'], 'base64:')) { //分析配置文件里的key里面有没有带'base64'
   $key = base64_decode(substr($key, 7)); //如果有的话，把key前面的base64:给取消，并且解析出原来的字符串
  }
 
  return new Encrypter($key, $config['cipher']); //实例化Encrypte类，注入到框架里
 });
}
```

这个文件没太多东西，但是通过这个我们可以看出，其实在配置文件的，我们能直接写key，并且前面不带base64也是可以解析。相当于省几步操作

另外，在实例化类的时候，需要传入key以及加密方式

**4. 分析Encrypter文件**

**1. 分析__construct，在实例化之前执行**


```php
public function __construct($key, $cipher = 'AES-128-CBC')
{
 $key = (string) $key; //把key转换为字符串
 
 if (static::supported($key, $cipher)) { //调用一个自定义的方法，用来判断加密方式和要求的key长度是否一样
  $this->key = $key;
  $this->cipher = $cipher;
 } else {
  throw new RuntimeException('The only supported ciphers are AES-128-CBC and AES-256-CBC with the correct key lengths.');
 }
}
```

上面的方法，主要是用来判断加密方式和传的key的长度是否相同，因为不同的加密方式，要求的相应的key的长度也是有要求的，具体每种加密方式要求key的长度可以查找对应的文档


```php
public static function supported($key, $cipher)
{
 $length = mb_strlen($key, '8bit'); //判断key的字符的长度，按照8bit位的方式计算字符长度
 
 return ($cipher === 'AES-128-CBC' && $length === 16) ||
   ($cipher === 'AES-256-CBC' && $length === 32); //编码格式为AES128的要求字符长度为16。编码格式为AES256的要求字符长度为32位
}
```

上面这个方法展现了一个严谨的地方，用了mb_strlen方法，并且要求计算长度是按照8bit位来计算的。这样的好处是，不管是在哪种操作系统，计算的长度都是一样的。

通过这个考虑到不同操作系统的情况，不会出现加密出现问题的情况。

**2. 分析encrypt方法**


```php
public function encrypt($value, $serialize = true)
{
 $iv = random_bytes(16); //生成一个16位的随机字符串
 // 使用openssl_encrypt把数据生成一个加密的数据
 // 1、判断需要不需要生成一个可存储表示的值，这样做是为了不管你的数据是数组还是字符串都能给你转成一个字符串，不至于在判断你传过来的数据是数组还是字符串了。
 // 2、使用openssl_encrypt。第一个参数是传入数据，第二个参数是传入加密方式，目前使用AES-256-CBC的加密方式，第三个参数是，返回加密后的原始数据，还是把加密的数据在经过一次base64的编码，0的话表示base64位数据。第四个参数是项量，这个参数传入随机数，是为了在加密数据的时候每次的加密数据都不一样。
 $value = \openssl_encrypt(
  $serialize ? serialize($value) : $value,
  $this->cipher, $this->key, 0, $iv
 ); //使用AES256加密内容
 
 if ($value === false) {
  throw new EncryptException('Could not encrypt the data.');
 }
 
 $mac = $this->hash($iv = base64_encode($iv), $value); //生成一个签名，用来保证内容参数没有被更改
 
 $json = json_encode(compact('iv', 'value', 'mac')); //把随机码，加密内容，已经签名，组成数组，并转成json格式
 
 if (! is_string($json)) {
  throw new EncryptException('Could not encrypt the data.');
 }
 
 return base64_encode($json); //把json格式转换为base64位，用于传输
}
```

上面用到了一个自定义的方法hash()，我们可以看下方法的实现。


```php
protected function hash($iv, $value)
{
 // 生成签名
 // 1、把随机值转为base64
 // 2、使用hash_hmac生成sha256的加密值，用来验证参数是否更改。第一个参数表示加密方式，目前是使用sha256，第二个是用随机值连上加密过后的内容进行，第三个参数是上步使用的key。生成签名。
 return hash_hmac('sha256', $iv.$value, $this->key); /根据随机值和内容，生成一个sha256的签名
}
```

**以上加密共分了三大步**

     1.生成随机码

     2.生成加密内容

     3.生成签名

框架用到一个优雅的方法，使用serialize生成一个值，这个方法高雅在哪里，就是不管你得内容是数组还是字符串，都能转换成字符串。 而使用serialize和使用json_encode的区别在哪，我想最大的好处是，你所要加密的内容比较大的时候，serialize相对于要快。

另外一个地方是，框架在加密的时候使用了一个随机字符串。为什么要使用随机字符串呢，因为使用了随机字符串，使每次加密的内容都是不一样的，防止别人猜出来。

**3. 分析decrypt方法**

解密数据，可以说是最复杂的一块，不仅要进行数据的解密，而且还要保证数据的完整性，以及数据防篡改


```php
public function decrypt($payload, $unserialize = true)
 {
  $payload = $this->getJsonPayload($payload); //把加密后的字符串转换出成数组。
 
  $iv = base64_decode($payload['iv']); //把随机字符串进行base64解密出来
 
  $decrypted = \openssl_decrypt( //解密数据
   $payload['value'], $this->cipher, $this->key, 0, $iv
  );
 
  if ($decrypted === false) {
   throw new DecryptException('Could not decrypt the data.');
  }
 
  return $unserialize ? unserialize($decrypted) : $decrypted; //把数据转换为原始数据
 }
```

getJsonPayload方法


```php
protected function getJsonPayload($payload)
{
 $payload = json_decode(base64_decode($payload), true); //把数据转换为原来的数组形式
 
 if (! $this->validPayload($payload)) { //验证是不是数组以及数组里有没有随机字符串，加密后的内容，签名
  throw new DecryptException('The payload is invalid.');
 }
 
 if (! $this->validMac($payload)) { //验证数据是否被篡改
  throw new DecryptException('The MAC is invalid.');
 }
 
 return $payload;
}
```

validPayload方法就不说了，比较简单和基本，重点就说说validMac验证这块，保证数据不被篡改，这是最重要的


```php
protected function validMac(array $payload)
{
 $calculated = $this->calculateMac($payload, $bytes = random_bytes(16)); //拿数据和随机值生成一个签名
 
 return hash_equals( //比对上一步生成的签名和下面生成的签名的hash是否一样。
  hash_hmac('sha256', $payload['mac'], $bytes, true), $calculated //根据原始数据里的签名在新生成一个签名
 );
}
```

calculateMac方法是为了根据原始数据和随机值生成一个签名，然后用这签名再次生成一个签名


```php
protected function calculateMac($payload, $bytes)
{
 return hash_hmac(
  'sha256', $this->hash($payload['iv'], $payload['value']), $bytes, true
 );
}
```

**以上解密共分了三大步**

     1.判断数据的完整性

     2.判断数据的一致性

     3.解密数据内容。

这个验证签名有个奇怪的地方，他并不像我们平常验证签名一样。我们平常验证签名都是，拿原始数据和随机值生成一个签名，然后拿生成的签名和原始数据的签名进行比对来判断是否有被篡改。

而框架却多了一个，他用的是，通过原始数据和随机值生成签名后，又拿这个签名生成了一个签名，而要比对的也是拿原始数据里的签名在生成一个签名，然后进行比对。目前想不出，为什么要多几步操作。

在加密的时候，我们把原始数据使用serialize转换了一下，所以我们相应的也需要使用unserialize把数据转换回来。

**注意**

- 加密时使用的openssl_encrypt里的随机项量值是使用的原始数据raw这种二进制的值，使用openssl_decrypt解密后的值是使用的经过base64位后的随机字符串。
- 解密的时候生成签名比较的时候，不是用原来的签名，然后根据原始数据的内容，重新生成一次签名进行比较，而是使用原始签名为基础生成一个签名，然后在拿原始数据为基础生成的签名，在用这个新生成的签名重新生成了一次签名。然后进行比较的。
- AES256是加密数据，后面能够逆向在进行解密出数据。而SHA256是生成签名的，这个过程是不可逆的，是为了验证数据的完整性。
