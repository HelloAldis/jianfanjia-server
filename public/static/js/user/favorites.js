$(function(){
	var $list = $('#favorites-list'); 
	function loadList(){
		var url = RootUrl+'api/v1/favorite/product';
		$.ajax({
			url:url,
			type: 'GET',
			contentType : 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(res){
				if(res['data'] != null){
					var data = res['data']['favorite_product'];
					$list.html('');
					for (var i = 0,len = data.length; i < len; i++){
						shareData(data[i])
					};

				}else{
					$list.html('<div class="loading nodata" id="j-loading"></div>')
				}
		   	}
		});
		return false;
	}
	function shareData(data){
		var url = RootUrl+'api/v1/product/'+data;
		$.ajax({
			url:url,
			type: 'GET',
			contentType : 'application/json; charset=utf-8',
			dataType: 'json',
			async : false,
			success: function(res){
				if(res['data'] != null){
					createList(res['data'],data)
				}
		   	}
		});
		return false;
	}
	function createList(data,id){
		var sLi = '';
		if(data == null){
			sLi = '<li data-uid="'+id+'">'
						+'<div class="pic"><img alt="" src="../../img/index/index-live-01.jpg"></div>'
						+'<div class="txt">'
							+'<h4>很遗憾</h4>'
							+'<div class="desc"></div>'
							+'<p>您收藏的作品已被作品无情的删除，点击取消收藏</p>'
						+'</div>'
						+'<a href="javascript:;" class="btn cancel">取消收藏</a>'
					+'</li>';
		}else{
			sLi += '<li>'
						+'<div class="pic"><img alt="'+data.cell+'" src="'+RootUrl+'api/v1/image/'+data.images[0].imageid+'"></div>'
						+'<div class="txt">'
							+'<h4>'+data.cell+'</h4>'
							+'<div class="desc">'
								+'<span>'+data.house_area+'m&sup2;</span><span>'+globalData.house_type[data.house_type]+'</span><span>'+globalData.dec_style[data.dec_style]+'</span>'
							+'</div>'
							+'<p>'+ellipsisStr(data.description,80)+'</p>'
						+'</div>'
						+'<a href="../design/detail.html?'+data._id+'" class="btn">查看详情</a>'
					+'</li>'
		}
		$list.append(sLi);
	};
	$list.delegate('.cancel','click',function(ev){
		ev.preventDefault();
		var url = RootUrl+'api/v1/favorite/product';
		var Uid = $(this).closest('li').data('uid');
		$.ajax({
			url:url,
			type: 'DELETE',
			contentType : 'application/json; charset=utf-8',
			dataType: 'json',
			data : JSON.stringify({
				"_id": Uid
			}),
			processData : false,
			success: function(res){
				loadList();
		   	}
		});
	});
	loadList();
})