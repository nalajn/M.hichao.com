/**
 * Created by MXYC-PC on 2015/11/17.
 */
import 'zepto';
import BASE from "h5_base";
import VER_CONFIG from 'version';
import base64_encode from 'base64';
import md5 from 'md5';
import Cookie from "cookie";
import Common from "common";

var CHECKADDRESS = {
    settings: {
        addressInforUrl: '/hichao/interface.php',
        addressProvinceHtml: '<li class="province" id="{REGIONID}" parentId="{PARENTID}">{PROVINCE}</li>',
        addressCityHtml: '<li class="city" id="{CITYId}">{CITY}</li>',
        addressAreaHtml: '<li class="area" id="{AREAID}">{AREA}</li>',
        addressAllAreaHtml: '<li class="all_area active" >全区</li>',
        localstorage_com: JSON.parse(localStorage.getItem('province')),
        fromUrl: BASE.lang.getUrlParam('from') || '',
        token: Cookie.get('token') || '',
        app_uid: Cookie.get('app_uid') || '',
        consignee: BASE.lang.getUrlParam('consignee') || '',
        id_number: BASE.lang.getUrlParam('id_number') || '',
        mobile: BASE.lang.getUrlParam('mobile') || '',
        address: BASE.lang.getUrlParam('address') || '',
        type: BASE.lang.getUrlParam('type') || '',
        address_id: BASE.lang.getUrlParam('address_id') || '',
        dq_province: '',
        localGoodData : BASE.lang.getUrlParam('good_data'),
        source_id: BASE.lang.getUrlParam('source_id'),
        business_id: BASE.lang.getUrlParam('business_id'),
        main_image: BASE.lang.getUrlParam('main_image'),
        tab_index: BASE.lang.getUrlParam('tab_index'),
        sort: BASE.lang.getUrlParam('sort') || '',
        from: BASE.lang.getUrlParam('from')
    },
    init: function() {
        var self = this;
        Common.init();
        self.showData();

        $('.return').on('tap',function(){
            if(confirm('是否保存地址')){
                self.saveAddress();
            }
        })
    },
    //显示数据
    showData: function() {
        var self = this,
            addressSelect = '';
        self.settings.localstorage_com = JSON.parse(localStorage.getItem('province'));
        if (self.settings.localstorage_com) {
            for (let i of self.settings.localstorage_com) {
                addressSelect += BASE.lang.sub(self.settings.addressProvinceHtml, {
                    PROVINCE: i.regionName,
                    REGIONID: i.regionId,
                    PARENTID: i.parentId
                });

            }
            self.settings.dq_province = addressSelect;
            $('.address_select ul').html(addressSelect);
        } else {
            self.getAddress();
        }
        self.bindEvent();
    },
    //绑定事件
    bindEvent: function() {
        //点击切换省份
        var self = this;
        $('.address_select ul li').on('tap', function() {
            var data_index = $(this).index(),
                // pro_index = $(this).index(),
                city_show = $('.address_nav .province').attr('data_index'),
                area_show = $('.address_nav .city').attr('data_index'),
                appendCityHtml = '',
                appendAreaHtml = '';
            $(this).addClass('active').siblings().removeClass('active');
            // for (var i of self.settings.localstorage_com[data_index].children) {
            //     console.log(i)
            //     appendCityHtml += BASE.lang.sub(self.settings.addressCityHtml, {
            //         CITY: i.regionName,
            //         CITYId: i.regionId
            //     });
            //     if (areaIndex) {
            //         for (var n of self.settings.localstorage_com[areaIndex].children[data_index].children) {
            //             console.log(n)
            //             appendAreaHtml += BASE.lang.sub(self.settings.addressAreaHtml, {
            //                 AREA: n.regionName,
            //                 AREAID: n.regionId
            //             });
            //         }
            //     }
            // }
            if ($(this).hasClass('province')) {
                $('.address_nav .province').html($('.province.active').text()).prop('id', $(this).prop('id')).attr('data_index', data_index).siblings('.city').addClass('on').siblings('span').removeClass('on');
                for (var i of self.settings.localstorage_com[data_index].children) {
                    console.log(i)
                    appendCityHtml += BASE.lang.sub(self.settings.addressCityHtml, {
                        CITY: i.regionName,
                        CITYId: i.regionId
                    });
                }
                $('.address_select ul').html(appendCityHtml);
                self.bindEvent();
            } else if ($(this).hasClass('city')) {
                $('.address_nav .city').html($('.city.active').text()).prop('id', $(this).prop('id')).attr('data_index', data_index).siblings('.area').addClass('on').siblings('span').removeClass('on');
                if (city_show) {
                    for (var n of self.settings.localstorage_com[city_show].children[data_index].children) {
                        console.log(n)
                        appendAreaHtml += BASE.lang.sub(self.settings.addressAreaHtml, {
                            AREA: n.regionName,
                            AREAID: n.regionId
                        });
                    }
                }
                
                $('.address_select ul').html(appendAreaHtml);
                self.bindEvent();
            } else if ($(this).hasClass('area')) {
                $('.address_nav .area').html($('.area.active').text()).prop('id', $(this).prop('id')).siblings('.area_all').addClass('on').siblings('span').removeClass('on');
                $('.address_select ul').html(self.settings.addressAllAreaHtml);
                self.bindEvent();
            }

        });
        //全区
        $('.address_nav span').on('tap', function() {
            var appendCityHtml = '',
                appendAddressAreaHtml = '',
                appendAllAreaHtml = '',
                province_index,
                city_index;

            if ($(this).hasClass('province')) {
                $(this).addClass('on').siblings('span').removeClass('on');
                var addressSelect = self.settings.dq_province;
                $('.address_select ul').html(addressSelect);
                $('.address_nav .city').html('市');
                $('.address_nav .area').html('区');
                self.bindEvent();
            }
            if ($(this).hasClass('city') && $('.address_nav .province').attr('data_index')) {
                $(this).addClass('on').siblings('span').removeClass('on');
                province_index = $('.address_nav .province').attr('data_index');
                for (var i of self.settings.localstorage_com[province_index].children) {
                    appendCityHtml += BASE.lang.sub(self.settings.addressCityHtml, {
                        CITY: i.regionName,
                        CITYID: i.regionId
                    });
                }
                $('.address_select ul').html(appendCityHtml);
                $('.address_nav .area').html('区');
                self.bindEvent();
            }
            if ($(this).hasClass('area') && $('.address_nav .city').attr('data_index')) {
                $(this).addClass('on').siblings('span').removeClass('on');
                province_index = $('.address_nav .province').attr('data_index');
                city_index = $('.address_nav .city').attr('data_index');
                if(city_index){
                    for (var i of self.settings.localstorage_com[province_index].children[city_index].children) {
                        appendAddressAreaHtml += BASE.lang.sub(self.settings.addressAreaHtml, {
                            AREA: i.regionName,
                            AREAID: i.regionId
                        });
                    }
                }
                $('.address_select ul').html(appendAddressAreaHtml);
                self.bindEvent();
            }
            if ($(this).hasClass('area_all')) {
                appendAllAreaHtml = self.settings.addressAllAreaHtml;
                $('.address_select ul').html(appendAllAreaHtml);
                self.bindEvent();
            }

        });
        //保存
        $('.save').on('tap', function() {
            self.saveAddress();
        });

    },
    saveAddress: function(){
        var self = this;
        if ($('.address_select ul li').hasClass('all_area') && $('.address_nav .area') !== '区') {
            var token = self.settings.token,
                app_uid = self.settings.app_uid,
                consignee = self.settings.consignee,
                id_number = self.settings.id_number,
                mobile = self.settings.mobile,
                address_id=self.settings.address_id,
                address = self.settings.address,
                type = self.settings.type,
                source_id = self.settings.source_id,
                business_id = self.settings.business_id,
                main_image = self.settings.main_image,
                tab_index = self.settings.tab_index,
                sort = self.settings.sort,
                $pram = '';
            if (token && app_uid) {
                $pram = {
                    provinceName: $('.address_nav .province').text(),
                    provinceId: $('.address_nav .province').prop('id'),
                    cityName: $('.address_nav .city').text(),
                    cityId: $('.address_nav .city').prop('id'),
                    districtName: $('.address_nav .area').text(),
                    districtId: $('.address_nav .area').prop('id'),
                    token: token,
                    app_uid: app_uid,
                    consignee: consignee,
                    id_number: id_number,
                    mobile: mobile,
                    address: address,
                    address_id:address_id,
                    type: type,
                    source_id: source_id,
                    business_id: business_id,
                    main_image: main_image,
                    tab_index: tab_index,
                    sort: sort
                };
            } else {
                $pram = {
                    regionName: $('.address_nav .area').text(),
                    regionId: $('.address_nav .area').prop('id'),
                    source_id: source_id,
                    business_id: business_id,
                    main_image: main_image,
                    tab_index: tab_index,
                    sort: sort
                };
            }
            if (self.settings.fromUrl) {
                var formHtml = '/app/templates/receive_msg.html?from='+self.settings.from+'&' + $.param($pram) + '&good_data=' + self.settings.localGoodData;
                window.location.href = formHtml;
            }
            console.log(formHtml)

        }else{
            Common.setDialog('请选择地区');
        }
    },
    //获取省份
    getAddress: function() {
        var self = this;
        var url = self.settings.addressInforUrl;
        var base64_data = '',
            source = VER_CONFIG.source,
            version = VER_CONFIG.version,
            method = 'region.message.get',
            key = VER_CONFIG.key;
        var data = {
            source: source,
            version: version,
            method: method,
            token: '',
            app_uid: '',
            data: base64_data,
            sign: md5('' + source + version + method + base64_data + key)
        }
        self.operate(url, data);
    },
    // ajax
    operate: function(url, data) {
        var self = this;
        var addressSelect = '';
        $.ajax({
            type: 'post',
            url: url,
            data: data,
            dataType: 'json',
            success: function(result) {
                if (result.response && result.response.msg == 'success') {
                    localStorage.setItem('province', JSON.stringify(result.response.data.region));
                    self.showData();
                } else {
                    console.log('接口错误');
                }

            },
            error: function() {
                console.log("请求失败");
            }
        });

    }


}
CHECKADDRESS.init();