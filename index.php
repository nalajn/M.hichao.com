<?php  
 $data = array_merge($_GET,$_POST);  
 $method  = 'brand';
 if(isset($data['m']))
 {
	 $method = $data['m'];
 }
 if(!isset($data['id']))
 {
	 exit('ID为空 请稍后重试');
 } 
 
 $assign['m']  =  $method;
 $assign['id'] =  $data['id']; 
 
 /* 创建 Smarty 对象。*/
include __DIR__.DIRECTORY_SEPARATOR.'smarty'.DIRECTORY_SEPARATOR.'smarty.php';


switch($method)
{ 
   case 'brand':
   {
	 $file = 'brandDetails.html';  
	break;   
    }
   
   default :
   {
	   $file = 'brandDetails.html';  
	   break;   
	}
    	 
 } 

$smarty->display($file);
