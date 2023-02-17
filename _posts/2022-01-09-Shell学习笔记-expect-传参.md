bash是通过`$0 ... $n`接收参数

expect是通过`set <变量名称> [lindex $argv <param index>]`

例如：`set username [lindex $argv 0]`
```
#!/usr/bin/expect  
set timeout 10  
set username [lindex $argv 0]  
set password [lindex $argv 1]  
set hostname [lindex $argv 2]  
spawn ssh $username@$hostname  
expect "yes/no"  
send "yes\r"  
expect "password:" 
send "$password\r"
expect eof
```
执行脚本`./ssh.exp root pasword hostname1`

一个比较粗糙的` Linux expect `通过` telnet console` 口配置网络设备
```
#!/bin/bash
PORT=$1
cmd="""sys\r
interface g1/1\r
 ip add 1.1.1.1 24\r"""
# 执行 expect
# 每个 expect 的判断间隔为 5 秒，确保命令可以正常退出
# expect 可以通过发送 ascii 码来执行键盘组合

expect <<END
    set timeout 5
    spawn telnet 10.0.0.1 1111
    expect "*]'" { send "\r" }
    expect "*assword:" { send "P@ssword\r" }
    expect {
        "*>" { send "screen disable\r" }
        "*]" { send "screen disable\r" }
    }
    expect {
        "*>" { send "$cmd" }
        "*]" { send "$cmd" }
    }
    expect "*]" { send "\03" }
    expect eof
END
```
一个自动登录脚本
```
#!/usr/bin/expect

set LOGIN_IP [lindex $argv 0]

spawn zssh administrator@$LOGIN_IP -p 2222


expect {
"*yes/no*"
{send "yes\r";exp_continue;}
"*password:"
{send "password\r;"}
}

expect "ac>"
send "loginto\r"

expect "*password:"
send "password\r"

expect "*:~#"
send "cd /usr/local/\r"
interact

```


![](https://upload-images.jianshu.io/upload_images/6943526-261c6caf9c49a262.gif?imageMogr2/auto-orient/strip)
