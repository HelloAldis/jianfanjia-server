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
    var errMsg = {
        "reg_mobile": "手机号不正确",
        "reg_erren" : "手机号码已被使用",
        "reg_password": "密码需为6~30个字母或数字",
        "reg_password_confirm": "两次输入的密码不一样",
        "reg_smscode" : "短信验证码不正确",
        "reg_status" : "请选择身份",
        "reg_agree" : "请先同意注册协议"
    };
    var check_step = 0;
    //获取对象
    var mobile = $("#reg-account");
    var captcha = $("#reg-VerifyCode");
    var pass = $("#reg-password");
    var pass2 = $("#reg-password2");
    var status = $('#reg-status');
    var agreement = $("#reg-agreement");
    //验证函数
    function checkMobile(){    //手机验证
     	var id = "reg_mobile";
        if (isMobile(mobile.val())) {
            return showOk(mobile,id);
        }
        return showError(mobile,id);
    }
    function checkCaptcha() {    //验证码验证
        var id = "reg_smscode";
        if (isVerifyCode(captcha.val())) {
            return showOk(captcha,id);
        }
        return showError(captcha,id);
    }
    function checkPassword() {    //密码验证
        var id = "reg_password";
        if (isPassword(pass.val())) {
            return showOk(pass,id);
        }
        return showError(pass,id);
    }
    function checkPasswordConfirm() {    //确认密码验证
        var id = "reg_password_confirm";
        var passValue = pass.val();
        if (isPassword(pass2.val()) && pass2.val() == passValue) {
            return showOk(pass2,id);
        }
        return showError(pass2,id);
    }
    function checkAgree(){    //注册协议验证
    	if (agreement.is(":checked")) {
            check_step--;
            return true;
        } else {
            alert(errMsg["reg_agree"]);
            return false;
        }
    }
    function checkRoles(){    //选择身份
        if(status.find('input').eq(0).is(":checked")){
            check_step--;
            status.find('.tips-info').addClass('hide').html("")
            return false;
        }else if(status.find('input').eq(1).is(":checked")){
            check_step--;
            status.find('.tips-info').addClass('hide').html("")
            return false;
        }else{
            status.find('.tips-info').removeClass('hide').html(errMsg["reg_status"])
            return false;
        } 
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
        var userName = $.trim(mobile.val());
        if(isMobile(userName)){
            $.ajax({
                url:RootUrl+'api/v2/web/verify_phone',
                type: 'post',
                contentType : 'application/json; charset=utf-8',
                dataType : 'json',
                cache : false,
                data : JSON.stringify({
                    phone : userName
                }),
                processData : false,
                cache : false,
                success : function(res){
                    if(res["msg"] == "success"){
                        checkMobile()
                    }
                    if(res["err_msg"] != null){
                        showError(mobile,"reg_erren")
                    }
                }
            });
        }
        checkMobile()
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
    agreement.on('click',function(){
        checkAgree();
    });
    status.find('label').on('click',function(){
        if($(this).find('input').is(":checked")){
            $(this).find('input').attr("checked","checked");
            status.find('.tips-info').addClass('hide').html("");
        }
    })
    //表单提交
	$('#form-reg').on('submit',function(){
		check_step = 6;
		checkMobile();
        checkCaptcha();
        checkPassword();
        checkPasswordConfirm();
        checkAgree();
        checkRoles()
		if(check_step > 0){
			return false;
		}
        var url = RootUrl+'api/v2/web/signup';
		var userName = mobile.val();
		var verifyCode = captcha.val();
		var passWord = pass.val();
		var passWord2 = pass2.val();
		var statusType = status.find('input:checked').val();
		$.ajax({
			url:url,
			type: 'post',
			contentType : 'application/json; charset=utf-8',
			dataType: 'json',
			data : JSON.stringify({
				"phone" : userName,
				"code" : verifyCode,
				"pass"  : passWord,
				"repass" : passWord2,
				"type" : statusType
			}),
			processData : false,
            cache : false,
			success: function(res){
				if(res["data"] != null){
                    if(res["data"].url === "agree license url"){
                        window.location.href = 'design_agreement.html'
                    }else if(res["data"].url === "designer url"){
                        window.location.href = 'designer.html'
                    }else if(res["data"].url === "user url"){
                        window.location.href = 'owner.html'
                    }
				}else{
					$('#error-info').html(res['err_msg']).removeClass('hide');
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
                url:RootUrl+'api/v2/web/send_verify_code',
                type: 'post',
                contentType : 'application/json; charset=utf-8',
                dataType: 'json',
                cache : false,
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