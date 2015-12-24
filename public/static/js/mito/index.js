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
        }
    }
});
require(['jquery','lodash','lib/jquery.cookie','lib/jquery.history','utils/goto','utils/search','utils/user'],function($,_,cookie,history,Goto,Search,User){
    var History = window.History;
    var user = new User();
    user.init();
    var search = new Search;
    search.init({
        defaults : 1
    });
	var goto = new Goto();
	var Mito = function(){};
	Mito.prototype = {
		init : function(){
            this.win = window;
            this.doc = document;
            this.limit = 24;  //获取列表条数
			this.winHash = this.win.location.search.split("?")[1];
			this.cacheData = {}; //全局数据缓存
            this.iCells = 4;
            this.page = 1;
            this.iWidth = 291;
            this.iSpace = 12;
            this.iOuterWidth = this.iWidth + this.iSpace;
            this.arrT = [];
            this.arrL = [];
            this.iBtn = true;
			this.mito = $("#j-mito");
			this.schInfo = this.mito.find('.m-sch-info');
			this.list = this.mito.find('.m-list');
			this.filter = this.mito.find('.m-filter');
			this.sort = this.mito.find('.m-sort');
            this.content = this.mito.find('.m-content');
            this.notData = this.mito.find('.k-notData');
            this.loading = this.mito.find('.k-loading');
            this.search = $('#j-sch');
			this.toQuery = {};
			this.toSort = {};
            this.toFrom = 0;
			this.searchWord = "";
            this.getCols();
            if(!!this.winHash){
                this.setDefault(this.winHash);
            }else{
                this.loadList();
                this.bindEvent();
            }
			goto.init();
			this.toggle();
            this.sortfn();
            this.defaultSort();
            this.filterfn();
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
                    self.notData.addClass('hide');
                    self.loadList();
                }
                return false;
            })
        },
        getCols : function(){
            for (var i = 0; i < this.iCells; i++) {
                this.arrT[i] = 0;
                this.arrL[i] = this.iOuterWidth * i;
            };
        },
        getMin : function (){
            var self = this;
            return _.indexOf(self.arrT,_.min(self.arrT))
        },
        getMax : function (){
            var self = this;
            return _.indexOf(self.arrT,_.max(self.arrT))
        },
        bindEvent : function(){
            var self = this,
                win = $(window);
            win.on('scroll',function(){
                self.throttle(function(){
                    var index =self.getMin();
                    var iH = win.scrollTop() + win.innerHeight();
                    document.title = iH + ':' + (self.arrT[index] + 50);
                    if (self.arrT[index] + 50 < iH) {
                        self.page++;
                        self.toFrom = (self.page-1)*36;
                        History.pushState({state:index}, "设计师--互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 第 "+self.page+" 页", "?page="+self.page+"&query="+encodeURI(self.searchWord)+self.jsonToStr(self.toQuery)+self.jsonToStr(self.toSort));
                        self.loadList();
                    }
                },{context : self});
            })
        },
		loadList : function(){   //渲染生成列表
			var self = this;
            this.list.empty();
            this.loading.removeClass('hide');
            this.toSort = _.isEmpty(this.toSort) ? undefined : this.toSort;
			var oldData = {"query":this.toQuery,"sort":this.toSort,"search_word":this.searchWord,"from":this.toFrom,"limit":this.limit}
			$.ajax({
				url:RootUrl+'api/v2/web/search_beautiful_image',
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
                    self.waterfall(res.data);
                    self.cacheData[self.page] = [];
                    for (var i = 0; i < res.data.beautiful_images.length; i++) {
                        self.createList(res.data.beautiful_images[i])
                    };
                    self.setMainHeight(self.arrT[self.getMax()]);
                    console.log(self.cacheData[self.page])
                    setTimeout(function() {
                        self.mito.find('.loging').hide();
                    },1000)
                    self.iBtn = true;
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
        waterfall : function(){    //检测是否开启瀑布流
            if (!self.iBtn) {
                return ;
            }
            self.iBtn = false;
            this.loadList();
        },
        isWaterfall : function(){
            if(_.isEmpty(this.toSort) && _.isEmpty(this.searchWord)){
                this.bindEvent();
            }
        },
		createList  : function(data){      //创建列表
            var self = this;
            var iHeight = data.images[0].height * ((this.iWidth - 2) / data.images[0].width);
            var index = self.getMin();
            var sTags = '';
            if(data.section != undefined){
                sTags += '<span>'+data.section+'</span>'
            }
            if(data.house_type != undefined){
                sTags += '<span>'+globalData.house_type(data.house_type)+'</span>'
            }
            if(data.dec_style != undefined){
                sTags += '<span>'+globalData.dec_style(data.dec_style)+'</span>'
            }
            if(data.dec_type != undefined){
                sTags += '<span>'+globalData.dec_type(data.dec_type)+'</span>'
            }
            var arr = [
                '<li style="left: '+self.arrL[index]+'px; top: '+self.arrT[index]+'px;">',
                    '<div class="box">',
                        '<a href="/tpl/mito/detail.html?'+data._id+'" target="_blank" class="img">',
                            '<img src="/api/v2/web/thumbnail/289/'+data.images[0].imageid+'" style="width:'+(this.iWidth - 2)+'px; height:'+iHeight+'px;" alt="'+data.title+'" />',
                        '</a>',
                        '<div class="txt">',
                            '<h4><a href="/tpl/mito/detail.html?'+data._id+'" target="_blank">'+data.title+'</a></h4>',
                        '<p>'+sTags+'</p></div>',
                    '</div>',
                    '<div class="shadow"><div class="noe"></div><div class="two"></div></div>'
            ]
            this.arrT[index] += iHeight + 84;
            this.list.append(arr.join(''));
            self.cacheData[self.page].push({
                item : {
                    left : self.arrL[index],
                    top  : self.arrT[index]
                },
                img  : {
                    width : this.iWidth - 2,
                    height : iHeight,
                    imageid : data.images[0].imageid
                },
                urlid : data._id,
                title : data.title,
                tags  : sTags
            })
		},
        createLi : function(){
            var arr = [
                '<li style="left: '+self.arrL[index]+'px; top: '+self.arrT[index]+'px;">',
                    '<div class="box">',
                        '<a href="/tpl/mito/detail.html?'+data._id+'" target="_blank" class="img">',
                            '<img src="/api/v2/web/thumbnail/289/'+data.images[0].imageid+'" style="width:'+(this.iWidth - 2)+'px; height:'+iHeight+'px;" alt="'+data.title+'" />',
                        '</a>',
                        '<div class="txt">',
                            '<h4><a href="/tpl/mito/detail.html?'+data._id+'" target="_blank">'+data.title+'</a></h4>',
                        '<p>'+sTags+'</p></div>',
                    '</div>',
                    '<div class="shadow"><div class="noe"></div><div class="two"></div></div>'
            ];
        },
		loadData   :  function(li){      //利用缓存加载数据
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
        getViewHeight : function(){
            return $(window).height();   
        },
        setMainHeight : function(num){
            this.content.height(num)  
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
                if( i == 'lastupdate' || i == 'view_count' ){
                        oSort[i] = urlJson[i];
                }else if( i == 'dec_house_types' ||  i == 'dec_styles' ){
                    oQuery[i] = urlJson[i];
                }else if(i == 'section'){
                    oQuery[i] = decodeURI(urlJson[i]);
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
            });
        },
        setQueryMin : function(query){
            var arr = [
                '<dl>',
                    '<dt>空&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间</dt>',
                    '<dd>'+(query.section == undefined ? '不限' : query.section)+'</dd>',
                '</dl>',
                '<dl>',
                    '<dt>装修户型</dt>',
                    '<dd>'+(query.dec_house_types == undefined ? '不限' : globalData.house_type(query.dec_house_types))+'</dd>',
                '</dl>',
                '<dl>',
                    '<dt>擅长风格</dt>',
                    '<dd>'+(query.dec_styles == undefined ? '不限' : globalData.dec_style(query.dec_styles))+'</dd>',
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
            this.getCols();
            self.isWaterfall;
            this.cacheData = {};
            this.notData.addClass('hide');
            console.log(1)
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
    		});
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
        	});
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
        schmsg  : function(input,size){    //显示搜索消息
        	var str = '<strong>搜索内容</strong><i class="f-st">&gt;</i><span class="tags">'+input+'<i>X</i></span><span class="result">共<i>'+size+'</i>结果</span>'+(!size ? '<span class="tips">以下是根据您搜索的装修美图</span>' : '');
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
            });
        },
        strToJson : function(str){    // 字符串转对象
            var json = {},temp;
            if(str.indexOf("&") != -1){
                var arr = str.split("&");
                for (var i = 0,len = arr.length; i < len; i++) {
                    temp = arr[i].split("=");
                    json[temp[0]] = temp[1];
                }
            }else{
                temp = str.split("=");
                json[temp[0]] = temp[1];
            }
            return json;
        },
        jsonToStr : function (json){   // 对象转字符串
            var str = '';
            for (var i in json) {
                str += '&'+i+'='+json[i];
            }
            return str;
        },
        throttle  : function(){
            var isClear = arguments[0],fn;
            if(_.isBoolean(isClear)){
                fn = arguments[1];
                fn._throttleID && clearTimeout(fn._throttleID)
            }else{
                fn = isClear;
                param = arguments[1];
                var oP = _.assign({
                    context : null,
                    args : [],
                    time : 300
                },param);
                arguments.callee(true,fn);
                fn._throttleID = setTimeout(function(){
                    fn.apply(oP.context , oP.args)
                }, oP.time)
            }
        }
	};
	var mito = new Mito();
	mito.init();	
});