import 'zepto';
import BASE from 'h5_base';
import base64_encode from 'base64';
import md5 from 'md5';
import VER_CONFIG from 'version';
import Cookie from "cookie";
import Common from "common";

var MYADRESS = {
    settings: {
        login_state: Cookie.get('login_state'),
        token: Cookie.get('token') || '',
        app_uid: Cookie.get('app_uid') || '',
        interfaceUrl: '/hichao/interface.php',
        source : VER_CONFIG.source,
        version : VER_CONFIG.version,
        key : VER_CONFIG.key,
        getDataMethod : 'user.get.address',
        updateAddressMethod : 'user.update.address',
        removeAddressMethod : 'user.delete.address',
        localGoodData : BASE.lang.getUrlParam('good_data'),
        from: BASE.lang.getUrlParam('from'),
        source_id: BASE.lang.getUrlParam('source_id') || '',
        main_image: BASE.lang.getUrlParam('main_image') || '',
        business_id: BASE.lang.getUrlParam('business_id') || '',
        tab_index : BASE.lang.getUrlParam('tab_index') || '',
        sort: BASE.lang.getUrlParam('sort') || '',
        par:{
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
        if(self.settings.token){
            if($('.active-one')){
                $('.header .return').attr('href','/app/templates/order.html?from='+self.settings.from+ '&' + $.param(par) +'&good_data='+encodeURIComponent(self.settings.localGoodData)+'&app_uid=' + self.settings.app_uid + '&token=' + self.settings.token);
            }else{
                Common.setDialog('请选择收货地址');
            }
        }else{  
            if(self.settings.login_state){
                Common.setDialog('请求过于频繁，请稍后再试');
                Cookie.remove('login_state');
            }else{            
                window.location.href = '/app/templates/login.html?from=order&'+$.param(par)+'&good_data='+encodeURIComponent(self.settings.localGoodData);
            }
        }
    },
    getData: function () {
        var self = this,
            url = self.settings.interfaceUrl,
            base64_data = base64_encode.encoder('{"address_id":""}'),
            source = self.settings.source,
            version = self.settings.version,
            key = self.settings.key,
            token = self.settings.token,
            app_uid = self.settings.app_uid,
            method = self.settings.getDataMethod;
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
            success: function (result) {
                if (result.response.msg === "success") {
                    var data = result.response.data;
                    self.doHtml(data);
                    self.doSelect();
                    self.newAddress();
                    self.editAddress();
                    self.removeAddress();
                } else {
                    console.log("接口错误");
                }
            },
            error: function () {
                console.log("请求失败");
            }
        })
    },
    doHtml: function (data) {
        var address_arr = data.address,
            addressHtml = '';
        if (address_arr.length > 0) {
            for (var i = 0; i < address_arr.length; i++) {
                var address = address_arr[i].address,
                    address_id = address_arr[i].address_id,
                    city = address_arr[i].city,
                    cityName = address_arr[i].cityName,
                    consignee = address_arr[i].consignee,
                    district = address_arr[i].district,
                    districtName = address_arr[i].districtName,
                    id_number = address_arr[i].id_number,
                    is_default = address_arr[i].is_default,
                    mobile = address_arr[i].mobile,
                    province = address_arr[i].province,
                    provinceName = address_arr[i].provinceName,
                    zipcode = address_arr[i].zipcode;
                addressHtml += '<div class="item" data-id="' + address_id + '" data-consignee="' + consignee + '" data-mobile="' + mobile + '" data-address="' + address + '" data-zipcode="' + zipcode + '" data-is-default="' + is_default + '" data-province="' + province + '" data-city="' + city + '" data-district="' + district + '" data-provinceName="' + provinceName + '" data-cityName="' + cityName + '" data-districtName="' + districtName + '" data-id-number="' + id_number + '">';
                addressHtml += '<div class="item-con"><p class="name">';
                if (is_default == 1) {
                    addressHtml += '<img class="select-one active-one" src="/app/images/icon_buy_selected@2x.png">';
                } else {
                    addressHtml += '<img class="select-one" src="/app/images/icon_buy_chioce_ont@2x.png">';
                }

                addressHtml += '<span>收货人：' + consignee + '</span></p>'
                if(id_number){
                    addressHtml += '<p class="right">'+id_number+'</p>'
                }
                addressHtml += '<p class="right">' + mobile + '</p>'
                addressHtml += '<p class="right">收货地址：'+provinceName+'省' + cityName + "市" + districtName + " " + address + '</p></div>'
                addressHtml += '<p class="operate"><span class="edit">编辑</span><span class="remove">删除</span></p></div>'
            }
            $('.items').append(addressHtml);

            if($('.item').length == 1){
                $('.item').find('.select-one').addClass('active-one').attr('src', '/app/images/icon_buy_selected@2x.png');
            }
        }
    },
    //选择收货地址
    doSelect: function () {
        var self = this;
        $('.items').on('tap', '.item-con', function () {
            //选择、取消
            $('.select-one').removeClass('active-one').attr('src', '/app/images/icon_buy_chioce_ont@2x.png');
            $(this).find('.select-one').addClass('active-one').attr('src', '/app/images/icon_buy_selected@2x.png');
            var address_id = $(this).parent('.item').attr('data-id');
            var is_default = 0;
            if ($(this).find('.select-one').hasClass('active-one')) {
                is_default = 1  //0 非默认地址  1 默认地址
            } else {
                is_default = 0;
            }
            var url = self.settings.interfaceUrl,
                item = $(this).parent('.item'),
                consignee = item.attr('data-consignee'),
                mobile = item.attr('data-mobile'),
                address = item.attr('data-address'),
                zipcode = item.attr('data-zipcode'),
                province = item.attr('data-province'),
                city = item.attr('data-city'),
                district = item.attr('data-district'),
                id_number = item.attr('data-id-number'),
                base64_data = base64_encode.encoder('{"address_id":"' + address_id + '","consignee":"' + consignee + '","mobile":"' + mobile + '","address":"' + address + '","id_number":"' + id_number + '","zipcode":"' + zipcode + '","is_default":"' + is_default + '","province":"' + province + '","city":"' + city + '","district":"' + district + '","operate":"update"}'),
                source = self.settings.source,
                version = self.settings.version,
                key = self.settings.key,
                token = self.settings.token,
                app_uid = self.settings.app_uid,
                $param = {app_uid:app_uid,token:token},
                method = self.settings.updateAddressMethod;
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
                success: function (result) {
                    if (result.response.msg === "success") {
                        console.log(result)
                       // window.localStorage.setItem("address-data", address_data);
                       // window.location.href = '/app/templates/order.html';
                    } else {
                        alert(result.response.msg);
                        window.location.reload();
                    }
                },
                error: function () {
                    console.log("请求失败");
                }
            })
        })
        //console.log(address_id);
    },
    //新增地址
    newAddress: function () {
        var self = this,
            par = self.settings.par;
        $('.new').on('tap', function () {
            window.location.href = '/app/templates/receive_msg.html?from='+self.settings.from+'&type=new&token=' + self.settings.token + '&'+$.param(par)+'&app_uid=' + self.settings.app_uid+'&good_data=' + encodeURIComponent(self.settings.localGoodData);
        })
    },
    //编辑地址
    editAddress: function () {
        var self = this;
        $('.items').on('tap', '.edit', function () {
            var item = $(this).parents('.item'),
                token = self.settings.token,
                source_id = self.settings.source_id,
                business_id = self.settings.business_id,
                main_image = self.settings.main_image,
                tab_index = self.settings.tab_index,
                sort = self.settings.sort,
                app_uid = self.settings.app_uid,
                address_id = item.attr('data-id'),
                consignee = item.attr('data-consignee'),
                mobile = item.attr('data-mobile'),
                address = item.attr('data-address'),
                zipcode = item.attr('data-zipcode'),
                is_default = item.attr('data-is-default'),
                operate = 'update',
                provinceId = item.attr('data-province'),
                cityId = item.attr('data-city'),
                districtId = item.attr('data-district'),
                provinceName = item.attr('data-provinceName'),
                cityName = item.attr('data-cityName'),
                districtName = item.attr('data-districtName'),
                id_number = item.attr('data-id-number'),
                address_data = '{"address_id":"' + address_id + '","consignee":"' + consignee + '","mobile":"' + mobile + '","address":"' + address + '","zipcode":"' + zipcode + '","is_default":"' + is_default + '","operate":"' + operate + '","provinceId":"' + provinceId + '","cityId":"' + cityId + '","districtId":"' + districtId + '","provinceName":"' + provinceName + '","cityName":"' + cityName + '","districtName":"' + districtName + '","id_number":"' + id_number + '"}',
                $param = {
                    type: 'edit',
                    token: token,
                    app_uid: app_uid,
                    provinceId: provinceId,
                    provinceName: provinceName,
                    cityId: cityId,
                    cityName: cityName,
                    districtId: districtId,
                    districtName: districtName,
                    consignee: consignee,
                    id_number: id_number,
                    mobile: mobile,
                    address: address,
                    address_id:address_id,
                    source_id: source_id,
                    business_id: source_id,
                    main_image: main_image,
                    tab_index: tab_index,
                    sort: sort
                };

            window.console.log(address_data)
            window.localStorage.setItem("address-data", address_data);
            window.location.href = '/app/templates/receive_msg.html?from='+self.settings.from+'&' + $.param($param)+'&good_data='+encodeURIComponent(self.settings.localGoodData);
        })
    },
    //删除地址
    removeAddress: function () {
        var self = this;
        $('.items').on('tap', '.remove', function () {
            var address_id = $(this).parents('.item').attr('data-id'),
                _this = $(this).parents('.item'),
                url = self.settings.interfaceUrl;
            var base64_data = base64_encode.encoder('{"address_id":"' + address_id + '"}'),
                source = self.settings.source,
                version = self.settings.version,
                token = self.settings.token,
                app_uid = self.settings.app_uid,
                method = self.settings.removeAddressMethod,
                key = self.settings.key;
            if (confirm('确定要删除该收货地址吗？')) {
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
                    success: function (result) {
                        window.console.log(result);
                        if (result.response.msg === "success") {
                            Common.setDialog("删除成功！");
                            _this.remove();
                            if($('.item').length == 1){
                                $('.item').find('.select-one').addClass('active-one').attr('src', '/app/images/icon_buy_selected@2x.png');
                            }
                        } else {
                            alert("接口错误");
                            window.location.reload();
                        }
                    },
                    error: function () {
                        console.log("请求失败");
                    }
                })
            }
        });
    }
}
MYADRESS.init();
