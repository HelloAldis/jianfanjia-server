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
				blur   :  100,
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
				blur   :  10,
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
				blur   :  5,
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
				blur   :  0,
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
				blur   :  5,
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
				blur   :  10,
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
				blur   :  100,
				zIndex :  0
			}
		]
	});
	var liveList = new LiveList({
		id : 'j-index-live',
		data : [
			{
				pic    : '../../img/index/index-live-01.jpg',
				title  : '清江山水',
				area   : '120m&sup2;',
				type   : '三室一厅',
				style  : '现代简约',
				idea   : 'This is the brand new house for family johnson.',
				head   : '../../img/index/index-live-head-01.jpg',
				url    : ''
 			},
 			{
				pic    : '../../img/index/index-live-01.jpg',
				title  : '清江山水',
				area   : '120m&sup2;',
				type   : '三室一厅',
				style  : '现代简约',
				idea   : 'This is the brand new house for family johnson.',
				head   : '../../img/index/index-live-head-01.jpg',
				url    : ''
 			},
 			{
				pic    : '../../img/index/index-live-01.jpg',
				title  : '清江山水',
				area   : '120m&sup2;',
				type   : '三室一厅',
				style  : '现代简约',
				idea   : 'This is the brand new house for family johnson.',
				head   : '../../img/index/index-live-head-01.jpg',
				url    : ''
 			},
 			{
				pic    : '../../img/index/index-live-01.jpg',
				title  : '清江山水',
				area   : '120m&sup2;',
				type   : '三室一厅',
				style  : '现代简约',
				idea   : 'This is the brand new house for family johnson.',
				head   : '../../img/index/index-live-head-01.jpg',
				url    : ''
 			},
 			{
				pic    : '../../img/index/index-live-01.jpg',
				title  : '清江山水',
				area   : '120m&sup2;',
				type   : '三室一厅',
				style  : '现代简约',
				idea   : 'This is the brand new house for family johnson.',
				head   : '../../img/index/index-live-head-01.jpg',
				url    : ''
 			},
 			{
				pic    : '../../img/index/index-live-01.jpg',
				title  : '清江山水',
				area   : '120m&sup2;',
				type   : '三室一厅',
				style  : '现代简约',
				idea   : 'This is the brand new house for family johnson.',
				head   : '../../img/index/index-live-head-01.jpg',
				url    : ''
 			}
		]
	});
	(function($){
		var $banner = $('#j-banner');
		var banner = $banner.find('.banner');
		var oUl = banner.find('ul');
		var aLi = banner.find('ol').find('li');
		var oPrev = banner.find('.prev');
		var oNext = banner.find('.next');
		var timer = 0;
		var iNum = 0;
		var iNum2 = 0;
		function fnMove(){
			aLi.eq(iNum).attr('class','active').siblings().attr('class','');
			oUl.stop().animate({left: -iNum2*100+'%'},500);
		}
		aLi.on('click',function(){
			iNum = $(this).index();
			iNum2 = $(this).index();
			fnMove()
		})
		oPrev.on('click',function(){
			iNum ++;
			iNum2 ++;
			fnMove()
		})
		function fnAuto(){
			if(iNum == aLi.size()){
				iNum2 = 0;
			}else{
				iNum++
			}
			if(iNum2 == 0){
				oUl.css('left',0);
				iNum = 0
			}
			iNum2++;
			fnMove()
		}
		// /timer = setInterval(fnAuto, 1000)
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
		this.off = true;
		if(!testCss3('transition')){
			this.eventList();
		}
	}
	Carousel.prototype = {
		createList : function(data){
			var sHtml = '<ul class="f-cb">';
			for (var i = 0; i < data.length; i++) {
				sHtml += '<li class="'+(data[i].zIndex == 2 ? 'hover' : '')+'" style="width:'+data[i].width+'px;height:'+data[i].height+'px;left:'+data[i].left+'px;top:'+data[i].top+'px;z-index:'+data[i].zIndex+';">'+
					     '<div class="name"><img src="'+data[i].head+'" alt="" /></div>'+
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
				setTimeout(function(){
					if(self.off){
						self.off = false;
						self.moveFun(true,true)
					}
				},500)
			})
		},
		nextEvent : function(){
			var self = this;
			this.nextBtn.on('click',function(){
				setTimeout(function(){
					if(self.off){
						self.off = false;
						self.moveFun(false,true)
					}
				}, 500)
			})
		},
		moveFun   : function(bOff,unde){
			var self = this;
			var pos = this.settings.data;
			unde ? bOff ? pos.push(pos.shift()) : pos.unshift(pos.pop()) : null;
			$.each(pos, function(i, val) {
				self.aLi.eq(i).attr('class',pos[i].zIndex == 3 ? 'hover' : '').css('zIndex',pos[i].zIndex).stop().animate(pos[i].pos,500,function(){
					self.off = true;
					self.setBulr(self.aLi.eq(i),pos[i].blur)
				});
				
			});
		},
		setBulr    : function(obj,num){
			obj[0].style.WebkitFilter = 'blur('+num+'px)';
			obj[0].style.MozFilter = 'blur('+num+'px)';
			obj[0].style.OFilter = 'blur('+num+'px)';
			obj[0].style.msFilter = 'blur('+num+'px)';
			obj[0].style.filter = 'blur('+num+'px)';
			obj[0].style.filter = 'progid:DXImageTransform.Microsoft.Blur(PixelRadius='+num+', MakeShadow=false)';
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

