import 'zepto';
import BASE from 'h5_base';
import base64_encode from 'base64';
import md5 from 'md5';
import VER_CONFIG from 'version';
import Cookie from "cookie";
import Common from "common";

var GOODDETAIL = {
    settings: {
        h5_guid: Cookie.get('h5_guid') || '',
        login_state: Cookie.get('login_state'),
        token: Cookie.get('token') || '',
        app_uid: Cookie.get('app_uid') || '',
        app_name: decodeURIComponent(Cookie.get('app_name'))||'',
        source_id: BASE.lang.getUrlParam('source_id') || '',
        main_image: BASE.lang.getUrlParam('main_image') || '',
        business_id: BASE.lang.getUrlParam('business_id') || '',
        tab_index: BASE.lang.getUrlParam('tab_index') || '',
        sort: BASE.lang.getUrlParam('sort') || '',
        source: VER_CONFIG.source,
        version: VER_CONFIG.version,
        key: VER_CONFIG.key,
        getDataUrl: '/hichao/interface.php',
        getCouponUrl: 'http://v1.api.mall.hichao.com/hichao/promote/getpromote.php',
        getCartMethod: 'goods.cart.get',
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
            token = self.settings.token,
            app_name = self.settings.app_name,
            par = self.settings.par;
        
        if(window.location.host == "v1.m.hichao.com"){
            self.settings.getCouponUrl = 'http://v1.api.mall.hichao.com/hichao/promote/getpromote.php';
        }else{
            self.settings.getCouponUrl = 'http://api.mall.hichao.com/hichao/promote/getpromote.php';
        }
        BASE.lang.adapt();
        Common.init();
        self.getData();
        window.localStorage.removeItem("overseas2");

        
        if (token) {
            self.getCartNum();
            //登录
            $('.login').text(app_name);
            $('.register').addClass('logout').removeClass('register').text('退出');
            
            $('.logout').on('tap', function() {
                if(confirm('确定退出登录吗？')){
                    Cookie.remove('token',{path:'/',domain:'.hichao.com'});
                    Cookie.remove('app_uid',{path:'/',domain:'.hichao.com'});
                    Cookie.remove('app_name',{path:'/',domain:'.hichao.com'});
                    window.location.reload();
                }
            });
        } else {
            $('.car .num').text('0');
            //未登录跳到登录页面
            // $('.login').on('tap', function() {
            //     window.location.href = '/app/templates/login.html?from=good_detail&' + $.param(par);
            // })
            $('.login').attr('href','/app/templates/login.html?from=good_detail&' + $.param(par))
                
            
        }

        //下载app
        $('.download').on('click',function(){
            if(confirm('是否去下载APP')){
                window.location.href = 'http://a.myapp.com/o/simple.jsp?pkgname=com.haobao.wardrobe&g_f=991653';
            }
        })

        //注册
        // $('.register').on('tap', function() {
        //     window.location.href = '/app/templates/register.html?from=good_detail&' + $.param(par);
        // })
        $('.register').attr('href','/app/templates/register.html?from=good_detail&' + $.param(par));
        
        
        //返回顶部
        $('.to-top').on('click', function() {
            $('body').scrollTop(0);
        });

            //购物车
        $('.bottom .car').on('tap', function() {
            var token = Cookie.get('token') || '',
                app_uid = Cookie.get('app_uid') || '';
            if (token) {
                window.location.href = '/app/templates/cart.html?from=good_detail&' + $.param(par);
            } else {
                window.location.href = '/app/templates/login.html?from=cart&last=good_detail'+'&'+ $.param(par);
            }


            //埋点
            var t = new Date(),
                ts = t.getFullYear()+'-'+t.getMonth()+1+'-'+t.getDate()+' '+t.getHours()+':'+t.getMinutes()+':'+t.getSeconds(),
                events = {
                    "eventname": "cart_c",
                    "ts": ts
                }
            Common.sendAnchor(events);

        })

        //加入购物车
        $('.bottom .add').on('tap', function() {
            if (token) {
                // if ($('.choiced .size').text() == '颜色尺码分类') {
                    self.showChoiceColorSize('add');
                // } else {
                //     self.cartAdd(); //加入购物车
                // }
            } else {
                window.location.href = '/app/templates/login.html?from=good_detail&' + $.param(par);
            }
        })
    },
    fScrollFix: function(e){
        e.preventDefault();
　　     e.stopPropagation();
    },
    getData: function() {
        var self = this,
            url = self.settings.getDataUrl,
            source_id = self.settings.source_id,
            main_image = self.settings.main_image,
            business_id = self.settings.business_id,
            base64_data = base64_encode.encoder('{"main_image":"' + main_image + '","source_id":"' + source_id + '"}') || '',
            source = VER_CONFIG.source,
            version = VER_CONFIG.version,
            key = VER_CONFIG.key,
            method = 'goods.sell',
            token = self.settings.token,
            app_uid = self.settings.app_uid;
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
                    
                    $('.buy').on('tap', function() {
                        self.toBuy();
                    })
                } else {
                    Common.setDialog(result.response.msg);
                }
            },
            error: function() {
                console.log("请求失败");
            }
        });
    },
    getDetail: function() {
        var self = this,
            url,
            source_id = self.settings.source_id,
            business_id = self.settings.business_id;
        if(window.location.host == "v1.m.hichao.com"){
            url = 'http://v1.m.hichao.com/lib/interface.php';
        }else{
            url = 'http://m.hichao.com/lib/interface.php';
        }

        $.ajax({
            type: 'post',
            url: url,
            data: {
                bid: business_id,
                sid: source_id,
                m: 'goodsdetail.senddata'
            },
            dataType: 'json',
            success: function(result) {
                window.console.log(result);
                if (result.response.msg === "success") {
                    var data = result.response.data;
                    self.doDetailHtml(data);
                } else {
                    // alert(result.response.msg);
                    Common.setDialog(result.response.msg);
                }
            },
            error: function() {
                console.log("请求失败");
            }
        });
    },
    doHtml: function(data) {
        var self = this,
            main_image = self.settings.main_image,
            source_id = self.settings.source_id,
            business_brief = data.business_brief,
            goods_name = data.goods_name, //标题
            // goods_img = data.goods_img,  //商品主图
            source = data.source, 
            shop_price = data.shop_price, //售价
            foreign_shop_price = data.foreign_shop_price, //国外商店价
            market_price = data.market_price, //原价
            domestic_reference_price = data.domestic_reference_price, //当地零售价
            sales_quantity = data.sales_quantity, //销量
            faretxt = data.faretxt ? data.faretxt : 0, //运费
            tarifftxt = data.tarifftxt ? data.tarifftxt : 0, //关税
            pictures = data.sideslipimages, //图片集
            eventIcon = data.eventIcon,  //优惠补贴
             // discount = data.discount,
            min_purchase_num = data.min_purchase_num || '',
            purchase_num = data.purchase_num || '',  //限购
            activityInfo = data.activityInfo,
            activity_flag = activityInfo.activity_flag,
            activity_price = activityInfo.activity_price,
            activity_time = activityInfo.activity_time,
            taglist = data.taglist,
            spe = data.spe, //商品尺码颜色集合
            promote = data.promote, //优惠券 满减
            warehouse = data.warehouse,
            products = data.products,
            business_id = data.business_id,
            business_image = data.business_image,
            business_name = data.business_name,
            explainInfo_items = explainInfo_items ? data.explainInfo.items : '',
            tabInfo = data.tabInfo,
            overseas = data.is_overseas_order,
            is_saleout = data.is_saleout,
            is_return_product = data.is_return_product ? data.is_return_product : 0,
            img_url,
            img_height = [],
            imagesHtml = '',
            interHtml = '',
            processHtml = '',
            brandInfoHtml = '',
            brandHtml = '',
            promoteHtml = '',
            tagHtml = '',
            productsHtml = '';

        console.log(data.is_overseas_order, sales_quantity, market_price)

        //APP下载
        $('.title').on('tap', '.close', function() {
            $(this).parent('.title').remove();
            $('.roll-imgs').css('margin','0');
        });

        //slider
        for (var i = 0; i < pictures.length; i++) {
            img_url = pictures[i].img_url;
            img_height[i] = pictures[i].img_height / pictures[i].img_width * $(window).width();
            imagesHtml += '<p style="float:left;width:'+$(window).width()+'px;max-width:750px;height:100%;background:url('+img_url+') no-repeat;background-size:100%;background-position:center;"></p>';
        }
        $('.roll-imgs .images').height($('body').width()).append(imagesHtml);
        if(eventIcon){
            $('.roll-imgs .pic').append('<img class="eventIcon" src="'+eventIcon+'">');
        }
        $('.roll-imgs .saleout').height($('body').width());
        self.setSlider();

        //基本信息
        brandInfoHtml += '<p class="goods_source"></p><h3 class="brand_tit"><span class="min_limit_num"></span><span class="max_limit_num"></span>' + goods_name + '</h3>';
        brandInfoHtml += '<p class="price"><span class="tit">售价</span><span class="now_price">￥' + shop_price + '</span><span class="foreign_price"></span>';
        brandInfoHtml += '<span class="origin_price"></span><span class="sales_quantity"></span></p>';
        brandInfoHtml += '<p class="tags"></p>';

        $('.brand_info').attr('data-source-id', source_id).append(brandInfoHtml);

        //活动信息
        if (activity_price) {
            var time_tit; 
            $('.roll-imgs .mark').removeClass('hide');
            $('.roll-imgs .tag').css({
                'bottom': '1.6rem'
            });
            if (activity_flag == 1) {
                $('.mark .time_tit').text('距结束').parent('.time').css('left','33%');
                $('.mark .price').addClass('hide');
                $('.price .tit').text('活动价');
            } else {
                $('.mark .time_tit').text('距开始');
            }
            // $('.mark .time_num').text(activity_time);
            self.timedCount(activity_time);
            $('.mark .price_num').text('￥'+activity_price);
        }

        //价格
        if (overseas == 1) { //海外
            if(domestic_reference_price){
                $('.origin_price').text('当地零售价:￥' + domestic_reference_price);
            }else{
                $('.origin_price').addClass('hide');
            }
            if (foreign_shop_price) {
                $('.foreign_price').text(foreign_shop_price);
            }
            $('.freight.local').addClass('hide');
            $('.freight.inter').removeClass('hide');
        } else { //非海外
            $('.origin_price').text('原价:￥' + market_price);
            $('.sales_quantity').text('销量:' + sales_quantity);
            $('.freight.local').removeClass('hide');
            $('.freight.inter').addClass('hide');
        }

        // $('.brand_info').attr('data-product_id', product_id);
        $('.brand_info').attr({'data-source':source},{'data-business_id': business_id});

        //products
        for (var i = 0; i < products.length; i++) {
            var product_id = products[i].product_id,
                goods_attr = products[i].goods_attr,
                product_number = products[i].product_number,
                price = products[i].price;
            productsHtml += '<li data-goods_attr="' + goods_attr + '" data-price="'+price+'" data-product_id="' + product_id + '" data-product_number="' + product_number + '"></li>'
        }
        $('.choice-size-color').append('<ul class="products">' + productsHtml + '</ul>');

        //包邮 免税 折扣 团购
        if (taglist.length > 0) {
            for (var i = 0; i < taglist.length; i++) {
                tagHtml += '<span>' + taglist[i] + '</span>'
            }
            $('.tags').append(tagHtml);
        }

        //是否为海外购 0不是 1是
        $('.goods_source').text(warehouse).attr('data-is_overseas_order', overseas);
        window.localStorage.setItem("overseas", overseas);
        if(overseas == 0){
            $('.goods_source').addClass('hide');
        }

        //售罄
        if(is_saleout == 1){
            $('.saleout').removeClass('hide');
            $('.bottom .add,.bottom .buy').addClass('gray');
        }

        //7天无理由退货
        if (is_return_product == 0) {
            $('.is_return_product').addClass('hide');
        }

        //优惠券 满减
        if (promote.length > 0) {
            var reachHtml = '',
                couponHtml = '',
                num = 0,
                len = 0;
            for (var i = 0; i < promote.length; i++) {
                var promote_id = promote[i].promote_id,
                    promote_minus_price = promote[i].promote_minus_price, //优惠劵面值
                    promote_name = promote[i].promote_name, //使用优惠劵或补贴的名称
                    promote_reach_price = promote[i].promote_reach_price, //使用优惠劵需要满足的金额
                    promote_type = promote[i].promote_type, //使用优惠劵或补贴的类型
                    promote_remain_store = promote[i].promote_remain_store ? promote[i].promote_remain_store : '', //优惠券剩余数量
                    promote_value = promote[i].promote_value; //优惠劵面值

                if (promote_type === 'promote_reach') {
                    num++;
                    reachHtml += '<span class="tag" data-promote_type="'+promote_type+'" data-promote_id="'+promote_id+'">满' + promote_reach_price + '减' + promote_value + '</span>'
                } else if(promote_type === 'promote_coupon' || promote_type === 'promote_special') {
                    len++;
                    if(promote_reach_price != 0){
                        couponHtml += '<span class="tag" data-promote_type="'+promote_type+'" data-promote_id="'+promote_id+'">满' + promote_reach_price + '减' + promote_value + '</span>'
                    }else{
                        couponHtml += '<span class="tag" data-promote_type="'+promote_type+'" data-promote_id="'+promote_id+'">' + promote_value + '元优惠券</span>'
                    }
                }else if(promote_type === 'promote_subsidies'){
                    promoteHtml += '<li class="promote_special" data-promote_id="' + promote_id + '" data-type="' + promote_type + '" data-minus_price="' + promote_minus_price + '" data-remain_store="' + promote_remain_store + '">'
                    promoteHtml += '<span class="tit">红包补贴：</span>本商品享受明星衣橱补贴' + promote_value + '元</li>';
                }
            }
            if (num > 0) {
                promoteHtml += '<li class="promote_reach">';
                promoteHtml += '<span class="tit">满减：</span><div class="promotes">' + reachHtml + '</div></li>';
            }
            if (len > 0) {
                promoteHtml += '<li class="promote_coupon">';
                promoteHtml += '<span class="tit">领券：</span><div class="promotes">' + couponHtml + '</div></li>';
            }
            $('.privilege').append(promoteHtml);
        }
        self.getCoupon();

        //最小限购数
        if(min_purchase_num != '0'){
            $('.min_limit_num').append('[该商品<span class="num">'+min_purchase_num+'</span>件起购]');
            $('.min_num').text('('+min_purchase_num+'件起购)');
        }
        //最大限购数
        if(purchase_num != '0' && min_purchase_num == '0'){
            $('.max_limit_num').append('[该商品限购<span class="num">'+purchase_num+'</span>件]');
            $('.min_num').text('(限购'+purchase_num+'件)');
        }

        //选择颜色 尺寸 数量
        $('.choiced').on('tap', function() {
            if(is_saleout == 1){
                self.hideColorSizeBox();
            }else{
                self.showChoiceColorSize();
            }
        });

        //颜色 尺码
        $('.choice-size-color .goods-name').text(goods_name);
        $('.selected .color').text();
        if (spe.length > 0) {
            for (var i = 0; i < spe.length; i++) {
                var is_main = spe[i].is_main,
                    name = spe[i].name,
                    valueHtml = '';

                if (name == '颜色') {
                    var index = i,
                        values = spe[index].values;
                    for (var j = 0; j < values.length; j++) {
                        var id = values[j].id,
                            img_url = values[j].img_url,
                            is_default = values[j].is_default,
                            label = values[j].label;
                        valueHtml += '<span data-is_main="' + is_main + '" data-id="' + id + '" data-img_url="' + img_url + '" data-is_default="' + is_default + '">' + label + '</span>';
                    }
                    $('.choice-size-color .goods-img').attr('src', spe[index].values[0].img_url);
                    $('.colors').append(valueHtml);
                    $('.colors span:nth-child(1)').addClass('select');
                    $('.selected .color').text('“'+$('.colors .select').text()+'” ');
                } else {
                    var index2 = i,
                        values = spe[index2].values;
                    for (var j = 0; j < values.length; j++) {
                        var id = values[j].id,
                            img_url = values[j].img_url,
                            is_default = values[j].is_default,
                            label = values[j].label;
                        valueHtml += '<span data-is_main="' + is_main + '" data-id="' + id + '" data-img_url="' + img_url + '" data-is_default="' + is_default + '">' + label + '</span>';
                    }
                    $('.sizes').append(valueHtml);
                    $('.sizes span:nth-child(1)').addClass('select');
                    $('.selected .size').text('“'+$('.sizes .select').text()+'” ');
                }
                 
                if(!$('.sizes span').length){
                    $('.choice-size').addClass('hide');
                }else{
                    $('.choice-size').removeClass('hide');
                }
                
                self.getProductId();
                self.initSubtractAdd();
            }


            self.initSizeStyle($('.colors .select'));

            //选择颜色
            $('.colors').on('tap','span',function(){
                self.selectColor($(this));
                self.initSizeStyle($(this));
            })
            //选择尺寸
            $('.sizes').on('tap','span',function(){
                if($(this).not('gray')){
                    self.selectSize($(this));
                }
            })
            //数量增减
            var goodsnum,
                stock_num;
            $('.choice-size-color .subtract').on('tap', function() {
                goodsnum = $(this).next('.goodsnum').text();

                if(!$(this).hasClass('gray')){
                    $(this).next('.goodsnum').text(parseInt(goodsnum) - 1);
                    $('.choice-size-color .add').removeClass('gray');
                    
                    if(min_purchase_num != '0'){
                        if ($(this).next('.goodsnum').text() == min_purchase_num){
                            $(this).addClass('gray');
                        }
                    }else{
                        if ($(this).next('.goodsnum').text() == 1){
                            $(this).addClass('gray');
                        }
                    }
                } 
            })
            $('.choice-size-color .add').on('tap', function() {
                goodsnum = $(this).prev('.goodsnum').text();
                stock_num = $('.choice-size-color .goods-num .num').text(); //库存

                if(!$(this).hasClass('gray')){
                    $(this).prev('.goodsnum').text(parseInt(goodsnum) + 1);
                    $('.choice-size-color .subtract').removeClass('gray');
                    
                    if(purchase_num != '0'){
                        if($(this).prev('.goodsnum').text() == Math.min(purchase_num,stock_num)){ //限购
                            $(this).addClass('gray');
                        }
                    }else{
                        if(stock_num == $(this).prev('.goodsnum').text()){ //库存
                            $(this).addClass('gray');
                        }
                    }
                }  
            })

            //确定
            $('.ascertain').on('tap', function() {
                if($(this).hasClass('active')){
                    var tapfrom = $('.choice-size-color').attr('data-tapfrom'),
                        color = $('.colors .select').text() || '',
                        size = $('.sizes .select').text() || '',
                        goods_num = $('.goods-num .num').text(),
                        num = $('.goodsnum').text();
                    // if (!color || !size) {
                    //     Common.setDialog('请选择颜色尺码');
                    // } else {
                        // if (goods_num < 1) {
                        //     Common.setDialog('库存不足，请重新选择');
                        // } else {
                            $('.choiced .size').text(color + ' ' + size + ' ' + num);
                            self.hideColorSizeBox();
                            if(tapfrom == 'buy'){
                                self.toBuy();
                            }else if(tapfrom == 'add'){
                                self.cartAdd();
                            }
                        //}
                    //}
                }
            })
            //close
            $('.choice-size-color .close').on('tap', function() {
                self.hideColorSizeBox();
            })
        }

        //inter 运费 关税
        interHtml += '<p><span class="tit">运费：</span><span class="con">' + faretxt + '</span></p>';
        interHtml += '<p><span class="tit">关税：</span><span class="con">' + tarifftxt + '</span></p>';
        $('.freight.inter').append(interHtml);

        //店铺简介
        if (explainInfo_items.length > 0) {
            for (i = 0; i < explainInfo_items.length; i++) {
                var component = explainInfo_items[i].component,
                    // componentType = component.componentType,
                    picUrl = component.picUrl,
                    title = component.title;
                processHtml += '<p><img src="' + picUrl + '" width="40%"/><span class="step1">' + title + '</span></p>'
            }
        }
        brandHtml += '<p class="intro_tit"><img src="' + business_image + '" width="17%">'
        brandHtml += '<a class="business_name" href="/app/templates/brand_detail.html?id='+business_id+'&tab_index='+self.settings.tab_index+'&sort='+self.settings.sort+'">' + business_name + '</a></p>'
        brandHtml += '<p class="intro_con">' + business_brief + '</p>'
        brandHtml += '<div class="process">' + processHtml + '</div>'
        $('.brand_intro').append(brandHtml);

        //tab内容
        for (i = 0; i < tabInfo.length; i++) {
            var tab_title = tabInfo[i].tab_title,
                tab_url = tabInfo[i].tab_url;
            $('.tab_tit').append('<li class="tit">' + tab_title + '</li>');
            $('.tab_tit .tit').css('width',$('body').width() * 0.9/tabInfo.length)
            $('.tabs').append('<div class="tab_con"></div>');

            if (tab_title == '商品详情') {
                $('.tab_con').eq(i).addClass('detail');
            } else if (tab_title == '尺码试穿') {
                $('.tab_con').eq(i).addClass('size');
            } else if (tab_title == '搭配') {
                $('.tab_con').eq(i).addClass('match');
            } else if (tab_title == '品牌介绍') {
                $('.tab_con').eq(i).addClass('brand');
            } else if (tab_title == '售后服务') {
                $('.tab_con').eq(i).addClass('aftersale');
            }
        }
        $('.tab_tit .tit').eq(0).addClass('active');
        $('.tab_con').eq(0).addClass('active');
        self.switchTab($('.tabs'));


        //统计
        var sku_id = '',
            data_source = $('.brand_info').attr('data-source'),
            data_source_id = $('.brand_info').attr('data-source-id'),
            t = new Date(),
            ts = t.getFullYear()+'-'+t.getMonth()+1+'-'+t.getDate()+' '+t.getHours()+':'+t.getMinutes()+':'+t.getSeconds(),
            events = {
                "eventname": "sku_c",
                "brand_id": self.settings.business_id,
                "sku_id": sku_id, //非必须
                "source": data_source,  //非必须
                "source_id": data_source_id, //非必须
                "business_id": self.settings.business_id, //非必须
                "ts": ts
            }
        Common.sendAnchor(events);

        self.getDetail();
    },
    doDetailHtml: function(data) {
        var goodsDetail = data.goodsDetail, //详情
            brand_location = goodsDetail.brand_location,
            detail_brand_desc = goodsDetail.brand_desc,
            pictures = goodsDetail.pictures,

            goodsSize = data.goodsSize, //尺码
            // img_url = goodsSize.img_address,
            // img_height = goodsSize.img_height / goodsSize.img_width * $(window).width(),

            brandIntroduction = data.brandIntroduction, //品牌
            banner_url = brandIntroduction.banner_url,
            brand_desc = brandIntroduction.brand_desc,

            aftersaleService = data.aftersaleService, //售后
            express_type = aftersaleService.express_type,
            imageList = aftersaleService.imageList,

            detailHtml = '',
            sizeHtml = '',
            brandHtml = '',
            aftersaleHtml = '';
        //详情
        detailHtml += '<p class="brand_location">品牌所在地：<span>'+brand_location+'</span></p>';
        detailHtml += '<p class="brand_desc">'+detail_brand_desc+'</span></p>';
        if(pictures && pictures.length > 0){
            for(var i=0;i<pictures.length;i++){
                var img_url = pictures[i].img_url,
                    img_height = pictures[i].img_height / pictures[i].img_width * $(window).width();
                detailHtml += '<p style="background:url(' + img_url + ') no-repeat;background-size:100%;width:100%;height:' + img_height + 'px"></p>'
            }
        }
        $('.tab_con.detail').append(detailHtml);

        //尺码
        if(goodsSize.length > 0){
            for(var i=0;i<goodsSize.length;i++){
                var img_url = goodsSize[i].img_url,
                    img_height = goodsSize[i].img_height / goodsSize[i].img_width * $(window).width();
                sizeHtml += '<img src="' + img_url + '" alt="" style="width:100%;" />';
            }
        }
        $('.tab_con.size').append(sizeHtml);

        //品牌
        brandHtml += '<img src="' + banner_url + '" alt="" style="width:100%;" />';
        brandHtml += '<p class="brand_desc">' + brand_desc + '</p>';
        $('.tab_con.brand').append(brandHtml);

        //售后
        if(imageList.length > 0){
            for(var i=0;i<imageList.length;i++){
                var img_url = imageList[i].img_url,
                    img_height = imageList[i].img_height / imageList[i].img_width * $(window).width();
                aftersaleHtml += '<img src="' + img_url + '" alt="" style="width:100%;height:' + img_height + 'px" />';
            }
        }
        $('.tab_con.aftersale').append(aftersaleHtml);
    },
    timedCount: function(time){
        var self = this,
            day = parseInt(time / (3600 * 24)),
            hour = parseInt(time / 3600),// 小时数
            min = parseInt(time / 60),// 分钟数
            lastsecs = time % 60,
            temptextmin;
        if(hour >= 24) {
            hour = hour % 24;
        }
        
        if(min >= 60){
            min = min % 60;
        }
        

        if(lastsecs < 10){
            lastsecs = '0' + lastsecs;
        }
        if(min < 10){
            min = '0' + min;
        }
        if(hour < 10){
            hour = '0' + hour;
        }
        if(day < 10){
            day = '0' + day;
        }
        temptextmin = day + "天" + hour + ":" + min + ":" + lastsecs;
        $('.mark .j_time').text(temptextmin);
        if(time == 0){
            clearTimeout(t);
            return;
        }
        time=time-1;
        
        var t=setTimeout(function(){
            self.timedCount(time);
        },1000);
    },
    getCartNum: function() {
        var self = this,
            url = self.settings.getDataUrl,
            source = self.settings.source,
            version = self.settings.version,
            key = self.settings.key,
            method = self.settings.getCartMethod,
            token = self.settings.token,
            app_uid = self.settings.app_uid;
        $.ajax({
            type: 'get',
            url: url,
            data: {
                source: source,
                version: version,
                method: method,
                token: token,
                app_uid: app_uid,
                sign: md5(source + version + method + token + app_uid + key)
            },
            dataType: 'json',
            success: function(result) {
                console.log(result);
                if (result.response.msg === "success") {
                    var data = result.response.data,
                        cart = data.cart,
                        goods_len = 0;
                    for (var i = 0; i < cart.length; i++) {

                        for(var j=0;j<cart[i].goods.length;j++){
                            goods_len += parseInt(cart[i].goods[j].goodsNumber);
                            console.log(goods_len)
                        }
                        
                    }
                    if(goods_len>99){
                        goods_len = '99+'
                    }
                    $('.car .num').text(goods_len);
                } else {
                    alert("接口错误");
                }
            },
            error: function(xhr, type) {
                console.log("请求失败");
            }
        })
    },
    hideColorSizeBox: function(){
        $('.choice-size-color').addClass('hide');
        $('.mask').addClass('hide');
        $('#good_detail,body').removeAttr('style').attr('style','');
    },
    //库存为0的尺码 默认置灰
    initSizeStyle: function(item){
        $('.sizes span').removeClass('gray');
        var color_id = item.attr('data-id'),
            products_li = $('.products li'),
            products_li_attr,
            product_number,
            gray_size_id,
            size_li = $('.sizes span'),
            size_li_attr;
        for(var i=0;i<products_li.length;i++){
            products_li_attr = products_li.eq(i).attr('data-goods_attr');
            if(products_li_attr.indexOf(color_id) >= 0){
                product_number = products_li.eq(i).attr('data-product_number');
                if(product_number == 0){
                    gray_size_id = products_li.eq(i).attr('data-goods_attr').slice(0,6);
                    products_li.eq(i).addClass('gray')

                    for(var j=0;j<size_li.length;j++){
                        size_li_attr = size_li.eq(j).attr('data-id');
                        if(size_li_attr == gray_size_id){
                            size_li.eq(j).addClass('gray');
                        }
                    }
                }
            }
        }
        
    },
    initSubtractAdd: function(){
        var goodsnum = parseInt($('.choice-size-color .goodsnum').text()),  //要购买的数量
            stock_num = parseInt($('.choice-size-color .goods-num .num').text()), //库存
            min_purchase_num,//最小限购数
            purchase_num;//最大限购数

        $('.choice-size-color .subtract,.choice-size-color .add').removeClass('gray');

        if(!goodsnum){
            goodsnum = 1;
        }

        //最小限购
        if($('.min_limit_num .num').text()){
            min_purchase_num = parseInt($('.min_limit_num .num').text());
        }else{
            min_purchase_num = 0;
        }
        //最大限购
        if($('.max_limit_num .num').text()){
            purchase_num = parseInt($('.max_limit_num .num').text());
        }else{
            purchase_num = 0;
        }


        // if(min_purchase_num != '0'){
        //     $('.choice-size-color .goodsnum').text(min_purchase_num);
        //     if (goodsnum == min_purchase_num) {
        //         $('.choice-size-color .subtract').addClass('gray'); 
        //     }
        // }else{
        //     if (goodsnum == 1) {
        //         $('.choice-size-color .subtract').addClass('gray'); 
        //     }
        // }

        console.log('goodsnum='+goodsnum,'stock_num='+stock_num,'min_purchase_num='+min_purchase_num,'purchase_num='+purchase_num)
        
        // if (stock_num <= goodsnum) { //超出库存
        //     $('.choice-size-color .add').addClass('gray');
        // }
        // if(goodsnum > stock_num){
        //     $('.choice-size-color .goodsnum').text(stock_num);
        // }
        if($('.choice-size-color .goodsnum').text() == 0){
            $('.choice-size-color .goodsnum').text('1');
        }

        if(min_purchase_num != '0'){
            $('.choice-size-color .goodsnum').text(min_purchase_num);
            $('.choice-size-color .subtract').addClass('gray'); 
        }else if(purchase_num != '0'){
            if (goodsnum >= Math.min(purchase_num,stock_num)) { //超出最大限购
                $('.choice-size-color .goodsnum').text(Math.min(purchase_num,stock_num));
                $('.choice-size-color .add').addClass('gray');
            }
        }else if($('.choice-size-color .goodsnum').text() >= stock_num){
            $('.choice-size-color .goodsnum').text(stock_num);
            $('.choice-size-color .add').addClass('gray');
        }else{
            $('.choice-size-color .goodsnum').text(goodsnum);
        }

        if (goodsnum == 1) {
            $('.choice-size-color .subtract').addClass('gray'); 
        }

        // if(purchase_num != '0'){
        //     if (goodsnum >= Math.min(purchase_num,stock_num)) { //超出最大限购
        //         $('.choice-size-color .goodsnum').text(Math.min(purchase_num,stock_num));
        //         $('.choice-size-color .add').addClass('gray');
        //     }
        // }else if($('.choice-size-color .goodsnum').text() >= stock_num){
        //     $('.choice-size-color .goodsnum').text(stock_num);
        //     $('.choice-size-color .add').addClass('gray');
        // }else{
        //     $('.choice-size-color .goodsnum').text(goodsnum);
        // }
    },
    selectColor: function(item){
        var self = this;
        // $('.sizes span').removeClass('select');
        $('.choice-size-color .select').removeClass('gray');
        $('.ascertain').removeClass('active');
        
        item.addClass('select').siblings().removeClass('select');
        var img = item.attr('data-img_url');
        $('.goods-img').attr('src',img);
        //已选择
        $('.selected .color').text('“'+$('.colors .select').text()+'” ')
        $('.selected .size').text('');
        $('.goods-num .num').text('');
        $('.goods-price .pink').text('');
        self.getProductId();
        self.initSubtractAdd();
    },
    selectSize: function(item){
        var self = this;
        if(item.not('gray')){
            //$('.choice-size-color .select').removeClass('gray');
            item.addClass('select').siblings().removeClass('select');
            //已选择
            $('.selected .size').text(' “'+$('.sizes .select').text()+'”')
            self.getProductId();
        }
        self.initSubtractAdd();
    },
    getProductId: function() {
        var self = this,
            color_len = $('.colors .select').length,
            size_len = $('.sizes .select').length,
            color_id = $('.colors .select').attr('data-id'),
            size_id = $('.sizes .select').attr('data-id'),
            color_is_main = $('.colors .select').attr('data-is_main'),
            size_is_main = $('.sizes .select').attr('data-is_main'),
            attr;
        //当选择颜色和尺码后 确定按钮才可点击
        if (color_len > 0 && size_len > 0 || $('.sizes span').length == 0 && color_len > 0) {
            $('.ascertain').addClass('active');
        }
        //通过查找products数组确定productId(选择的颜色尺码)
        if(size_id){  
            if (color_is_main > size_is_main) {
                attr =size_id + '|' + color_id;
            } else {
                attr = color_id + '|' + size_id;
            }
        }else{
            attr = color_id;
        }
        $('.products li').each(function() {
            var goods_attr = $(this).attr('data-goods_attr'),
                product_id = $(this).attr('data-product_id'),
                product_number = $(this).attr('data-product_number'),
                price = $(this).attr('data-price');
            if(attr == goods_attr){
                $('.goods-num .num').text(product_number);
                $('.goods-price .pink').text('￥'+price);
                $('.choiced').attr('data-productId',product_id);
                if (product_number < 1) {
                    $('.sizes .select,.choice-size-color .add').addClass('gray');
                    $('.ascertain').removeClass('active');
                }
            }
        });
        // self.initSubtractAdd();
    },
    switchTab: function(tabs) {
        var tab_tit = tabs.find('.tab_tit'),
            tit = tab_tit.find('.tit'),
            tab_con = tabs.find('.tab_con');

        tab_tit.on('tap', 'li', function() {
            var index = $(this).index();
            tit.removeClass('active').eq(index).addClass('active');
            tab_con.removeClass('active').eq(index).addClass('active');
        })
    },
    setSlider: function() {
        var len = $('.images p').length,
            width = $('body').width(),
            height = $('.images p').height(),
            left = 0,
            index = 1;

        $('.images').width(len * width).find('img').width('width').height(height);
        $('.roll-imgs .tag').text(index + '/' + len);

        if (len > 1) {
            var timer = setInterval(function() {
                left -= width;
                index++;
                $('.images').animate({
                    marginLeft: left
                });
                $('.roll-imgs .tag').text(index + '/' + len);
                if (left <= -(len - 1) * width) {
                    clearInterval(timer);
                }
            }, 2000)
        }

        //触摸滑动
        var startPosition, endPosition, deltaX, deltaY, moveLength,left;  
        $(".roll-imgs").on('touchstart', function(e){  
            var touch = e.touches[0];  
            startPosition = {  
                x: touch.pageX,  
                y: touch.pageY  
            }  
            clearInterval(timer);
        }) .on('touchmove', function(e){
            var touch = e.touches[0];  
            endPosition = {  
                x: touch.pageX,  
                y: touch.pageY  
            };  
  
            deltaX = endPosition.x - startPosition.x;  
            deltaY = endPosition.y - startPosition.y; 
            if(Math.abs(deltaY) < 10){ //左右滑动距离大于上下滑动距离时禁止屏幕滚动
                e.preventDefault();
            } 
            moveLength = Math.sqrt(Math.pow(Math.abs(deltaX), 2) + Math.pow(Math.abs(deltaY), 2));  
        }).on('touchend', function(e){  
            if(deltaX < 0) { // 向左划动  
                console.log('向左划动')
                if($('.images').css('marginLeft')){
                    left = parseInt($('.images').css('marginLeft'))-width;

                    if(parseInt($('.images').css('marginLeft')) == -width*($('.images p').length-1)){
                        left = -width*($('.images p').length-1);
                    }
                }else if($('.images p').length > 1){
                    left = -width;
                }else{
                    left = 0;
                }

                
                $('.images').css({'marginLeft':left});
                
                if(index < $('.images p').length){
                    index++;
                }else{
                    index = $('.images p').length;
                }

            } else if (deltaX > 0) { // 向右划动 
                console.log('向右');
                if(!parseInt($('.images').css('marginLeft'))){
                        left = 0;
                }else if($('.images').css('marginLeft')){
                    left = parseInt($('.images').css('marginLeft'))+width;

                    
                }else if($('.images p').length > 1){
                    left = width;
                }else{
                    left = 0
                } 
                
                $('.images').css({'marginLeft':left});
                if(index > 1){
                    index--;
                }else{
                    index = 1;
                }
            } 
            $('.roll-imgs .tag').text(index + '/' + len); 
        }); 
    },
    //加入购物车
    cartAdd: function() {
        var self = this,
            url = '/hichao/interface.php',
            t = new Date(),
            ts = t.getFullYear()+'-'+t.getMonth()+1+'-'+t.getDate()+' '+t.getHours()+':'+t.getMinutes()+':'+t.getSeconds(),
            source_id = self.settings.source_id,
            productId = $('.choiced').attr('data-productId'),
            from = '{\"gf\":\"H5\",\"gi\":\"'+self.settings.h5_guid+'\",\"tab_2\":\"new_arrival\",\"ts\":\"'+ts+'\",\"sku_id\":\"1000000506\",\"source_id\":\"'+source_id+'\",\"tab_1\":\"hot\",\"source\":\"'+$('.brand_info').attr('data-source')+'\",\"business_id\":\"'+self.settings.business_id+'\",\"price\":\"'+$('.now_price').text().slice(1)+'\"}',
            goodsNumber = $('.choice-num .goodsnum').text(),
            base64_data = base64_encode.encoder('{"sourceId":"' + source_id + '","productId":"' + productId + '","from":' + from + ',"goodsNumber":"' + goodsNumber + '"}') || '',
            source = self.settings.source,
            version = self.settings.version,
            method = 'goods.cart.add',
            token = self.settings.token,
            app_uid = self.settings.app_uid,
            key = self.settings.key;
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
                    // alert('已添加到购物车');
                    Common.setDialog('已添加到购物车');
                    self.getCartNum();
                } else {
                    // alert(result.response.msg);
                    Common.setDialog(result.response.msg);
                }
            },
            error: function() {
                console.log("请求失败");
            }
        })


        //埋点
        var price = $('.now_price').text(),
            source = $('.brand_info').attr('data-source'),
            source_id = $('.brand_info').attr('data-source-id'),
            data_source_id = $(this).attr('data-sourceid'),
            business_id = self.settings.business_id,
            t = new Date(),
            ts = t.getFullYear()+'-'+t.getMonth()+1+'-'+t.getDate()+' '+t.getHours()+':'+t.getMinutes()+':'+t.getSeconds(),
            events = {
                "eventname": "addcart_c",
                "business_id": business_id,
                "price": price,
                "sku_id": '',
                "source_id": source_id,
                "source": source,
                "brand_id": business_id,
                "ts": ts
            }
        Common.sendAnchor(events);
    },
    //领取优惠券
    getCoupon:function(){
        var self = this;
        $('.promote_coupon').on('tap','.tag',function(){
            var promote_id = $(this).attr('data-promote_id'),
                promote_type = $(this).attr('data-promote_type'),
                url = self.settings.getDataUrl,
                token = self.settings.token,
                app_uid = self.settings.app_uid,
                base64_data = base64_encode.encoder('{"promote_ids":"' + promote_id + '","promote_type":"' + promote_type + '","mxyc_token":"'+token+'"}') || '',
                source = VER_CONFIG.source,
                version = VER_CONFIG.version,
                key = VER_CONFIG.key,
                method = 'goods.promote.coupon',
                par = self.settings.par;
            if(token){
                $.ajax({
                    type: 'get',
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
                        console.log(result);
                        if (result.response.msg === "success") {
                            Common.setDialog('优惠券领取成功，在结算页面显示优惠详情');
                        } else if(result.response.code == '1') {
                            Common.setDialog(result.response.msg);
                        }
                    },
                    error: function(xhr, type) {
                        console.log("请求失败");
                    }
                })
            }else {
                window.location.href = '/app/templates/login.html?from=good_detail&' + $.param(par);
            }
        })
    },
    showChoiceColorSize: function(tapfrom){
        var self = this;
        $('.mask').height($(window).height()).removeClass('hide').css('zIndex', '999');
        $('#good_detail,body').height($(window).height()).css('overflow','hidden');
        $('.choice-size-color').attr('data-tapfrom',tapfrom).removeClass('hide').css('zIndex', '999');
        
        if($('.sizes .select').length == 0){
            $('.ascertain').removeClass('active');
        }
        if($('.sizes span').length == 0){
            $('.ascertain').addClass('active');
        }
        $('#good_detail').css({'position':'fixed'},{'width':'100%'});
        self.initSubtractAdd();
    },
    //立即购买
    toBuy: function() {
        var self = this,
            t = new Date(),
            ts = t.getFullYear()+'-'+t.getMonth()+1+'-'+t.getDate()+' '+t.getHours()+':'+t.getMinutes()+':'+t.getSeconds(),
            overseas = $('.goods_source').attr('data-is_overseas_order'),
            token = Cookie.get('token') || '',
            app_uid = Cookie.get('app_uid') || '',
            source_id = self.settings.source_id,
            main_image = self.settings.main_image,
            business_id = self.settings.business_id,
            tab_index = self.settings.tab_index,
            par = self.settings.par,
            cartId = '', //从商品详情直接购买的，随便写的cartId
            from = "{\'gf\':\'H5\',\'gi\':\'"+self.settings.h5_guid+"\',\'tab_2\':\'new_arrival\',\'ts\':\'"+ts+"\',\'sku_id\':\'\',\'source_id\':\'"+source_id+"\',\'tab_1\':\'hot\',\'source\':\'"+$('.brand_info').attr('data-source')+"\',\'business_id\':\'"+self.settings.business_id+"\',\'price\':\'"+$('.now_price').text().slice(1)+"\'}",
            product_id = $('.choiced').attr('data-productId'),
            goods_number = $('.choice-num .goodsnum').text(),
            goods_price = $('.now_price').text().substr(1),
            good_data = '{"items":[{"businessId": "' + business_id + '","goods": [{"cartId": "' + cartId + '","from":' + JSON.stringify(from) + ',"source_id": "' + source_id + '","product_id": "' + product_id + '","goods_number": "' + goods_number + '","goods_price": "' + goods_price + '"}]}]}';

        window.localStorage.setItem("is_overseas_order",overseas);
        window.localStorage.setItem("source_id",source_id);
        window.localStorage.setItem("main_image",main_image);
        window.localStorage.setItem("business_id",business_id);

        window.localStorage.setItem('good_data',good_data);
        if (token) {
            if ($('.choiced .size').text() == '颜色尺码分类') {
                self.showChoiceColorSize('buy');
            } else {
                window.location.href = '/app/templates/order.html?from=good_detail&'+$.param(par)+'&good_data='+encodeURIComponent(good_data);
            }
        } else {
            window.location.href = '/app/templates/login.html?from=good_detail&' + $.param(par);
        }
    }
}
GOODDETAIL.init();
