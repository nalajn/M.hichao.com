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
namespace controller;
use  Module\BusinessModule;
use Module\GoodsModule;

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
class base
{

   public static $data;

    /**
     * @var array
     */
    static $responseData = null;

    /**
     * @var string
     */
    static $code = '0';

    /**
     * @var string
     */
    static $msg = 'success';

    /**
     * JSON 编码
     *
     * @param string $str 需要进行编码的字符
     *
     * @return string
     */
    public static function jsonEncode($str)
    {
        return json_encode($str, JSON_UNESCAPED_UNICODE);
    }

    /**
     * 返回相应数据
     *
     * @param mixed $result 要返回给客户端的数据
     *
     * @return void
     */
    public static function response($result)
    {
        if (is_array($result)) {
            if (isset($result['data'])) {
                $results = array('response' => array('code' => $result['code'],'msg' => $result['msg'], 'data' => $result['data']));
            } else {
                $results = array('response' => array('code' => $result['code'],'msg' => $result['msg']));
            }
            echo self::jsonEncode($results);
        } elseif (is_string($result)) {
            echo $result;
        }
        exit(0);
    }


    public static function setCode($code)
    {
        self::$code = $code;
    }

    public static function getCode()
    {
        return self::$code;
    }


    public static function setMessage($msg)
    {
        self::$msg = $msg;
    }

    public static function getMessage()
    {
        return self::$msg;
    }

    public  static function setResponseData($responseData)
    {
        self::$responseData  = $responseData;
    }

    public function getResponseData()
    {
        return self::$responseData;
    }
    // response the content
    public static function returnMsg()
    {
        $response = array(
            'code' => self::getCode(),
            'msg' => self::getMessage()
        );

        if (self::getResponseData() != null) {
            $response['data'] = self::getResponseData();
        }

        self::response($response);
    }
 /*
  * 返回消息
  * zhangxuanru
  * */
  public static function responseMsg($code=0,$msg='',$data=array())
  {
      self::setCode($code);
      self::setMessage($msg);
      if(!empty($data))
      {
         self::setResponseData($data);
      }
     self::returnMsg();
  }


    /*
    *检查$source_id
    * */
    public static  function  checkSourceid($data)
    {
        $source_id  = isset($data['sid'])?intval($data['sid']):0;
        $business_data = array();
        if(empty($source_id))
        {
            $source_id  = isset($data['source_id'])?intval($data['source_id']):0;
        }
        if($source_id > 0){
            //查询goods_id
            $business_data = GoodsModule::getBusinessBySourceId($source_id);
            if (isset($business_data['goods_id']) == false) {
                echo '商品没有被找到';
                exit;
            }
            if(!empty($business_data['announcement']))
            {
                $business_data['announcement'] = str_replace(array("\n","\t"),array("<br/>","&nbsp;"),$business_data['announcement']);
            }
            if(strlen($business_data['return_product_reason']) > 3 )
            {
                $business_data['return_product_reason'] = trim($business_data['return_product_reason']);
            }else
            {
                $business_data['return_product_reason'] = '';
            }
        }
        return $business_data;
    }





    /*
     * 根据URl参数获取business_id
     * zhangxuanru
     * http://dev.hichao.com/brand/1/1 (主要应用于此格式)
     * */
    public function getbusiness_id()
    {
        $url     = $_SERVER['REQUEST_URI'];
        $urldata = explode('/',$url);
        $count = count($urldata);
        array_pop($urldata);
        $business_id = array_pop($urldata);
        if(strpos($url,'brand')  &&  $business_id>0  && $count == 9)
        {
            $business_id = intval($business_id);
        }
        return ($business_id>0)?$business_id:0;
    }

    /*
     *  根据商家信息判断执行的方法 (H5品牌详情页与设计师详情页)
     * zhangxuanru
     * */

    public static function  getBusinessIdMethod($datas=array())
    {
        $brand_type  = NULL;
        $business_id  = isset($datas['id'])?($datas['id']):0;
        $businessData =   BusinessModule::getBusinessDataById($business_id);
        if(empty($businessData))
        {
             self::responseMsg('1','获取商家信息错误');
        }

        $brand_type = $businessData['brand_type'];
        $data  = array('business_id'=>$business_id);
        $data['brand_type'] = $brand_type;
        $data['stylist_name'] = $businessData['stylist_name'];
        $data['stylist_pic'] = $businessData['stylist_pic'];
        $data = array_merge($datas,$data);
        return  $data;
    }


  /*
   * 调用pythone接口获取收藏数
   * ZXR
   * */
    public static function GetcollectionData($iddata)
    {
        //调用春地接口太慢了， 这里先临时生成随机数
        $randMath = mt_rand(100,10000);

        return array('collection_count'=>$randMath);

        $pos = 0;
        if(is_array($iddata))
        {
            $pos = 1;
            $iddata = implode(',',$iddata);
        }
      $URL = SITE_API2_DOMAIN.'/sku/src2sku?ids='.$iddata;
      $ch = curl_init($URL) ;
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true) ; // 获取数据返回
      curl_setopt($ch, CURLOPT_BINARYTRANSFER, true) ; // 在启用 CURLOPT_RETURNTRANSFER 时候将获取数据返回
      $output = curl_exec($ch) ;
      if(!empty($output))
      {
           $output = json_decode($output,true);
      }
      if(empty($pos) )
      {
          $output = isset($output[$iddata])?$output[$iddata]:array();
      }
      return $output;
    }










}
