<?php
/**
 * Redis缓存
 *
 * PHP version 5.5
 *
 * @category Mall\Redis
 * @package  Mall\Redis
 * @author   zhaoyan <zhaoyan@hichaos.com>
 * @license  http://www.hichao.com License
 * @version  GIT: $Id$
 * @link     http://wiki.mingxingyichu.cn/display/EC/ECShop+Home
 */
namespace comm;

/**
 * Redis缓存
 *
 * PHP version 5.5
 *
 * @category Mall\Redis
 * @package  Mall\Redis
 * @author   zhaoyan <zhaoyan@hichaos.com>
 * @license  http://www.hichao.com License
 * @link     http://wiki.mingxingyichu.cn/display/EC/ECShop+Home
 */
class RedisCache
{
    /**
     * @var \Redis
     */
    private static $_redis = null;

    /**
     * 获取数据类库对象
     *
     * @return \Redis
     */
    private static function getRedis()
    {

        $k = rand(1,10000);
        //$redishost = FlexiHash::lookup('key'.$k);
        //$redishost = '192.168.1.16';
        if($k > 5000){
            $redishost = REDIS_CACHE_HOST_186;
            $port      = REDIS_CACHE_PORT_186;
        }else{
            $redishost = REDIS_CACHE_HOST_188;
            $port      = REDIS_CACHE_PORT_188;
        }
        if (self::$_redis instanceof \Redis == false) {
            self::$_redis = new \Redis();
            self::$_redis->connect($redishost, $port);
        }

        return self::$_redis;
    }

    /**
     * 静态魔术方法
     *
     * @param string $name 调用的方法名
     * @param string $args 方法的参数
     *
     * @return void
     */
    public static function __callStatic($name, $args)
    {
        $callback = array(
            self::getRedis(),
            $name
        );

        return call_user_func_array($callback, $args);
    }
}

