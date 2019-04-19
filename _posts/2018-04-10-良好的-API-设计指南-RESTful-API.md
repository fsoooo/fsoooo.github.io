要说RESTful首先来说说REST – REpresentational State Transfer （表述性状态传递）

> 表述性状态转移是一组架构约束条件和原则。满足这些约束条件和原则的应用程序或设计就是RESTful。需要注意的是，REST是设计风格而不是标准。

以上的概念大概是许多关于RESTful中都会出现的定义概念。

那么什么是**表述性状态转移**呢？

首先，之所以晦涩是因为前面主语被去掉了，全称是 Resource Representational State Transfer，通俗来讲就是，资源在网络中以某种表现形式进行状态转移。

在查询很多资料后看到一句很精简的总结：

**URL定位资源，用HTTP动词（GET,POST,DELETE,PUT等）描述操作。**

既然说到了是用HTTP动词进行操作。那么需要了解这里列出的4.5个非常重要的HTTP动作，这里的0.5个是指PATCH，因为它在功能上与PUT非常类似，剩下4个通常被API开发人员两两结合使用

- GET（SELECT）：从[服务器](https://www.baidu.com/s?wd=%E6%9C%8D%E5%8A%A1%E5%99%A8&tn=24004469_oem_dg&rsv_dl=gh_pl_sl_csd)获取一个指定资源或一个资源集合；
- POST（CREATE）：在服务器上创建一个资源；
- PUT（UPDATE）：更新服务器上的一个资源，需要提供整个资源；
- PATCH（UPDATE）：更新服务器上的一个资源，只提供资源中改变的那部分属性；
- DELETE（DELETE）：移除服务器上的一个资源；

还有两个不常见的HTTP动作：

- HEAD – 获取一个资源的元数据，例如一组hash数据或者资源的最近一次更新时间；
- OPTIONS – 获取当前用户（Consumer）对资源的访问权限；

关于RESTful的API设计风格，说完RESTful接下来该说说API了。

> API是服务提供方和使用方之间的契约，打破该契约将会给服务端开发人员招来非常大的麻烦，这些麻烦来自于使用API的开发人员，因为对API的改动会导致他们的[移动app](https://www.baidu.com/s?wd=%E7%A7%BB%E5%8A%A8app&tn=24004469_oem_dg&rsv_dl=gh_pl_sl_csd)无法工作。一个好的文档对于解决这些事情能起到[事半功倍](https://www.baidu.com/s?wd=%E4%BA%8B%E5%8D%8A%E5%8A%9F%E5%80%8D&tn=24004469_oem_dg&rsv_dl=gh_pl_sl_csd)的作用，但是绝对多数程序员都不喜欢写文档。如果想让服务端的价值更好的体现出来，就要好好设计API。通过这些API，你的服务/核心程序将有可能成为其他项目所依赖的平台；你提供的API越易用，就会有越多人愿意使用它。规划API的展示形式可能比你想象的要简单，首先要确定你的数据是如何设计以及核心程序是如何工作的。 
> ![image.png](https://upload-images.jianshu.io/upload_images/6943526-c57827fdcba9064d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


> 也就是说Server提供的RESTful API中，URL中只使用名词来指定资源，原则上不使用动词。“资源”是REST架构或者说整个网络处理的核心。

那么下面来具体说说如何形成良好的RESTful风格的API设计

**1. 使用名词而不是动词** 
Server提供的RESTful API中，URL中只使用名词来指定资源，原则上不使用动词。“资源”是REST架构或者说整个网络处理的核心。比如：

- <http://api.qc.com/v1/newsfeed>: 获取某人的新鲜;

- <http://api.qc.com/v1/friends>: 获取某人关系列表;

- <http://api.qc.com/v1/profile>: 获取某人的详细信息;

  URL是对资源描述的抽象，资源的描述一定是名词，如果引入了动词，那这个URL就表示了一个动作，而非一个资源，这样就偏离了REST的设计思想

**2.Get方法和查询参数不应该涉及状态改变** 
使用PUT, POST 和DELETE 方法 而不是 GET 方法来改变状态，不要使用GET 进行状态改变: 
通常，GET请求能够被浏览器缓存（而且通常都会这么做），例如，当用户发起第二次POST请求时，缓存的GET请求（依赖于缓存首部）能够加快用户的访问速度。一个HEAD请求基本上就是一个没有返回体的GET请求，因此也能被缓存。

**3.使用复数名词** 
不要混淆名词单数和复数，为了保持简单，只对所有资源使用复数。

**4. 使用子资源表达关系** 
如果一个资源与另外一个资源有关系，使用子资源：

**5.使用Http头声明序列化格式** 
在客户端和服务端，双方都要知道通讯的格式，格式在HTTP-Header中指定 
Content-Type 定义请求格式 
Accept 定义系列可接受的响应格式

**6.使用HATEOAS** 
Hypermedia as the Engine of Application State 超媒体作为应用状态的引擎，超文本链接可以建立更好的文本浏览：

**7.为集合提供过滤 排序 选择和分页等功能** 
Filtering过滤:

使用唯一的查询参数进行过滤：

GET /cars?color=red 返回红色的cars 
GET /cars?seats<=2 返回小于两座位的cars集合

当用户请求获取一组对象列表时，你就需要对结果进行过滤并返回一组严格符合用户要求的对象。有时返回结果的数量可能非常大，但是你也不能随意对此进行约束，因为这种服务端的随意约束会造成第三方开发人员的困惑。如果用户请求了一个集合，并对返回结果进行遍历，然后只要前100个对象，那么这里就需要由用户来指明这个限制量。这样用户就不会有这样的疑惑：是他们程序的bug还是接口限制了100条？还是网络只允许传这么大的包？

Sorting排序:

允许针对多个字段排序

GET /cars?sort=-manufactorer,+model

这是返回根据生产者降序和模型升序排列的car集合

Field selection

移动端能够显示其中一些字段，它们其实不需要一个资源的所有字段，给API消费者一个选择字段的能力，这会降低网络流量，提高API可用性。

GET /cars?fields=manufacturer,model,id,color

Paging分页

使用 limit 和offset.实现分页，缺省limit=20 和offset=0；

GET /cars?offset=10&limit=5

为了将总数发给客户端，使用订制的HTTP头： X-Total-Count.

链接到下一页或上一页可以在HTTP头的link规定，遵循Link规定:

**Link:**
 <https://blog.mwaysolutions.com/sample/api/v1/cars?offset=15&limit=5>; rel=”next”, 
<https://blog.mwaysolutions.com/sample/api/v1/cars?offset=50&limit=3>; rel=”last”, 
<https://blog.mwaysolutions.com/sample/api/v1/cars?offset=0&limit=5>; rel=”first”, 
<https://blog.mwaysolutions.com/sample/api/v1/cars?offset=5&limit=5>; rel=”prev”,

**8.版本化你的API** 
也就是进行版本控制。无论你在设计什么系统，也不管你事先做了多么详尽的计划，随着时间的推移和业务的发展，你的程序总会发生变化，数据关系也会发生变化，资源可能会被添加或者删除一些属性。只要软件还在生存期内并且还有人在用它，开发人员就得面对这些问题，对于API设计来说，尤其如此。

**在URL中加入版本号是一个优秀的API设计，当然还有另一个常用的解决办法就是把版本号放在请求首部中**

使得API版本变得强制性，不要发布无版本的API，使用简单数字，避免小数点如2.5。一般在Url后面使用?v

/blog/api/v1

**9. 使用Http状态码处理错误** 
如果你的API没有错误处理是很难的，只是返回500和出错堆栈不一定有用

Http状态码提供70个出错，我们只要使用10个左右：

200 – OK – 一切正常 
201 – OK – 新的资源已经成功创建 
204 – OK – 资源已经成功擅长

304 – Not Modified – 客户端使用缓存数据

400 – Bad Request – 请求无效，需要附加细节解释如 “JSON无效” 
401 – Unauthorized – 请求需要用户验证 
403 – Forbidden – 服务器已经理解了请求，但是拒绝服务或这种请求的访问是不允许的。 
404 – Not found – 没有发现该资源 
422 – Unprocessable Entity – 只有服务器不能处理实体时使用，比如图像不能被格式化，或者重要字段丢失。

500 – Internal Server Error – API开发者应该避免这种错误。

> 1XX的返回码预留给HTTP的底层使用，在你的整个职业生涯中都不会主动发送这种返回码；
>
> 2XX的返回码表示请求按照预期执行并成功返回了信息。服务端要尽可能给用户返回这种结果。
>
> 3XX的返回码表示请求重定向，大多数API都不会经常使用这种请求（），但是最新的超媒体API会充分使用这些功能。
>
> 4XX的返回码主要表示由客户端引起的错误，例如请求参数错误或者访问一个不存在的资源，这些必须为幂等操作，并且不能改变服务器的状态（其实服务器的状态发生了改变就意味着操作不是幂等了）。
>
> 5XX的返回码主要表示由服务器引起的错误，通常情况下，这些错误都是开发人员

使用详细的错误包装错误：

```
{

  "errors": [

   {

    "userMessage": "Sorry, the requested resource does not exist",

    "internalMessage": "No car found in the database",

    "code": 34,

    "more info": "http://dev.mwaysolutions.com/blog/api/v1/errors/12345"

   }

  ]

}12345678910111213141516171819
```

**10.允许覆盖http方法** 
一些代理只支持POST 和 GET方法， 为了使用这些有限方法支持RESTful API，需要一种办法覆盖http原来的方法。

使用订制的HTTP头 X-HTTP-Method-Override 来覆盖POST 方法.

# 使用场景

## 版本号

在 RESTful API 中，API 接口应该尽量兼容之前的版本。但是，在实际业务开发场景中，可能随着业务需求的不断迭代，现有的 API 接口无法支持旧版本的适配，此时如果强制升级服务端的 API 接口将导致客户端旧有功能出现故障。实际上，Web 端是部署在服务器，因此它可以很容易为了适配服务端的新的 API 接口进行版本升级，然而像 Android 端、IOS 端、PC 端等其他客户端是运行在用户的机器上，因此当前产品很难做到适配新的服务端的 API 接口，从而出现功能故障，这种情况下，用户必须升级产品到最新的版本才能正常使用。

为了解决这个版本不兼容问题，在设计 RESTful API 的一种实用的做法是使用版本号。一般情况下，我们会在 url 中保留版本号，并同时兼容多个版本。

```
【GET】  /v1/users/{user_id}  // 版本 v1 的查询用户列表的 API 接口
【GET】  /v2/users/{user_id}  // 版本 v2 的查询用户列表的 API 接口
```

现在，我们可以不改变版本 v1 的查询用户列表的 API 接口的情况下，新增版本 v2 的查询用户列表的 API 接口以满足新的业务需求，此时，客户端的产品的新功能将请求新的服务端的 API 接口地址。虽然服务端会同时兼容多个版本，但是同时维护太多版本对于服务端而言是个不小的负担，因为服务端要维护多套代码。这种情况下，常见的做法不是维护所有的兼容版本，而是只维护最新的几个兼容版本，例如维护最新的三个兼容版本。在一段时间后，当绝大多数用户升级到较新的版本后，废弃一些使用量较少的服务端的老版本API 接口版本，并要求使用产品的非常旧的版本的用户强制升级。

注意的是，“不改变版本 v1 的查询用户列表的 API 接口”主要指的是对于客户端的调用者而言它看起来是没有改变。而实际上，如果业务变化太大，服务端的开发人员需要对旧版本的 API 接口使用适配器模式将请求适配到新的API 接口上。

## 资源路径

RESTful API 的设计以资源为核心，每一个 URI 代表一种资源。因此，URI 不能包含动词，只能是名词。注意的是，形容词也是可以使用的，但是尽量少用。一般来说，不论资源是单个还是多个，API 的名词要以复数进行命名。此外，命名名词的时候，要使用小写、数字及下划线来区分多个单词。这样的设计是为了与 json 对象及属性的命名方案保持一致。例如，一个查询系统标签的接口可以进行如下设计。

```
【GET】  /v1/tags/{tag_id} 
```

同时，资源的路径应该从根到子依次如下。

```
/{resources}/{resource_id}/{sub_resources}/{sub_resource_id}/{sub_resource_property}
```

我们来看一个“添加用户的角色”的设计，其中“用户”是主资源，“角色”是子资源。

```
【POST】  /v1/users/{user_id}/roles/{role_id} // 添加用户的角色
```

有的时候，当一个资源变化难以使用标准的 RESTful API 来命名，可以考虑使用一些特殊的 actions 命名。

```
/{resources}/{resource_id}/actions/{action}
```

举个例子，“密码修改”这个接口的命名很难完全使用名词来构建路径，此时可以引入 action 命名。

```
【PUT】  /v1/users/{user_id}/password/actions/modify // 密码修改
```

## 请求方式

可以通过 GET、 POST、 PUT、 PATCH、 DELETE 等方式对服务端的资源进行操作。其中，GET 用于查询资源，POST 用于创建资源，PUT 用于更新服务端的资源的全部信息，PATCH 用于更新服务端的资源的部分信息，DELETE 用于删除服务端的资源。

这里，笔者使用“用户”的案例进行回顾通过 GET、 POST、 PUT、 PATCH、 DELETE 等方式对服务端的资源进行操作。

```
【GET】          /users                # 查询用户信息列表
【GET】          /users/1001           # 查看某个用户信息
【POST】         /users                # 新建用户信息
【PUT】          /users/1001           # 更新用户信息(全部字段)
【PATCH】        /users/1001           # 更新用户信息(部分字段)
【DELETE】       /users/1001           # 删除用户信息
```

## 查询参数

RESTful API 接口应该提供参数，过滤返回结果。其中，offset 指定返回记录的开始位置。一般情况下，它会结合 limit 来做分页的查询，这里 limit 指定返回记录的数量。

```
【GET】  /{version}/{resources}/{resource_id}?offset=0&limit=20
```

同时，orderby 可以用来排序，但仅支持单个字符的排序，如果存在多个字段排序，需要业务中扩展其他参数进行支持。

```
【GET】  /{version}/{resources}/{resource_id}?orderby={field} [asc|desc]
```

为了更好地选择是否支持查询总数，我们可以使用 count 字段，count 表示返回数据是否包含总条数，它的默认值为 false。

```
【GET】  /{version}/{resources}/{resource_id}?count=[true|false]
```

上面介绍的 offset、 limit、 orderby 是一些公共参数。此外，业务场景中还存在许多个性化的参数。我们来看一个例子。

```
【GET】  /v1/categorys/{category_id}/apps/{app_id}?enable=[1|0]&os_type={field}&device_ids={field,field,…}
```

注意的是，不要过度设计，只返回用户需要的查询参数。此外，需要考虑是否对查询参数创建数据库索引以提高查询性能。

## 状态码

使用适合的状态码很重要，而不应该全部都返回状态码 200，或者随便乱使用。这里，列举笔者在实际开发过程中常用的一些状态码，以供参考。

| 状态码 | 描述           |
| ------ | -------------- |
| 200    | 请求成功       |
| 201    | 创建成功       |
| 400    | 错误的请求     |
| 401    | 未验证         |
| 403    | 被拒绝         |
| 404    | 无法找到       |
| 409    | 资源冲突       |
| 500    | 服务器内部错误 |

## 异常响应

当 RESTful API 接口出现非 2xx 的 HTTP 错误码响应时，采用全局的异常结构响应信息。

```
HTTP/1.1 400 Bad Request
Content-Type: application/json
{
    "code": "INVALID_ARGUMENT",
    "message": "{error message}",
    "cause": "{cause message}",
    "request_id": "01234567-89ab-cdef-0123-456789abcdef",
    "host_id": "{server identity}",
    "server_time": "2014-01-01T12:00:00Z"
}
```

## 请求参数

在设计服务端的 RESTful API 的时候，我们还需要对请求参数进行限制说明。例如一个支持批量查询的接口，我们要考虑最大支持查询的数量。

```
【GET】     /v1/users/batch?user_ids=1001,1002      // 批量查询用户信息
参数说明
- user_ids: 用户ID串，最多允许 20 个。
```

此外，在设计新增或修改接口时，我们还需要在文档中明确告诉调用者哪些参数是必填项，哪些是选填项，以及它们的边界值的限制。

```
【POST】     /v1/users                             // 创建用户信息
请求内容
{
    "username": "lgz",                 // 必填, 用户名称, max 10
    "realname": "梁桂钊",               // 必填, 用户名称, max 10
    "password": "123456",              // 必填, 用户密码, max 32
    "email": "lianggzone@163.com",     // 选填, 电子邮箱, max 32
    "weixin": "LiangGzone",            // 选填，微信账号, max 32
    "sex": 1                           // 必填, 用户性别[1-男 2-女 99-未知]
}
```

## 响应参数

针对不同操作，服务端向用户返回的结果应该符合以下规范。

```
【GET】     /{version}/{resources}/{resource_id}      // 返回单个资源对象
【GET】     /{version}/{resources}                    // 返回资源对象的列表
【POST】    /{version}/{resources}                    // 返回新生成的资源对象
【PUT】     /{version}/{resources}/{resource_id}      // 返回完整的资源对象
【PATCH】   /{version}/{resources}/{resource_id}      // 返回完整的资源对象
【DELETE】  /{version}/{resources}/{resource_id}      // 状态码 200，返回完整的资源对象。
                                                      // 状态码 204，返回一个空文档
```

如果是单条数据，则返回一个对象的 JSON 字符串。

```
HTTP/1.1 200 OK
{
    "id" : "01234567-89ab-cdef-0123-456789abcdef",
    "name" : "example",
    "created_time": 1496676420000,
    "updated_time": 1496676420000,
    ...
}
```

如果是列表数据，则返回一个封装的结构体。

```
HTTP/1.1 200 OK
{
    "count":100,
    "items":[
        {
            "id" : "01234567-89ab-cdef-0123-456789abcdef",
            "name" : "example",
            "created_time": 1496676420000,
            "updated_time": 1496676420000,
            ...
        },
        ...
    ]
}
```

## 一个完整的案例

最后，我们使用一个完整的案例将前面介绍的知识整合起来。这里，使用“获取用户列表”的案例。

```
【GET】     /v1/users?[&keyword=xxx][&enable=1][&offset=0][&limit=20] 获取用户列表
功能说明：获取用户列表
请求方式：GET
参数说明
- keyword: 模糊查找的关键字。[选填]
- enable: 启用状态[1-启用 2-禁用]。[选填]
- offset: 获取位置偏移，从 0 开始。[选填]
- limit: 每次获取返回的条数，缺省为 20 条，最大不超过 100。 [选填]
响应内容
HTTP/1.1 200 OK
{
    "count":100,
    "items":[
        {
            "id" : "01234567-89ab-cdef-0123-456789abcdef",
            "name" : "example",
            "created_time": 1496676420000,
            "updated_time": 1496676420000,
            ...
        },
        ...
    ]
}
失败响应
HTTP/1.1 403 UC/AUTH_DENIED
Content-Type: application/json
{
    "code": "INVALID_ARGUMENT",
    "message": "{error message}",
    "cause": "{cause message}",
    "request_id": "01234567-89ab-cdef-0123-456789abcdef",
    "host_id": "{server identity}",
    "server_time": "2014-01-01T12:00:00Z"
}
错误代码
- 403 UC/AUTH_DENIED    授权受限
```
