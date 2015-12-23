define(['jquery','lodash'], function($,_){
	var Raiders = function(){
		this.init()
	}
	Raiders.prototype = {
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
				raiders = [
					{
						'title' : '装修百科',
						'data'  : data.dec_strategies
 					},
 					{
						'title' : '生活点滴',
						'data'  : data.dec_tips
 					}
				]
			    templatebk = this.settings.templatebk.join(''),
			    templatets = this.settings.templatets.join(''), 
				compiledbk = _.template(templatebk),
				compiledts = _.template(templatets);
			this.container.append(compiledbk({item : raiders[0]}));
			this.container.append(compiledts({item : raiders[1]}));
		},
		ajax : function(){
			var self = this;
			$.ajax({
				url: RootUrl+'api/v2/web/top_articles',
				type: "post",
				contentType : 'application/json; charset=utf-8',
				dataType: 'json',
				data : JSON.stringify({
					"limit":this.limit
				}),
				processData : false,
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
	return Raiders;
});