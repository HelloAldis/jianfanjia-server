require.config({
    baseUrl: '/static/js/',
    paths  : {
        jquery: 'lib/jquery',
        lodash : 'lib/lodash'
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
require(['jquery','lodash','lib/jquery.cookie','utils/common'],function($,_,cookie,common){
    var user = new common.User();
    user.init();
    var search = new common.Search();
    search.init({
        defaults : 1
    });
})
require(['jquery','lodash','lib/jquery.cookie','lib/jquery.history','utils/common'],function($,_,cookie,history,common){
    var History = window.History;
	var goto = new common.Goto();
	var Mito = function(){};
	Mito.prototype = {
		init : function(){
            this.win = window;
            this.doc = document;
            this.limit = 24;  //获取列表条数
            this.toFrom = 0;  //初始化分页起始位置
            this.total = 0;  //总页数
			this.winHash = this.win.location.search.split("?")[1];
            this.cacheDataIndex = 0; //取数据的起始位置
            this.cachePageData = {}; //分页数据缓存
            this.iCells = 4;
            this.page = 1;
            this.iWidth = 291;
            this.iSpace = 12;
            this.iOuterWidth = this.iWidth + this.iSpace;
            this.arrT = [];
            this.arrL = [];
            this.iBtn = true;
            this.isRenderView = false;
			this.mito = $("#j-mito");
			this.schInfo = this.mito.find('.m-sch-info');
			this.list = this.mito.find('.m-list');
			this.filter = this.mito.find('.m-filter');
			this.sort = this.mito.find('.m-sort');
            this.content = this.mito.find('.m-content');
            this.notData = this.mito.find('#k-notData');
            this.notData2 = this.mito.find('#k-notData2');
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
            }
            this.isWaterfall();
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
                    self.setQueryMin();
                    self.setQuery();
                    self.setMainHeight(0);
                    self.list.empty();
                    History.pushState({state:1}, "装修美图--互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 第1页", "?query="+encodeURI(self.searchWord));
                    self.notData.addClass('hide');
                    self.notData2.addClass('hide');
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
                win = $(window),
                btn = false,
                temp = 0;
                arr = {};
            win.on('scroll',function(){
                self.throttle(function(){
                    var index = self.getMin();
                    var minH = self.arrT[index];
                    var iH = win.scrollTop() + win.innerHeight();
                    if(self.page > 1){
                        var maxH = self.cachePageData[1].height;
                        var maxT = self.cachePageData[self.page-1].top;
                    }
                    if(btn){
                        btn = iH <= temp;
                    }else{
                        btn = iH < temp;
                    }
                    temp = iH;
                    if(arr[self.page] == undefined){
                        arr[self.page] = minH;
                    }
                    if(arr[self.page] - 300 < iH && !btn && Math.ceil(self.total / self.limit) > self.page){
                        self.waterfall();
                    }
                    if(self.page > 1 && maxH+maxT > iH && btn){
                        self.waterfallretrn();
                    }
                },{context : self});
            })
        },
		loadList : function(){   //渲染生成列表
			var self = this;
            this.loading.removeClass('hide');
            this.toSort = _.isEmpty(this.toSort) ? undefined : this.toSort;
            this.toQuery = this.toQuery;
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
                var arr = res.data.beautiful_images;
                self.total = res.data.total;
                self.loading.addClass('hide');
                if(!!self.searchWord){
                    self.schmsg(self.searchWord,res['data'].total)
                    if(res.data.total == 0){
                        self.notData.removeClass('hide');
                        self.toQuery = {};
                        self.toSort = {};
                        self.searchWord = "";
                        self.toFrom = 0;
                        self.iBtn = true;
                        self.setMainHeight(0);
                        self.cachePageData = {};
                        self.getCols();
                        self.loadList();
                    }else{
                        self.cachePageData = {};
                        self.getCols();
                        if(arr.length <= self.limit){
                            self.notData2.removeClass('hide');
                            self.renderView(arr);
                        }
                    }
                }else{
                    if(!!res.data.total){
                        if(arr.length <= self.limit){
                            self.notData2.removeClass('hide');
                            self.renderView(arr);
                        }
                    }else{
                        self.notData2.removeClass('hide');
                        self.toQuery = {};
                        self.toSort = {};
                        self.searchWord = "";
                        self.toFrom = 0;
                        self.iBtn = true;
                        self.setMainHeight(0);
                    }
                }
            });
		},
        renderView : function(array){
            var self = this;
            if(this.cachePageData[this.page] != undefined){
                return ;
            }
            this.cachePageData[this.page] = {
                data : [],
                height : 0,
                top:0
            }
            var arr = array;
            var len = arr.length == this.limit ? this.limit : arr.length;
            for (var i = 0; i < len; i++) {
                this.createList(arr[i])
            };
            self.setMainHeight(self.arrT[self.getMax()]);
            var pext = self.page == 1 ? 0 : self.cachePageData[self.page - 1].height;
            self.cachePageData[self.page].height = self.arrT[self.getMax()] - pext;
            self.cachePageData[self.page].top = self.arrT[self.getMax()];
            self.iBtn = true;
        },
        waterfall : function(){
            if (!this.iBtn) {
                return ;
            }
            this.iBtn = false;
            this.page++;
            if( this.page > 2){
                var page = this.page - 2;
                this.list.find('li.new.page'+page).remove()
            }
            this.toFrom = (this.page-1)*this.limit;
            History.pushState({state:this.page}, "装修美图--互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 第 "+this.page+" 页", "?query="+encodeURI(this.searchWord)+this.jsonToStr(this.toQuery)+this.jsonToStr(this.toSort));
            if(this.cachePageData[this.page] != undefined){
                var data = this.cachePageData[this.page].data;
                for (var i = 0; i < this.limit; i++) {
                    this.createLi(data[i])
                };
                this.iBtn = true;
            }else{
               this.loadList();
            }
        },
        waterfallretrn : function(){
            if (!this.iBtn) {
                return ;
            }
            this.iBtn = false;
            --this.page;
            var page = this.page + 2;
            this.list.find('li.old.page'+page).remove()
            var data = this.cachePageData[this.page].data;
            for (var i = 0; i < this.limit; i++) {
                this.createLi(data[i])
                this.iBtn = true;
            };
            this.toFrom = (this.page-1)*this.limit;
            History.pushState({state:this.page}, "装修美图--互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 第 "+this.page+" 页", "?query="+encodeURI(this.searchWord)+this.jsonToStr(this.toQuery)+this.jsonToStr(this.toSort));
        },
        isWaterfall : function(){  //检测是否开启瀑布流
            if(_.isEmpty(this.toQuery) && _.isEmpty(this.searchWord)){
                this.bindEvent();
            }
        },
		createList  : function(data){      //创建列表
            var temp = {},
                self = this,
                iWidth = this.iWidth - 2,
                sTags = '',
                iHeight = parseInt(data.images[0].height) * ((iWidth) / data.images[0].width),
                imageid = data.images[0].imageid;
                _.assign(temp,data)
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
            var index = self.getMin();
                temp.left = self.arrL[index];
                temp.top = self.arrT[index];
            var arr = [
                '<li class="page'+self.page+' old" style="left: '+temp.left+'px; top: '+temp.top+'px;">',
                    '<div class="box">',
                        '<a href="/tpl/mito/detail.html?'+data._id+'" target="_blank" class="img">',
                            '<img src="/api/v2/web/thumbnail/289/'+imageid+'" style="width:'+iWidth+'px; height:'+iHeight+'px;" alt="'+data.title+'" />',
                        '</a>',
                        '<div class="txt">',
                            '<h4><a href="/tpl/mito/detail.html?'+data._id+'" target="_blank">'+data.title+'</a></h4>',
                        '<p>'+sTags+'</p></div>',
                    '</div>',
                    '<div class="shadow"><div class="noe"></div><div class="two"></div></div></li>'
            ]
            this.arrT[index] += iHeight + 84;
            this.list.append(arr.join(''));
            this.cachePageData[self.page].data.push(temp);
		},
        createLi : function(data){
            var iWidth = this.iWidth - 2,
                iHeight = parseInt(data.images[0].height) * ((iWidth) / data.images[0].width),
                imageid = data.images[0].imageid,
                sTags = '';
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
                '<li class="page'+this.page+' new" style="left: '+data.left+'px; top: '+data.top+'px;">',
                    '<div class="box">',
                        '<a href="/tpl/mito/detail.html?'+data._id+'" target="_blank" class="img">',
                            '<img src="/api/v2/web/thumbnail/289/'+imageid+'" style="width:'+iWidth+'px; height:'+iHeight+'px;" alt="'+data.title+'" />',
                        '</a>',
                        '<div class="txt">',
                            '<h4><a href="/tpl/mito/detail.html?'+data._id+'" target="_blank">'+data.title+'</a></h4>',
                        '<p>'+sTags+'</p></div>',
                    '</div>',
                    '<div class="shadow"><div class="noe"></div><div class="two"></div></div></li>'
            ]
            this.list.prepend(arr.join(''));
        },
        getViewHeight : function(){
            return $(window).height();
        },
        setMainHeight : function(num){
            this.content.height(num)
        },
        setDefault : function(defaultData){     //设置url参数默认值
            var self = this,
                oQuery = {},
                oSort = {},
                urlJson = this.strToJson(defaultData);
                this.toFrom = 0;  //设置分页初始化
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
            this.toQuery = oQuery;
            _.isEmpty(self.toQuery) || this.setQueryMin(self.toQuery);
            _.isEmpty(self.toQuery) || this.setQuery(self.toQuery);
            self.toSort = oSort;
            _.isEmpty(self.toSort) || this.setSort(self.toSort);
            this.loadList();    //加载数据
        },
        setQuery : function(query){     //设置筛选当前状态
        	var list = this.filter.find('.list');
            list.find('a').removeClass();
            if(query == undefined){
                list.find('dl').each(function(index, el) {
                    $(el).find('a').eq(0).addClass('current');
                });
                return ;
            }
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
                    '<dd>'+(query == undefined　||　query.section == undefined ? '不限' : query.section)+'</dd>',
                '</dl>',
                '<dl>',
                    '<dt>装修户型</dt>',
                    '<dd>'+(query == undefined　||　query.dec_house_types == undefined ? '不限' : globalData.house_type(query.dec_house_types))+'</dd>',
                '</dl>',
                '<dl>',
                    '<dt>擅长风格</dt>',
                    '<dd>'+(query == undefined　||　query.dec_styles == undefined ? '不限' : globalData.dec_style(query.dec_styles))+'</dd>',
                '</dl>',
                '<div class="minbtns">',
                    '<span href="javascript:;" class="more-btn"><span></span><i></i></span>',
                '</div>'
            ];
            this.filter.find('.min').html(arr.join(''))
        },
        setSort  : function(sort){    //设置排序当前状态
            this.sort.find('strong').attr('class', '');
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
            this.toQuery = filter;
            _.isEmpty(self.toQuery) || this.setQueryMin(self.toQuery);
            _.isEmpty(self.toQuery) || this.setQuery(self.toQuery);
            self.toSort = sort;
            _.isEmpty(self.toSort) || this.setSort(self.toSort);
            this.toFrom = 0;
            History.pushState({state:1}, "装修美图--互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 第1页", "?query="+encodeURI(self.searchWord)+self.jsonToStr(self.toQuery)+self.jsonToStr(self.toSort));
            this.getCols();
            self.isWaterfall();
            this.cachePageData = {};
            this.cacheData = [];
            this.notData.addClass('hide');
            self.notData2.addClass('hide');
            this.list.empty();
            this.isRenderView = false;
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
                History.pushState({state:1}, "装修美图--互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 第1页", "?");
                self.notData.addClass('hide');
                self.notData2.addClass('hide');
                self.setQueryMin();
                self.setQuery();
                self.setSort();
                self.cachePageData = {};
                self.getCols();
                self.list.empty();
                self.loadList();
                self.search.find('.input').val('搜索装修美图');
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
