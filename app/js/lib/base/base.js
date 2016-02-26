
//var Log = require('log');
/**
 * based on jquery
 */
    import   'tongji';
var BASE = {version: '1.0.0', ui: {}, lang: {}, brower: {},regexp : {}};

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
    sub: function (s, o) {
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
    getUrlParam: function (name, url) {
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
    adapt: function () {
        (function (doc, win) {
            var docEl = doc.documentElement,
                resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
                recalc = function () {
                    var clientWidth = docEl.clientWidth;
                    if(docEl.clientWidth > 750){
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
    getRandom: function (name) {
        var name_value = name || "";
        return name_value + (new Date().getTime());
    },
    /*
     * @ method formatDate
     * @ param
     *    date ： Date/Date.getTime()
     *    format : string
     *    num : init
     *  @ return string '2000-00-00 00:00:00'
     * */
    formatDate: function (date, format,num) {
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
        var newDate = date.getTime() + (num_val*60*60*24*1000);
        newDate = new Date(newDate);
        if (!(date instanceof Date)) {
            return;
        }
        if (!(newDate instanceof Date)){
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
    isMobile : function(t){
        return /^1[34578]\d{9}$/.test(t);
    },
    //email
    isEmail : function(t){
        return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(t);
    },
    //身份证
    isCardId : function(t){
        return /(^\d{15}$)|(^\d{17}([0-9]|X|x)$)/.test(t);
    },
    //密码
    isPassWord : function(t){
        return /^(\w*(?=\w*\d)(?=\w*[A-Za-z])\w*){6,16}$/.test(t);
    },
    //固定电话
    isTel : function(t){
        return /^(0[0-9]{2,3}-)?([2-9][0-9]{6,7})+(-[0-9]{1,4})?$/.test(t);
    }
};
export  default  BASE

