$(function(){
	var winHash = window.location.hash.substring(1),
		index = 1,
		$design = $('#j-design'),
		$aLi = $design.find('.tabNav').find('li'),
		$oList = $design.find('.listBox'),
		$createBtn = $design.find('.create-btn'),
        itme_typeArr = ['客厅','卧室','卫生间','餐厅','书房','厨房','儿童房','阳台','衣帽间','玄关','过道','休闲区','花园','地下室','窗台','楼梯','阁楼','商装','平面图'];
		if(winHash != 'new'){
			fnToggle(index)
		}
	function fnToggle(index){
		$aLi.eq(index).attr('class', 'active').siblings().attr('class','');
		$oList.eq(index).removeClass('hide').siblings().addClass('hide');
	};
	$aLi.on('click',function(){
		fnToggle($(this).index())
	})
	$createBtn.on('click',function(){
		fnToggle(1)
		return false;
	})
	var designArea = new CitySelect({id :'product-area'});
	var dec_house_type = new ComboBox({
		id : 'product-house-type',
		list : globalData.house_type,
		index :true
	});
	var dec_style = new ComboBox({
		id : 'product-dec-style',
		list : globalData.dec_style,
		index :true
	});
	var dec_type = new ComboBox({
		id : 'product-dec-type',
		list : globalData.dec_type,
		index :true
	});
	var work_type = new ComboBox({
		id : 'product-work-type',
		list : globalData.work_type,
		index :true
	});
	var check_step = 0;
	//获取选择器
	var $proArea = $('#product-area'),
	    $proName = $('#product_name'),
		$proHouseType = $('#product-house-type'),
		$proDecArea = $('#product-dec-area'),
		$proDecStyle = $('#product-dec-style'),
		$proDecType = $('#product-dec-type'),
		$proWorkType = $('#product-work-type'),
		$proPrice = $('#product-price'),
		$proDescription = $('#product-description'),
		$fileListBox = $('#j-file-list'),
		$fileList = $fileListBox.find('.file-list'),
		$proSubmit = $('#product-submit'),
		$proRrturn = $('#product-return');
	//验证信息
	var errMsg = {
        "reg_name": "请填写小区名称",
        "reg_area" : "请填写正确装修面积",
        "reg_price": "请填写正确装修造价",
        "reg_dscription": "请填写正确作品引言",
        "reg_product": "必须有一个作品效果图"
    };
	//验证函数
	function checkName(){    //小区名称
     	var id = "reg_name";
        if (!!$.trim($proName.val())) {
            return showOk($proName,id);
        }
        return showError($proName,id);
    }
    function checkArea(){    //装修面积
    	var id = "reg_area";
    	var reg = /^[1-9]*[1-9][0-9]*$/
		if(!!$.trim($proDecArea.val())){
			if($proDecArea.val() != 0){
				if(reg.test($proDecArea.val())){
					return showOk($proDecArea);
				}
			}
		}
     	return showError($proDecArea,id);
    }
    function checkPrice(){    //装修造价
    	var id = "reg_price";
    	var reg = /^[1-9]*[1-9][0-9]*$/
		if(!!$.trim($proPrice.val())){
			if($proPrice.val() != 0){
				if(reg.test($proPrice.val())){
					return showOk($proPrice);
				}
			}
		}
     	return showError($proPrice,id);
    }
    function checkDescription(){    //作品引言
    	var id = "reg_dscription";
        if (!!$.trim($proDescription.val())) {
            return showOk($proDescription,id);
        }
        return showError($proDescription,id);
    }
    function checkProduct(){    //作品平面图个数
    	var id = "reg_product";
    	var $proItem = $fileListBox.find('.previews-item');
    	if($proItem.size()){
    		check_step--;
    		return true;
    	}
    	$fileListBox.find('.tips-info').html(errMsg[id]).removeClass('hide');
        return false;
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
    $proName.on('blur',function(){
    	checkName();
    });
    $proDecArea.on('blur',function(){
    	checkArea();
    })
    $proPrice.on('blur',function(){
    	checkPrice();
    })
    $proDescription.on('blur',function(){
    	checkDescription();
    })        
	var winHashs = window.location.search.substring(1);
	//获取数据
	function loadList(){
		var url = RootUrl+'api/v1/product/'+window.location.search.substring(1);
		$.ajax({
			url:url,
			type: 'GET',
			contentType : 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(res){
				editorData(res['data'])
			}
		})
	}
	if(!!winHashs){
		loadList()
		$proRrturn.removeClass('hide');
	}else{
		$proRrturn.addClass('hide');
		//发布作品
		$proSubmit.on('click',function(){
			check_step = 5;
	    	checkName();
	    	checkArea();
	    	checkPrice();
	    	checkDescription();
	    	checkProduct();
	    	if(check_step > 0){
				return false;
			}
			var url = RootUrl+'api/v1/designer/product';
			var aPreviewsItem = $('#j-file-list').find('.previews-item');
			var images = []
			aPreviewsItem.each(function(i,el){
				images.push({
					"section":$(el).find('.value').val(),
				    "imageid":$(el).data('imgid'),
				    "description":$(el).find('textarea').val()
				})
			})
			var sProv = $proArea.find('input[name=product-area0]').val()
			var sCity = $proArea.find('input[name=product-area1]').val()
			var sDist = $proArea.find('input[name=product-area2]').val()
			$.ajax({
				url:url,
				type: 'POST',
				contentType : 'application/json; charset=utf-8',
				dataType: 'json',
				data : JSON.stringify({
					"province":sProv,
					"city":sCity,
					"district":sDist,
				  	"cell": $('#product_name').val(),
				  	"house_type":$('#product-house-type').find('input').val(),
				  	"house_area": parseInt($('#product-dec-area').val()),
				  	"dec_type":$('#product-dec-type').find('input').val(),
				  	"dec_style":$('#product-dec-style').find('input').val(),
				  	"work_type":$('#product-work-type').find('input').val(),
				  	"total_price":parseInt($('#product-price').val()),
				  	"description" : $('#product-description').val(),
				  	"images" : images
				}),
				processData : false,
				success: function(res){
					if(res["msg"] == "success"){
						promptMessage('发布成功',"success");
						window.location.href = 'design_products.html';
					}else{
						promptMessage('发布失败',"error")
					}
			   	}
			});
			return false;
		});
	}	//删除效果图
	$design.delegate('.close','click',function(ev){
		ev.preventDefault();
		if($('#j-file-list').find('.previews-item').size() < 2){
			alert('至少保留一个作品')
			return false;
		}
		if(confirm("你确定要删除吗？删除不能恢复")){
			var oDl = $(this).closest('.previews-item');
			oDl.remove();
		}
	})
	var $productArea = $('#product-area');
	function editorData(data){
		$productArea.empty();
		if(!!data.province){
			var sProductArea = data.province+" "+data.city+" "+data.district;
			$productArea.find('input[name=product-area]').val(sProductArea)
			var productArea = new CitySelect({id :'product-area',"query":sProductArea});
		}else{
			$productArea.find('input[name=product-area]').val("")
			var productArea = new CitySelect({id :'product-area'});
		}
		$proSubmit.html('保存编辑');
		$('#product_name').val(data.cell || "");
		$('#product-house-type').find('.value').html(globalData["house_type"][data.house_type]);
		$('#product-house-type').find('input').val(data.house_type);
		$('#product-dec-area').val(data.house_area);
		$('#product-dec-style').find('.value').html(globalData["dec_style"][data.dec_style]);
		$('#product-dec-style').find('input').val(data.dec_style);
		$('#product-dec-type').find('.value').html(globalData["dec_type"][data.work_type]);
		$('#product-dec-type').find('input').val(data.work_type);
		$('#product-work-type').find('.value').html(globalData["work_type"][data.work_type]);
		$('#product-work-type').find('input').val(data.work_type);
		$('#product-description').val(data.description);
		$('#product-price').val(data.total_price);
		$('#j-file-list').find('.previews-item').remove();
		var str = '';
		for (var i = 0,len = data.images.length; i < len; i++) {
			str += '<div class="previews-item" data-imgid="'+data.images[i].imageid+'">'
					+'<span class="close"></span>'
					+'<div class="pic">'
					+'<img class="img" src="'+RootUrl+'api/v1/image/'+data.images[i].imageid+'" alt="" />'
					+'</div>'
					+'<div class="m-select" id="itme_type'+i+'"></div>'
					+'<div class="textarea"><textarea name="itme_con" cols="30" rows="10">'+data.images[i].description+'</textarea></div>'
					+'</div>'
		};
		$fileList.append(str);
		for (var i = 0,len = data.images.length; i < len; i++) {
			var itme_type = new ComboBox({
				id : 'itme_type'+i,
				list : itme_typeArr,
				editor : true,
				query : $.inArray(data.images[i].section,itme_typeArr)
			});
		}
		$proSubmit.on('click',function(){
			var url = RootUrl+'api/v1/designer/product';
			var aPreviewsItem = $('#j-file-list').find('.previews-item');
			var images = []
			aPreviewsItem.each(function(i,el){
				images.push({
					"section":$(el).find('.value').val(),
				    "imageid":$(el).data('imgid'),
				    "description":$(el).find('textarea').val()
				})
			})
			var userLocation = $productArea.find('input[name=product-area]');
			if(!!userLocation.val()){
				var userArr = userLocation.val().split(" ");
				var userProv = userArr[0];
				var userCity = userArr[1];
				var userDist = userArr[2];
			}else{
				var userProv = $productArea.find('input[name=product-area0]').val();
				var userCity = $productArea.find('input[name=product-area1]').val();
				var userDist = $productArea.find('input[name=product-area2]').val();
			}
			$.ajax({
				url:url,
				type: 'PUT',
				contentType : 'application/json; charset=utf-8',
				dataType: 'json',
				data : JSON.stringify({
					"_id" : winHashs,
					"province":userProv,
					"city":userCity,
					"district":userDist,
				  	"cell": $('#product_name').val(),
				  	"house_type":$('#product-house-type').find('input').val(),
				  	"house_area": parseInt($('#product-dec-area').val()),
				  	"dec_type":$('#product-dec-type').find('input').val(),
				  	"dec_style":$('#product-dec-style').find('input').val(),
				  	"work_type":$('#product-work-type').find('input').val(),
				  	"total_price":parseInt($('#product-price').val()),
				  	"description" : $('#product-description').val(),
				  	"images" : images
				}),
				processData : false,
				success: function(res){
					if(res["msg"] == "success"){
						promptMessage('保存成功',"success");

						loadList();
					}else{
						promptMessage('保存失败',"error")
					}
			   	}
			});
			return false;
		});
	}
	//获取HTML5特性支持情况
	//图片上传
	var img_id_upload=[];//初始化数组，存储已经上传的图片名
	var i=0;//初始化数组下标
	var checkSupport = function(){
		var input = document.createElement('input');
		var fileSupport = !!(window.File && window.FileList);
		var xhr = new XMLHttpRequest();
		var fd = !!window.FormData;
		return 'multiple' in input && fileSupport && 'onprogress' in xhr && 'upload' in xhr && fd ? 'html5' : 'flash';
	};
	var uploaderUrl = RootUrl+'api/v1/image/upload';
	uploadImg('upload','fileToUpload',function(arr){
		var data = $.parseJSON(arr);
		var iCount = (new Date()).getTime();
		var str = '<div class="previews-item" data-imgid="'+data.data+'">'
				+'<span class="close"></span>'
				+'<div class="pic">'
				+'<img class="img" src="'+RootUrl+'api/v1/image/'+data.data+'" alt="" />'
				+'</div>'
				+'<div class="m-select" id="itme_type'+iCount+'"></div>'
				+'<div class="textarea"><textarea name="itme_con" cols="30" rows="10"></textarea></div>'
				+'</div>'
		$fileList.append(str)
		var itme_type = new ComboBox({
			id : 'itme_type'+iCount,
			list : itme_typeArr,
			editor : true
		});
		$fileListBox.find('.tips-info').html("").addClass('hide');
	})
	function uploadImg(obj1,obj2,callback){
		if(checkSupport() === "html5"){
			$('#'+obj1).Huploadify({
				auto:true,
				fileTypeExts:'*.jpg;*.png',
				multi:false,
				formData:{key:123456,key2:'vvvv'},
				fileSizeLimit:1024,
				showUploadedPercent:true,
				showUploadedSize:true,
				removeTimeout:1,
				fileObjName:'Filedata',
				buttonText : "",
				uploader:uploaderUrl,
				onUploadComplete:function(file, data, response){
					 callback(data)
				}
			});
		}else{
			$('#'+obj2).uploadify({
		    	'auto'     : true,
		    	'removeTimeout' : 1,
		        'swf'      : 'uploadify.swf',
		        'uploader' : RootUrl+'api/v1/image/upload',
		        'method'   : 'post',
				'buttonText' : '',
		        'multi'    : false,
		        'uploadLimit' : 10,
		        'width' : 250,
		        'height' : 250,
		        'fileTypeDesc' : 'Image Files',
		        'fileTypeExts' : '*.gif; *.jpg; *.png',
		        'fileSizeLimit' : '1024KB',
		        'onUploadSuccess' : function(file, data, response) {
		               callback(data)
		        }
		    });
		}
	}
})