define(['jquery'], function($){
	var Banner = function(){};
	Banner.prototype = {
		init : function(options){
			var self = this;
			this.win = $(window);
			this.doc = $(document);
			this.body = $(document.body);
			$.extend(self.settings = {
				id : null,
				templatebk : [],
				templatets : [],
				limit : 5,
				callback : function(){}
			},options || {});
			this.container = $(this.settings.id);
			this.bind();
		},
		bind : function(){
			var oUl = this.container.find('ul'),
				aUlLi = oUl.find('li'),
				oOl = this.container.find('ol'),
				aOlLi = oOl.find('li');
				aOlLi.each(function(index, el) {
					$(el).on('mouseenter',function(){
						var This = $(this);
						setTimeout(function(){
							var index = This.index()+1;
							This.addClass('active').siblings().removeClass('active');
							aUlLi.attr('zIndex',0);
							aUlLi.eq(index).attr('zIndex',10).stop().fadeTo(500,1).siblings().stop().fadeTo(500,0);
						}, 300);
					});
				});
				oOl.on('mouseleave',function(){
					aOlLi.removeClass('active');
					aUlLi.eq(0).attr('zIndex',10).stop().fadeTo(500,1).siblings().stop().fadeTo(500,0);
				});
		}
	};
	return Banner;
});
