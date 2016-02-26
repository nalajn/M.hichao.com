<?php
namespace Module;
use comm\comm;
use comm\Db\Local;
use Module\BusinessModule;
use Module\GoodsModule;

class brandModule
{

    //获取商家banner
    public static function getBusinessBannerById($businessId,$type)
    {
       return  BusinessModule::getBusinessBannerById($businessId,$type);
    }
/*
    //获取商家商品
    public static function getGoodsDataBySourceId($business_id)
    {
       return  GoodsModule ::getGoodsDataBySourceId($business_id);
    }
    */

    //获取商家商品
    public static function getGoodsListBySourceId($business_id)
    {
        $goods_list  =   GoodsModule ::getBusinessGoods($business_id);
        return $goods_list;
    }





}