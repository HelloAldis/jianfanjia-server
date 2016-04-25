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
	if(window.location.host == 'jianfanjia.com'){
		window.location.href = 'http://www.jianfanjia.com/tpl/user/login.html';
	}
    var Login = function(){};
    Login.prototype = {
        init : function(){
            this.checkStep = 2;
            this.time = 20150618;
        	this.winSearch = window.location.search.substring(1);
            this.winHash = window.location.hash ? window.location.hash : '';
            this.mobile = $("#login-account");
            this.pass = $("#login-password");
            this.save = $('#saveUserInfo');
            this.form = $('#form-login');
            this.error = $('#error-info');
            this.tabs = $('#login-status');
            this.Wform = $('.w-form');
            this.bindFocus();
            this.bindBlur();
            this.submit();
            this.bindsave();
            this.getCookie();
            this.tabsfn();
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
        tabsfn : function(){
            var aLi = this.tabs.find('li');
            var _this = this;
            aLi.each(function(i,e){
                $(e).on('click',function(){
                    var status = $(this).data('status');
                    $(this).addClass('active').siblings().removeClass('active');
                    _this.Wform.filter("[data-type="+status+"]").removeClass('hide').siblings('.w-form').addClass('hide');
                })
            })
        },
        errmsg : {
            'mobile'  : '手机号不正确',
            'password' : '密码需为6~30个字母或数字',
            'submit'   : '手机号或者密码不正确',
            'tips'     : '请勿在网吧或公用电脑上使用此功能！',
            'save'     : '请先填写账号密码'
        },
        getCookie : function(){
        	if(!$.cookie("rmbUser") == null || $.cookie("rmbUser")){
        		this.mobile.val(this.fromCharCode($.cookie("userPhone")));
        		this.pass.val(this.fromCharCode($.cookie("passWord")));
        		this.save.find('span').attr('class', 'active');
        	}
        },
        setCookie : function(){
        	$.cookie("rmbUser", "true",  7 );
        	$.cookie("userPhone", this.charCodeAt(this.mobile.val()), 7 );
        	$.cookie("passWord", this.charCodeAt(this.pass.val()),  7 );
        	this.error.html(this.errmsg.tips).removeClass('hide');
        },
        removeCookie : function(){
        	$.removeCookie("rmbUser");
        	$.removeCookie("userPhone");
        	$.removeCookie("passWord");
        	$('#error-info').addClass('hide').html('');
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
                }
            }
        },
        bindsave : function(){
            var self = this;
            this.save.on('click',function(){
            	var radio = $(this).find('span');
            	if(radio.hasClass('active')){
            		radio.attr('class', '');
            		self.removeCookie();
            	}else{
            		if(self.verify.isMobile(self.mobile.val()) && self.verify.isPassword(self.pass.val())){
            			self.setCookie();
            			radio.attr('class', 'active');
            		}else{
            			self.error.html(self.errmsg.save).removeClass('hide');
            			self.mobile.parents('.item').addClass('error');
            			self.pass.parents('.item').addClass('error');
            		}
            	}
            })
        },
        charCodeAt : function(str){
        	var code = '';
        	for (var i = 0,len = str.length; i < len; i++) {
        		if(i == len-1){
        			code += str.charCodeAt(i)+this.time
        		}else{
        			code += str.charCodeAt(i)+this.time+'%'
        		}
        	}
        	return code;
        },
        fromCharCode : function(code){
        	var str = '';
        		code = code.split("%");
        	for (var i = 0,len = code.length; i < len; i++) {
        		code[i] = code[i]-this.time;
        		str += String.fromCharCode(code[i])
        	}
        	return str;
        },
        focus : function(obj){
            obj.on('focus',function(){
                $(this).parents('.item').addClass('focus');
            })
        },
        bindFocus : function(){
            var self = this;
            this.focus(self.mobile);
            this.focus(self.pass);
        },
        blur  : function(obj,num){
            var self = this;
            obj.on('blur',function(){
                switch(num){
                    case '0' : self.check().mobile();
                    break;
                    case '1' : self.check().pass();
                    break;
                }
                $(this).parents('.item').removeClass('focus');
            })
        },
        bindBlur  : function(){
            var self = this;
            this.blur(self.mobile,"0");
            this.blur(self.pass,"1");
        },
        submit : function(){
            var self = this;
            $(document).on('keydown',function(e){
                if(e.which == 13){
                    submitfn();
                }
            });
            this.form.on('click','#login-submit',function(){
                submitfn();
                return false;
            });
            function submitfn(){
                if(!self.check().mobile() && !self.check().pass()){
                    self.error.html(self.errmsg.submit).removeClass('hide');
                    return false;
                }
                if(!self.check().mobile()){
                    self.error.html(self.errmsg.mobile).removeClass('hide');
                    return false;
                }
                if(!self.check().pass()){
                    self.error.html(self.errmsg.password).removeClass('hide');
                    return false;
                }
                var serialize = self.strToJson(self.form.serialize());
                $.ajax({
                    url:'/api/v2/web/login',
                    type: 'POST',
                    contentType : 'application/json; charset=utf-8',
                    dataType: 'json',
                    data : JSON.stringify(serialize),
                    processData : false
                })
                .done(function(res) {
                    if(res.data != null){
                        if(!!self.winSearch){
                            window.location.href = self.winSearch;
                        }else{
                            window.location.href = res.data.url+self.winHash;
                        }
                    }else{
                        self.error.html(res['err_msg']).removeClass('hide');
                    }
                    if(res['err_msg']){
                        self.checkStep = 2;
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
                }
            }else{
                var  temp = str.split("=");
                json[temp[0]] = temp[1]
            }
            return json;
        }
    };
    var login = new Login();
    login.init();
})
