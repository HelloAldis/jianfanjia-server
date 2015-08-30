$(function(){
	var winHash = window.location.hash.substring(1),
		index = 1,
		$design = $('#j-design'),
		$aLi = $design.find('.tabNav').find('li'),
		$oList = $design.find('.listBox'),
		$createBtn = $design.find('.create-btn'),
		$list = $design.find('.m-table').find('tbody'),
		desUid = ;
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
	$design.delegate('.editor','click',function(ev){
		ev.preventDefault();
	})
	//渲染生成列表
	function loadList(){
		var url = RootUrl+'api/v1/designer/'+desUid+'/products';
		$.ajax({
			url:url,
			type: 'GET',
			contentType : 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(res){
				console.log(res['data'])
				if(res['data'].length == 0 || res['data'].length < 1){
					fnToggle(1)
					$aLi.eq(0).hide();
				}else{
					fnToggle(0)
					$aLi.eq(0).show();
					createList(res['data'])
				}
		   	}
		});
	}
	loadList()
	//创建列表
	function createList(data){
		$list.html('');
		var sLi = '';
		for (var i = 0,len = data.length; i < len; i++) {
			sLi += '<tr data-uid="'+data[i]._id+'">'
						+'<td class="td1">'+data[i].cell+'</td>'
						+'<td class="td2">'+globalData.house_type[data[i].house_type]+'</td>'
						+'<td class="td3">'+globalData.dec_style[data[i].dec_style]+'</td>'
						+'<td class="td4">'+globalData.work_type[data[i].work_type]+'</td>'
						+'<td class="td5">'
							+'<a href="../design/detail.html?'+data[i]._id+'"><i class="iconfont">&#xe60f;</i></a>'
						+'</td>'
						+'<td class="td6">'
							+'<a href="javascript:;" class="editor"><i class="iconfont">&#xe607;</i>编辑</a>'
							+'<a href="javascript:;" class="delete"><i class="iconfont">&#xe611;</i>删除</a>'
						+'</td>'
					+'</tr>'
		};
		$list.html(sLi)
	}
	//删除作品列表图片
	$design.delegate('.close','click',function(ev){
		ev.preventDefault();

		if($('#j-file-list').find('.previews-item').size() < 2){
			alert('至少保留一个作品效果图')
			return false;
		}
		if(confirm("你确定要删除吗？删除不能恢复")){
			var oDl = $(this).closest('.previews-item');
			oDl.remove();
		}
	})
	//删除
	$design.delegate('.delete','click',function(ev){
		ev.preventDefault();
		if($list.find('tr').size() < 2){
			alert('至少保留一个作品')
			return false;
		}
		if(confirm("你确定要删除吗？删除不能恢复")){
			var oDl = $(this).closest('tr');
			var uidName = oDl.data('uid');
			oDl.remove();
			var url = RootUrl+'api/v1/designer/product';
			$.ajax({
				url:url,
				type: 'DELETE',
				contentType : 'application/json; charset=utf-8',
				dataType: 'json',
				data : JSON.stringify({
					"_id" : uidName
				}),
				processData : false,
				success: function(res){
					if(res["msg"] == "success"){
						alert('删除成功')
						loadList();
					}else{
						alert('删除失败')
					}
			   	}
			});
		}
	})
	//发布作品
	$('#design-product').on('submit',function(){
		var url = RootUrl+'api/v1/designer/product';
		var aPreviewsItem = $('#j-file-list').find('.previews-item');
		var images = []
		aPreviewsItem.each(function(i,el){
			images.push({
				section:$(el).find('.value').val(),
			    imageid:$(el).data('imgid'),
			    description:$(el).find('.textarea').val()
			})
		})
		$.ajax({
			url:url,
			type: 'POST',
			contentType : 'application/json; charset=utf-8',
			dataType: 'json',
			data : JSON.stringify({
				"city":"武汉",
			  	"cell": $('#product_name').val(),
			  	"house_type":$('#product-house-type').find('input').val(),
			  	"house_area": parseInt($('#product-dec-area').val()),
			  	"dec_style":$('#product-dec-type').find('input').val(),
			  	"work_type":$('#product-work-type').find('input').val(),
			  	"total_price":parseInt($('#product-price').val()),
			  	"description" : $('#product-description').val(),
			  	"images" : images
			}),
			processData : false,
			success: function(res){
				console.log(res)
				loadList();
		   	}
		});
		return false;
	})
})