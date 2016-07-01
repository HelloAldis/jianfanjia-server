define(['jquery','lib/cookie'], function($){
	var User = function(){}
	User.prototype = {
		init : function(options){
			var self = this;
			this.win = $(window);
			this.doc = $(document);
			this.body = $(document.body);
			this.usertype = $.cookie("usertype");
			$.extend(self.settings = {
				id : '#j-user',
				callback : function(){}
			},options || {});
			this.del = '咨询热线：400-8515-167';
			this.container = $(this.settings.id);
			this.container.html('');
			//生成试图显示
			switch(this.usertype){
				case '0' : this.createAdmin();
				break;
				case '1' : this.createOwner();
				break;
				case '2' : this.createDesign();
				break;
				case undefined : this.createDefault();
				break;
				default : this.createDefault();
			}
			//绑定事件
			this.bindEvent();
			this.bindQuit();
		},
		createAdmin : function(data){
			var arr = [
					'<ul>',
						'<li>'+this.del+'</li>',
						'<li class="line"></li>',
						'<li class="login">',
							'<a href="/jyz/login.html"><span><img src="/static/jyz/img/login-logo.png" alt=""></span>管理员</a>',
							'<div class="user">',
								'<span class="arrow"><i></i></span>',
								'<ul>',
									'<li><a href="javascript:;" class="quit">退出登录</a></li>',
								'</ul>',
							'</div>',
						'</li>',
					'</ul>'
				];
			this.container.html(arr.join(''));
		},
		createOwner : function(off){
			var self = this;
			$.ajax({
				url: '/api/v2/web/user_statistic_info',
				type: 'POST',
				dataType: 'json',
				contentType : 'application/json; charset=utf-8'
			})
			.done(function(res){
				if(res.data != null){
					if(!off){
						self.createInfo(res.data,false);
					}
					self.createOwnerPulldown(res.data);
				}
			});
		},
		createDesign : function(off){
			var self = this;
			$.ajax({
				url: '/api/v2/web/designer_statistic_info',
				type: 'POST',
				dataType: 'json',
				contentType : 'application/json; charset=utf-8'
			})
			.done(function(res){
				if(res.data != null){
					if(!off){
						self.createInfo(res.data,true);
					}
					self.createDesignPulldown(res.data);
				}
			});
		},
		createInfo : function(data,type){
			var arr = [
						'<ul><li>'+this.del+'</li><li class="line"></li><li class="login">',
						'<a href="'+(type ? '/tpl/user/designer.html#/index' : '/tpl/user/owner.html#/index')+'"><span>'+(!!data.imageid ? '<img src="/api/v2/web/thumbnail/24/'+data.imageid+'" alt="">' : '<i class="iconfont">&#xe602;</i>')+'</span>'+data.username+'</a>',
						'<div class="user"></div></li></ul>'
				];
				this.container.html(arr.join(''));
		},
		createOwnerPulldown : function(data){
			var arr = [
						'<span class="arrow"><i></i></span><ul>',
						'<li><a href="/tpl/user/owner.html#/release">免费发布装修需求</a></li>',
						'<li><a href="/tpl/user/owner.html#/requirementList">装修需求列表<i>'+data.requirement_count+'</i></a></li>',
						'<li><a href="/tpl/user/owner.html#/designer/1">我的意向设计师<i>'+data.favorite_designer_count+'</i></a></li>',
						'<li><a href="/tpl/user/owner.html#/favorite/1">收藏作品<i>'+data.favorite_product_count+'</i></a></li>',
						'<li><a href="javascript:;" class="quit">退出登录</a></li>',
						'</ul>'
					];
				this.container.find('.user').html(arr.join(''));
		},
		createDesignPulldown : function(data){
			var arr = [
					'<span class="arrow"><i></i></span><ul>',
					'<li><a href="/tpl/user/designer.html#/requirementList">装修需求列表<i>'+data.requirement_count+'</i></a></li>',
					'<li><a href="/tpl/user/designer.html#/products/1">我的作品<i>'+data.product_count+'</i></a></li>',
					'<li><a href="/tpl/user/designer.html#/favorite/1">收藏作品<i>'+data.favorite_product_count+'</i></a></li>',
					'<li><a href="/tpl/user/designer.html#/authHeart">认证中心</a></li>',
					'<li><a href="javascript:;" class="quit">退出登录</a></li>',
					'</ul>'
				];
				this.container.find('.user').html(arr.join(''));
		},
		createDefault : function(){
			var arr = [
					'<ul>',
						'<li>'+this.del+'</li>',
						'<li class="line"></li>',
						'<li><a href="/tpl/user/login.html">你好，请登录</a></li>',
						'<li class="line"></li>',
						'<li><a href="/tpl/user/reg.html">免费注册</a></li>',
					'</ul>'
				];
			this.container.html(arr.join(''));
		},
		bindQuit : function(){
			var slef = this;
			this.container.delegate('.quit','click',function(ev){
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
		},
		bindEvent : function(pageId){
			var self = this,
				timer = null,
				bian = true;
			this.container.delegate('.login','mouseenter',function(ev){
				ev.preventDefault();
				if(bian){
					$(this).find('.user').show().css({'opacity':0}).animate({top: 43,'opacity':1});
				}
			}).delegate('.login','mouseleave',function(ev){
				ev.preventDefault();
				var This = $(this);
				timer = setTimeout(function(){
					This.find('.user').hide().css({'opacity':0,'top':132});
				}, 300);
			}).delegate('.user','mouseenter',function(ev){
				ev.preventDefault();
				clearTimeout(timer);
				bian = false;
			}).delegate('.user','mouseleave',function(ev){
				ev.preventDefault();
				bian = true;
			});
		},
		updateInfo : function(){
			this.container.html('');
			switch(this.usertype){
				case '0' : this.createAdmin();
				break;
				case '1' : this.createOwner();
				break;
				case '2' : this.createDesign();
				break;
				default : this.createDefault();
			}
		},
		updateData : function(){
			this.container.find('.user').html('');
			switch(this.usertype){
				case '0' : this.createAdmin();
				break;
				case '1' : this.createOwner(true);
				break;
				case '2' : this.createDesign(true);
				break;
				default : this.createDefault();
			}
		}
	}
	return User;
});
