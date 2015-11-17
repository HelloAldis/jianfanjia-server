$(function(){ 
	var winHash = window.location.search.substring(1);
    var $liveBanner = $('#j-live-banner');
    var $liveShow = $('#j-live-show');
	//渲染生成列表
	function loadList(){
		$.ajax({
			url: RootUrl+'api/v2/web/search_share',
			type: 'POST',
			dataType: 'json',
			contentType : 'application/json; charset=utf-8',
			data: JSON.stringify({
			  "query":{
			  	"_id": winHash
			  },
			  "from":0,
			  "limit":1
			}),
			processData : false,
		})
		.done(function(res) {
			if(res['data']['total'] === 1){
				var data = res['data']['shares'][0];
				createList(data)
				$(".imgLoad").scrollLoading();
			}
		})
	}
	//渲染数据
	function createList(data){
		$liveBanner.html("");
		$liveShow.html("");
		var head = data.designer.imageid ? RootUrl+'api/v1/image/'+data.designer.imageid : '../../static/img/public/headpic.jpg';
		var sBanner = '<div class="g-wp">'
				+'<h2>'+data.cell+'</h2>'
			+'<p>参考造价：<strong>'+data.total_price+'</strong>万元<span>|</span>户型：'+globalData.house_type[data.house_type]+'<span>|</span>面积：'+data.house_area+'m&sup2;</p>'
			+'<ul>'
				+'<li>'
					+'<a href="../design/homepage.html?'+data.designer._id+'" class="head">'
						+'<span class="head-pic"><img src="'+head+'" alt="'+data.designer.username+'" /></span>'
						+'<span class="head-name">'+data.designer.username+'</span>'
						+'<span class="head-name">设计师</span>'
					+'</a>'
				+'</li>'
				+'<li>'
					+'<div class="head">'
						+'<span class="head-pic"><i class="iconfont">&#xe618;</i></span>'
						+'<span class="head-name">'+data.manager+'</span>'
						+'<span class="head-name">项目经理</span>'
					+'</div>'
				+'</li>'
			+'</ul>'
		+'</div>';
		var sDoec = '<div class="m-desc"><h3>设计方案简介：</h3><p>'+data.description+'</p></div>';
		var sStep = '<div class="m-step">';
		var status = data.process[data.process.length-1].name;
		for (var m = 0,len = globalData.dec_flow.length; m < len; m++){
			if(m == status){
				sStep += '<div class="item current" data-itme="'+m+'">'
			}else if(m < status){
				sStep += '<div class="item active" data-itme="'+m+'">'
			}else{
				sStep += '<div class="item" data-itme="'+m+'">'
			}
			sStep += '<h4><span class="state"><i></i></span><span class="name">'+globalData.dec_flow[m]+'</span><span class="time"></span></h4><div class="pic"></div></div>';
		}
		$liveBanner.html(sBanner);
		$liveShow.append(sDoec);
		$liveShow.append(sStep);
		var items = $liveShow.find('.item');
		for (var i = 0,len = data.process.length; i < len; i++) {
			for (var j = 0,len1 = items.size(); j < len1; j++) {
				if(items.eq(j).data('itme') == data.process[i].name){
					items.eq(j).find('.time').html(format("yyyy-MM-dd",data.process[i].date))
					var time = '';
					var sPic = '';
					for (var n = 0; n < data.process[i].images.length; n++) {
						sPic += '<img class="imgLoad" data-url="'+RootUrl+'api/v1/watermark/v1/'+data.process[i].images[n]+'" src="../../static/img/public/load.gif" alt="">'
					};
					time += sPic;
					if(!!data.process[i].description){
						time += '<p>'+ data.process[i].description +'</p>'
					}
					items.eq(j).find('.pic').html(time)
				}
			};
			
		};
	}
	loadList();
})