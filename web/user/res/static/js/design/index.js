require.config({
    baseUrl: '/static/js/',
    paths  : {
        jquery: 'lib/jquery',
        lodash : 'lib/lodash',
        cookie : 'lib/jquery.cookie',
        history : 'lib/jquery.history',
        requestAnimationFrame : 'lib/jquery.requestAnimationFrame.min',
        fly : 'lib/jquery.fly.min'
    },
    shim   : {
        'history': {
            deps : ['jquery']
        }
    }
});
require(['jquery','lib/lazyload'],function($){
    $(function(){
        $("img.lazyimg").lazyload({
            effect : "fadeIn"
        });
    });
});
require(['design/potter'],function(Potter){
    var potter = new Potter("#j-potter");
    potter.init()
})
require(['design/dynamic'],function(Dynamic){
    var dynamic = new Dynamic("#j-dynamic");
    dynamic.init();
})
/*require(['design/featured'],function(Featured){
    var featured = new Featured("#j-featured");
    featured.init();
})*/
require(['design/interviews'],function(Interviews){
    var interviews = new Interviews("#j-interviews");
    interviews.init();
})
require(['jquery','lodash','lib/jquery.cookie','lib/jquery.history','utils/common','utils/page','utils/tooltip','utils/globalData','fly'],function($,_,cookie,history,common,Pageing,Tooltip,globalData){
    var search = new common.Search();
    search.init();
    var user = new common.User();
    user.init();
    var page = new Pageing();
	var goto = new common.Goto();
	var Designer = function(){};
	Designer.prototype = {
		init : function(){
            var History = window.History;
            this.limit = 5;  //获取列表条数
            this.winHash = window.location.search.split("?")[1];   //获取URL参数，操作上下文
			this.cacheData = {}; //全局数据缓存
			this.design = $("#j-design");   //获取容器元素
			this.schInfo = this.design.find('.m-sch-info');   //获取搜索提示信息元素
			this.list = this.design.find('.m-list');   //获取列表展示容器元素
			this.filter = this.design.find('.m-filter');   //获取筛选元素
			this.sort = this.design.find('.m-sort');   //获取排序元素
            this.search = $('#j-sch');   //获取搜索元素
            this.notData = this.design.find('.k-notData');    //获取无数据展示元素
            this.loading = this.design.find('.k-loading');    //获取数据加载元素
			this.toQuery = {};     //创建筛选对象
			this.toSort = {};    //创建排序对象
			this.searchWord = "";    //创建关键词搜索
            this.toFrom = 0;  //搜索分页起始位置
			this.usertype = $.cookie("usertype");    //获取cookie，供业主添加意向设计师
            if(!!this.winHash){       //获取URL参数,设置默认值
                this.setDefault(this.winHash);
            }else{
               this.loadList();    //加载数据
            }
			this.addIntent();   //业主添加意向设计师
			goto.init({         //显示右侧菜单
				shop : true     //开启业主意向设计师菜单
			});
			this.toggle();      //筛选展开隐藏
            this.sortfn();       //排序操作
            this.defaultSort();   //默认排序操作
            this.filterfn();     //筛选操作
            this.submitBtn();    //搜索按钮操作
            this.top = this.design.offset().top+20;   //获取列表top，供分页切换跳转列表顶部位置
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
                    self.toFrom = 0;
                    History.pushState({state:1}, "设计师--互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 第1页", "?page=1&query="+encodeURI(self.searchWord)+self.jsonToStr(self.toQuery)+self.jsonToStr(self.toSort));
                    self.notData.addClass('hide');
                    self.loadList();
                }
                return false;
            })
        },
		loadList : function(){   //渲染生成列表
			var self = this;
            this.list.empty();
            page.destroy();
            this.loading.removeClass('hide');
            this.toSort = _.isEmpty(this.toSort) ? undefined : this.toSort;
			var oldData = {"query":this.toQuery,"sort":this.toSort,"search_word":this.searchWord,"from":this.toFrom,"limit":this.limit}
			$.ajax({
				url:'/api/v2/web/designer/search',
				type: 'POST',
				contentType : 'application/json; charset=utf-8',
				dataType: 'json',
				data : JSON.stringify(oldData),
				processData : false
			})
            .done(function(res){
                self.loading.addClass('hide');
                if(!!self.searchWord){
                    self.schmsg(self.searchWord,res['data'].total)
                }
                if(!!res.data.total){
                    self.page(res.data)
                }else{
                    self.notData.removeClass('hide');
                    self.toQuery = {};
                    self.toSort = {};
                    self.searchWord = "";
                    self.toFrom = 0;
                    self.loadList();
                }
            });
		},
		createList  : function(data){      //创建列表
			var arr = [
				'<li data-uid="'+data._id+'">',
					'<div class="work">',
						'<div class="info">'
				],
				numStar = Math.round(((data.respond_speed ? data.respond_speed : 0) + (data.service_attitude ? data.service_attitude : 0))/2),
				numStar = numStar >= 5 ? 5 : numStar,
				houseType = '',
				style = '<dd class="f-cb">',
				product = '<ul>';
				arr.push('<a href="/tpl/designer/'+data._id+'" class="u-head u-head-w90 u-head-radius"><img src="/api/v2/web/thumbnail2/90/90/'+data.imageid+'" alt="'+data.username+'" src="../../static/img/public/load.gif"></a>');
				arr.push('<dl><dt>');
				arr.push('<a href="/tpl/designer/'+data._id+'"><strong>'+data.username+'</strong></a>');
                if(data.tags[0] === '暖暖走心'){
                   arr.push('<span class="tag tag-0">暖暖走心</span>');
                }else if(data.tags[0] === '新锐先锋'){
                   arr.push('<span class="tag tag-1">新锐先锋</span>');
                }else if(data.tags[0] === '匠心定制'){
                   arr.push('<span class="tag tag-2">匠心定制</span>');
                }
                arr.push('<span class="auth">');
                if(data.uid_auth_type === '2'){
                    arr.push('<i class="iconfont tooltip" data-title="实名认证">&#xe634;</i>');
                }
                if(data.auth_type === '2'){
                    arr.push('<i class="iconfont tooltip" data-title="认证设计师">&#xe62a;</i>');
                }
                arr.push('</span>');
                if(data.tags[0] === '匠心定制'){
                   arr.push('<span class="tag-icon tooltip" data-title="匠心定制设计师"></span>');
                }
                strStar = '<dd class="f-cb"><div class="star"><strong>综合评价</strong>';
				for (var i = 0; i < 5; i++){
					if(i < numStar){
						strStar += '<i class="iconfont">&#xe604;</i>'
					}else{
						strStar += '<i class="iconfont">&#xe62b;</i>'
					}
				};
				strStar += '</div></dd>';
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
						arr.push('<div class="add"><a href="/tpl/user/owner.html#/designer/1" class="u-btns u-btns-revise">已添加</a><div class="mask"></div></div>');
					}else{
						arr.push('<div class="add"><button class="u-btns addIntent">添加意向</button><div class="mask"></div></div>');
					}
				}
				arr.push('<div class="list">');
				arr.push('<dl><dt>'+data.authed_product_count+'</dt><dd>作品数</dd></dl>');
				arr.push('<dl><dt>'+data.order_count+'</dt><dd>预约数</dd></dl>');
				arr.push('<dl><dt>'+( data.design_fee_range == undefined ? '0' : globalData.price_area(data.design_fee_range))+'</dt><dd>设计费(元/m&sup2;)</dd></dl>');
				arr.push('</div></div></div><div class="product">');
				for (var i = 0; i < 3; i++) {
					product += '<li><a class="loadImg" href="javascript:;"><img class="lazyimg" data-original="" src="../../static/img/public/load.gif" alt="'+data.username+'的作品" /></a></li>'
				};
				product += '</ul>';
				arr.push(product);
				arr.push('</div></li>');
				return arr.join('');
		},
		cacheImg   :  function(li){      //利用缓存加载作品图片
			var self = this;
			li.each(function(index, el) {
				var uid = $(el).data('uid');
				var oImg = $(el).find('.product');
				if(!self.cacheData[uid]){
					self.cacheData[uid] = [];
					$.ajax({
						url: '/api/v2/web/search_designer_product',
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
					obj.find('a').eq(i).attr('href',"/tpl/product/"+v._id).removeClass('.loadImg').find('img').attr('src' , '/api/v2/web/thumbnail2/280/220/'+v.cover_imageid).attr('alt',v.cell);
				})
			}
		},
		page  : function(arr){    //数据分页
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
                    new Tooltip('.tooltip');
                    self.cacheImg(self.list.find('li'));
                    self.listTab(self.toQuery);
                    obj.find('.btns').on('click',function(ev){
                        ev.preventDefault();
                        if($(this).hasClass('current')){
                            return ;
                        }
                        var index = $(this).attr("href").match(/\d+(\.\d+)?/g)[0];
                        self.toFrom = (index-1)*self.limit;
                        History.pushState({state:index}, "设计师--互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 第 "+index+" 页", "?page="+index+"&query="+encodeURI(self.searchWord)+self.jsonToStr(self.toQuery)+self.jsonToStr(self.toSort));
                        $('html,body').animate({scrollTop: self.top}, 500);
                        self.loadList();
                        return false;
                    });
                }
            });
        },
        setDefault : function(defaultData){     //设置url参数默认值
            var self = this,
                urlJson = this.strToJson(defaultData);
                current = urlJson.page != undefined ? parseInt(urlJson.page)-1 : 0;
                oQuery = {};
                oSort = {};
            this.toFrom = current*this.limit;  //设置分页初始化
            this.searchWord = $.trim(decodeURI(urlJson.query));   //获取搜索值
            if(!!this.searchWord){   //如果有参数就设置输入框
                this.search.find('.input').val(this.searchWord);
                this.search.find('.u-sch-inp').addClass('u-sch-inp-focus');
            }
            for(var i in urlJson){
                if( i == 'authed_product_count' || i == 'order_count' ||  i == 'view_count'){
                        oSort[i] = urlJson[i];
                }else if(i == 'dec_types' || i == 'dec_house_types' ||  i == 'dec_styles' ||  i == 'design_fee_range'){
                    oQuery[i] = urlJson[i];
                }
            }
            self.toQuery = oQuery;
            _.isEmpty(self.toQuery) || this.setQueryMin(self.toQuery);
            _.isEmpty(self.toQuery) || this.setQuery(self.toQuery);
            self.toSort = oSort;
            _.isEmpty(self.toSort) || this.setSort(self.toSort);
            this.loadList();    //加载数据
        },
        setQuery : function(query){     //设置筛选当前状态
            var list = this.filter.find('.list');
        	list.find('a').removeClass();
        	list.find('dl').each(function(index, el) {
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
        },
        setQueryMin : function(query){
            var arr = [
                '<dl>',
                    '<dt>装修类型</dt>',
                    '<dd>'+(query.dec_types == undefined ? '不限' : globalData.dec_type(query.dec_types))+'</dd>',
                '</dl>',
                '<dl>',
                    '<dt>装修户型</dt>',
                    '<dd>'+(query.dec_house_types == undefined ? '不限' : globalData.house_type(query.dec_house_types))+'</dd>',
                '</dl>',
                '<dl>',
                    '<dt>装修风格</dt>',
                    '<dd>'+(query.dec_styles == undefined ? '不限' : globalData.dec_style(query.dec_styles))+'</dd>',
                '</dl>',
                '<dl>',
                    '<dt>设计师等级</dt>',
                    '<dd>'+(query.tags == undefined ? '不限' : query.tags)+'</dd>',
                '</dl>',
                '<div class="minbtns">',
                    '<span href="javascript:;" class="more-btn"><span></span><i></i></span>',
                '</div>'
            ];
            this.filter.find('.min').html(arr.join(''))
        },
        setSort  : function(sort){    //设置排序当前状态
            this.sort.find('strong').attr('class', '');
        	this.sort.find('a').removeClass().each(function(index, el) {
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
            _.isEmpty(self.toQuery) || this.setQueryMin(self.toQuery);
            _.isEmpty(self.toQuery) || this.setQuery(self.toQuery);
            self.toSort = sort;
            _.isEmpty(self.toSort) || this.setSort(self.toSort);
        	this.toFrom = 0;
            History.pushState({state:1}, "设计师 -- 互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 第1页", "?page=1&query="+encodeURI(self.searchWord)+self.jsonToStr(self.toQuery)+self.jsonToStr(self.toSort));
            self.notData.addClass('hide');
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
            this.filter.delegate('.min','click',function(ev){
                ev.preventDefault();
                self.filter.addClass('toggle');
            }).delegate('.btns','click',function(ev){
        		ev.preventDefault();
        		self.filter.removeClass('toggle');
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
    					head = parent.find('.u-head'),
    					img = head.find('img').attr('src')
    					state = head.offset(),
    					scrollTop = $(document).scrollTop();
    					flyer = $('<img class="u-flyer" src="'+img+'">');
    				var url = '/api/v2/web/favorite/designer/add';
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
    						slef.html('已添加').attr('href','/tpl/user/owner.html#/designer/1').removeClass('addIntent').addClass('u-btns-revise');
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
        	var str = '<strong>搜索内容</strong><i class="f-st">&gt;</i><span class="tags">'+input+'<i>X</i></span><span class="result">共<i>'+size+'</i>结果</span>'+(!size ? '<span class="tips">以下是根据您搜索内容推荐的设计师</span>' : '');
        	this.schInfo.html(str).removeClass('hide');
            this.clearTags();
        },
        clearTags : function(){
            var self = this;
            this.schInfo.delegate('.tags','click',function(ev){
                ev.preventDefault();
                self.searchWord = "";
                History.pushState({state:1}, "设计师--互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 第1页", "?page=1&query="+encodeURI(self.searchWord)+self.jsonToStr(self.toQuery)+self.jsonToStr(self.toSort));
                self.notData.addClass('hide');
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

