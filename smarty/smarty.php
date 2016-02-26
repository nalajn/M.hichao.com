<?php
/* 创建 Smarty 对象。*/ 
if(!defined('SHOP_DB_CHARSET'))
{
    require(dirname(__DIR__).DIRECTORY_SEPARATOR.'config'.DIRECTORY_SEPARATOR.'config.php');
} 
if(!defined('DIR_PATH'))
{
    define('DIR_PATH',dirname(__DIR__));
}  

require(DIR_PATH.DIRECTORY_SEPARATOR.'smarty'.DIRECTORY_SEPARATOR.'cls_template.php'); 

$smarty = new cls_template;
$smarty->template_dir  = DIR_PATH.DIRECTORY_SEPARATOR.'templates';
$smarty->compile_dir   = DIR_PATH.DIRECTORY_SEPARATOR.'compiled';
 
$smarty->force_compile = true;

$smarty->cache_lifetime = 10;  //v1 上只设置 10 秒缓存

if(!empty($assign))
{
    $smarty->assign('assign', $assign);
}
$smarty->assign('themes_static_file_url', THEMES_STATIC_FILE_URL);
$smarty->assign('themes_static_host_url', THEMES_STATIC_HOST_URL);
$smarty->assign('themes_static_dist_url', THEMES_STATIC_DIST_URL);
$smarty->assign('themes_static_enable_config', THEMES_STATIC_ENABLE_CONFIG);
$smarty->assign('present_time', JAVASCRIPT_VERSION);
$smarty->assign('site_image_cdn_url_prefix', SITE_IMAGE_CDN_URL_PREFIX);
