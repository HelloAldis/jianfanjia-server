require.config({
    baseUrl: '/static/js/',
    paths  : {
        jquery: 'lib/jquery',
        lodash : 'lib/lodash'
    }
});
require(['jquery','lodash'],function($,_){
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
            this.error1 = $('#error-info1');
            this.error2 = $('#error-info2');
            this.bindVerifyCode();
            this.bindFocus();
            this.bindBlur();
            this.submit();
            this.nextStep = 0;
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
                        self.error1.html(self.errmsg.mobile);
                        self.mobile.parents('.item').addClass('error');
                        return false;
                    }else{
                        self.error1.html('');
                        self.mobile.parents('.item').removeClass('error');
                        return true;
                    }
                },
                captcha  :  function(){
                    if(!self.verify.isVerifyCode(self.captcha.val())){
                        self.error1.html(self.errmsg.smscode);
                        self.captcha.parents('.item').addClass('error');
                        return false;
                    }else{
                        self.error1.html('');
                        self.captcha.parents('.item').removeClass('error');
                        return true;
                    }
                },
                pass  :  function(){
                    if(!self.verify.isPassword(self.pass.val())){
                        self.error2.html(self.errmsg.password);
                        self.pass.parents('.item').addClass('error');
                        return false;
                    }else{
                        self.error2.html('');
                        self.pass.parents('.item').removeClass('error');
                        return true;
                    }
                },
                pass2  :  function(){
                    if(self.pass.val() === self.pass2.val() && !self.verify.isPassword(self.pass2.val())){
                        self.error2.html(self.errmsg.password_confirm);
                        self.pass2.parents('.item').addClass('error');
                        return false;
                    }else{
                        self.error2.html('');
                        self.pass2.parents('.item');
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
                if($(this).hasClass('disabled')){
                    return ;
                }
                if(VerifyCodeOff && self.verify.isMobile(self.mobile.val())){
                    VerifyCodeOff = false;
                    countdown($(this),60);
                    var userName = self.mobile.val();
                    $.ajax({
                        url:'/api/v2/web/send_verify_code',
                        type: 'post',
                        contentType : 'application/json; charset=utf-8',
                        dataType: 'json',
                        data : JSON.stringify({
                            phone : userName
                        }),
                        processData : false
                    });
                }else{
                    self.error1.html(self.errmsg.mobile);
                    self.mobile.parents('.item').addClass('error');
                    return false;
                }
            });
            function countdown(obj,num){
                if(!obj){return false}
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
            var self = this;
            obj.on('focus',function(){
                $(this).parents('.item').addClass('focus').removeClass('error');
            });
            self.error1.html('');
            self.error2.html('');
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
        submit : function(){
            var self = this;
            $(document).on('keydown',function(e){
                if(e.which == 13){
                    if(self.nextStep == 0){
                        nextStep();
                    }else if(self.nextStep == 1){
                        submitfn();
                    }
                }
            })
            this.form.on('click','#next-step',function(){
                nextStep();
                return false;
            });
            this.form.on('click','#getpw-submit',function(){
                submitfn();
                return false;
            });
            function nextStep(){
                if(self.check().mobile() && self.check().captcha()){
                    $.ajax({
                        url:'/api/v2/web/check_verify_code',
                        type: 'post',
                        contentType : 'application/json; charset=utf-8',
                        dataType: 'json',
                        data : JSON.stringify({
                            "phone" : self.mobile.val(),
                            "code" : self.captcha.val()
                        }),
                        processData : false
                    })
                    .done(function(res) {
                        if(res['err_msg']){
                            self.error1.html(res['err_msg']);
                        }
                        if(res["msg"] == "success"){
                            self.form.find('.step1').addClass('hide');
                            self.form.find('.step2').removeClass('hide');
                            self.form.find('.m-step li').removeClass('active');
                            self.form.find('.m-step li').eq(1).addClass('active');
                        }else{
                            self.error1.html(res['err_msg']);
                        }
                    });
                    self.nextStep = 1;
                }
            }
            function submitfn(){
                if(self.check().pass() && self.check().pass2()){
                    var serialize = self.strToJson(self.form.serialize());
                    $.ajax({
                        url:'/api/v2/web/update_pass',
                        type: 'post',
                        contentType : 'application/json; charset=utf-8',
                        dataType: 'json',
                        data : JSON.stringify(serialize),
                        processData : false
                    })
                    .done(function(res) {
                        if(res["msg"] == "success"){
                            $('#error-info').html('密码修改成功');
                            setTimeout(function(){
                                window.location.href = self.successUrl;
                                self.error2.html('');
                            }, 2000);
                        }else{
                            self.error2.html(res['err_msg']);
                        }
                        if(res['err_msg']){
                            self.error2.html(res['err_msg']);
                        }
                    });
                }
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
