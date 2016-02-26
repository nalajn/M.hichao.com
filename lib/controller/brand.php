<?php
/**
 * HICHAO H5品牌接口
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
use Module\BusinessModule;
 


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
class brand
{
	protected $data ;
    public    $smarty;


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
        $this->smarty=$data['smartyobj'];
     } 
	
	/*
	H5 品牌详情页
	zhangxuanru
	*/
      public function brandDetails()
      {
          $data = $this->data;
          $business_id = $data['business_id'];
          $brand_type  = $data['brand_type'];
          $stylist_pic = isset($data['stylist_pic'])?trim($data['stylist_pic']):NULL;
          $banner_url = '';
          //if(!empty($stylist_pic))
          //{
            //  $stylist_pic = unserialize($stylist_pic);
              //$banner_url  = $stylist_pic['pic_url'];
              //$banner_url  = comm::getImageRealPath($banner_url,200,200);
          //}else{
              $BannerData  =  BusinessModule::getBusinessBannerById($business_id,0);
              if(isset($BannerData['banner_url']) && !empty($BannerData['banner_url']) )
             {
              $banner_url =comm::getImageRealPath($BannerData['banner_url'],640,200);
             }
          //} 

          $goods_list = GoodsModule ::getBusinessGoods($business_id);

          foreach($goods_list as $key=>&$goods)
          {
              $goods['source_id'] = GoodsModule::getSourceIdBy($goods['goods_id']);
              $collectionRow =  base::GetcollectionData( $goods['source_id']);
              if(isset($collectionRow['collection_count']))
              {
                  $goods_list[$key]['click_count'] = $collectionRow['collection_count'];
              }
              $goods['goods_img'] = comm::getImageRealPath($goods['goods_img']);
              $goods['product_price']      = GoodsModule::getPorductPrice($goods['goods_id']);
          }
          $response['banner_url']  = $banner_url;
          $response['business_id'] = $business_id;
          $response['brand_type']  = $brand_type;
          $response['goods'] = $goods_list;
          base::responseMsg('0','success',$response);
      }


 /* brandStory
  * 店铺详情页点进来的 品牌故事
  * @return void
  * */
   public  function brandStory()
  {
      $data = $this->data;
      $business_id  =  isset($data['bid'])?intval($data['bid']):0;
      if(empty($business_id))
      {
          echo '数据错误';
          exit;
      }
    $brand = BusinessModule::getBrandIntroduction($business_id);
    $this->smarty->assign('brand',$brand);
    $this->smarty->display('brandStory.html');
  }

}



