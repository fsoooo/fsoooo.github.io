---
layout: post
catalog: true
tags:
  - Cookie
---
今天遇到一个Cookie的问题，cookie的path不是    `'/'`,导致一些页面不能共享Cookie。之前没有遇到过这个问题，今天就查了查。

在项目中有时需要用cookie来保存用户信息，很多时候我们都只设置了cookie的name、value和maxAge，而没有去管path。 

path取值是有默认规则的，下面总结一下paht取值的规则。
## 总结一下paht取值的规则：

1. 当cookie的path设置了值不为null的时候，以设置的值为准。
2. 当cookie的path为null时候，获取请求的URI的path值 
   1）. 当URI的path值是以“/”结尾的时候，直接设置为cookie的path值
   2）. 当URI的path值不是以“/”结尾的时候，查看path里面是否有“/” 
       （1）. 如果有“/”的话，直接截取到最后一个“/”，然后设置为cookie的path值。
       （2）. 如果没有“/”的话，将cookie的path设置为”/”。


####示例：
**代码1**是当一个用户首次访问网站的时候添加一个cookie（假设网站的域名是www.a.com）用来表示用户是未登录的新用户。

**代码1**

```java
.........过滤器中其他代码，判断用户是否首次访问网站........
Cookie newVisitorCookie = new Cookie("new_visitor", "yes");
newVisitorCookie.setMaxAge(-1);
newVisitorCookie.setDomain("www.a.com");
response.addCookie(newVisitorCookie);
.........其他代码...........
```

在java代码里面通过name为“new_visitor”的cookie来判断用户是否是首次访问。 

通过测试发现有些用户虽然是首次访问网站，但是在java代码里面却获取不到“new_visitor”的cookie。经过排查才发现原来是cookie中path属性的问题。


path表示cookie所在的目录。

”/”表示根目录，所有页面都能访问根目录下面的cookie。

如果cookie的path为test，那么只test目录下或者是test下的子目录的页面和代码才获取到这个cookie。 

查看了一下添加cookie的源代码才发现，当cookie的path为null的时候，会自动设置path的值。



代码2是java.net.CookieManager类中当cookie的path为null时，设置path值的规则。

**代码2**

```java
...............其他代码................
for (String headerValue : responseHeaders.get(headerKey)) {
 try {
  List<HttpCookie> cookies = HttpCookie.parse(headerValue);
  for (HttpCookie cookie : cookies) {
     if (cookie.getPath() == null) {
         // If no path is specified, then by default
         // the path is the directory of the page/doc
         String path = uri.getPath();
         if (!path.endsWith("/")) {
            int i = path.lastIndexOf("/");
            if (i > 0) {
               path = path.substring(0, i + 1);
             } else {
               path = "/";
            }
         }
         cookie.setPath(path);
      }
 ...............其他代码................
```

