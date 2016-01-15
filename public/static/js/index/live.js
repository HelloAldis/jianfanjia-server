define(['jquery'], function($){
	var Live = function(){}
	Live.prototype = {
		init : function(options){
			var self = this;
			this.win = $(window);
			this.doc = $(document);
			this.body = $(document.body);
			$.extend(self.settings = {
				id : null,
				templatelive : [],
				templatesite : [],
				limit : 5,
				callback : function(){}
			},options || {});
			this.container = $(this.settings.id);
			this.live = this.container.find('.m-live'),
			this.site = this.container.find('.m-site');
			//加载数据
			this.limit = self.settings.limit;
			this.ajax();
			//回调函数
			this.settings.callback();
		},
		createlive : function(data){
			this.live.empty();
			var self = this,
				live = this.container.find('.m-live'),
				templates = [
					'<div class="live">',
						'<ul>'
				],
				template;
				data = data.length < 6 ? data.concat(data) : data;
				data = data.length < 6 ? data.concat(data) : data;
				for (var i = 0,len = data.length; i < len; i++) {
				var li =  '<li><a href="/tpl/live/detail.html?'+data[i]._id+'" class="img"><img src="/api/v2/web/thumbnail/500/'+data[i].cover_imageid+'" alt="'+data[i].cell+'"></a>'+
						'<div class="txt">'+
							'<h4><a href="/tpl/live/detail.html?'+data[i]._id+'">'+data[i].cell+'</a></h4>'+
							'<p><span>'+data[i].house_area+'m&sup2;</span><i>|</i><span>'+globalData.house_type(data[i].house_type)+'</span><i>|</i><span>'+globalData.dec_style(data[i].dec_style)+'</span></p>'+
						'</div>'+
						'<a href="/tpl/design/home.html?'+data[i].designer._id+'" class="head"><img src="/api/v2/web/thumbnail/80/'+data[i].designer.imageid+'" alt="'+data[i].designer.username+'"></a></li>'
					templates.push(li)
				}
				templates.push('</ul>');
				templates.push('</div>');
				templates.push('<div class="toggle">');
				templates.push('<a href="javascript:;" class="prev"></a>');
				templates.push('<a href="javascript:;" class="next"></a>');
				templates.push('</div>');
				template = templates.join('');
				this.live.html(template);
				this.livebindEvent();
		},
		createsite : function(data){
			this.site.empty();
			var self = this,
				templates = [
					'<h4>最新现场</h4>',
					'<div class="site">',
						'<ul>'
				],
				template;
				for (var i = 0,len = data.length; i < len; i++) {
					var li = '<li><span class="name">'+data[i].username+'</span><span class="area">'+data[i].house_area+'m&sup2;</span><span class="size">'+globalData.house_type(data[i].house_type)+'</span></li>';
					templates.push(li);
				}
				templates.push('</ul>');
				templates.push('</div>');
				template = templates.join('');
				this.site.html(template);
				this.sitebindEvent();
		},
		livebindEvent : function(){
			var oUl = this.live.find('ul'),
				timer = null,
				prev = function(){
					var first = oUl.find('li').first();
					oUl.stop().animate({left: -610},function(){
						oUl.append(first).css('left',-305);
					});
				},
				next = function(){
					var last = oUl.find('li').last();
					oUl.stop().animate({left: 0},function(){
						oUl.prepend(last).css('left',-305)
					});
				};
				this.live.delegate('.prev','click',function(){
					next();
				});
				this.live.delegate('.next','click',function(){
					prev();
				});
			oUl.prepend(oUl.find('li').last()).css('left',-305);
			timer = setInterval(next, 3000);
			this.live.hover(function() {
				clearInterval(timer)
			}, function() {
				clearInterval(timer);
				timer = setInterval(next, 3000);
			});
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
		},
		ajax : function(){
			var self = this;
			$.ajax({
				url: RootUrl+'api/v2/web/top_shares',
				type: "post",
				contentType : 'application/json; charset=utf-8',
				dataType: 'json',
				data : JSON.stringify({
					"limit":this.limit
				}),
				processData : false,
			})
			.done(function(res) {
				self.createsite(res.data.latest_scenes);
				self.createlive(res.data.shares);
			})
			.fail(function() {
				//console.log("error");
			})
			.always(function() {
				//console.log("complete");
			});
		}
	}
	return Live;
});
