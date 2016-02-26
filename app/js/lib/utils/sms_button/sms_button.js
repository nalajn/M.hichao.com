/**
 *  web_smsbutton
 *  手机验证码
 *  =====以下是类方法=====
 *  web_smsbutton.testTel(tel) //验证手机号是否正确
 *  =====以下是实例方法=====
 *  instance.trigger()  //手动触发启动验证码
 */
define([], function () {
  var DOTA = function () {
    this.init.apply(this, arguments);
  };
  DOTA.testTel = function(tel){
      return /^1\d{10,10}$/.test(tel);
  }; 
  DOTA.prototype = {
    settings: {
    },
    init: function (configs) {
      var _this = this, configs = configs || {};
      this.configs = {
        //以下未必填
        dInput : $(configs.dInput) || null,//输入框
        getTel : configs.getTel || function(){}, //获取电话号码,需return一个电话号码
        toggleClass : configs.toggleClass || "", //当input被点击时，会添加该class,
        overClass:configs.overClass||"", //当倒计时结束出现重新获取时，添加该class
        sendRequestSms : configs.sendRequestSms || function(callback){}, //发送短信请求,成功后请调用callback()
        //以下为选填
        time : configs.time || 60,//倒计时时间
        originTitle : configs.originTitle || "重新获取", //点击前按钮显示的问题
        templateTimeCount : configs.templateTimeCount || "%time%'s后重新获取" //倒计时模板，%time%会被填充为数字
      };
      //this.setInputContent(this.configs.originTitle);
      this.configs.dInput.click(function(){
        _this.trigger();
      });
    },
    setInputContent : function(content){
      var dInput = this.configs.dInput;
      if(dInput.prop('tagName') == "INPUT"){
        dInput.val(content);
      }else{
        dInput.html(content);
      }
    },
    trigger : function(){
      var _this = this;
      _this._tel = _this.configs.getTel();
      if(!DOTA.testTel(_this._tel)){
        $(".j_sms_hint").show();
        $(".j_sms_hint em").html("手机号输入不正确!").show();
        return;
      };
      if($(this.configs.dInput).hasClass(_this.configs.toggleClass)){
        return;
      }
      //发送请求由前端控制
      _this.configs.sendRequestSms(function(){
        _this.timeCount();
      });
    },
    strTimeCount : function(time){
      return this.configs.templateTimeCount.replace(/%time%/g,time);
    }, //倒计时文字
    timeCount : function(){
      var _this = this;
      var dCode = this.configs.dInput;
      var nTime = this.configs.time;
      clearInterval(this.timer);
      dCode.addClass(this.configs.toggleClass);
      dCode.removeClass(_this.configs.overClass);
      this.setInputContent(this.strTimeCount(nTime--));
      this.timer = setInterval(function(){
        if(nTime == 0){
          _this.setInputContent(_this.configs.originTitle);
          dCode.removeClass(_this.configs.toggleClass);
          dCode.addClass(_this.configs.overClass);
          clearInterval(_this.timer);
          return;
        }
        _this.setInputContent(_this.strTimeCount(nTime--));
      },1000);
    },
    fun : null
  };
  var sms_button = function (configs) {
    return new DOTA(configs);
  }
  sms_button.testTel = DOTA.testTel;
  return sms_button;
});
//export  default  sms_button;
