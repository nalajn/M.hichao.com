import 'zepto';
import BASE from 'h5_base';
import base64_encode from 'base64';
import md5 from 'md5';
import VER_CONFIG from 'version';
import Cookie from "cookie";
import Common from "common";

var ORDER = {
    settings: {
        host_name: "http://v1.m.hichao.com/app/templates/",
        h5_guid: Cookie.get('h5_guid'),
        login_state: Cookie.get('login_state'),
        token: Cookie.get('token'),
        app_uid: Cookie.get('app_uid'),
        source: VER_CONFIG.source,
        version: VER_CONFIG.version,
        key: VER_CONFIG.key,
        interfaceUrl: '/hichao/interface.php',
        localGoodData: BASE.lang.getUrlParam('good_data') || window.localStorage.getItem("good_data"),
        is_overseas_order: window.localStorage.getItem("overseas"),
        from: BASE.lang.getUrlParam('from'),
        getDataMethod: 'order.confirm',
        createOrderMethod: 'order.create',
        source_id: BASE.lang.getUrlParam('source_id') || window.localStorage.getItem("source_id"),
        main_image: BASE.lang.getUrlParam('main_image') || window.localStorage.getItem("main_image"),
        business_id: BASE.lang.getUrlParam('business_id') || window.localStorage.getItem("business_id"),
        tab_index: BASE.lang.getUrlParam('tab_index'),
        sort: BASE.lang.getUrlParam('sort') || '',
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
            tab_index = self.settings.tab_index,
            par = self.settings.par;
            
        if(window.location.host == "v1.m.hichao.com"){
            self.settings.host_name = "http://v1.m.hichao.com/app/templates/";
        }else{
            self.settings.host_name = "http://m.hichao.com/app/templates/";
        }

        BASE.lang.adapt();
        Common.init();

        $('.return').on('tap',function(){
            if(self.settings.from){
                window.location.href = '/app/templates/'+self.settings.from+'.html?' + $.param(par);
            }
        })

        if (self.settings.token) {
            self.getData();
        } else {
            window.location.href = '/app/templates/login.html?from=order&last='+self.settings.from+'&'+$.param(par)+'&good_data=' + encodeURIComponent(self.settings.localGoodData);
        }
    },
    getData: function() {
        var self = this,
            url = self.settings.interfaceUrl,
            good_data = decodeURIComponent(self.settings.localGoodData),
            base64_data = base64_encode.encoder(good_data),
            source = self.settings.source,
            version = self.settings.version,
            key = self.settings.key,
            method = self.settings.getDataMethod,
            token = self.settings.token,
            app_uid = self.settings.app_uid;
        //var par = {}payment_method
        window.console.log('{"items":"' + good_data + '"}');

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
                window.console.log(result);
                if (result.response.msg === "success") {
                    var data = result.response.data;
                    self.doHtml(data);
                    self.doPayment();
                } else {
                    alert("接口错误");
                }
            },
            error: function() {
                console.log("请求失败");
            }
        })
    },
    doHtml: function(data) {
        var self = this,
            tab_index = self.settings.tab_index,
            source_id = self.settings.source_id,
            main_image = self.settings.main_image,
            business_id = self.settings.business_id,
            address_obj = data.address,
            address_id = address_obj ? address_obj.address_id : '',
            address = address_obj ? address_obj.address : '',
            addressdetail = address_obj ? address_obj.addressdetail : '',
            consignee = address_obj ? address_obj.consignee : '',
            mobile = address_obj ? address_obj.mobile : '',
            id_number = address_obj ? address_obj.id_number : '',
            zipcode = address_obj ? address_obj.zipcode : '',
            province = address_obj ? address_obj.province : '',
            city = address_obj ? address_obj.city : '',
            district = address_obj ? address_obj.district : '',

            items = data.items,

            bonuslist = data.bonuslist ? data.bonuslist : '', //红包列表

            overseas_txt = data.overseas_txt,
            // order_amount = data.order_amount,
            order_amount = 0, //总价

            token = self.settings.token || '',
            app_uid = self.settings.app_uid || '',
            addressHtml = '',
            bonusHtml = '',
            shopHtml = '';

        if (overseas_txt) {
            $('.tips').removeClass('hide').text(overseas_txt);
        }

        //地址
        if (address_obj) {
            addressHtml += '<p class="name"><span class="tit">' + consignee + '</span><span class="id"> ' + id_number + '</span></p>'
            addressHtml += '<p class="phone">' + mobile + '</p>'
            addressHtml += '<p class="addr" data-address_id="' + address_id + '" data-zipcode="' + zipcode + '" data-province="' + province + '" data-city="' + city + '" data-district="' + district + '" data-address="' + address + '">' + address + '</p>'
            addressHtml += '<p class="edit_address"><a href="/app/templates/my_address.html?from='+self.settings.from+'&tab_index='+tab_index+'&source_id='+source_id+'&business_id='+business_id+'&main_image='+main_image+'&good_data=' + encodeURIComponent(self.settings.localGoodData) + '">编辑收货地址</a></p>'
        } else {
            addressHtml += "<a class='no-address' href='/app/templates/receive_msg.html?type=new&from="+self.settings.from+"&tab_index="+tab_index+"&source_id="+source_id+"&business_id="+business_id+"&main_image="+main_image+"&good_data="+encodeURIComponent(self.settings.localGoodData)+"'>填写收货地址</a>"
        }
        $('.address').append(addressHtml);

        //shops
        if (items.length > 0) {
            var item_amount = items[0].item_amount,
                shop_list = items[0].lists,
                item_promote = items[0].item_promote || '',
                itemPromoteHtml = '';
            for (var i = 0; i < shop_list.length; i++) {
                var businessId = shop_list[i].businessId,
                    businessName = shop_list[i].businessName,
                    country_img = shop_list[i].country.country_img,
                    country_title = shop_list[i].country.country_title,
                    is_overseas_order = shop_list[i].is_overseas_order,
                    totalFare = shop_list[i].totalFare,
                    totalPrice = shop_list[i].totalPrice,
                    totalTariff = shop_list[i].totalTariff,
                    promote = shop_list[i].promote ? shop_list[i].promote : '',
                    totalTariff_Tip = shop_list[i].totalTariff_Tip,
                    goods_list = shop_list[i].goods,
                    overseasClass = '',
                    totalFare_num,
                    promoteHtml = '',
                    goodHtml = '';
                //商品
                for (var j = 0; j < goods_list.length; j++) {
                    var cart_id = goods_list[j].cart_id,
                        from = JSON.stringify(goods_list[j].from),
                        goods_id = goods_list[j].goods_id,
                        goodsAttr = goods_list[j].goodsAttr,
                        goodsImage = goods_list[j].goodsImage,
                        goodsName = goods_list[j].goodsName,
                        goodsShopPrice = goods_list[j].goodsShopPrice,
                        goods_sn = goods_list[j].goods_sn,
                        goodsSoureId = goods_list[j].goodsSoureId,
                        goods_attr_id = goods_list[j].goods_attr_id,
                        goods_status = goods_list[j].goods_status,
                        productId = goods_list[j].productId,
                        goodsNumber = goods_list[j].goodsNumber,
                        subsidies = goods_list[j].subsidies,
                        subsidiesPrice = goods_list[j].subsidiesPrice;

                    goodHtml += '<div class="con info"><dl data-from="' + from + '" data-cart_id="' + cart_id + '" data-goods_id="' + goods_id + '" data-goods_sn="' + goods_sn + '" data-goods_status="' + goods_status + '" data-goodsSoureId="' + goodsSoureId + '" data-productId="' + productId + '" data-goodsNumber="' + goodsNumber + '">';
                    goodHtml += '<dt><img src="' + goodsImage + '"/></dt>';
                    goodHtml += '<dd><a class="goodsname" href="/app/templates/good_detail.html?source_id='+goodsSoureId+'&tab_index='+tab_index+'&main_image=1&business_id='+businessId+'">' + goodsName + '</a><span class="price">￥' + goodsShopPrice + '</span></dd>';
                    goodHtml += '<dd><span class="attr" data-goods_attr_id="' + goods_attr_id + '">' + goodsAttr + '</span><span class="number">x<span class="goodsNumber">' + goodsNumber + '</span></span></dd></dl></div>';
                    if(subsidiesPrice){     
                        goodHtml += '<p class="con"><span class="tit">'+subsidies+'</span><span class="num">-￥'+subsidiesPrice+'</span></p>'
                    }
                }
                
                //优惠券
                if (promote.length > 0) {
                    for (var w = 0; w < promote.length; w++) {
                        var promote_id = promote[w].promote_id,
                            promote_minus_price = promote[w].promote_minus_price,
                            promote_name = promote[w].promote_name,
                            promote_reach_price = promote[w].promote_reach_price,
                            promote_title = promote[w].promote_title,
                            promote_type = promote[w].promote_type,
                            promote_value = promote[w].promote_value;
                        
                        promoteHtml += '<p class="con" data-id="'+promote_id+'" data-promote_minus_price="'+promote_minus_price+'" data-promote_reach_price="'+promote_reach_price+'">'
                        if(promote_type == "promote_reach"){
                            promoteHtml += '<span class="tit" data-promote_type="'+promote_type+'">店铺满减</span>'
                        }else if(promote_type == "promote_coupon"){
                            promoteHtml += '<span class="tit" data-promote_type="'+promote_type+'">店铺优惠券</span>'
                        }
                        promoteHtml += '<span class="num">-￥<span class="val">' + promote_value + '</span>(<span class="tip">' + promote_name + '</span>)</span></p>'
                    }
                }

                //运费
                if (totalFare == '0') {
                    totalFare_num = '免运费';
                } else {
                    totalFare_num = '￥' + totalFare;
                }

                //海外店铺添加class标识
                if (is_overseas_order == 1) {
                    overseasClass = 'is_overseas';
                }
                
                if(self.settings.is_overseas_order == 0){
                    $('.address .id').addClass('hide');
                }

                shopHtml += '<li class="' + overseasClass + '" data-item_amount="'+totalPrice+'" data-businessId="' + businessId + '"><p class="name"><a href="/app/templates/brand_detail.html?id='+businessId+'&tab_index='+tab_index+'">' + businessName + '</a>'
                if(country_img && country_title){
                    shopHtml += '<img src="'+country_img+'" alt="" /><span class="country_title">'+country_title+'</span>'
                }
                shopHtml += '</p><div class="goods-list">' + goodHtml + '</div>'
                shopHtml += '<div class="promotes">' + promoteHtml + '</div>'
                shopHtml += '<p class="con"><span class="tit">运费合计</span>'

                if(totalFare != 0){
                    shopHtml += '<span class="num forbid-cut">' + totalFare_num + '</span></p>'
                }else{
                    shopHtml += '<span class="num">' + totalFare_num + '</span></p>'
                }

                if (totalTariff) {
                    shopHtml += '<p class="con"><span class="tit">关税合计</span>'
                    shopHtml += '<span class="num forbid-cut">￥' + totalTariff + '</span></p>'
                }else if(totalTariff_Tip){
                    shopHtml += '<p class="con"><span class="tit">关税合计</span>'
                    shopHtml += '<span class="num">' + totalTariff_Tip + '</span></p>'
                }
                shopHtml += '<p class="num">本店合计：￥<span class="total">' + totalPrice + '</span></p>'
                shopHtml += '<div class="msg-num"><input class="msg" type="text" maxlength="30" placeholder="给卖家留言">'
                shopHtml += '<div class="msg-con"><span class="num">30</span>/30</div></div>'
                shopHtml += '<div class="spe"></div></li>'
            }

            $('.shop').append(shopHtml);
            self.setMsgNum();

            

            //专场优惠券
            if(item_promote.length > 0){
                for(var i=0;i<item_promote.length;i++){
                    var promote_id = item_promote[i].promote_id,
                        promote_minus_price = item_promote[i].promote_minus_price,
                        promote_name = item_promote[i].promote_name,
                        promote_reach_price = item_promote[i].promote_reach_price,
                        promote_title = item_promote[i].promote_title,
                        promote_type = item_promote[i].promote_type,
                        promote_value = item_promote[i].promote_value;
                    itemPromoteHtml += '<p class="con" data-id="'+promote_id+'" data-promote_minus_price="'+promote_minus_price+'" data-promote_reach_price="'+promote_reach_price+'">'
                    itemPromoteHtml += '<span class="tit" data-promote_type="'+promote_type+'">'+promote_title+'</span><span class="num">-￥<span class="val">'+promote_value+'</span>(<span class="tip">'+promote_name+'</span>)</span></p>'
                }
                $('.item_promote').append(itemPromoteHtml);
            }

            //合计
            var shop_price;
            $('.shop li').each(function(){
                shop_price = parseFloat($(this).attr('data-item_amount'));
                if($(this).parent('.shop').next('.item_promote').find('.con').length > 0){
                    shop_price -= parseFloat($(this).parent('.shop').next('.item_promote').find('.val').text());
                }
                order_amount += shop_price;
            })
            order_amount = Math.round(order_amount*100)/100;

            console.log(order_amount)
        }


        //红包
        if (bonuslist && bonuslist.length > 0) {
            $('.choice').append('<div class="packet"><span class="tit">选择红包</span><span class="select">不使用红包</span><ul class="bonus-list hide"><li class="active">不使用红包</li></ul></div>');
            for (var y = 0; y < bonuslist.length; y++) {
                var bonus_id = bonuslist[y].bonus_id,
                    bonus_money = bonuslist[y].bonus_money,
                    bonus_name = bonuslist[y].bonus_name,
                    start_time = bonuslist[y].start_time,
                    end_time = bonuslist[y].end_time,
                    promote_is_expired = bonuslist[y].promote_is_expired,
                    status = bonuslist[y].status;
                bonusHtml += '<li><span class="num"> -￥<span class="price">' + bonus_money + '</span></span>'
                bonusHtml += '(<span class="tit" data-bonus_id="' + bonus_id + '" data-start_time="' + start_time + '" data-end_time="' + end_time + '" data-promote_is_expired="' + promote_is_expired + '" data-status="' + status + '">' + bonus_name + '</span>)</li>'
            }
        }
        $('.bonus-list').append(bonusHtml);

        //展示红包列表
        $('.select').on('tap',function(){
            if($(this).hasClass('actived')){
                $(this).removeClass('actived');
                $('.bonus-list').addClass('hide');
            }else{
                $(this).addClass('actived');
                $('.bonus-list').removeClass('hide');
                $('body').scrollTop($('body').height())
            }
        })

        // //无红包时隐藏红包栏
        // if(bonuslist.length == 0){
        //     $('.choice').addClass('hide');
        // }

        //选择红包
        $('.bonus-list').on('tap', 'li', function() {
            $('.bonus-list li').removeClass('active');
            $(this).addClass('active').parent('.bonus-list').addClass('hide');
            $('.select').html($(this).html()).removeClass('actived');
            self.resultPrice(order_amount);
        })

        //总价
        self.resultPrice(order_amount);
    },
    //给卖家留言
    setMsgNum: function(){
        $('.msg-num').on('keyup',function(){
            $('.msg-num input').on('input', function() {
                $(this).parent('.msg-num').find('.num').text(30-$(this).val().length);
                // if($(this).val().length >= 30 ){
                //     $('.msg-num .num').text('0');
                //     $(this).val($(this).val().slice(0,30));
                // }
            });
        })
    },
    resultPrice: function(order_amount){
        var new_price,
            result_price,
            num,
            forbid_cut_price = 0; //关税运费不能用红包抵
        if($('.forbid-cut').length > 0){
            $('.forbid-cut').each(function(){
                forbid_cut_price += parseFloat($(this).text().slice(1));
            })
        }

        if($('.choice .select .price').text()){
            
            new_price = parseFloat(order_amount)-parseFloat(forbid_cut_price)-parseFloat($('.choice .select .price').text());
            if(new_price < 0){
                new_price = 0;
            }
            result_price = Math.round((parseFloat(new_price)+parseFloat(forbid_cut_price))*100)/100;
            console.log('order_amount='+order_amount,'forbid_cut_price='+forbid_cut_price,'bonus_price='+$('.choice .select .price').text())
        }else{
            result_price = order_amount;
        }
        // if(result_price == 0){
        //     Common.setDialog('支付金额不能小于等于零');
        //     $('.payment').addClass('gray');
        // }else{
        //     $('.payment').removeClass('gray');
        // }
        if(result_price.toString().indexOf('.') > 0){
            num = result_price.toString().substr(0,result_price.toString().indexOf('.'))+result_price.toString().substr(result_price.toString().indexOf('.'),3);
        }else{
            num = result_price;
        }
        $('.result .num').text('￥' + num);
    },
    //去付款
    doPayment: function() {
        var self = this;
        $('.payment').on('tap', function() {
            if(!$(this).hasClass('gray')){
                if ($('.address').children('a').hasClass('no-address')) {
                    $('.tips').removeClass('hide').text('请填写收货地址');

                } else {
                    var address_id = $('.address .addr').attr('data-address_id'),
                        consignee = $('.address .tit').text(),
                        zipcode = $('.address .addr').attr('data-zipcode'),
                        mobile = $('.address .phone').text(),
                        id_number = $('.address .id').text(),
                        province = $('.address .addr').attr('data-province'),
                        city = $('.address .addr').attr('data-city'),
                        district = $('.address .addr').attr('data-district'),
                        address = $('.address .addr').attr('.data-address'),
                        addressdetail = $('.address .addr').text(),
                        order_amount = $('.result .num').text().slice(1),
                        order_type = window.localStorage.getItem("overseas"),
                        user_bouns_id = $('.choice .select .tit').attr('data-bonus_id') || '',
                        bouns_name = $('.choice .select .tit').text() || '',
                        bouns_price = $('.choice .select .price').text() || '',
                        item_amount = $('.shop li').attr('data-item_amount'),
                        goods = '',
                        promote_item = '',
                        promote = '',
                        list = '',
                        lists = '',
                        item_promote_li = '',
                        item_promote = '',
                        items,
                        pay_data,
                        data,
                        t = new Date(),
                        ts = t.getFullYear()+'-'+t.getMonth()+1+'-'+t.getDate()+' '+t.getHours()+':'+t.getMinutes()+':'+t.getSeconds();
            
                    if (order_type == '1' && !id_number) {
                        Common.setDialog('请填写身份证号码');
                    }

                    for (var j = 0; j < $('.shop li').length; j++) {
                        var li = $('.shop li'),
                            businessId = li.eq(j).attr('data-businessId'),
                            businessName = li.eq(j).find('.name').text(),
                            totalPrice = li.eq(j).find('.total').text(),
                            orderRemark = li.eq(j).find('.msg').val(),
                            goods_list = li.eq(j).find('.goods-list'),
                            promotes = li.eq(j).find('.promotes'),
                            isPurchase = '0',
                            good = '';

                        //goods
                        for (var i = 0; i < goods_list.find('.con.info').length; i++) {
                            var dl = goods_list.find('.con.info').eq(i).find('dl'),
                                cart_id = dl.attr('data-cart_id'),
                                from = dl.attr('data-from'),
                                goodsSoureId = dl.attr('data-goodsSoureId'),
                                goods_id = dl.attr('data-goods_id'),
                                goodsName = dl.find('.goodsname').text(),
                                goodsImage = dl.find('img').attr('src'),
                                goods_sn = dl.attr('data-goods_sn'),
                                goods_status = dl.attr('data-goods_status'),
                                productId = dl.attr('data-productId'),
                                goodsNumber = dl.find('.goodsNumber').text(),
                                goodsShopPrice = dl.find('.price').text(),
                                goodsAttr = dl.find('.attr').text(),
                                //from = '{\"gf\":\"H5\",\"gi\":\"'+self.settings.h5_guid+'\",\"tab_2\":\"new_arrival\",\"ts\":\"'+ts+'\",\"sku_id\":\"'+goodsSoureId+'\",\"source_id\":\"'+goodsSoureId+'\",\"tab_1\":\"hot\",\"source\":\"source\",\"business_id\":\"'+businessId+'\",\"price\":\"'+goodsShopPrice+'\"}',
                                goods_attr_id = dl.find('.attr').attr('data-goods_attr_id');
                            good += '{"cart_id": "' + cart_id + '","from":"' + from + '","goodsSoureId": "' + goodsSoureId + '","goods_id": "' + goods_id + '","goodsName": "' + goodsName + '","goodsImage": "' + goodsImage + '","goods_sn": "' + goods_sn + '","goods_status": "' + goods_status + '","productId": "' + productId + '","goodsNumber": "' + goodsNumber + '","goodsShopPrice": "' + goodsShopPrice + '","goodsAttr": "' + goodsAttr + '","goods_attr_id": "' + goods_attr_id + '"}';
                            if (i != goods_list.find('.con.info').length - 1) {
                                good += ',';
                            }
                        }
                        goods = '[' + good + ']';


                        //promotes
                        for (var i = 0; i < promotes.find('.con').length; i++) {
                            var con = promotes.find('.con'),
                                promote_id = con.eq(i).attr('data-id'),
                                promote_name = con.eq(i).find('.tip').text(),
                                promote_type = con.eq(i).find('.tit').attr('data-promote_type'),
                                promote_value = con.eq(i).find('.num .val').text(),
                                promote_reach_price = con.eq(i).attr('data-promote_reach_price'),
                                promote_minus_price = con.eq(i).attr('data-promote_minus_price');
                            promote_item += '{"promote_id":"'+promote_id+'","promote_name":"'+promote_name+'","promote_type":"'+promote_type+'","promote_value":"'+promote_value+'","promote_reach_price":"'+promote_reach_price+'","promote_minus_price":"'+promote_minus_price+'"}';
                            if(i != con.length-1){
                                promote_item += ',';
                            }
                        }
                        promote = '['+promote_item+']';


                        list += '{"businessId": "' + businessId + '","businessName": "' + businessName + '","totalPrice": "' + totalPrice + '","orderRemark":"' + orderRemark + '","isPurchase":"' + isPurchase + '","promote": ' + promote + ',"goods": ' + goods + '}';
                        if (j != $('.shop li').length - 1) {
                            list += ',';
                        }
                    }
                    lists = '[' + list + ']';

                    //专场优惠券 item_promote
                    for (var i = 0; i < $('.item_promote .con').length; i++) {
                        var con = $('.item_promote .con'),
                            promote_id = con.eq(i).attr('data-id'),
                            promote_name = con.eq(i).find('.tip').text(),
                            promote_type = con.eq(i).find('.tit').attr('data-promote_type'),
                            promote_value = con.eq(i).find('.num .val').text(),
                            promote_reach_price = con.eq(i).attr('data-promote_reach_price'),
                            promote_minus_price = con.eq(i).attr('data-promote_minus_price');
                        item_promote_li += '{"promote_id":"'+promote_id+'","promote_name":"'+promote_name+'","promote_type":"'+promote_type+'","promote_value":"'+promote_value+'","promote_reach_price":"'+promote_reach_price+'","promote_minus_price":"'+promote_minus_price+'"}';
                        if(i != con.length-1){
                            item_promote_li += ',';
                        }
                    }
                    item_promote = '['+item_promote_li+']';
                    console.log(item_promote)
                    
                    items = '[{"item_amount": "' + item_amount + '","item_type": "special","item_promote": ' + item_promote + ',"lists": ' + lists + '}]'

                    pay_data = '"order_amount": "' + order_amount + '","order_type": "' + order_type + '","bonusId":"' + user_bouns_id + '","order_bouns": [{"user_bouns_id": "' + user_bouns_id + '","bouns_name": "' + bouns_name + '","bouns_price": "' + bouns_price + '"}],"province":"' + province + '","city":"' + city + '","district":"' + district + '","address": {"address_id": "' + address_id + '","consignee": "' + consignee + '","zipcode": "' + zipcode + '","mobile": "' + mobile + '","address": "' + address + '","addressdetail":"' + addressdetail + '","province":"' + province + '","city":"' + city + '","district":"' + district + '","id_number":"' + id_number + '"},"items": ' + items

                    data = '{"step":"1","pay_id":"0","weixin_pay_version":"V3",' + pay_data + '}'
                    var is_overseas_goods_num = 0,
                        is_overseas_price = 0;
                    if ($('.is_overseas').length > 0) {
                        $('.is_overseas').each(function(){
                            is_overseas_price += parseFloat($(this).find('.total').text());
                        })
                        $('.goodsNumber').each(function() {
                            is_overseas_goods_num += parseInt($(this).text());
                        })
                        console.log(is_overseas_goods_num,is_overseas_price)
                        if (is_overseas_goods_num > 1 && is_overseas_price > 1000) {
                            Common.setDialog('啊哦~ 根据海关规定，购买多件商品的总价不能超过￥1000，请分多次购买');
                        } else {
                            self.createOrder(data);
                        }
                    } else {
                        self.createOrder(data);
                    }
                }
            }else{
                Common.setDialog('支付金额不能小于等于零');
            }
        })
    },
    createOrder: function(data) {
        var self = this,
            url = self.settings.interfaceUrl,
            base64_data = base64_encode.encoder(data),
            source = self.settings.source,
            version = self.settings.version,
            key = self.settings.key,
            token = self.settings.token,
            app_uid = self.settings.app_uid,
            method = self.settings.createOrderMethod,
            par = self.settings.par;

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
                window.console.log(result);
                if (result.response.msg === "success") {
                    var rs_data = result.response.data,
                        is_payed = rs_data.is_payed,
                        option_pay_list = rs_data.option_pay_list,
                        order_type = rs_data.order_type,
                        pay_order_amount = rs_data.pay_order_amount,
                        pay_order_id = rs_data.pay_order_id,
                        pay_order_sn = rs_data.pay_order_sn,
                        track_items = rs_data.track_items,
                        tab_index = self.settings.tab_index;

                    window.localStorage.setItem("track_items",track_items);

                    var paymentUrl = self.settings.host_name+'payment_method.html?from='+self.settings.from+'&tab_index='+tab_index+'&is_payed=' + is_payed + '&option_pay_list=' + option_pay_list + '&order_type=' + order_type + '&pay_order_amount=' + pay_order_amount + '&pay_order_id=' + pay_order_id + '&pay_order_sn=' + pay_order_sn +'&good_data=' + encodeURIComponent(self.settings.localGoodData)+'&'+$.param(par);
                    var ua = navigator.userAgent.toLowerCase();
                    
                    if(pay_order_amount == 0){
                        window.location.href = '/app/templates/pay_result.html?type=success';
                    }else{
                        if (ua.match(/MicroMessenger/i) == "micromessenger") {
                            if (Cookie.get('openid')) {
                                window.location.href = paymentUrl;
                            } else {
                                var redirectUrl = paymentUrl;
                                // encodeURIComponent(rdUrl);
                                Cookie.set('w_rd', redirectUrl, {
                                    path: '/',
                                    domain: '.hichao.com'
                                });
                                var tz_href = 'http://www.hichao.com/beta/connect/h5/openid';
                                var weiRd = paymentUrl;
                                //在微信浏览器中打开
                                var weixinURl = encodeURIComponent(tz_href + "?code_type=wechat_code");
                                var loadUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9b07830d3c51f961&redirect_uri=' + weixinURl + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect';
                                window.location.href = loadUrl;
                            }

                        } else {
                            window.location.href = paymentUrl;
                        }
                    }
                } else {
                    if (result.response.code === '1') {
                        Common.setDialog(result.response.msg);
                    }
                }
            },
            error: function() {
                console.log("请求失败");
            }
        });
    }
}
ORDER.init();