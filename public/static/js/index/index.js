;(function($){
	function Carousel(options){
		var self = this;
		this.win = $(window);
		this.doc = $(document);
		this.body = $(document.body);
		this.settings = {
			id : null,
			list : [],
			data : []
		}
		$.extend(this.settings,options || {});
		this.carouselBox = $('#'+this.settings.id);
		this.prevBtn = this.carouselBox.find('.prev');
		this.nextBtn = this.carouselBox.find('.next');
		this.createList(this.settings.data,this.settings.list);
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
		createList : function(data,list){
			var sHtml = '<ul class="f-cb">';
			for (var i = 0; i < data.length; i++) {
				var imgid = list[i].imageid ? RootUrl+'api/v2/web/thumbnail/460/'+list[i].imageid : '../../../static/img/public/indexhead.jpg'
				sHtml += '<li class="'+(data[i].zIndex == 2 ? 'hover' : '')+'" style="width:'+data[i].width+'px;height:'+data[i].height+'px;left:'+data[i].left+'px;top:'+data[i].top+'px;z-index:'+data[i].zIndex+';">'+
					     '<div class="name" style="height:'+data[i].picH+'px"><a href="../design/homepage.html?'+list[i]._id+'" target="_blank"><img src="'+imgid+'" alt="" /></a></div>'+
					     '<div class="txt">'+
					     '<h4><a href="../design/homepage.html?'+list[i]._id+'" target="_blank">'+list[i].username+'</a></h4>'+
						'<div class="auth auth'+(list[i].auth_type-1)+'"><span class="i-icon"></span>认证设计师</div>'+
						'<p>' + ellipsisStr(list[i].philosophy,40) + '</p></div>'+
						'<div class="msg f-cb"><dl><dt>'+list[i].product_count+'</dt><dd>作品</dd></dl><dl><dt>'+list[i].order_count+'</dt><dd>预约</dd></dl></div>'
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
				self.prevBtn.click();
			}, 5000)
			this.carouselBox.hover(function() {
				clearInterval(self.timer)
			}, function() {
				clearInterval(self.timer)
				self.timer = setInterval(function(){
					self.prevBtn.click();
				}, 5000)
			});
		}
	}
	window["Carousel"] = Carousel;
})(jQuery);
$(function(){ 
	if(window.usertype == 2){
		$('#submit_needs').hide();		
	}else{
		$('#submit_needs').show();
	};
	(function($){ //banner
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
	(function($){ //设计师
		var posData =  [
			{
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
		];
		function loadList(){
			var url = RootUrl+'api/v2/web/designer/listtop';
			$.ajax({
				url:url,
				type: 'GET',
				contentType : 'application/json; charset=utf-8',
				dataType: 'json',
				success: function(res){
					if(res['data'].length){
						var carousel = new Carousel({
							id : 'j-index-design',
							list : res['data'],
							data : posData
						});
					}else{
						//alert('没有数据')
					}
			   	}
			});
		}
		loadList()
	})(jQuery);
	(function($){ //装修直播
		$liveList = $('#j-index-live');
		//渲染装修直播数据
		function loadList(){
			var url = RootUrl+'api/v2/web/share/listtop';
			$.ajax({
				url:url,
				type: 'GET',
				contentType : 'application/json; charset=utf-8',
				dataType: 'json',
				success: function(res){
					if(res['data'].length){
						createList(res['data'])
					}else{
						//alert('没有数据')
					}
			   	}
			});
		}
		//创建列表
		function createList(data,info){
			var sHtml = '<ul class="f-cb">';
			for (var i = 0; i < data.length; i++) {
				var imgId = data[i].process[data[i].process.length-1].images[0];
				var head = data[i].designer.imageid ? RootUrl+'api/v2/web/thumbnail/90/'+data[i].designer.imageid  : '../../static/img/public/headpic.jpg';
				sHtml += '<li>'+
					     '<div class="pic"><a href="../live/detail.html?'+data[i]._id+'" target="_blank"><img src="'+RootUrl+'api/v2/web/thumbnail/366/'+imgId+'" alt="'+data[i].cell+'" /></a></div>'+
					     '<div class="txt">'+
					      '<h4><a href="../live/detail.html?'+data[i]._id+'" target="_blank">'+data[i].cell+'</a></h4>'+
							'<div class="desc">'+
								'<span>'+data[i].house_area+'m&sup2;</span>'+
								'<span>'+globalData.house_type[data[i].house_type]+'</span>'+
								'<span>'+globalData.dec_style[data[i].dec_style]+'</span>'+
							'</div>'+
							'<p>'+ellipsisStr(data[i].description,80)+'</p>'+
						'</div>'+
						'<a class="m-head" href="../design/homepage.html?'+data[i].designer._id+'" target="_blank"><img src="'+ head +'" alt="'+data[i].designer.username+'" /></a>'+
					'</li>'
			};
			sHtml+='</ul>'
			$liveList.html(sHtml)
		}
		if(!testCss3('transition')){
			$liveList.delegate('li','mouseenter',function(){
				$(this).find('.pic').stop().animate({height: 200}, 500)
				$(this).find('.head').stop().animate({top: 140}, 500)
				$(this).find('.btn').stop().animate({top: 385}, 500)
			}).delegate('li','mouseleave',function(){
				$(this).find('.pic').stop().animate({height: 288}, 500)
				$(this).find('.head').stop().animate({top: 220}, 500)
				$(this).find('.btn').stop().animate({top: 455}, 500)
			})
		}
		loadList();
	})(jQuery);
})