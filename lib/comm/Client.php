<?php
/**
 * HTTP通信客户端
 *
 * PHP version 5.5
 *
 * @category Hichao\Http
 * @package  Hichao\Http
 * @author   zhaoyan <zhaoyan@hichaos.com>
 * @license  http://www.hichao.com License
 * @version  GIT: $Id$
 * @link     http://wiki.mingxingyichu.cn/display/EC/ECShop+Home
 */
namespace comm;

/**
 * HTTP通信客户端
 *
 * @category Hichao\Http
 * @package  Hichao\Http
 * @author   zhaoyan <zhaoyan@hichaos.com>
 * @license  http://www.hichao.com License
 * @link     http://wiki.mingxingyichu.cn/display/EC/ECShop+Home
 */
class Client
{
    /**
     * 发送数据请求到腾讯API交互接口
     *
     * @param string $url     请求的地址
     * @param string $content 发送的内容
     * @param string $method  请求的方法,默认POST
     * @param int    $timeOut 默认3秒超时
     * @param array  $cert    证书相关
     * @param string $caFile  CA文件
     *
     * @return array
     */
    public static function request($url, $content, $method = 'post', $timeOut = 3, $cert = array(), $caFile = '')
    {
        $data = array('res' => '', 'code' => '', 'info' => '');
        // 启动一个CURL会话
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_TIMEOUT, $timeOut);
        // 获取的信息以文件流的形式返回，而不是直接输出
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        // 从证书中检查SSL加密算法是否存在
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
        if ($method == "post") {
            // 发送一个常规的POST请求，类型为：application/x-www-form-urlencoded，就像表单提交的一样。
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_URL, $url);
            // 要传送的所有数据
            curl_setopt($ch, CURLOPT_POSTFIELDS, $content);
        } else {
            curl_setopt($ch, CURLOPT_URL, $content);
        }

        // 设置证书信息
        if (isset($cert['certFile']) && $cert['certFile'] != '') {
            curl_setopt($ch, CURLOPT_SSLCERT, $cert['certFile']);
            curl_setopt($ch, CURLOPT_SSLCERTPASSWD, $cert['certPasswd']);
            curl_setopt($ch, CURLOPT_SSLCERTTYPE, $cert['certType']);
        }

        // 设置CA
        if ($caFile != "") {
            // 对认证证书来源的检查，0表示阻止对证书的合法性的检查。1需要设置CURLOPT_CAINFO
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 1);
            curl_setopt($ch, CURLOPT_CAINFO, $caFile);
        } else {
            // 对认证证书来源的检查，0表示阻止对证书的合法性的检查。1需要设置CURLOPT_CAINFO
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        }

        // 执行操作
        $data['res'] = curl_exec($ch);
        $data['code'] = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        if ($data['res'] == null) {
            $data['info'] = "call http err :" . curl_errno($ch) . " - " . curl_error($ch);
            curl_close($ch);

            return $data;
        } else {
            if ($data['code'] != "200") {
                $data['info'] = "call http err httpcode=" . $data['code'];
                curl_close($ch);

                return $data;
            }
        }

        curl_close($ch);

        return $data;
    }
}
