$(function(){
	var img_id_upload=[];//初始化数组，存储已经上传的图片名
	var i=0;//初始化数组下标
	    $('#fileToUpload').uploadify({
	    	'auto'     : false,//关闭自动上传
	    	'removeTimeout' : 1,//文件队列上传完成1秒后删除
	        'swf'      : 'uploadify.swf',
	        'uploader' : RootUrl+'api/v1/image/upload',
	        'method'   : 'post',//方法，服务端可以用$_POST数组获取数据
			'buttonText' : '选择图片',//设置按钮文本
	        'multi'    : true,//允许同时上传多张图片
	        'uploadLimit' : 10,//一次最多只允许上传10张图片
	        'fileTypeDesc' : 'Image Files',//只允许上传图像
	        'fileTypeExts' : '*.gif; *.jpg; *.png',//限制允许上传的图片后缀
	        'fileSizeLimit' : '20000KB',//限制上传的图片不得超过200KB 
	        'onUploadSuccess' : function(file, data, response) {//每次成功上传后执行的回调函数，从服务端返回数据到前端
	        	var data = $.parseJSON(data)
	               img_id_upload[i]=data.data;
	               i++;
	               if(!data.data){
	               		$('#upload').find('img').attr('src',RootUrl+'api/v1/image/'+data.data).data('imgId',data.data)
	               }
	        },
	        'onQueueComplete' : function(queueData) {//上传队列全部完成后执行的回调函数
	           // if(img_id_upload.length>0)
	           // alert('成功上传的文件有：'+encodeURIComponent(img_id_upload));
	        }  
	        // Put your options here
	    });
	var check_step = 0;
    var errMsg = {
        "reg_name": "请输入姓名",
        "reg_sex" : "请选择性别",
        "reg_addr" : "请输入邮寄详细地址",
        "reg_uid": "身份证号格式错误",
        "reg_decType1": "至少选择1项",
        "reg_decType3" : "最多选择3项",
        "reg_price1" : "请输入正确的半包金额",
        "reg_price2" : "请输入正确的全包金额",
    };
    //获取对象
    var desName = $("#design-name");
    var desSex = $("#design-sex");
    var desArea = $("#design-area");
    var desAddr = $("#design-addr");
    var desUid = $('#design-uid');
    var desCom = $("#design-com");
    var desDecType = $("#decoration-type");
    var desDecStyle = $("#decoration-style");
    var desDecArea = $("#decoration-area");
    var desPrice = $("#design-price");
    var desDecPrice0 = $('#decoration-price0');
    var desDecPrice1= $("#decoration-price1");
    var desChatType = $("#chat-type");
    var desHouseIntent = $("#house-intent");
    var desPhilosophy = $("#design-philosophy");
    var desAchievement = $("#design-achievement");
    //显示验证信息
   	function showError(obj,id, msg) {
        var msg = msg || errMsg[id];
        var parent = obj.closest('.m-item');
        parent.find('.tips-icon-ok').addClass('hide');
        parent.find('.tips-icon-err').removeClass('hide');
        parent.find('.tips-info').html(msg).removeClass('hide')
        return false;
    }
    function showOk(obj,value) {
    	var parent = obj.closest('.m-item');
        parent.find('.tips-icon-err').addClass('hide');
        if(!value){
	        if ($.trim(obj.val()) != ""){
	        	parent.find('.tips-icon-ok').removeClass('hide');
	        	parent.find('.tips-info').html('').addClass('hide')
	        }
	    }else{
	    	parent.find('.tips-info').html('').addClass('hide')
	    }
        check_step--;
        return true;
    }
    //事件操作
    desName.on('blur',function(){
        checkName();
    });
    desAddr.on('blur',function(){
        checkAddr()
    });
    desUid.on('blur',function(){
        checkUid();
    });
    desDecPrice0.on('blur',function(){
        checkPrice1(); 
    });
    desDecPrice1.on('blur',function(){
        checkPrice2(); 
    });
    desDecType.find('label').on('click',function(){
        checkDecType();
    });
    desSex.find('label').on('click',function(){
        checkSex();
    });
    desDecStyle.find('label').on('click',function(){
        checkDecStyle();
    });
    desDecArea.find('label').on('click',function(){
        checkDecArea();
    });
    desHouseIntent.find('label').on('click',function(){
        checkHouseIntent();
    });
    var iCount = 0;
    desDecStyle.find('input').on('click',function(){
    	checkDecStyle()
        if($(this).is(":checked")){
        	iCount ++;
        }else{
        	iCount --;
        }
        if(iCount > 3){
        	return showError(desDecStyle,"reg_decType3");
        }
    });
    //验证函数
    function checkName(){    //用户验证
     	var id = "reg_name";
        if ($.trim(desName.val()) != ""){
            return showOk(desName);
        }
        return showError(desName,id);
    }
    function checkSex(){    //性别
        if(desSex.find('input').eq(0).is(":checked")){
            check_step--;
            desSex.find('.tips-info').addClass('hide').html("")
            return false;
        }else if(desSex.find('input').eq(1).is(":checked")){
        	check_step--;
            desSex.find('.tips-info').addClass('hide').html("")
            return false;
        }else{
        	desSex.find('.tips-info').removeClass('hide').html(errMsg["reg_sex"])
        	return false;
        } 
    }
    function checkAddr(){    //邮寄地址验证
     	var id = "reg_addr";
        if ($.trim(desAddr.val()) != ""){
            return showOk(desAddr);
        }
        return showError(desAddr,id);
    }
    function checkUid(){    //身份证验证
     	var id = "reg_uid";
        if (!!$.trim(desUid.val())  && IdentityCodeValid(desUid.val()).verify){
            return showOk(desUid);
        }
        return showError(desUid,id);
    }
    function checkDecType(){    //装修类别验证
     	var id = "reg_decType1";
        if (desDecType.find('input').is(":checked")){
            return showOk(desDecType,true);
        }
        return showError(desDecType,id);
    }
    function checkDecStyle(){    //擅长风格验证
     	var id = "reg_decType1";
        if(desDecStyle.find('input').is(":checked")){
            return showOk(desDecStyle,true);
        }
        return showError(desDecStyle,id);
    }
    function checkDecArea(){    //接单区域验证
     	var id = "reg_decType1";
        if(desDecArea.find('input').is(":checked")){
            return showOk(desDecArea,true);
        }
        return showError(desDecArea,id);
    }
    function checkPrice1(){    //半包验证
    	var id = "reg_price1";
    	var reg = /^[1-9]*[1-9][0-9]*$/
		if(!!$.trim(desDecPrice0.val())){
			if(desDecPrice0.val() != 0){
				if(reg.test(desDecPrice0.val())){
					return showOk(desDecPrice0);
				}
			}
		}
     	return showError(desDecPrice0,id);
    }
    function checkPrice2(){    //全包验证
    	var id = "reg_price2";
    	var reg = /^[1-9]*[1-9][0-9]*$/
		if(!!$.trim(desDecPrice1.val())){
			if(desDecPrice1.val() != 0){
				if(reg.test(desDecPrice1.val())){
					return showOk(desDecPrice1);
				}
			}
		}
     	return showError(desDecPrice1,id);
    }
    function checkHouseIntent(){    //意向接单户型验证
     	var id = "reg_decType1";
        if (!desChatType.find('input').is(":checked")){
            return showOk(desChatType,true);
        }
        return showError(desChatType,id);
    }
	function loadList(){
		var url = RootUrl+'api/v1/designer/info';
		$.ajax({
			url:url,
			type: 'GET',
			contentType : 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(res){
				console.log(res)
				var data = res['data'];
				desArea.empty()
				if(data != null){
					desName.val(data.username);
					desAddr.val(data.address);
					$('#design-phone').html(data.phone);
					desSex.find('input[value='+data.sex+']').attr('checked','checked');
					desUid.val(data.uid)
					if(!!data.province){
						var designAreaQuery = data.province+" "+data.city+" "+data.district;
						desArea.find('input[name=design-area]').val(designAreaQuery)
						var designArea = new CitySelect({id :'design-area',"query":designAreaQuery});
					}else{
						desArea.find('input[name=design-area]').val("")
						var designArea = new CitySelect({id :'design-area'});
					}
					desCom.val(data.company || "");
					desPhilosophy.val(data.philosophy || "");
					desAchievement.val(data.achievement || "");
					desChatType.find('input[value='+data.communication_type+']').attr('checked','checked');
					desPrice.find('input[value='+data.design_fee_range+']').attr('checked','checked');
					desDecPrice0.val(data.dec_fee_half || "")
					desDecPrice1.val(data.dec_fee_all || "")
					$('#product-count').html(data.product_count+'个');
					if(data.auth_type == 0){
						$('#auth-box').show();
					}else if(data.auth_type == 1){
						$('#auth-box').empty().html('正在认证中，请耐心等待！');
					}else if(data.auth_type == 2){
						$('#auth-box').empty().html('认证成功！');
					}
					$.each(data.dec_styles,function(i,el){
						desDecStyle.find('[value='+data.dec_styles[i]+']').attr('checked','checked')
					});
					$.each(data.dec_types,function(i,el){
						desDecType.find('[value='+data.dec_types[i]+']').attr('checked','checked')
					});
					$.each(data.dec_districts,function(i,el){
						desDecArea.find('[value='+data.dec_districts[i]+']').attr('checked','checked')
					});
					desHouseIntent.html("");
					var yxhx = ""
					for (var i = 0,len = globalData.house_type.length; i < len; i++) {
							yxhx += '<label><input type="checkbox" name="decoration-style0" value="'+i+'" />'+globalData.house_type[i]+'</label>'
					};
					desHouseIntent.html(yxhx)
					$.each(data.dec_house_types,function(i,el){
						desHouseIntent.find('[value='+data.dec_house_types[i]+']').attr('checked','checked')
					});
					if(!!data.imageid){	
						$('#upload').find('img').attr('src',RootUrl+'api/v1/image/'+data.imageid)
					}
					var img = data.imageid != null  ?  RootUrl+'api/v1/image/'+data.imageid : '../../../static/img/public/headpic.jpg'
					$('#userHead').attr('src',img).data('img',data.imageid != null ? data.imageid : null)
				}else{
					var designArea = new CitySelect({id :'design-area'});
				}
		   	}
		});
	}
	loadList();
	//表单提交
	$('#design-info').on('submit',function(){
		check_step = 9;
		checkName();
		checkSex();
		checkAddr();
		checkUid();
		checkDecType();
		checkDecStyle();
		checkDecArea()
		checkPrice1();
        checkPrice2();
        checkHouseIntent();
		if(check_step > 0){
			return false;
		}
        var url = RootUrl+'api/v1/designer/info';
		var userName = desName.val();
		var userSex = desSex.find('input:checked').val();
		var userLocation = desArea.find('input[name=design-area]');
		console.log(!!userLocation.val())
		if(!!userLocation.val()){
			var userArr = userLocation.val().split(" ");
			var userProv = userArr[0];
			var userCity = userArr[1];
			var userDist = userArr[2];
		}else{
			var userProv = desArea.find('input[name=design-area0]').val();
			var userCity = desArea.find('input[name=design-area1]').val();
			var userDist = desArea.find('input[name=design-area2]').val();
		}
		var userAddr = desAddr.val();
		var userUid = desUid.val();
		var userCom = desCom.val();
		var userPhil = desPhilosophy.val();
		var userAchi = desAchievement.val();
		var userType = desChatType.find('input:checked').val();
		var userDecPrice0 = parseInt(desDecPrice0.val());
		var userDecPrice1 = parseInt(desDecPrice1.val());
		var userDesPrice = desPrice.find('input:checked').val();
		var userDecDis = [];
		desDecArea.find('input:checked').each(function(){
			userDecDis.push($(this).val())
		})
		var userDecTypes = [];
		desDecType.find('input:checked').each(function(){
			userDecTypes.push($(this).val())
		})
		var userDecStyles = [];
		desDecStyle.find('input:checked').each(function(){
			userDecStyles.push($(this).val())
		})
		var userDecHouse = [];
		desHouseIntent.find('input:checked').each(function(){
			userDecHouse.push($(this).val())
		})
		var imgId = $('#userHead').data('img') || null;
		$.ajax({
			url:url,
			type: 'PUT',
			contentType : 'application/json; charset=utf-8',
			dataType: 'json',
			data : JSON.stringify({
				"username" : userName,
				"sex":userSex,
				"province" : userProv,
				"city" : userCity,
				"district" : userDist,
				"address":userAddr,
				"uid":userUid,
				"company":userCom,
				"dec_types":userDecTypes,
				"dec_styles":userDecStyles,
				"dec_districts":userDecDis,
				"design_fee_range":userDesPrice,
				"dec_fee_half":userDecPrice0,
				"dec_fee_all":userDecPrice1,
				"achievement":userAchi,
                "philosophy":userPhil,
				"dec_house_types" : userDecHouse,
				"communication_type" : userType,
				"imageid" : imgId
			}),
			processData : false,
			success: function(res){
				if(res['msg'] === "success"){
					alert('保存成功')
					loadList()
				}else{
					$('#error-info').html(res['err_msg']).removeClass('hide');
				}
		   	}
		});
		return false;
	});
	//认证提交
	$('#auth-submit').on('click',function(){
        var url = RootUrl+'api/v1/designer/auth';
		$.ajax({
			url:url,
			type: 'POST',
			contentType : 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(res){
				if(res['msg'] === "success"){
					loadList()
					alert('认证成功！')
				}else{
					$('#error-info').html(res['err_msg']).removeClass('hide');
				}
		   	}
		});
		return false;
	});
	//获取HTML5特性支持情况
	//图片上传
	var checkSupport = function(){
		var input = document.createElement('input');
		var fileSupport = !!(window.File && window.FileList);
		var xhr = new XMLHttpRequest();
		var fd = !!window.FormData;
		return 'multiple' in input && fileSupport && 'onprogress' in xhr && 'upload' in xhr && fd ? 'html5' : 'flash';
	};
	var uploaderUrl = RootUrl+'api/v1/image/upload';
	if(checkSupport() === "html5"){
		$('#upload').Huploadify({
			auto:true,
			fileTypeExts:'*.jpg;*.png',
			multi:true,
			formData:{key:123456,key2:'vvvv'},
			fileSizeLimit:1024,
			showUploadedPercent:true,//是否实时显示上传的百分比，如20%
			showUploadedSize:true,
			removeTimeout:1,
			fileObjName:'Filedata',
			buttonText : "",
			uploader:uploaderUrl,
			onUploadComplete:function(file, data, response){
				callbackImg(data)
			},
			onDelete:function(file){
				console.log('删除的文件：'+file);
				console.log(file);
			}
		});
	}else{
		$('#fileToUpload').uploadify({
	    	'auto'     : true,//关闭自动上传
	    	'removeTimeout' : 1,//文件队列上传完成1秒后删除
	        'swf'      : 'uploadify.swf',
	        'uploader' : RootUrl+'api/v1/image/upload',
	        'method'   : 'post',//方法，服务端可以用$_POST数组获取数据
			'buttonText' : '',//设置按钮文本
	        'multi'    : true,//允许同时上传多张图片
	        'uploadLimit' : 10,//一次最多只允许上传10张图片
	        'width' : 250,
	        'height' : 250,
	        'fileTypeDesc' : 'Image Files',//只允许上传图像
	        'fileTypeExts' : '*.gif; *.jpg; *.png',//限制允许上传的图片后缀
	        'fileSizeLimit' : '1024KB',//限制上传的图片不得超过200KB 
	        'onUploadSuccess' : function(file, data, response){//每次成功上传后执行的回调函数，从服务端返回数据到前端
	            callbackImg(data)
	        },
	        'onQueueComplete' : function(queueData) {//上传队列全部完成后执行的回调函数
	           // if(img_id_upload.length>0)
	           // alert('成功上传的文件有：'+encodeURIComponent(img_id_upload));
	        }
	    });
	}
	function callbackImg(arr){
		var data = $.parseJSON(arr)
		$('#userHead').attr('src',RootUrl+'api/v1/image/'+data.data).data('img',data.data);
	}

})