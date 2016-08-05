define(['jquery','lodash'], function($,_){
	var Designers = function(){
		this.init()
	}
	Designers.prototype = {
		init : function(options){
			var self = this;
			this.win = $(window);
			this.doc = $(document);
			this.body = $(document.body);
			$.extend(self.settings = {
				id : null,
				template : [],
				limit : 5,
				callback : function(){}
			},options || {});
			this.container = $(this.settings.id);
			//加载数据
			if(this.container.length > 0){
				this.limit = self.settings.limit;
				this.ajax();
			}
			//回调函数
			this.settings.callback();
		},
		create : function(data){
			this.container.empty();
			var self = this,
			    template = this.settings.template.join(''), 
				compiled = _.template(template);
			this.container.html(compiled({datas : data}));
		},
		ajax : function(){
			var self = this;
			$.ajax({
				url: RootUrl + 'api/v2/web/top_designers',
				type: 'POST',
				contentType : 'application/json; charset=utf-8',
				dataType: 'json',
				data : JSON.stringify({
					"limit":this.limit
				}),
				processData : false
			})
			.done(function(res) {
				self.create(res.data);
			})
			.fail(function() {
				//console.log("error");
			})
			.always(function() {
				//console.log("complete");
			});
		}
	}
	return Designers;
});