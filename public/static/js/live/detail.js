$(function(){
	var winHash = window.location.search.substring(1);
    var $liveBanner = $('#j-live-banner');
    var $liveShow = $('#j-live-show');
	//渲染生成列表
	function loadList(){
		$.getJSON(RootUrl+'api/v1/share/'+winHash,function(res){
			var data = res['data'];
			if(data != null){
				$.getJSON(RootUrl+'api/v1/designer/'+data.designerid+'/basicinfo',function(res){
					var info = res['data'];
					if(info != null){
						createList(data,info)
					}
				})
			}
		})
	}
	//渲染数据
	function createList(data,info){
		$liveBanner.html("");
		$liveShow.html("");
		var status = data.process.length-1;
		var sList = '<div class="m-state"><div class="state-box"><div class="list f-cb">';
		for (var i = 0; i < 7; i++){
			if(i == status){
				sList += '<div class="state active current"><div class="circle"></div><p>'+globalData.dec_flow[i]+'</p></div>'
			}else if(i < status){
				sList += '<div class="state active"><div class="circle"></div><p>'+globalData.dec_flow[i]+'</p></div>'
			}else{	
				sList += '<div class="state"><div class="circle"></div><p>'+globalData.dec_flow[i]+'</p></div>'
			}
		};
		sList += '<div class="line"><div class="line-in line'+status+'"></div></div></div></div>'
		var head = info.imageid ? RootUrl+'api/v1/image/'+info.imageid : '../../static/img/public/headpic.jpg';
		var sBanner = '<div class="g-wp">'
				+'<h2>'+data.cell+'</h2>'
			+'<p>参考造价：<strong>'+data.total_price+'</strong>万元<span>|</span>户型：'+globalData.house_type[data.house_type]+'<span>|</span>面积：'+data.house_area+'m&sup2;</p>'
			+'<ul>'
				+'<li>'
					+'<a href="../design/homepage.html?'+info._id+'" class="head">'
						+'<span class="head-pic"><img src="'+head+'" alt="'+info.username+'" /></span>'
						+'<span class="head-name">'+info.username+'</span>'
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
		for (var i = 0; i < data.process.length; i++) {
			sStep += '<div class="item" data-itme="state'+i+'"><h4><i></i><span class="time">'+format("yyyy-MM-dd",data.process[i].date)+'</span><span class="state">'+globalData.dec_flow[data.process[i].name]+'</span></h4><div class="pic">'
			var sPic = '';
			for (var j = 0; j < data.process[i].images.length; j++) {
				sPic += '<img src="'+RootUrl+'api/v1/image/'+data.process[i].images[j]+'" alt="">'
			};
			sStep += sPic
			if(!!data.process[i].description){
				sStep += '<p>'+ data.process[i].description +'</p>'
			}
			sStep += '</div></div>';
		};
		sStep += '</div>';
		$liveBanner.html(sBanner);
		$liveShow.append(sList);
		$liveShow.append(sDoec);
		$liveShow.append(sStep);
	}
	loadList();
})