import 'zepto';
import BASE from "h5_base";
import SMS from "smsbutton";
import md5 from "md5";

var REGISTER = {
    settings: {
        sendSmsUrl: "/user/send_SMS",
        registerUrl: "/user/find_password"
    },
    init: function () {
        var self = this;
        BASE.lang.adapt();
        self.bindEvent();
        $('#forget').height($(window).height());
    },
    //绑定事件
    bindEvent: function () {
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
            }else{
                $('.j-for_regBtn a').removeClass("active");
            }
        });

        //发送验证码
        $('.J-captcha-btn').on('tap', function () {
            self.getSMS();
        });
        //找回密码
        $('.j-for_regBtn').on('tap', function () {
            var url = self.settings.registerUrl;
            var code = $(".J-captcha").val();
            var telPhone = $('.J-username').val() || "";
            var password = $('.J-password').val() || "";
            if (!BASE.regexp.isMobile(telPhone)) {
                $('.message_state').removeClass('message_send').addClass('message_error');
                $('.message_state').html('手机号码不正确');
                return;
            }
            else if (!code) {
                $('.message_state').removeClass('message_send').addClass('message_error');
                $('.message_state').html('验证码不正确');
                return;
            }
            else if (!password) {
                $('.message_state').removeClass('message_send').addClass('message_error');
                $('.message_state').html('密码不正确');
                return;
            }
            else {
                var data = {
                    username: telPhone,
                    code: code,
                    password: password,
                    app_name: 'mxyc'
                };
                self.operate(url, data);
            }

        });

    },
    //获取验证码
    getSMS: function () {
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
                getTel: function () {
                    return $('.J-username').val();
                },
                toggleClass: 'timecount',
                sendRequestSms: function (callback) {
                    var url = self.settings.sendSmsUrl;
                    var key = '93f5c2eab7ba9b5ac39bac1b927f9101';
                    var telPhone = $('.J-username').val() || "";
                    var data = {
                        mobile_num: telPhone,
                        type: 'find_password',
                        sign: md5(key + telPhone),
                        app_name: 'mxyc'
                    };
                    self.operate(url, data,callback);
                },
                templateTimeCount:"%time%s后重新获取",
                overClass:'overClass'
                //time: 60//倒计时时间
            });
        }
    },
    // ajax
    operate: function (url, data,callback) {
        var self = this;
        var telphone = data.mobile_num;
        var typeFlage = data.type;
        $.ajax({
            type: 'post',
            url: url,
            data: data,
            dataType: 'json',
            success: function (result) {
                if(result && result.data && result.data.status == 1){
                    //console.log('短信验证码已经发送到手机上')
                    if(typeFlage){
                        $('.message_state').html('短信验证码已经发送到手机号&nbsp;'+telphone);
                        callback();
                    }else{
                        $('.message_state').html('密码重置成功');
                        // alert('密码重置成功！');
                        // Common.setDialog('密码重置成功！');
                        window.history.back();
                    }
                    $('.message_state').removeClass('message_error').addClass('message_send');

                }else if(result.data.status == 0){
                    //  console.log('发送失败请稍后再试')
                    $('.message_state').removeClass('message_send').addClass('message_error').html(result.message);
                    //$('.message_state').html(result.data.message);
                    // self.popFun(result);
                }else{
                    $('.message_state').removeClass('message_send').addClass('message_error').html('接口错误');
                }
            },
            error:function(){
                console.log("请求失败");
            }

        });

    }
}
REGISTER.init();