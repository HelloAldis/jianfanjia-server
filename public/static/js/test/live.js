$(function(){
	var $authed = $('#j-authed');
	var $list = $authed.find('tbody');
	//渲染生成列表
	function loadList(){
		var url = RootUrl+'api/v1/admin/authing_designer';
		$.ajax({
			url:url,
			type: 'GET',
			contentType : 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(res){
				if(res['data'].length){
					page(res['data'])
				}else{
					alert('没有需要装修直播')
				}
		   	}
		});
	}
	//创建列表
	function createList(data){
		return '<tr data-uid="'+data._id+'">'
					+'<td class="td1">'+data.username+'</td>'
					+'<td class="td2">'+data.sex+'</td>'
					+'<td class="td3">'+data.phone+'</td>'
					+'<td class="td4">'+data.province+' '+data.city+' '+data.district+'</td>'
					+'<td class="td5"><a href="../tpl/design/homepage.html?'+data._id+'">查看('+data.product_count+')</a></td>'
					+'<td class="td6"><a href="javascript:;" class="confirm">认证</a></td>'
				+'</tr>'
	}
	//生成分页
	function page(arr){
		var page = new Pageing({
			id : 'j-page',
			allNumPage : arr.length,
			itemPage : 5,
			showPageNum : 9,
			endPageNum : 1,
			currentPage : 0,
			linkTo : '',
			callback : function(num,obj){
				var maxElem = Math.min((num+1)*this.itemPage , this.allNumPage)
				$list.html('');
				for(var i = num*this.itemPage; i < maxElem;i++){
					$list.append(createList(arr[i]));
				}
				$list.find('li:odd').attr('class', 'even');
				obj.find('.btns').on('click' , function(){
					$('body,html').animate({scrollTop:$authed.offset().top},1000);
				});
				return false;
			}
		});
	};
	// // //认证操作
	// $authed.delegate('.confirm','click',function(ev){
	// 	ev.preventDefault();
	// 	var self = $(this);
	// 	var oDl = $(this).closest('tr');
	// 	var uidName = oDl.data('uid');
	// 	var url = RootUrl+'api/v1/admin/authed';
	// 	$.ajax({
	// 		url:url,
	// 		type: 'POST',
	// 		contentType : 'application/json; charset=utf-8',
	// 		dataType: 'json',
	// 		data : JSON.stringify({
	// 			"_id" : uidName
	// 		}),
	// 		processData : false,
	// 		success: function(res){
	// 			if(res["msg"] === "success"){
	// 				alert('认证成功')
	// 				loadList();
	// 			}else{
	// 				alert('提交失败')
	// 			}
	// 	   	}
	// 	});
	// })
	loadList();
})