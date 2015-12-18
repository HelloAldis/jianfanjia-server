define(['jquery'], function($){
	var Mito = function(){}
	Mito.prototype = {
		init : function(options){
			var self = this;
			this.win = $(window);
			this.doc = $(document);
			this.body = $(document.body);
			$.extend(self.settings = {
				id : null,
				callback : function(){}
			},options || {});
			this.container = $(this.settings.id);
			//加载数据
			this.ajax();
			//回调函数
			this.settings.callback();
		},
		create : function(data){
			this.container.empty();
			var self = this,
				template,
				templates = ['<ul>'];
				for (var i = 0, len = data.length; i < len; i++) {
					var li;
					if(i == 1){
						li = '<li class="center">';
						var a = '';
						for (var j = 0; j < 2; j++) {
							a += '<a href="'+data[i+j]._id+'"><img src="/api/v2/web/thumbnail/390/'+data[i+j].images[0].imageid+'" alt="'+data[i+j].title+'"><span>'+data[i+j].title+'</span></a>'
						};
                        li += a + '</li>';
					}else if(i == 2){
						continue;
					}else{
						li = '<li><a href="'+data[i]._id+'"><img src="/api/v2/web/thumbnail/395/'+data[i].images[0].imageid+'" alt="'+data[i].title+'"><span>'+data[i].title+'</span></a></li>'
					}
					templates.push(li)

				};
				templates.push('</ul>');
			    template = templates.join('');
				this.container.html(template);
		},
		ajax : function(){
			var self = this;
			$.ajax({
				url: RootUrl+'api/v2/web/search_beautiful_image',
				type: "post",
				contentType : 'application/json; charset=utf-8',
				dataType: 'json',
				data : JSON.stringify({
				  "query":{

				  },
				  "sort":{
				    "lastupdate":-1
				  },
				  "from":0,
				  "limit":4
				}),
				processData : false,
			})
			.done(function(res) {
				self.create(res.data.beautiful_images);
			})
			.fail(function() {
				//console.log("error");
			})
			.always(function() {
				//console.log("complete");
			});
		}
	}
	return Mito;
});
