<?php
/**
 * 明星衣橱 商品信息数据交互模块
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
use comm\Db\Local;
use comm\comm;
use comm\RedisCache;
use comm\Client;
use controller\base;

/**
 * 明星衣橱 商品信息数据交互模块
 *
 * PHP version 5.5
 *
 * @category Mall\Module
 * @package  Mall\Module
 * @author   zxr  <zhangxuanru@hichao.com>
 * @license  http://www.hichao.com License
 * @link     http://wiki.mingxingyichu.cn/display/EC/ECShop+Home
 */
class GoodsModule
{

    /**
     * 根据Source_id来获取商家信息
     *
     * @param string $source_id 单品ID
     *
     * @return array
     */
    public static function getBusinessBySourceId($source_id)
    {

        $sql = 'SELECT g.id,g.goods_id,b.business_id,b.brand_name,b.express_type,b.is_return_product,b.announcement,b.return_product_reason,b.brand_desc FROM '.Comm::table('goods_source').' g, '.Comm::table('business_info')
            .' b WHERE g.business_id=b.business_id';

        $source_id = intval($source_id);

        $cacheKey = SHOP_CACHE_SOURCE_DATA.'_sg_'.$source_id;

        $data = RedisCache::get($cacheKey);
        $data = json_decode($data,true);

        if(OPEN_REDIS_CACHE == false )
        {
            $data = array();
        }

        if(!empty($source_id)  || empty($data) )
        {
            $sql.= " AND g.id=:id";
            $data = Local::fetchOne($sql, array(':id' => $source_id));
            RedisCache::set($cacheKey, json_encode($data),REDIS_CACHE_TIME);
            return $data;
        }
        return $data;
    }


    /*
     * 查询商品具体数据
     * */
    public static function  getBusinessGoodsInfo($goods_id)
    {
        $CacheCateKey = SHOP_CACHE_BUSINESS_GOODS.'_'.$goods_id;
        $CacheKeydata = RedisCache::get($CacheCateKey);
        $cateinfo     = json_decode($CacheKeydata, true);
        if(!empty( $cateinfo) && OPEN_REDIS_CACHE == true)
        {
            return $cateinfo;
        }

        $sql = 'SELECT goods_sn,goods_name,goods_desc AS goods_brief,goods_img,goods_img_width,goods_img_height,business_id,brand_location FROM '
            .Comm::table('goods').' AS g   WHERE goods_id=:goods_id';

        $data = Local::fetchOne($sql, array(':goods_id' => $goods_id));

        RedisCache::set($CacheCateKey,json_encode($data),REDIS_CACHE_TIME);

        return $data;
    }

    /**
     * 根据SOURCE_ID获取图片
     *
     * @param int $sourceId
     *
     * @return array
     */
    public static function getGoodsDetailSourceImage($sourceId)
    {
        $CacheKey = SHOP_CACHE_GETBUSINESSGOODSGALLERY_DATA.'_m_Image_'.$sourceId;
        $data = RedisCache::get($CacheKey);
        $rows = json_decode($data,true);
        if(!empty( $rows) && OPEN_REDIS_CACHE == true)
        {
            return $rows;
        }

        $sql = 'SELECT a.attr_value,a.attr_id, a.attr_image,a.attr_image_width,a.attr_image_height FROM '.Comm::table('goods_source').' s LEFT JOIN '.Comm::table('goods_attr').' a ON s.goods_attr_id=a.goods_attr_id WHERE s.id=:source_id';
        $data=Local::fetchOne($sql, array(':source_id' => $sourceId));

        RedisCache::set($CacheKey,json_encode($data),REDIS_CACHE_TIME);
        return $data;
    }


    /**
     * 根据SOURCE_ID获取国别
     *
     * @param int $business_id
     *
     * @return array
     */
    public static function getCountryRow($business_id)
    {
        $sql = 'SELECT tag_name FROM '.Comm::table('business_tag').'   WHERE business_id=:business_id AND parent_tag_id=:parent_tag_id';
        $data=Local::fetchOne($sql, array(':business_id' => $business_id,':parent_tag_id'=>'60'));
        return $data;
    }




    /**
     * 获取商家商品的图片
     *
     * @param string $instance 数据库实例
     * @param string $goods_id 商品ID
     *
     * @return array
     */
    public static function getBusinessGoodsGallery($goods_id,$source='',$business_id=0)
    {
        $CacheKey = SHOP_CACHE_GETBUSINESSGOODSGALLERY_DATA.'_m_'.$business_id.'_'.$goods_id;
        $data = RedisCache::get($CacheKey);
        $rows = json_decode($data,true);

        if(!empty($data) &&  is_array($rows)  && OPEN_REDIS_CACHE == true )
        {
            return $rows;
        }
        $array1 = array(
            'referer'=>'shop_api',
            'goods_id' => $goods_id,
            'business_id'=>$business_id
        );

        $res = Client::request(GOODS_SERVICE.'/goodsGallery/GetGoodsDetailImage','data='.json_encode($array1));
        $res = json_decode($res['res'],true);
        $rows = $res['data'];
        if(empty($rows))
        {
            return $rows;
        }

        foreach ($rows as $k => &$v) {
            if(empty($v['img_url']))
            {
                unset($rows[$k]);
                continue;
            }
            $v['img_url'] = Comm::getImageRealPath($v['img_url'], 640, 80);
            $v['primary_img_url'] = Comm::getImageRealPath($v['img_url']);
        }

        RedisCache::set($CacheKey,json_encode($rows),REDIS_CACHE_TIME);
        return $rows;
    }






    public static function insertPictureTemp($business_id)
    {
        $picture=array(
            422,
            423,
            424,
            426,
            427,
            428,
            429,
            431,
            433,
            464,
            455,
            483,
            484,
            516,
            517
        );
        $imglist=array();
        if(in_array($business_id, $picture))
        {
            $imglist = array(
                'img_url'=>'http://api.mall.hichao.com/images/SizeGuide.jpg',
                'img_address' => 'http://api.mall.hichao.com/images/SizeGuide.jpg',
                'img_height' => '420',
                'img_width' =>'600',
                'img_id' => '0',
                'primary_img_url'=>'http://api.mall.hichao.com/images/SizeGuide.jpg'
            );
            return $imglist;
        }
    }

    /* 获取商家售后服务
     *
     *@param  int  $business_id  商家ID
     *@return array              返回图片地址
     * */
    public  function  getAftersaleImgList($business_id = 0)
    {
        $CacheKey = SHOP_CACHE_GETBUSINESSGOODSGALLERY_DATA.'_busines_server_'.$business_id;
        $data = RedisCache::get($CacheKey);
        $rows = json_decode($data,true);
        if(!empty($rows) &&  is_array($rows)  && OPEN_REDIS_CACHE == true )
        {
            return $rows;
        }
        $array = array(
            'referer'=>'shop_api',
            'business_id'=> $business_id
        );

        $result  = Client::request(GOODS_SERVICE.'/goodsGallery/GetAfterSalesImage','data='.json_encode($array));

        $data = array();
        if($result['code'] == 200 && !empty($result['res']))
        {
            $data =  json_decode($result['res'],true);
        }
        if(!empty($data))
        {
            $data =  $data['data'];
            foreach ($data as $k => &$values) {
                if (!empty($values['img_url'])) {
                    $values['img_url'] = Comm::getImageRealPath($values['img_url'], 640, 80);
                    $values['primary_img_url'] = Comm::getImageRealPath($values['img_url']);
                    $values['img_address'] = $values['img_url'];
                }else
                {
                    unset($data[$k]);
                }
            }
        }

        RedisCache::set($CacheKey,json_encode($data),REDIS_CACHE_TIME);

        return $data;
    }

    /*  根据商家ID查询通用尺码图
     *  getSizeImages
     * @param  int  $business_id 商家ID
     * @date   2015-07-10
     * @author zxr
     * */
    public  static  function getSizeImages($business_id)
    {
        $sizeRow = array();

        if(empty($sizeRow)){
            $sizeRow[0] = array(
                'img_url'=>'http://api.mall.hichao.com/images/chimamorentu.png',
                'img_address' => 'http://api.mall.hichao.com/images/chimamorentu.png',
                'img_height' => '640',
                'img_width' =>'640',
                'img_id' => '0',
                'primary_img_url'=>'http://api.mall.hichao.com/images/chimamorentu.png'
            );
        }

        return $sizeRow;
    }

    /*
     *根据goods_id 查询 商品相册 （商品尺码图）
     * */
    public  static  function  getGoodsGallery($goods_id,$business_id=0)
    {
        $cacheKey = SHOP_CACHE_GOODS_GALLERY.'_chima_'.$goods_id;
        $data = RedisCache::get($cacheKey);
        $data = json_decode($data,true);
        if(!empty($data) && is_array($data) && OPEN_REDIS_CACHE == true  )
        {
            return $data;
        }
        $array2 = array(
            'referer'=>'shop_api',
            'goods_id' => $goods_id,
            'business_id'=> $business_id
        );

        $resp = Client::request(GOODS_SERVICE.'/goodsGallery/GetGoodsExplainImage','data='.json_encode($array2));
        $resp = json_decode($resp['res'],true);
        $rows = $resp['data'];
        if(empty($rows))
        {
            return $rows;
        }
        foreach ($rows as $k => $v) {
            if (!empty($v['img_url'])) {
                $rows[$k]['img_url'] = Comm::getImageRealPath($v['img_url'], 640, 80);
                $rows[$k]['img_address'] =  $rows[$k]['img_url'];
                $rows[$k]['img_width'] = 640;
                $rows[$k]['img_height']  = 80;
                $rows[$k]['primary_img_url'] = Comm::getImageRealPath($v['img_url']);
            }else
            {
                unset($rows[$k]);
            }
        }

        if(!empty($rows))
        {
            RedisCache::set($cacheKey,json_encode($rows),REDIS_CACHE_TIME);
        }
        return $rows;

    }

 /* getGoodsCollocation
  * 根据$source_id获取搭配参考 的数据信息
  * @param int $source_id 传过来的 source_id
  * @author  zxr
  * @date    2015-09-07
  * @return  array
  * */
    public function  getGoodsCollocation($source_id=0)
    {
        $cacheKey = SHOP_CACHE_SOURCE_DATA.$source_id;
        $data = RedisCache::get($cacheKey);
        if(!empty($data)){
           $data = Comm::uncompressStr($data); //解压缩
           $data = json_decode($data,true);
        }
        if(empty($data) || OPEN_REDIS_CACHE == false )
        {
           $sql  = 'SELECT fname_url,ns,goods_query from '.Comm::table('goods_collocation').' where source_id=:source_id';
           $data = Local::fetchAll($sql,array(':source_id'=>$source_id));
           $comData = Comm::compressedStr(json_encode($data));
           RedisCache::set($cacheKey,$comData,REDIS_CACHE_TIME);
        }
      return  $data;
    }



    /**
     * @param $business_id
     * @param $page
     * @param int $pageSize
     * @return mixed
     * 获取商家商品信息
     */
    public static function getBusinessGoods($business_id)
    {
        $cacheKey = SHOP_CACHE_BUSINESS_DATA.'_'.$business_id;
        $data = RedisCache::get($cacheKey);
        $rows = json_decode($data,true);
        if(!empty($rows) && OPEN_REDIS_CACHE == true)
        {
            return $rows;
        }

        $sql = 'SELECT goods_name,  goods_id, shop_price, market_price,goods_img FROM ' . Comm::table('goods') .
            " WHERE business_id=:business_id AND is_on_sale=1 AND is_delete=0 ORDER BY add_time DESC LIMIT 100";
        $rows = Local::fetchAll($sql, array(':business_id' => $business_id));

        if(!empty($rows))
        {
            foreach($rows as $k=>$v)
            {
                 $collection_count =  base::GetcollectionData( $v['source_id']);
                 $rows[$k]['click_count'] = $collection_count['collection_count'];
            }
        }
        RedisCache::set($cacheKey,json_encode($rows),REDIS_CACHE_TIME);
        return $rows;
    }

    /*
     * 根据goods_id 获取 goods_source表ID
     * */
    public static function  getSourceIdBy($goods_id)
    {
        $sql = 'SELECT id FROM '.Comm::table('goods_source').' WHERE goods_id=:goods_id LIMIT 1';
        $row = Local::fetchOne($sql, array(':goods_id' => $goods_id));
        return $row['id'];
    }

    /*
     * 根据goods_id 获取 products表的 product_price,
     * */
    public static function  getPorductPrice($goods_id)
    {
        $sql = 'SELECT product_price FROM '.Comm::table('products').' WHERE goods_id=:goods_id LIMIT 1';
        $row = Local::fetchOne($sql, array(':goods_id' => $goods_id));
        return $row['product_price'];
    }





}