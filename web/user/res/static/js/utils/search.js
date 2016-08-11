define(['jquery'], function($){
	var Search = function(){}
	Search.prototype = {
		init : function(options){
			var self = this;
			this.win = $(window);
			this.doc = $(document);
			this.body = $(document.body);
			$.extend(self.settings = {
				id : '#j-sch',
				urlAPI : [
		            {
		                title : '设计师',
		                url   : '/tpl/design/index.html',
		                api   : 'api/v2/web/designer/search'
		            },
		            {
		                title : '装修美图',
		                url   : '/tpl/mito/index.html',
		                api   : 'api/v2/web/search_beautiful_image'
		            }
		        ],
				defaults : 0,
				callback : function(){}
			},options || {});
			this.container = $(this.settings.id);
			this.iNum = this.settings.defaults;
			//生成试图显示
			this.create(this.settings.urlAPI);
			this.input = this.container.find('.input');
			//绑定事件
			this.bindEvent();
		},
		create : function(data){
			this.container.empty();
			var self = this;
			var strArr =  ['<form><div class="u-sch-box f-fl">',
							'<div class="u-sch-ds f-fl '+(data.length == 1 ? 'not' : '')+'">',
							'<div class="u-sch-ds-txt">',
								'<span>'+data[this.iNum].title+'</span>',
								'<i class="arrow"></i>',
							'</div>'
							];
				if(data.length > 1){
					strArr.push('<ul class="u-sch-ds-sel">')
					for (var i = 0,len = data.length; i < len; i++) {
						strArr.push('<li data-uid="'+i+'">'+data[i].title+'</li>');
					};
					strArr.push('</ul>');
				}
				strArr.push('</div>');
				strArr.push('<div class="u-sch-inp f-fl">'); 
				strArr.push('<input type="text" name="" class="input" value="搜索'+data[this.iNum].title+'" id="" />'); 
				strArr.push('</div>'); 
				strArr.push('</div>');  
				strArr.push('<button class="u-sch-btn f-fl" type="submit">搜索</button></form>');
				str = strArr.join('');
				this.container.html(str);
		},
		bindEvent : function(){
			var self = this;
			if(this.settings.urlAPI.length > 1){
				this.downSelect();
			}
			this.inputFocus();
			this.submitBtn();
		},
		downSelect : function(){
			var self = this,
				downSelect = this.container.find('.u-sch-ds'),
				oUl = downSelect.find('ul'),
				oSapn = downSelect.find('.u-sch-ds-txt span'),
				aLi = oUl.find('li');
			downSelect.on('click',function(){
				if(!$(this).hasClass('u-sch-us')){
					$(this).addClass('u-sch-us');
				}
			}).on('mouseleave',function(){
				$(this).removeClass('u-sch-us');
			}).delegate('li', 'click', function(event) {
				event.preventDefault();
				oSapn.html($(this).html());
				self.iNum = $(this).data('uid');
				self.input.val('搜索'+$(this).html())
			});
		},
		getInputVal : function(){
			return $.trim(this.input.val())
		},
		inputFocus : function(){
			var inputBox = this.container.find('.u-sch-inp'),
				downSelect = this.container.find('.u-sch-ds'),
				oSapn = downSelect.find('.u-sch-ds-txt span'),
				self = this;
			inputBox.on('mouseenter',function(){
				$(this).addClass('u-sch-inp-focus');
			}).on('mouseleave',function(){
				if(!!self.getInputVal() && self.getInputVal() == '搜索'+oSapn.html()){
					$(this).removeClass('u-sch-inp-focus');
				}
			});
			this.input.on('focus',function(){
				if($(this).val() === '搜索'+oSapn.html()){
					$(this).val('');
				}
			}).on('blur',function(){
				if(!self.getInputVal() || self.getInputVal() == '搜索'+oSapn.html()){
					$(this).val('搜索'+oSapn.html());
					inputBox.removeClass('u-sch-inp-focus');
				}
			})
		},
		submitBtn : function(){  //生成按钮  
			var submitBtn = this.container.find('form'),
				downSelect = this.container.find('.u-sch-ds'),
				oSapn = downSelect.find('.u-sch-ds-txt span'),
				self = this;
			submitBtn.on('submit',function(){
				if(!!self.getInputVal() && self.getInputVal() != '搜索'+oSapn.html()){
					self.ajax(self.getInputVal())
				}
				return false;
			})
		},
		ajax : function(input){
			var url = this.settings.urlAPI[this.iNum].url;
			if(window.location.href.indexOf(url) == -1){
				window.location.href = url+'?page=1&query='+input
			}
		}
	}
	return Search;
});