var _BiTj_domain_url="http://h5.helix.hichao.com" ;
var _BiTj_domain="hichao.com";
var _BjTj_subChannel=['h5'];
var _BjTj_cookie_user='tj_username';
if (typeof(window._BiTj) != 'undefined'){
	var _BiErrTj = window._BiErrTj || {};
	_BiErrTj = {
		_errEvent:function(){
			try{
				var randomInt = Math.round(Math.random() * 1000000);
				var tmpTime = new Date().getTime();
				randomInt = tmpTime + randomInt ;
				var cURL = document.URL ;
				var a=document.createElement('img');
				var url = _BiTj_domain_url+'/err.gif?errtype=muti&url='+encodeURIComponent(cURL)+'&pagetype='+encodeURIComponent(pagetype_php)+'&birand='+randomInt ;
				a.src=url;
			} catch(e){};
		} 
	}; 
	try {_BiErrTj._errEvent();} catch(e){};
}else{
	var _BiTj = window._BiTj || {};
	_BiTj = {
		_tongji:function(){
			var tongji_width=document.body.clientWidth || document.documentElement.clientWidth;
			var tongji_height=document.body.clientHeight || document.documentElement.clientHeight;
			var tongji_pixel_page=100000;
			var tongji_ds = ds_php;
			if(tongji_ds !='1' && top.location!=self.location && (tongji_width*tongji_height)<tongji_pixel_page ){
	            var bitongji_img = document.createElement('img');
	            bitongji_img.src = _BiTj_domain_url+'/err.gif?width=' + tongji_width + '&height=' + tongji_height;
	            bitongji_img.width = 1;
	            bitongji_img.height = 1;
	            bitongji_img.style.display='none';
	            document.body.appendChild(bitongji_img);
			}else{
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
				var tongji_img_url = _BiTj_domain_url+'/tongji.gif';
				var cookie_domain = _BiTj_domain;
				var url_domain = '.'+_BiTj_domain;
				var _separatorV = '|';
				var _separatorS = '||';
				var page_type = log_tongji_container.patetype;
				var tongjiv = _tongji_cookie('__tongjiv');
				var tongjis = _tongji_cookie('__tongjis');
				if(tongjis){
					var before_external_source = _BiTj._getExternalSource();
					var current_external_source = _tongji_externalSource(log_tongji_container.last_refer);
					if (current_external_source != 'nonMarketingSE' && before_external_source != current_external_source){
						_tongji_cookie('__tongjis', '', { path: '/', domain: cookie_domain, secure: 0, expires: -1 });
						tongjis = '';
					}
					if (current_external_source =='marketing' && before_external_source == 'marketing'){
						var before_tongjis_splic = tongjis.split(_separatorS);
						var before_fromid = before_tongjis_splic[1]||"-";
						var current_fromid = _tongji_GetFromid(log_tongji_container.url,log_tongji_container.last_refer);
						if (before_fromid != current_fromid && current_fromid !='-'){
							_tongji_cookie('__tongjis', '', { path: '/', domain: cookie_domain, secure: 0, expires: -1 });
							tongjis = '';
						}						
					}
				}
				if(! tongjiv && ! tongjis)
				{
					log_tongji_container.entry_time = log_tongji_container.current_time;
					log_tongji_container.first_refer = log_tongji_container.last_refer;
					log_tongji_container.visitor_id = visitor_id_php;
					log_tongji_container.visits_count = 1;
					log_tongji_container.pv_count = 1;
					log_tongji_container.global_landing  = log_tongji_container.pagetype;
					log_tongji_container.channel_landing = log_tongji_container.pagetype;
					if (-1 !== log_tongji_container.url.indexOf('ifid='))
					{
						log_tongji_container.ifid = tongji_serialize_str(log_tongji_container.url, 'ifid=', '&');
					}
					else
					{
						log_tongji_container.ifid = '-';
					}
					log_tongji_container.external_source = _tongji_externalSource();
					log_tongji_container.internal_source = '-';
					var _pagetype=log_tongji_container.pagetype.toLowerCase();
					var arr_pagetype=_pagetype.split(".");
					log_tongji_container.reserve_a=arr_pagetype[0];
					log_tongji_container.fromid=_tongji_GetFromid(log_tongji_container.url,log_tongji_container.first_refer);
				}
				else
				{
					var last_refer = tongji_parse_url(log_tongji_container.last_refer);
					var tongjiv_splic = tongjiv.split(_separatorV);
					if (tongjiv && ! tongjis)
					{
						if (tongjiv_splic && tongjiv_splic.length)
						{
							log_tongji_container.visitor_id      = tongjiv_splic[0];
							log_tongji_container.visits_count    = parseInt(tongjiv_splic[1])+1;
						}
						log_tongji_container.entry_time = log_tongji_container.current_time;
						log_tongji_container.first_refer = log_tongji_container.last_refer;
						log_tongji_container.pv_count = 1;
						var tongjis_fromid='-';
						var tongjis_ifid='-';
						log_tongji_container.external_source=_tongji_externalSource();
						var tongjis_internal_source='-';
						var tongjis_global_landing=log_tongji_container.pagetype;
						var tongjis_channel_landing=log_tongji_container.pagetype;
						var _pagetype=log_tongji_container.pagetype.toLowerCase();
						var arr_pagetype=_pagetype.split(".");
						log_tongji_container.reserve_a=arr_pagetype[0];
						log_tongji_container.fromid=_tongji_GetFromid(log_tongji_container.url,log_tongji_container.first_refer);
					}
					else if(tongjiv && tongjis)
					{
						if (tongjiv_splic && tongjiv_splic.length)
						{
							log_tongji_container.visitor_id      = tongjiv_splic[0];
							log_tongji_container.visits_count = tongjiv_splic[1];
						}
						var tongjis_splic = tongjis.split(_separatorS);
						if (tongjis_splic && tongjis_splic.length)
						{
							log_tongji_container.entry_time      = tongjis_splic[0];
							log_tongji_container.fromid          = tongjis_splic[1] || '-';
							var tongjis_ifid            = tongjis_splic[2] || '-';
							log_tongji_container.external_source = tongjis_splic[3] || '-';
							var tongjis_internal_source = tongjis_splic[4] || '-';
							log_tongji_container.internal_source = tongjis_splic[4] || '-';
							log_tongji_container.first_refer     = tongjis_splic[5] || '-';
							var tongjis_global_landing  = tongjis_splic[6] || '-';
							var tongjis_channel_landing = tongjis_splic[7] || '-';
							log_tongji_container.pv_count        = parseInt(tongjis_splic[8])+1;
							log_tongji_container.reserve_a        = tongjis_splic[15] || '-';
						}
						var _reserve_a=log_tongji_container.reserve_a;
						var _pagetype=log_tongji_container.pagetype.toLowerCase();
						var arr_pagetype=_pagetype.split(".");
						if(_reserve_a!=arr_pagetype[0]){
							log_tongji_container.internal_source=_reserve_a;
							log_tongji_container.reserve_a=arr_pagetype[0];
						}
					}
					if ((-1 !== log_tongji_container.url.indexOf('ifid=')) && (tongji_serialize_str(log_tongji_container.url, 'ifid=', '&')!=""))
					{
						log_tongji_container.ifid = tongji_serialize_str(log_tongji_container.url, 'ifid=', '&');
					}
					else
					{
						log_tongji_container.ifid = tongjis_ifid;
					}
					log_tongji_container.global_landing = tongjis_global_landing;
					if ((-1 !== log_tongji_container.url.indexOf(url_domain)) && (-1 !== log_tongji_container.last_refer.indexOf(url_domain)))
					{
						var new_pagetype=log_tongji_container.pagetype.toLowerCase();
						var arr_new_pagetype=new_pagetype.split(".");
						var new_channel_landing=tongjis_channel_landing.toLowerCase();
						var arr_new_channel_landing=new_channel_landing.split(".");
						if(arr_new_pagetype[0]==arr_new_channel_landing[0])
						{
							log_tongji_container.channel_landing = tongjis_channel_landing;
						}
						else
						{
							log_tongji_container.channel_landing = log_tongji_container.pagetype;
						}
					}
					else
					{
						log_tongji_container.channel_landing = log_tongji_container.pagetype;
					}
				}
					var result = _tongji_getCampaign(log_tongji_container.url,tongjis);
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
					var tmp_abpool_cookie = '' ;
	                for (i = 0;i < _BjTj_subChannel.length;i++){
	                    var tmp_pool_channel_cookie_key = '__tongjipool_'+_BjTj_subChannel[i];
	                    var tmp_pool_channel_cookie_value = _tongji_cookie(tmp_pool_channel_cookie_key)||'';
	                    if (tmp_pool_channel_cookie_value != ''){
							if (tmp_abpool_cookie != ''){
								tmp_abpool_cookie +='|';
							}
							tmp_abpool_cookie +=_BjTj_subChannel[i]+'*'+tmp_pool_channel_cookie_value;
						} 
					}
	                log_tongji_container.pool = encodeURIComponent(tmp_abpool_cookie);
	                _tongji_cookie('__tongjipool', encodeURIComponent(tmp_abpool_cookie), { path: '/', domain: cookie_domain, secure: 0, expires: 0.0208333 });
					_tongji_cookie('__tongjiv', cookie_tongjiv, { path: '/', domain: cookie_domain, secure: 0, expires: 731 });
					_tongji_cookie('__tongjis', cookie_tongjis, { path: '/', domain: cookie_domain, secure: 0, expires: 0.0208333 });
					var imgUrl = '';
					imgUrl = tongji_img_url+'?entry_time='+log_tongji_container.entry_time+'&visitor_id='+log_tongji_container.visitor_id+'&url='+encodeURIComponent(log_tongji_container.url)+'&first_refer='+encodeURIComponent(log_tongji_container.first_refer)+'&last_refer='+encodeURIComponent(log_tongji_container.last_refer)+'&fromid='+encodeURIComponent(log_tongji_container.fromid)+'&ifid='+log_tongji_container.ifid+'&external_source='+log_tongji_container.external_source+'&internal_source='+log_tongji_container.internal_source+'&pagetype='+log_tongji_container.pagetype+'&global_landing='+log_tongji_container.global_landing+'&channel_landing='+log_tongji_container.channel_landing+'&visits_count='+log_tongji_container.visits_count+'&pv_count='+log_tongji_container.pv_count+'&tj_user_id='+log_tongji_container.tj_user_id+'&utm_source='+log_tongji_container.utm_source+'&utm_medium='+log_tongji_container.utm_medium+'&utm_term='+log_tongji_container.utm_term+'&utm_id='+log_tongji_container.utm_id+'&utm_campaign='+log_tongji_container.utm_campaign+'&pool='+log_tongji_container.pool+'&reserve_a='+log_tongji_container.reserve_a+'&reserve_b='+log_tongji_container.reserve_b+'&reserve_c='+log_tongji_container.reserve_c+'&reserve_d='+log_tongji_container.reserve_d+'';
	                var bitongji_img = document.createElement('img');
	                bitongji_img.src = imgUrl;
	                bitongji_img.width = 1;
	                bitongji_img.height = 1;
	                bitongji_img.style.display='none';
	                window._BiTj.current_pvcount =log_tongji_container.pv_count
	                document.body.appendChild(bitongji_img);
			}
			function _tongji_externalSource(refer_url)
			{
			    var _externalSource='';
			    var _refer='';
				var _referold = log_tongji_container.first_refer.toLowerCase();
				if(typeof bitongji_fromid_php !='undefined' && bitongji_fromid_php != '' ){
					return "marketing" ;
				}
                if (typeof refer_url !='undefined'){
                    _referold = refer_url.toLowerCase();
                }
			    _refer = tongji_parse_url(_referold);
			    //增加360搜索引擎
				var seSourceMap = [
					['Google', '.google.com/', 'q='],
					['Google', '.google.com.hk/', 'q='],
					['Baidu', '.baidu.com/', 'wd='],
					['Baidu', '.baidu.com/', 'word='],
					['Baidu', '.baidu.com/', 'src_'],
					['Soso', '.soso.com/', 'w='],
					['Soso', '.soso.com/', 'key='],
					['Sogou', '.sogou.com/', 'query='],
					['Sogou', '.sogou.com/', 'keyword='],
					['Bing', '.bing.com/', 'q='],
					['Youdao', '.youdao.com/', 'q='],
					['360', '.360.cn/', 'q='],
					['360', '.so.com/', 'q='],
					['360', '.haosou.com/', 'q='],
					['sm', '.sm.cn/', 'q='],
					['sm', '.sm.cn/', 'src=']
			    ];
				var _utm_medium="";
			      if((-1 !== log_tongji_container.url.indexOf('est=')) && (tongji_serialize_str(log_tongji_container.url, 'est=', '&')=="marketing")){
				 _externalSource ='marketing';
			     }else if((-1 !== log_tongji_container.url.indexOf('est=')) && (tongji_serialize_str(log_tongji_container.url, 'est=', '&')=="nmns")){
				_externalSource ='nonMarketingSE';
			     }else{
				if (-1 !== log_tongji_container.url.indexOf('utm_medium='))
				{
					_utm_medium = tongji_serialize_str(log_tongji_container.url, 'utm_medium=', '&');
				}else{
					_utm_medium = "";
				}
				if(_utm_medium=='cpc')
				{
					_externalSource ='SEM';
				}
				else if(_utm_medium=='cpp')
				{
					_externalSource ='SEA';
				}
				else
				{
					var isBD = 0;
					var i = 0;
					for (i = 0; i < seSourceMap.length; i ++) {
						if ((-1 != _refer.indexOf(seSourceMap[i][1])) && (-1 != _referold.indexOf(seSourceMap[i][2]))){
							seSource = seSourceMap[i][0];
							isBD = 1;
						}
					}
					if(isBD==0)
					{
						if (-1 !== log_tongji_container.url.indexOf('fromid='))
						{
							_externalSource = _tongji_SemOrMarketing(log_tongji_container.url,_referold);
							
						}else if(_refer.substring(0,21)=="http://www.hao123.com" ){
							_externalSource ='marketing';
						}
						else
						{
							_externalSource = 'nonMarketingSE';
						}
					}
					else if(isBD==1)
					{
						_externalSource ="SEO";
					}
				}
			     }
				return _externalSource;
			};
			function _tongji_getCampaign(url,tongjis) {
			    var result = {
			        'source': '-',
			        'medium': '-',
			        'term': '-',
					'termid': '-',
					'campaign': '-'
			    };
				var _separatorS = '||';
				if (''!=url)
				{
					if (-1 != url.indexOf('utm_source='))
					{
						result['source'] = tongji_serialize_str(url, 'utm_source=', '&');
					}
					else
					{
						if(tongjis&&'undefined'!=tongjis)
						{
							var tongjis_splics = tongjis.split(_separatorS);
							if (tongjis_splics && tongjis_splics.length)
							{
								result['source'] = tongjis_splics[10] || '-';
							}
						}
						else
						{
							result['source'] = '-';
						}
					}
					if (-1 != url.indexOf('utm_medium='))
					{
						result['medium'] = tongji_serialize_str(url, 'utm_medium=', '&');
					}
					else
					{
						if(tongjis&&'undefined'!=tongjis)
						{
							var tongjis_splics = tongjis.split(_separatorS);
							if (tongjis_splics && tongjis_splics.length)
							{
								result['medium'] = tongjis_splics[11] || '-';
							}
						}
						else
						{
							result['medium'] = '-';
						}
					}
					if (-1 != url.indexOf('utm_term='))
					{
						result['term'] = tongji_serialize_str(url, 'utm_term=', '&');
					}
					else
					{
						if(tongjis&&'undefined'!=tongjis)
						{
							var tongjis_splics = tongjis.split(_separatorS);
							if (tongjis_splics && tongjis_splics.length)
							{
								result['term'] = tongjis_splics[12] || '-';
							}
						}
						else
						{
							result['term'] = '-';
						}
					}
					if (-1 != url.indexOf('utm_id='))
					{
						result['termid'] = tongji_serialize_str(url, 'utm_id=', '&');
					}
					else
					{
						if(tongjis&&'undefined'!=tongjis)
						{
							var tongjis_splics = tongjis.split(_separatorS);
							if (tongjis_splics && tongjis_splics.length)
							{
								result['termid'] = tongjis_splics[13] || '-';
							}
						}
						else
						{
							result['termid'] = '-';
						}
					}
					if (-1 != url.indexOf('utm_campaign='))
					{
						result['campaign'] = tongji_serialize_str(url, 'utm_campaign=', '&');
					}
					else
					{
						if(tongjis&&'undefined'!=tongjis)
						{
							var tongjis_splics = tongjis.split(_separatorS);
							if (tongjis_splics && tongjis_splics.length)
							{
								result['campaign'] = tongjis_splics[14] || '-';
							}
						}
						else
						{
							result['campaign'] = '-';
						}
					}
				}
				if ("" == url || 'undefined' == typeof(url)) {
			        if(tongjis&&'undefined'!=tongjis)
					{
						var tongjis_splics = tongjis.split(_separatorS);
						if (tongjis_splics && tongjis_splics.length)
						{
							result['source'] = tongjis_splics[10] || '-';
							result['medium'] = tongjis_splics[11] || '-';
							result['term'] = tongjis_splics[12] || '-';
							result['termid'] = tongjis_splics[13] || '-';
							result['campaign'] = tongjis_splics[14] || '-';
						}
					}
					else
					{
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
			                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
			            } else {
			                date = options.expires;
			            }   
			            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
			        }   
			        var path = options.path ? '; path=' + (options.path) : ''; 
			        var domain = options.domain ? '; domain=' + (options.domain) : ''; 
			        var secure = options.secure ? '; secure' : ''; 
			        document.cookie = [name, '=', value, expires, path, domain, secure].join('');
			    } else {
			        if (document.cookie && document.cookie != '') {
			            var arg = name + "=";
			            var alen = arg.length;
			            var clen = document.cookie.length;
			            var i = 0;
			            while (i < clen)
			            {
							var j = i + alen;
							if (document.cookie.substring(i, j) == arg)
							{
								var endstr = document.cookie.indexOf (";", j);
								if (endstr == -1)
								endstr = document.cookie.length;
								return unescape(document.cookie.substring(j, endstr));
							}
							i = document.cookie.indexOf(" ", i) + 1;
							if (i == 0) break;
			            }
			        }
			    }   
			};
			function tongji_serialize_str(L, n, s)
			{
			    if(!L || L == ''  || !n || n == '' || !s || s == '')
			    {
			        return '-';
			    }
			    
			    var i, i2, i3, c = '-';
			    i = L.indexOf('#');
			    if (i > -1) {
			        L = L.substr(0, i);
			    }
			    i  = L.indexOf(n);
			    i3 = n.indexOf('=') + 1;
	
			    if(i > -1)
			    {
			        i2 = L.indexOf(s, i);
			        if (i2 < 0)
			        {
			            i2 = L.length;
			        }
			        c = L.substr((i + i3), i2 - i - i3);
			    }
			    
			    c = getRegStr(c);
			    return c;
			};
			function getRegStr(sourceStr){
				targetStr = "-";
				try {
				targetStr = sourceStr.replace(/[^a-zA-Z0-9-_]/g,'');
				} catch(e){};
				return targetStr;
			}
			function tongji_parse_url(url)
			{
			    var res = '';
			    if (! url)
			    {
			        return res;
			    }
			    var i = url.indexOf('#');
			    if (i > -1) {
			        url = url.substr(0, i);
			    }
			    var pos = url.indexOf('?');
			    if (pos > -1)
			    {
			        res = url.substr(0, pos);
			    }
			    else
			    {
			        res = url;
			    }
	
			    return res;
			};
			function _tongji_GetUrlDomain(domain)
			{
				var domain_name = domain;
				return domain_name;
			};
			function _tongji_GetUrlMain(url,suffix)
			{
				var suffix_start_num = url.indexOf(suffix);
				var strurl=url.substring(7,suffix_start_num);
				if(-1 != strurl.indexOf('.')){
					var arr_strurl=strurl.split(".");
					var arr_num=arr_strurl.length-1;
					var strurl_new=arr_strurl[arr_num];
					return strurl_new;
				}
				else{
					return strurl;
				}
			};
			function _tongji_SemOrMarketing(url,firstRefer)
			{
				var _tongji_es='marketing';
				var strFromid=tongji_serialize_str(url, 'fromid=', '&');
				if(strFromid.substring(0,3)=='sem' || strFromid.substring(0,6)=='adsage'){
					_tongji_es='nonMarketingSE';
				}else{
					_tongji_es='marketing';
				}
				return _tongji_es;
			};
			function _tongji_GetFromid(strUrl,strFirstRefer)
			{
				var fromidValue="-";
				if(typeof bitongji_fromid_php !='undefined' && bitongji_fromid_php != '' ){
					return bitongji_fromid_php ;
				}
				if ((-1 !== strUrl.indexOf('fromid=')) && (tongji_serialize_str(strUrl, 'fromid=', '&')!="")){
					fromidValue = tongji_serialize_str(strUrl, 'fromid=', '&');
				}else{
					fromidValue = '-';
				}
				return fromidValue;
			};		
		},
		_trackEvent:function(area,detail){
			try{
				var randomInt = Math.round(Math.random() * 1000000);
				var tmpTime = new Date().getTime();
				var current_pvcount = window._BiTj.current_pvcount||0;
				randomInt = tmpTime + randomInt ;
				var cURL = document.URL ;
				var a=document.createElement('img');
				var url = _BiTj_domain_url+'/event.gif?url='+encodeURIComponent(cURL)+'&pagetype='+encodeURIComponent(pagetype_php)+'&area='+encodeURIComponent(area)+'&detail='+encodeURIComponent(detail)+'&birand='+randomInt+'&current_pvcount='+current_pvcount ;			
				a.src=url;
			} catch(e){};
		},
		_getExternalSource:function(){
			var _result ='';
			try{        
		        var _tjcookie = '' ;
				var _cookiearr = document.cookie.split('; ') ;
				for(var i = 0;i < _cookiearr.length;i ++){
					var temp = _cookiearr[i].split('=');
					if(temp[0] == '__tongjis'){
						_tjcookie = temp[1] ;
						break ;
					}
				}
				if(typeof(_tjcookie)!='undefined'&& _tjcookie !=''){
					var _tmparr = _tjcookie.split('||');
					_result = _tmparr[3];
				}
				return _result;
			} catch(e){};
		},
		__getCookieV:function(name){
	        if (document.cookie && document.cookie != '') {
	            var arg = name + "=";
	            var alen = arg.length;
	            var clen = document.cookie.length;
	            var i = 0;
	            while (i < clen)
	            {
					var j = i + alen;
					if (document.cookie.substring(i, j) == arg)
					{
						var endstr = document.cookie.indexOf (";", j);
						if (endstr == -1)
						endstr = document.cookie.length;
						return unescape(document.cookie.substring(j, endstr));
					}
					i = document.cookie.indexOf(" ", i) + 1;
					if (i == 0) break;
	            }
	        }			
		}		
	};
	try {_BiTj._tongji();} catch(e){};
}
