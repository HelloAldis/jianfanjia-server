define(['jquery'], function($){
	var Banner = function(){
	}
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
					$(el).hover(function(){
						var index = $(this).index()+1;
						$(this).addClass('active').siblings().removeClass('active');
						aUlLi.eq(index).show().siblings().hide();
					},function(){
						$(this).removeClass('active');
						aUlLi.eq(0).show().siblings().hide();
					})
				});
		}
	}
	return Banner;
});
