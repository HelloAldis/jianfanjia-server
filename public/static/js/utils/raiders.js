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
/*require(['jquery','lodash'],function($,_){
	var container = $('#j-raiders').find('.m-ct');
	var raiders = [
			{
				title : '装修百科',
				arr : [
		            {
		                "_id": "565d735dce680da20d24ead3",
		                "title": "冬天开不开暖气",
		                "cover_imageid": "5618bd766d623b5610d77c41",
		                "description": "我是description"
		            },
		            {
		                "_id": "565d735cce680da20d24ead2",
		                "title": "冬天开不开暖气",
		                "cover_imageid": "5618bd766d623b5610d77c41",
		                "description": "我是description"
		            },
		            {
		                "_id": "565d735cce680da20d24ead1",
		                "title": "冬天开不开暖气",
		                "cover_imageid": "5618bd766d623b5610d77c41",
		                "description": "我是description"
		            },
		            {
		                "_id": "565d735bce680da20d24ead0",
		                "title": "冬天开不开暖气",
		                "cover_imageid": "5618bd766d623b5610d77c41",
		                "description": "我是description"
		            },
		            {
		                "_id": "565d735ace680da20d24eacf",
		                "title": "冬天开不开暖气",
		                "cover_imageid": "5618bd766d623b5610d77c41",
		                "description": "我是description"
		            }
		        ]
			},
			{
				title : '生活点滴',
				arr : [
		            {
		                "_id": "565d735dce680da20d24ead3",
		                "title": "冬天开不开暖气",
		                "cover_imageid": "5618bd766d623b5610d77c41",
		                "description": "我是description"
		            },
		            {
		                "_id": "565d735cce680da20d24ead2",
		                "title": "冬天开不开暖气",
		                "cover_imageid": "5618bd766d623b5610d77c41",
		                "description": "我是description"
		            },
		            {
		                "_id": "565d735cce680da20d24ead1",
		                "title": "冬天开不开暖气",
		                "cover_imageid": "5618bd766d623b5610d77c41",
		                "description": "我是description"
		            },
		            {
		                "_id": "565d735bce680da20d24ead0",
		                "title": "冬天开不开暖气",
		                "cover_imageid": "5618bd766d623b5610d77c41",
		                "description": "我是description"
		            },
		            {
		                "_id": "565d735ace680da20d24eacf",
		                "title": "冬天开不开暖气",
		                "cover_imageid": "5618bd766d623b5610d77c41",
		                "description": "我是description"
		            }
		        ]
			}
		];
	var template = '<%_.forEach(datas, function(item) {%>'+
				        '<dl>'+
				            '<dt>'+
				                '<div class="angle">'+
				                    '<span class="white"></span>'+
				                    '<span class="other"></span>'+
				                '</div>'+
				                '<h4><%=item.title%></h4>'+
				            '</dt>'+
				            '<dd>'+
				                '<%_.forEach(item.arr, function(arr) {%>'+
				                    '<a href="api/v2/web/dec_strategy/<%=arr._id%>/homepage">'+
				                        '<img src="api/v2/web/thumbnail/212/<%=arr.cover_imageid%>" alt="<%=arr.title%>">'+
				                        '<span><%=arr.title%></span>'+
				                    '</a>'+
				                '<%});%>'+
				            '</dd>'+
				        '</dl>'+
				    '<%});%>';
	var compiled = _.template(template);
	container.html(compiled({datas : raiders}))
	
})*/