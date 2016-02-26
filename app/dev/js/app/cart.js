/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	__webpack_require__(1);
	
	var _h5_base = __webpack_require__(2);
	
	var _h5_base2 = _interopRequireDefault(_h5_base);
	
	var _base64 = __webpack_require__(7);
	
	var _base642 = _interopRequireDefault(_base64);
	
	var _md5 = __webpack_require__(8);
	
	var _md52 = _interopRequireDefault(_md5);
	
	var _version = __webpack_require__(4);
	
	var _version2 = _interopRequireDefault(_version);
	
	var _cookie = __webpack_require__(5);
	
	var _cookie2 = _interopRequireDefault(_cookie);
	
	var _common = __webpack_require__(6);
	
	var _common2 = _interopRequireDefault(_common);
	
	var CART = {
	    settings: {
	        login_state: _cookie2['default'].get('login_state'),
	        token: _cookie2['default'].get('token') || window.localStorage.getItem("token"),
	        app_uid: _cookie2['default'].get('app_uid') || window.localStorage.getItem("app_uid"),
	        source: _version2['default'].source,
	        version: _version2['default'].version,
	        key: _version2['default'].key,
	        getDataUrl: '/hichao/interface.php',
	        getDataMethod: 'goods.cart.get',
	        doRemoveOneMethod: 'goods.cart.remove',
	        cleanCartMethod: 'goods.cart.clean',
	        source_id: _h5_base2['default'].lang.getUrlParam('source_id') || window.localStorage.getItem("source_id"),
	        main_image: _h5_base2['default'].lang.getUrlParam('main_image') || window.localStorage.getItem("main_image"),
	        business_id: _h5_base2['default'].lang.getUrlParam('business_id') || window.localStorage.getItem("business_id"),
	        tab_index: _h5_base2['default'].lang.getUrlParam('tab_index'),
	        sort: _h5_base2['default'].lang.getUrlParam('sort') || '',
	        par: {
	            source_id: _h5_base2['default'].lang.getUrlParam('source_id') || '',
	            main_image: _h5_base2['default'].lang.getUrlParam('main_image') || '',
	            business_id: _h5_base2['default'].lang.getUrlParam('business_id') || '',
	            tab_index: _h5_base2['default'].lang.getUrlParam('tab_index') || '',
	            sort: _h5_base2['default'].lang.getUrlParam('sort') || ''
	        }
	    },
	    init: function init() {
	        var self = this,
	            par = self.settings.par;
	
	        _h5_base2['default'].lang.adapt();
	        _common2['default'].init();
	        self.getData();
	
	        window.localStorage.removeItem("overseas2");
	        // alert(document.cookie)
	        $('.get_coupon,.bac-mask').height($(window).height());
	        $('.return').attr('href', '/app/templates/good_detail.html?' + $.param(par));
	
	        //单个获取优惠券
	        $('.get_coupon').on('tap', '.to_get', function () {
	            if ($(this).not('.finish')) {
	                var item = $(this).parent('.tag'),
	                    promote_ids = item.attr('data-promote_id'),
	                    promote_type = item.attr('data-promote_type');
	                self.getCoupon(item, promote_ids, promote_type);
	            }
	        });
	
	        //一键获取
	        $('.get_coupon').on('tap', '.ascertain', function () {
	            if (!$(this).hasClass('gray')) {
	                var item = $('.get_coupon .con .tag'),
	                    promote_ids = '';
	                for (var i = 0; i < item.length; i++) {
	                    var promote_id = item.eq(i).attr('data-promote_id'),
	                        promote_type = item.eq(i).attr('data-promote_type');
	                    promote_ids += promote_id;
	                    if (i != item.length - 1) {
	                        promote_ids += ',';
	                    }
	                }
	                self.getCoupon(item, promote_ids, promote_type);
	            }
	        });
	    },
	    getData: function getData() {
	        var self = this,
	            par = self.settings.par,
	            url = self.settings.getDataUrl,
	            source = self.settings.source,
	            version = self.settings.version,
	            key = self.settings.key,
	            method = self.settings.getDataMethod,
	            token = self.settings.token,
	            app_uid = self.settings.app_uid;
	        if (token) {
	            $.ajax({
	                type: 'get',
	                url: url,
	                data: {
	                    source: source,
	                    version: version,
	                    method: method,
	                    token: token,
	                    app_uid: app_uid,
	                    sign: _md52['default'](source + version + method + token + app_uid + key)
	                },
	                dataType: 'json',
	                success: function success(result) {
	                    console.log(result);
	                    if (result.response.msg === "success") {
	                        var data = result.response.data,
	                            cart = data.cart,
	                            goods_len = 0;
	                        self.doHtml(data);
	                        self.doEditFinish();
	                        self.doAddSubtract();
	                        self.doRemoveOne(url, source, version, key);
	                        self.doClean(url, source, version, key);
	                        self.doSelect();
	                        self.toBuy();
	                        $('.item').each(function () {
	                            self.changeRadioBtn($(this));
	                        });
	                    } else {
	                        alert("接口错误");
	                    }
	                },
	                error: function error(xhr, type) {
	                    alert("请求失败");
	                }
	            });
	        } else {
	            window.location.href = '/app/templates/login.html?from=cart&' + $.param(par);
	        }
	    },
	    doHtml: function doHtml(data) {
	        var self = this,
	            token = self.settings.token,
	            par = self.settings.par,
	            cart = data.cart;
	        if (token) {
	            if (cart.length > 0) {
	                for (var i = 0; i < cart.length; i++) {
	                    var businessId = cart[i].businessId,
	                        businessName = cart[i].businessName,
	                        is_overseas = cart[i].is_overseas,
	                        country_img = cart[i].country.country_img,
	                        goods = cart[i].goods,
	                        promote = cart[i].promote,
	                        special_class,
	                        shopHtml = '',
	                        promoteHtml = '';
	
	                    if (is_overseas == 1) {
	                        special_class = 'is_overseas';
	                    } else {
	                        special_class = '';
	                    }
	                    shopHtml += '<div class="shop ' + special_class + '" data-businessid="' + businessId + '"><div class="name">';
	                    shopHtml += '<div class="shop_title"><img class="select select-wholeshop" src="/app/images/icon_buy_chioce_ont@2x.png">';
	                    shopHtml += '<p class="tit"><img src="' + country_img + '" alt="" />';
	                    if (is_overseas == 1) {
	                        shopHtml += '<img class="logistics" src="/app/images/icon_purchasing@2x.png" alt="" />';
	                    }
	                    shopHtml += '<a href="/app/templates/brand_detail.html?id=' + businessId + '">' + businessName + '</a></p></div>';
	                    shopHtml += '<span class="editbtn">编辑</span>';
	                    shopHtml += '</div><ul class="privilege"></ul></div>';
	                    $('#cart').append(shopHtml);
	
	                    //商品
	                    for (var j = 0; j < goods.length; j++) {
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
	                            min_purchase_num = parseInt(goods[j].min_purchase_num) ? parseInt(goods[j].min_purchase_num) : 0,
	                            //最小限购数
	                        purchase_num = parseInt(goods[j].purchase_num) ? parseInt(goods[j].purchase_num) : 0,
	                            //限购数
	                        itemHtml = '',
	                            final_num;
	
	                        if (purchase_num != 0 && (goodsNumber >= purchase_num || goodsNumber >= productNumber)) {
	                            //最大限购 / 库存
	                            final_num = Math.min(purchase_num, productNumber);
	                        } else {
	                            final_num = goodsNumber; //商品数
	                        }
	
	                        console.log(purchase_num, productNumber, goodsNumber, final_num);
	
	                        itemHtml += "<div class='item' data-on_sale='" + on_sale + "' data-productNumber='" + productNumber + "' data-min_purchase_num='" + min_purchase_num + "'  data-purchase_num='" + purchase_num + "' data-from='" + from + "' data-productId='" + productId + "' data-goodsNumber='" + goodsNumber + "' data-cartId='" + cart_id + "' data-goodsId='" + goodsId + "' data-soureId='" + goodsSoureId + "'><img class='select select-one' src='/app/images/icon_buy_chioce_ont@2x.png'>";
	                        itemHtml += '<dl><dt><img src="' + goodsImage + '">';
	                        if (on_sale == '0') {
	                            //已下架
	                            itemHtml += '<p class="sold_out">已下架</p>';
	                        }
	                        if (productNumber == '0') {
	                            itemHtml += '<p class="sold_out">已售罄</p>';
	                        }
	                        itemHtml += '</dt><dd class="edit hide num"><p><span class="subtract"></span><span class="goodsnum">' + final_num + '</span><span class="add"></span></p>';
	                        itemHtml += '<p>' + goodsAttr + '</p></dd>';
	                        itemHtml += '<dd class="edit hide removebtn">删除</dd>';
	                        itemHtml += '<dd class="finish info"><p><a href="/app/templates/good_detail.html?source_id=' + goodsSoureId + '&main_image=1&business_id=' + businessId + '">' + goodsName + '</a></p>';
	                        itemHtml += '<p class="attr">' + goodsAttr + '</p>';
	                        itemHtml += '<p class="price">￥' + goodsShopPrice + '</p></dd>';
	                        itemHtml += '<dd class="finish goodsnum"><p>x<span class="num">' + goodsNumber + '</span></p></dd></dl></div>';
	                        $('.shop').eq(i).append(itemHtml);
	
	                        //初始化加减号
	                        $('.item').each(function () {
	                            self.initSubtractAdd($(this));
	                            self.initRadioBtn($(this));
	                        });
	                    }
	
	                    //优惠券 满减
	                    if (promote.length > 0) {
	                        var reachHtml = '',
	                            couponHtml = '',
	                            num = 0,
	                            len = 0;
	                        for (var j = 0; j < promote.length; j++) {
	                            var promote_id = promote[j].promote_id,
	                                promote_minus_price = promote[j].promote_minus_price,
	                                //优惠劵面值
	                            promote_name = promote[j].promote_name,
	                                //使用优惠劵或补贴的名称
	                            promote_reach_price = promote[j].promote_reach_price,
	                                //使用优惠劵需要满足的金额
	                            promote_type = promote[j].promote_type,
	                                //使用优惠劵或补贴的类型
	                            promote_minus_price = promote[j].promote_minus_price,
	                                promote_remain_store = promote[j].promote_remain_store ? promote[j].promote_remain_store : '',
	                                //优惠券剩余数量
	                            promote_value = promote[j].promote_value,
	                                //优惠劵面值
	                            promote_is_received = promote[j].promote_is_received ? promote[j].promote_is_received : 1,
	                                //值为1 表示已领取
	                            promote_is_used = promote[j].promote_is_used; //
	
	                            if (promote_type === 'promote_reach') {
	                                num++;
	                                reachHtml += '<span class="tag" data-promote_type="' + promote_type + '" data-promote_id="' + promote_id + '">满' + promote_reach_price + '减' + promote_value + '</span>';
	                            } else if (promote_type === 'promote_coupon' || promote_type === 'promote_special') {
	                                len++;
	                                couponHtml += '<p class="tag" data-promote_is_received="' + promote_is_received + '" data-promote_is_used="' + promote_is_used + '" data-promote_type="' + promote_type + '" data-promote_remain_store="' + promote_remain_store + '" data-promote_minus_price="' + promote_minus_price + '" data-promote_id="' + promote_id + '"><span class="tit">';
	
	                                if (promote_reach_price != 0) {
	                                    couponHtml += '满' + promote_reach_price + '减' + promote_value + '</span>';
	                                } else {
	                                    couponHtml += promote_value + '元优惠券</span>';
	                                }
	
	                                if (promote_remain_store != 0 && promote_is_received == 0 && promote_is_used == 0) {
	                                    couponHtml += '<span class="btn to_get">领取</span>';
	                                } else if (promote_is_received == 1 && promote_is_used == 0) {
	                                    couponHtml += '<span class="btn finish">已领取</span>';
	                                } else if (promote_is_used == 1) {
	                                    couponHtml += '<span class="btn finish">已使用</span>';
	                                } else if (promote_remain_store == 0) {
	                                    couponHtml += '<span class="btn bare">已抢光</span>';
	                                }
	                                couponHtml += '</p>';
	                            } else if (promote_type === 'promote_subsidies') {
	                                promoteHtml += '<li class="promote_special" data-promote_id="' + promote_id + '" data-type="' + promote_type + '" data-minus_price="' + promote_minus_price + '" data-remain_store="' + promote_remain_store + '">';
	                                promoteHtml += '<span class="tit">红包补贴</span>本商品享受明星衣橱补贴' + promote_value + '元</li>';
	                            }
	                        }
	                        if (num > 0) {
	                            promoteHtml += '<li class="promote_reach">';
	                            promoteHtml += '<span class="tit">满减</span><div class="promotes">' + reachHtml + '</div></li>';
	                        }
	                        if (len > 0) {
	                            promoteHtml += '<li class="promote_coupon">';
	                            promoteHtml += '<span class="tit">领券</span><div class="coupon_tit">共' + len + '种优惠券，点击进入领取</div><div class="promotes hide">' + couponHtml + '</div></li>';
	                        }
	                        $('.shop').eq(i).find('.privilege').append(promoteHtml);
	                    } else {
	                        $('.shop').eq(i).find('.privilege').addClass('hide');
	                    }
	
	                    $('.promote_coupon').on('tap', function () {
	                        self.showCouponBox($(this));
	                    });
	                }
	            } else {
	                $('.nothing').removeClass('hide');
	                $('.total').addClass('hide');
	            }
	        } else {
	            window.location.href = '/app/templates/login.html?from=good_detail&' + $.param(par);
	        }
	    },
	    showCouponBox: function showCouponBox(item) {
	        var self = this,
	            promotes = item.find('.promotes').html(),
	            shop_name = item.parents('.shop').find('.name .tit a').text();
	
	        $('#cart').height('500px').css('overflowY', 'hidden');
	        $('.shop_name').text(shop_name);
	        $('.get_coupon').removeClass('hide').find('.con').html(promotes);
	
	        self.initCouponBox();
	
	        $('.close').on('tap', function () {
	            $('#cart').removeAttr('style');
	            $('.get_coupon').addClass('hide');
	        });
	    },
	    initCouponBox: function initCouponBox() {
	
	        $('.msg').addClass('hide');
	        //初始化优惠券按钮
	        if ($('.coupon_box .tag').length > 0) {
	            $('.coupon_box .tag').each(function () {
	                if ($(this).attr('data-promote_is_received') == 1) {
	                    $(this).find('.btn').addClass('finish').removeClass('to_get').text('已领取');
	                }
	            });
	        }
	
	        //初始化一键领取按钮
	        if ($('.coupon_box .btn').not('.to_get').length == $('.coupon_box .tag').length) {
	            $('.ascertain').addClass('gray');
	        } else {
	            $('.ascertain').removeClass('gray');
	        }
	    },
	    getCoupon: function getCoupon(item, promote_ids, promote_type) {
	        var self = this,
	            url = self.settings.getDataUrl,
	            token = self.settings.token,
	            app_uid = self.settings.app_uid,
	            base64_data = _base642['default'].encoder('{"promote_ids":"' + promote_ids + '","promote_type":"' + promote_type + '","mxyc_token":"' + token + '"}') || '',
	            source = _version2['default'].source,
	            version = _version2['default'].version,
	            key = _version2['default'].key,
	            method = 'goods.promote.coupon',
	            par = self.settings.par;
	        if (token) {
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
	                    sign: _md52['default'](source + version + method + token + app_uid + base64_data + key)
	                },
	                dataType: 'json',
	                success: function success(result) {
	                    console.log(result);
	                    if (result.response.msg === "success") {
	                        self.initCouponBox();
	                        $('.get_coupon .msg').removeClass('hide').text('领取成功');
	                        item.find('.btn').removeClass('to_get').addClass('finish').text('已领取').parent('.tag').attr('data-promote_is_received', '1');
	
	                        $('.promotes .tag').each(function () {
	                            if (promote_ids.indexOf($(this).attr('data-promote_id')) >= 0) {
	                                $(this).attr('data-promote_is_received', '1');
	                            }
	                        });
	
	                        //Common.setDialog('优惠券领取成功，请到我的优惠券查看');
	                    } else if (result.response.code == '1') {
	                            _common2['default'].setDialog(result.response.msg);
	                        }
	                },
	                error: function error(xhr, type) {
	                    alert("请求失败");
	                }
	            });
	        } else {
	            window.location.href = '/app/templates/login.html?from=good_detail&' + $.param(par);
	        }
	    },
	    //编辑、完成按钮
	    doEditFinish: function doEditFinish() {
	        var self = this;
	        $('.shop .editbtn').on('tap', function () {
	
	            $('.item').each(function () {
	                $(this).find('.finish .num').text($(this).find('.edit .goodsnum').text());
	            });
	
	            if ($(this).hasClass('active')) {
	                $(this).removeClass('active').text('编辑');
	                $(this).parent().siblings().find('dd.edit').addClass('hide').siblings('.finish').removeClass('hide');
	                var item = $(this).parents('.shop').find('.item');
	                item.each(function () {
	                    self.cartAdd($(this));
	                });
	            } else {
	                $(this).addClass('active').text('完成');
	                $(this).parent().siblings().find('dd.edit').removeClass('hide').siblings('.finish').addClass('hide');
	            }
	            //总价
	            self.totalPrice();
	        });
	    },
	    //修改商品数量
	    cartAdd: function cartAdd(item) {
	        var self = this,
	            url = '/hichao/interface.php',
	            data = '',
	            sourceId = item.attr('data-soureid'),
	            productId = item.attr('data-productId'),
	            from = item.attr('data-from') || '',
	            goodsNumber = item.find('.goodsnum .num').text();
	        data += '{"sourceId":"' + sourceId + '","productId":"' + productId + '","from":' + from + ',"goodsNumber":"' + goodsNumber + '","type":"update"}';
	
	        var base64_data = _base642['default'].encoder(data),
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
	                sign: _md52['default'](source + version + method + token + app_uid + base64_data + key)
	            },
	            dataType: 'json',
	            success: function success(result) {
	                window.console.log(result);
	                if (result.response.msg === "success") {
	                    // Common.setDialog('已添加到购物车');
	                } else {
	                        _common2['default'].setDialog(result.response.msg);
	                    }
	            },
	            error: function error() {
	                alert("请求失败");
	            }
	        });
	    },
	    //增减商品数量
	    doAddSubtract: function doAddSubtract() {
	        var self = this,
	            item,
	            goodsnum,
	            //要购买的数量
	        productNumber,
	            //库存
	        purchase_num,
	            //最大限购
	        min_purchase_num; //最小限购
	        $('.subtract').on('tap', function () {
	            item = $(this).parents('.item');
	            goodsnum = parseInt($(this).next('.goodsnum').text()), min_purchase_num = parseInt(item.attr('data-min_purchase_num'));
	            if (!$(this).hasClass('gray')) {
	                $(this).next('.goodsnum').text(parseInt(goodsnum) - 1);
	                item.find('.add').removeClass('gray');
	                if (min_purchase_num != '0') {
	                    if ($(this).next('.goodsnum').text() == min_purchase_num) {
	                        $(this).addClass('gray');
	                    }
	                }
	                if ($(this).next('.goodsnum').text() == 1) {
	                    $(this).addClass('gray');
	                }
	            }
	            self.totalPrice();
	        });
	        $('.add').on('tap', function () {
	            item = $(this).parents('.item');
	            goodsnum = parseInt($(this).prev('.goodsnum').text());
	            productNumber = parseInt(item.attr('data-productNumber'));
	            purchase_num = parseInt(item.attr('data-purchase_num')); //限购
	
	            if (!$(this).hasClass('gray')) {
	                $(this).prev('.goodsnum').text(parseInt(goodsnum) + 1);
	                item.find('.subtract').removeClass('gray');
	
	                if (purchase_num != '0') {
	                    console.log(Math.min(purchase_num, productNumber));
	                    if ($(this).prev('.goodsnum').text() == Math.min(purchase_num, productNumber)) {
	                        //限购 库存中的最小值
	                        $(this).addClass('gray');
	                    }
	                } else {
	                    if (productNumber == $(this).prev('.goodsnum').text()) {
	                        //库存
	                        $(this).addClass('gray');
	                    }
	                }
	            }
	            self.totalPrice();
	        });
	    },
	    //删除单个商品
	    doRemoveOne: function doRemoveOne(url, source, version, key) {
	        var self = this;
	        $('.removebtn').on('tap', function () {
	            console.log('sadadad');
	            var _this = $(this),
	                cartId = _this.parents('.item').attr('data-cartId'),
	                goodsId = _this.parents('.item').attr('data-goodsId'),
	                soureId = _this.parents('.item').attr('data-soureId'),
	                base64_data = _base642['default'].encoder('{"cartId":' + cartId + '}'),
	                token = self.settings.token,
	                app_uid = self.settings.app_uid,
	                method = self.settings.doRemoveOneMethod;
	            if (confirm("确定要删除该商品吗？")) {
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
	                        sign: _md52['default'](source + version + method + token + app_uid + base64_data + key)
	                    },
	                    dataType: 'json',
	                    success: function success(result) {
	                        if (result.response.msg === "success") {
	
	                            if (_this.parents('.shop').find('.item').length == 1) {
	                                _this.parents('.shop').remove();
	                            } else {
	                                _this.parents('.item').remove();
	                            }
	
	                            // $('.dialog').text('删除成功!').css('display','block');
	                            // setTimeout(function(){
	                            //     $('.dialog').css('display','none');
	                            // },3000);
	
	                            self.totalPrice();
	
	                            $('.item').each(function () {
	                                self.changeRadioBtn($(this));
	                            });
	
	                            if ($('.item').length == 0) {
	                                $('.nothing').removeClass('hide');
	                                $('.shop,.total').remove();
	                            }
	                        } else {
	                            alert("接口错误");
	                        }
	                    },
	                    error: function error(xhr, type) {
	                        alert("请求失败");
	                    }
	                });
	            }
	        });
	    },
	    //选择、取消选择商品
	    doSelect: function doSelect() {
	        var self = this,
	            wholeshop = $('.select-wholeshop'),
	            whole_shop_len = wholeshop.length,
	            gray_whole_len = $('.select-wholeshop.gray').length,
	            _this;
	
	        //已下架的商品添加gray类名
	        $('.select-one.gray').parent('.item').addClass('gray').parent('.shop').addClass('gray');
	
	        $('.shop').each(function () {
	            var goods_len = $(this).find('.select-one').length,
	                gray_one_len = $(this).find('.select-one.gray').length;
	
	            //当所有商品下架时，店铺不可选
	            if (goods_len == gray_one_len) {
	                $(this).find('.select-wholeshop').addClass('gray').attr('src', '/app/images/icon_notoptional.png');
	            }
	        });
	
	        if (whole_shop_len == gray_whole_len) {
	            $('.select-all img').addClass('gray').attr('src', '/app/images/icon_notoptional.png');
	        }
	
	        $('.item').on('tap', '.select-one', function () {
	            //选择、取消单个商品
	            _this = $(this);
	            if (!_this.hasClass('gray')) {
	                if (_this.hasClass('active-one')) {
	                    _this.removeClass('active-one').attr('src', '/app/images/icon_buy_chioce_ont@2x.png').parent('.item').not('.gray').removeClass('active').parents('.shop').not('.gray');
	                } else {
	                    _this.addClass('active-one').attr('src', '/app/images/icon_buy_selected@2x.png').parent('.item').not('.gray').addClass('active').parents('.shop').not('.gray').addClass('active');
	                }
	
	                //当所有商品被选中时，店铺被选中
	                var goods_len = $(this).parents('.shop').find('.select-one').not('.gray').length,
	                    active_one_len = $(this).parents('.shop').find('.select-one.active-one').not('.gray').length,
	                    wholeshop = $(this).parents('.shop').find('.select-wholeshop').not('.gray');
	
	                if (goods_len == active_one_len) {
	                    wholeshop.addClass('active').attr('src', '/app/images/icon_buy_selected@2x.png');
	                    $('.select').not('.gray').addClass('active-all');
	                } else {
	                    wholeshop.removeClass('active').attr('src', '/app/images/icon_buy_chioce_ont@2x.png');
	                    $('.select').not('.gray').removeClass('active-all');
	                }
	
	                //按商铺全选商铺中的商品时 全选按钮改变
	                var whole_shop_len = $('.select-wholeshop').not('.gray').length,
	                    active_len = $('.select-wholeshop.active').not('.gray').length;
	
	                if (whole_shop_len == active_len) {
	                    $('.select-all img').not('.gray').addClass('active-all').attr('src', '/app/images/icon_buy_selected@2x.png');
	                    $('.select').not('.gray').addClass('active-all');
	                } else {
	                    $('.select-all img').not('.gray').removeClass('active-all').attr('src', '/app/images/icon_buy_chioce_ont@2x.png');
	                    $('.select').not('.gray').removeClass('active-all');
	                }
	            }
	
	            //总价
	            self.totalPrice();
	        });
	
	        //选择商铺，全选该商铺商品
	        $('.shop').on('tap', '.select-wholeshop', function () {
	            _this = $(this);
	            if (!_this.hasClass('gray')) {
	                if (_this.hasClass('active')) {
	                    _this.removeClass('active').attr('src', '/app/images/icon_buy_chioce_ont@2x.png').parents('.shop').not('.gray').removeClass('active').find('.select-one').not('.gray').removeClass('active-one').attr('src', '/app/images/icon_buy_chioce_ont@2x.png');
	                    $(this).parents('.shop').find('.item').not('.gray').removeClass('active');
	                } else {
	                    _this.addClass('active').attr('src', '/app/images/icon_buy_selected@2x.png').parents('.shop').not('.gray').addClass('active').find('.select-one').not('.gray').addClass('active-one').attr('src', '/app/images/icon_buy_selected@2x.png');
	                    $(this).parents('.shop').find('.item').not('.gray').addClass('active');
	                }
	
	                //按商铺全选商铺中的商品时 全选按钮改变
	                var whole_shop_len = $('.select-wholeshop').not('.gray').length,
	                    active_len = $('.select-wholeshop.active').not('.gray').length;
	
	                if (whole_shop_len == active_len) {
	                    $('.select-all img').not('.gray').attr('src', '/app/images/icon_buy_selected@2x.png');
	                    $('.select').not('.gray').addClass('active-all');
	                } else {
	                    $('.select-all img').not('.gray').attr('src', '/app/images/icon_buy_chioce_ont@2x.png');
	                    $('.select').not('.gray').removeClass('active-all');
	                }
	            }
	
	            //总价
	            self.totalPrice();
	        });
	
	        //全选购物车中得商品
	        $('.select-all .select').on('tap', function () {
	            if (!$(this).hasClass('gray')) {
	                if ($(this).hasClass('active-all')) {
	                    $('.select').not('.gray').removeClass('active-all').attr('src', '/app/images/icon_buy_chioce_ont@2x.png');
	
	                    $('.item').not('.gray').removeClass('active').find('.select-one').removeClass('active-one');
	                    $('.shop').not('.gray').removeClass('active').removeClass('active-all');
	                } else {
	                    $('.select').not('.gray').addClass('active-all').attr('src', '/app/images/icon_buy_selected@2x.png');
	                    $('.item').not('.gray').addClass('active').find('.select-one').addClass('active-one');
	                    $('.shop').not('.gray').addClass('active').addClass('active-all');
	                }
	            }
	            //总价
	            self.totalPrice();
	        });
	    },
	    changeRadioBtn: function changeRadioBtn(item) {
	        var goods_len = item.parents('.shop').find('.select-one').length,
	            gray_one_len = item.parents('.shop').find('.select-one.gray').length,
	            wholeshop = $('.select-wholeshop'),
	            whole_shop_len = wholeshop.length,
	            gray_whole_len = $('.select-wholeshop.gray').length;
	
	        //当所有商品下架时，店铺不可选
	        if (goods_len == gray_one_len) {
	            item.parents('.shop').find('.select-wholeshop').addClass('gray').attr('src', '/app/images/icon_notoptional.png');
	        }
	
	        if (whole_shop_len == gray_whole_len) {
	            $('.select-all img').addClass('gray').attr('src', '/app/images/icon_notoptional.png');
	        }
	    },
	    //清空购物车
	    doClean: function doClean(url, source, version, key) {
	        var self = this;
	        $('.clean').on('tap', function () {
	            var _this = $(this),
	                cartId = _this.parents('.item').attr('data-cartId'),
	                goodsId = _this.parents('.item').attr('data-goodsId'),
	                soureId = _this.parents('.item').attr('data-soureId'),
	                base64_data = _base642['default'].encoder('{"cart_id":cartId,"source_id":soureId,"goodsId":goodsId}'),
	                token = self.settings.token,
	                app_uid = self.settings.app_uid,
	                method = self.settings.cleanCartMethod;
	            if (confirm("确定要清空购物车吗？")) {
	                $.ajax({
	                    type: 'post',
	                    url: url,
	                    data: {
	                        source: source,
	                        version: version,
	                        method: method,
	                        token: self.settings.token,
	                        app_uid: self.settings.app_uid,
	                        sign: _md52['default'](source + version + method + token + app_uid + key)
	                    },
	                    dataType: 'json',
	                    success: function success(result) {
	                        console.log(result);
	                        if (result.response.msg === "success") {
	                            // alert('清空购物车成功')
	                            _common2['default'].setDialog("清空购物车成功");
	                            $('.nothing').removeClassnothing('hide');
	                            $('.shop,.total').remove();
	                        } else {
	                            alert("接口错误");
	                        }
	                    },
	                    error: function error(xhr, type) {
	                        alert("请求失败");
	                    }
	                });
	            }
	        });
	    },
	    initRadioBtn: function initRadioBtn(item) {
	        if (item.attr('data-on_sale') == '0' || item.attr('data-productnumber') == '0') {
	            item.find('.select-one').addClass('gray').attr('src', '/app/images/icon_notoptional.png');
	        }
	    },
	    initSubtractAdd: function initSubtractAdd(item) {
	        var goodsnum = parseInt(item.find('.goodsnum').text()),
	            //要购买的数量
	        purchase_num = parseInt(item.attr('data-purchase_num')),
	            //最大限购数
	        min_purchase_num = parseInt(item.attr('data-min_purchase_num')),
	            //最小限购数
	        productnumber = parseInt(item.attr('data-productnumber')); //库存
	
	        $('.choice-size-color .subtract,.choice-size-color .add').removeClass('gray');
	        if (purchase_num != '0') {
	            if (goodsnum >= Math.min(purchase_num, productnumber)) {
	                //超出最大限购
	                item.find('.edit.num .goodsnum').text(Math.min(purchase_num, productnumber));
	                item.find('.add').addClass('gray');
	            }
	        } else {
	            item.find('.edit.num .goodsnum').text(goodsnum);
	        }
	
	        if (min_purchase_num != '0') {
	            if (goodsnum == min_purchase_num) {
	                item.find('.subtract').addClass('gray');
	            }
	        } else {
	            if (goodsnum == 1) {
	                item.find('.subtract').addClass('gray');
	            }
	        }
	    },
	    totalPrice: function totalPrice() {
	        var get_price,
	            num,
	            price,
	            totalprice = 0;
	        $('.item.active').each(function () {
	            get_price = $(this).find('.price').text();
	            num = $(this).find('.goodsnum').text();
	            if (isNaN(get_price.substr(0, 1))) {
	                price = parseFloat(get_price.substr(1));
	            } else {
	                price = parseFloat(get_price);
	            }
	            totalprice += num * price;
	        });
	        $('.total-price').text('￥' + Math.round(totalprice * 100) / 100);
	    },
	    toBuy: function toBuy() {
	        var self = this,
	            par = self.settings.par;
	        $('.tobuy').on('tap', function () {
	            if ($('.item.active').not('.gray').length > 0) {
	                var good_data = '',
	                    shop = $('.shop.active'),
	                    items = '',
	                    token = self.settings.token,
	                    app_uid = self.settings.app_uid,
	                    shop_len = $('.shop.active').not('.gray').length;
	
	                if ($('.shop.active.is_overseas').length > 0 && $('.shop.active').length == $('.shop.active.is_overseas').length) {
	                    window.localStorage.setItem("overseas", '1');
	                } else if ($('.shop.active.is_overseas').length > 0 && $('.shop.active').length != $('.shop.active.is_overseas').length) {
	                    window.localStorage.setItem("overseas", '1');
	                    window.localStorage.setItem("overseas2", '2');
	                } else {
	                    window.localStorage.setItem("overseas", '0');
	                }
	
	                for (var j = 0; j < shop_len; j++) {
	                    var businessId = shop.eq(j).attr('data-businessid'),
	                        item = shop.eq(j).find('.item.active').not('.gray'),
	                        goods = '';
	                    for (var i = 0; i < item.length; i++) {
	                        var cartId = item.eq(i).attr('data-cartid'),
	                            from = item.eq(i).attr('data-from') || null,
	                            source_id = item.eq(i).attr('data-soureid'),
	                            product_id = item.eq(i).attr('data-productid'),
	                            goods_number = item.eq(i).find('.goodsnum').text(),
	                            goods_price = item.eq(i).find('.price').text().substr(1);
	                        goods += '{"cartId":' + cartId + ',"from":' + from + ',"source_id":' + source_id + ',"product_id":' + product_id + ',"goods_number":' + goods_number + ',"goods_price": "' + goods_price + '"}';
	                        if (i != item.length - 1) {
	                            goods += ',';
	                        }
	                    }
	                    if (goods) {
	                        items += '{"businessId":' + businessId + ',"goods":[' + goods + ']}';
	                    }
	                    if (j != shop_len - 1) {
	                        items += ',';
	                    }
	                }
	
	                good_data = '{"items":[' + items + ']}';
	
	                // localStorage.setItem("good-data",good_data);
	                // console.log(good_data);
	                window.location.href = '/app/templates/order.html?from=cart&' + $.param(par) + '&good_data=' + encodeURIComponent(good_data);
	            } else {
	                // alert('请选择商品');
	                _common2['default'].setDialog("请选择商品");
	            }
	        });
	    }
	};
	CART.init();

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	var Zepto = (function () {
	  function L(t) {
	    return null == t ? String(t) : j[S.call(t)] || "object";
	  }function A(t) {
	    return "function" == L(t);
	  }function Z(t) {
	    return null != t && t == t.window;
	  }function $(t) {
	    return null != t && t.nodeType == t.DOCUMENT_NODE;
	  }function R(t) {
	    return "object" == L(t);
	  }function k(t) {
	    return R(t) && !Z(t) && Object.getPrototypeOf(t) == Object.prototype;
	  }function z(t) {
	    return "number" == typeof t.length;
	  }function F(t) {
	    return a.call(t, function (t) {
	      return null != t;
	    });
	  }function _(t) {
	    return t.length > 0 ? n.fn.concat.apply([], t) : t;
	  }function I(t) {
	    return t.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase();
	  }function q(t) {
	    return t in c ? c[t] : c[t] = new RegExp("(^|\\s)" + t + "(\\s|$)");
	  }function H(t, e) {
	    return "number" != typeof e || l[I(t)] ? e : e + "px";
	  }function U(t) {
	    var e, n;return f[t] || (e = u.createElement(t), u.body.appendChild(e), n = getComputedStyle(e, "").getPropertyValue("display"), e.parentNode.removeChild(e), "none" == n && (n = "block"), f[t] = n), f[t];
	  }function X(t) {
	    return "children" in t ? s.call(t.children) : n.map(t.childNodes, function (t) {
	      return 1 == t.nodeType ? t : void 0;
	    });
	  }function V(t, e) {
	    var n,
	        i = t ? t.length : 0;for (n = 0; i > n; n++) this[n] = t[n];this.length = i, this.selector = e || "";
	  }function B(n, i, r) {
	    for (e in i) r && (k(i[e]) || D(i[e])) ? (k(i[e]) && !k(n[e]) && (n[e] = {}), D(i[e]) && !D(n[e]) && (n[e] = []), B(n[e], i[e], r)) : i[e] !== t && (n[e] = i[e]);
	  }function Y(t, e) {
	    return null == e ? n(t) : n(t).filter(e);
	  }function J(t, e, n, i) {
	    return A(e) ? e.call(t, n, i) : e;
	  }function W(t, e, n) {
	    null == n ? t.removeAttribute(e) : t.setAttribute(e, n);
	  }function G(e, n) {
	    var i = e.className || "",
	        r = i && i.baseVal !== t;return n === t ? r ? i.baseVal : i : void (r ? i.baseVal = n : e.className = n);
	  }function K(t) {
	    try {
	      return t ? "true" == t || ("false" == t ? !1 : "null" == t ? null : +t + "" == t ? +t : /^[\[\{]/.test(t) ? n.parseJSON(t) : t) : t;
	    } catch (e) {
	      return t;
	    }
	  }function Q(t, e) {
	    e(t);for (var n = 0, i = t.childNodes.length; i > n; n++) Q(t.childNodes[n], e);
	  }var t,
	      e,
	      n,
	      i,
	      P,
	      N,
	      r = [],
	      o = r.concat,
	      a = r.filter,
	      s = r.slice,
	      u = window.document,
	      f = {},
	      c = {},
	      l = { "column-count": 1, columns: 1, "font-weight": 1, "line-height": 1, opacity: 1, "z-index": 1, zoom: 1 },
	      h = /^\s*<(\w+|!)[^>]*>/,
	      p = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
	      d = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	      m = /^(?:body|html)$/i,
	      g = /([A-Z])/g,
	      v = ["val", "css", "html", "text", "data", "width", "height", "offset"],
	      y = ["after", "prepend", "before", "append"],
	      w = u.createElement("table"),
	      x = u.createElement("tr"),
	      b = { tr: u.createElement("tbody"), tbody: w, thead: w, tfoot: w, td: x, th: x, "*": u.createElement("div") },
	      E = /complete|loaded|interactive/,
	      T = /^[\w-]*$/,
	      j = {},
	      S = j.toString,
	      C = {},
	      O = u.createElement("div"),
	      M = { tabindex: "tabIndex", readonly: "readOnly", "for": "htmlFor", "class": "className", maxlength: "maxLength", cellspacing: "cellSpacing", cellpadding: "cellPadding", rowspan: "rowSpan", colspan: "colSpan", usemap: "useMap", frameborder: "frameBorder", contenteditable: "contentEditable" },
	      D = Array.isArray || function (t) {
	    return t instanceof Array;
	  };return C.matches = function (t, e) {
	    if (!e || !t || 1 !== t.nodeType) return !1;var n = t.webkitMatchesSelector || t.mozMatchesSelector || t.oMatchesSelector || t.matchesSelector;if (n) return n.call(t, e);var i,
	        r = t.parentNode,
	        o = !r;return o && (r = O).appendChild(t), i = ~C.qsa(r, e).indexOf(t), o && O.removeChild(t), i;
	  }, P = function (t) {
	    return t.replace(/-+(.)?/g, function (t, e) {
	      return e ? e.toUpperCase() : "";
	    });
	  }, N = function (t) {
	    return a.call(t, function (e, n) {
	      return t.indexOf(e) == n;
	    });
	  }, C.fragment = function (e, i, r) {
	    var o, a, f;return p.test(e) && (o = n(u.createElement(RegExp.$1))), o || (e.replace && (e = e.replace(d, "<$1></$2>")), i === t && (i = h.test(e) && RegExp.$1), i in b || (i = "*"), f = b[i], f.innerHTML = "" + e, o = n.each(s.call(f.childNodes), function () {
	      f.removeChild(this);
	    })), k(r) && (a = n(o), n.each(r, function (t, e) {
	      v.indexOf(t) > -1 ? a[t](e) : a.attr(t, e);
	    })), o;
	  }, C.Z = function (t, e) {
	    return new V(t, e);
	  }, C.isZ = function (t) {
	    return t instanceof C.Z;
	  }, C.init = function (e, i) {
	    var r;if (!e) return C.Z();if ("string" == typeof e) if ((e = e.trim(), "<" == e[0] && h.test(e))) r = C.fragment(e, RegExp.$1, i), e = null;else {
	      if (i !== t) return n(i).find(e);r = C.qsa(u, e);
	    } else {
	      if (A(e)) return n(u).ready(e);if (C.isZ(e)) return e;if (D(e)) r = F(e);else if (R(e)) r = [e], e = null;else if (h.test(e)) r = C.fragment(e.trim(), RegExp.$1, i), e = null;else {
	        if (i !== t) return n(i).find(e);r = C.qsa(u, e);
	      }
	    }return C.Z(r, e);
	  }, n = function (t, e) {
	    return C.init(t, e);
	  }, n.extend = function (t) {
	    var e,
	        n = s.call(arguments, 1);return "boolean" == typeof t && (e = t, t = n.shift()), n.forEach(function (n) {
	      B(t, n, e);
	    }), t;
	  }, C.qsa = function (t, e) {
	    var n,
	        i = "#" == e[0],
	        r = !i && "." == e[0],
	        o = i || r ? e.slice(1) : e,
	        a = T.test(o);return t.getElementById && a && i ? (n = t.getElementById(o)) ? [n] : [] : 1 !== t.nodeType && 9 !== t.nodeType && 11 !== t.nodeType ? [] : s.call(a && !i && t.getElementsByClassName ? r ? t.getElementsByClassName(o) : t.getElementsByTagName(e) : t.querySelectorAll(e));
	  }, n.contains = u.documentElement.contains ? function (t, e) {
	    return t !== e && t.contains(e);
	  } : function (t, e) {
	    for (; e && (e = e.parentNode);) if (e === t) return !0;return !1;
	  }, n.type = L, n.isFunction = A, n.isWindow = Z, n.isArray = D, n.isPlainObject = k, n.isEmptyObject = function (t) {
	    var e;for (e in t) return !1;return !0;
	  }, n.inArray = function (t, e, n) {
	    return r.indexOf.call(e, t, n);
	  }, n.camelCase = P, n.trim = function (t) {
	    return null == t ? "" : String.prototype.trim.call(t);
	  }, n.uuid = 0, n.support = {}, n.expr = {}, n.noop = function () {}, n.map = function (t, e) {
	    var n,
	        r,
	        o,
	        i = [];if (z(t)) for (r = 0; r < t.length; r++) n = e(t[r], r), null != n && i.push(n);else for (o in t) n = e(t[o], o), null != n && i.push(n);return _(i);
	  }, n.each = function (t, e) {
	    var n, i;if (z(t)) {
	      for (n = 0; n < t.length; n++) if (e.call(t[n], n, t[n]) === !1) return t;
	    } else for (i in t) if (e.call(t[i], i, t[i]) === !1) return t;return t;
	  }, n.grep = function (t, e) {
	    return a.call(t, e);
	  }, window.JSON && (n.parseJSON = JSON.parse), n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (t, e) {
	    j["[object " + e + "]"] = e.toLowerCase();
	  }), n.fn = { constructor: C.Z, length: 0, forEach: r.forEach, reduce: r.reduce, push: r.push, sort: r.sort, splice: r.splice, indexOf: r.indexOf, concat: function concat() {
	      var t,
	          e,
	          n = [];for (t = 0; t < arguments.length; t++) e = arguments[t], n[t] = C.isZ(e) ? e.toArray() : e;return o.apply(C.isZ(this) ? this.toArray() : this, n);
	    }, map: function map(t) {
	      return n(n.map(this, function (e, n) {
	        return t.call(e, n, e);
	      }));
	    }, slice: function slice() {
	      return n(s.apply(this, arguments));
	    }, ready: function ready(t) {
	      return E.test(u.readyState) && u.body ? t(n) : u.addEventListener("DOMContentLoaded", function () {
	        t(n);
	      }, !1), this;
	    }, get: function get(e) {
	      return e === t ? s.call(this) : this[e >= 0 ? e : e + this.length];
	    }, toArray: function toArray() {
	      return this.get();
	    }, size: function size() {
	      return this.length;
	    }, remove: function remove() {
	      return this.each(function () {
	        null != this.parentNode && this.parentNode.removeChild(this);
	      });
	    }, each: function each(t) {
	      return r.every.call(this, function (e, n) {
	        return t.call(e, n, e) !== !1;
	      }), this;
	    }, filter: function filter(t) {
	      return A(t) ? this.not(this.not(t)) : n(a.call(this, function (e) {
	        return C.matches(e, t);
	      }));
	    }, add: function add(t, e) {
	      return n(N(this.concat(n(t, e))));
	    }, is: function is(t) {
	      return this.length > 0 && C.matches(this[0], t);
	    }, not: function not(e) {
	      var i = [];if (A(e) && e.call !== t) this.each(function (t) {
	        e.call(this, t) || i.push(this);
	      });else {
	        var r = "string" == typeof e ? this.filter(e) : z(e) && A(e.item) ? s.call(e) : n(e);this.forEach(function (t) {
	          r.indexOf(t) < 0 && i.push(t);
	        });
	      }return n(i);
	    }, has: function has(t) {
	      return this.filter(function () {
	        return R(t) ? n.contains(this, t) : n(this).find(t).size();
	      });
	    }, eq: function eq(t) {
	      return -1 === t ? this.slice(t) : this.slice(t, +t + 1);
	    }, first: function first() {
	      var t = this[0];return t && !R(t) ? t : n(t);
	    }, last: function last() {
	      var t = this[this.length - 1];return t && !R(t) ? t : n(t);
	    }, find: function find(t) {
	      var e,
	          i = this;return e = t ? "object" == typeof t ? n(t).filter(function () {
	        var t = this;return r.some.call(i, function (e) {
	          return n.contains(e, t);
	        });
	      }) : 1 == this.length ? n(C.qsa(this[0], t)) : this.map(function () {
	        return C.qsa(this, t);
	      }) : n();
	    }, closest: function closest(t, e) {
	      var i = this[0],
	          r = !1;for ("object" == typeof t && (r = n(t)); i && !(r ? r.indexOf(i) >= 0 : C.matches(i, t));) i = i !== e && !$(i) && i.parentNode;return n(i);
	    }, parents: function parents(t) {
	      for (var e = [], i = this; i.length > 0;) i = n.map(i, function (t) {
	        return (t = t.parentNode) && !$(t) && e.indexOf(t) < 0 ? (e.push(t), t) : void 0;
	      });return Y(e, t);
	    }, parent: function parent(t) {
	      return Y(N(this.pluck("parentNode")), t);
	    }, children: function children(t) {
	      return Y(this.map(function () {
	        return X(this);
	      }), t);
	    }, contents: function contents() {
	      return this.map(function () {
	        return this.contentDocument || s.call(this.childNodes);
	      });
	    }, siblings: function siblings(t) {
	      return Y(this.map(function (t, e) {
	        return a.call(X(e.parentNode), function (t) {
	          return t !== e;
	        });
	      }), t);
	    }, empty: function empty() {
	      return this.each(function () {
	        this.innerHTML = "";
	      });
	    }, pluck: function pluck(t) {
	      return n.map(this, function (e) {
	        return e[t];
	      });
	    }, show: function show() {
	      return this.each(function () {
	        "none" == this.style.display && (this.style.display = ""), "none" == getComputedStyle(this, "").getPropertyValue("display") && (this.style.display = U(this.nodeName));
	      });
	    }, replaceWith: function replaceWith(t) {
	      return this.before(t).remove();
	    }, wrap: function wrap(t) {
	      var e = A(t);if (this[0] && !e) var i = n(t).get(0),
	          r = i.parentNode || this.length > 1;return this.each(function (o) {
	        n(this).wrapAll(e ? t.call(this, o) : r ? i.cloneNode(!0) : i);
	      });
	    }, wrapAll: function wrapAll(t) {
	      if (this[0]) {
	        n(this[0]).before(t = n(t));for (var e; (e = t.children()).length;) t = e.first();n(t).append(this);
	      }return this;
	    }, wrapInner: function wrapInner(t) {
	      var e = A(t);return this.each(function (i) {
	        var r = n(this),
	            o = r.contents(),
	            a = e ? t.call(this, i) : t;o.length ? o.wrapAll(a) : r.append(a);
	      });
	    }, unwrap: function unwrap() {
	      return this.parent().each(function () {
	        n(this).replaceWith(n(this).children());
	      }), this;
	    }, clone: function clone() {
	      return this.map(function () {
	        return this.cloneNode(!0);
	      });
	    }, hide: function hide() {
	      return this.css("display", "none");
	    }, toggle: function toggle(e) {
	      return this.each(function () {
	        var i = n(this);(e === t ? "none" == i.css("display") : e) ? i.show() : i.hide();
	      });
	    }, prev: function prev(t) {
	      return n(this.pluck("previousElementSibling")).filter(t || "*");
	    }, next: function next(t) {
	      return n(this.pluck("nextElementSibling")).filter(t || "*");
	    }, html: function html(t) {
	      return 0 in arguments ? this.each(function (e) {
	        var i = this.innerHTML;n(this).empty().append(J(this, t, e, i));
	      }) : 0 in this ? this[0].innerHTML : null;
	    }, text: function text(t) {
	      return 0 in arguments ? this.each(function (e) {
	        var n = J(this, t, e, this.textContent);this.textContent = null == n ? "" : "" + n;
	      }) : 0 in this ? this[0].textContent : null;
	    }, attr: function attr(n, i) {
	      var r;return "string" != typeof n || 1 in arguments ? this.each(function (t) {
	        if (1 === this.nodeType) if (R(n)) for (e in n) W(this, e, n[e]);else W(this, n, J(this, i, t, this.getAttribute(n)));
	      }) : this.length && 1 === this[0].nodeType ? !(r = this[0].getAttribute(n)) && n in this[0] ? this[0][n] : r : t;
	    }, removeAttr: function removeAttr(t) {
	      return this.each(function () {
	        1 === this.nodeType && t.split(" ").forEach(function (t) {
	          W(this, t);
	        }, this);
	      });
	    }, prop: function prop(t, e) {
	      return t = M[t] || t, 1 in arguments ? this.each(function (n) {
	        this[t] = J(this, e, n, this[t]);
	      }) : this[0] && this[0][t];
	    }, data: function data(e, n) {
	      var i = "data-" + e.replace(g, "-$1").toLowerCase(),
	          r = 1 in arguments ? this.attr(i, n) : this.attr(i);return null !== r ? K(r) : t;
	    }, val: function val(t) {
	      return 0 in arguments ? this.each(function (e) {
	        this.value = J(this, t, e, this.value);
	      }) : this[0] && (this[0].multiple ? n(this[0]).find("option").filter(function () {
	        return this.selected;
	      }).pluck("value") : this[0].value);
	    }, offset: function offset(t) {
	      if (t) return this.each(function (e) {
	        var i = n(this),
	            r = J(this, t, e, i.offset()),
	            o = i.offsetParent().offset(),
	            a = { top: r.top - o.top, left: r.left - o.left };"static" == i.css("position") && (a.position = "relative"), i.css(a);
	      });if (!this.length) return null;var e = this[0].getBoundingClientRect();return { left: e.left + window.pageXOffset, top: e.top + window.pageYOffset, width: Math.round(e.width), height: Math.round(e.height) };
	    }, css: function css(t, i) {
	      if (arguments.length < 2) {
	        var r,
	            o = this[0];if (!o) return;if ((r = getComputedStyle(o, ""), "string" == typeof t)) return o.style[P(t)] || r.getPropertyValue(t);if (D(t)) {
	          var a = {};return n.each(t, function (t, e) {
	            a[e] = o.style[P(e)] || r.getPropertyValue(e);
	          }), a;
	        }
	      }var s = "";if ("string" == L(t)) i || 0 === i ? s = I(t) + ":" + H(t, i) : this.each(function () {
	        this.style.removeProperty(I(t));
	      });else for (e in t) t[e] || 0 === t[e] ? s += I(e) + ":" + H(e, t[e]) + ";" : this.each(function () {
	        this.style.removeProperty(I(e));
	      });return this.each(function () {
	        this.style.cssText += ";" + s;
	      });
	    }, index: function index(t) {
	      return t ? this.indexOf(n(t)[0]) : this.parent().children().indexOf(this[0]);
	    }, hasClass: function hasClass(t) {
	      return t ? r.some.call(this, function (t) {
	        return this.test(G(t));
	      }, q(t)) : !1;
	    }, addClass: function addClass(t) {
	      return t ? this.each(function (e) {
	        if ("className" in this) {
	          i = [];var r = G(this),
	              o = J(this, t, e, r);o.split(/\s+/g).forEach(function (t) {
	            n(this).hasClass(t) || i.push(t);
	          }, this), i.length && G(this, r + (r ? " " : "") + i.join(" "));
	        }
	      }) : this;
	    }, removeClass: function removeClass(e) {
	      return this.each(function (n) {
	        if ("className" in this) {
	          if (e === t) return G(this, "");i = G(this), J(this, e, n, i).split(/\s+/g).forEach(function (t) {
	            i = i.replace(q(t), " ");
	          }), G(this, i.trim());
	        }
	      });
	    }, toggleClass: function toggleClass(e, i) {
	      return e ? this.each(function (r) {
	        var o = n(this),
	            a = J(this, e, r, G(this));a.split(/\s+/g).forEach(function (e) {
	          (i === t ? !o.hasClass(e) : i) ? o.addClass(e) : o.removeClass(e);
	        });
	      }) : this;
	    }, scrollTop: function scrollTop(e) {
	      if (this.length) {
	        var n = ("scrollTop" in this[0]);return e === t ? n ? this[0].scrollTop : this[0].pageYOffset : this.each(n ? function () {
	          this.scrollTop = e;
	        } : function () {
	          this.scrollTo(this.scrollX, e);
	        });
	      }
	    }, scrollLeft: function scrollLeft(e) {
	      if (this.length) {
	        var n = ("scrollLeft" in this[0]);return e === t ? n ? this[0].scrollLeft : this[0].pageXOffset : this.each(n ? function () {
	          this.scrollLeft = e;
	        } : function () {
	          this.scrollTo(e, this.scrollY);
	        });
	      }
	    }, position: function position() {
	      if (this.length) {
	        var t = this[0],
	            e = this.offsetParent(),
	            i = this.offset(),
	            r = m.test(e[0].nodeName) ? { top: 0, left: 0 } : e.offset();return i.top -= parseFloat(n(t).css("margin-top")) || 0, i.left -= parseFloat(n(t).css("margin-left")) || 0, r.top += parseFloat(n(e[0]).css("border-top-width")) || 0, r.left += parseFloat(n(e[0]).css("border-left-width")) || 0, { top: i.top - r.top, left: i.left - r.left };
	      }
	    }, offsetParent: function offsetParent() {
	      return this.map(function () {
	        for (var t = this.offsetParent || u.body; t && !m.test(t.nodeName) && "static" == n(t).css("position");) t = t.offsetParent;return t;
	      });
	    } }, n.fn.detach = n.fn.remove, ["width", "height"].forEach(function (e) {
	    var i = e.replace(/./, function (t) {
	      return t[0].toUpperCase();
	    });n.fn[e] = function (r) {
	      var o,
	          a = this[0];return r === t ? Z(a) ? a["inner" + i] : $(a) ? a.documentElement["scroll" + i] : (o = this.offset()) && o[e] : this.each(function (t) {
	        a = n(this), a.css(e, J(this, r, t, a[e]()));
	      });
	    };
	  }), y.forEach(function (t, e) {
	    var i = e % 2;n.fn[t] = function () {
	      var t,
	          o,
	          r = n.map(arguments, function (e) {
	        return t = L(e), "object" == t || "array" == t || null == e ? e : C.fragment(e);
	      }),
	          a = this.length > 1;return r.length < 1 ? this : this.each(function (t, s) {
	        o = i ? s : s.parentNode, s = 0 == e ? s.nextSibling : 1 == e ? s.firstChild : 2 == e ? s : null;var f = n.contains(u.documentElement, o);r.forEach(function (t) {
	          if (a) t = t.cloneNode(!0);else if (!o) return n(t).remove();o.insertBefore(t, s), f && Q(t, function (t) {
	            null == t.nodeName || "SCRIPT" !== t.nodeName.toUpperCase() || t.type && "text/javascript" !== t.type || t.src || window.eval.call(window, t.innerHTML);
	          });
	        });
	      });
	    }, n.fn[i ? t + "To" : "insert" + (e ? "Before" : "After")] = function (e) {
	      return n(e)[t](this), this;
	    };
	  }), C.Z.prototype = V.prototype = n.fn, C.uniq = N, C.deserializeValue = K, n.zepto = C, n;
	})();window.Zepto = Zepto, void 0 === window.$ && (window.$ = Zepto), (function (t) {
	  function l(t) {
	    return t._zid || (t._zid = e++);
	  }function h(t, e, n, i) {
	    if ((e = p(e), e.ns)) var r = d(e.ns);return (a[l(t)] || []).filter(function (t) {
	      return !(!t || e.e && t.e != e.e || e.ns && !r.test(t.ns) || n && l(t.fn) !== l(n) || i && t.sel != i);
	    });
	  }function p(t) {
	    var e = ("" + t).split(".");return { e: e[0], ns: e.slice(1).sort().join(" ") };
	  }function d(t) {
	    return new RegExp("(?:^| )" + t.replace(" ", " .* ?") + "(?: |$)");
	  }function m(t, e) {
	    return t.del && !u && t.e in f || !!e;
	  }function g(t) {
	    return c[t] || u && f[t] || t;
	  }function v(e, i, r, o, s, u, f) {
	    var h = l(e),
	        d = a[h] || (a[h] = []);i.split(/\s/).forEach(function (i) {
	      if ("ready" == i) return t(document).ready(r);var a = p(i);a.fn = r, a.sel = s, a.e in c && (r = function (e) {
	        var n = e.relatedTarget;return !n || n !== this && !t.contains(this, n) ? a.fn.apply(this, arguments) : void 0;
	      }), a.del = u;var l = u || r;a.proxy = function (t) {
	        if ((t = T(t), !t.isImmediatePropagationStopped())) {
	          t.data = o;var i = l.apply(e, t._args == n ? [t] : [t].concat(t._args));return i === !1 && (t.preventDefault(), t.stopPropagation()), i;
	        }
	      }, a.i = d.length, d.push(a), "addEventListener" in e && e.addEventListener(g(a.e), a.proxy, m(a, f));
	    });
	  }function y(t, e, n, i, r) {
	    var o = l(t);(e || "").split(/\s/).forEach(function (e) {
	      h(t, e, n, i).forEach(function (e) {
	        delete a[o][e.i], "removeEventListener" in t && t.removeEventListener(g(e.e), e.proxy, m(e, r));
	      });
	    });
	  }function T(e, i) {
	    return (i || !e.isDefaultPrevented) && (i || (i = e), t.each(E, function (t, n) {
	      var r = i[t];e[t] = function () {
	        return this[n] = w, r && r.apply(i, arguments);
	      }, e[n] = x;
	    }), (i.defaultPrevented !== n ? i.defaultPrevented : "returnValue" in i ? i.returnValue === !1 : i.getPreventDefault && i.getPreventDefault()) && (e.isDefaultPrevented = w)), e;
	  }function j(t) {
	    var e,
	        i = { originalEvent: t };for (e in t) b.test(e) || t[e] === n || (i[e] = t[e]);return T(i, t);
	  }var n,
	      e = 1,
	      i = Array.prototype.slice,
	      r = t.isFunction,
	      o = function o(t) {
	    return "string" == typeof t;
	  },
	      a = {},
	      s = {},
	      u = ("onfocusin" in window),
	      f = { focus: "focusin", blur: "focusout" },
	      c = { mouseenter: "mouseover", mouseleave: "mouseout" };s.click = s.mousedown = s.mouseup = s.mousemove = "MouseEvents", t.event = { add: v, remove: y }, t.proxy = function (e, n) {
	    var a = 2 in arguments && i.call(arguments, 2);if (r(e)) {
	      var s = function s() {
	        return e.apply(n, a ? a.concat(i.call(arguments)) : arguments);
	      };return s._zid = l(e), s;
	    }if (o(n)) return a ? (a.unshift(e[n], e), t.proxy.apply(null, a)) : t.proxy(e[n], e);throw new TypeError("expected function");
	  }, t.fn.bind = function (t, e, n) {
	    return this.on(t, e, n);
	  }, t.fn.unbind = function (t, e) {
	    return this.off(t, e);
	  }, t.fn.one = function (t, e, n, i) {
	    return this.on(t, e, n, i, 1);
	  };var w = function w() {
	    return !0;
	  },
	      x = function x() {
	    return !1;
	  },
	      b = /^([A-Z]|returnValue$|layer[XY]$)/,
	      E = { preventDefault: "isDefaultPrevented", stopImmediatePropagation: "isImmediatePropagationStopped", stopPropagation: "isPropagationStopped" };t.fn.delegate = function (t, e, n) {
	    return this.on(e, t, n);
	  }, t.fn.undelegate = function (t, e, n) {
	    return this.off(e, t, n);
	  }, t.fn.live = function (e, n) {
	    return t(document.body).delegate(this.selector, e, n), this;
	  }, t.fn.die = function (e, n) {
	    return t(document.body).undelegate(this.selector, e, n), this;
	  }, t.fn.on = function (e, a, s, u, f) {
	    var c,
	        l,
	        h = this;return e && !o(e) ? (t.each(e, function (t, e) {
	      h.on(t, a, s, e, f);
	    }), h) : (o(a) || r(u) || u === !1 || (u = s, s = a, a = n), (u === n || s === !1) && (u = s, s = n), u === !1 && (u = x), h.each(function (n, r) {
	      f && (c = function (t) {
	        return y(r, t.type, u), u.apply(this, arguments);
	      }), a && (l = function (e) {
	        var n,
	            o = t(e.target).closest(a, r).get(0);return o && o !== r ? (n = t.extend(j(e), { currentTarget: o, liveFired: r }), (c || u).apply(o, [n].concat(i.call(arguments, 1)))) : void 0;
	      }), v(r, e, u, s, a, l || c);
	    }));
	  }, t.fn.off = function (e, i, a) {
	    var s = this;return e && !o(e) ? (t.each(e, function (t, e) {
	      s.off(t, i, e);
	    }), s) : (o(i) || r(a) || a === !1 || (a = i, i = n), a === !1 && (a = x), s.each(function () {
	      y(this, e, a, i);
	    }));
	  }, t.fn.trigger = function (e, n) {
	    return e = o(e) || t.isPlainObject(e) ? t.Event(e) : T(e), e._args = n, this.each(function () {
	      e.type in f && "function" == typeof this[e.type] ? this[e.type]() : "dispatchEvent" in this ? this.dispatchEvent(e) : t(this).triggerHandler(e, n);
	    });
	  }, t.fn.triggerHandler = function (e, n) {
	    var i, r;return this.each(function (a, s) {
	      i = j(o(e) ? t.Event(e) : e), i._args = n, i.target = s, t.each(h(s, e.type || e), function (t, e) {
	        return r = e.proxy(i), i.isImmediatePropagationStopped() ? !1 : void 0;
	      });
	    }), r;
	  }, "focusin focusout focus blur load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function (e) {
	    t.fn[e] = function (t) {
	      return 0 in arguments ? this.bind(e, t) : this.trigger(e);
	    };
	  }), t.Event = function (t, e) {
	    o(t) || (e = t, t = e.type);var n = document.createEvent(s[t] || "Events"),
	        i = !0;if (e) for (var r in e) "bubbles" == r ? i = !!e[r] : n[r] = e[r];return n.initEvent(t, i, !0), T(n);
	  };
	})(Zepto), (function (t) {
	  t.fn.serializeArray = function () {
	    var e,
	        n,
	        i = [],
	        r = function r(t) {
	      return t.forEach ? t.forEach(r) : void i.push({ name: e, value: t });
	    };return this[0] && t.each(this[0].elements, function (i, o) {
	      n = o.type, e = o.name, e && "fieldset" != o.nodeName.toLowerCase() && !o.disabled && "submit" != n && "reset" != n && "button" != n && "file" != n && ("radio" != n && "checkbox" != n || o.checked) && r(t(o).val());
	    }), i;
	  }, t.fn.serialize = function () {
	    var t = [];return this.serializeArray().forEach(function (e) {
	      t.push(encodeURIComponent(e.name) + "=" + encodeURIComponent(e.value));
	    }), t.join("&");
	  }, t.fn.submit = function (e) {
	    if (0 in arguments) this.bind("submit", e);else if (this.length) {
	      var n = t.Event("submit");this.eq(0).trigger(n), n.isDefaultPrevented() || this.get(0).submit();
	    }return this;
	  };
	})(Zepto), (function () {
	  try {
	    getComputedStyle(void 0);
	  } catch (t) {
	    var e = getComputedStyle;window.getComputedStyle = function (t) {
	      try {
	        return e(t);
	      } catch (n) {
	        return null;
	      }
	    };
	  }
	})(), (function (t) {
	  function a(o, a) {
	    var u = o[r],
	        f = u && e[u];if (void 0 === a) return f || s(o);if (f) {
	      if (a in f) return f[a];var c = i(a);if (c in f) return f[c];
	    }return n.call(t(o), a);
	  }function s(n, o, a) {
	    var s = n[r] || (n[r] = ++t.uuid),
	        f = e[s] || (e[s] = u(n));return void 0 !== o && (f[i(o)] = a), f;
	  }function u(e) {
	    var n = {};return t.each(e.attributes || o, function (e, r) {
	      0 == r.name.indexOf("data-") && (n[i(r.name.replace("data-", ""))] = t.zepto.deserializeValue(r.value));
	    }), n;
	  }var e = {},
	      n = t.fn.data,
	      i = t.camelCase,
	      r = t.expando = "Zepto" + +new Date(),
	      o = [];t.fn.data = function (e, n) {
	    return void 0 === n ? t.isPlainObject(e) ? this.each(function (n, i) {
	      t.each(e, function (t, e) {
	        s(i, t, e);
	      });
	    }) : 0 in this ? a(this[0], e) : void 0 : this.each(function () {
	      s(this, e, n);
	    });
	  }, t.fn.removeData = function (n) {
	    return "string" == typeof n && (n = n.split(/\s+/)), this.each(function () {
	      var o = this[r],
	          a = o && e[o];a && t.each(n || a, function (t) {
	        delete a[n ? i(this) : t];
	      });
	    });
	  }, ["remove", "empty"].forEach(function (e) {
	    var n = t.fn[e];t.fn[e] = function () {
	      var t = this.find("*");return "remove" === e && (t = t.add(this)), t.removeData(), n.call(this);
	    };
	  });
	})(Zepto), (function (t) {
	  function h(e, n, i) {
	    var r = t.Event(n);return t(e).trigger(r, i), !r.isDefaultPrevented();
	  }function p(t, e, i, r) {
	    return t.global ? h(e || n, i, r) : void 0;
	  }function d(e) {
	    e.global && 0 === t.active++ && p(e, null, "ajaxStart");
	  }function m(e) {
	    e.global && ! --t.active && p(e, null, "ajaxStop");
	  }function g(t, e) {
	    var n = e.context;return e.beforeSend.call(n, t, e) === !1 || p(e, n, "ajaxBeforeSend", [t, e]) === !1 ? !1 : void p(e, n, "ajaxSend", [t, e]);
	  }function v(t, e, n, i) {
	    var r = n.context,
	        o = "success";n.success.call(r, t, o, e), i && i.resolveWith(r, [t, o, e]), p(n, r, "ajaxSuccess", [e, n, t]), w(o, e, n);
	  }function y(t, e, n, i, r) {
	    var o = i.context;i.error.call(o, n, e, t), r && r.rejectWith(o, [n, e, t]), p(i, o, "ajaxError", [n, i, t || e]), w(e, n, i);
	  }function w(t, e, n) {
	    var i = n.context;n.complete.call(i, e, t), p(n, i, "ajaxComplete", [e, n]), m(n);
	  }function x() {}function b(t) {
	    return t && (t = t.split(";", 2)[0]), t && (t == f ? "html" : t == u ? "json" : a.test(t) ? "script" : s.test(t) && "xml") || "text";
	  }function E(t, e) {
	    return "" == e ? t : (t + "&" + e).replace(/[&?]{1,2}/, "?");
	  }function T(e) {
	    e.processData && e.data && "string" != t.type(e.data) && (e.data = t.param(e.data, e.traditional)), !e.data || e.type && "GET" != e.type.toUpperCase() || (e.url = E(e.url, e.data), e.data = void 0);
	  }function j(e, n, i, r) {
	    return t.isFunction(n) && (r = i, i = n, n = void 0), t.isFunction(i) || (r = i, i = void 0), { url: e, data: n, success: i, dataType: r };
	  }function C(e, n, i, r) {
	    var o,
	        a = t.isArray(n),
	        s = t.isPlainObject(n);t.each(n, function (n, u) {
	      o = t.type(u), r && (n = i ? r : r + "[" + (s || "object" == o || "array" == o ? n : "") + "]"), !r && a ? e.add(u.name, u.value) : "array" == o || !i && "object" == o ? C(e, u, i, n) : e.add(n, u);
	    });
	  }var i,
	      r,
	      e = 0,
	      n = window.document,
	      o = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	      a = /^(?:text|application)\/javascript/i,
	      s = /^(?:text|application)\/xml/i,
	      u = "application/json",
	      f = "text/html",
	      c = /^\s*$/,
	      l = n.createElement("a");l.href = window.location.href, t.active = 0, t.ajaxJSONP = function (i, r) {
	    if (!("type" in i)) return t.ajax(i);var f,
	        h,
	        o = i.jsonpCallback,
	        a = (t.isFunction(o) ? o() : o) || "jsonp" + ++e,
	        s = n.createElement("script"),
	        u = window[a],
	        c = function c(e) {
	      t(s).triggerHandler("error", e || "abort");
	    },
	        l = { abort: c };return r && r.promise(l), t(s).on("load error", function (e, n) {
	      clearTimeout(h), t(s).off().remove(), "error" != e.type && f ? v(f[0], l, i, r) : y(null, n || "error", l, i, r), window[a] = u, f && t.isFunction(u) && u(f[0]), u = f = void 0;
	    }), g(l, i) === !1 ? (c("abort"), l) : (window[a] = function () {
	      f = arguments;
	    }, s.src = i.url.replace(/\?(.+)=\?/, "?$1=" + a), n.head.appendChild(s), i.timeout > 0 && (h = setTimeout(function () {
	      c("timeout");
	    }, i.timeout)), l);
	  }, t.ajaxSettings = { type: "GET", beforeSend: x, success: x, error: x, complete: x, context: null, global: !0, xhr: function xhr() {
	      return new window.XMLHttpRequest();
	    }, accepts: { script: "text/javascript, application/javascript, application/x-javascript", json: u, xml: "application/xml, text/xml", html: f, text: "text/plain" }, crossDomain: !1, timeout: 0, processData: !0, cache: !0 }, t.ajax = function (e) {
	    var s,
	        u,
	        o = t.extend({}, e || {}),
	        a = t.Deferred && t.Deferred();for (i in t.ajaxSettings) void 0 === o[i] && (o[i] = t.ajaxSettings[i]);d(o), o.crossDomain || (s = n.createElement("a"), s.href = o.url, s.href = s.href, o.crossDomain = l.protocol + "//" + l.host != s.protocol + "//" + s.host), o.url || (o.url = window.location.toString()), (u = o.url.indexOf("#")) > -1 && (o.url = o.url.slice(0, u)), T(o);var f = o.dataType,
	        h = /\?.+=\?/.test(o.url);if ((h && (f = "jsonp"), o.cache !== !1 && (e && e.cache === !0 || "script" != f && "jsonp" != f) || (o.url = E(o.url, "_=" + Date.now())), "jsonp" == f)) return h || (o.url = E(o.url, o.jsonp ? o.jsonp + "=?" : o.jsonp === !1 ? "" : "callback=?")), t.ajaxJSONP(o, a);var P,
	        p = o.accepts[f],
	        m = {},
	        w = function w(t, e) {
	      m[t.toLowerCase()] = [t, e];
	    },
	        j = /^([\w-]+:)\/\//.test(o.url) ? RegExp.$1 : window.location.protocol,
	        S = o.xhr(),
	        C = S.setRequestHeader;if ((a && a.promise(S), o.crossDomain || w("X-Requested-With", "XMLHttpRequest"), w("Accept", p || "*/*"), (p = o.mimeType || p) && (p.indexOf(",") > -1 && (p = p.split(",", 2)[0]), S.overrideMimeType && S.overrideMimeType(p)), (o.contentType || o.contentType !== !1 && o.data && "GET" != o.type.toUpperCase()) && w("Content-Type", o.contentType || "application/x-www-form-urlencoded"), o.headers)) for (r in o.headers) w(r, o.headers[r]);if ((S.setRequestHeader = w, S.onreadystatechange = function () {
	      if (4 == S.readyState) {
	        S.onreadystatechange = x, clearTimeout(P);var e,
	            n = !1;if (S.status >= 200 && S.status < 300 || 304 == S.status || 0 == S.status && "file:" == j) {
	          f = f || b(o.mimeType || S.getResponseHeader("content-type")), e = S.responseText;try {
	            "script" == f ? (1, eval)(e) : "xml" == f ? e = S.responseXML : "json" == f && (e = c.test(e) ? null : t.parseJSON(e));
	          } catch (i) {
	            n = i;
	          }n ? y(n, "parsererror", S, o, a) : v(e, S, o, a);
	        } else y(S.statusText || null, S.status ? "error" : "abort", S, o, a);
	      }
	    }, g(S, o) === !1)) return S.abort(), y(null, "abort", S, o, a), S;if (o.xhrFields) for (r in o.xhrFields) S[r] = o.xhrFields[r];var N = "async" in o ? o.async : !0;S.open(o.type, o.url, N, o.username, o.password);for (r in m) C.apply(S, m[r]);return o.timeout > 0 && (P = setTimeout(function () {
	      S.onreadystatechange = x, S.abort(), y(null, "timeout", S, o, a);
	    }, o.timeout)), S.send(o.data ? o.data : null), S;
	  }, t.get = function () {
	    return t.ajax(j.apply(null, arguments));
	  }, t.post = function () {
	    var e = j.apply(null, arguments);return e.type = "POST", t.ajax(e);
	  }, t.getJSON = function () {
	    var e = j.apply(null, arguments);return e.dataType = "json", t.ajax(e);
	  }, t.fn.load = function (e, n, i) {
	    if (!this.length) return this;var s,
	        r = this,
	        a = e.split(/\s/),
	        u = j(e, n, i),
	        f = u.success;return a.length > 1 && (u.url = a[0], s = a[1]), u.success = function (e) {
	      r.html(s ? t("<div>").html(e.replace(o, "")).find(s) : e), f && f.apply(r, arguments);
	    }, t.ajax(u), this;
	  };var S = encodeURIComponent;t.param = function (e, n) {
	    var i = [];return i.add = function (e, n) {
	      t.isFunction(n) && (n = n()), null == n && (n = ""), this.push(S(e) + "=" + S(n));
	    }, C(i, e, n), i.join("&").replace(/%20/g, "+");
	  };
	})(Zepto), (function (t, e) {
	  function v(t) {
	    return t.replace(/([a-z])([A-Z])/, "$1-$2").toLowerCase();
	  }function y(t) {
	    return i ? i + t : t.toLowerCase();
	  }var i,
	      s,
	      u,
	      f,
	      c,
	      l,
	      h,
	      p,
	      d,
	      m,
	      n = "",
	      r = { Webkit: "webkit", Moz: "", O: "o" },
	      o = document.createElement("div"),
	      a = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
	      g = {};t.each(r, function (t, r) {
	    return o.style[t + "TransitionProperty"] !== e ? (n = "-" + t.toLowerCase() + "-", i = r, !1) : void 0;
	  }), s = n + "transform", g[u = n + "transition-property"] = g[f = n + "transition-duration"] = g[l = n + "transition-delay"] = g[c = n + "transition-timing-function"] = g[h = n + "animation-name"] = g[p = n + "animation-duration"] = g[m = n + "animation-delay"] = g[d = n + "animation-timing-function"] = "", t.fx = { off: i === e && o.style.transitionProperty === e, speeds: { _default: 400, fast: 200, slow: 600 }, cssPrefix: n, transitionEnd: y("TransitionEnd"), animationEnd: y("AnimationEnd") }, t.fn.animate = function (n, i, r, o, a) {
	    return t.isFunction(i) && (o = i, r = e, i = e), t.isFunction(r) && (o = r, r = e), t.isPlainObject(i) && (r = i.easing, o = i.complete, a = i.delay, i = i.duration), i && (i = ("number" == typeof i ? i : t.fx.speeds[i] || t.fx.speeds._default) / 1e3), a && (a = parseFloat(a) / 1e3), this.anim(n, i, r, o, a);
	  }, t.fn.anim = function (n, i, r, o, y) {
	    var w,
	        b,
	        j,
	        x = {},
	        E = "",
	        T = this,
	        S = t.fx.transitionEnd,
	        C = !1;if ((i === e && (i = t.fx.speeds._default / 1e3), y === e && (y = 0), t.fx.off && (i = 0), "string" == typeof n)) x[h] = n, x[p] = i + "s", x[m] = y + "s", x[d] = r || "linear", S = t.fx.animationEnd;else {
	      b = [];for (w in n) a.test(w) ? E += w + "(" + n[w] + ") " : (x[w] = n[w], b.push(v(w)));E && (x[s] = E, b.push(s)), i > 0 && "object" == typeof n && (x[u] = b.join(", "), x[f] = i + "s", x[l] = y + "s", x[c] = r || "linear");
	    }return j = function (e) {
	      if ("undefined" != typeof e) {
	        if (e.target !== e.currentTarget) return;t(e.target).unbind(S, j);
	      } else t(this).unbind(S, j);C = !0, t(this).css(g), o && o.call(this);
	    }, i > 0 && (this.bind(S, j), setTimeout(function () {
	      C || j.call(T);
	    }, 1e3 * (i + y) + 25)), this.size() && this.get(0).clientLeft, this.css(x), 0 >= i && setTimeout(function () {
	      T.each(function () {
	        j.call(this);
	      });
	    }, 0), this;
	  }, o = null;
	})(Zepto), (function (t, e) {
	  function s(n, i, r, o, a) {
	    "function" != typeof i || a || (a = i, i = e);var s = { opacity: r };return o && (s.scale = o, n.css(t.fx.cssPrefix + "transform-origin", "0 0")), n.animate(s, i, null, a);
	  }function u(e, n, i, r) {
	    return s(e, n, 0, i, function () {
	      o.call(t(this)), r && r.call(this);
	    });
	  }var n = window.document,
	      r = (n.documentElement, t.fn.show),
	      o = t.fn.hide,
	      a = t.fn.toggle;t.fn.show = function (t, n) {
	    return r.call(this), t === e ? t = 0 : this.css("opacity", 0), s(this, t, 1, "1,1", n);
	  }, t.fn.hide = function (t, n) {
	    return t === e ? o.call(this) : u(this, t, "0,0", n);
	  }, t.fn.toggle = function (n, i) {
	    return n === e || "boolean" == typeof n ? a.call(this, n) : this.each(function () {
	      var e = t(this);e["none" == e.css("display") ? "show" : "hide"](n, i);
	    });
	  }, t.fn.fadeTo = function (t, e, n) {
	    return s(this, t, e, null, n);
	  }, t.fn.fadeIn = function (t, e) {
	    var n = this.css("opacity");return n > 0 ? this.css("opacity", 0) : n = 1, r.call(this).fadeTo(t, n, e);
	  }, t.fn.fadeOut = function (t, e) {
	    return u(this, t, null, e);
	  }, t.fn.fadeToggle = function (e, n) {
	    return this.each(function () {
	      var i = t(this);i[0 == i.css("opacity") || "none" == i.css("display") ? "fadeIn" : "fadeOut"](e, n);
	    });
	  };
	})(Zepto), (function (t) {
	  function u(t, e, n, i) {
	    return Math.abs(t - e) >= Math.abs(n - i) ? t - e > 0 ? "Left" : "Right" : n - i > 0 ? "Up" : "Down";
	  }function f() {
	    o = null, e.last && (e.el.trigger("longTap"), e = {});
	  }function c() {
	    o && clearTimeout(o), o = null;
	  }function l() {
	    n && clearTimeout(n), i && clearTimeout(i), r && clearTimeout(r), o && clearTimeout(o), n = i = r = o = null, e = {};
	  }function h(t) {
	    return ("touch" == t.pointerType || t.pointerType == t.MSPOINTER_TYPE_TOUCH) && t.isPrimary;
	  }function p(t, e) {
	    return t.type == "pointer" + e || t.type.toLowerCase() == "mspointer" + e;
	  }var n,
	      i,
	      r,
	      o,
	      s,
	      e = {},
	      a = 750;t(document).ready(function () {
	    var d,
	        m,
	        y,
	        w,
	        g = 0,
	        v = 0;"MSGesture" in window && (s = new MSGesture(), s.target = document.body), t(document).bind("MSGestureEnd", function (t) {
	      var n = t.velocityX > 1 ? "Right" : t.velocityX < -1 ? "Left" : t.velocityY > 1 ? "Down" : t.velocityY < -1 ? "Up" : null;n && (e.el.trigger("swipe"), e.el.trigger("swipe" + n));
	    }).on("touchstart MSPointerDown pointerdown", function (i) {
	      (!(w = p(i, "down")) || h(i)) && (y = w ? i : i.touches[0], i.touches && 1 === i.touches.length && e.x2 && (e.x2 = void 0, e.y2 = void 0), d = Date.now(), m = d - (e.last || d), e.el = t("tagName" in y.target ? y.target : y.target.parentNode), n && clearTimeout(n), e.x1 = y.pageX, e.y1 = y.pageY, m > 0 && 250 >= m && (e.isDoubleTap = !0), e.last = d, o = setTimeout(f, a), s && w && s.addPointer(i.pointerId));
	    }).on("touchmove MSPointerMove pointermove", function (t) {
	      (!(w = p(t, "move")) || h(t)) && (y = w ? t : t.touches[0], c(), e.x2 = y.pageX, e.y2 = y.pageY, g += Math.abs(e.x1 - e.x2), v += Math.abs(e.y1 - e.y2));
	    }).on("touchend MSPointerUp pointerup", function (o) {
	      (!(w = p(o, "up")) || h(o)) && (c(), e.x2 && Math.abs(e.x1 - e.x2) > 30 || e.y2 && Math.abs(e.y1 - e.y2) > 30 ? r = setTimeout(function () {
	        e.el.trigger("swipe"), e.el.trigger("swipe" + u(e.x1, e.x2, e.y1, e.y2)), e = {};
	      }, 0) : "last" in e && (30 > g && 30 > v ? i = setTimeout(function () {
	        var i = t.Event("tap");i.cancelTouch = l, e.el.trigger(i), e.isDoubleTap ? (e.el && e.el.trigger("doubleTap"), e = {}) : n = setTimeout(function () {
	          n = null, e.el && e.el.trigger("singleTap"), e = {};
	        }, 250);
	      }, 0) : e = {}), g = v = 0);
	    }).on("touchcancel MSPointerCancel pointercancel", l), t(window).on("scroll", l);
	  }), ["swipe", "swipeLeft", "swipeRight", "swipeUp", "swipeDown", "doubleTap", "tap", "singleTap", "longTap"].forEach(function (e) {
	    t.fn[e] = function (t) {
	      return this.on(e, t);
	    };
	  });
	})(Zepto);

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	
	//var Log = require('log');
	/**
	 * based on jquery
	 */
	'use strict';
	
	exports.__esModule = true;
	
	__webpack_require__(3);
	
	var BASE = { version: '1.0.0', ui: {}, lang: {}, brower: {}, regexp: {} };
	
	/**
	 * manage zindex attribute automatically
	 */
	
	BASE.lang = {
	    /**
	     * Performs `{placeholder}` substitution on a string. The object passed as the
	     * second parameter provides values to replace the `{placeholder}`s.
	     * `{placeholder}` token names must match property names of the object. For example,
	     * @example:
	     *      var greeting = HC.lang.sub("Hello, {who}!", { who: "World" });
	     *      greeting is   'Hello, World!';
	     * `{placeholder}` tokens that are undefined on the object map will be left
	     * in tact (leaving unsightly `{placeholder}`'s in the output string).
	     *
	     * @method sub
	     * @param {string} s String to be modified.
	     * @param {object} o Object containing replacement values.
	     * @return {string} the substitute result.
	     * @static
	     */
	    sub: function sub(s, o) {
	        var SUBREGEX = /\{\s*([^|}]+?)\s*(?:\|([^}]*))?\s*\}/g;
	        return s.replace ? s.replace(SUBREGEX, function (m, k) {
	            return o[k] === 'undefined' ? m : o[k];
	        }) : s;
	    },
	    /**
	     * @method getparam   get params from url
	     * @param name{string}
	     * @param url{string} url not neaded the default is current url
	     * @return {string} return the param's value what you need
	     * @static
	     */
	    getUrlParam: function getUrlParam(name, url) {
	        var search = url || document.location.search;
	        var pattern = new RegExp("[?&]" + name + "\=([^&]+)", "g");
	        var matcher = pattern.exec(search);
	        var items = null;
	        if (null != matcher) {
	            try {
	                items = decodeURIComponent(decodeURIComponent(matcher[1]));
	            } catch (error) {
	                try {
	                    items = decodeURIComponent(matcher[1]);
	                } catch (e) {
	                    items = matcher[1];
	                }
	            }
	        }
	        return items;
	    },
	    /**
	     * @method adapt   adapt all mobile and change html's font-size
	     * @static
	     */
	    adapt: function adapt() {
	        (function (doc, win) {
	            var docEl = doc.documentElement,
	                resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
	                recalc = function recalc() {
	                var clientWidth = docEl.clientWidth;
	                if (docEl.clientWidth > 750) {
	                    clientWidth = 750;
	                }
	                if (!clientWidth) {
	                    return;
	                }
	                docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
	            };
	            recalc();
	            if (!doc.addEventListener) {
	                return;
	            }
	            win.addEventListener(resizeEvt, recalc, false);
	            doc.addEventListener('DOMContentLoaded', recalc, false);
	        })(document, window);
	    },
	    /*
	     * @ method getRandom
	     * */
	    getRandom: function getRandom(name) {
	        var name_value = name || "";
	        return name_value + new Date().getTime();
	    },
	    /*
	     * @ method formatDate
	     * @ param
	     *    date ： Date/Date.getTime()
	     *    format : string
	     *    num : init
	     *  @ return string '2000-00-00 00:00:00'
	     * */
	    formatDate: function formatDate(date, format, num) {
	        if (!date) {
	            return;
	        }
	        if (!format) {
	            format = "yyyy-MM-dd";
	        }
	        switch (typeof date) {
	            case "string":
	                date = new Date(date.replace(/-/g, "/"));
	                break;
	            case "number":
	                date = new Date(date);
	                break;
	        }
	        var num_val = num || 0;
	        var newDate = date.getTime() + num_val * 60 * 60 * 24 * 1000;
	        newDate = new Date(newDate);
	        if (!(date instanceof Date)) {
	            return;
	        }
	        if (!(newDate instanceof Date)) {
	            return;
	        }
	        var dict = {
	            "yyyy": newDate.getFullYear(),
	            "M": newDate.getMonth() + 1,
	            "d": newDate.getDate(),
	            "h": newDate.getHours(),
	            "m": newDate.getMinutes(),
	            "s": newDate.getSeconds(),
	            "MM": ("" + (newDate.getMonth() + 101)).substr(1),
	            "dd": ("" + (newDate.getDate() + 100)).substr(1),
	            "hh": ("" + (newDate.getHours() + 100)).substr(1),
	            "mm": ("" + (newDate.getMinutes() + 100)).substr(1),
	            "ss": ("" + (newDate.getSeconds() + 100)).substr(1)
	        };
	        return format.replace(/(yyyy|MM?|dd?|hh?|ss?|mm?)/g, function () {
	            return dict[arguments[0]];
	        });
	    }
	};
	/*
	 * 正则
	 * */
	BASE.regexp = {
	    //手机
	    isMobile: function isMobile(t) {
	        return (/^1[34578]\d{9}$/.test(t)
	        );
	    },
	    //email
	    isEmail: function isEmail(t) {
	        return (/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(t)
	        );
	    },
	    //身份证
	    isCardId: function isCardId(t) {
	        return (/(^\d{15}$)|(^\d{17}([0-9]|X|x)$)/.test(t)
	        );
	    },
	    //密码
	    isPassWord: function isPassWord(t) {
	        return (/^(\w*(?=\w*\d)(?=\w*[A-Za-z])\w*){6,16}$/.test(t)
	        );
	    },
	    //固定电话
	    isTel: function isTel(t) {
	        return (/^(0[0-9]{2,3}-)?([2-9][0-9]{6,7})+(-[0-9]{1,4})?$/.test(t)
	        );
	    }
	};
	exports['default'] = BASE;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	var _BiTj_domain_url = "http://h5.helix.hichao.com";
	var _BiTj_domain = "hichao.com";
	var _BjTj_subChannel = ['h5'];
	var _BjTj_cookie_user = 'tj_username';
	if (typeof window._BiTj != 'undefined') {
		var _BiErrTj = window._BiErrTj || {};
		_BiErrTj = {
			_errEvent: function _errEvent() {
				try {
					var randomInt = Math.round(Math.random() * 1000000);
					var tmpTime = new Date().getTime();
					randomInt = tmpTime + randomInt;
					var cURL = document.URL;
					var a = document.createElement('img');
					var url = _BiTj_domain_url + '/err.gif?errtype=muti&url=' + encodeURIComponent(cURL) + '&pagetype=' + encodeURIComponent(pagetype_php) + '&birand=' + randomInt;
					a.src = url;
				} catch (e) {};
			}
		};
		try {
			_BiErrTj._errEvent();
		} catch (e) {};
	} else {
		var _BiTj = window._BiTj || {};
		_BiTj = {
			_tongji: function _tongji() {
				var tongji_width = document.body.clientWidth || document.documentElement.clientWidth;
				var tongji_height = document.body.clientHeight || document.documentElement.clientHeight;
				var tongji_pixel_page = 100000;
				var tongji_ds = ds_php;
				if (tongji_ds != '1' && top.location != self.location && tongji_width * tongji_height < tongji_pixel_page) {
					var bitongji_img = document.createElement('img');
					bitongji_img.src = _BiTj_domain_url + '/err.gif?width=' + tongji_width + '&height=' + tongji_height;
					bitongji_img.width = 1;
					bitongji_img.height = 1;
					bitongji_img.style.display = 'none';
					document.body.appendChild(bitongji_img);
				} else {
					var log_tongji_container = {
						current_time: current_time_php,
						entry_time: 0,
						visitor_id: '-',
						url: document.URL,
						first_refer: '-',
						last_refer: document.referrer || '-',
						fromid: '-',
						ifid: '-',
						external_source: '-',
						internal_source: '-',
						pagetype: pagetype_php,
						global_landing: '-',
						channel_landing: '-',
						visits_count: 0,
						pv_count: 0,
						tj_user_id: _tongji_cookie(_BjTj_cookie_user) || 0,
						utm_source: '-',
						utm_medium: '-',
						utm_term: '-',
						utm_id: '-',
						utm_campaign: '-',
						pool: _tongji_cookie('__tongjipool') || '-',
						reserve_a: '-',
						reserve_b: metadata_id_php,
						reserve_c: '-',
						reserve_d: '-'
					};
					var tongji_img_url = _BiTj_domain_url + '/tongji.gif';
					var cookie_domain = _BiTj_domain;
					var url_domain = '.' + _BiTj_domain;
					var _separatorV = '|';
					var _separatorS = '||';
					var page_type = log_tongji_container.patetype;
					var tongjiv = _tongji_cookie('__tongjiv');
					var tongjis = _tongji_cookie('__tongjis');
					if (tongjis) {
						var before_external_source = _BiTj._getExternalSource();
						var current_external_source = _tongji_externalSource(log_tongji_container.last_refer);
						if (current_external_source != 'nonMarketingSE' && before_external_source != current_external_source) {
							_tongji_cookie('__tongjis', '', { path: '/', domain: cookie_domain, secure: 0, expires: -1 });
							tongjis = '';
						}
						if (current_external_source == 'marketing' && before_external_source == 'marketing') {
							var before_tongjis_splic = tongjis.split(_separatorS);
							var before_fromid = before_tongjis_splic[1] || "-";
							var current_fromid = _tongji_GetFromid(log_tongji_container.url, log_tongji_container.last_refer);
							if (before_fromid != current_fromid && current_fromid != '-') {
								_tongji_cookie('__tongjis', '', { path: '/', domain: cookie_domain, secure: 0, expires: -1 });
								tongjis = '';
							}
						}
					}
					if (!tongjiv && !tongjis) {
						log_tongji_container.entry_time = log_tongji_container.current_time;
						log_tongji_container.first_refer = log_tongji_container.last_refer;
						log_tongji_container.visitor_id = visitor_id_php;
						log_tongji_container.visits_count = 1;
						log_tongji_container.pv_count = 1;
						log_tongji_container.global_landing = log_tongji_container.pagetype;
						log_tongji_container.channel_landing = log_tongji_container.pagetype;
						if (-1 !== log_tongji_container.url.indexOf('ifid=')) {
							log_tongji_container.ifid = tongji_serialize_str(log_tongji_container.url, 'ifid=', '&');
						} else {
							log_tongji_container.ifid = '-';
						}
						log_tongji_container.external_source = _tongji_externalSource();
						log_tongji_container.internal_source = '-';
						var _pagetype = log_tongji_container.pagetype.toLowerCase();
						var arr_pagetype = _pagetype.split(".");
						log_tongji_container.reserve_a = arr_pagetype[0];
						log_tongji_container.fromid = _tongji_GetFromid(log_tongji_container.url, log_tongji_container.first_refer);
					} else {
						var last_refer = tongji_parse_url(log_tongji_container.last_refer);
						var tongjiv_splic = tongjiv.split(_separatorV);
						if (tongjiv && !tongjis) {
							if (tongjiv_splic && tongjiv_splic.length) {
								log_tongji_container.visitor_id = tongjiv_splic[0];
								log_tongji_container.visits_count = parseInt(tongjiv_splic[1]) + 1;
							}
							log_tongji_container.entry_time = log_tongji_container.current_time;
							log_tongji_container.first_refer = log_tongji_container.last_refer;
							log_tongji_container.pv_count = 1;
							var tongjis_fromid = '-';
							var tongjis_ifid = '-';
							log_tongji_container.external_source = _tongji_externalSource();
							var tongjis_internal_source = '-';
							var tongjis_global_landing = log_tongji_container.pagetype;
							var tongjis_channel_landing = log_tongji_container.pagetype;
							var _pagetype = log_tongji_container.pagetype.toLowerCase();
							var arr_pagetype = _pagetype.split(".");
							log_tongji_container.reserve_a = arr_pagetype[0];
							log_tongji_container.fromid = _tongji_GetFromid(log_tongji_container.url, log_tongji_container.first_refer);
						} else if (tongjiv && tongjis) {
							if (tongjiv_splic && tongjiv_splic.length) {
								log_tongji_container.visitor_id = tongjiv_splic[0];
								log_tongji_container.visits_count = tongjiv_splic[1];
							}
							var tongjis_splic = tongjis.split(_separatorS);
							if (tongjis_splic && tongjis_splic.length) {
								log_tongji_container.entry_time = tongjis_splic[0];
								log_tongji_container.fromid = tongjis_splic[1] || '-';
								var tongjis_ifid = tongjis_splic[2] || '-';
								log_tongji_container.external_source = tongjis_splic[3] || '-';
								var tongjis_internal_source = tongjis_splic[4] || '-';
								log_tongji_container.internal_source = tongjis_splic[4] || '-';
								log_tongji_container.first_refer = tongjis_splic[5] || '-';
								var tongjis_global_landing = tongjis_splic[6] || '-';
								var tongjis_channel_landing = tongjis_splic[7] || '-';
								log_tongji_container.pv_count = parseInt(tongjis_splic[8]) + 1;
								log_tongji_container.reserve_a = tongjis_splic[15] || '-';
							}
							var _reserve_a = log_tongji_container.reserve_a;
							var _pagetype = log_tongji_container.pagetype.toLowerCase();
							var arr_pagetype = _pagetype.split(".");
							if (_reserve_a != arr_pagetype[0]) {
								log_tongji_container.internal_source = _reserve_a;
								log_tongji_container.reserve_a = arr_pagetype[0];
							}
						}
						if (-1 !== log_tongji_container.url.indexOf('ifid=') && tongji_serialize_str(log_tongji_container.url, 'ifid=', '&') != "") {
							log_tongji_container.ifid = tongji_serialize_str(log_tongji_container.url, 'ifid=', '&');
						} else {
							log_tongji_container.ifid = tongjis_ifid;
						}
						log_tongji_container.global_landing = tongjis_global_landing;
						if (-1 !== log_tongji_container.url.indexOf(url_domain) && -1 !== log_tongji_container.last_refer.indexOf(url_domain)) {
							var new_pagetype = log_tongji_container.pagetype.toLowerCase();
							var arr_new_pagetype = new_pagetype.split(".");
							var new_channel_landing = tongjis_channel_landing.toLowerCase();
							var arr_new_channel_landing = new_channel_landing.split(".");
							if (arr_new_pagetype[0] == arr_new_channel_landing[0]) {
								log_tongji_container.channel_landing = tongjis_channel_landing;
							} else {
								log_tongji_container.channel_landing = log_tongji_container.pagetype;
							}
						} else {
							log_tongji_container.channel_landing = log_tongji_container.pagetype;
						}
					}
					var result = _tongji_getCampaign(log_tongji_container.url, tongjis);
					log_tongji_container.utm_source = result.source;
					log_tongji_container.utm_medium = result.medium;
					log_tongji_container.utm_term = result.term;
					log_tongji_container.utm_id = result.termid;
					log_tongji_container.utm_campaign = result.campaign;
					var cookie_tongjiv = '';
					cookie_tongjiv += log_tongji_container.visitor_id + _separatorV;
					cookie_tongjiv += log_tongji_container.visits_count;
					var cookie_tongjis = '';
					cookie_tongjis += log_tongji_container.entry_time + _separatorS;
					cookie_tongjis += encodeURIComponent(log_tongji_container.fromid) + _separatorS;
					cookie_tongjis += log_tongji_container.ifid + _separatorS;
					cookie_tongjis += log_tongji_container.external_source + _separatorS;
					cookie_tongjis += log_tongji_container.internal_source + _separatorS;
					cookie_tongjis += encodeURIComponent(log_tongji_container.first_refer) + _separatorS;
					cookie_tongjis += log_tongji_container.global_landing + _separatorS;
					cookie_tongjis += log_tongji_container.channel_landing + _separatorS;
					cookie_tongjis += log_tongji_container.pv_count + _separatorS;
					cookie_tongjis += log_tongji_container.tj_user_id + _separatorS;
					cookie_tongjis += log_tongji_container.utm_source + _separatorS;
					cookie_tongjis += log_tongji_container.utm_medium + _separatorS;
					cookie_tongjis += encodeURIComponent(log_tongji_container.utm_term) + _separatorS;
					cookie_tongjis += log_tongji_container.utm_id + _separatorS;
					cookie_tongjis += encodeURIComponent(log_tongji_container.utm_campaign) + _separatorS;
					cookie_tongjis += log_tongji_container.reserve_a;
					//modify tongji pool
					var tmp_abpool_cookie = '';
					for (i = 0; i < _BjTj_subChannel.length; i++) {
						var tmp_pool_channel_cookie_key = '__tongjipool_' + _BjTj_subChannel[i];
						var tmp_pool_channel_cookie_value = _tongji_cookie(tmp_pool_channel_cookie_key) || '';
						if (tmp_pool_channel_cookie_value != '') {
							if (tmp_abpool_cookie != '') {
								tmp_abpool_cookie += '|';
							}
							tmp_abpool_cookie += _BjTj_subChannel[i] + '*' + tmp_pool_channel_cookie_value;
						}
					}
					log_tongji_container.pool = encodeURIComponent(tmp_abpool_cookie);
					_tongji_cookie('__tongjipool', encodeURIComponent(tmp_abpool_cookie), { path: '/', domain: cookie_domain, secure: 0, expires: 0.0208333 });
					_tongji_cookie('__tongjiv', cookie_tongjiv, { path: '/', domain: cookie_domain, secure: 0, expires: 731 });
					_tongji_cookie('__tongjis', cookie_tongjis, { path: '/', domain: cookie_domain, secure: 0, expires: 0.0208333 });
					var imgUrl = '';
					imgUrl = tongji_img_url + '?entry_time=' + log_tongji_container.entry_time + '&visitor_id=' + log_tongji_container.visitor_id + '&url=' + encodeURIComponent(log_tongji_container.url) + '&first_refer=' + encodeURIComponent(log_tongji_container.first_refer) + '&last_refer=' + encodeURIComponent(log_tongji_container.last_refer) + '&fromid=' + encodeURIComponent(log_tongji_container.fromid) + '&ifid=' + log_tongji_container.ifid + '&external_source=' + log_tongji_container.external_source + '&internal_source=' + log_tongji_container.internal_source + '&pagetype=' + log_tongji_container.pagetype + '&global_landing=' + log_tongji_container.global_landing + '&channel_landing=' + log_tongji_container.channel_landing + '&visits_count=' + log_tongji_container.visits_count + '&pv_count=' + log_tongji_container.pv_count + '&tj_user_id=' + log_tongji_container.tj_user_id + '&utm_source=' + log_tongji_container.utm_source + '&utm_medium=' + log_tongji_container.utm_medium + '&utm_term=' + log_tongji_container.utm_term + '&utm_id=' + log_tongji_container.utm_id + '&utm_campaign=' + log_tongji_container.utm_campaign + '&pool=' + log_tongji_container.pool + '&reserve_a=' + log_tongji_container.reserve_a + '&reserve_b=' + log_tongji_container.reserve_b + '&reserve_c=' + log_tongji_container.reserve_c + '&reserve_d=' + log_tongji_container.reserve_d + '';
					var bitongji_img = document.createElement('img');
					bitongji_img.src = imgUrl;
					bitongji_img.width = 1;
					bitongji_img.height = 1;
					bitongji_img.style.display = 'none';
					window._BiTj.current_pvcount = log_tongji_container.pv_count;
					document.body.appendChild(bitongji_img);
				}
				function _tongji_externalSource(refer_url) {
					var _externalSource = '';
					var _refer = '';
					var _referold = log_tongji_container.first_refer.toLowerCase();
					if (typeof bitongji_fromid_php != 'undefined' && bitongji_fromid_php != '') {
						return "marketing";
					}
					if (typeof refer_url != 'undefined') {
						_referold = refer_url.toLowerCase();
					}
					_refer = tongji_parse_url(_referold);
					//增加360搜索引擎
					var seSourceMap = [['Google', '.google.com/', 'q='], ['Google', '.google.com.hk/', 'q='], ['Baidu', '.baidu.com/', 'wd='], ['Baidu', '.baidu.com/', 'word='], ['Baidu', '.baidu.com/', 'src_'], ['Soso', '.soso.com/', 'w='], ['Soso', '.soso.com/', 'key='], ['Sogou', '.sogou.com/', 'query='], ['Sogou', '.sogou.com/', 'keyword='], ['Bing', '.bing.com/', 'q='], ['Youdao', '.youdao.com/', 'q='], ['360', '.360.cn/', 'q='], ['360', '.so.com/', 'q='], ['360', '.haosou.com/', 'q='], ['sm', '.sm.cn/', 'q='], ['sm', '.sm.cn/', 'src=']];
					var _utm_medium = "";
					if (-1 !== log_tongji_container.url.indexOf('est=') && tongji_serialize_str(log_tongji_container.url, 'est=', '&') == "marketing") {
						_externalSource = 'marketing';
					} else if (-1 !== log_tongji_container.url.indexOf('est=') && tongji_serialize_str(log_tongji_container.url, 'est=', '&') == "nmns") {
						_externalSource = 'nonMarketingSE';
					} else {
						if (-1 !== log_tongji_container.url.indexOf('utm_medium=')) {
							_utm_medium = tongji_serialize_str(log_tongji_container.url, 'utm_medium=', '&');
						} else {
							_utm_medium = "";
						}
						if (_utm_medium == 'cpc') {
							_externalSource = 'SEM';
						} else if (_utm_medium == 'cpp') {
							_externalSource = 'SEA';
						} else {
							var isBD = 0;
							var i = 0;
							for (i = 0; i < seSourceMap.length; i++) {
								if (-1 != _refer.indexOf(seSourceMap[i][1]) && -1 != _referold.indexOf(seSourceMap[i][2])) {
									seSource = seSourceMap[i][0];
									isBD = 1;
								}
							}
							if (isBD == 0) {
								if (-1 !== log_tongji_container.url.indexOf('fromid=')) {
									_externalSource = _tongji_SemOrMarketing(log_tongji_container.url, _referold);
								} else if (_refer.substring(0, 21) == "http://www.hao123.com") {
									_externalSource = 'marketing';
								} else {
									_externalSource = 'nonMarketingSE';
								}
							} else if (isBD == 1) {
								_externalSource = "SEO";
							}
						}
					}
					return _externalSource;
				};
				function _tongji_getCampaign(url, tongjis) {
					var result = {
						'source': '-',
						'medium': '-',
						'term': '-',
						'termid': '-',
						'campaign': '-'
					};
					var _separatorS = '||';
					if ('' != url) {
						if (-1 != url.indexOf('utm_source=')) {
							result['source'] = tongji_serialize_str(url, 'utm_source=', '&');
						} else {
							if (tongjis && 'undefined' != tongjis) {
								var tongjis_splics = tongjis.split(_separatorS);
								if (tongjis_splics && tongjis_splics.length) {
									result['source'] = tongjis_splics[10] || '-';
								}
							} else {
								result['source'] = '-';
							}
						}
						if (-1 != url.indexOf('utm_medium=')) {
							result['medium'] = tongji_serialize_str(url, 'utm_medium=', '&');
						} else {
							if (tongjis && 'undefined' != tongjis) {
								var tongjis_splics = tongjis.split(_separatorS);
								if (tongjis_splics && tongjis_splics.length) {
									result['medium'] = tongjis_splics[11] || '-';
								}
							} else {
								result['medium'] = '-';
							}
						}
						if (-1 != url.indexOf('utm_term=')) {
							result['term'] = tongji_serialize_str(url, 'utm_term=', '&');
						} else {
							if (tongjis && 'undefined' != tongjis) {
								var tongjis_splics = tongjis.split(_separatorS);
								if (tongjis_splics && tongjis_splics.length) {
									result['term'] = tongjis_splics[12] || '-';
								}
							} else {
								result['term'] = '-';
							}
						}
						if (-1 != url.indexOf('utm_id=')) {
							result['termid'] = tongji_serialize_str(url, 'utm_id=', '&');
						} else {
							if (tongjis && 'undefined' != tongjis) {
								var tongjis_splics = tongjis.split(_separatorS);
								if (tongjis_splics && tongjis_splics.length) {
									result['termid'] = tongjis_splics[13] || '-';
								}
							} else {
								result['termid'] = '-';
							}
						}
						if (-1 != url.indexOf('utm_campaign=')) {
							result['campaign'] = tongji_serialize_str(url, 'utm_campaign=', '&');
						} else {
							if (tongjis && 'undefined' != tongjis) {
								var tongjis_splics = tongjis.split(_separatorS);
								if (tongjis_splics && tongjis_splics.length) {
									result['campaign'] = tongjis_splics[14] || '-';
								}
							} else {
								result['campaign'] = '-';
							}
						}
					}
					if ("" == url || 'undefined' == typeof url) {
						if (tongjis && 'undefined' != tongjis) {
							var tongjis_splics = tongjis.split(_separatorS);
							if (tongjis_splics && tongjis_splics.length) {
								result['source'] = tongjis_splics[10] || '-';
								result['medium'] = tongjis_splics[11] || '-';
								result['term'] = tongjis_splics[12] || '-';
								result['termid'] = tongjis_splics[13] || '-';
								result['campaign'] = tongjis_splics[14] || '-';
							}
						} else {
							result['source'] = '-';
							result['medium'] = '-';
							result['term'] = '-';
							result['termid'] = '-';
							result['campaign'] = '-';
						}
					}
					return result;
				};
				function _tongji_cookie(name, value, options) {
					if (typeof value != 'undefined') {
						options = options || {};
						if (value === null) {
							value = '';
							options.expires = -1;
						}
						var expires = '';
						if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
							var date;
							if (typeof options.expires == 'number') {
								date = new Date();
								date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
							} else {
								date = options.expires;
							}
							expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
						}
						var path = options.path ? '; path=' + options.path : '';
						var domain = options.domain ? '; domain=' + options.domain : '';
						var secure = options.secure ? '; secure' : '';
						document.cookie = [name, '=', value, expires, path, domain, secure].join('');
					} else {
						if (document.cookie && document.cookie != '') {
							var arg = name + "=";
							var alen = arg.length;
							var clen = document.cookie.length;
							var i = 0;
							while (i < clen) {
								var j = i + alen;
								if (document.cookie.substring(i, j) == arg) {
									var endstr = document.cookie.indexOf(";", j);
									if (endstr == -1) endstr = document.cookie.length;
									return unescape(document.cookie.substring(j, endstr));
								}
								i = document.cookie.indexOf(" ", i) + 1;
								if (i == 0) break;
							}
						}
					}
				};
				function tongji_serialize_str(L, n, s) {
					if (!L || L == '' || !n || n == '' || !s || s == '') {
						return '-';
					}
	
					var i,
					    i2,
					    i3,
					    c = '-';
					i = L.indexOf('#');
					if (i > -1) {
						L = L.substr(0, i);
					}
					i = L.indexOf(n);
					i3 = n.indexOf('=') + 1;
	
					if (i > -1) {
						i2 = L.indexOf(s, i);
						if (i2 < 0) {
							i2 = L.length;
						}
						c = L.substr(i + i3, i2 - i - i3);
					}
	
					c = getRegStr(c);
					return c;
				};
				function getRegStr(sourceStr) {
					targetStr = "-";
					try {
						targetStr = sourceStr.replace(/[^a-zA-Z0-9-_]/g, '');
					} catch (e) {};
					return targetStr;
				}
				function tongji_parse_url(url) {
					var res = '';
					if (!url) {
						return res;
					}
					var i = url.indexOf('#');
					if (i > -1) {
						url = url.substr(0, i);
					}
					var pos = url.indexOf('?');
					if (pos > -1) {
						res = url.substr(0, pos);
					} else {
						res = url;
					}
	
					return res;
				};
				function _tongji_GetUrlDomain(domain) {
					var domain_name = domain;
					return domain_name;
				};
				function _tongji_GetUrlMain(url, suffix) {
					var suffix_start_num = url.indexOf(suffix);
					var strurl = url.substring(7, suffix_start_num);
					if (-1 != strurl.indexOf('.')) {
						var arr_strurl = strurl.split(".");
						var arr_num = arr_strurl.length - 1;
						var strurl_new = arr_strurl[arr_num];
						return strurl_new;
					} else {
						return strurl;
					}
				};
				function _tongji_SemOrMarketing(url, firstRefer) {
					var _tongji_es = 'marketing';
					var strFromid = tongji_serialize_str(url, 'fromid=', '&');
					if (strFromid.substring(0, 3) == 'sem' || strFromid.substring(0, 6) == 'adsage') {
						_tongji_es = 'nonMarketingSE';
					} else {
						_tongji_es = 'marketing';
					}
					return _tongji_es;
				};
				function _tongji_GetFromid(strUrl, strFirstRefer) {
					var fromidValue = "-";
					if (typeof bitongji_fromid_php != 'undefined' && bitongji_fromid_php != '') {
						return bitongji_fromid_php;
					}
					if (-1 !== strUrl.indexOf('fromid=') && tongji_serialize_str(strUrl, 'fromid=', '&') != "") {
						fromidValue = tongji_serialize_str(strUrl, 'fromid=', '&');
					} else {
						fromidValue = '-';
					}
					return fromidValue;
				};
			},
			_trackEvent: function _trackEvent(area, detail) {
				try {
					var randomInt = Math.round(Math.random() * 1000000);
					var tmpTime = new Date().getTime();
					var current_pvcount = window._BiTj.current_pvcount || 0;
					randomInt = tmpTime + randomInt;
					var cURL = document.URL;
					var a = document.createElement('img');
					var url = _BiTj_domain_url + '/event.gif?url=' + encodeURIComponent(cURL) + '&pagetype=' + encodeURIComponent(pagetype_php) + '&area=' + encodeURIComponent(area) + '&detail=' + encodeURIComponent(detail) + '&birand=' + randomInt + '&current_pvcount=' + current_pvcount;
					a.src = url;
				} catch (e) {};
			},
			_getExternalSource: function _getExternalSource() {
				var _result = '';
				try {
					var _tjcookie = '';
					var _cookiearr = document.cookie.split('; ');
					for (var i = 0; i < _cookiearr.length; i++) {
						var temp = _cookiearr[i].split('=');
						if (temp[0] == '__tongjis') {
							_tjcookie = temp[1];
							break;
						}
					}
					if (typeof _tjcookie != 'undefined' && _tjcookie != '') {
						var _tmparr = _tjcookie.split('||');
						_result = _tmparr[3];
					}
					return _result;
				} catch (e) {};
			},
			__getCookieV: function __getCookieV(name) {
				if (document.cookie && document.cookie != '') {
					var arg = name + "=";
					var alen = arg.length;
					var clen = document.cookie.length;
					var i = 0;
					while (i < clen) {
						var j = i + alen;
						if (document.cookie.substring(i, j) == arg) {
							var endstr = document.cookie.indexOf(";", j);
							if (endstr == -1) endstr = document.cookie.length;
							return unescape(document.cookie.substring(j, endstr));
						}
						i = document.cookie.indexOf(" ", i) + 1;
						if (i == 0) break;
					}
				}
			}
		};
		try {
			_BiTj._tongji();
		} catch (e) {};
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	var VER_CONFIG = { version: '6.3.4', source: 'h5web', key: '71e5d83f6480523cb7b52e13445c2865', userkey: '93f5c2eab7ba9b5ac39bac1b927f9101' };
	exports['default'] = VER_CONFIG;
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	var Cookie = {};
	
	var decode = decodeURIComponent;
	var encode = encodeURIComponent;
	// Helpers
	
	function isString(o) {
	    return typeof o === 'string';
	}
	
	function isNonEmptyString(s) {
	    return isString(s) && s !== '';
	}
	
	function validateCookieName(name) {
	    if (!isNonEmptyString(name)) {
	        throw new TypeError('Cookie name must be a non-empty string');
	    }
	}
	
	function same(s) {
	    return s;
	}
	
	function parseCookieString(text, shouldDecode) {
	    var cookies = {};
	
	    if (isString(text) && text.length > 0) {
	
	        var decodeValue = shouldDecode ? decode : same;
	        var cookieParts = text.split(/;\s/g);
	        var cookieName;
	        var cookieValue;
	        var cookieNameValue;
	
	        for (var i = 0, len = cookieParts.length; i < len; i++) {
	
	            // Check for normally-formatted cookie (name-value)
	            cookieNameValue = cookieParts[i].match(/([^=]+)=/i);
	            if (cookieNameValue instanceof Array) {
	                try {
	                    cookieName = decode(cookieNameValue[1]);
	                    cookieValue = decodeValue(cookieParts[i].substring(cookieNameValue[1].length + 1));
	                } catch (ex) {
	                    // Intentionally ignore the cookie -
	                    // the encoding is wrong
	                }
	            } else {
	                    // Means the cookie does not have an "=", so treat it as
	                    // a boolean flag
	                    cookieName = decode(cookieParts[i]);
	                    cookieValue = '';
	                }
	
	            if (cookieName) {
	                cookies[cookieName] = cookieValue;
	            }
	        }
	    }
	
	    return cookies;
	}
	
	/**
	 * Returns the cookie value for the given name.
	 *
	 * @param {String} name The name of the cookie to retrieve.
	 *
	 * @param {Function|Object} options (Optional) An object containing one or
	 *     more cookie options: raw (true/false) and converter (a function).
	 *     The converter function is run on the value before returning it. The
	 *     function is not used if the cookie doesn't exist. The function can be
	 *     passed instead of the options object for conveniently. When raw is
	 *     set to true, the cookie value is not URI decoded.
	 *
	 * @return {*} If no converter is specified, returns a string or undefined
	 *     if the cookie doesn't exist. If the converter is specified, returns
	 *     the value returned from the converter.
	 */
	Cookie.get = function (name, options) {
	    validateCookieName(name);
	
	    if (typeof options === 'function') {
	        options = { converter: options };
	    } else {
	        options = options || {};
	    }
	
	    var cookies = parseCookieString(document.cookie, !options['raw']);
	    return (options.converter || same)(cookies[name]);
	};
	
	/**
	 * Sets a cookie with a given name and value.
	 *
	 * @param {string} name The name of the cookie to set.
	 *
	 * @param {*} value The value to set for the cookie.
	 *
	 * @param {Object} options (Optional) An object containing one or more
	 *     cookie options: path (a string), domain (a string),
	 *     expires (number or a Date object), secure (true/false),
	 *     and raw (true/false). Setting raw to true indicates that the cookie
	 *     should not be URI encoded before being set.
	 *
	 * @return {string} The created cookie string.
	 */
	Cookie.set = function (name, value, options) {
	    validateCookieName(name);
	
	    options = options || {};
	    var expires = options['expires'];
	    var domain = options['domain'];
	    var path = options['path'];
	
	    if (!options['raw']) {
	        value = encode(String(value));
	    }
	
	    var text = name + '=' + value;
	
	    // expires
	    var date = expires;
	    if (typeof date === 'number') {
	        date = new Date();
	        date.setDate(date.getDate() + expires);
	    }
	    if (date instanceof Date) {
	        text += '; expires=' + date.toUTCString();
	    }
	
	    // domain
	    if (isNonEmptyString(domain)) {
	        text += '; domain=' + domain;
	    }
	
	    // path
	    if (isNonEmptyString(path)) {
	        text += '; path=' + path;
	    }
	
	    // secure
	    if (options['secure']) {
	        text += '; secure';
	    }
	
	    document.cookie = text;
	    return text;
	};
	
	/**
	 * Removes a cookie from the machine by setting its expiration date to
	 * sometime in the past.
	 *
	 * @param {string} name The name of the cookie to remove.
	 *
	 * @param {Object} options (Optional) An object containing one or more
	 *     cookie options: path (a string), domain (a string),
	 *     and secure (true/false). The expires option will be overwritten
	 *     by the method.
	 *
	 * @return {string} The created cookie string.
	 */
	Cookie.remove = function (name, options) {
	    options = options || {};
	    options['expires'] = new Date(0);
	    return this.set(name, '', options);
	};
	
	exports['default'] = Cookie;
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	__webpack_require__(1);
	
	var _h5_base = __webpack_require__(2);
	
	var _h5_base2 = _interopRequireDefault(_h5_base);
	
	var _cookie = __webpack_require__(5);
	
	var _cookie2 = _interopRequireDefault(_cookie);
	
	var COMMON = {
	    settings: {
	        code: _h5_base2["default"].lang.getUrlParam('code') || ''
	    },
	    init: function init() {
	        var self = this,
	            code = self.settings.code,
	            appid = 'wx9b07830d3c51f961',
	            secret = '367e2707ce9516a16359352f523324b0';
	
	        $('.dialog').height($(window).height());
	
	        //旋转屏幕
	        var window_width = $(window).width(),
	            window_height_new,
	            window_width_new;
	        $(window).resize(function () {
	            window_width_new = $(window).width();
	            window_height_new = $(window).height();
	            if (window_width_new > window_width && window_height_new < 420) {
	                self.setDialog('横屏显示内容较少，请竖屏浏览');
	            } else if (window_width_new != window_width && window_height_new > 420) {
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
	    setDialog: function setDialog(text) {
	        if (text.length <= 10) {
	            $('.dialog .msg').css('lineHeight', '2.4rem');
	        } else {
	            $('.dialog .msg').css('lineHeight', '1.2rem');
	        }
	        $('.dialog').removeClass('hide').find('.msg').text(text);
	        setTimeout(function () {
	            $('.dialog').addClass('hide');
	        }, 1000);
	    },
	    switchTab: function switchTab(tabs) {
	        var tab_tit = tabs.find('.tab_tit'),
	            tit = tab_tit.find('.tit');
	
	        tab_tit.on('tap', '.tit', function () {
	            var index = $(this).index();
	            tit.removeClass('active').eq(index).addClass('active');
	        });
	    },
	    //统计
	    sendAnchor: function sendAnchor(events) {
	        var self = this,
	            gi = _cookie2["default"].get('h5_guid'),
	            ip,
	            ua = window.navigator.userAgent,
	            //操作系统信息
	        t = new Date(),
	            ts = t.getFullYear() + '-' + t.getMonth() + 1 + '-' + t.getDate() + ' ' + t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds(),
	            uid = _cookie2["default"].get('app_uid'),
	            url = 'http://v1.m.hichao.com/api/v1/track',
	            getIpUrl = 'http://chaxun.1616.net/s.php?type=ip&output=json&callback=?&_=' + Math.random();
	        $.getJSON(getIpUrl, function (data) {
	            ip = data.Ip;
	        });
	
	        $.ajax({
	            type: 'post',
	            url: url,
	            dataType: 'json',
	            data: {
	                data: JSON.stringify({
	                    'gc': "hichao",
	                    'gf': "H5", //应用平台
	                    'gi': gi, //唯一标识
	                    'gs': window.screen.width + "x" + window.screen.height, //用户设备分辨率
	                    // gsv: "",  //操作系统版本
	                    // gt: "",  //手机型号
	                    // gv: "6.4.0.14",  //应用版本名称
	                    'ip': ip,
	                    //isp: "",   //运营商 移动mobile  联通unicom  电信tel
	                    'net': "wifi", //网络状态
	                    'os': "", //用户操作系统
	                    'push_token': "GT;;", //用户接受推送的token
	                    'ts': ts, //时间 "2014-10-12 11:11:11"
	                    'uid': uid,
	                    'events': events
	                })
	            },
	            success: function success(result) {
	                window.console.log(result);
	                if (result.success === "1") {} else {}
	            },
	            error: function error() {
	                // alert("请求失败");
	            }
	        });
	    }
	};
	exports["default"] = COMMON;
	module.exports = exports["default"];

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	
	var BASE64_MAPPING = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'];
	
	/**
	 *ascii convert to binary
	 */
	var _toBinary = function _toBinary(ascii) {
	    var binary = [];
	    while (ascii > 0) {
	        var b = ascii % 2;
	        ascii = Math.floor(ascii / 2);
	        binary.push(b);
	    }
	    /*
	    var len = binary.length;
	    if(6-len > 0){
	        for(var i = 6-len ; i > 0 ; --i){
	            binary.push(0);
	        }
	    }*/
	    binary.reverse();
	    return binary;
	};
	
	/**
	 *binary convert to decimal
	 */
	var _toDecimal = function _toDecimal(binary) {
	    var dec = 0;
	    var p = 0;
	    for (var i = binary.length - 1; i >= 0; --i) {
	        var b = binary[i];
	        if (b == 1) {
	            dec += Math.pow(2, p);
	        }
	        ++p;
	    }
	    return dec;
	};
	
	/**
	 *unicode convert to utf-8
	 */
	var _toUTF8Binary = function _toUTF8Binary(c, binaryArray) {
	    var mustLen = 8 - (c + 1) + (c - 1) * 6;
	    var fatLen = binaryArray.length;
	    var diff = mustLen - fatLen;
	    while (--diff >= 0) {
	        binaryArray.unshift(0);
	    }
	    var binary = [];
	    var _c = c;
	    while (--_c >= 0) {
	        binary.push(1);
	    }
	    binary.push(0);
	    var i = 0,
	        len = 8 - (c + 1);
	    for (; i < len; ++i) {
	        binary.push(binaryArray[i]);
	    }
	
	    for (var j = 0; j < c - 1; ++j) {
	        binary.push(1);
	        binary.push(0);
	        var sum = 6;
	        while (--sum >= 0) {
	            binary.push(binaryArray[i++]);
	        }
	    }
	    return binary;
	};
	
	var __BASE64 = {
	    /**
	     *BASE64 Encode
	     */
	    encoder: function encoder(str) {
	        var base64_Index = [];
	        var binaryArray = [],
	            i,
	            len;
	        for (i = 0, len = str.length; i < len; ++i) {
	            var unicode = str.charCodeAt(i);
	            var _tmpBinary = _toBinary(unicode);
	            if (unicode < 0x80) {
	                var _tmpdiff = 8 - _tmpBinary.length;
	                while (--_tmpdiff >= 0) {
	                    _tmpBinary.unshift(0);
	                }
	                binaryArray = binaryArray.concat(_tmpBinary);
	            } else if (unicode >= 0x80 && unicode <= 0x7FF) {
	                binaryArray = binaryArray.concat(_toUTF8Binary(2, _tmpBinary));
	            } else if (unicode >= 0x800 && unicode <= 0xFFFF) {
	                //UTF-8 3byte
	                binaryArray = binaryArray.concat(_toUTF8Binary(3, _tmpBinary));
	            } else if (unicode >= 0x10000 && unicode <= 0x1FFFFF) {
	                //UTF-8 4byte
	                binaryArray = binaryArray.concat(_toUTF8Binary(4, _tmpBinary));
	            } else if (unicode >= 0x200000 && unicode <= 0x3FFFFFF) {
	                //UTF-8 5byte
	                binaryArray = binaryArray.concat(_toUTF8Binary(5, _tmpBinary));
	            } else if (unicode >= 4000000 && unicode <= 0x7FFFFFFF) {
	                //UTF-8 6byte
	                binaryArray = binaryArray.concat(_toUTF8Binary(6, _tmpBinary));
	            }
	        }
	
	        var extra_Zero_Count = 0;
	        for (i = 0, len = binaryArray.length; i < len; i += 6) {
	            var diff = i + 6 - len;
	            if (diff == 2) {
	                extra_Zero_Count = 2;
	            } else if (diff == 4) {
	                extra_Zero_Count = 4;
	            }
	            //if(extra_Zero_Count > 0){
	            //  len += extra_Zero_Count+1;
	            //}
	            var _tmpExtra_Zero_Count = extra_Zero_Count;
	            while (--_tmpExtra_Zero_Count >= 0) {
	                binaryArray.push(0);
	            }
	            base64_Index.push(_toDecimal(binaryArray.slice(i, i + 6)));
	        }
	
	        var base64 = '';
	        for (i = 0, len = base64_Index.length; i < len; ++i) {
	            base64 += BASE64_MAPPING[base64_Index[i]];
	        }
	
	        for (i = 0, len = extra_Zero_Count / 2; i < len; ++i) {
	            base64 += '=';
	        }
	        return base64;
	    },
	    /**
	     *BASE64  Decode for UTF-8 
	     */
	    decoder: function decoder(_base64Str) {
	        var _len = _base64Str.length;
	        var extra_Zero_Count = 0;
	        /**
	         *计算在进行BASE64编码的时候，补了几个0
	         */
	        if (_base64Str.charAt(_len - 1) == '=') {
	            //alert(_base64Str.charAt(_len-1));
	            //alert(_base64Str.charAt(_len-2));
	            if (_base64Str.charAt(_len - 2) == '=') {
	                //两个等号说明补了4个0
	                extra_Zero_Count = 4;
	                _base64Str = _base64Str.substring(0, _len - 2);
	            } else {
	                //一个等号说明补了2个0
	                extra_Zero_Count = 2;
	                _base64Str = _base64Str.substring(0, _len - 1);
	            }
	        }
	
	        var binaryArray = [];
	        for (var i = 0, len = _base64Str.length; i < len; ++i) {
	            var c = _base64Str.charAt(i);
	            for (var j = 0, size = BASE64_MAPPING.length; j < size; ++j) {
	                if (c == BASE64_MAPPING[j]) {
	                    var _tmp = _toBinary(j);
	                    /*不足6位的补0*/
	                    var _tmpLen = _tmp.length;
	                    if (6 - _tmpLen > 0) {
	                        for (var k = 6 - _tmpLen; k > 0; --k) {
	                            _tmp.unshift(0);
	                        }
	                    }
	                    binaryArray = binaryArray.concat(_tmp);
	                    break;
	                }
	            }
	        }
	
	        if (extra_Zero_Count > 0) {
	            binaryArray = binaryArray.slice(0, binaryArray.length - extra_Zero_Count);
	        }
	
	        var unicode = [];
	        var unicodeBinary = [];
	        for (i = 0, len = binaryArray.length; i < len;) {
	            if (binaryArray[i] === 0) {
	                unicode = unicode.concat(_toDecimal(binaryArray.slice(i, i + 8)));
	                i += 8;
	            } else {
	                var sum = 0;
	                while (i < len) {
	                    if (binaryArray[i] == 1) {
	                        ++sum;
	                    } else {
	                        break;
	                    }
	                    ++i;
	                }
	                unicodeBinary = unicodeBinary.concat(binaryArray.slice(i + 1, i + 8 - sum));
	                i += 8 - sum;
	                while (sum > 1) {
	                    unicodeBinary = unicodeBinary.concat(binaryArray.slice(i + 2, i + 8));
	                    i += 8;
	                    --sum;
	                }
	                unicode = unicode.concat(_toDecimal(unicodeBinary));
	                unicodeBinary = [];
	            }
	        }
	        return unicode;
	    }
	};
	
	exports['default'] = __BASE64;
	module.exports = exports['default'];

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 *
	 * User : sunchengbin
	 * Date : 9/27/2014
	 * Desc :
	 *
	 */
	'use strict';
	
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	
	    /*jslint bitwise: true */
	    /*global unescape, define */
	
	    'use strict';
	
	    /*
	    * Add integers, wrapping at 2^32. This uses 16-bit operations internally
	    * to work around bugs in some JS interpreters.
	    */
	    function safe_add(x, y) {
	        var lsw = (x & 0xFFFF) + (y & 0xFFFF),
	            msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	        return msw << 16 | lsw & 0xFFFF;
	    }
	
	    /*
	    * Bitwise rotate a 32-bit number to the left.
	    */
	    function bit_rol(num, cnt) {
	        return num << cnt | num >>> 32 - cnt;
	    }
	
	    /*
	    * These functions implement the four basic operations the algorithm uses.
	    */
	    function md5_cmn(q, a, b, x, s, t) {
	        return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
	    }
	    function md5_ff(a, b, c, d, x, s, t) {
	        return md5_cmn(b & c | ~b & d, a, b, x, s, t);
	    }
	    function md5_gg(a, b, c, d, x, s, t) {
	        return md5_cmn(b & d | c & ~d, a, b, x, s, t);
	    }
	    function md5_hh(a, b, c, d, x, s, t) {
	        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
	    }
	    function md5_ii(a, b, c, d, x, s, t) {
	        return md5_cmn(c ^ (b | ~d), a, b, x, s, t);
	    }
	
	    /*
	    * Calculate the MD5 of an array of little-endian words, and a bit length.
	    */
	    function binl_md5(x, len) {
	        /* append padding */
	        x[len >> 5] |= 0x80 << len % 32;
	        x[(len + 64 >>> 9 << 4) + 14] = len;
	
	        var i,
	            olda,
	            oldb,
	            oldc,
	            oldd,
	            a = 1732584193,
	            b = -271733879,
	            c = -1732584194,
	            d = 271733878;
	
	        for (i = 0; i < x.length; i += 16) {
	            olda = a;
	            oldb = b;
	            oldc = c;
	            oldd = d;
	
	            a = md5_ff(a, b, c, d, x[i], 7, -680876936);
	            d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
	            c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
	            b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
	            a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
	            d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
	            c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
	            b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
	            a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
	            d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
	            c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
	            b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
	            a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
	            d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
	            c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
	            b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
	
	            a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
	            d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
	            c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
	            b = md5_gg(b, c, d, a, x[i], 20, -373897302);
	            a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
	            d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
	            c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
	            b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
	            a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
	            d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
	            c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
	            b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
	            a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
	            d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
	            c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
	            b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
	
	            a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
	            d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
	            c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
	            b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
	            a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
	            d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
	            c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
	            b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
	            a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
	            d = md5_hh(d, a, b, c, x[i], 11, -358537222);
	            c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
	            b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
	            a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
	            d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
	            c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
	            b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
	
	            a = md5_ii(a, b, c, d, x[i], 6, -198630844);
	            d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
	            c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
	            b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
	            a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
	            d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
	            c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
	            b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
	            a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
	            d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
	            c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
	            b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
	            a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
	            d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
	            c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
	            b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
	
	            a = safe_add(a, olda);
	            b = safe_add(b, oldb);
	            c = safe_add(c, oldc);
	            d = safe_add(d, oldd);
	        }
	        return [a, b, c, d];
	    }
	
	    /*
	    * Convert an array of little-endian words to a string
	    */
	    function binl2rstr(input) {
	        var i,
	            output = '';
	        for (i = 0; i < input.length * 32; i += 8) {
	            output += String.fromCharCode(input[i >> 5] >>> i % 32 & 0xFF);
	        }
	        return output;
	    }
	
	    /*
	    * Convert a raw string to an array of little-endian words
	    * Characters >255 have their high-byte silently ignored.
	    */
	    function rstr2binl(input) {
	        var i,
	            output = [];
	        output[(input.length >> 2) - 1] = undefined;
	        for (i = 0; i < output.length; i += 1) {
	            output[i] = 0;
	        }
	        for (i = 0; i < input.length * 8; i += 8) {
	            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << i % 32;
	        }
	        return output;
	    }
	
	    /*
	    * Calculate the MD5 of a raw string
	    */
	    function rstr_md5(s) {
	        return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
	    }
	
	    /*
	    * Calculate the HMAC-MD5, of a key and some data (raw strings)
	    */
	    function rstr_hmac_md5(key, data) {
	        var i,
	            bkey = rstr2binl(key),
	            ipad = [],
	            opad = [],
	            hash;
	        ipad[15] = opad[15] = undefined;
	        if (bkey.length > 16) {
	            bkey = binl_md5(bkey, key.length * 8);
	        }
	        for (i = 0; i < 16; i += 1) {
	            ipad[i] = bkey[i] ^ 0x36363636;
	            opad[i] = bkey[i] ^ 0x5C5C5C5C;
	        }
	        hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
	        return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
	    }
	
	    /*
	    * Convert a raw string to a hex string
	    */
	    function rstr2hex(input) {
	        var hex_tab = '0123456789abcdef',
	            output = '',
	            x,
	            i;
	        for (i = 0; i < input.length; i += 1) {
	            x = input.charCodeAt(i);
	            output += hex_tab.charAt(x >>> 4 & 0x0F) + hex_tab.charAt(x & 0x0F);
	        }
	        return output;
	    }
	
	    /*
	    * Encode a string as utf-8
	    */
	    function str2rstr_utf8(input) {
	        return unescape(encodeURIComponent(input));
	    }
	
	    /*
	    * Take string arguments and return either raw or hex encoded strings
	    */
	    function raw_md5(s) {
	        return rstr_md5(str2rstr_utf8(s));
	    }
	    function hex_md5(s) {
	        return rstr2hex(raw_md5(s));
	    }
	    function raw_hmac_md5(k, d) {
	        return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d));
	    }
	    function hex_hmac_md5(k, d) {
	        return rstr2hex(raw_hmac_md5(k, d));
	    }
	
	    function md5(string, key, raw) {
	        if (!key) {
	            if (!raw) {
	                return hex_md5(string);
	            }
	            return raw_md5(string);
	        }
	        if (!raw) {
	            return hex_hmac_md5(key, string);
	        }
	        return raw_hmac_md5(key, string);
	    }
	    return md5;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }
/******/ ]);
//# sourceMappingURL=cart.js.map