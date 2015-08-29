$(function(){
	var $design = $("#j-design-list");
	var $list = $design.find('.m-list');
	var $filter = $design.find('.m-filter');
	//渲染生成列表
	function loadList(){
		var url = RootUrl+'api/v1/designer/search';
		$.ajax({
			url:url,
			type: 'POST',
			contentType : 'application/json; charset=utf-8',
			dataType: 'json',
			data : JSON.stringify({
				"query":{
				},
				"sort":{
				    "auth_date":1
				}
			}),
			processData : false,
			success: function(res){
				console.log(res)
				if(res['data'].length > 0){
					page(res['data'])
				}else{
					alert('没有数据')
				}
		   	}
		});
	}

	loadList();
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
		// var works = '';
		// for (var i = 0,len = data.; i < Things.length; i++) {
		// 	Things[i]
		// };
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
          					+'<a href="../user/owner_design.html?'+data._id+'" class="btn">添加意向</a>'
          				+'</div>'
          			+'</div>'
          			+'<div class="m-ct f-cb">'
							+'<div class="works"><img src="'+ImgId+'" alt="{{../name}}的作品"/></div>'
          			+'</div>'
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
				$list.html('');
				for(var i=num*this.itemPage;i<maxElem;i++){
					$list.append(createList(arr[i]));
				}
				$design.find('li:odd').attr('class', 'even');
				obj.find('.btns').on('click' , function(ev){
					ev.stopPropagation();
					$('body,html').animate({scrollTop:$design.offset().top},1000);
				});
				
				return false;
			}
		});
	};
	//排序
	function filterSort(oType,query){
		var url = RootUrl+'api/v1/designer/search';
		$.ajax({
			url:url,
			type: 'POST',
			contentType : 'application/json; charset=utf-8',
			dataType: 'json',
			data : JSON.stringify({
			  	"query":{
			  		oType : query
			  	},
				 "sort":{
				    "auth_date":1
				}
			}),
			processData : false,
			success: function(res){
				console.log(res)
				//loadList();
		   	}
		});
	}
	$filter.delegate('a','click',function(ev){
		ev.preventDefault();
		var oDl = $(this).closest('dl');
		$(this).attr('class','current').siblings().attr('class', '');
		filterSort(oDl.data('type'),$(this).data('query'));
	})
});