require.config({
    baseUrl: '/static/js/',
    paths  : {
        jquery: 'lib/jquery',
        lodash : 'lib/lodash'
    }
});
require(['jquery','lodash','utils/placeholder'],function($,_,Placeholder){
    var Register = function(){};
    Register.prototype = {
        init : function(){
            this.checkStep = 4;
            this.agree = true;
            this.isMobile = false;
            this.status = $("#reg-status");
            this.mobile = $("#reg-account");
            this.captcha = $("#reg-VerifyCode");
            this.pass = $("#reg-password");
            this.form = $('#form-reg');
            this.error = $('#error-info');
            this.weixin = $('#j-weixin');
            this.type = $('#reg-type');
            this.box = $('#j-select').find('.boxs');
            this.select();
            this.checkMobile();
            this.bindVerifyCode();
            this.bindFocus();
            this.bindBlur();
            this.submit();
            this.agreement();
            this.off = false;
        },
        "select" : function(){
            var _this = this;
            var select = $('#j-select');
            var app = $('#j-app');
            var winHash = window.location.search.split("?")[1];
            if (winHash == 2) {
              var type = winHash;
              setType(type);
              _this.form.find('.m-type li').eq(type - 1).addClass('active');
              select.hide().remove();
            } else {
              this.box.show();
            }
            select.on('click', 'dl', function(event) {
                event.preventDefault();
                var type = $(this).data('type');
                setType(type);
                _this.form.find('.m-type li').eq(type - 1).addClass('active');
                select.hide().remove();
            });
            this.form.on('click', '.m-type li', function(event) {
                event.preventDefault();
                var type = $(this).data('type');
                setType(type);
                $(this).addClass('active').siblings('li').removeClass('active');
            });
            function setType(type){
                _this.type.val(type);
                if(type == 1){
                    _this.weixin.show();
                }else{
                    _this.weixin.hide();
                }
                app.find('img').addClass('hide');
                app.find('img').eq(type - 1).removeClass('hide');
            }
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
            'smscode'  : '短信验证码不正确',
            'submit'   : '注册信息填写不完整',
            'agree'    : '请先同意注册协议'
        },
        check : function(){
            var self = this;
            return {
                mobile  :  function(){
                    if(!self.verify.isMobile(self.mobile.val())){
                        self.error.html(self.errmsg.mobile);
                        self.mobile.parents('.item').addClass('error');
                        self.checkStep++;
                        return false;
                    }else{
                        self.error.html('');
                        self.checkStep--;
                        self.mobile.parents('.item').removeClass('error');
                        return true;
                    }
                },
                captcha  :  function(){
                    if(!self.verify.isVerifyCode(self.captcha.val())){
                        self.error.html(self.errmsg.smscode);
                        self.captcha.parents('.item').addClass('error');
                        self.checkStep++;
                        return false;
                    }else{
                        self.error.html('');
                        self.checkStep--;
                        self.captcha.parents('.item').removeClass('error');
                        return true;
                    }
                },
                pass  :  function(){
                    if(!self.verify.isPassword(self.pass.val())){
                        self.error.html(self.errmsg.password);
                        self.pass.parents('.item').addClass('error');
                        self.checkStep++;
                        return false;
                    }else{
                        self.error.html('');
                        self.checkStep--;
                        self.pass.parents('.item').removeClass('error');
                        return true;
                    }
                },
                agree  : function(){
                    if(self.agree){
                        self.error.html('');
                        return true;
                    }else{
                        self.error.html(self.errmsg.agree);
                        return false;
                    }
                }
            };
        },
        agreement : function(){
            var self = this;
            $('#reg-agreement').delegate('span','click',function(ev){
                ev.preventDefault();
                self.agree = !$(this).hasClass('active');
                $(this).toggleClass('active');
                self.check().agree();
            });
        },
        bindVerifyCode : function(){
            var self = this,
                VerifyCodeOff = true,
                $getVerifyCode = $('#getVerifyCode');
            $getVerifyCode.on('click',function(){
                if($(this).hasClass('disabled')){
                    return ;
                }
                if(VerifyCodeOff && !self.isMobile){
                    VerifyCodeOff = false;
                    countdown($(this),60);
                    $.ajax({
                        url:'/api/v2/web/send_verify_code',
                        type: 'post',
                        contentType : 'application/json; charset=utf-8',
                        dataType: 'json',
                        data : JSON.stringify({
                            phone : self.mobile.val()
                        }),
                        processData : false
                    });
                }else{
                    self.error.html('手机号码已被使用');
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
            var self = this;
            if(obj === self.mobile && self.isMobile){
                obj.on('focus',function(){
                    $(this).parents('.item').addClass('focus').removeClass('error');
                });
            }else{
               obj.on('focus',function(){
                    $(this).parents('.item').addClass('focus').removeClass('error');
                });
                self.error.html('');
            }
        },
        bindFocus : function(){
            var self = this;
            this.focus(self.mobile);
            this.focus(self.captcha);
            this.focus(self.pass);
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
                }
                $(this).parents('.item').removeClass('focus');
            });
        },
        bindBlur  : function(){
            var self = this;
            this.blur(self.mobile,"0");
            this.blur(self.captcha,"1");
            this.blur(self.pass,"2");
        },
        checkMobile : function(){
            var self = this;
            self.mobile.on('focus',function(){
                if(self.isMobile){
                    $(this).parents('.item').addClass('focus').removeClass('error');
                }
            });
            self.mobile.on('input propertychange',function(){
                if(self.verify.isMobile(self.mobile.val())){
                    $.ajax({
                        url:'/api/v2/web/verify_phone',
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
                            self.isMobile = true;
                            self.mobile.parents('.item').addClass('error');
                            self.error.html(res.err_msg);
                        }else{
                            self.isMobile = false;
                        }
                    });
                }
                self.error.html('');
                $(this).parents('.item').removeClass('error').addClass('focus');
            });
        },
        submit : function(){
            var self = this;
            $(document).on('keydown',function(e){
                if(e.which == 13){
                    if(self.off){
                        return ;
                    }
                    self.off = true;
                    submitfn();
                }
            });
            this.form.on('click','#reg-submit',function(){
                if(self.off){
                    return ;
                }
                self.off = true;
                submitfn();
                return false;
            });
            function submitfn(){
                if(self.isMobile){
                    self.mobile.parents('.item').addClass('error');
                    self.error.html('手机号码已被使用');
                    self.off = false;
                    return false;
                }
                self.check().mobile();
                self.check().captcha();
                self.check().pass();
                if(self.checkStep > 0 ){
                    self.error.html(self.errmsg.submit);
                    self.off = false;
                    return false;
                }
                if(!self.check().agree()){
                    self.off = false;
                   return false;
                }
                var serialize = self.strToJson(self.form.serialize());
                $.ajax({
                    url:'/api/v2/web/signup',
                    type: 'post',
                    contentType : 'application/json; charset=utf-8',
                    dataType: 'json',
                    data : JSON.stringify(serialize),
                    processData : false
                })
                .done(function(res) {
                    if(res.err_msg){
                        self.off = false;
                        self.checkStep = 2;
                        self.error.html(res.err_msg);
                        return ;
                    }
                    if(res.data !== null){
                        window.location.href = res.data.url;
                    }else{
                        self.off = false;
                        self.error.html(res.err_msg);
                    }
                });
            }
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
    $(function(){
        new Placeholder({'id': '#reg-account','className': 'placeholder'});
        new Placeholder({'id': '#reg-VerifyCode','className': 'placeholder'});
        new Placeholder({'id': '#reg-password','className': 'placeholder'});
        reg.init();
    });
});
