# 小程序学习笔记-API接口安全

## 一.接口安全的必要性

最近我们公司的小程序要上线了，但是小程序端是外包负责的，我们负责提供后端接口。这就可能会造成接口安全问题。一些别有用心的人可以通过抓包或者其他方式即可获得到后台接口信息，如果不做权限校验，他们就可以随意调用后台接口，进行数据的篡改和服务器的攻击，会对一个企业造成很严重的影响。因此，为了防止恶意调用，后台接口的防护和权限校验非常重要。

虽然小程序有HTTPs和微信保驾护航，但是还是要加强安全意识，对后端接口进行安全防护和权限校验。

## 二.小程序接口防护

#### 小程序的登录过程：

![alt](http://upload-images.jianshu.io/upload_images/6943526-38069fa573af176c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

1. 小程序端通过**wx.login()**获取到code后发送给后台服务器

2. 后台服务器使用小程序的appid、appsecret和code，调用微信接口服务换取session_key和openid（openid可以理解为是每个用户在该小程序的唯一识别号）

3. 后台服务器自定义生成一个3rd_session，用作openid和session_key的key值，后者作为value值，保存一份在后台服务器或者redis或者mysql，同时向小程序端传递3rd_session

4. 小程序端收到3rd_session后将其保存到本地缓存，如wx.setStorageSync(KEY,DATA)

5. 后续小程序端发送请求至后台服务器时均携带3rd_session，可将其放在header头部或者body里

6. 后台服务器以3rd_session为key，在保证3rd_session未过期的情况下读取出value值（即openid和session_key的组合值），通过openid判断是哪个用户发送的请求，再和发送过来的body值做对比（如有），无误后调用后台逻辑处理

7. 返回业务数据至小程序端


会话密钥session_key 是对用户数据进行加密签名的密钥。为了应用自身的数据安全，开发者服务器不应该把会话密钥下发到小程序，也不应该对外提供这个密钥。

session_key主要用于wx.getUserInfo接口数据的加解密，如下图所示：

![alt](http://upload-images.jianshu.io/upload_images/6943526-77b1533b71e81161.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### sessionId

在微信小程序开发中，由wx.request()发起的每次请求对于服务端来说都是不同的一次会话。啥意思呢？就是说区别于浏览器，小程序每一次请求都相当于用不同的浏览器发的。即不同的请求之间的sessionId不一样（实际上小程序cookie没有携带sessionId）。

如下图所示：

![alt](http://upload-images.jianshu.io/upload_images/6943526-4e8d389e93a05a37.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

实际上小程序的每次wx.request()请求中没有包含cookie信息，即没有sessionId信息。

但是我们可以在每次wx.request()中的header里增加。

### 接口防护方法

- 使用**HTTPS**防止抓包，使用https至少会给破解者在抓包的时候提高一些难度
- **接口参数的加密**，通过md5加密数据+时间戳+随机字符串（salt），然后将MD5加密的数据和时间戳、原数据均传到后台，后台规定一个有效时长，如果在该时长内，且解密后的数据与原数据一致，则认为是正常请求；也可以采用aes/des之类的加密算法，还可以加入客户端的本地信息作为判断依据
- **本地加密混淆**，以上提到的加解密数据和算法，不要直接放在本地代码，因为很容易被反编译和破解，建议放到独立模块中去，并且函数名称越混淆越难读越安全。
- **User-Agent 和 Referer 限制**
- **api防护的登录验证**，包括设备验证和用户验证，可以通过检查session等方式来判断用户是否登录
- **api的访问次数限制**，限制其每分钟的api调用次数，可以通过session或者ip来做限制
- **定期监测，检查日志，侦查异常的接口访问**
