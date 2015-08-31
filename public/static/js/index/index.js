$(function(){
	var login_success_url = '/' || global_success_url;
	var carousel = new Carousel({
		id : 'j-index-design',
		data : [
			{
				head   : '../../img/index/index-design-01.jpg',
				name  : '老外',
				type   : '资深设计师',
				idea   : 'This is the brand new house for family johnson.',
				url    : '',
				pos    : {
					width  :   352,
					height :   408,
					left   :   0,
					top    :   0,
					opacity : 0
				},
				picH : 226,
				blur   :  0,
				zIndex :  0 
			},
			{
				head   : '../../img/index/index-design-01.jpg',
				name  : '老外',
				type   : '资深设计师',
				idea   : 'This is the brand new house for family johnson.',
				url    : '',
				pos    : {
					width  :   352,
					height :   408,
					left   :   0,
					top    :   76,
					opacity : 0.8
				},
				picH : 226,
				blur   :  0.15,
				zIndex :  1 
			},
			{
				head   : '../../img/index/index-design-01.jpg',
				name  : '大胡子',
				type   : '资深设计师',
				idea   : 'This is the brand new house for family johnson.',
				url    : '',
				pos    : {
					width  :   398,
					height :   484,
					left   :   185,
					top    :   38,
					opacity : 1
				},
				picH : 267,
				blur   :  0.25,
				zIndex :  2
			},
			{
				head   : '../../img/index/index-design-01.jpg',
				name  : '大老外',
				type   : '资深设计师',
				idea   : 'This is the brand new house for family johnson.',
				url    : '',
				pos    : {
					width  :   460,
					height :   560,
					left   :   370,
					top    :   0,
					opacity : 1
				},
				picH : 310,
				blur   :  0.5,
				zIndex :  3 
			},
			{
				head   : '../../img/index/index-design-01.jpg',
				name  : '大胡外',
				type   : '资深设计师',
				idea   : 'This is the brand new house for family johnson.',
				url    : '',
				pos    : {
					width  :   398,
					height :   484,
					left   :   617,
					top    :   38,
					opacity : 1
				},
				picH : 267,
				blur   :  0.25,
				zIndex :  2
			},
			{
				head   : '../../img/index/index-design-01.jpg',
				name  : '子老外',
				type   : '资深设计师',
				idea   : 'This is the brand new house for family johnson.',
				url    : '',
				pos    : {
					width  :   352,
					height :   408,
					left   :   848,
					top    :   76,
					opacity : 0.8
				},
				picH : 226,
				blur   :  0.15,
				zIndex :  1
			},
			{
				head   : '../../img/index/index-design-01.jpg',
				name  : '子老外',
				type   : '资深设计师',
				idea   : 'This is the brand new house for family johnson.',
				url    : '',
				pos    : {
					width  :   352,
					height :   408,
					left   :   848,
					top    :   0,
					opacity : 0
				},
				picH : 226,
				blur   :  0,
				zIndex :  0
			}
		]
	});
	(function($){
		//banner
		var $banner = $('#j-banner');
		var oUl = $banner.find('ul');
		var aLi = $banner.find('ol').find('li');
		var oPrev = $banner.find('.prev');
		var oNext = $banner.find('.next');
		var num = 0;
		var now = 0;
		var timer = null;
		aLi.on('click',function(){
			num = now = $(this).index();
			fnMove()
		})
		oPrev.on('click',function(){
			if(num == 0){
				num = aLi.size()-1;
			}else{
				num--;
			}
			now = num
			fnMove()
		})
		oNext.on('click',function(){
			if(num == aLi.size()-1){
				num = 0;
			}else{
				num++;
			}
			now = num
			fnMove()
		})
		function fnMove(){
			aLi.eq(num).attr('class', 'active').siblings().attr('class','');
			oUl.stop().animate({left:-now*100+'%'}, 500)
		}
		function fnAuto(){
			if(num == 0){
				now = 0;
				oUl.css('left',0);
			}
			if(num == aLi.size()-1){
				num = 0;
			}else{
				num++;
			}
			now++;
			fnMove()
		}
		timer = setInterval(fnAuto, 5000);
		$banner.hover(function() {
			clearInterval(timer);
		}, function() {
			clearInterval(timer);
			timer = setInterval(fnAuto, 5000);
		});
	})(jQuery);
})
;(function($){
	function Carousel(options){
		var self = this;
		this.win = $(window);
		this.doc = $(document);
		this.body = $(document.body);
		this.settings = {
			id : null,
			data : []
		}
		$.extend(this.settings,options || {});
		this.carouselBox = $('#'+this.settings.id);
		this.prevBtn = this.carouselBox.find('.prev');
		this.nextBtn = this.carouselBox.find('.next');
		this.createList(this.settings.data);
		this.aLi = this.carouselBox.find('li');
		this.prevEvent();
		this.nextEvent();
		this.moveFun()
		this.timer = null;
		this.off = true;
		if(!testCss3('transition')){
			this.eventList();
		}
		this.moveAuto();
	}
	Carousel.prototype = {
		createList : function(data){
			var sHtml = '<ul class="f-cb">';
			for (var i = 0; i < data.length; i++) {
				sHtml += '<li class="'+(data[i].zIndex == 2 ? 'hover' : '')+'" style="width:'+data[i].width+'px;height:'+data[i].height+'px;left:'+data[i].left+'px;top:'+data[i].top+'px;z-index:'+data[i].zIndex+';">'+
					     '<div class="name" style="height:'+data[i].picH+'px"><img src="'+data[i].head+'" alt="" /></div>'+
					     '<div class="txt">'+
					     '<h4>'+data[i].name+'</h4>'+
						'<div class="desc">'+data[i].type+'</div>'+
						'<p>'+data[i].idea+'</p>'+
						'</div>'+
						'<a href="'+data[i].url+'" class="btn">查看详情</a>'+
					'</li>'
			};
			sHtml +='</ul>'
			this.carouselBox.append(sHtml)
		},
		eventList : function(){
			this.carouselBox.delegate('li.hover','mouseenter',function(){
				$(this).find('.name').stop().animate({height: 230}, 500)
				$(this).find('.btn').stop().animate({top: 480}, 500)
			}).delegate('li','mouseleave',function(){
				$(this).find('.name').stop().animate({height: 310}, 500)
				$(this).find('.btn').stop().animate({top: 560}, 500)
			})
		},
		prevEvent : function(){
			var self = this;
			this.prevBtn.on('click',function(){
				if(self.off){
					self.off = false;
					self.moveFun(true,true)
				}
			})
		},
		nextEvent : function(){
			var self = this;
			this.nextBtn.on('click',function(){
				if(self.off){
					self.off = false;
					self.moveFun(false,true)
				}
			})
		},
		moveFun  : function(bOff,unde){
			var self = this;
			var pos = this.settings.data;
			unde ? bOff ? pos.push(pos.shift()) : pos.unshift(pos.pop()) : null;
			$.each(pos, function(i, val) {
				self.aLi.eq(i).attr('class',pos[i].zIndex == 3 ? 'hover' : '').css('zIndex',pos[i].zIndex).stop().animate(pos[i].pos,500,function(){
					self.off = true;
					$(this).find('.name').css({"height":pos[i].picH});
					self.setBulr(self.aLi.eq(i),pos[i].blur)
				});
				
			});
		},
		setBulr    : function(obj,num){
			obj[0].style.WebkitBoxShadow = '0px 0px 11px rgba(0,0,0,'+num+')';
			obj[0].style.MozBoxShadow = '0px 0px 11px rgba(0,0,0,'+num+')';
			obj[0].style.OBoxShadow = '0px 0px 11px rgba(0,0,0,'+num+')';
			obj[0].style.msBoxShadow = '0px 0px 11px rgba(0,0,0,'+num+')';
			obj[0].style.BoxShadow = '0px 0px 11px rgba(0,0,0,'+num+')';
		},
		moveAuto : function(){
			var self = this;
			this.timer = setInterval(function(){
				self.prevEvent();
			}, 5000)
			
		}
	}
	window["Carousel"] = Carousel;
})(jQuery);
;(function($){
	function LiveList(options){
		var self = this;
		this.win = $(window);
		this.doc = $(document);
		this.body = $(document.body);
		this.settings = {
			id : null,
			data : []
		}
		$.extend(this.settings,options || {});
		this.LiveBox = $('#'+this.settings.id);
		this.createList(this.settings.data);
		if(!testCss3('transition')){
			this.eventList();
		}
	}
	LiveList.prototype = {
		createList : function(data){
			var sHtml = '<ul class="f-cb">';
			for (var i = 0; i < data.length; i++) {
				sHtml += '<li>'+
					     '<div class="pic"><img src="'+data[i].pic+'" alt="'+data[i].title+'" /></div>'+
					     '<div class="txt">'+
					      '<h4>'+data[i].title+'</h4>'+
							'<div class="desc">'+
								'<span>'+data[i].area+'</span>'+
								'<span>'+data[i].type+'</span>'+
								'<span>'+data[i].style+'</span>'+
							'</div>'+
							'<p>'+data[i].idea+'</p>'+
						'</div>'+
						'<div class="head"><img src="'+data[i].head+'" alt="'+data[i].title+'" /></div>'+
						'<a href="'+data[i].url+'" class="btn">查看详情</a>'+
					'</li>'
			};
			sHtml+='</ul>'
			this.LiveBox.append(sHtml)
		},
		eventList : function(){
			this.LiveBox.delegate('li','mouseenter',function(){
				$(this).find('.pic').stop().animate({height: 200}, 500)
				$(this).find('.head').stop().animate({top: 140}, 500)
				$(this).find('.btn').stop().animate({top: 385}, 500)
			}).delegate('li','mouseleave',function(){
				$(this).find('.pic').stop().animate({height: 288}, 500)
				$(this).find('.head').stop().animate({top: 220}, 500)
				$(this).find('.btn').stop().animate({top: 455}, 500)
			})
		}
	}
	window["LiveList"] = LiveList;
})(jQuery);
// 检测浏览器是否支持css3新属性，来给低版本浏览器做优雅降级；
function testCss3(c){var p=['webkit','Moz','ms','o'],i,a=[],s=document.documentElement.style,t=function(r){return r.replace(/-(\w)/g,function($0,$1){return $1.toUpperCase()})};for(i in p){a.push(t(p[i]+'-'+c));a.push(t(c))}for(i in a){if(a[i]in s){return true}}return false};
$(function(){ 
	if(window.usertype == 2){
		$('#submit_needs').hide();		
	}else{
		$('#submit_needs').show();
	}
})
$liveList = $('#j-index-live');
//渲染装修直播数据
function loadList(){
	var url = RootUrl+'api/v1/share/listtop';
	$.ajax({
		url:url,
		type: 'GET',
		contentType : 'application/json; charset=utf-8',
		dataType: 'json',
		success: function(res){
			console.log(res['data'])
			if(res['data'].length){
			}else{
				//alert('没有数据')
			}
	   	}
	});
}
//创建列表
function createList(data,info){
	var status = data.process.length-1;
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
	var imgId = data.process[status].images[0];
	var head = info.imageid ? RootUrl+'api/v1/image/'+info.imageid : '../../static/img/public/headpic.jpg';
	return '<li>'
				+'<div class="g-wp f-cb">'
					+'<a class="pic f-fl" href="detail.html?'+data._id+'"><img src="'+RootUrl+'api/v1/image/'+imgId+'" alt="" /></a>'
					+'<div class="txt f-fl">'
						+'<div class="info">'
							+'<h4><a href="detail.html?'+data._id+'">'+data.cell+'</a><span><strong>'+data.house_area+'m&sup2;</strong><strong>'+globalData.house_type[data.house_type]+'</strong></span></h4>'
							+'<p>装修风格：<span>'+globalData.dec_style[data.dec_style]+'</span>'
							+'</p>'
							+'<p>开工时间：<span>'+format("yyyy-MM-dd",data.start_at)+'</span></p>'
							+'<p>当前阶段：<span>'+globalData.dec_flow[status]+'</span></p>'
							+'<a href="detail.html?'+data._id+'" class="head">'
								+'<span class="head-pic"><img src="'+head+'" alt="" /></span>'
								+'<span class="head-name">'+info.username+'</span>'
							+'</a>'
						+'</div>'
						+'<div class="state-box">'
							+'<div class="list">'+sList+'</div>'
							+'<div class="line">'
								+'<div class="line-in line'+status+'"></div>'
							+'</div>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</li>'




	var sHtml = '<ul class="f-cb">';
	for (var i = 0; i < data.length; i++) {
		var imgId = data.process[data.process.length-1].images[0];
		var head = !data[i].designer.imageid ? RootUrl+'api/v1/image/'+data[i].designer.imageid  : '../../static/img/public/headpic.jpg';
		sHtml += '<li>'+
			     '<div class="pic"><img src="'+ head +'" alt="'+data[i].designer.username+'" /></div>'+
			     '<div class="txt">'+
			      '<h4>'+data[i].cell+'</h4>'+
					'<div class="desc">'+
						'<span>'+data[i].house_area+'m&sup2;</span>'+
						'<span>'+globalData.house_type[data[i].house_type]+'</span>'+
						'<span>'+globalData.dec_style[data[i].dec_style]+'</span>'+
					'</div>'+
					'<p>'+ellipsisStr(data[i].description,80)+'</p>'+
				'</div>'+
				'<div class="head"><img src="'+RootUrl+'api/v1/image/'+imgId+'" alt="'+data[i].cell+'" /></div>'+
				'<a href="../live/detail.html?'+data[i]._id+'" class="btn">查看详情</a>'+
			'</li>'
	};
	sHtml+='</ul>'
	$liveList.html(sHtml)
}