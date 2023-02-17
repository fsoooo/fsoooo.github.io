![](https://upload-images.jianshu.io/upload_images/6943526-666090cab7cb2ab7.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


##一、概述

　　Blade是Laravel提供的一个既简单又强大的模板引擎

　　和其他流行的PHP模板引擎不一样，Blade并不限制你在视图view中使用原生的PHP代码

　　所有的Blade视图页面都将被编译成原生的PHP代码并缓存起来，除非你的的模板文件修改，否则不会重新编译

　　模板继承：`section,yield,extends,parent.`



##二、实例
#### 1、定义布局模板 `views/people/layout/layout.blade.php`

```
<!DOCTYPE html>
<html>
<head>
    <title>Laravel @yield('title')</title>
    <meta charset="utf-8">
    <style type="text/css">
        .body{margin:0px;padding:0px;}
        .header{width:100%;height:60px;background: red;margin-bottom: 10px;}
        .sidebar{width:20%;height:500px;background: green;
            margin-right:20px;margin-bottom: 10px;}
        .content{width:72%;height:500px;background: blue;margin-bottom: 10px;}
        .footer{width:100%;height:60px;background: black}
        div{float:left;}
    </style>
</head>
<body>
    <div class="header">
        @section('header')
        头部
        @show    
    </div>

    <div class="sidebar">
        @section('sidebar')
        侧边栏
        @show    
   </div>

    <div class="content">
        @yield('content','主要内容区域')
    </div>

    <div class="footer">
        @section('footer')
        底部
        @show    
    </div>
</body>
```
#### 2、控制器方法分配数据
```
//模板技术
public function section1(){
//.和/都可以
  $name = 'helloiu';
  $data = ['sss','zzz'];
  $students = Student::get();

  return view('people.student.section1',[
            'name' => $name,
            'data' => $data,
            'students' => $students,
        ]);
 }

public function urlTest(){
    return 'urlTest';
}
```
#### 3、子模板 `views/people/student/section1.blade.php`
```
@extends('people.layout.layout')

@section('header')
    <!-- @parent展示父模板的内容 -->
    @parent
    HEADER
@stop

@section('sidebar')
    sideBar
@stop

@section('content')
    Content    <!-- 1、模板中输出PHP变量 -->
    <p>{{$name}}</p>

    <!-- 2、模板中调用PHP代码 -->
    <p>{{time()}}</p>
    <p>{{ date('Y-m-d H:i:s',time())}}</p>

    <!-- 数组 true和false必须加引号，要当字符串展示 -->
    <p>{{ in_array($name,$data) ? 'true' : 'false' }}</p>
    <p>{{ var_dump($data) }}</p>

    <p>{{ isset($name) ? $name : 'default' }}</p>
    <!-- isset短语法 -->
    <p>{{ $name or 'default' }}</p>

    <!-- 3、原样输出 -->
    <p>@{{ $name }}</p>

    <!-- 4、模板中的注释，在浏览器查看源代码看不到 -->
    {{--  我是注释  --}}

    <!-- 5、引入子视图 可以直接把数据分配到子视图中，在子视图中展示 -->
    @include('people.common.common',['message' => '我是error信息']);

    <!-- 6、流程控制 在if或者for后面的括号里使用php代码，不需要双花括符-->
    @if($name == 'helloJiu')
        I'm {{$name}}
    @elseif($name == 'helloHu')
        I'm helloHu
    @else
        who am i?{{$name}}
    @endif

    @if (in_array($name, $data))
        true
    @else
        false
    @endif
    <br>

    <!-- unless if的取反 -->
    @unless($name == 'helloJiu')
        I'm {{$name}}
    @endunless

    <!-- 循环 -->
    @for($i=0;$i<10;$i++)
        {{ $i }}
    @endfor

    @foreach($students as $student)
        {{ $student->created_at }}
    @endforeach

    <!-- 如果$students存在，则输出，不存在，输出null -->
    @forelse($students as $student)
        {{ $student->name }}
    @empty
        <p>null</p>
    @endforelse

    <!-- 模板中的URL -->
    <a href="{{ url('url') }}">url</a>
    <a href="{{ action('People\StudentController@urlTest') }}">urlAction</a>
    <br>
    <a href="{{ route('url')}}">route</a>
@stop
```
#### 4、`people/common/common.blade.php`
```
<p>我是common子视图include {{ $message }}<p>
```
#### 5、整个路由系统
```
<?php
Route::get('/', function () {
    return view('welcome');
});

//路由群组
Route::group(['prefix' => 'people'], function(){ 

 Route::get('member/index','People\MemberController@index');

 Route::get('member/model','People\MemberController@model');

 Route::get('student/index','People\StudentController@index');

 Route::get('student/add','People\StudentController@insert');

 Route::get('student/update','People\StudentController@update');

 Route::get('student/select','People\StudentController@select');

Route::get('student/delete','People\StudentController@delete');

//查询构造器路由
Route::get('student/qbAdd','People\StudentController@qbAdd');

Route::get('student/qbUpdate','People\StudentController@qbUpdate');

Route::get('student/qbDelete','People\StudentController@qbDelete');

Route::get('student/qbSelect','People\StudentController@qbSelect');

Route::get('student/qbSelect','People\StudentController@qbSelect');

Route::get('student/qbSelectJH','People\StudentController@qbSelectJH');

//ORM路由
Route::get('student/ormIndex','People\StudentController@ormIndex');

Route::get('student/ormAddByAttr','People\StudentController@ormAddByAttr');

Route::get('student/ormAddByCreate','People\StudentController@ormAddByCreate');

Route::get('student/ormSelect','People\StudentController@ormSelect');

Route::get('student/ormUpdate','People\StudentController@ormUpdate');

Route::get('student/ormDelete','People\StudentController@ormDelete');

//模板路由
Route::get('student/section1','People\StudentController@section1');

Route::get('student/urlTest',[
        'as' => 'url',
        'uses' => 'People\StudentController@urlTest',
    ]);

Route::get('index',function(){
   return view('People.layout.layout');
    });
});

//路由中输出视图
Route::get('view',function(){
    return view('welcome');
});

//绑定控制器MemberController::info()
Route::get('member/info','MemberController@info');

Route::any('member/info', [
    'uses' => 'MemberController@info',
    'as' => 'memberinfo',]
);

Route::any('getID/{id}',['uses'=>'MemberController@getID'])
    ->where('id','[\d]*');
});
```
![](https://upload-images.jianshu.io/upload_images/6943526-e12cc5da70e88c2c.gif?imageMogr2/auto-orient/strip)
