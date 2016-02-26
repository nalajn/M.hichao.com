<?php
/**
 * 商家数据处理模型
 *
 * PHP version 5.5
 *
 * @category Mall\Module
 * @package  Mall\Module
 * @author   zhaoyan <zhaoyan@hichaos.com>
 * @license  http://www.hichao.com License
 * @version  GIT: $Id$
 * @link     http://wiki.mingxingyichu.cn/display/EC/ECShop+Home
 */
namespace Module;
use comm\comm;
use comm\Db\Local;
use comm\RedisCache;
use comm\Client;

/**
 * 商家数据处理模型
 *
 * PHP version 5.5
 *
 * @category Mall\Module
 * @package  Mall\Module
 * @author   zhaoyan <zhaoyan@hichaos.com>
 * @license  http://www.hichao.com License
 * @link     http://wiki.mingxingyichu.cn/display/EC/ECShop+Home
 */
class BusinessModule
{
    /**
     * 根据商家ID获取商家信息
     * 
     * @param int $businessId 商家ID
     * 
     * @return array
     */
    public static function getBusinessDataById($businessId)
    {
        if(empty($businessId) || intval($businessId) == 0)
        {
            return array();
        }
        $cacheKey = SHOP_CACHE_BUSINESS_DATA.'_business_'.$businessId;
        $data = RedisCache::get($cacheKey);
        $rows = json_decode($data,true);
        if(!empty($rows) && OPEN_REDIS_CACHE == true)
        {
            return $rows;
        }
        $sql  = 'SELECT * FROM '.Comm::table('business_info').' WHERE business_id='.$businessId.' AND status=1 LIMIT 1';
        $rows =  Local::fetchOne($sql);

        RedisCache::set($cacheKey,json_encode($rows),REDIS_CACHE_TIME);
        return $rows;

    }

    /**
     * 获取商家banner
     * @param $businessId
     * @param $type
     * @return mixed=
     */
    public static function getBusinessBannerById($businessId,$type)
    {
        $cacheKey = SHOP_CACHE_BUSINESS_DATA.'_banner_'.$businessId.'_'.$type;
        $data = RedisCache::get($cacheKey);
        $rows = json_decode($data,true);
        if(!empty($rows) && OPEN_REDIS_CACHE == true)
        {
            return $rows;
        }

        $sql = 'SELECT * FROM '.Comm::table('business_banner').' WHERE business_id=:business_id AND type=:type LIMIT 1';

        $rows =  Local::fetchOne($sql, array(':business_id' => $businessId, ':type' => $type));

        RedisCache::set($cacheKey,json_encode($rows),REDIS_CACHE_TIME);

        return $rows;
    }


    /*getBrandIntroduction
    *品牌故事
    *
    * @param int $buesiness_id 商家ID
    * @return  $data
    * */
    public static function getBrandIntroduction($business_id = 0 )
    {
        $business_id  =  intval($business_id);
        $data = array();
        if(empty($business_id))
        {
            return $data;
        }
        $array = array(
            'referer'=>'api',
            'business_id'=> $business_id
        );
       $result  = Client::request(GOODS_SERVICE.'/goodsGallery/GetBrandStoryImage','data='.json_encode($array));
       if( !isset($result['code']) || $result['code'] != 200 )
       {
          return $data;
       }
      $res  =   isset($result['res'])?$result['res']:$data;
      $res  =   json_decode($res,true);
      $data =  isset($res['data'])?$res['data']:$data;
      if(!empty($data)){
          foreach($data as $imgk => &$imgv)
          {
              $imgv['img_url'] =  comm::getImageRealPath($imgv['img_url'],640,200);
          }

      }
      return $data;
    }


  /*  getBusinesssFieldList
   * 根据传入的字段查询ecs_business_info表
   * @param string $field 传入的要查询的字段,多个字段用,分隔
   * @param  int   $business_id 商家ID
   * @author zxr
   * @date 2015-11-26
   * @return  array()
 * */
    public static function  getBusinesssFieldList($field='*',$business_id)
    {
        $business_id = intval($business_id);
        $sql  = sprintf(" SELECT  %s  FROM  ".Comm::table('business_info')." WHERE business_id=%d",$field,$business_id);
        $businessData = Local::fetchOne($sql);
        return $businessData;
    }

}
