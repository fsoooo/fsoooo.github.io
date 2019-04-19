## MySQL之Where和Having的区别

对于使用where和having，相信很多人都有过困扰，今天就来讲一下我对where和having的认识：

#### 从整体声明的角度来理解：



Where是一个**约束声明**，在查询数据库的结果返回之前对数据库中的查询条件进行约束，即在结果返回之前起作用，且where后面**不能使用聚合函数**



 Having是一个**过滤声明**，所谓过滤是**在查询数据库的结果返回之后进行过滤**，即在结果返回之后起作用，并且having后面**可以使用聚合函数**。



所谓**聚合函数，是对一组值进行计算并且返回单一值的函数**：sum---求和，count---计数，max---最大值，avg---平均值等。



#### **从使用的角度：**

 where后面之所以不能使用聚合函数是因为**where的执行顺序在聚合函数之前**，如下面这个sql语句：

```sql
  select  sum(score) from student  group by student.sex where sum(student.age)>100;
```

having既然是对查出来的结果进行过滤，那么就**不能对没有查出来的值使用having**，如下面这个sql语句：

```sql
select  student.id,student.name from student having student.score >90;
```

   where 和 having组合使用的sql语句：

```sql
select sum(score) from student where sex='man' group by name having sum(score)>210;
```

```
用group by和having子句联合来查出不重复的记录,sql如下: 
select uid,email,count(*) as ct from `edm_user081217` GROUP BY email 
然后看这个，就容易理解了 
select uid,email,count(*) as ct from `edm_user081217` GROUP BY email HAVING ct > 1 
先用group by 对email进行分组,在用having来过滤大于1的,这样查找出来的就是重复的记录了. 
```

#### 总结： 

1.Where和Having的作用对象不同：WHERE 子句作用于表和视图，HAVING 子句作用于组。

2.WHERE 在分组和聚集计算之前选取输入行（因此，它控制哪些行进入聚集计算）， 而 HAVING 在分组和聚集之后选取分组的行。因此，WHERE 子句不能包含聚集函数； 因为试图用聚集函数判断那些行输入给聚集运算是没有意义的。 相反，HAVING 子句总是包含聚集函数。

3.having一般跟在group by之后，执行记录组选择的一部分来工作的。 
where则是执行所有数据来工作的。 
再者having可以用聚合函数，如having sum(qty)>1000

 
