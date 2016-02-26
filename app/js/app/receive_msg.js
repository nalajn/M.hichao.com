import 'zepto';
import BASE from 'h5_base';
import base64_encode from 'base64';
import md5 from 'md5';
import VER_CONFIG from 'version';
import  Cookie from "cookie";
import Common from "common";

var MYADRESS = {
    settings: {
        //fromUrl: BASE.lang.getUrlParam('from') || '',
        token: Cookie.get('token') || '',
        app_uid:  Cookie.get('app_uid') || '',
        provinceId: BASE.lang.getUrlParam('provinceId') || '',
        provinceName: BASE.lang.getUrlParam('provinceName') || '',
        cityId: BASE.lang.getUrlParam('cityId') || '',
        cityName: BASE.lang.getUrlParam('cityName') || '',
        districtId: BASE.lang.getUrlParam('districtId') || '',
        districtName: BASE.lang.getUrlParam('districtName') || '',
        consignee: BASE.lang.getUrlParam('consignee') || '',
        id_number: BASE.lang.getUrlParam('id_number') || '',
        mobile: BASE.lang.getUrlParam('mobile') || '',
        address: BASE.lang.getUrlParam('address') || '',
        address_id: BASE.lang.getUrlParam('address_id') || '',
        interfaceUrl: '/hichao/interface.php',
        type: BASE.lang.getUrlParam('type'),
        localGoodData : BASE.lang.getUrlParam('good_data'),
        source_id: BASE.lang.getUrlParam('source_id'),
        business_id: BASE.lang.getUrlParam('business_id'),
        main_image: BASE.lang.getUrlParam('main_image'),
        tab_index: BASE.lang.getUrlParam('tab_index'),
        sort: BASE.lang.getUrlParam('sort') || '',
        from: BASE.lang.getUrlParam('from'),
        par:{
            from: BASE.lang.getUrlParam('from'),
            source_id: BASE.lang.getUrlParam('source_id'),
            business_id: BASE.lang.getUrlParam('business_id'),
            main_image: BASE.lang.getUrlParam('main_image'),
            tab_index: BASE.lang.getUrlParam('tab_index'),
            sort: BASE.lang.getUrlParam('sort') || ''
        }
    },
    init: function () {
        var self = this,
            par = self.settings.par,
            consignee_old = BASE.lang.getUrlParam('consignee'),
            id_number_old = BASE.lang.getUrlParam('id_number'),
            mobile_old = BASE.lang.getUrlParam('mobile'),
            address_old = BASE.lang.getUrlParam('provinceName')+BASE.lang.getUrlParam('cityName')+BASE.lang.getUrlParam('districtName'),
            address_detail_old = BASE.lang.getUrlParam('address');
        BASE.lang.adapt();
        Common.init();
        self.getData();

        //点击删除按钮清空文本框
        $('.delete').on('tap',function(){
            $(this).addClass('hide').prev('input').val('');
        })
        $('.box input').blur(function(){
            $(this).next('.delete').addClass('hide');
        })

        $('.box input').on('keyup',function(){
            if($(this).val()){
                $(this).next('.delete').removeClass('hide');
            }
        })


        $('.items input').focus(function(){
            if($(this).val()){
                $(this).next('.delete').removeClass('hide');
            }
            $('.verif').addClass('hide');
        })
        $('.return').on('tap',function(){
            if(self.settings.type == 'edit'){  //类型为编辑的时候判断内容是否改变
                var consignee_new = $('.consignee').val(),
                    id_number_new = $('.id_number').val(),
                    mobile_new = $('.mobile').val(),
                    address_new = $('.address').val(),
                    address_detail_new = $('.address-detail');
                if(consignee_old == consignee_new && id_number_old == id_number_new && mobile_old == mobile_new && address_old == address_new && address_detail_old == address_detail_new){
                    window.location.href = window.location.href = '/app/templates/my_address.html?'+ $.param(par)+'&good_data='+encodeURIComponent(self.settings.localGoodData);
                }else{
                    if(confirm('是否保存地址')){
                        self.saveAddress();
                    }
                }
            }else{
                if(confirm('是否放弃新增地址')){     
                    window.location.href = window.location.href = '/app/templates/my_address.html?'+ $.param(par)+'&good_data='+encodeURIComponent(self.settings.localGoodData);
                }else{
                    self.saveAddress();
                }
            }
        })
    },
    getData: function () {
        var self = this,
            address_data = JSON.parse(window.localStorage.getItem("address-data")),
            type = self.settings.type;
        if (self.settings.provinceId && self.settings.cityId && self.settings.districtId) {
            $('.address').val(self.settings.provinceName + ' ' + self.settings.cityName + ' ' + self.settings.districtName);
            $('.consignee').val(self.settings.consignee);
            $('.id_number').val(self.settings.id_number);
            $('.mobile').val(self.settings.mobile);
            $('.address-detail').val(self.settings.address);
             self.saveEdit(self.settings, type);
        }else{
            self.saveEdit(address_data, type);
        }
       
    },
    saveEdit: function (data, type) {
        var self = this,
            source_id = self.settings.source_id,
            business_id = self.settings.business_id,
            main_image = self.settings.main_image,
            tab_index = self.settings.tab_index,
            sort = self.settings.sort;
        //当编辑地址时，预设地址信息
        if (type == 'edit') {
            var address_id = data.address_id,
                consignee = data.consignee,
                id_number = data.id_number,
                mobile = data.mobile,
                address = data.address,
                provinceName = data.provinceName,
                cityName = data.cityName,
                districtName = data.districtName;
            // operate = data.operate;
            $('.consignee').val(consignee);
            $('.id_number').val(id_number);
            $('.mobile').val(mobile);
            $('.address-detail').val(address).attr('data-id', address_id);
            $('.address').val(provinceName + cityName + districtName);

            if (address) {
                $('.choice-address').text(address);
            }
        }
        //选择地址
        $('.address').on('tap', function () {
            var $parm = {
                consignee: $('.consignee').val(),
                id_number: $('.id_number').val(),
                mobile: $('.mobile').val(),
                address: $('.address-detail').val(),
                token: self.settings.token,
                type:self.settings.type,
                address_id:self.settings.address_id,
                app_uid: self.settings.app_uid,
                // from: 'receive_msg',
                from: self.settings.from,
                source_id: self.settings.source_id,
                business_id: self.settings.business_id,
                main_image: self.settings.main_image,
                tab_index: self.settings.tab_index,
                sort: self.settings.sort
            };
            window.location.href = '/app/templates/check_address.html?' + $.param($parm) + '&good_data=' + self.settings.localGoodData;
        });
        //保存

        $('.save').on('tap', function () {
            self.saveAddress();
        })
    },
    saveAddress: function(){
        var self = this,
            operate,
            type = self.settings.type;
        if (type == 'edit') {
            operate = 'update';
        } else {
            operate = 'insert';
        }

        var url,
            order_type = window.localStorage.getItem("is_overseas_order"),
            address_id = $('.address-detail').attr('data-id'),
            consignee = $.trim($('.consignee').val()),
            mobile = $.trim($('.mobile').val()),
            province = self.settings.provinceId,
            city = self.settings.cityId,
            district = self.settings.districtId,
            address = $.trim($('.address-detail').val()),
            id_number = $.trim($('.id_number').val()),
            zipcode = '100000',
            is_default = 0,  //0 非默认地址  1 默认地址
            base64_data = base64_encode.encoder('{"address_id":"' + address_id + '","consignee":"' + consignee + '","mobile":"' + mobile + '","address":"' + address + '","id_number":"' + id_number + '","zipcode":"' + zipcode + '","is_default":"' + is_default + '","province":"' + province + '","city":"' + city + '","district":"' + district + '","operate":"' + operate + '"}'),
            source = VER_CONFIG.source,
            version = VER_CONFIG.version,
            token = self.settings.token,
            app_uid = self.settings.app_uid,
            method = 'user.update.address',
            key = VER_CONFIG.key,
            source_id = self.settings.source_id,
            business_id = self.settings.business_id,
            main_image = self.settings.main_image,
            tab_index = self.settings.tab_index,
            sort = self.settings.sort,
            url = self.settings.interfaceUrl;
        var $parm = {token: token, app_uid: app_uid,source_id: source_id,business_id: business_id,main_image: main_image,tab_index: tab_index,sort:sort};
        if (!consignee) {
            $('.verif').removeClass('hide').html('请填写收货人姓名');
        }else if(consignee.length > 16){
            $('.verif').removeClass('hide').html('姓名过长，无法保存');
        }else if (order_type == 1 && !id_number) {
            $('.verif').removeClass('hide').html('请填写正确的身份证号');
        }else if (!mobile || !BASE.regexp.isMobile($('.mobile').val())){
            $('.verif').removeClass('hide').text('请输入正确的手机号');
        }else if (!address || !$('.address').val()) {
            $('.verif').removeClass('hide').html('请填写地址信息');
        }
        else {

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
                        // alert('保存成功！')
                        Common.setDialog('保存成功！');
                         window.location.href = '/app/templates/my_address.html?from='+self.settings.from+'&'+ $.param($parm)+ '&good_data=' + self.settings.localGoodData;
                    } else {
                        alert(result.response.msg);
                    }
                },
                error: function () {
                    console.log("请求失败");
                }
            })
        }
    }
}
MYADRESS.init();
