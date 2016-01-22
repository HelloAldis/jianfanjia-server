require.config({
    baseUrl: '/static/js/',
    paths  : {
        jquery: 'lib/jquery',
        lodash : 'lib/lodash'
    },
    shim   : {
        'jquery.cookie': {
            deps: ['jquery']
        }
    }
});
require(['jquery','lodash','lib/jquery.cookie','utils/common'],function($,_,cookie,common){
    var search = new common.Search();
    search.init();
    var goto = new common.Goto();
    goto.init();
});
require(['jquery','lodash','lib/jquery.cookie'],function($,_,cookie){
    var Getpw = function(){};
    Getpw.prototype = {
        init : function(){
            this.checkStep = 4;
            this.successUrl = 'login.html';
            this.mobile = $("#getpw-account");
            this.captcha = $("#getpw-VerifyCode");
            this.pass = $("#getpw-password");
            this.pass2 = $("#getpw-password2");
            this.form = $('#form-getpw');
            this.error = $('#error-info');
            this.bindVerifyCode();
            this.bindFocus();
            this.bindBlur();
            this.submit();
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
            'submit'   : '信息不完整'
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
                }
            }
        },
        bindVerifyCode : function(){
            var self = this,
                VerifyCodeOff = true,
                $getVerifyCode = $('#getVerifyCode');
            $getVerifyCode.on('click',function(){
                if(VerifyCodeOff && self.verify.isMobile(self.mobile.val())){
                    VerifyCodeOff = false;
                    countdown($(this),60)
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
            })
            function countdown(obj,num){
                if(!obj){return false};
                var count = num || 60;
                var timer = null;
                clearInterval(timer)
                timer = setInterval(function(){
                    count--;
                    obj.attr('class','f-fr vcode disabled').html(count+'s后重新获取')
                    if(count <= 0){
                        clearInterval(timer)
                        count = num;
                        VerifyCodeOff = true;
                        obj.attr('class','f-fr vcode').html('重新获取')
                    }
                }, 1000)
            }
        },
        focus : function(obj){
            obj.on('focus',function(){
                $(this).parents('.item').addClass('focus');
            })
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
            })
        },
        bindBlur  : function(){
            var self = this;
            this.blur(self.mobile,"0");
            this.blur(self.captcha,"1");
            this.blur(self.pass,"2");
            this.blur(self.pass2,"3");
        },
        submit : function(){
            var self = this;
            $(document).on('keydown',function(e){
                if(e.which == 13){
                    submitfn();
                }
            })
            this.form.on('click','#getpw-submit',function(){
                submitfn();
                return false;
            });
            function submitfn(){
                self.check().mobile();
                self.check().captcha();
                self.check().pass();
                self.check().pass2();
                if(self.checkStep > 0){
                    self.error.html(self.errmsg.submit).removeClass('hide');
                    return false;
                }
                var serialize = self.strToJson(self.form.serialize());
                $.ajax({
                    url:RootUrl+'api/v2/web/update_pass',
                    type: 'post',
                    contentType : 'application/json; charset=utf-8',
                    dataType: 'json',
                    data : JSON.stringify(serialize),
                    processData : false
                })
                .done(function(res) {
                    if(res["msg"] == "success"){
                        $('#error-info').html('保存成功').removeClass('hide');
                        setTimeout(function(){
                            window.location.href = self.successUrl;
                            self.error.html('').addClass('hide');
                        }, 2000);
                    }else{
                        self.error.html(res['err_msg']).removeClass('hide');
                    }
                    if(res['err_msg']){
                        self.checkStep = 4;
                        self.error.html(res['err_msg']).removeClass('hide');
                    }
                });
            }
        },
        strToJson : function(str){
            var json = {};
            if(str.indexOf("&") != -1){
                var arr = str.split("&");
                for (var i = 0,len = arr.length; i < len; i++) {
                    var  temp = arr[i].split("=");
                    json[temp[0]] = temp[1]
                };
            }else{
                var  temp = str.split("=");
                json[temp[0]] = temp[1]
            }
            return json;
        }
    }
    var getpw = new Getpw();
    getpw.init();
})
