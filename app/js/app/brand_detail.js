import 'zepto';
import BASE from 'h5_base';
import VER_CONFIG from 'version';
import  Cookie from "cookie";
import Common from "common";

var BRANDDETAIL = {
    settings: {
        token: Cookie.get('token')||'',
        app_uid: Cookie.get('app_uid')||'',
        source : VER_CONFIG.source,
        version : VER_CONFIG.version,
        key : VER_CONFIG.key,
        getDataUrl : '/hichao/goods/sale_goods_list.php',
        getDataMethod : 'goods.cart.get',
        doRemoveOneMethod : 'goods.cart.remove',
        cleanCartMethod : 'goods.cart.clean',
        business_id: BASE.lang.getUrlParam('id') || 43,
        tab_index: BASE.lang.getUrlParam('tab_index'),
        sort: BASE.lang.getUrlParam('sort') || ''
    },
    init: function () {
        var self = this,
            tab_index = self.settings.tab_index,
            sort = self.settings.sort || $('.tab_tit li').eq(tab_index).attr('data-sort'),
            fg = 1,
            sort;
        BASE.lang.adapt();
        console.log(tab_index,sort)
        if(tab_index){
            if(sort == 2){
                $('.tab_tit li').eq(tab_index).addClass('down').removeClass('up');
            }
            if(sort == 1){
                $('.tab_tit li').eq(tab_index).removeClass('down').addClass('up');
            }
            self.getData(sort,1);
            
        }else{
            self.getData(4,1);
        }

        //埋点
        var t = new Date(),
            ts = t.getFullYear()+'-'+t.getMonth()+1+'-'+t.getDate()+' '+t.getHours()+':'+t.getMinutes()+':'+t.getSeconds(),
            events = {
                "eventname": "brand_c",
                "brand_id": self.settings.business_id,
                "ts": ts
            }
        Common.sendAnchor(events);

        //第一次滑动加载
        self.scrollAdd();

        //tab切换
        $('.tab_tit').on('tap','li',function(){
            $('.no_more').hide();
            if($(this).hasClass('price')){
                if(fg == 0){
                    $(this).attr('data-sort','2').addClass('down').removeClass('up');
                    fg = 1;
                }else{
                    $(this).attr('data-sort','1').removeClass('down').addClass('up');
                    fg = 0;
                }
            }else{
                $('.price').removeClass('up').removeClass('down');
            }
            $('#brand_detail').attr('data-flag','');
            sort = $(this).attr('data-sort');
            $('.tab_con').html('')
            self.getData(sort,2,0);
            self.scrollAdd();
        })
        if(self.settings.tab_index){
            $('.tab_tit li').removeClass('active');
            $('.tab_tit li').eq(self.settings.tab_index).addClass('active');
        }
    },
    scrollAdd: function(){
        var self = this;
        //滑动加载
        $(window).scroll(function () {
            var sort = $('.tab_tit .active').attr('data-sort'),
                flag = $('#brand_detail').attr('data-flag');
            
            if (($(window).height() + $(window).scrollTop()) >= $('body').height()) {
                if(flag){
                    $("#page_tag_load").show();//loading图
                    self.getData(sort,2,flag); 
                }else{
                    $('.no_more').show();
                }
            }
            
        })
    },
    getData: function(sort,index,flag){
        var self = this,
            url = self.settings.getDataUrl;
        $.ajax({
            type: 'get',
            url: url,
            data: {
                business_id: self.settings.business_id,
                source: self.settings.source,
                version: self.settings.version,
                fg: 1,
                sort: sort,
                flag: flag
            },
            dataType: 'json',
            success: function(result){
                if (result.response.msg === "success") {
                    var data = result.response.data,
                        flag = data.flag ? data.flag : '';
                    $('#brand_detail').attr('data-flag',flag);
                    self.doHtml(data,index);
                    Common.switchTab($('.tabs'));

                } else {
                    alert(result.response.msg);
                }
            },
            error: function(){
                console.log("请求失败");
            }
        })
    },
    doHtml: function(data,index){
        $("#page_tag_load").hide();
        window.console.log(data);
        var self = this,
            brandIntro = data.brandIntroduction && data.brandIntroduction.action ? data.brandIntroduction.action : '',
            goods = data.items,
            business_id = data.business_id;
        $('.tab_con').attr('data-business_id',business_id);
        
        if(index == 1){
            /*商家信息*/
            if(brandIntro) {
                var brand = {
                    title: data.brand_title,
                    webUrl: brandIntro.webUrl,
                    actionType: brandIntro.actionType,
                    business_name: data.business_name,
                    business_banner_url: data.business_banner_url
                };
                var headHtml = '';
                headHtml += '<img data-main-image="0" src="'+brand.business_banner_url+'" width="100%">';
                headHtml += '<a class="last-page position" href=""></a>';
                headHtml += '<a class="share position" href=""></a>';
                headHtml += '<h1 class="tit position">'+brand.business_name+'</h1>';
                headHtml += '<a class="tag position">'+brand.title+'</a>';
                headHtml += '<a class="shop-name position" href="'+brand.webUrl+'">品牌故事</a>';
                $('.head').append(headHtml);
            }
        }
        /*商品列表*/
        if(goods.length) {
            var dlHtml = '';
            $.each(goods,function(i,item){
                var goods_component = item.component ? item.component : '',
                    goods_action = goods_component ? goods_component.action : '',
                    sale_class = '';
                if(goods_action) {
                    var good_item = {
                        actionType: goods_action.actionType,
                        id: goods_action.id,
                        sales: goods_action.sales,
                        source: goods_action.source,
                        sourceId: goods_action.sourceId,
                        type: goods_action.type,
                        description: goods_component.description,
                        picUrl: goods_component.picUrl,
                        price: goods_component.price,
                        stateMessage: goods_component.stateMessage,
                        eventIcon: goods_component.eventIcon
                    };
                    if(good_item.stateMessage != '已售罄'){
                        sale_class = 'hide'
                    }
                    dlHtml += '<dl data-main-image="0" data-actionType="' + good_item.actionType + '" data-id="' + good_item.id + '" data-source="' + good_item.source + '" data-sourceId="' + good_item.sourceId + '" data-type="' + good_item.type + '">';
                    dlHtml += '<dt><div class="saleout"><div class="bac '+sale_class+'">'
                    dlHtml += '<p class="out_tag"></p></div ><p class="out_txt '+sale_class+'">已售罄</p>'
                    dlHtml += '<img src="' + good_item.picUrl + '" width="100%">'
                    if(good_item.eventIcon){
                        dlHtml += '<img class="eventIcon" src="'+good_item.eventIcon+'">'
                    }
                    dlHtml += '</div></dt><dd>' + good_item.description + '</dd>';
                    dlHtml += '<dd><span class="price">￥' + good_item.price + '</span>';
                    dlHtml += '<span class="num">销量' + good_item.sales + '笔</span></dd>';
                    dlHtml += '</dl>';
                }
            });
            $('.tab_con').append(dlHtml);

            /*绑定tap 跳转到商品详情*/
            $('dl').on('tap',function(){
                var sourceId = $(this).attr('data-sourceId'),
                    main_image = $(this).attr('data-main-image'),
                    business_id = $('.tab_con').attr('data-business_id'),
                    tab_index = $('.tab_tit .active').index(),
                    sort = $('.tab_tit .active').attr('data-sort');
                window.location.href = '/app/templates/good_detail.html?tab_index='+tab_index+'&sort='+sort+'&source_id='+sourceId+'&main_image='+main_image+'&business_id='+business_id;
            })
        }
    }
};
BRANDDETAIL.init();
