import 'zepto';
import BASE from "h5_base";
import SMS from "smsbutton";
import md5 from "md5";
import VER_CONFIG from 'version';
import Cookie from "cookie";

var REGISTER = {
    settings: {
        sendSmsUrl: "http://beta.api2.hichao.com/user/send_SMS",
        registerUrl: "http://beta.api2.hichao.com/user/user_register",
        fromUrl: BASE.lang.getUrlParam('from') || '',
        source_id: BASE.lang.getUrlParam('source_id') || '',
        main_image: BASE.lang.getUrlParam('main_image') || '',
        business_id: BASE.lang.getUrlParam('business_id') || '',
        good_data: BASE.lang.getUrlParam('good_data') || window.localStorage.getItem("good_data")
    },
    init: function() {
        var self = this;
        BASE.lang.adapt();
        self.bindEvent();
        $('#register').height($(window).height());
    },
    //绑定事件
    bindEvent: function() {
        var self = this;
        
        //点击删除按钮清空文本框
        $('.delete').on('tap',function(){
            $(this).addClass('hide').prev('input').val('');
        })
        $('.box input').blur(function(){
            $(this).next('.delete').addClass('hide');
        })

        $('.input_span input').on('keyup',function(){
            if($(this).val()){
                $(this).next('.delete').removeClass('hide');
            }
        })

        $('.J-password').on('keyup', function() {
            var username = $('.J-username').val(),
                code = $('.J-captcha').val(),
                password = $('.J-password').val();
            if (username && code && password) {
                $('.j-for_regBtn a').addClass("active");
            }
        });

        //发送验证码
        $('.J-captcha-btn').on('tap', function() {
            self.getSMS();
        });
        //注册
        $('.j-for_regBtn').on('tap', function() {
            var url = self.settings.registerUrl,
                code = $(".J-captcha").val(),
                telPhone = $('.J-username').val() || "",
                password = $('.J-password').val() || "";
            if (!BASE.regexp.isMobile(telPhone)) {
                $('.message_state').removeClass('message_send').addClass('message_error');
                $('.message_state').html('手机号码不正确');
                return;
            } else if (!code) {
                $('.message_state').removeClass('message_send').addClass('message_error');
                $('.message_state').html('验证码不正确');
                return;
            } else if (!password) {
                $('.message_state').removeClass('message_send').addClass('message_error');
                $('.message_state').html('密码不正确');
                return;
            } else {
                var data = {
                    mobile_num: telPhone,
                    code: code,
                    password: password,
                    app_name: 'mxyc'
                };
                self.operate(url, data);
            }

        });

    },
    //获取验证码
    getSMS: function() {
        var self = this;
        $('.message_state').html('');
        var telPhone = $('.J-username').val() || "";
        if (!BASE.regexp.isMobile(telPhone)) {
            $('.message_state').removeClass('message_send').addClass('message_error');
            $('.message_state').html('手机号码不正确');
            return;
        }else{
            //验证码按钮组件
            SMS({
                dInput: $(".J-captcha-btn"),
                getTel: function() {
                    return $('.J-username').val();
                },
                toggleClass: 'timecount',
                sendRequestSms: function(callback) {
                    var url = self.settings.sendSmsUrl;
                    var key = VER_CONFIG.userkey;
                    var telPhone = $('.J-username').val() || "";
                    var data = {
                        mobile_num: telPhone,
                        type: 'user_register',
                        sign: md5(key + telPhone),
                        app_name: 'mxyc'
                    };
                    self.operate(url, data, callback);
                },
                templateTimeCount: "%time%s后重新获取",
                overClass: 'overClass',
                //time: 60//倒计时时间
            });
        }
    },
    // ajax
    operate: function(url, data, callback) {
        var self = this;
        var telphone = data.mobile_num;
        var typeFlage = data.type;
        $.ajax({
            type: 'post',
            url: url,
            data: data,
            dataType: 'json',
            success: function(result) {
                if (result && result.data && result.data.status == 1) {
                    //console.log('短信验证码已经发送到手机上')
                    if (typeFlage) {
                        $('.message_state').html('短信验证码已经发送到手机号&nbsp;' + telphone);
                        callback();
                    } else {
                        $('.message_state').html('注册成功');
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
                        
                        var par = {
                            source_id: self.settings.source_id,
                            main_image: self.settings.main_image,
                            business_id: self.settings.business_id,
                            good_data: encodeURIComponent(self.settings.good_data)
                        };
                        // alert('注册成功，请登录！');
                        // Common.setDialog('注册成功，请登录！')
                        if (self.settings.fromUrl) {
                            var historyUrl = '/app/templates/' + self.settings.fromUrl + '.html?' + $.param(par);
                            window.location.href = historyUrl;
                        }
                    }
                    $('.message_state').removeClass('message_error').addClass('message_send');
                } else if (result.data.status == 0) {
                    //  console.log('发送失败请稍后再试')
                    $('.message_state').removeClass('message_send').addClass('message_error').html(result.message);
                    //$('.message_state').html(result.data.message);
                    // self.popFun(result);
                } else {
                    $('.message_state').removeClass('message_send').addClass('message_error').html('接口错误');
                }
            },
            error: function() {
                console.log("请求失败");
            }

        });

    }
}
REGISTER.init();