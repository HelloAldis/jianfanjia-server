$(function(){
	var $liveList = $('#j-live-list');
	//渲染生成列表
	function loadList(){
		var url = RootUrl+'api/v1/share';
		$.ajax({
			url:url,
			type: 'GET',
			contentType : 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(res){
				if(res['data'].length){
					var info = getInfo(res['data'])
					page(res['data'],info)
				}else{
					$liveList.html('<div class="loading nodata" id="j-loading"></div>');
				}
		   	}
		});
	}
	//获取设计师信息
	function getInfo(by){
		var infoArr = [];
		for (var i = 0; i < by.length; i++) {
			var url = RootUrl+'api/v1/designer/'+by[i].designerid+'/basicinfo';
			$.ajax({
				url:url,
				type: 'GET',
				contentType : 'application/json; charset=utf-8',
				dataType: 'json',
				async : false,
				success: function(res){
					if(res['data']){
						infoArr.push(res['data'])
					}
			   	}
			});
		};
		return infoArr
	}
	//创建列表
	function createList(data,info){
		var status = data.process[data.process.length-1].name;
		var sList = '';
		for (var i = 0; i < 7; i++) {
			if(i == status){
				sList += '<div class="state active current"><div class="circle"></div><p>'+globalData.dec_flow[i]+'</p></div>'
			}else if(i < status){
				sList += '<div class="state active"><div class="circle"></div><p>'+globalData.dec_flow[i]+'</p></div>'
			}else{	
				sList += '<div class="state"><div class="circle"></div><p>'+globalData.dec_flow[i]+'</p></div>'
			}
		};
		var imgId = data.process[data.process.length-1].images[0];
		var head = info.imageid ? RootUrl+'api/v1/image/'+info.imageid : '../../static/img/public/headpic.jpg';
		return '<li>'
					+'<div class="g-wp f-cb">'
						+'<a class="pic f-fl" href="detail.html?'+data._id+'"><img src="'+RootUrl+'api/v1/image/'+imgId+'" alt="'+data.cell+'" /></a>'
						+'<div class="txt f-fl">'
							+'<div class="info">'
								+'<h4><a href="detail.html?'+data._id+'">'+data.cell+'</a><span><strong>'+data.house_area+'m&sup2;</strong><strong>'+globalData.house_type[data.house_type]+'</strong></span></h4>'
								+'<p>装修风格：<span>'+globalData.dec_style[data.dec_style]+'</span>'
								+'</p>'
								+'<p>开工时间：<span>'+format("yyyy-MM-dd",data.start_at)+'</span></p>'
								+'<p>当前阶段：<span>'+globalData.dec_flow[data.process[data.process.length-1].name]+'</span></p>'
								+'<a href="detail.html?'+data._id+'" class="head">'
									+'<span class="head-pic"><img src="'+head+'" alt="" /></span>'
									+'<span class="head-name">'+info.username+'</span>'
								+'</a>'
							+'</div>'
							+'<div class="state-box">'
								+'<div class="list">'+sList+'</div>'
								+'<div class="line">'
									+'<div class="line-in line'+data.process[data.process.length-1].name+'"></div>'
								+'</div>'
							+'</div>'
						+'</div>'
					+'</div>'
				+'</li>'
	}
	//生成分页
	function page(arr,info){
		var page = new Pageing({
			id : 'j-page',
			allNumPage : arr.length,
			itemPage : 5,
			showPageNum : 9,
			endPageNum : 1,
			currentPage : 0,
			linkTo : '',
			callback : function(num,obj){
				if(this.allNumPage > 0){
					var maxElem = Math.min((num+1)*this.itemPage , this.allNumPage)
					$liveList.html('');
					for(var i=num*this.itemPage;i<maxElem;i++){
						$liveList.append(createList(arr[i],info[i]));
					}
					$liveList.find('li:odd').attr('class', 'even');
					obj.find('.btns').on('click' , function(ev){
						ev.stopPropagation();
						$('body,html').animate({scrollTop:$liveList.offset().top},1000);
					});
				}
				return false;
			}
		});
	};
	loadList();
})