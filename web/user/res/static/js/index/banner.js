define(['jquery','utils/loadImg'], function($,loadImg){
	var Banner = function(id){
		this.id = id;
	};
	Banner.prototype = {
		init : function(){
			this.container = $(this.id);
			this.bind();
		},
		bind : function(){
			var oUl = this.container.find('ul'),
				aUlLi = oUl.find('li'),
				oToggle = this.container.find('.toggle'),
				oPrev = this.container.find('.prev'),
				sBtns = '',
				aBtns = null,
				len = aUlLi.size(),
				oNext = this.container.find('.next'),
				oBtns = this.container.find('.btns'),
				iNow = 0,
				itmer = null,
				imgArr = [];
			oUl.find('img').each(function(index, el) {
				imgArr.push($(el).data('src'));
				$(el).attr('src', $(el).data('src'));
			});
			oToggle.hide();
			loadImg({
				arr : imgArr,
				admissionfn : function(){
					for(var i= 0; i < len; i++){
						sBtns += '<span class="'+( i==0 ? 'active' : '' )+'"></span>'
					}
					oBtns.html(sBtns);
					aBtns = oBtns.find('span');
					move();
				}
			})
			function move(){
				aUlLi.css('zIndex',0);
				aUlLi.eq(iNow).css('zIndex',10).stop().fadeTo(500,1).siblings().stop().fadeTo(500,0);
				aBtns.eq(iNow).addClass('active').siblings().removeClass('active');
			}
			aBtns.each(function(index, el){
				$(el).on('click',function(){
					iNow = $(this).index();
					move();
				});
			})
			function next(){
				if(iNow == len -1){
					iNow = 0;
				}else{
					iNow++;
				}
				move();
			}
			function prev(){
				if(iNow == 0){
					iNow = len -1;
				}else{
					iNow--;
				}
				move();
			}
			oPrev.on('click',function(){
				prev()
			});
			oNext.on('click',function(){
				next()
			});
			itmer = setInterval(function(){
				next()
			},5000);
			this.container.hover(function(){
				clearInterval(itmer);
				oToggle.show();
			},function(){
				oToggle.hide();
				clearInterval(itmer);
				itmer = setInterval(function(){
					next()
				},5000);
			})
		}
	};
	return Banner;
});
