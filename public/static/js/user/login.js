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
	var login_success_url = {
		"1" : "owner",
		"2" : "design"
	};
	var emptyMsg = {
        "login_mobile" : "请输入手机号",
        "login_password": "请输入密码",
        "login_tips" : "确保帐号安全，请勿在网吧或公用电脑上使用此功能！"
    };
    var errMsg = {
        "login_mobile": "手机号不正确",
        "login_password": "密码需为6~30个字母或数字"
    };
    var check_step = 0;
    //获取对象
	var mobile = $("#login-account");
    var pass = $("#login-password");
    var save = $('#saveUserInfo');
    //验证函数
    function checkMobile(){    //手机验证
     	var id = "login_mobile";
        if (isMobile(mobile.val())) {
            return showOk(mobile,id);
        }
        return showError(mobile,id);
    }
    function checkPassword() {    //密码验证
        var id = "login_password";
        if (isPassword(pass.val())) {
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
    save.on('click',function(){
    	saveUserInfo();
    })
    // 存储一个带7天期限的 cookie 
	function saveUserInfo(){
		var userName = decodeURIComponent(mobile.val()); 
		var passWord = decodeURIComponent(pass.val());
		if (save.is(":checked")) { 
			setCookie("rmbUser", "true",  7 ); 
			setCookie("userName", userName, 7 ); 
			setCookie("passWord", passWord,  7 ); 
			$('#error-info').removeClass('hide').html(emptyMsg['login_tips']);
		}else{ 
			delCookie("rmbUser"); 
			delCookie("userName"); 
			delCookie("passWord"); 
			$('#error-info').addClass('hide').html('');
		} 
	}
	//记住密码
	if(!getCookie("rmbUser") == null || getCookie("rmbUser")){
		mobile.val(encodeURIComponent(getCookie("userName")));
		pass.val(encodeURIComponent(getCookie("passWord")));
		save.attr("checked","checked");
	}
	$('#form-login').submit(function(){
		check_step = 2;
		checkMobile();
		checkPassword();
		if(check_step > 0){
			return false;
		}
		var url = RootUrl+'api/v1/login';
		var userName = mobile.val();
		var passWord = pass.val();
		$.ajax({
			url:url,
			type: 'post',
			contentType : 'application/json; charset=utf-8',
			dataType: 'json',
			data : JSON.stringify({
				"phone" : userName,
				"pass"  : passWord
			}),
			processData : false,
			success: function(res){
				if(res["data"]){
					window.location.href = login_success_url[res.data.usertype]+'.html'
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
