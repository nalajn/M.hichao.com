import 'zepto';
import BASE from "h5_base";
import Cookie from "cookie";
import Common from "common";

var LOGIN = {
    settings: {
        host_name: "http://v1.m.hichao.com/app/templates/",
        login_state: Cookie.get('login_state') || '',
        loginUrl: '/connect/app/login',
        urlLogin: '/tokensign', //登录，根据token种 superstar
        taobaoSignUrl: 'http://www.hichao.com/beta/connect/web/taobao',
        weiboSignUrl: 'http://www.hichao.com/beta/connect/web/weibo',
        qqSignUrl: 'http://www.hichao.com/beta/connect/web/qq',
        weixinSignUrl: 'http://www.hichao.com/beta/connect/web/wechat',
        fromUrl: BASE.lang.getUrlParam('from') || '',
        last: BASE.lang.getUrlParam('last') || '',
        source_id: BASE.lang.getUrlParam('source_id') || '',
        main_image: BASE.lang.getUrlParam('main_image') || '',
        business_id: BASE.lang.getUrlParam('business_id') || '',
        good_data: BASE.lang.getUrlParam('good_data') || window.localStorage.getItem("good_data"),
        is_payed: BASE.lang.getUrlParam('is_payed'),
        option_pay_list: BASE.lang.getUrlParam('option_pay_list'),
        order_type: BASE.lang.getUrlParam('is_payed'),
        pay_order_amount: BASE.lang.getUrlParam('order_type'),
        pay_order_id: BASE.lang.getUrlParam('pay_order_id'),
        pay_order_sn: BASE.lang.getUrlParam('pay_order_sn'),
        tab_index: BASE.lang.getUrlParam('tab_index'),
        sort: BASE.lang.getUrlParam('sort'),
        paramUrl: window.location.search,
        warningHtml: '<dev class="warning"><div class="warning_content"><p>{error_message}</p><p><a href="javascript:void(0);">确定</a></p></div></dev>'
    },
    init: function() {
        var self = this,
            ua = navigator.userAgent.toLowerCase();

        if(window.location.host == "v1.m.hichao.com"){
            self.settings.host_name = "http://v1.m.hichao.com/app/templates/";
            self.settings.taobaoSignUrl = 'http://www.hichao.com/beta/connect/web/taobao';
            self.settings.weiboSignUrl = 'http://www.hichao.com/beta/connect/web/weibo';
            self.settings.qqSignUrl = 'http://www.hichao.com/beta/connect/web/qq';
            self.settings.weixinSignUrl = 'http://www.hichao.com/beta/connect/web/wechat';
        }else{
            self.settings.host_name = "http://m.hichao.com/app/templates/";
            self.settings.taobaoSignUrl = 'http://www.hichao.com/connect/web/taobao';
            self.settings.weiboSignUrl = 'http://www.hichao.com/connect/web/weibo';
            self.settings.qqSignUrl = 'http://www.hichao.com/connect/web/qq';
            self.settings.weixinSignUrl = 'http://www.hichao.com/connect/web/wechat';
        }

        BASE.lang.adapt();
        Common.init();
        self.bindEvent();
        $('#login').height($(window).height());
        //微信浏览器隐藏淘宝登录
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            $('.taobao').remove();
        }
    },

    // //绑定事件
    bindEvent: function() {
        var self = this,
            username = '',
            last = self.settings.last,
            password = "",
            self = this,
            par = {
                source_id: self.settings.source_id,
                main_image: self.settings.main_image,
                business_id: self.settings.business_id,
                good_data : encodeURIComponent(self.settings.good_data),
                is_payed: self.settings.is_payed,
                option_pay_list: self.settings.option_pay_list,
                order_type: self.settings.order_type,
                pay_order_amount: self.settings.pay_order_amount,
                pay_order_id: self.settings.pay_order_id,
                pay_order_sn: self.settings.pay_order_sn,
                tab_index: self.settings.tab_index,
                sort: self.settings.sort
            };
        //第三方登录成功跳转的页面
        var rdUrl = self.settings.host_name + self.settings.fromUrl + '.html?from='+last+'&' + $.param(par);
    
        //QQ SDK登录
        // $('#qq').attr('data-redirecturi',rdUrl);
        
        // QC.Login({
        //     btnId:"qq_btn",    //插入按钮的节点id
        //     size: "A_XL"
        // });
        // $('#qq_btn img').css('display','none');
        // $('#qq_btn a').css('width','100%').append('<img src="/app/images/login/qq_kj.png">');

        
        // QC.api("get_user_info", {})  
        //     .success(function(s){//成功回调  
        //         console.log(s)
        //         Cookie.set('app_name', s.data.nickname, {
        //             path: '/',
        //             domain: ".hichao.com"
        //         });
        //     })  
        //     .error(function(f){ 
        //         alert("获取用户信息失败！");  
        //     }); 
             
        // if(QC.Login.check()){  //如果已登录  
        //     QC.Login.getMe(function(openId, accessToken){  
        //     console.log(openId,accessToken)  
        //         Cookie.set('token', accessToken, {
        //             path: '/',
        //             domain: ".hichao.com"
        //         });
        //         Cookie.set('app_uid', openId, {
        //             path: '/',
        //             domain: ".hichao.com"
        //         });
        //     });
        // } 
 



        var redirectUrl = rdUrl;
        encodeURIComponent(rdUrl);
        Cookie.set('rd', redirectUrl, {
            path: '/',
            domain: '.hichao.com'
        });

        //点击删除按钮清空文本框
        $('.delete').on('tap',function(){
            $(this).addClass('hide').prev('input').val('');
        })
        $('.write_com input').blur(function(){
            $(this).next('.delete').addClass('hide');
        })

        // 用户名和密码要都输入才能显示
        $('.write_com input').on('keyup', function(e) {
            e.preventDefault()
            username = $('.J-user-name').val();
            password = $('.J-password').val();
            console.log(username, password);
            if($(this).val()){
                $(this).next('.delete').removeClass('hide');
            }
            if (username && password) {
                $('.write_com .login').addClass("J-sub-login");
            }else{
                $('.write_com .login').removeClass("J-sub-login");
            }
        });

        $('.write_com input').focus(function(){
            $('#login,body').height($(window).height()).css('overflow','hidden');
        });
        $('.write_com input').blur(function(){
            $('#login,body').removeAttr('style').attr('style','');
        })
        //找回密码
        $('.forget').on('tap', function() {
            var forgetHtml = '/app/templates/forget.html' + self.settings.paramUrl;
            window.location.href = forgetHtml;
        });
        //新用户注册
        $('.register').on('tap', function() {
            var registerHtml = '/app/templates/register.html' + self.settings.paramUrl;
            window.location.href = registerHtml;
        });
        //第三方登录
        $('.fast_login a').on('tap', function() {
            var pram = $(this).attr('data-value');
            self.linkForAuth(pram, $(this));
        });
        //登录事件
        $('.write_com .login').on('tap', function() {
            if ($(this).hasClass('J-sub-login')) {
                var url = self.settings.loginUrl;
                //登录前校验用户名和密码
                var data = {
                    username: username,
                    password: password
                }
                self.operate(url, data);
            }

        });
    },
    //第三方登录接口
    linkForAuth: function(auth, that) {
        var url, local_href, name, self = this;
        var par = {
            source_id: self.settings.source_id,
            main_image: self.settings.main_image,
            business_id: self.settings.business_id,
            good_data : encodeURIComponent(self.settings.good_data),
            is_payed: self.settings.is_payed,
            option_pay_list: self.settings.option_pay_list,
            order_type: self.settings.order_type,
            pay_order_amount: self.settings.pay_order_amount,
            pay_order_id: self.settings.pay_order_id,
            pay_order_sn: self.settings.pay_order_sn,
            tab_index: self.settings.tab_index,
            sort: self.settings.sort
            // rd:self.settings.host_name + self.settings.fromUrl + '.html?' + $.param(par)
        };
        console.log(par.good_data)
        switch (auth) {
            case 'taobao':
                name = '淘宝';
                url = self.settings.taobaoSignUrl;
                break;
            case 'qq':
                name = "QQ";
                url = self.settings.qqSignUrl;
                break;
            case 'weibo':
                name = "微博";
                url = self.settings.weiboSignUrl;
                break;
            case 'weixin':
                name = "微信";
                // url = self.settings.weixinSignUrl;

                // var weiRd = self.settings.host_name + self.settings.fromUrl + '.html?' + $.param(par);
                //在微信浏览器中打开
                // var weixinURl = encodeURIComponent(self.settings.weixinSignUrl + "?code_type=wechat_code&rd=" + weiRd);
                // url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9b07830d3c51f961&redirect_uri=' + weixinURl + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect';
                // appid = 'wx35af92946c4f99ff';

                var weiRd = self.settings.host_name + self.settings.fromUrl + '.html?' + $.param(par);
                var weixinURl = encodeURIComponent(weiRd);
                if(window.location.host == "v1.m.hichao.com"){
                    url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9b07830d3c51f961&redirect_uri='+encodeURIComponent("http://www.hichao.com/beta/connect/h5/wechat")+'&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect&uin=&key=&version=&pass_ticket=';
                }else{
                    url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9b07830d3c51f961&redirect_uri='+encodeURIComponent("http://www.hichao.com/connect/h5/wechat")+'&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect&uin=&key=&version=&pass_ticket=';
                }
                var h5Url = encodeURIComponent(weiRd);
                Cookie.set('rd', h5Url, {
                    path: '/',
                    domain: '.hichao.com'
                });
        };

        window.location.href = url;
    },

    //弹出层
    //ajax
    operate: function(url, data) {
        var self = this,
            last = self.settings.last;
        var par = {
            source_id: self.settings.source_id,
            main_image: self.settings.main_image,
            business_id: self.settings.business_id,
            good_data: encodeURIComponent(self.settings.good_data),
            is_payed: self.settings.is_payed,
            option_pay_list: self.settings.option_pay_list,
            order_type: self.settings.order_type,
            pay_order_amount: self.settings.pay_order_amount,
            pay_order_id: self.settings.pay_order_id,
            pay_order_sn: self.settings.pay_order_sn,
            tab_index: self.settings.tab_index,
            sort: self.settings.sort
        };
        $.ajax({
            type: 'post',
            url: url,
            data: data,
            dataType: 'json',
            success: function(result) {
                console.log(result)
                if (result.data) {

                    Cookie.set('token', result.data.token, {
                        path: '/',
                        domain: '.hichao.com'
                    });
                    Cookie.set('app_uid', result.data.user_id, {
                        path: "/",
                        domain: ".hichao.com"
                    });
                    Cookie.set('app_name', result.data.username, {
                        path: '/',
                        domain: ".hichao.com"
                    });
                    
                    var historyUrl = self.settings.host_name + self.settings.fromUrl + '.html?from='+last+'&' + $.param(par);
                    var ua = navigator.userAgent.toLowerCase();
                    // if (ua.match(/MicroMessenger/i) == "micromessenger") {
                    //     // var weiRd = self.settings.host_name + self.settings.fromUrl + '.html?' + $.param(par);
                    //     // //在微信浏览器中打开
                    //     // var weixinURl = encodeURIComponent(historyUrl + "?code_type=wechat_code&rd=" + weiRd);
                    //     // var loadUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9b07830d3c51f961&redirect_uri=' + weixinURl + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
                    //     // alert(loadUrl);
                    //     // window.location.href = historyUrl;
                    // } else {
                        window.location.href = historyUrl;
                    //}
                }else{
                    Common.setDialog(result.message);
                }
            },
            error: function() {
                console.log("请求失败");
            }
        });

    }
}
LOGIN.init();