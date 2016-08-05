define(['jquery','index/Scrollswitch'], function($,Scrollswitch){
	var Live = function(id){
		this.id = $(id);
	}
	Live.prototype = {
		init : function(){
			this.live = this.id.find('.m-live');
			this.site = this.id.find('.m-site');
			this.livebindEvent();
			this.sitebindEvent();
		},
		livebindEvent : function(){
			var roll = new Scrollswitch({
				id : this.live,
				count : 3,
				offset : this.live.offset().top
			});
			roll.init();
		},
		sitebindEvent : function(){
			var oUl = this.site.find('ul'),
				timer = null,
				auto = function(){
					var last = oUl.find('li').last();
					oUl.animate({top: 0},function(){
						oUl.prepend(last).css('top',-30)
					});
				};
				timer = setInterval(auto, 3000);
			this.site.hover(function() {
				clearInterval(timer)
			}, function() {
				clearInterval(timer);
				timer = setInterval(auto, 3000);
			});
		}
	}
	return Live;
});
