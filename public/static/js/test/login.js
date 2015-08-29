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
    var login_success_url =["/","owner.html","design.html"];
	var emptyMsg = {
        "login_mobile" : "请输入账号",
        "login_password": "请输入密码",
    };
    var errMsg = {
        "login_mobile": "账号不正确",
        "login_password": "密码需为6~30个字母或数字"
    };
    var check_step = 0;
    //获取对象
	var mobile = $("#login-account");
    var pass = $("#login-password");
    //验证函数
    function checkMobile(){    //手机验证
     	var id = "login_mobile";
        if ($.trim(mobile.val()) != '') {
            return showOk(mobile,id);
        }
        return showError(mobile,id);
    }
    function checkPassword() {    //密码验证
        var id = "login_password";
        if ($.trim(pass.val()) != '') {
            return showOk(pass,id);
        }
        return showError(pass,id);
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
    pass.on('blur',function(){
        checkPassword();
    });
	$('#form-login').submit(function(){
		check_step = 2;
		checkMobile();
		checkPassword();
		if(check_step > 0){
			return false;
		}
		var url = RootUrl+'api/v1/admin/login';
		var userName = mobile.val();
		var passWord = pass.val();
		$.ajax({
			url:url,
			type: 'post',
			contentType : 'application/json; charset=utf-8',
			dataType: 'json',
			data : JSON.stringify({
				"username" : userName,
				"pass"  : passWord
			}),
			processData : false,
			success: function(res){
				console.log(res)
				if(res["msg"] == "success"){
                    window.location.href = "live.html";
				}else{
					$('#error-info').html(res['err_msg']).removeClass('hide');	
				}
				if(res['err_msg']){
					$('#error-info').html(res['err_msg']).removeClass('hide');
				}
		   	}
		});
		return false;
	})
});
