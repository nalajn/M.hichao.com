import 'zepto';
import BASE from "h5_base";
import Cookie from "cookie";

var COMMON = {
    settings: {
        code: BASE.lang.getUrlParam('code') || ''
    },
	init: function(){
        var self = this,
            code = self.settings.code,
            appid = 'wx9b07830d3c51f961',
            secret = '367e2707ce9516a16359352f523324b0';

		$('.dialog').height($(window).height());

        //旋转屏幕
        var window_width = $(window).width(),
            window_height_new,
            window_width_new;
        $(window).resize(function(){
            window_width_new = $(window).width();
            window_height_new = $(window).height();
            if(window_width_new > window_width && window_height_new<420){
                self.setDialog('横屏显示内容较少，请竖屏浏览');
            }
            if(window_width_new != window_width && window_height_new>420){
                window_width = window_width_new;
                window.location.reload();
            }
        });
        

        // if(code){
        //     $.ajax({
        //         type: 'get',
        //         url: 'http://www.hichao.com/beta/connect/h5/wechat',
        //         data: {
        //             code: code
        //         },
        //         dataType: 'json',
        //         success: function(result) {
        //             var access_token = result.data.access_token,
        //                 openid = result.data.openid,
        //                 username = result.data.username;

        //             alert(access_token,openid,username)
        //             if(access_token){
        //                 Cookie.set('token', access_token, {
        //                     path: '/',
        //                     domain: '.hichao.com'
        //                 });
        //             }
        //             if(openid){
        //                 Cookie.set('app_uid', openid, {
        //                     path: "/",
        //                     domain: ".hichao.com"
        //                 });
        //             }
        //             if(username){
        //                 Cookie.set('app_name', username, {
        //                     path: '/',
        //                     domain: ".hichao.com"
        //                 });
        //             }
        //         },
        //         error: function() {
        //             alert("微信h5");
        //         }
        //     }); 
        // }
	},
	//显示提示框
	setDialog : function(text){
		if(text.length <= 10){
            $('.dialog .msg').css('lineHeight','2.4rem');
        }else{
            $('.dialog .msg').css('lineHeight','1.2rem');
        }
        $('.dialog').removeClass('hide').find('.msg').text(text);
        setTimeout(function(){
            $('.dialog').addClass('hide');
        },1000);
	},
	switchTab : function(tabs){
		var tab_tit = tabs.find('.tab_tit'),
            tit = tab_tit.find('.tit');

        tab_tit.on('tap','.tit',function(){
            var index = $(this).index();
            tit.removeClass('active').eq(index).addClass('active');
        });
	},
    //统计
    sendAnchor:function(events){
        var self = this,
            gi = Cookie.get('h5_guid'),
            ip,
            ua = window.navigator.userAgent,  //操作系统信息
            t = new Date(),
            ts = t.getFullYear()+'-'+t.getMonth()+1+'-'+t.getDate()+' '+t.getHours()+':'+t.getMinutes()+':'+t.getSeconds(),
            uid = Cookie.get('app_uid'),
            url,
            getIpUrl = 'http://chaxun.1616.net/s.php?type=ip&output=json&callback=?&_='+Math.random();    
        
        if(window.location.host == "v1.m.hichao.com"){
            url = 'http://v1.m.hichao.com/api/v1/track';
        }else{
            url = 'http://m.hichao.com/api/v1/track';
        }

        $.getJSON(getIpUrl, function(data){  
            ip = data.Ip;    
        });  

        $.ajax({
            type: 'post',
            url: url,
            dataType: 'json',
            data:{
                data: JSON.stringify({
                    'gc': "hichao",
                    'gf': "H5",  //应用平台
                    'gi': gi,    //唯一标识
                    'gs': window.screen.width+"x"+window.screen.height,  //用户设备分辨率
                    // gsv: "",  //操作系统版本
                    // gt: "",  //手机型号
                    // gv: "6.4.0.14",  //应用版本名称
                    'ip': ip,
                    //isp: "",   //运营商 移动mobile  联通unicom  电信tel
                    'net': "wifi",  //网络状态
                    'os': "",  //用户操作系统
                    'push_token': "GT;;",  //用户接受推送的token
                    'ts': ts,  //时间 "2014-10-12 11:11:11"
                    'uid': uid, 
                    'events': events
                })
            },
            success: function(result) {
                window.console.log(result);
                if (result.success === "1") {
                    
                } else {
                    
                }
            },
            error: function() {
                // alert("请求失败");
            }
        });
    }
}
export  default  COMMON;