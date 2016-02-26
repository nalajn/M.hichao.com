import 'zepto';
import BASE from 'h5_base';
import base64_encode from 'base64';
import md5 from 'md5';
import VER_CONFIG from 'version';
import Cookie from "cookie";
import Common from "common";

var PAYMENT = {
    settings: {
        login_state: Cookie.get('login_state'),
        paylistUrl: '/hichao/interface.php',
        is_payed: BASE.lang.getUrlParam('is_payed'),
        option_pay_list: BASE.lang.getUrlParam('option_pay_list'),
        order_type: BASE.lang.getUrlParam('order_type'),
        pay_order_amount: BASE.lang.getUrlParam('pay_order_amount'),
        pay_order_id: BASE.lang.getUrlParam('pay_order_id'),
        pay_order_sn: BASE.lang.getUrlParam('pay_order_sn'),
        localGoodData: BASE.lang.getUrlParam('good_data'),
        from: BASE.lang.getUrlParam('from'),
        open_id: Cookie.get('open_id'),
        token: Cookie.get('token') || '',
        app_uid: Cookie.get('app_uid') || '',
        track_items: window.localStorage.getItem("track_items"),
        par : {
            source_id: BASE.lang.getUrlParam('source_id') || '',
            main_image: BASE.lang.getUrlParam('main_image') || '',
            business_id: BASE.lang.getUrlParam('business_id') || '',
            tab_index : BASE.lang.getUrlParam('tab_index') || '',
            sort: BASE.lang.getUrlParam('sort') || ''
        }
    },
    init: function() {
        var self = this,
            par = self.settings.par,
            track_items = self.settings.track_items;
        BASE.lang.adapt();
        Common.init();
        self.getPaymentList();

        $('.return').on('tap',function(){
            window.location.href = '/app/templates/order.html?from='+self.settings.from+'&'+ $.param(par)+'&good_data=' + encodeURIComponent(self.settings.localGoodData);
        })


        //埋点
        var t = new Date(),
            ts = t.getFullYear()+'-'+t.getMonth()+1+'-'+t.getDate()+' '+t.getHours()+':'+t.getMinutes()+':'+t.getSeconds(),
            events = {
                "eventname": "order",
                "payload": JSON.parse(track_items),
                "ts": ts
            }
        Common.sendAnchor(events);
    },
    getPaymentList: function() {
        var self = this,
            data = '{"option_pay_list":"0"}',
            payListHtml = '',
            url = '/hichao/interface.php',
            base64_data = base64_encode.encoder(data),
            source = VER_CONFIG.source,
            version = VER_CONFIG.version,
            token = self.settings.token,
            app_uid = self.settings.app_uid,
            method = 'order.payment.list',
            key = VER_CONFIG.key;
        $.ajax({
            type: 'post',
            url: url,
            data: {
                source: source,
                version: version,
                method: method,
                token: token,
                app_uid: app_uid,
                data: base64_data,
                sign: md5(source + version + method + token + app_uid + base64_data + key)
            },
            dataType: 'json',
            success: function(result) {
                console.log(result)
                if (result.response.msg === "success") {
                    var payTypeList = result.response.data.payTypeList;
                    if (payTypeList.length > 0) {
                        for (var i = 0; i < payTypeList.length; i++) {
                            var id = payTypeList[i].id,
                                name = payTypeList[i].name,
                                img = payTypeList[i].image,
                                con = payTypeList[i].content,
                                weixin_pay_version;
                            if (id == 1) {
                                weixin_pay_version = 'V3';
                            } else {
                                weixin_pay_version = '';
                            }
                            payListHtml += '<dl class="method" data-pay-id="' + id + '" data-weixin_pay_version="' + weixin_pay_version + '" style="background:url(' + img + ');background-repeat:no-repeat;background-position:0.75rem;background-size:10%;">'
                            payListHtml += '<dt><p>' + name + '</p><p class="tips">' + con + '</p></dt>'
                            payListHtml += '<dd><img src="/app/images/icon_buy_chioce_ont@2x.png"></dd></dl>'
                        }
                        $('.pay-list').append(payListHtml);
                        $('.method').each(function() {
                            if ($(this).attr('data-pay-id') == '2') {
                                $(this).addClass('zhifubao')
                            } else {
                                $(this).addClass('weixin')
                            }
                        })

                        self.selectPayMethod();

                        var ua = navigator.userAgent.toLowerCase(),
                            payid,
                            weixin_pay_version;

                        if (ua.match(/MicroMessenger/i) == "micromessenger") {
                            //在微信浏览器中打开
                            //$('.zhifubao').addClass('hide');
                            // payid = '1';
                            // weixin_pay_version = 'V3'
                            
                            if(window.localStorage.getItem('overseas2') == '2'){
                                $('.weixin').addClass('hide');
                                $('.zhifubao').find('img').attr('src','/app/images/icon_buy_selected@2x.png');
                                payid = '2';//支付宝
                            }else{
                                $('.pay-list dl:first-child').css('borderBottom','1px solid #f1f1f1');
                            }
                        } else {
                            //在普通浏览器中打开
                            $('.weixin').addClass('hide');
                            $('.zhifubao').find('img').attr('src','/app/images/icon_buy_selected@2x.png');
                            payid = '2';
                        }
                        $('.next').on('tap', function() {

                            if($('.active').hasClass('weixin')){
                                payid = '1';
                                weixin_pay_version = 'V3';
                            }else{
                                payid = '2';
                            }

                            if(token){
                                self.toPay(payid, weixin_pay_version);
                            }else{
                                var good_data = 'is_payed='+self.settings.is_payed+'&option_pay_list='+self.settings.option_pay_list+'&order_type='+self.settings.order_type+'&pay_order_amount='+self.settings.pay_order_amount+'&pay_order_id='+self.settings.pay_order_id+'&pay_order_sn='+self.settings.pay_order_sn;
                                if(self.settings.login_state){
                                    Common.setDialog('请求过于频繁，请稍后再试');
                                    Cookie.remove('login_state');
                                }else{
                                    window.location.href = '/app/templates/login.html?from=payment_method&' + good_data;
                                }
                            }
                        });
                    }
                }
            }
        });
    },
    selectPayMethod: function(){
        $('.pay-list').on('tap','dl',function(){
            $(this).addClass('active')
                .find('img').attr('src','/app/images/icon_buy_selected@2x.png')
                .parents('dl').siblings().removeClass('active')
                .find('img').attr('src','/app/images/icon_buy_chioce_ont@2x.png');
        })
    },
    toPay: function(payid, weixin_pay_version) {
        var self = this,
            // product_id = BASE.lang.getUrlParam('productId'),
            pay_order_id = BASE.lang.getUrlParam('pay_order_id'),
            order_type = BASE.lang.getUrlParam('order_type'),
            from;
        if (payid === '2') {
            from = 'wap';
        } else {
            from = 'weixinh5';
        }
        var data = '{"pay_order_id":"' + pay_order_id + '","weixin_pay_version":"' + weixin_pay_version + '","order_type":"' + order_type + '","pay_id":"' + payid + '","from":"' + from + '","openid":"' + self.settings.open_id +'"}',
            url = '/hichao/interface.php',
            base64_data = base64_encode.encoder(data),
            source = VER_CONFIG.source,
            version = VER_CONFIG.version,
            token = self.settings.token,
            app_uid = self.settings.app_uid,
            method = 'order.payment',
            key = VER_CONFIG.key;
        window.console.log(data)
        $.ajax({
            type: 'post',
            url: url,
            data: {
                source: source,
                version: version,
                method: method,
                token: token,
                app_uid: app_uid,
                data: base64_data,
                sign: md5(source + version + method + token + app_uid + base64_data + key)
            },
            dataType: 'json',
            success: function(result) {
                console.log(result)
                if(result.response.msg != 'success'){
                    Common.setDialog(result.response.msg);
                }
                var data = result.response.data,
                    appId = data.appId,
                    nonceStr = data.nonceStr,
                    packagestr = 'prepay_id=' + data.prepay_id,
                    timestamp = data.timeStamp,
                    signType = data.signType,
                    paySign = data.paySign;
                
                if (data.info) {
                    window.location.href = data.info;
                } else {
                    if (data.error) {
                        // alert('网络不好，请再试一次');
                        Common.setDialog('网络不好，请再试一次')
                    } else {
                        WeixinJSBridge.invoke(
                            'getBrandWCPayRequest', {
                                "appId": appId,
                                "timeStamp": timestamp,
                                "nonceStr": nonceStr,
                                "package": packagestr,
                                "signType": signType,
                                "paySign": paySign
                            },
                            function(res) {
                                if (res.err_msg == "get_brand_wcpay_request:ok") {
                                    window.location.href = '/app/templates/pay_result.html?type=success';
                                }
                            }
                        );
                    }
                }
            }
        });
    }
}
PAYMENT.init();