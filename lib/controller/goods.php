<?php
/**
 * HICHAO H5商品详情详情接口
 *
 * PHP version 5.5
 * @author   zhangxuanru <zhangxuanru@hichaos.com>
 * @license  http://www.hichao.com License
 * @version  GIT: $Id$
 * @link     http://wiki.mingxingyichu.cn/display/EC/ECShop+Home
 */


namespace controller;
use  Module\brandModule;
use comm\comm;
use controller\base;
use Module\BusinessModule;
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
class goods extends  base
{
	public static  $data ;
    public          $smarty;
    public  static $staticData;
    public  static $business_data;



    /**
     * 实例化类库
     *
     * @param array $data 接收的参数数据
     *
     * @return void
     */
    public function __construct($data)
    {
        self::$staticData = $data;
        $this->smarty=$data['smartyobj'];
        self::$business_data = base::checkSourceid($data);
    }



    /* H5 商品详情页 模板展示页面
     * */
    public  function  goodsDetail()
    {
        $response_data =  self::goodsDetailData();
        $this->smarty->assign('data',$response_data);
        $this->smarty->display('goodsDetail.html');
    }

    /* H5 商品详情页 数据源
     * */

    public static  function  goodsDetailData()
    {
        $data          = self::$staticData ;
        $source_id     = isset($data['sid'])?intval($data['sid']):0;
        $business_data = self::$business_data;
        $response_data = array();
        // 获取商品信息.
        $goods_data = GoodsModule::getBusinessGoodsInfo($business_data['goods_id']);
        if (empty($goods_data)) {
            return $response_data;
        }
        //获取商家商品图片
        $pictures = GoodsModule::getBusinessGoodsGallery($business_data['goods_id'],0,$business_data['business_id']);
        if(!is_array($business_data))
        {
            $business_data = array();
        }
        if(!is_array($goods_data))
        {
            $goods_data = array();
        }
        $response_data = array_merge($business_data,$goods_data,array('pictures'=>$pictures));
        return $response_data;
    }


    /* H5 商品详情页-->商品尺码 模板展示页面
      * */
    public  function  goodsSize()
    {
        $goodsSizeBusiness =  self::goodsSizeData();
        $this->smarty->assign('goodsSizeBusiness',$goodsSizeBusiness);
        $this->smarty->display('goodssize.html');
    }



    /* H5 商品详情页-->商品尺码 数据
     * */
    public static function  goodsSizeData()
    {
        $business_data =  self::$business_data;
        $goodsSizeBusiness = GoodsModule::getGoodsGallery($business_data['goods_id'],$business_data['business_id']);
        if(empty($goodsSizeBusiness))
        {
            $goodsSizeBusiness = GoodsModule::getSizeImages($business_data['business_id']);
        }
        return $goodsSizeBusiness;
    }


    /* H5 商品详情页-->品牌介绍 模板展示页面
   * */
    public    function brandIntroduction()
    {
          $data =  self::brandIntroductionData();
          $center = isset($data['center'])?$data['center']:'0';
          $banner_url = isset($data['banner_url'])?$data['banner_url']:'';
          $brand_desc = isset($data['brand_desc'])?$data['brand_desc']:'';
          $this->smarty->assign('center',$center);
          $this->smarty->assign('banner_url',$banner_url);
          $this->smarty->assign('brand_desc',$brand_desc);
          $this->smarty->display('brandIntroduction.html');
    }


    /* H5 商品详情页-->品牌介绍 数据
 * */
    public static   function brandIntroductionData()
    {
        $data         = self::$staticData ;
        $business_id  =  isset($data['bid'])?intval($data['bid']):0;
        $banner_url   = '';
        $textcenter   = 0;
        $response     = array();
        if(empty($business_id)) {
             return $response;
        }
        $brand = BusinessModule::getBrandIntroduction($business_id);
        if(empty($brand)){
            //查询banner图
            $BannerData =   BusinessModule::getBusinessBannerById($business_id,0);
            if(isset($BannerData['banner_url']) && !empty($BannerData['banner_url']) )
            {
                $banner_url =comm::getImageRealPath($BannerData['banner_url'],640,200);
            }
            $BusinessData=  BusinessModule::getBusinesssFieldList('brand_desc',$business_id);
            $brand_desc = isset($BusinessData['brand_desc'])?$BusinessData['brand_desc']:'';
            if(empty($banner_url))
            {
                $banner_url = 'http://api.mall.hichao.com/images/icon_data.png';
                $brand_desc = '没有任何信息';
                $textcenter     = 1;
            }
            $response = array('banner_url'=>$banner_url,'brand_desc'=>$brand_desc,'center'=>$textcenter);
         }else {
            $response =  array('banner_url'=>$brand[0]['img_url'],'brand_desc'=>'','center'=>$textcenter);
        }
         return $response;
    }


    /* H5 商品详情页-->售后服务 模板展示页面
  * */
    public    function aftersaleService()
    {
         $data = self::aftersaleServiceData();
         $express_type =  isset($data['express_type'])?$data['express_type']:'';
         $imageList    = isset($data['imageList'])?$data['imageList']:array();
         $this->smarty->assign('express_type',$express_type);
         $this->smarty->assign('imageList',$imageList);
         $this->smarty->display('aftersaleService.html');
    }


    /* H5 商品详情页-->售后服务 数据
 * */
    public  static  function aftersaleServiceData()
    {
        $business_data =  self::$business_data;
        $imageList =  GoodsModule::getAftersaleImgList($business_data['business_id']);
        $express_type =  isset($business_data['express_type'])?$business_data['express_type']:0;
        if($express_type >0 && $express_type!=2)
        {
            $express_type =1;
            $express_typeImg = array(
                'img_url' => 'http://fed.beta.pimg.cn/images/webview/haiguan.png',
                'primary_img_url' => 'http://fed.beta.pimg.cn/images/webview/haiguan.png',
                'img_address' => 'http://fed.beta.pimg.cn/images/webview/haiguan.png',
                'img_width'  => '640',
                'img_height' => '287'
            );
        }
        if(isset($express_typeImg))
        {
           $imageList = array_merge(array($express_typeImg),$imageList);
        }
        return array('express_type' => $express_type,'imageList'=>$imageList);
    }



    /* oodsCollocation
     *
     * 商品搭配页面 模板页面
     *
     * @return void
     * */
    public function goodsCollocation()
    {
          $data = self::goodsCollocationData();
          $this->smarty->assign('data',$data);
          $this->smarty->display('goodscollocation.html');
    }



    /* goodsCollocationData
     *
     * 商品搭配页面 数据
     *
     * @return array
     * */
    public static function goodsCollocationData()
    {
        $data = self::$staticData;
        $sid = intval($data['sid'])>0?$data['sid']:0;
        if(empty($sid) )
        {
            return array();
        }
        $data = GoodsModule::getGoodsCollocation($sid);
        if(empty($data) )
        {
            return array();
        }
        foreach($data as $key=>&$val)
        {
            $val['fname_url'] = comm::getImageRealPath($val['fname_url'],640,85);
            $val['img_url']  =  $val['fname_url'];
            $val['img_width']   =  640;
            $val['img_height']  =  85;
        }
        return $data;
    }


    /*
     * 获取H5商品详情页5个tab的数据
     *
     * getgoodsDetail
     * @param  array  $data 传入的数据
     * @return json
     * */
    public  static function getgoodsDetail()
    {
        $data =  self::$staticData;
        $source_id   = isset($data['sid'])  ? intval($data['sid']):0;
        $business_id = isset($data['bid'])? intval($data['bid']):0;
        if(empty($business_id) || empty($source_id))
        {
            base::responseMsg('1','信息错误');
        }
        $goodsCollocation =  self::goodsCollocationData(); //搭配
        $goodsDetail      =  self::goodsDetailData();     //详情数据
        if(isset( $goodsDetail['pictures']) && !empty($goodsCollocation) )
        {
            $goodsDetail['pictures'] = array_merge($goodsDetail['pictures'],$goodsCollocation);
        }
        if(!isset($goodsDetail['pictures']) && !empty($goodsCollocation))
        {
            $goodsDetail['pictures'] = $goodsCollocation;
        }
        $goodsData['goodsDetail']         =  $goodsDetail;
        $goodsData['goodsSize']           =  self::goodsSizeData();
        $goodsData['brandIntroduction']  =  self::brandIntroductionData();
        $goodsData['aftersaleService']   =  self::aftersaleServiceData();
        unset($data);
        base::responseMsg('0','success',$goodsData);
    }





	/*
	H5 品牌详情页
	zhangxuanru
	*/
      public function designerDetails()
      {
          $data = self::$staticData;
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
