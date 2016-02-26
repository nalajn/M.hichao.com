<?php
/**
 * 明星衣橱数据对接接口公共类库,引入该文件,所有公用方法都放到这里
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
namespace comm;
use Module\BusinessModule;

/**
 * 明星衣橱数据对接接口公共类库,引入该文件,所有公用方法都放到这里
 *
 * PHP version 5.5
 *
 * @category Mall\Module
 * @package Mall\Module
 * @author zhaoyan <zhaoyan@hichaos.com>
 * @license http://www.hichao.com License
 * @link http://wiki.mingxingyichu.cn/display/EC/ECShop+Home
 */
class Comm
{
    /**
     * @var string
     */
    static $msg = 'success';

    private static $b2c = array(
        'business_info',
        'business_address',
        'goods_source',
        'goods_attr',
        'goods_gallery',
        'goods',
        'goods_import',
        'goods_import_log',
        //'guanyi_goods_send',
        'products',
        'users',
        'order_payment',
        'user_address',
        'user_account',
        'order_info',
        'order_goods',
        'order_bouns',
        'activity_promote_business',
        'activity_promote',
        'cash_coupon',
        'cash_coupon_use',
        'business_goods_sell',
        'user_bonus',
        'bonus',
        'user_coupon',
        'activity',
        'cart',
        'attribute'
    );

    private static $search = array(
        'categories_v2',
        'category_mapping'
    );

    /**
     * 根据不同的数据实例来执行相应的SQL语句
     * 
     * @param string $str      表名
     * @param string $instance 数据库实例
     */
    public static function table($str, $instance = '')
    {
        if(in_array($str,self::$search)){
            return SEARCH_DB.'.'.$str;
        }

        return BUSINESS_PLATFORM_DB.'.'.'ecs_'.$str;
    }


    /**
     * 获取图片的网络真实地址
     *
     * @param string $image_path 当前的图片的地址
     * @param int    $width      图片裁剪的宽度
     * @param int    $height     图片裁剪的高度
     *
     * @return string
     */
    public static function getImageRealPath($image_path, $width = 0, $height = 0)
    {
        $data = '';
        if (substr($image_path, 0, 4) == 'http') {
            $data = $image_path;
        } else {
            $data = SITE_IMAGE_CDN_URL_PREFIX . $image_path;
        }

        $len = strrpos($data, '?imageMogr2');
        if ($len > 1) {
            $data = substr($data, 0, $len);
        }

        if ($width > 0 && $height > 0 && $len < 1) {
            $data .= self::getImageRealPathCut($width, $height);
        }

        return $data;
    }

    /**
     * 对图片进行裁剪.
     * 
     * @param int $width  图片裁剪的宽度
     * @param int $height 图片裁剪的高度
     * 
     * @return string
     */
    public static function getImageRealPathCut($width, $height)
    {
        // return '?imageMogr2/auto-orient/thumbnail/'.$width.'x%3E/quality/'.$height;
        return '?imageMogr2/thumbnail/'.$width.'x%3E/quality/'.$height;

    }

    /* compressedStr
     *  压缩字符串
     * @param string $str 要压缩的字符串
     * @return string $str 返回压缩后的字符串
     * */
    public static function compressedStr($str)
    {
        $str = gzcompress($str,9);
        return $str;
    }


    /* uncompressStr
     *  解压缩字符串
     * @param string $str 要压缩的字符串
     * @return string $str 返回压缩后的字符串
     * */
    public static function uncompressStr($str)
    {
        $str =  gzuncompress($str);
        return $str;
    }






}
