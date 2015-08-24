$(function(){
	// 检测函数
	function isMobile(mobile){
		return /^(13[0-9]{9}|15[012356789][0-9]{8}|18[0123456789][0-9]{8}|147[0-9]{8}|170[0-9]{8}|177[0-9]{8})$/.test(mobile);
	}
	function isPassword(str){
	   return (/^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{6,30}$/.test(str));
	}
	function isVerifyCode(str){
	   return (/^[\d]{6}$/.test(str));
	}
	var reg_success_url = 'login.html';
    var errMsg = {
        "getpw_mobile": "手机号不正确",
        "getpw_password": "密码需为6~30个字母或数字",
        "getpw_password_confirm": "两次输入的密码不一样",
        "getpw_smscode" : "短信验证码不正确"
    };
    var check_step = 0;
    //获取对象
    var mobile = $("#getpw-account");
    var captcha = $("#getpw-VerifyCode");
    var pass = $("#getpw-password");
    var pass2 = $("#getpw-password2");
    //验证函数
    function checkMobile(){    //手机验证
     	var id = "getpw_mobile";
        if (isMobile(mobile.val())) {
            return showOk(mobile,id);
        }
        return showError(mobile,id);
    }
    function checkCaptcha() {    //验证码验证
        var id = "getpw_smscode";
        if (isVerifyCode(captcha.val())) {
            return showOk(captcha,id);
        }
        return showError(captcha,id);
    }
    function checkPassword() {    //密码验证
        var id = "getpw_password";
        if (isPassword(pass.val())) {
            return showOk(pass,id);
        }
        return showError(pass,id);
    }
    function checkPasswordConfirm() {    //确认密码验证
        var id = "getpw_password_confirm";
        var passValue = pass.val();
        if (isPassword(pass2.val()) && pass2.val() == passValue) {
            return showOk(pass2,id);
        }
        return showError(pass2,id);
    }
    //显示验证信息
   	function showError(obj,id, msg) {
        var msg = msg || errMsg[id];
        var parent = obj.closest('.m-item');
        parent.find('.tips-icon-ok').addClass('hide');
        parent.find('.tips-icon-err').removeClass('hide');
        parent.find('.tips-info').html(msg).removeClass('hide')
        return false;
    }
    function showOk(obj) {
    	var parent = obj.closest('.m-item');
        parent.find('.tips-icon-err').addClass('hide');
        if ($.trim(obj.val()) != ""){
        	parent.find('.tips-icon-ok').removeClass('hide');
        	parent.find('.tips-info').html('').addClass('hide')
        }
        check_step--;
        return true;
    }
   	//事件操作
    mobile.on('blur',function(){
        checkMobile();
    });
    captcha.on('blur',function(){
        checkCaptcha();
    });
    pass.on('blur',function(){
        checkPassword();
    });
    pass2.on('blur',function(){
        checkPasswordConfirm(); 
    });
    //表单提交
	$('#form-getpw').on('submit',function(){
		check_step = 4;
		checkMobile();
        checkCaptcha();
        checkPassword();
        checkPasswordConfirm();
		if(check_step > 0){
			return false;
		}
        var url = RootUrl+'api/v1/update_pass';
		var userName = mobile.val();
		var verifyCode = captcha.val();
		var passWord = pass.val();
		var passWord2 = pass2.val();
		$.ajax({
			url:url,
			type: 'post',
			contentType : 'application/json; charset=utf-8',
			dataType: 'json',
			data : JSON.stringify({
				phone : userName,
				code : verifyCode,
				pass  : passWord,
				repass : passWord2
			}),
			processData : false,
			success: function(res){
				console.log(res)
                if(res["data"]){
                    window.location.href = reg_success_url;
                }else{
                    $('#error-info').html(res['err_msg']).removeClass('hide');
                    console.log(res['err_msg']);
                }
                if(res['err_msg']){
                    $('#error-info').html(res['err_msg']).removeClass('hide');
                }
		   	}
		});
		return false;
	});
	//获取验证码
	var VerifyCodeOff = true;
	var $getVerifyCode = $('#getVerifyCode');
	$getVerifyCode.on('click',function(){
		if(VerifyCodeOff && checkMobile()){
			VerifyCodeOff = false;
            countdown($(this),60)
			var userName = mobile.val();
			$.ajax({
				url:RootUrl+'api/v1/send_verify_code',
				type: 'post',
				contentType : 'application/json; charset=utf-8',
				dataType: 'json',
				data : JSON.stringify({
					phone : userName
				}),
				processData : false
			});
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
				obj.attr('class','f-fr vcode').html('重新获取验证码')
			}
		}, 1000)
    }
})