define(['jquery','cookie'], function($,cookie){
	var Goto = function(){};
	Goto.prototype = {
		init : function(options){
			var self = this;
			this.win = $(window);
			this.doc = $(document);
			this.body = $(document.body);
			$.extend(self.settings = {
				shop : false,
				scroll : true,
				callback : function(){return false;}
			},options || {});
			this.container = $('<div>').attr({
				'id' : '#j-goto',
				'class' : 'g-goto'
			});
			this.usertype = $.cookie("usertype");
			this.create();
			this.getPosition();
			this.setTop();
			this.body.append(this.container);
			this.show();
			this.goto();
			this.addkefu();
			this.hover('.weixin',-70);
			if(this.settings.shop && this.usertype == 1){
				this.getRequirement();
				this.addDesigners();
			}
			this.supervision();
		},
		create : function(){
			this.container.empty();
			var self = this,
				template,
				data = [
					{
						'name' : '我的意向',
						'sclass' : 'add',
						'url'  : '/tpl/user/owner.html#/designer',
						'icon' : '&#xe614;',
						'hover' : '',
					},
					{
						'name' : '装修保障',
						'sclass' : 'protect',
						'url'  : '/tpl/merit/index.html',
						'icon' : '&#xe639;',
						'hover' : '',
					},
					{
						'name' : '监理服务',
						'sclass' : 'supervise',
						'url'  : '/tpl/merit/supervision.html',
						'icon' : '&#xe635;',
						'hover' : '',
					},
					{
						'name' : '关注微信',
						'sclass' : 'weixin',
						'url'  : '',
						'icon' : '&#xe633;',
						'hover' : '<img src="/static/img/public/erweima.jpg" width="160" height="160" />',
					},
					{
						'name' : '联系客服',
						'sclass' : 'kefu',
						'url'  : 'http://chat16.live800.com/live800/chatClient/chatbox.jsp?companyID=611886&configID=139921&jid=3699665419',
						'icon' : '&#xe63a;',
						'hover' : '',
					},
					{
						'name' : '回到顶部',
						'sclass' : 'goto',
						'url'  : '',
						'icon' : '&#xe632;',
						'hover' : '',
					}
				],
				templates = ['<ul>'],
				url = this.usertype == 1 ? data[0].url : '/tpl/user/login.html?'+window.location.href;
				for (var i = 0,len = data.length; i < len; i++) {
					var li;
					if(this.settings.shop && i === 0 && (this.usertype == 1 || this.usertype == undefined)){
						li = '<li><a class="link '+data[i].sclass+'" href="'+url+'"><span></span><i class="iconfont">'+data[i].icon+'</i><strong>'+data[i].name+'</strong></a><div class="hover"><span><i></i></span><div>'+data[i].hover+'</div></div></li>';
					}else{
						if(i === 0){
							continue;
						}
						li = '<li><a class="link '+data[i].sclass+'" href="'+(!!data[i].url ? data[i].url : 'javascript:;')+'" '+(!!data[i].url ? 'target="_blank"' : '')+'><i class="iconfont">'+data[i].icon+'</i><strong>'+data[i].name+'</strong></a><div class="hover"><span><i></i></span><div>'+data[i].hover+'</div></div></li>';
					}
					templates.push(li);
				}
				templates.push('</ul>');
				template = 	templates.join('');
				this.container.html(template);
		},
		setTop : function(){
			var winheight = this.win.height(),
				eleheight = this.container.height(),
				top = (winheight - eleheight)/2;
				this.container.css({'top':top});
		},
		getPosition : function(){
			var self = this,
				left,
				right,
				width = this.win.width();
				if(width > 1280){
					left = (width - 1200)/2 + 1200 +20;
					right = 'auto';
				}else{
					right = 0;
					left = 'auto';
				}
			this.container.css({
				left : left,
				right : right
			});
		},
		goto : function(){
			var self = this,
				$goto = this.container.find('.goto');
				$goto.on('click',function(){
					$('html,body').animate({scrollTop: 0}, 500);
					return false;
				});
		},
		show : function(){
			var self = this;
			if(this.settings.scroll){
				self.container.show();
			}else{
				var height = this.win.height();
				$(window).on('scroll',function(){
					if($(this).scrollTop() > height){
						self.container.fadeIn(500);
					}else{
						self.container.fadeOut(500);
					}
				});
			}
		},
		offset : function(offset){
			return {
				left : parseFloat(this.container.css('left')),
				top : parseFloat(this.container.css('top'))
			}
		},
		getRequirement : function(){
			var self = this;
			$.ajax({
				url: '/api/v2/web/user_my_requirement_list',
				type: 'POST',
				contentType : 'application/json; charset=utf-8',
				dataType: 'json'
			})
			.done(function(res) {
				if(res.data.length > 0){
					self.setRequirement(res.data);
					self.hover('.add',-80);
				}
			});
		},
		setRequirement : function(data){
			var self = this,
				$add = this.container.find('.add'),
				sibling = $add.siblings('.hover').find('div'),
				sUl = ['<ul>'],
				str;
				for (var i = 0, len = data.length; i < len; i++) {
					var sLi = '<li><a class="" href="/tpl/user/owner.html#/requirement/'+data[i]._id+'/booking"><span><i class="iconfont2">&#xe61f;</i><strong>'+data[i].cell+'小区'+data[i].cell_phase+'期'+data[i].cell_building+'栋'+data[i].cell_unit+'单元'+data[i].cell_detail_number+'室</strong></span><span><time>'+this.format(data[i].create_at,'yyyy/MM/dd hh:mm:ss')+'</time><span></a></li>';
					sUl.push(sLi);
				}
				sUl.push('<ul>');
				str = sUl.join('');
				sibling.html(sUl);
		},
		supervision : function(){
			if(this.usertype == undefined){
				this.container.find('.supervise').attr('href','/tpl/user/login.html?/tpl/merit/supervision.html');
			}else if(this.usertype == 2){
				this.container.find('.supervise').attr('href','/tpl/merit/index.html');
			}
		},
		addDesigners : function(){
			var self = this,
				$Span = this.container.find('.add').find('span');
			$.ajax({
				url: '/api/v2/web/favorite/designer/list',
				type: 'POST',
				contentType : 'application/json; charset=utf-8',
				dataType: 'json',
				data : JSON.stringify({
				   "from": 0,
				   "limit":10
				}),
				processData : false
			})
			.done(function(res) {
				$Span.html(res.data.total);
			});
		},
		format : function(date,format){
			var time = new Date(date),
				o = {
					"M+" : time.getMonth()+1, //month
					"d+" : time.getDate(), //day
					"h+" : time.getHours(), //hour
					"m+" : time.getMinutes(), //minute
					"s+" : time.getSeconds(), //second
					"q+" : Math.floor((time.getMonth()+3)/3), //quarter
					"S" : time.getMilliseconds() //millisecond
				};
			if(/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (time.getFullYear()+"").substr(4 - RegExp.$1.length));
			}
			for(var k in o) {
				if(new RegExp("("+ k +")").test(format)) {
					format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
				}
			}
			return format;
			/*
			//使用方法
				var now = new Date();
				var nowStr = now.format("yyyy-MM-dd hh:mm:ss");
				//使用方法2:
				var testDate = new Date();
				var testStr = testDate.format("YYYY年MM月dd日hh小时mm分ss秒");
				alert(testStr);
				//示例：
				alert(new Date().Format("yyyy年MM月dd日"));
				alert(new Date().Format("MM/dd/yyyy"));
				alert(new Date().Format("yyyyMMdd"));
				alert(new Date().Format("yyyy-MM-dd hh:mm:ss"));
			 */
		},
		hover : function(obj,top){
			var self = this,
				$add = this.container.find(obj),
				parent = $add.closest('li'),
				sibling = $add.siblings('.hover'),
				timer = null,
				bian = true;
			parent.on('mouseenter',function(){
				if(bian){
					$(this).find('.hover').show().css({'opacity':0}).animate({top: top,'opacity':1});
				}
			}).on('mouseleave',function(){
				var This = $(this);
				timer = setTimeout(function(){
					This.find('.hover').hide().css({'opacity':0,'top':0});
				}, 300);
			});
			sibling.on('mouseenter',function(){
				clearTimeout(timer);
				bian = false;
			}).on('mouseleave',function(){
				bian = true;
			});
		},
		addkefu : function(){
			// (function(){
			// 	var chat = document.createElement('script');
			// 	chat.type = 'text/javascript';
			// 	chat.async = true;
			// 	chat.src = 'http://chat16.live800.com/live800/chatClient/monitor.js?jid=3699665419&companyID=611886&configID=139920&codeType=custom';
			// 	var s = document.body;
			// 	s.appendChild(chat)
			// })();
			var _gaq = _gaq || [];
			_gaq.push(['_setAccount', 'UA-45900898-17']);
			 _gaq.push(['_trackPageview']);
			(function() {
				var ga = document.createElement('script');
				ga.type = 'text/javascript';
				ga.async = true;
				ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
				var s = document.getElementsByTagName('script')[0];
				s.parentNode.insertBefore(ga, s);
			 })();
		}
	};
	return Goto;
});
