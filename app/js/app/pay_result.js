import 'zepto';
import BASE from 'h5_base';
import base64_encode from 'base64';
import md5 from 'md5';
import VER_CONFIG from 'version';
import Common from "common";


var showtype = BASE.lang.getUrlParam('type');
if(showtype === 'success'){
	$('.success').removeClass('hide');
}else if(showtype === 'fail'){
	$('.fail').removeClass('hide');
}else if(showtype === 'wechat'){
	$('.wechat').removeClass('hide');
}else if(showtype === 'is_overseas_order'){
	$('.is_overseas_order').removeClass('hide');
}

$('#pay_result').height($(window).height());

$('.to-down').on('tap',function(){
	if(confirm('是否去下载APP')){
        window.location.href = 'http://a.myapp.com/o/simple.jsp?pkgname=com.haobao.wardrobe&g_f=991653';
    }
})