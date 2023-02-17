<?php

$path = './_tmp';

function get_filetree($path){

 $tree = array();

 foreach(glob($path.'/*') as $single){

  if(is_dir($single)){

   $tree = array_merge($tree,get_filetree($single));

  }else{

   $tree[] = $single;

  }

 }

 return $tree;

}

$dir_arr=get_filetree($path);

$dir_arr_count=count($dir_arr);

for($i=0;$i<$dir_arr_count;$i++){

    $file_name= $dir_arr[$i];

    $file=basename($file_name);

    $dir_arr_0_=explode($file,$file_name);

    $dir_arr_0_0=$dir_arr_0_[0];

    $file_arr=explode("[1]",$file);

    $file_new_name = $file_arr[0].$file_arr[1];

    $time = strtotime('2021-07-02');

    $time = date('Y-m-d',$time+$i*24*3600);

    rename($file_name,$dir_arr_0_0.$time.'-'.$file_new_name);
  }

?>