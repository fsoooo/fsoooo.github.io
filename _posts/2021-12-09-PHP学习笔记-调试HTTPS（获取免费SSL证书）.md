最近由于项目需要，需要在本地测试https，下面给大家分享一个获取免费Https证书的方法
![](https://upload-images.jianshu.io/upload_images/6943526-f6382b3c03a697fc.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


<br/>

## 申请证书
```
cd /usr/local/ssl # 这里的路径自己定
git clone https://github.com/certbot/certbot
cd certbot
./certbot-auto certonly --manual \
-d *.example.com \
-d example.com --agree-tos \
--manual-public-ip-logging-ok --preferred-challenges \
dns-01 --server https://acme-v02.api.letsencrypt.org/directory
```
>--nginx选项表示 Web 服务器为 nginx，
-d选项指定域名，
-n选项表示非交互式运行命令。(若去除-n选项，则终端会提醒你选择是否将 http 请求重定向为 https 请求)。


>注意： **.example.com** 和 **example.com** 替换成你自己的域名，下同
它会自动下载依赖包，如果提示是否下载，输入`y`继续下载；按提示输入`邮箱地址`；接下来显示如下：

```
Please deploy a DNS TXT record under the name
_acme-challenge.example.com with the following value:

mhumL1xJOHPIZtFTEm4rotjJnR9TdkBVPuCS9YHvNjs

Before continuing, verify the record is deployed.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Press Enter to Continue
```

<br/>

### 解析设置验证

上面可以看出，在url `_acme-challenge.example.com`，要配置成`mhumL1xJOHPIZtFTEm4rotjJnR9TdkBVPuCS9YHvNjs`，我的域名是阿里云的，[设置教程](https://links.jianshu.com/go?to=https%3A%2F%2Fhelp.aliyun.com%2Fknowledge_detail%2F39785.html)
记录类型选择`TXT`，主机记录输入上面的`_acme-challenge.example.com`，记录值是上面的值`mhumL1xJOHPIZtFTEm4rotjJnR9TdkBVPuCS9YHvNjs`，其他配置和现有的别的解析规则保持一致

验证是否生效，新开一个`tab`页，运行

```
yum install bind-utils
dig -t txt _acme-challenge.example.com @8.8.8.8

```

看到输出里有`_acme-challenge.example.com. 599 IN TXT "1scXnCO43OgpWRkdaVpTb-_vd2NGHwdmJEmQhvRC6AA"`代表解析设置成功了，回到之前的`tab`里显示`Press Enter to Continue`那里，按回车，显示

```
IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/example.com/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/example.com/privkey.pem
   Your cert will expire on 2019-04-01. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot-auto
   again. To non-interactively renew *all* of your certificates, run
   "certbot-auto renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le

```

出现以上的结果，就表示设置成功了

<br/>

## 生成 dhparams
```
openssl dhparam -out /etc/ssl/certs/dhparams.pem 2048
```

<br/>

## 配置WEB服务器（这里我选择的是nginx）
```
    server {
        listen 443 ssl;
        server_name localhost;
        location / {
            root html;
            index index.html index.htm;
        }
        #ssl on;
        ssl_certificate     /etc/letsencrypt/live/laozhao-tech.top/fullchain.pem;  
        ssl_certificate_key /etc/letsencrypt/live/laozhao-tech.top/privkey.pem;     
        ssl_dhparam /etc/ssl/certs/dhparams.pem;
        ssl_protocols SSLv3 TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;
    }

```

>运行**`nginx -s reload`**，重新加载配置文件

<br/>

## http强制跳转 https

若有http强制跳转https的，进行下面`nginx`配置

```
server {
    listen 80;
    server_name your.domain.com;
    return 301 https://$server_name$request_uri;
}

```

<br/>

## 添加安全组

我一切配置都很顺利，就是`https`访问一直不行，后来才发现我的服务器是阿里云买的，他们设置了安全组，没有把`443`端口放开。

端口范围：`443/443` 授权对象：`0.0.0.0/0`，其他参数设置和别的安全组保持一致

添加了安全组就可以访问了

<br/>

## 到期后续期

>我们用的是**【[Let's Encrypt](https://letsencrypt.org/)】**提供的免费`ssl`，有效期`90天`，到期后需要进行续期。

![](https://upload-images.jianshu.io/upload_images/6943526-33cc9a1971fa134d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### (1)查看过期时间

```
cd /usr/local/ssl #路径是自己git clone选择的目录
./certbot-auto certificates --no-self-upgrade
Saving debug log to /var/log/letsencrypt/letsencrypt.log

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Found the following certs:
  Certificate Name: example.com
    Domains: *.example.com example.com
    Expiry Date: 2019-06-19 09:37:01+00:00 (VALID: 89 days)
    Certificate Path: /etc/letsencrypt/live/example.com/fullchain.pem
    Private Key Path: /etc/letsencrypt/live/example.com/privkey.pem
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

```

### (2)手动续期

```
./certbot-auto --server https://acme-v02.api.letsencrypt.org/directory -d "*.example.com" -d "example.com" 
--manual --preferred-challenges dns-01 certonly  --no-self-upgrade

```

`example.com`替换成自己的域名。按`Y`继续，出现如下信息时，重复上述`步骤2`进行域名验证

```
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Plugins selected: Authenticator manual, Installer None
Cert is due for renewal, auto-renewing...
Renewing an existing certificate
Performing the following challenges:
dns-01 challenge for example.com

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
NOTE: The IP of this machine will be publicly logged as having requested this
certificate. If you're running certbot in manual mode on a machine that is not
your server, please ensure you're okay with that.

Are you OK with your IP being logged?
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
(Y)es/(N)o: Y

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Please deploy a DNS TXT record under the name
_acme-challenge.example.com with the following value:

mnDglnRF3P0VCEW6xoIDYblcswOJySkc3CPAQIwFm-c

Before continuing, verify the record is deployed.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Press Enter to Continue
```

重复`步骤2`验证完成后出现如下信息表示续期成功

```
Waiting for verification...
Cleaning up challenges

IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/example.com/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/example.com/privkey.pem
   Your cert will expire on 2019-06-19. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot-auto
   again. To non-interactively renew *all* of your certificates, run
   "certbot-auto renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le
```

### (3)重启nginx

```
nginx -s reload
```
![](https://upload-images.jianshu.io/upload_images/6943526-b2f8f47dbf85aee2.gif?imageMogr2/auto-orient/strip)
