define(['jquery'], function($){
	var User = function(id){
		this.id = id;
	}
	User.prototype = {
		init : function(){
			this.container = $(this.id);
			this.bindEvent();
			this.bindQuit();
		},
		bindEvent : function(){
			var self = this,
				timer = null,
				bian = true;
			this.container.on('mouseenter','.login',function(ev){
				ev.preventDefault();
				if(bian){
					$(this).find('.user').show().css({'opacity':0}).animate({top: 43,'opacity':1});
				}
			}).on('mouseleave','.login',function(ev){
				ev.preventDefault();
				var This = $(this);
				timer = setTimeout(function(){
					This.find('.user').hide().css({'opacity':0,'top':132});
				}, 300);
			}).on('mouseenter','.user',function(ev){
				ev.preventDefault();
				clearTimeout(timer);
				bian = false;
			}).on('mouseleave','.user',function(ev){
				ev.preventDefault();
				bian = true;
			});
		},
		bindQuit : function(){
			var slef = this;
			$(this.id).on('click','.quit',function(ev){
				ev.preventDefault();
				$.ajax({
					url: '/api/v2/web/signout',
					type: 'POST',
					dataType: 'json',
					contentType : 'application/json; charset=utf-8'
				})
				.done(function(res){
					if(res.msg === "success"){
						window.location.href = "/"
					}
				})
			});
		}
	}
	return User;
});
