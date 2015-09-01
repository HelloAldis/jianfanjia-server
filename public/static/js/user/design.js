$(function(){
	var winHash = window.location.hash.substring(1),
		index = 1,
		$design = $('#j-design'),
		$aLi = $design.find('.tabNav').find('li'),
		$oList = $design.find('.listBox'),
		$createBtn = $design.find('.create-btn'),
        itme_typeArr = ['客厅','卧室','卫生间','餐厅','书房','厨房','儿童房','阳台','衣帽间','玄关','过道','休闲区','花园','地下室','窗台','楼梯','阁楼'];
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
	var $productArea = $('#product-area');
	//发布作品
/*	$('#login-submit').on('click',function(){
		var url = RootUrl+'api/v1/designer/product';
		var aPreviewsItem = $('#j-file-list').find('.previews-item');
		var images = []
		aPreviewsItem.each(function(i,el){
			images.push({
				"section":$(el).find('.value').data('val'),
			    "imageid":$(el).data('imgid'),
			    "description":$(el).find('textarea').val()
			})
		})
		var sProv = $productArea.find('input[name=product-area0]').val()
		var sCity = $productArea.find('input[name=product-area1]').val()
		var sDist = $productArea.find('input[name=product-area2]').val()
		var userLocation = $productArea.find('input[name=product-area]');
		if(!!userLocation.val()){
			var userArr = userLocation.val().split(" ");
			var userProv = userArr[0];
			var userCity = userArr[1];
			var userDist = userArr[2];
		}else{
			var userProv = sProv;
			var userCity = sCity;
			var userDist = sDist;
		}
		console.log({
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
			})
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
				console.log(res)
		   	}
		});
		return false;
	});*/
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
	}
	//删除效果图
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
		console.log(data)
		$productArea.empty();
		if(!!data.province){
			var sProductArea = data.province+" "+data.city+" "+data.district;
			$productArea.find('input[name=product-area]').val(sProductArea)
			var productArea = new CitySelect({id :'product-area',"query":sProductArea});
		}else{
			$productArea.find('input[name=product-area]').val("")
			var productArea = new CitySelect({id :'product-area'});
		}
		$('#login-submit').html('保存编辑');
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
		$('#j-file-list').append(str)
		for (var i = 0,len = data.images.length; i < len; i++) {
			var itme_type = new ComboBox({
				id : 'itme_type'+i,
				list : itme_typeArr,
				editor : true,
				query : $.inArray(data.images[i].section,itme_typeArr)
			});
		}
		$('#login-submit').on('click',function(){
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
			var sProv = $productArea.find('input[name=product-area0]').val()
			var sCity = $productArea.find('input[name=product-area1]').val()
			var sDist = $productArea.find('input[name=product-area2]').val()
			var userLocation = $productArea.find('input[name=product-area]');
			if(!!userLocation.val()){
				var userArr = userLocation.val().split(" ");
				var userProv = userArr[0];
				var userCity = userArr[1];
				var userDist = userArr[2];
			}else{
				var userProv = sProv;
				var userCity = sCity;
				var userDist = sDist;
			}
			$.ajax({
				url:url,
				type: 'PUT',
				contentType : 'application/json; charset=utf-8',
				dataType: 'json',
				data : JSON.stringify({
					"_id" : winHashs,
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
						promptMessage('保存成功',"success")
						loadList();
					}else{
						promptMessage('保存失败',"error")
					}
			   	}
			});
			return false;
		});
	}
})