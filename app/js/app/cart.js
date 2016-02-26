
import 'zepto';
import BASE from 'h5_base';
import base64_encode from 'base64';
import md5 from 'md5';
import VER_CONFIG from 'version';
import  Cookie from "cookie";
import Common from "common";

var CART = {
    settings: {
        login_state: Cookie.get('login_state'),
        token: Cookie.get('token') || window.localStorage.getItem("token"),
        app_uid: Cookie.get('app_uid') || window.localStorage.getItem("app_uid"),
        source : VER_CONFIG.source,
        version : VER_CONFIG.version,
        key : VER_CONFIG.key,
        getDataUrl : '/hichao/interface.php',
        getDataMethod : 'goods.cart.get',
        doRemoveOneMethod : 'goods.cart.remove',
        cleanCartMethod : 'goods.cart.clean',
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
    init: function () {
        var self = this,
            par = self.settings.par;

        BASE.lang.adapt();
        Common.init();
        self.getData();

        window.localStorage.removeItem("overseas2");
        // alert(document.cookie)
        $('.get_coupon,.bac-mask').height($(window).height());
        $('.return').attr('href','/app/templates/good_detail.html?' + $.param(par));

        $('.nothing .btn').attr('href','/app/templates/brand_detail.html?id=' + self.settings.business_id);

        //单个获取优惠券
        $('.get_coupon').on('tap','.to_get',function(){
            if($(this).not('.finish')){
                var item = $(this).parent('.tag'),
                    promote_ids = item.attr('data-promote_id'),
                    promote_type = item.attr('data-promote_type');
                self.getCoupon(item,promote_ids,promote_type);
            }
        })

        //一键获取
        $('.get_coupon').on('tap','.ascertain',function(){
            if(!$(this).hasClass('gray')){
                var item = $('.get_coupon .con .tag'),
                    promote_ids = '';
                for(var i=0;i<item.length;i++){
                    var promote_id = item.eq(i).attr('data-promote_id'),
                        promote_type = item.eq(i).attr('data-promote_type');
                    promote_ids += promote_id;
                    if(i != item.length-1){
                        promote_ids += ',';
                    }
                }
                self.getCoupon(item,promote_ids,promote_type);
            }
        })
    },
    getData: function(){
        var self = this,
            par = self.settings.par,
            url = self.settings.getDataUrl,
            source = self.settings.source,
            version = self.settings.version,
            key = self.settings.key,
            method = self.settings.getDataMethod,
            token = self.settings.token,
            app_uid = self.settings.app_uid;
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
                    sign:md5(source+version+method+token+app_uid+key)
                },
                dataType: 'json',
                success: function(result){
                    console.log(result);
                    if (result.response.msg === "success") {
                        var data = result.response.data,
                            cart = data.cart,
                            goods_len = 0;
                        self.doHtml(data);
    			        self.doEditFinish();
    			        self.doAddSubtract();
    			        self.doRemoveOne(url,source,version,key);
    			        self.doClean(url,source,version,key);
    			        self.doSelect();
                        self.toBuy();
                        $('.item').each(function(){
                            self.changeRadioBtn($(this));
                        });
                    } else {
                        alert("接口错误");
                    }
                },
                error: function(xhr, type){
                    console.log("请求失败");
                }
            })
        }else{
            window.location.href = '/app/templates/login.html?from=cart&'+ $.param(par);
        }
    },
    doHtml: function(data){
        var self = this,
            token = self.settings.token,
            par = self.settings.par,
        	cart = data.cart;
        if(token){
            if(cart.length>0){
    	        for(var i=0;i<cart.length;i++){
    	        	var businessId = cart[i].businessId,
    	        		businessName = cart[i].businessName,
                        is_overseas = cart[i].is_overseas,
                        country_img = cart[i].country.country_img,
    	        		goods = cart[i].goods,
                        promote = cart[i].promote,
                        special_class,
    	        		shopHtml = '',
                        promoteHtml = '';

                    if(is_overseas == 1){
                        special_class = 'is_overseas';
                    }else{
                        special_class = '';
                    }
    	        	shopHtml += '<div class="shop '+special_class+'" data-businessid="'+businessId+'"><div class="name">'
    				shopHtml += '<div class="shop_title"><img class="select select-wholeshop" src="/app/images/icon_buy_chioce_ont@2x.png">'
    				shopHtml += '<p class="tit"><img src="'+country_img+'" alt="" />'
                    if(is_overseas == 1){
                        shopHtml += '<img class="logistics" src="/app/images/icon_purchasing@2x.png" alt="" />'
                    }
                    shopHtml += '<a href="/app/templates/brand_detail.html?id='+businessId+'">'+businessName+'</a></p></div>'
    				shopHtml += '<span class="editbtn">编辑</span>'
    				shopHtml += '</div><ul class="privilege"></ul></div>'
    				$('#cart').append(shopHtml);

                    //商品
    	        	for(var j=0;j<goods.length;j++){
    	        		var cart_id = goods[j].cart_id,
    	        			from = goods[j].from ? goods[j].from : 'null',
    	        			goodsAttr = goods[j].goodsAttr,
    	        			goodsCatNumber = goods[j].goodsCatNumber,
    	        			goodsId = goods[j].goodsId,
    	        			goodsImage = goods[j].goodsImage,
    	        			goodsName = goods[j].goodsName,
    	        			goodsNumber = parseInt(goods[j].goodsNumber) ? parseInt(goods[j].goodsNumber) : 0,
    	        			goodsShopPrice = goods[j].goodsShopPrice,
    	        			goodsSoureId = goods[j].goodsSoureId,
                            productId = goods[j].productId,
                            productNumber = parseInt(goods[j].productNumber) ? parseInt(goods[j].productNumber) : 0,
                            on_sale = goods[j].on_sale,
                            min_purchase_num = parseInt(goods[j].min_purchase_num) ? parseInt(goods[j].min_purchase_num) : 0,//最小限购数
    	        			purchase_num = parseInt(goods[j].purchase_num) ? parseInt(goods[j].purchase_num) : 0,  //限购数
    	        			itemHtml = '',
                            final_num;
                        
                        if(purchase_num != 0 && (goodsNumber >= purchase_num || goodsNumber >= productNumber)) {  //最大限购 / 库存
                            final_num = Math.min(purchase_num,productNumber);
                        }else{
                            final_num = goodsNumber;  //商品数
                        }

                        console.log(purchase_num,productNumber,goodsNumber,final_num)


    	        		itemHtml += "<div class='item' data-on_sale='"+on_sale+"' data-productNumber='"+productNumber+"' data-min_purchase_num='"+min_purchase_num+"'  data-purchase_num='"+purchase_num+"' data-from='"+from+"' data-productId='"+productId+"' data-goodsNumber='"+goodsNumber+"' data-cartId='"+cart_id+"' data-goodsId='"+goodsId+"' data-soureId='"+goodsSoureId+"'><img class='select select-one' src='/app/images/icon_buy_chioce_ont@2x.png'>"
    				    itemHtml += '<dl><dt><img src="'+goodsImage+'">'
                        if(on_sale == '0'){ //已下架
                            itemHtml += '<p class="sold_out">已下架</p>'
                        }
                        if(productNumber == '0'){
                            itemHtml += '<p class="sold_out">已售罄</p>'
                        }
    				    itemHtml += '</dt><dd class="edit hide num"><p><span class="subtract"></span><span class="goodsnum">'+final_num+'</span><span class="add"></span></p>'
    				    itemHtml += '<p>'+goodsAttr+'</p></dd>'
    				    itemHtml += '<dd class="edit hide removebtn">删除</dd>'
    				    itemHtml += '<dd class="finish info"><p><a href="/app/templates/good_detail.html?source_id='+goodsSoureId+'&main_image=1&business_id='+businessId+'">'+goodsName+'</a></p>'
    				    itemHtml += '<p class="attr">'+goodsAttr+'</p>'
    				    itemHtml += '<p class="price">￥'+goodsShopPrice+'</p></dd>'
                        itemHtml += '<dd class="finish goodsnum"><p>x<span class="num">'+goodsNumber+'</span></p></dd></dl></div>'
    	        		$('.shop').eq(i).append(itemHtml);

                        //初始化加减号
                        $('.item').each(function(){
                            self.initSubtractAdd($(this));
                            self.initRadioBtn($(this));
                        })
    	        	}

                    //优惠券 满减
                    if (promote.length > 0) {
                        var reachHtml = '',
                            couponHtml = '',
                            num = 0,
                            len = 0;
                        for (var j = 0; j < promote.length; j++) {
                            var promote_id = promote[j].promote_id,
                                promote_minus_price = promote[j].promote_minus_price, //优惠劵面值
                                promote_name = promote[j].promote_name, //使用优惠劵或补贴的名称
                                promote_reach_price = promote[j].promote_reach_price, //使用优惠劵需要满足的金额
                                promote_type = promote[j].promote_type, //使用优惠劵或补贴的类型
                                promote_minus_price = promote[j].promote_minus_price,
                                promote_remain_store = promote[j].promote_remain_store ? promote[j].promote_remain_store : '', //优惠券剩余数量
                                promote_value = promote[j].promote_value, //优惠劵面值
                                promote_is_received = promote[j].promote_is_received ? promote[j].promote_is_received : 1, //值为1 表示已领取
                                promote_is_used = promote[j].promote_is_used;  //

                            if (promote_type === 'promote_reach') {
                                num++;
                                reachHtml += '<span class="tag" data-promote_type="'+promote_type+'" data-promote_id="'+promote_id+'">满' + promote_reach_price + '减' + promote_value + '</span>'
                            } else if(promote_type === 'promote_coupon' || promote_type === 'promote_special') {
                                len++;
                                couponHtml += '<p class="tag" data-promote_is_received="'+promote_is_received+'" data-promote_is_used="'+promote_is_used+'" data-promote_type="'+promote_type+'" data-promote_remain_store="'+promote_remain_store+'" data-promote_minus_price="'+promote_minus_price+'" data-promote_id="'+promote_id+'"><span class="tit">'
                                
                                if(promote_reach_price != 0){    
                                    couponHtml += '满' + promote_reach_price + '减' + promote_value + '</span>'
                                }else{
                                    couponHtml += promote_value + '元优惠券</span>'
                                }

                                if(promote_remain_store != 0 && promote_is_received == 0 && promote_is_used == 0){
                                    couponHtml += '<span class="btn to_get">领取</span>'
                                }else if(promote_is_received == 1 && promote_is_used == 0){
                                    couponHtml += '<span class="btn finish">已领取</span>'
                                }else if(promote_is_used == 1){
                                    couponHtml += '<span class="btn finish">已使用</span>'
                                }else if(promote_remain_store == 0){
                                    couponHtml += '<span class="btn bare">已抢光</span>'
                                }
                                couponHtml += '</p>'
                                
                            }else if(promote_type === 'promote_subsidies'){
                                promoteHtml += '<li class="promote_special" data-promote_id="' + promote_id + '" data-type="' + promote_type + '" data-minus_price="' + promote_minus_price + '" data-remain_store="' + promote_remain_store + '">'
                                promoteHtml += '<span class="tit">红包补贴</span>本商品享受明星衣橱补贴' + promote_value + '元</li>';
                            }
                        }
                        if (num > 0) {
                            promoteHtml += '<li class="promote_reach">';
                            promoteHtml += '<span class="tit">满减</span><div class="promotes">' + reachHtml + '</div></li>';
                        }
                        if (len > 0) {
                            promoteHtml += '<li class="promote_coupon">';
                            promoteHtml += '<span class="tit">领券</span><div class="coupon_tit">共'+len+'种优惠券，点击进入领取</div><div class="promotes hide">' + couponHtml + '</div></li>';
                        }
                        $('.shop').eq(i).find('.privilege').append(promoteHtml);
                    }else{
                        $('.shop').eq(i).find('.privilege').addClass('hide');
                    }

                    $('.promote_coupon').on('tap',function(){
                        self.showCouponBox($(this));
                    });
    	        }
    	    }else{
    	    	$('.nothing').removeClass('hide');
    	    	$('.total').addClass('hide');
    	    }
        }else{
            window.location.href = '/app/templates/login.html?from=good_detail&' + $.param(par);
        }
    },
    showCouponBox: function(item){
        var self = this,
            promotes = item.find('.promotes').html(),
            shop_name = item.parents('.shop').find('.name .tit a').text();

        $('#cart').height('500px').css('overflowY','hidden');
        $('.shop_name').text(shop_name);
        $('.get_coupon').removeClass('hide').find('.con').html(promotes);

        self.initCouponBox();

        $('.close').on('tap',function(){
            $('#cart').removeAttr('style');
            $('.get_coupon').addClass('hide');
        })
    },
    initCouponBox: function(){

        $('.msg').addClass('hide');
        //初始化优惠券按钮
        if($('.coupon_box .tag').length > 0){
            $('.coupon_box .tag').each(function(){
                if($(this).attr('data-promote_is_received') == 1){
                    $(this).find('.btn').addClass('finish').removeClass('to_get').text('已领取');
                }
            })
        }

        //初始化一键领取按钮
        if($('.coupon_box .btn').not('.to_get').length == $('.coupon_box .tag').length){
            $('.ascertain').addClass('gray');
        }else{
            $('.ascertain').removeClass('gray');
        }
    },
    getCoupon: function(item,promote_ids,promote_type){
        var self = this,
            url = self.settings.getDataUrl,
            token = self.settings.token,
            app_uid = self.settings.app_uid,
            base64_data = base64_encode.encoder('{"promote_ids":"' + promote_ids + '","promote_type":"'+promote_type+'","mxyc_token":"'+token+'"}') || '',
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
                        self.initCouponBox();

                        $('.get_coupon .msg').removeClass('hide').text('领取成功');
                        setTimeout(function(){
                            $('.get_coupon .msg').addClass('hide');
                        },2000);

                        item.find('.btn').removeClass('to_get')
                            .addClass('finish').text('已领取')
                            .parent('.tag').attr('data-promote_is_received','1');

                        $('.promotes .tag').each(function(){
                            if(promote_ids.indexOf($(this).attr('data-promote_id')) >= 0){
                                $(this).attr('data-promote_is_received','1');
                            }
                        })

                        //一键领取后 按钮置灰
                        if($('.coupon_box .tag').length == $('.coupon_box .finish').length){
                            $('.coupon_box .ascertain').addClass('gray');
                        }

                        //Common.setDialog('优惠券领取成功，请到我的优惠券查看');
                        
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
    },
    //编辑、完成按钮
    doEditFinish: function(){
        var self = this;
		$('.shop .editbtn').on('tap',function(){

            $('.item').each(function(){
                $(this).find('.finish .num').text($(this).find('.edit .goodsnum').text());
            })

			if($(this).hasClass('active')){
				$(this).removeClass('active').text('编辑');
    			$(this).parent().siblings().find('dd.edit').addClass('hide').siblings('.finish').removeClass('hide');
			    var item = $(this).parents('.shop').find('.item');
                item.each(function(){
                    self.cartAdd($(this));
                })
            }else{
	    		$(this).addClass('active').text('完成');
	    		$(this).parent().siblings().find('dd.edit').removeClass('hide').siblings('.finish').addClass('hide');
	    	}
            //总价
            self.totalPrice();	
    	});	
    },
    //修改商品数量
    cartAdd: function(item) {
        var self = this,
            url = '/hichao/interface.php',
            data = '',
            sourceId = item.attr('data-soureid'),
            productId = item.attr('data-productId'),
            from = item.attr('data-from') || '',
            goodsNumber = item.find('.goodsnum .num').text();
        data += '{"sourceId":"' + sourceId + '","productId":"' + productId + '","from":' + from + ',"goodsNumber":"' + goodsNumber + '","type":"update"}';
                
        var base64_data = base64_encode.encoder(data),
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
                    // Common.setDialog('已添加到购物车');
                } else {
                    Common.setDialog(result.response.msg);
                }
            },
            error: function() {
                console.log("请求失败");
            }
        })
    },
    //增减商品数量
    doAddSubtract: function(){
        var self = this,
            item,
            goodsnum, //要购买的数量
            productNumber, //库存
            purchase_num, //最大限购
            min_purchase_num;//最小限购
    	$('.subtract').on('tap',function(e){
            e.preventDefault();
            item = $(this).parents('.item');
    		goodsnum = parseInt($(this).next('.goodsnum').text()),
            min_purchase_num = parseInt(item.attr('data-min_purchase_num'));
    		if(!$(this).hasClass('gray')){
                $(this).next('.goodsnum').text(parseInt(goodsnum) - 1);
                item.find('.add').removeClass('gray');
                if(min_purchase_num != '0'){
                    if ($(this).next('.goodsnum').text() == min_purchase_num){
                        $(this).addClass('gray');
                    }
                }
                if ($(this).next('.goodsnum').text() == 1){
                    $(this).addClass('gray');
                }
            } 
            self.totalPrice();
    	})
    	$('.add').on('tap',function(e){
            e.preventDefault();
            item = $(this).parents('.item');
    		goodsnum = parseInt($(this).prev('.goodsnum').text());
            productNumber = parseInt(item.attr('data-productNumber'));
            purchase_num = parseInt(item.attr('data-purchase_num'));//限购

            if(!$(this).hasClass('gray')){
                $(this).prev('.goodsnum').text(parseInt(goodsnum) + 1);
                item.find('.subtract').removeClass('gray');
                
                if(purchase_num != '0'){
                    console.log(Math.min(purchase_num,productNumber))
                    if($(this).prev('.goodsnum').text() == Math.min(purchase_num,productNumber)){ //限购 库存中的最小值
                        $(this).addClass('gray');
                    }
                }
                else {
                    if(productNumber == $(this).prev('.goodsnum').text()){ //库存
                        $(this).addClass('gray');
                    }
                }
            } 
    	   self.totalPrice();
        })
    },
    //删除单个商品
    doRemoveOne: function(url,source,version,key){
        var self = this;
    	$('.removebtn').on('tap',function(){
            console.log('sadadad')
    		var _this = $(this),
    			cartId = _this.parents('.item').attr('data-cartId'),
    			goodsId = _this.parents('.item').attr('data-goodsId'),
    			soureId = _this.parents('.item').attr('data-soureId'),
    			base64_data = base64_encode.encoder('{"cartId":'+cartId+'}'),
    			token = self.settings.token,
                app_uid = self.settings.app_uid,
                method = self.settings.doRemoveOneMethod;
            if(confirm("确定要删除该商品吗？")){
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
                    	sign: md5(source+version+method+token+app_uid+base64_data+key)
    	            },
    	            dataType: 'json',
    	            success: function(result){
    	                if (result.response.msg === "success") {
    	                	
                            if(_this.parents('.shop').find('.item').length == 1){
                                _this.parents('.shop').remove();
                            }else{
                               _this.parents('.item').remove(); 
                            }

                            // $('.dialog').text('删除成功!').css('display','block');
                            // setTimeout(function(){
                            //     $('.dialog').css('display','none');
                            // },3000);

                            self.totalPrice();

                            $('.item').each(function(){
                                self.changeRadioBtn($(this));
                            });

                            if($('.item').length == 0){
                                $('.nothing').removeClass('hide');
                                $('.shop,.total').remove();
                            }

    	                } else {
    	                    alert("接口错误");
    	                }
    	            },
    	            error: function(xhr, type){
    	                console.log("请求失败");
    	            }
    	        })
            }
    	})
    },
    //选择、取消选择商品
    doSelect:function(){
    	var self = this,
            wholeshop = $('.select-wholeshop'),
            whole_shop_len = wholeshop.length,
            gray_whole_len = $('.select-wholeshop.gray').length,
            _this;

        //已下架的商品添加gray类名
        $('.select-one.gray').parent('.item').addClass('gray')
            .parent('.shop').addClass('gray');

        $('.shop').each(function(){
            var goods_len = $(this).find('.select-one').length,
                gray_one_len = $(this).find('.select-one.gray').length;

            //当所有商品下架时，店铺不可选
            if(goods_len == gray_one_len){
                $(this).find('.select-wholeshop').addClass('gray')
                    .attr('src','/app/images/icon_notoptional.png');
            }
        })

        if(whole_shop_len == gray_whole_len){
            $('.select-all img').addClass('gray')
                .attr('src','/app/images/icon_notoptional.png');
        }



    	$('.item').on('tap','.select-one',function(){
    		//选择、取消单个商品
            _this = $(this);
            if(!_this.hasClass('gray')){
        		if(_this.hasClass('active-one')){
        			_this.removeClass('active-one').attr('src','/app/images/icon_buy_chioce_ont@2x.png')
                        .parent('.item').not('.gray').removeClass('active')
                        .parents('.shop').not('.gray');
                }else{
        			_this.addClass('active-one').attr('src','/app/images/icon_buy_selected@2x.png')
                        .parent('.item').not('.gray').addClass('active')
                        .parents('.shop').not('.gray').addClass('active');
                }

        		//当所有商品被选中时，店铺被选中
        		var goods_len = $(this).parents('.shop').find('.select-one').not('.gray').length,
        			active_one_len = $(this).parents('.shop').find('.select-one.active-one').not('.gray').length,
        			wholeshop = $(this).parents('.shop').find('.select-wholeshop').not('.gray');
    			
                if(goods_len == active_one_len){
        			wholeshop.addClass('active')
        				.attr('src','/app/images/icon_buy_selected@2x.png');
                    $('.select').not('.gray').addClass('active-all');
        		}else{
        			wholeshop.removeClass('active')
        				.attr('src','/app/images/icon_buy_chioce_ont@2x.png');
                    $('.select').not('.gray').removeClass('active-all');
        		}

                //按商铺全选商铺中的商品时 全选按钮改变
                var whole_shop_len = $('.select-wholeshop').not('.gray').length,
                    active_len = $('.select-wholeshop.active').not('.gray').length;
                
                if(whole_shop_len == active_len){
                    $('.select-all img').not('.gray').addClass('active-all').attr('src','/app/images/icon_buy_selected@2x.png');
                    $('.select').not('.gray').addClass('active-all');
                }else{
                    $('.select-all img').not('.gray').removeClass('active-all').attr('src','/app/images/icon_buy_chioce_ont@2x.png');
                    $('.select').not('.gray').removeClass('active-all');
                }
            }

            //总价
            self.totalPrice();

    	});


    	//选择商铺，全选该商铺商品
		$('.shop').on('tap','.select-wholeshop',function(){
            _this = $(this);
            if(!_this.hasClass('gray')){
    			if(_this.hasClass('active')){
    				_this.removeClass('active')
    					.attr('src','/app/images/icon_buy_chioce_ont@2x.png')
    					.parents('.shop').removeClass('active')
    					.find('.select-one').not('.gray')
    					.removeClass('active-one')
    					.attr('src','/app/images/icon_buy_chioce_ont@2x.png');
                    $(this).parents('.shop').find('.item').not('.gray').removeClass('active');
    			}else{
    				_this.addClass('active')
    					.attr('src','/app/images/icon_buy_selected@2x.png')
    					.parents('.shop').addClass('active')
    					.find('.select-one').not('.gray')
    					.addClass('active-one')
    					.attr('src','/app/images/icon_buy_selected@2x.png');
                    $(this).parents('.shop').find('.item').not('.gray').addClass('active');
    			}
            
                //按商铺全选商铺中的商品时 全选按钮改变
                var whole_shop_len = $('.select-wholeshop').not('.gray').length,
                    active_len = $('.select-wholeshop.active').not('.gray').length;
                    
                if(whole_shop_len == active_len){
                    $('.select-all img').not('.gray').attr('src','/app/images/icon_buy_selected@2x.png');
                    $('.select').not('.gray').addClass('active-all');
                }else{
                    $('.select-all img').not('.gray').attr('src','/app/images/icon_buy_chioce_ont@2x.png');
                    $('.select').not('.gray').removeClass('active-all');
                }
            }

            //总价
            self.totalPrice();
		})

        //全选购物车中得商品
        $('.select-all .select').on('tap',function(){
            if(!$(this).hasClass('gray')){
                if($(this).hasClass('active-all')){
                    $('.select').not('.gray').removeClass('active-all')
                        .attr('src','/app/images/icon_buy_chioce_ont@2x.png');

                    $('.item').not('.gray').removeClass('active').find('.select-one').removeClass('active-one');
                    $('.shop').not('.gray').removeClass('active').removeClass('active-all');
                }else{
                    $('.select').not('.gray').addClass('active-all')
                        .attr('src','/app/images/icon_buy_selected@2x.png');
                    $('.item').not('.gray').addClass('active').find('.select-one').addClass('active-one');
                    $('.shop').not('.gray').addClass('active').addClass('active-all');
                }
            }
            //总价
            self.totalPrice();
        })
    },
    changeRadioBtn: function(item){
        var goods_len = item.parents('.shop').find('.select-one').length,
            gray_one_len = item.parents('.shop').find('.select-one.gray').length,
            wholeshop = $('.select-wholeshop'),
            whole_shop_len = wholeshop.length,
            gray_whole_len = $('.select-wholeshop.gray').length;

        //当所有商品下架时，店铺不可选
        if(goods_len == gray_one_len){
            item.parents('.shop').find('.select-wholeshop').addClass('gray')
                .attr('src','/app/images/icon_notoptional.png');
        }

        if(whole_shop_len == gray_whole_len){
            $('.select-all img').addClass('gray')
                .attr('src','/app/images/icon_notoptional.png');
        }
    },
    //清空购物车
    doClean: function(url,source,version,key){
        var self = this;
    	$('.clean').on('tap',function(){
    		var _this = $(this),
    			cartId = _this.parents('.item').attr('data-cartId'),
    			goodsId = _this.parents('.item').attr('data-goodsId'),
    			soureId = _this.parents('.item').attr('data-soureId'),
    			base64_data = base64_encode.encoder('{"cart_id":cartId,"source_id":soureId,"goodsId":goodsId}'),
                token = self.settings.token,
                app_uid = self.settings.app_uid,
                method = self.settings.cleanCartMethod;
            if(confirm("确定要清空购物车吗？")){
        		$.ajax({
    	            type: 'post',
    	            url: url,
    	            data: {
    	                source: source,
    	                version: version,
    	                method: method,
    	                token: self.settings.token,
    	                app_uid: self.settings.app_uid,
    	                sign:md5(source+version+method+token+app_uid+key)
    	            },
    	            dataType: 'json',
    	            success: function(result){
    	                console.log(result);
    	                if (result.response.msg === "success") {
    	                    // alert('清空购物车成功')
                            Common.setDialog("清空购物车成功");
    	                    $('.nothing').removeClassnothing('hide');
    	                    $('.shop,.total').remove();
    	                } else {
    	                    alert("接口错误");
    	                }
    	            },
    	            error: function(xhr, type){
    	                console.log("请求失败");
    	            }
    	        })
            }
    	})
    },
    initRadioBtn: function(item){
        if(item.attr('data-on_sale') == '0' || item.attr('data-productnumber') == '0'){
            item.find('.select-one').addClass('gray').attr('src','/app/images/icon_notoptional.png')
        }
    },
    initSubtractAdd: function(item){
        var goodsnum = parseInt(item.find('.goodsnum').text()),  //要购买的数量
            purchase_num = parseInt(item.attr('data-purchase_num')), //最大限购数
            min_purchase_num = parseInt(item.attr('data-min_purchase_num')),//最小限购数
            productnumber = parseInt(item.attr('data-productnumber')); //库存
            
        $('.choice-size-color .subtract,.choice-size-color .add').removeClass('gray');
        if(purchase_num != '0'){
            if (goodsnum >= Math.min(purchase_num,productnumber)) { //超出最大限购
                item.find('.edit.num .goodsnum').text(Math.min(purchase_num,productnumber));
                item.find('.add').addClass('gray');
            }
        }else{
            item.find('.edit.num .goodsnum').text(goodsnum);
        }
        
        if(min_purchase_num != '0'){
            if (goodsnum == min_purchase_num) {
                item.find('.subtract').addClass('gray'); 
            }
        }else{
            if (goodsnum == 1) {
                item.find('.subtract').addClass('gray'); 
            }
        }
    },
    totalPrice: function(){
        var get_price,
            num,
            price,
            totalprice = 0;
        $('.item.active').each(function(){
            get_price = $(this).find('.price').text();
            num = $(this).find('.goodsnum').text();
            if(isNaN(get_price.substr(0,1))){
                price = parseFloat(get_price.substr(1));
            }else{
                price = parseFloat(get_price);
            }
            totalprice += num * price;
        })
        $('.total-price').text('￥'+Math.round(totalprice*100)/100);
    },
    toBuy: function(){
        var self = this,
            par = self.settings.par;
        $('.tobuy').on('tap',function(){
            if($('.item.active').not('.gray').length > 0){
                var good_data = '',
                    shop = $('.shop.active'),
                    items = '',
                    token = self.settings.token,
                    app_uid = self.settings.app_uid,
                    shop_len = $('.shop.active').not('.gray').length;

                if($('.shop.active.is_overseas').length > 0 && $('.shop.active').length == $('.shop.active.is_overseas').length){
                    window.localStorage.setItem("overseas",'1');
                }else if($('.shop.active.is_overseas').length > 0 && $('.shop.active').length != $('.shop.active.is_overseas').length){
                    window.localStorage.setItem("overseas",'1');
                    window.localStorage.setItem("overseas2",'2');
                }else{
                    window.localStorage.setItem("overseas",'0');
                }
                
                for(var j=0;j<shop_len;j++){
                    var businessId = shop.eq(j).attr('data-businessid'),
                        item = shop.eq(j).find('.item.active').not('.gray'),
                        goods = '';
                    for(var i=0;i<item.length;i++){
                        var cartId = item.eq(i).attr('data-cartid'),
                            from = JSON.stringify(item.eq(i).attr('data-from') || null),
                            // from = null,
                            source_id = item.eq(i).attr('data-soureid'),
                            product_id = item.eq(i).attr('data-productid'),
                            goods_number = item.eq(i).find('.goodsnum').text(),
                            goods_price = item.eq(i).find('.price').text().substr(1);
                        
                        goods += '{"cartId":'+cartId+',"from":'+from+',"source_id":'+source_id+',"product_id":'+product_id+',"goods_number":'+goods_number+',"goods_price": "' + goods_price + '"}';
                        if(i != item.length-1){
                            goods += ',';
                        }
                    }       
                    if(goods){           
                        items += '{"businessId":'+businessId+',"goods":['+goods+']}';
                    }
                    if(j != shop_len-1){
                        items += ',';
                    }
                }
                
                good_data = '{"items":['+items+']}';

                // localStorage.setItem("good-data",good_data);
                // console.log(good_data);
                window.location.href = '/app/templates/order.html?from=cart&'+$.param(par)+'&good_data='+encodeURIComponent(good_data);
            }else{
                // alert('请选择商品');
                Common.setDialog("请选择商品");
            }
        })
    }
}
CART.init();
