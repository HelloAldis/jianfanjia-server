$(function(){
	var $design = $("#j-design-list");
	var $list = $design.find('.m-list');
	var $filter = $design.find('.m-filter');
	//渲染生成列表
	function loadList(data){
		var data = data || {"query":{},"sort":{ "auth_date":1}}
		var url = RootUrl+'api/v1/designer/search';
		$.ajax({
			url:url,
			type: 'POST',
			contentType : 'application/json; charset=utf-8',
			dataType: 'json',
			data : JSON.stringify(data),
			processData : false,
			success: function(res){
				if(res['data'].length > 0){
					page(res['data'])
				}else{
					$list.html('<div style="text-align: center;font-size: 20px;line-height: 50px;color: #fe7004;">没有您筛选的数据</div>')
				}
		   	}
		});
	}
	loadList()
	//创建列表
	function createList(data){
		var ImgId = !!data.imageid ? RootUrl+'api/v1/image/'+data.imageid : '../../static/img/public/headpic.jpg';
		var decStyles = '';
		for (var i = 0,len = data.dec_styles.length; i < len; i++) {
			decStyles += '<span>'+globalData.dec_style[data.dec_styles[i]]+'</span>';
		};
		var decDistricts = '';
		for (var i = 0,len = data.dec_districts.length; i < len; i++) {
			decDistricts += '<span>'+globalData.orders_area[data.dec_districts[i]]+'</span>'
		};
		var gohome = "";			
		if(window.usertype == 2){
			gohome = '<a href="homepage.html?'+data._id+'" class="btn">查看详情</a>'
		}else{
			gohome = '<a href="../user/owner_design.html" data-uid="'+data._id+'" class="btn addIntent">添加意向</a>'
		}
		var url = RootUrl+'api/v1/designer/'+data._id+'/products';
		var images  = $.ajax({
			url:url,
			type: 'GET',
			contentType : 'application/json; charset=utf-8',
			dataType: 'json',
			async : false,
			success: function(res){
				return res['data'];
		   	}
		});
		var imgData = $.parseJSON(images.responseText)["data"];
		var len1 = imgData.length > 3 ? 3 : imgData.length;
		var works = '';
        if(len1){
			for (var i = 0; i < len1; i++) {
				if(!!imgData[i].images[0]){
					works += '<a class="works" href="detail.html?'+imgData[i]._id+'"><img src="'+RootUrl+'api/v1/image/'+imgData[i].images[0].imageid+'" alt="'+imgData[i].cell+'"/></a>'
				}else{
					works = '<a class="works" href="homepage.html?'+data._id+'"><img src="../../static/img/public/default_products.jpg" alt="'+data.username+'的作品"/></a>';
				}
			};
		}else{
			works = '<a class="works" href="homepage.html?'+data._id+'"><img src="../../static/img/public/default_products.jpg" alt="'+data.username+'的作品"/></a>';
		}
		return  '<li>'
	          		+'<div class="g-wp">'
	          			+'<div class="m-tt f-cb">'
	          				+'<div class="info f-fl">'
	          					+'<div class="head">'
	          						+'<a href="homepage.html?'+data._id+'"><img src="'+ImgId+'" alt="'+data.username+'"/></a>'
	          					+'</div>'
	          					+'<div class="msg f-cb">'
	          						+'<dl>'
	          							+'<dt>'+data.product_count+'</dt>'
	          							+'<dd>作品</dd>'
	          						+'</dl>'
	          						+'<dl>'
	          							+'<dt>'+data.order_count+'</dt>'
	          							+'<dd>预约</dd>'
	          						+'</dl>'
	          					+'</div>'
	          				+'</div>'
	          				+'<div class="status f-fl">'
		          				+'<h4>'+data.username+'<span class="i-icon sex'+data.sex+'"></span></h4>'
	          					+'<div class="atte atte'+(data.auth_type-1)+'"><span class="i-icon"></span>认证设计师</div>'
	          					+'<div class="addr"><strong>接单区域：</strong>'+decDistricts+'<span class="i-icon"></span></div>'
	          					+'<div class="style"><strong>擅长风格：</strong>'+decStyles+'</div>'
	          				+'</div>'
	          				+'<div class="order f-fr">'
	          					+'<p><strong>'+globalData.price_area[data.design_fee_range]+'</strong>元/m&sup2;</p>'
	          					+gohome+'</div>'
	          			+'</div>'
	          			+'<div class="m-ct f-cb">'+works+'</div>'
	          		+'</div>'
	           +'</li>'
	};
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
				$list.html('<div class="loading" id="j-loading"></div>');
				var dataArr = [];
				for(var i=num*this.itemPage;i<maxElem;i++){
					dataArr.push(createList(arr[i]));
				}
				$list.html(dataArr);
				$design.find('li:odd').attr('class', 'even');
				obj.find('.btns').on('click',function(ev){
					//ev.stopPropagation();
					$('body,html').animate({scrollTop:$design.offset().top},1000);
					return false;
				});
				return false;
			}
		});
	};
	//筛选
	$design.find('.m-filter').find('a').on('click',function(){
		$(this).attr('class','current').siblings().attr('class', '');
		FilterSort()
		return false;
	});
	//排序
	function FilterSort(){
		var filter = {},
			sort = {},
			$filter = $design.find('.m-filter'),
			$sort = $design.find('.m-sort');
			$sort.find('a').each(function(index, el) {
				if($(el).hasClass('current')){
					if($(el).hasClass('sort')){
						sort[$(el).data('sort')] = 1
					}else{
						sort[$(el).data('sort')] = -1
					}
				}
			});
			$filter.find('a').each(function(index, el) {
				var oDl = $(this).closest('dl');
				if($(this).hasClass('current') && $(this).data('query') != -1){
					filter[oDl.data('type')] = $(this).data('query');
				}
			});
		loadList({
			"query" : filter,
			"sort" : sort
		});	
	}
	//排序
	$design.find('.m-sort').find('a').on('click',function(){
		var oDl = $(this).closest('dl');
		$(this).addClass('current').siblings().removeClass('current');
		if($(this).hasClass('sort')){
			$(this).removeClass('sort');
		}else{
			$(this).addClass('sort');
		}
		FilterSort()
		return false;
	});
	$design.delegate('.addIntent','click',function(ev){
		var slef = $(this)
		if(window.usertype == 1){
			ev.preventDefault();
			var uidname = $(this).data('uid');
			var url = RootUrl+'api/v1/user/designer';
			$.ajax({
				url:url,
				type: 'POST',
				contentType : 'application/json; charset=utf-8',
				dataType: 'json',
				data : JSON.stringify({
					"_id":uidname
				}),
				processData : false,
				success: function(res){
					if(res["msg"] == "success"){
						alert('添加成功');
						slef.html('查看详情').attr('href','homepage.html?'+uidname).removeClass('addIntent');
					}else if(res["err_msg"] != null){
						window.location.href = "../user/owner_design.html";
					}else{
						alert("添加失败")
					}
			   	}
			});
		}
	});
});