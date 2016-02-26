<?php
/**
 * HICHAO H5设计师详情接口
 *
 * PHP version 5.5
 * @author   zhangxuanru <lizhiyan@hichaos.com>
 * @license  http://www.hichao.com License
 * @version  GIT: $Id$
 * @link     http://wiki.mingxingyichu.cn/display/EC/ECShop+Home
 */


namespace controller;
use  Module\brandModule;
use comm\comm;
use controller\base;
use Module\GoodsModule;
 


/**
 * HICHAO 商品接口
 *
 * PHP version 5.5
 *
 * @category Mall\Api
 * @package  Mall\Api
 * @author   lizhiyan <lizhiyan@hichaos.com>
 * @license  http://www.hichao.com License
 * @link     http://wiki.mingxingyichu.cn/pages/viewpage.action?pageId=6359523
 */
class designer
{
	protected $data ;


    /**
     * 实例化类库
     *
     * @param array $data 接收的参数数据
     *
     * @return void
     */
    public function __construct($data)
    {
        $this->data = $data;
     } 
	
	/*
	H5 品牌详情页
	zhangxuanru
	*/
      public function designerDetails()
      {
          $data = $this->data;
          $business_id = $data['business_id'];
          $brand_type  = $data['brand_type'];
          $stylist_pic = trim($data['stylist_pic']);
          $banner_url  = '';
         if(!empty($stylist_pic))
         {
             $stylist_pic = unserialize($stylist_pic);
             $banner_url  = $stylist_pic['pic_url'];
             $banner_url  = comm::getImageRealPath($banner_url);
         }
          $goods_list = GoodsModule ::getBusinessGoods($business_id);
          foreach($goods_list as $key=>&$goods)
          {
              $goods['source_id'] = GoodsModule::getSourceIdBy($goods['goods_id']);
              $goods['goods_img'] = comm::getImageRealPath($goods['goods_img']);
              $goods['product_price']  = GoodsModule::getPorductPrice($goods['goods_id']);
          }
          $response['banner_url'] = $banner_url;
          $response['business_id'] = $business_id;
          $response['brand_type']  = $brand_type;
          $response['stylist_name'] = $data['stylist_name'];
          $response['goods'] = $goods_list;
          base::responseMsg('0','success',$response);
      }

}
