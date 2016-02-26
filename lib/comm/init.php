<?php
/**
 * 初始化系统文件
 *
 * PHP version 5.5
 *
 * @author   zhanxuanru <zhaoyan@hichaos.com>
 * @license  http://www.hichao.com License
 * @link     http://wiki.mingxingyichu.cn/display/EC/ECShop+Home
 */


if (!defined('IN_ECS')) {
    die('Hacking attempt');
}

ini_set("error_reprorting", "E_ALL");
ini_set("display_errors", "Off");
ini_set("log_errors", "On");
ini_set("error_log", "/data/logs/total/err_m.hichao.com.log");


use  comm\Db\Local;
/* 取得当前ecshop所在的根目录 */
define('ROOT_PATH', dirname(__DIR__));

// 定义项目基本配置信息
define('CONFIG_PATH', dirname(ROOT_PATH).DIRECTORY_SEPARATOR.'config');

$config_file = CONFIG_PATH . DIRECTORY_SEPARATOR . 'config.php';
 
if (file_exists($config_file) == false)
{
     die('Server Config Not Found!');
}

//引入配置文件
require($config_file);

if (PHP_VERSION >= '5.1' && !empty($timezone)) {
    date_default_timezone_set($timezone);
}
/**
 * 自动加载常用类库
 *
 * @param string $classname 类名称
 *
 * @return void
 */

function __autoload($classname)
{
    static $includeLib = array();
    $classFile = ROOT_PATH.DIRECTORY_SEPARATOR.str_replace('\\', '/', $classname).'.php';

    if (file_exists($classFile) === false) {
        return false;
    }

    if (in_array($classFile, $includeLib) === true)
    {
        return true;
    }
    $includeLib[] = $classFile;
    include $classFile;

    return true;
}

/* 初始化数据库类 */
$dbhost = explode(':', $db_host);
Local::initData($dbhost[0], $dbhost[1], $db_user, $db_pass, $db_name);
unset($db_host,$db_user,$db_pass,$db_name);

function loggingLock($path,$content)
{
    $fp = fopen($path, "a+");
    if (flock($fp, LOCK_EX)) {  // 进行排它型锁定
        // ftruncate($fp, 0);      // truncate file
        fwrite($fp, "$content\n");
        fflush($fp);            // flush output before releasing the lock
        flock($fp, LOCK_UN);    // 释放锁定
    } else {
        // echo "Couldn't get the lock!";
    }

    fclose($fp);
}



