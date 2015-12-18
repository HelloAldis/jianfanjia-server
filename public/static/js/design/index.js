require.config({
    baseUrl: '../../static/js/',
    paths  : {
        jquery: 'lib/jquery-1.11.1.min',
        lodash : 'lib/lodash.min'
    },
    shim   : {
        'jquery.cookie': {
            deps: ['jquery']
        },
        'jquery.history': {
            deps: ['jquery']
        },
        'jquery.requestAnimationFrame.min': {
            deps: ['jquery']
        },
        'jquery.fly.min': {
            deps: ['jquery']
        }
    }
});
require(['jquery','lodash','lib/jquery.cookie','lib/jquery.history','utils/goto','utils/search','utils/page','utils/user','lib/jquery.requestAnimationFrame.min','lib/jquery.fly.min'],function($,_,cookie,history,Goto,Search,Pageing,User){
    var History = window.History;
    var user = new User();
    user.init();
    var search = new Search;
    search.init();
    var page = new Pageing();
	var goto = new Goto();
	var Designer = function(){};
	Designer.prototype = {
		init : function(){
			this.winHash = window.location.search.split("?")[1];
			this.toFrom = !this.winHash ? 0 : (parseInt(this.strToJson(this.winHash).page) - 1)*5;
			this.cacheData = {}; //全局数据缓存
			this.design = $("#j-design");
			this.schInfo = this.design.find('.m-sch-info');
			this.list = this.design.find('.m-list');
			this.filter = this.design.find('.m-filter');
			this.sort = this.design.find('.m-sort');
            this.search = $('#j-sch');
			this.toQuery = {};
			this.toSort = {};
			this.searchWord = "";
			this.usertype = $.cookie("usertype");
			this.loadList();
			this.addIntent();
			goto.init({
				shop : true
			});
			this.toggle();
            this.sortfn();
            this.defaultSort();
            this.filterfn();
			if(!!this.winHash){
				this.setDefault(this.winHash);
			}
            if(!!this.winHash && (this.winHash.indexOf('?query=') != -1 || this.winHash.indexOf('&query=') != -1)){
                this.searchWord = decodeURI(this.strToJson(this.winHash).query);
                this.search.find('.input').val(this.searchWord);
                this.search.find('.u-sch-inp').addClass('u-sch-inp-focus');
            }
            this.submitBtn();

		},
        submitBtn : function(){     //搜索按钮  
            var submitBtn = this.search.find('form'),
                downSelect = this.search.find('.u-sch-ds'),
                oInput = this.search.find('.input'),
                oSapn = downSelect.find('.u-sch-ds-txt span'),
                self = this;
            submitBtn.on('submit',function(){
                if(!!oInput.val() && oInput.val() != '搜索'+oSapn.html()){
                    self.searchWord = oInput.val();
                    History.pushState({state:1}, "设计师--互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 第1页", "?page=1&query="+encodeURI(self.searchWord)+self.jsonToStr(self.toQuery)+self.jsonToStr(self.toSort));
                    self.loadList();
                }
                return false;
            })
        },
		loadList : function(){   //渲染生成列表
			var self = this;
            this.toSort = $.isEmptyObject(this.toSort) ? undefined : this.toSort;
			var oldData = {"query":this.toQuery,"sort":this.toSort,"search_word":this.searchWord,"from":this.toFrom,"limit":5}
			$.ajax({
				url:RootUrl+'api/v2/web/designer/search',
				type: 'POST',
				contentType : 'application/json; charset=utf-8',
				dataType: 'json',
				data : JSON.stringify(oldData),
				processData : false
			})
            .done(function(res){
                if(!!self.searchWord){
                    self.schmsg(self.searchWord,res['data'].total)
                }
                if(!!res.data.total){
                    self.page(res.data)
                }else{
                    self.list.html('暂时没有已完成的');
                    page.destroy();
                }
            });
		},
		createList  : function(data){      //创建列表
			var arr = [
				'<li data-uid="'+data._id+'">',
					'<div class="work">',
						'<div class="info">'
				],
				numStar = Math.round((data.respond_speed ? data.respond_speed : 0 + data.service_attitude ? data.service_attitude : 0)/2),
				numStar = numStar >= 5 ? 5 : numStar,
				strStar = '<span class="star">',
				houseType = '',
				style = '<dd class="f-cb">',
				product = '<ul>';
				arr.push('<a href="/tpl/design/home.html?'+data._id+'" class="head"><img src="/api/v1/thumbnail/90/'+data.imageid+'" alt="'+data.username+'"></a>');
				arr.push('<dl><dt>');
				arr.push('<a href="/tpl/design/home.html?'+data._id+'"><strong>'+data.username+'</strong></a>');	
				arr.push('<span class="auth"><i class="iconfont" title="实名认证">&#xe634;</i><i class="iconfont" title="认证设计师">&#xe62a;</i></span>');			
				for (var i = 0; i < 5; i++) {
					if(i < numStar){
						strStar += '<i class="iconfont">&#xe604;</i>'
					}else{
						strStar += '<i class="iconfont">&#xe62b;</i>'
					}
				};
				strStar += '</span>';			
				arr.push(strStar);
				for (var i = 0 , len = data.dec_styles.length; i < len; i++) {
					style += '<span class="style" data-style="'+data.dec_styles[i]+'">'+ globalData.dec_style(data.dec_styles[i])+'</span>'
				};
				arr.push(style);
				for (var i = 0 , len = data.dec_house_types.length; i < len; i++) {
					houseType += '<span class="house" data-house="'+data.dec_house_types[i]+'">'+ globalData.house_type(data.dec_house_types[i])+'</span>'
				};
				houseType += '</dd>';
				arr.push(houseType);
				arr.push('</dl></div><div class="service">');
				if(this.usertype == 1 || this.usertype == undefined){
					if(data.is_my_favorite){
						arr.push('<div class="add"><a href="/tpl/user/owner.html#/designer" class="u-btns u-btns-revise">已添加</a><div class="mask"></div></div>');
					}else{
						arr.push('<div class="add"><button class="u-btns addIntent">添加意向</button><div class="mask"></div></div>');
					}
				}
				arr.push('<div class="list">');
				arr.push('<dl><dt>'+data.authed_product_count+'</dt><dd>作品数</dd></dl>');
				arr.push('<dl><dt>'+data.order_count+'</dt><dd>预约数</dd></dl>');
				arr.push('<dl><dt>'+globalData.price_area(data.design_fee_range)+'</dt><dd>设计费(元/m&sup2;)</dd></dl>');
				arr.push('</div></div></div><div class="product">');
				for (var i = 0; i < 3; i++) {
					product += '<li><a class="loadImg" href="javascript:;"><img src="../../static/img/public/load.gif" alt="'+data.username+'的作品" /></a></li>'
				};
				product += '</ul>';
				arr.push(product);
				arr.push('</div></li>');
				return arr.join('');
		},
		loadImg   :  function(li){      //利用缓存加载作品图片
			var self = this; 
			li.each(function(index, el) {
				var uid = $(el).data('uid');
				var oImg = $(el).find('.product');
				if(!self.cacheData[uid]){
					self.cacheData[uid] = [];
					$.ajax({
						url: RootUrl+'api/v2/web/search_designer_product',
						type: 'POST',
						contentType : 'application/json; charset=utf-8',
						dataType: 'json',
						data : JSON.stringify({
						  "query":{
						    "designerid":uid
						  },
						  "from": 0,
						  "limit" : 3
						}),
						processData : false
					})
					.done(function(res) {
						if(res.data.total >= 3){
							self.cacheData[uid] = res.data.products;
							eachImg(oImg,self.cacheData[uid])
						}
					})
				}else{
					eachImg(oImg,self.cacheData[uid])
				}
			});
			function eachImg(obj,arr){
				$.each(arr,function(i,v){
					obj.find('a').eq(i).attr('href',"detail.html?"+v._id).removeClass('.loadImg').find('img').attr({'src' : '/api/v1/thumbnail/280/'+v.images[0].imageid , 'alt' : v.cell});
				})	
			}
		},
		page  : function(arr){
            var self = this,
                maxElem =  Math.ceil(arr.total/5),
                current = !History.getState ? !this.winHash ? 0 : (parseInt(this.strToJson(this.winHash).page) - 1) : !History.getState().url.split("?")[1] ? 0 : parseInt(this.strToJson(History.getState().url.split("?")[1]).page) - 1;
                if(current+1 > maxElem){
                    History.pushState({state:1}, "设计师--互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 第1页", "?page=1&query="+encodeURI(self.searchWord)+self.jsonToStr(self.toQuery)+self.jsonToStr(self.toSort));
                    this.toFrom = 0;
                    self.loadList();
                    return false;
                }
            page.init({
                allNumPage : arr.total,
                itemPage : 5,
                showPageNum : 6,
                endPageNum : 1,
                currentPage : current,
                prevText:"上一页",
                nextText:"下一页",
                linkTo : '__id__',
                showUbwz : true,
                callback : function(num,obj){
                    self.list.html('');
                    var dataArr = [];
                    for(var i=0,len = arr.designers.length;i<len;i++){
                        dataArr.push(self.createList(arr.designers[i]));
                    }
                    self.list.html(dataArr);
                    self.loadImg(self.list.find('li'));
                    self.listTab(self.toQuery);
                    obj.find('.btns').on('click',function(ev){
                        ev.preventDefault();
                        var index = $(this).attr("href").match(/\d+(\.\d+)?/g)[0];
                        self.toFrom = (index-1)*5;
                        History.pushState({state:index}, "设计师--互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 第 "+index+" 页", "?page="+index+"&query="+encodeURI(self.searchWord)+self.jsonToStr(self.toQuery)+self.jsonToStr(self.toSort));
                        self.loadList();
                        return false;
                    });
                }
            });
        },
        setDefault : function(defaultData){
            if(!!defaultData){
                //History.pushState({state:1}, "互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 设计师第1页", "?page=1");
                this.setQuery({});
                this.setSort(undefined);
            }else{
                var urlJson = this.strToJson(State.url.split("?")[1])
                var current = urlJson.page != undefined ? parseInt(urlJson.page)-1 : 0;
                var oQuery = {};
                var oSort = {};
                this.toFrom = current*5;
                for(var i in urlJson){
                    if(i != 'page'){
                        if( i == 'product_count' || i == 'order_count' ||  i == 'view_count'){
                            oSort[i] = urlJson[i];
                        }else{
                            oQuery[i] = urlJson[i];
                        }
                    }
                }
                this.toQuery = oQuery;
                this.setQuery(toQuery);
                if(!$.isEmptyObject(oSort)){
                    this.toSort = oSort;
                    this.setSort(toSort);
                }else{
                    oSort = {};
                    this.setSort({"product_count":-1});
                }
            }
        },
        setQuery : function(query){     //设置筛选当前状态
        	this.filter.find('.list').find('a').removeClass()
        	if(!$.isEmptyObject(query)){
        		this.filter.find('.list').find('dl').each(function(index, el) {
        			$.each(query,function(i){
        				if($(el).data('type') == i){
        					$(el).find('a').each(function(index, el1) {
        						$(el1).removeClass();
        						if($(el1).data('query') == query[i]){
        							$(el1).addClass('current');
        						}
        					})
        					return false;
        				}else{
        					$(el).find('a').eq(0).addClass('current');
        				}
        			})
        		})
        	}else{
        		this.filter.find('.list').find('dl').each(function(index, el) {
        			$(this).find('a').eq(0).addClass('current');
        		})
        	}
        },
        setSort  : function(sort){    //设置排序当前状态
        	this.sort.find('a').removeClass();
            if(sort == undefined){
                this.sort.find('strong').attr('class', 'current');
                return ;
            }
        	this.sort.find('a').each(function(index, el) {
        		$.each(sort,function(i){
        			if($(el).data('sort') == i){
        				if(sort[i] == 1){
        					$(el).attr('class', 'current sort');
        				}else{
        					$(el).attr('class', 'current');
        				}
        			}else{
        				$(el).removeClass();
        			}	
        		});
        	})
        },
        filterSort :   function(off){      //筛选排序处理函数
        	var self = this,
        		filter = {},
        		sort = {};
        		this.sort.find('a').each(function(index, el) {
        			if($(el).hasClass('current')){
        				if($(el).hasClass('sort')){
        					sort[$(el).data('sort')] = 1
        				}else{
        					sort[$(el).data('sort')] = -1
        				}
        			}
        		});
        		this.filter.find('a').each(function(index, el) {
        			var oDl = $(this).closest('dl');
        			if($(this).hasClass('current') && $(this).data('query') != -1){
        				filter[oDl.data('type')] = $(this).data('query');
        			}
        		});
        	self.toQuery = filter;
        	self.setQuery(filter);
        	self.toFrom = 0;
        	if(!off){
        		self.toSort = sort == null ? undefined : sort;
        		self.setSort(self.toSort);
        		History.pushState({state:1}, "设计师 -- 互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 第1页", "?page=1&query="+encodeURI(self.searchWord)+self.jsonToStr(self.toQuery)+self.jsonToStr(self.toSort));
        	}else{
        		self.toSort = undefined;
        		History.pushState({state:1}, "设计师 -- 互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 第1页", "?page=1&query="+encodeURI(self.searchWord)+self.jsonToStr(self.toQuery));
        	}
        	this.loadList();	
        },
        sortfn : function(){   //排序
        	var self = this;
    		this.sort.delegate('a','click',function(ev){
    			if($(this).hasClass('current') && $(this).hasClass('sort')){
    				$(this).removeClass('sort');
    			}else if($(this).hasClass('current')){
    				$(this).addClass('sort');
    			}
    			$(this).addClass('current').siblings().removeClass('current');
    			self.filterSort();
    			return false;
    		})
        },
        defaultSort : function(){     //默认排序
        	var self = this;
        	this.sort.delegate('strong','click',function(ev){
        		if($(this).hasClass('current')){
        			return ;
        		}else{
        			$(this).addClass('current').siblings().removeClass('current');
        		}
        		self.filterSort(true);
        		return false;
        	})
        },
        filterfn    : function(){   //筛选
        	var self = this;
        	this.filter.find('.list').delegate('a','click',function(ev){
        		if($(this).hasClass('current')){
        			return false;
        		}
        		$(this).attr('class','current').siblings().attr('class', '');
        		self.filterSort();
        		return false;
        	})
        },
        listTab : function(filter){
            var self = this,
                aLi = this.list.find('li'),
                style = filter.dec_styles != undefined ? filter.dec_styles : undefined,
                house = filter.dec_house_types != undefined ? filter.dec_house_types : undefined;
            aLi.each(function(i,el){
                $(el).find('.style').each(function(j,ele){
                    if($(ele).data('style') == style){
                        $(ele).addClass('active');
                    }else{
                        $(ele).removeClass('active'); 
                    }
                });
                $(el).find('.house').each(function(j,ele){
                    if($(ele).data('house') == house){
                        $(ele).addClass('active');
                    }else{
                        $(ele).removeClass('active'); 
                    }
                });
            });
        },
        toggle   : function(){    //更新筛选
        	var self = this;
        	this.filter.delegate('.btns','click',function(ev){
        		ev.preventDefault();
        		self.filter.toggleClass('toggle');
        	});
        },
        addIntent : function(){     //添加意向
        	var self = this,
                off = true;
    		this.design.delegate('.addIntent','click',function(ev){
                ev.preventDefault();
                if(!off){
                    return ;
                }
                off = false;
    			var slef = $(this),
    				addOffset = goto.offset();
    			if(self.usertype === '1'){
    				var parent = $(this).closest('li'),
    					uidname = parent.data('uid'),
    					head = parent.find('.head'),
    					img = head.find('img').attr('src')
    					state = head.offset(),
    					scrollTop = $(document).scrollTop();
    					flyer = $('<img class="u-flyer" src="'+img+'">');
    				var url = RootUrl+'api/v2/web/favorite/designer/add';
    				$.ajax({
    					url:url,
    					type: 'POST',
    					contentType : 'application/json; charset=utf-8',
    					dataType: 'json',
    					data : JSON.stringify({
    						"_id":uidname
    					}),
    					processData : false
    				})
    				.done(function(res) {
    					if(res.msg === "success"){
    						slef.html('已添加').attr('href','/tpl/user/owner.html#/designer').removeClass('addIntent').addClass('u-btns-revise');
    						flyer.fly({
    							start: {
    								left: state.left,
    								top: state.top - scrollTop
    							},
    							end: {
    								left: addOffset.left+10,
    								top: addOffset.top+10,
    								width: 0,
    								height: 0
    							},
    							onEnd: function(){
    								goto.addDesigners();
                                    user.updateData();
    								this.destory();
    							}
    						});
                            off = true;
    					}
    				});
    			}else{
    	            window.location.href = '/tpl/user/login.html?'+window.location.href;
    	        }
    		});
        },
        schmsg  : function(input,size){    //显示搜索消息
        	var str = '<strong>搜索内容</strong><i class="f-st">&gt;</i><span class="tags">'+input+'<i>X</i></span><span class="result">共<i>'+size+'</i>结果</span>'+(!size ? '<span class="tips">以下是根据您搜索的设计师</span>' : '');
        	this.schInfo.html(str).removeClass('hide');
            this.clearTags();
        },
        clearTags : function(){
            var self = this;
            this.schInfo.delegate('.tags','click',function(ev){
                ev.preventDefault();
                self.searchWord = "";
                History.pushState({state:1}, "设计师--互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 第1页", "?page=1&query="+encodeURI(self.searchWord)+self.jsonToStr(self.toQuery)+self.jsonToStr(self.toSort));
                self.loadList();
                self.search.find('.input').val('搜索设计师');
                self.search.find('.u-sch-inp').removeClass('u-sch-inp-focus');
                self.schInfo.html('').addClass('hide');
            })
        },
        strToJson : function(str){    // 字符串转对象
            var json = {};
            if(str.indexOf("&") != -1){
                var arr = str.split("&");
                for (var i = 0,len = arr.length; i < len; i++) {
                    var  temp = arr[i].split("=");
                    json[temp[0]] = temp[1]
                };
            }else{
                var  temp = str.split("=");
                json[temp[0]] = temp[1]
            }
            return json;
        },
        jsonToStr : function (json){   // 对象转字符串
            var str = '';
            for (var i in json) {
                str += '&'+i+'='+json[i]
            };
            return str;
        }
	}
	var design = new Designer();
	design.init();	
})
require(['utils/designers'],function(Designers){
	var designers = new Designers();
	designers.init({
		id       : '#j-featured .m-ct',
		template : [
			'<%_.forEach(datas, function(item) {%>',
		    '<li>',
		    '<a href="/tpl/design/home.html?<%=item._id%>">',
		    '<span class="arrow">',
		    '<em></em>',
		    '<i class="iconfont2">&#xe604;</i>',
		    '</span>',
		    '<img src="/api/v2/web/thumbnail/258/<%=item.imageid%>" alt="">',
		    '<span class="txt"><%=item.username%></span>',
		    '</a>',
		    '</li>',
		    '<%});%>'
		],
		limit : 5
	})
})


// require(['utils/raiders'],function(Raiders){
// 	var raiders = new Raiders;

// 	var template = [
// 	        '<ul>',
// 	            '<%_.forEach(datas, function(item) {%>',
// 				    '<li>',
// 				    '<h4><a href="tpl/design/home.html?<%=item._id%>"><%=item.title%></a></h4>',
// 				    '<p></p>',
// 				    '</li>',
// 			    '<%});%>',
// 	        '</ul>'
// 		]
// 	raiders.init({
// 		id       : '#j-raiders .m-ct',
// 		templatebk : template,
// 		templatets : [],
// 		limit : 3
// 	})
// })