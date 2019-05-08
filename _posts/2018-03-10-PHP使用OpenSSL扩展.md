---
layout: post
catalog: true
tags:
  - PHP
  - OpenSSL
---
PHP 在进入7.x 时代后，默认就不再附带 **mcrypt** 扩展，**mcrypt** 将被 **openssl_*** 一族函数所替代。所以，对于 PHPer 来说，有必要学习一下 PHP 的 OpenSSL 扩展。

本文就先从 OpenSSL 扩展中的对称加密说起。后面会陆续更多非对称加密、数字签名、数字证书等函数的讲解。

PHP 的 OpenSSL 扩展中，对称加密的相关函数有：

- openssl_encrypt()
- openssl_decrypt()
- openssl_random_pseudo_bytes()
- openssl_get_cipher_methods()
- openssl_cipher_iv_length()

光看PHP的官方文档还有点难理解。上一段代码，更清楚地看下这些函数怎么完成加密的：

```php
// 加密算法
1. $encryptMethod = 'aes-256-cbc';
// 明文数据
2. $data = 'Hello World';

// 生成IV
3. $ivLength = openssl_cipher_iv_length($encryptMethod);
4. $iv = openssl_random_pseudo_bytes($ivLength, $isStrong);
5. if (false === $iv && false === $isStrong) {
6.     die('IV generate failed');
7. }

// 加密
8. $encrypted = openssl_encrypt($data, $encryptMethod, 'secret', 0, $iv);
// 解密
9. $decrypted = openssl_decrypt($encrypted, $encryptMethod, 'secret', 0, $iv);
```

详细解释一下：

**第 1 行 指定了加密算法**。比如这段代码使用 **aes-256-cbc** 算法加密。其实PHP的OpenSSL扩展支持很多种加密算法，想知道所有对称加密算法名称列表，可以调用 `openssl_get_cipher_methods()` 函数，这会返回一个数组：

```
array(
  0 => 'AES-128-CBC',
  1 => 'AES-128-CBC-HMAC-SHA1',
  ...
  7 => 'AES-128-ECB',
  ...
  31 => 'BF-CBC'，
  200 => 'seed-ofb',
)
```

你会发现函数返回将近200种加密算法，实际上没有这么多，许多只是因为大小写不同而重复了，比如 **AES-128-CBC** 和 **aes-128-cbc** 实际上是同一种加密算法。如果去掉重复项，那么 PHP 的 OpenSSL 扩展支持大概100多种不同的加密算法。

**第 3 ~ 7 行** 生成了 **IV**。为什么要生成 IV，这个 IV 有什么用？

回顾一下 `openssl_get_cipher_methods()` 返回的加密算法列表，有很多名字中间带有 **“CBC”** 字样，这些加密算法使用了同一种加密模式，也就是 **密码分组链接模式（Cipher Block Chaining）**。

在 **CBC** 模式的加密算法中，明文会被分成若干个组，以组为单位加密。每个组的加密过程，依赖他前一个组的数据：需要跟前一组的数据进行异或操作后生成本组的密文。那么最开头的那个组又要依赖谁呢？依赖的就是 IV，所以这就是为什么 IV 要叫初始化向量。**IV** 是 初始化向量（initialization vector）的缩写

**IV** 应该是随机生成的，所以代码用到了 `openssl_random_pseudo_bytes()` 生成 IV。该函数接收一个 **int**，代表需要生成的 IV 的长度。

IV 长度随加密算法不同而不同。一般人是记不住那么多算法需要的 IV 长度的。所以直接使用 `openssl_cipher_iv_length()` 函数，这个函数返回一个 **int**，表示加密算法需要的 IV 长度：

```
echo openssl_cipher_iv_length('AES-256-CBC'); // 16
echo openssl_cipher_iv_length('BC-CBC'); // 8
echo openssl_cipher_iv_length('AES-128-ECB'); // 0
```

比如 AES-256-CBC 需要16位的 IV、 BC-CBC 需要 8 位的 IV、而AES-128-ECB 不需要 IV，所以返回了 0。

**第 8 ~ 9 行** 是加密和解密。分别使用了 `openssl_encrypt()` 和 `openssl_decrypt()`。

- 第一个参数是输入，对 `openssl_encrypt()` 来说是明文串，对 `openssl_decrypt()` 来说是密文串
- 第二个参数是指定加密 / 解密 算法
- 第三个参数是加密 / 解密时需要用到的密码，是个字符串
- 第四个参数额外选项，没有特殊需要可以保持默认值：0，
- 第五个参数是 **IV**

这两个函数除了第一个参数不同，其余参数都要保证相同才能顺利解密。最后，在使用需要 **IV** 的加密算法时，需要注意：

- 必须传 `$iv` 参数，不传的话PHP将会抛出一个 **Warning**
- **IV** 应该是随机生成的（比如用 `openssl_random_pseudo_bytes()` ），不能人为设定
- 每次加密都应该重新生成一次 **IV** ，不可偷懒多次加密采用相同 **IV**
- **IV** 要随着密文一起保存（不然就没法解密了啦），可以直接附在密文串后面，也可以分开保存
