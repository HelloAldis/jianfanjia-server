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
require(['jquery','lodash','lib/jquery.cookie','lib/jquery.history','utils/user','utils/search','utils/page','utils/goto'],function($,_,cookie,history,User,Search,Pageing,Goto){
        var user = new User();
        user.init();
        var History = window.History;
        var search = new Search();
        search.init({
            id     : '#j-sch',
            urlAPI : [
                {
                    title : '设计师',
                    url   : '/tpl/design/index.html',
                    api   : 'api/v2/web/designer/search'
                },
                {
                    title : '装修美图',
                    url   : '/tpl/mito/index.html',
                    api   : 'api/v2/web/search_beautiful_image'
                }
            ]
        })
        var goto = new Goto();
        var page = new Pageing();
        var Live = function(){};
        Live.prototype = {
            init  : function(){
                this.cacheData = {}; //全局数据缓存
                this.winHash = window.location.search.split("?")[1];
                this.status = !this.winHash ? -1 : this.strToJson(this.winHash).status == undefined ? -1 : this.strToJson(this.winHash).status;
                this.toFrom = !this.winHash ? 0 : (parseInt(this.strToJson(this.winHash).page) - 1)*5;
                this.live = $("#j-live");
                this.filter = this.live.find('.m-filter');
                this.list = this.live.find('.m-list');
                this.ul = this.list.find('ul');
                this.loadList();
                this.setfilter();
                this.getfilter();
                goto.init();
                this.top = this.list.offset().top;
            },
            loadList : function(){
                var self = this;
                $.ajax({
                    url:RootUrl+'api/v2/web/search_share',
                    type: 'POST',
                    contentType : 'application/json; charset=utf-8',
                    dataType: 'json',
                    data : JSON.stringify({
    					"query":{
                            'progress' : self.status == -1 ? undefined : self.status+''
                        },
    					"from":self.toFrom,
    					"limit":5
					}),
                    processData : false
                })
                .done(function(res) {
                	if(!!res.data.total){
                        self.page(res.data)
                	}else{
                        self.ul.html('暂时没有已完成的');
                        page.destroy();
                    }
                })
            },
            createList  :  function(data){
            	var process = data.process[data.process.length-1].name
                return arr = [
                        '<li>',
                            '<a href="/tpl/live/detail.html?'+data._id+'" class="img"><img src="/api/v2/web/thumbnail/500/'+data.cover_imageid+'" alt="'+data.cell+'"></a>',
                            '<div class="txt">',
                                '<h4><a href="/tpl/live/detail.html?'+data._id+'">'+data.cell+'</a></h4>',
                                '<p><span>面积：'+data.house_area+'m&sup2;</span><span>户型：'+globalData.house_type(data.house_area)+'</span><span>风格：'+globalData.dec_style(data.dec_style)+'</span></p>',
                                '<div class="time">',
                                    '<span>开工时间</span><time>'+this.format(data.create_at , 'yyyy年MM月dd日')+'</time>',
                                '</div><div class="f-cb"></div>',
                                '<div class="info">',
                                    '<a href="/tpl/design/home.html?'+data.designer._id+'" class="head"><img src="/api/v1/thumbnail/40/'+data.designer.imageid+'" alt="'+data.designer.username+'"></a>',
                                    '<a href="/tpl/design/home.html?'+data.designer._id+'" class="name"><strong>'+data.designer.username+'</strong></a>',
                                    '<span class="auth"><i class="iconfont" title="实名认证">&#xe634;</i><i class="iconfont" title="认证设计师">&#xe62a;</i></span>',
                                '</div>',
                            '</div>',
                            '<div class="progress">',
                                '<div class="in in'+process+'">'+globalData.dec_flow(process)+'</div>',
                            '</div>',
                        '</li>'
                    ].join('');
            },
            setfilter   : function(){
                var self = this;
                this.filter.find('a').each(function(i,el){
                    if($(el).data('filter') == self.status){
                       $(el).attr('class', 'current').siblings().attr('class','');
                    }
                })
            },
            getfilter    :  function(){
            	var self = this;
            	this.filter.delegate('a','click',function(ev){
                    ev.preventDefault();
                    $(this).attr('class', 'current').siblings().attr('class','');
                    self.toFrom = 0;
                    self.status = $(this).data('filter');
                    History.pushState({state:1}, "装修直播--互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 第1页", "?page=1&status="+self.status);
                    self.loadList();
                })
            },
            page  : function(arr){
                var self = this,
                    maxElem =  Math.ceil(arr.total/5),
                    current = !History.getState().url.split("?")[1] ? 0 : parseInt(this.strToJson(History.getState().url.split("?")[1]).page) - 1;
                    if(current+1 > maxElem){
                        History.pushState({state:1}, "装修直播--互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 第1页", "?page=1&status="+self.status);
                        this.toFrom = 0;
                        self.loadList();
                        return false;
                    }
                page.init({
                    allNumPage : arr.total,
                    itemPage : 5,
                    showPageNum : 9,
                    endPageNum : 1,
                    currentPage : current,
                    prevText:"上一页",
                    nextText:"下一页",
                    linkTo : '__id__',
                    showUbwz : true,
                    callback : function(num,obj){
                        self.ul.html('');
                        var dataArr = [];
                        for(var i=0;i<arr.shares.length;i++){
                            dataArr.push(self.createList(arr.shares[i]));
                        }
                        self.ul.html(dataArr);
                        obj.find('.btns').on('click',function(ev){
                            ev.preventDefault();
                            if($(this).hasClass('current')){
                                return ;
                            }
                            var index = $(this).attr("href").match(/\d+(\.\d+)?/g)[0]
                            self.toFrom = (index-1)*5;
                            History.pushState({state:index}, "装修直播--互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 第 "+index+" 页", "?page="+index+'&status='+self.status);
                            $('html,body').animate({scrollTop: self.top}, 500);
                            self.loadList();
                            return false;
                        });
                    }
                });
            },
            format : function(date,format){
            	var time = new Date(date),
            		o = { 
            			"M+" : time.getMonth()+1, //month 
            			"d+" : time.getDate(), //day 
            			"h+" : time.getHours(), //hour 
            			"m+" : time.getMinutes(), //minute 
            			"s+" : time.getSeconds(), //second 
            			"q+" : Math.floor((time.getMonth()+3)/3), //quarter 
            			"S" : time.getMilliseconds() //millisecond 
            		};
            	if(/(y+)/.test(format)) { 
            	format = format.replace(RegExp.$1, (time.getFullYear()+"").substr(4 - RegExp.$1.length)); 
            	} 
            	for(var k in o) { 
            		if(new RegExp("("+ k +")").test(format)) { 
            			format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
            		} 
            	} 
            	return format; 
            },
            strToJson : function(str){
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
            jsonToStr : function (json){
                var str = '';
                for (var i in json) {
                    str += '&'+i+'='+json[i]
                };
                return str;
            }
        }
        var live = new Live();
        live.init();
})