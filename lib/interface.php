<?php
/**
 * 明星衣橱H5数据对接接口入口文件
 * 相应数据.
 *
 * PHP version 5.5
 *
 * @category Hichao
 * @package  Hichao
 * @author   zhangxuanru <zhangxuanru@hichaos.com>
 * @license  http://www.hichao.com License
 * @version  GIT: $Id$
 * @link     http://wiki.mingxingyichu.cn/display/EC/ECShop+Home
 */

use Module\BusinessModule;
use comm\comm;
use controller\base;

define('IN_ECS', true);
require __DIR__.DIRECTORY_SEPARATOR.'comm'.DIRECTORY_SEPARATOR.'init.php';

include DIR_PATH.DIRECTORY_SEPARATOR.'smarty'.DIRECTORY_SEPARATOR.'smarty.php';


$requestData = array_merge($_GET,$_POST);
 // 方法.
$method = isset($requestData['method']) ? $requestData['method'] : '';
$method = isset($requestData['m']) ? $requestData['m'] : $method;

if($method == 'brand' || $method=='designer')
{
header('Content-type: application/json; charset=utf-8');
$data = base::getBusinessIdMethod($requestData);
}else
{
    $data = $requestData;
    $data['smartyobj'] = $smarty;
}

// 当前接口支持的接口有哪些.
$method_routes = array(
    'brand' => array('c'=>'controller\brand','m'=>'brandDetails'),//H5品牌详情页
    'designer' => array('c'=>'controller\designer','m'=>'designerDetails'),//H5设计师详情页
    'goodsdetail' => array('c'=>'controller\goods','m'=>'goodsDetail'), //H5商品详情页商品详情
    'goodssize' => array('c'=>'controller\goods','m'=>'goodsSize'),//H5商品详情页商品尺码
    'aftersaleservice' => array('c'=>'controller\goods','m'=>'aftersaleService'),//H5商品详情页售后服务
    'collocation'      => array('c'=>'controller\goods','m'=>'goodsCollocation'), //H5商品详情页搭配参考
    'introduction' => array('c'=>'controller\goods','m'=>'brandIntroduction'),//H5商品详情页品牌介绍
    'story' => array('c'=>'controller\goods','m'=>'brandIntroduction'),//H5商品详情页品牌介绍
    'goodsdetail.senddata'=>array('c'=>'controller\goods','m'=>'getgoodsDetail'), //H5商品详情页搭配，详情，尺码 JSON数据

    //'story'            => array('c'=>'controller\brand','m'=>'brandStory'), //品牌故事 H5商品详情页品牌介绍
);

// 验证请求的接口是否存在.
$method_route = isset($method_routes[$method]) ? $method_routes[$method] : false;
if ($method_route === false) {
    echo '{"response":{"code":"102","msg":"请求的接口不存在."}}';
    exit(0);
}

// 加载模块类文件.
$class = $method_route['c'];
$fun   = $method_route['m'];

try {
    $class = new $class($data);
    call_user_func(array($class, $fun));
} catch (Exception $e) {
    base::responseMsg('1','没有接口或者异常');
}
