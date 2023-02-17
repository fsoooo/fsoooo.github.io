###  Docker常用命令：

docker ps //查看当前运行中的容器

docker ps -a //查看所有运行过的容器

docker inspect containerId(容器ID或容器名)//查看对应容器的具体配置信息

docker port containerId //查看对应容器端口映射

docker run --name containerName -it -p 80:80 -d 

	--name是为容器取一个别名，

	-p 80:80是端口映射，将宿主机的80端口映射到容器的80端口上，

	-d是指后台运行容器，即容器启动后不会停止，

	-it是-i 和-t的合并，以交互模式运行容器。

docker images //查看所有镜像

docker exec -it containerName /bin/bash //进入已启动的容器内，新启一个进程，执行命令。

docker stop containerName // 停止一个容器

docker start -i containerName //重启启动一个运行过的容器

docker rm containerName //移除一个容器

###   Docker删除容器与镜像（谨慎操作！！！）

1.停止所有的container，这样才能够删除其中的images：

```
docker stop $(docker ps -a -q)1
```

如果想要删除所有container的话再加一个指令：

```
docker rm $(docker ps -a -q)1
```

2.查看当前有些什么images

```
docker images1
```

3.删除images，通过image的id来指定删除谁

```
docker rmi <image id>1
```

想要删除untagged images，也就是那些id为的image的话可以用

```
docker rmi $(docker images | grep "^<none>" | awk "{print $3}")1
```

要删除全部image的话

```
docker rmi $(docker images -q)1
```

强制删除全部image的话

```
docker rmi -f $(docker images -q)
```
