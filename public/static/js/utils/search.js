define(['jquery'], function($){
	var Search = function(){
		this.init(options)
	}
	Search.prototype = {
		init : function(options){
			var self = this;
			this.win = $(window);
			this.doc = $(document);
			this.body = $(document.body);
			$.extend(self.settings = {
				id : null,
				urlAPI : [{
					title:"",
					url:"",
					api:""
				}],
				defaults : 0,
				callback : function(){}
			},options || {});
			this.container = $('#'+this.settings.id);
			//生成试图显示
			this.create(this.settings.urlAPI);
			//绑定事件
			this.bindEvent();
			//回调函数
			this.settings.callback(this.settings.urlAPI[this.settings.defaults]);
		},
		create : function(data){
			this.container.empty();
			var self = this;
			
		},
		bindEvent : function(pageId){
			var self = this;
			this.downSelect();
			this.submitBtn();
		},
		downSelect : function(){
			var downSelect = this.container.find('.downSelect'),
				oUl = downSelect.find('ul'),
				oSapn = downSelect.find('span'),
				aLi = oUl.find('li');
			oSapn.on('click',function(){
				oUl.show();
			});
			downSelect.on('mouseenter',function(){
				oUl.hide();
			});
		},
		getInputVal : function(){
			var input = this.container.find('.input');
			return input.val();
		},
		submitBtn : function(pageId, appendopts,np){  //生成按钮  
			var this.getInputVal()
			if()
		}
	}
	return Search;
});