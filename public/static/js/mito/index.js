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
			this.winHash = this.win.location.search.split("?")[1];
			this.toFrom = !this.winHash ? 0 : (parseInt(this.strToJson(this.winHash).page) - 1)*5;
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
            this.search = $('#j-sch');
			this.toQuery = {};
			this.toSort = {
                "lastupdate":'-1'
            };
			this.searchWord = "";
            this.getCols();
			this.loadList();
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
            this.bindEvent();
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
                var index =self.getMin();
                var iH = win.scrollTop() + win.innerHeight();
                document.title = iH + ':' + (self.arrT[index] + 50);
                if (self.arrT[index] + 50 < iH) {
                    self.page++;
                    self.toFrom = (self.page-1)*36;
                    History.pushState({state:index}, "设计师--互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 第 "+self.page+" 页", "?page="+self.page+"&query="+encodeURI(self.searchWord)+self.jsonToStr(self.toQuery)+self.jsonToStr(self.toSort));
                    self.loadList();
                }
            })
        },
		loadList : function(){   //渲染生成列表
			var self = this;
            if (!self.iBtn) {
                return ;
            }
            self.iBtn = false;
            this.toSort = $.isEmptyObject(this.toSort) ? undefined : this.toSort;
			var oldData = {"query":this.toQuery,"sort":this.toSort,"search_word":this.searchWord,"from":this.toFrom,"limit":24}
			$.ajax({
				url:RootUrl+'api/v2/web/search_beautiful_image',
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
                    self.waterfall(res.data);
                    for (var i = 0; i < res.data.beautiful_images.length; i++) {
                        self.createList(res.data.beautiful_images[i])
                    };
                    self.setMainHeight(self.arrT[self.getMax()])
                    setTimeout(function() {
                        self.mito.find('.loging').hide();
                    },1000)
                    self.iBtn = true;
                }else{
                    self.list.html('暂时没有已完成的');
                }
            });
		},
        waterfall : function(data){
            console.log(data)
        },
		createList  : function(data){      //创建列表
            var self = this;
            var iHeight = data.images[0].height * ((this.iWidth - 2) / data.images[0].width);
            var index = self.getMin();
            var sTags = '';
            if(data.dec_style != undefined){
                sTags += '<span>'+globalData.dec_style(data.dec_style)+'</span>'
            }
            if(data.house_type != undefined){
                sTags += '<span>'+globalData.house_type(data.house_type)+'</span>'
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
        getViewHeight : function(){
            return $(window).height();   
        },
        setMainHeight : function(num){
            this.content.height(num)  
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
                    for(var i=0,len = arr.beautiful_images.length;i<len;i++){
                        dataArr.push(self.createList(arr.beautiful_images[i]));
                    }
                    self.list.html(dataArr);
                    self.loadImg(self.list.find('li'));
                    self.listTab(self.toQuery);
                    obj.find('.btns').on('click',function(ev){
                        ev.preventDefault();
                        if($(this).hasClass('current')){
                            return ;
                        }
                        var index = $(this).attr("href").match(/\d+(\.\d+)?/g)[0];
                        self.toFrom = (index-1)*5;
                        History.pushState({state:index}, "设计师--互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 第 "+index+" 页", "?page="+index+"&query="+encodeURI(self.searchWord)+self.jsonToStr(self.toQuery)+self.jsonToStr(self.toSort));
                        $('html,body').animate({scrollTop: self.top}, 500);
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
        toggle   : function(){    //更新筛选
        	var self = this;
        	this.filter.delegate('.btns','click',function(ev){
        		ev.preventDefault();
        		self.filter.toggleClass('toggle');
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
	var mito = new Mito();
	mito.init();	
});