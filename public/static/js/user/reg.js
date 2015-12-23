require.config({
    baseUrl: '../../static/js/',
    paths  : {
        jquery: 'lib/jquery-1.11.1.min',
        lodash : 'lib/lodash.min'
    },
    shim   : {
        'query.cookie': {
            deps: ['jquery']
        }
    }
});
require(['jquery','lodash','lib/jquery.cookie','utils/goto','utils/search'],function($,_,cookie,Goto,Search){
    var search = new Search();
    search.init();
    var goto = new Goto();
    goto.init();
    var Register = function(){};
    Register.prototype = {
        init : function(){
            this.checkStep = 5;
            this.agree = true;
            this.status = $("#reg-status");
            this.mobile = $("#reg-account");
            this.captcha = $("#reg-VerifyCode");
            this.pass = $("#reg-password");
            this.pass2 = $("#reg-password2");
            this.form = $('#form-reg');
            this.error = $('#error-info');
            this.checkMobile();
            this.bindVerifyCode();
            this.bindFocus();
            this.bindBlur();
            this.submit();
            this.setType();
            this.agreement();
        },
        verify : {
            isMobile : function(mobile){
                return /^(13[0-9]{9}|15[012356789][0-9]{8}|18[0123456789][0-9]{8}|147[0-9]{8}|170[0-9]{8}|177[0-9]{8})$/.test(mobile);
            },
            isPassword : function(str){
                return (/^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{6,30}$/.test(str));
            },
            isVerifyCode : function(str){
                return (/^[\d]{6}$/.test(str));
            }
        },
        errmsg : {
            'mobile'  : '手机号不正确',
            'password' : '密码需为6~30个字母或数字',
            'password_confirm' : '两次输入的密码不一样',
            'smscode'  : '短信验证码不正确',
            'submit'   : '信息不完整',
            'agree'    : '请先同意注册协议'
        },
        check : function(){
            var self = this;
            return {
                mobile  :  function(){
                    if(!self.verify.isMobile(self.mobile.val())){
                        self.error.html(self.errmsg.mobile).removeClass('hide');
                        self.mobile.parents('.item').addClass('error');
                        return false;
                    }else{
                        self.error.html('').addClass('hide');
                        self.checkStep--;
                        self.mobile.parents('.item').removeClass('error');
                        return true;
                    }
                },
                captcha  :  function(){
                    if(!self.verify.isVerifyCode(self.captcha.val())){
                        self.error.html(self.errmsg.smscode).removeClass('hide');
                        self.captcha.parents('.item').addClass('error');
                        return false;
                    }else{
                        self.error.html('').addClass('hide');
                        self.checkStep--;
                        self.captcha.parents('.item').removeClass('error');
                        return true;
                    }
                },
                pass  :  function(){
                    if(!self.verify.isPassword(self.pass.val())){
                        self.error.html(self.errmsg.password).removeClass('hide');
                        self.pass.parents('.item').addClass('error');
                        return false;
                    }else{
                        self.error.html('').addClass('hide');
                        self.checkStep--;
                        self.pass.parents('.item').removeClass('error');
                        return true;
                    }
                },
                pass2  :  function(){
                    if(self.pass.val() === self.pass2.val() && !self.verify.isPassword(self.pass2.val())){
                        self.error.html(self.errmsg.password_confirm).removeClass('hide');
                        self.pass2.parents('.item').addClass('error');
                        return false;
                    }else{
                        self.error.html('').addClass('hide');
                        self.checkStep--;
                        self.pass2.parents('.item').removeClass('error');
                        return true;
                    }
                },
                agree  : function(){
                    if(self.agree){
                        self.error.html('').addClass('hide');
                        self.checkStep--;
                        return true;
                    }else{
                        self.error.html(self.errmsg.agree).removeClass('hide');
                        return false;
                    }
                }
            };
        },
        agreement : function(){
            var self = this;
            $('#reg-agreement').delegate('span','click',function(ev){
                ev.preventDefault();
                self.agree = $(this).hasClass('active');
                $(this).toggleClass('active');
                self.check().agree();
            });
        },
        bindVerifyCode : function(){
            var self = this,
                VerifyCodeOff = true,
                $getVerifyCode = $('#getVerifyCode');
            $getVerifyCode.on('click',function(){
                if(VerifyCodeOff && self.verify.isMobile(self.mobile.val())){
                    VerifyCodeOff = false;
                    countdown($(this),60);
                    var userName = self.mobile.val();
                    $.ajax({
                        url:RootUrl+'api/v2/web/send_verify_code',
                        type: 'post',
                        contentType : 'application/json; charset=utf-8',
                        dataType: 'json',
                        data : JSON.stringify({
                            phone : userName
                        }),
                        processData : false
                    });
                }else{
                    self.error.html(self.errmsg.mobile).removeClass('hide');
                    self.mobile.parents('.item').addClass('error');
                    return false;
                }
            });
            function countdown(obj,num){
                if(!obj){return false;}
                var count = num || 60;
                var timer = null;
                clearInterval(timer);
                timer = setInterval(function(){
                    count--;
                    obj.attr('class','f-fr vcode disabled').html(count+'s后重新获取');
                    if(count <= 0){
                        clearInterval(timer);
                        count = num;
                        VerifyCodeOff = true;
                        obj.attr('class','f-fr vcode').html('重新获取');
                    }
                }, 1000);
            }
        },
        focus : function(obj){
            obj.on('focus',function(){
                $(this).parents('.item').addClass('focus');
            });
        },
        bindFocus : function(){
            var self = this;
            this.focus(self.mobile);
            this.focus(self.captcha);
            this.focus(self.pass);
            this.focus(self.pass2);
        },
        blur  : function(obj,num){
            var self = this;
            obj.on('blur',function(){
                switch(num){
                    case '0' : self.check().mobile();
                    break;
                    case '1' : self.check().captcha();
                    break;
                    case '2' : self.check().pass();
                    break;
                    case '3' : self.check().pass2();
                    break;
                }
                $(this).parents('.item').removeClass('focus');
            });
        },
        bindBlur  : function(){
            var self = this;
            this.blur(self.mobile,"0");
            this.blur(self.captcha,"1");
            this.blur(self.pass,"2");
            this.blur(self.pass2,"3");
        },
        checkMobile : function(){
            var self = this;
            self.mobile.on('input propertychange',function(){
                if(self.verify.isMobile(self.mobile.val())){
                    $.ajax({
                        url:RootUrl+'api/v2/web/verify_phone',
                        type: 'post',
                        contentType : 'application/json; charset=utf-8',
                        dataType: 'json',
                        data : JSON.stringify({
                            phone : self.mobile.val()
                        }),
                        processData : false
                    })
                    .done(function(res) {
                        if(res.err_msg){
                            self.mobile.parents('.item').addClass('error');
                            self.error.html(res.err_msg).removeClass('hide');
                        }
                    });
                }
                self.error.html('').addClass('hide');
                $(this).parents('.item').removeClass('error').addClass('focus');
            });
        },
        submit : function(){
            var self = this;
            this.form.on('submit',function(){
                self.check().mobile();
                self.check().captcha();
                self.check().pass();
                self.check().pass2();
                self.check().agree();
                if(self.checkStep > 0){
                    self.error.html(self.errmsg.submit).removeClass('hide');
                    return false;
                }
                var serialize = self.strToJson($(this).serialize());
                $.ajax({
                    url:RootUrl+'api/v2/web/signup',
                    type: 'post',
                    contentType : 'application/json; charset=utf-8',
                    dataType: 'json',
                    data : JSON.stringify(serialize),
                    processData : false
                })
                .done(function(res) {
                    if(res.data !== null){
                        window.location.href = res.data.url;
                    }else{
                        self.error.html(res.err_msg).removeClass('hide');
                    }
                    if(res.err_msg){
                        self.checkStep = 4;
                        self.error.html(res.err_msg).removeClass('hide');
                    }
                });
                return false;
            });
        },
        setType : function(){
            var $oInput = this.status.find('input');
                this.status.delegate('li','click',function(ev){
                    ev.preventDefault();
                    $(this).attr('class','active').siblings().attr('class','');
                    $oInput.val($(this).data('status'));
                });
        },
        strToJson : function(str){
            var json = {},temp;
            if(str.indexOf("&") != -1){
                var arr = str.split("&");
                for (var i = 0,len = arr.length; i < len; i++) {
                    temp = arr[i].split("=");
                    json[temp[0]] = temp[1];
                }
            }else{
                temp = str.split("=");
                json[temp[0]] = temp[1];
            }
            return json;
        }
    };
    var reg = new Register();
    reg.init();
});