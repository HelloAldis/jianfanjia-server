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
    search.init();
})
require(['jquery','lodash','lib/jquery.cookie','lib/jquery.history','utils/common','utils/page'],function($,_,cookie,history,common,Pageing){
    var goto = new common.Goto();
    var page = new Pageing();
    var Article = function(){};
    Article.prototype = {
        init : function(){
            var History = window.History;
            this.cacheData = {}; //全局数据缓存
            this.winHash = window.location.search.split("?")[1];
            this.status = !this.winHash ? -1 : this.strToJson(this.winHash).status == undefined ? -1 : this.strToJson(this.winHash).status;
            this.toFrom = !this.winHash ? 0 : (parseInt(this.strToJson(this.winHash).page) - 1)*5;
            this.article = $("#j-article");
            this.filter = this.article.find('.m-filter');
            this.list = this.article.find('.m-list');
            this.ul = this.list.find('ul');
            this.notData = this.article.find('.k-notData');
            this.loading = this.article.find('.k-loading');
            this.hot();
            this.loadList();
            this.setfilter();
            this.getfilter();
            goto.init();
            this.top = this.list.offset().top;
        },
        hot : function(){
            var self = this;
            $.ajax({
                url:RootUrl+'api/v2/web/top_articles',
                type: 'POST',
                contentType : 'application/json; charset=utf-8',
                dataType: 'json',
                data : JSON.stringify({
                    "limit":3
                }),
                processData : false
            })
            .done(function(res) {
                if(res.data.dec_strategies.length > 0){
                    self.slidepic(res.data.dec_strategies);
                }
                if(res.data.dec_tips.length > 0){
                    self.hotposts(res.data.dec_tips);
                }
            })
        },
        slidepic : function(data){
            var self = this,
                $slidepic = this.article.find('.slidepic'),
                len = data.length,
                aBtn,oUl,
                iLiW = $slidepic.width(),
                iNum = 0,
                iTimer = null;
                arr = ['<div class="pic"><ul>'];
                for (var i = 0; i < len; i++) {
                    arr.push('<li><a href="/tpl/article/detail.html?pid='+data[i]._id+'" target="_blank"><div><strong>'+data[i].title+'</strong><span>'+_.trunc(data[i].description, {'length': 45})+'</span></div><img src="/api/v2/web/thumbnail2/820/348/'+data[i].cover_imageid+'" alt="'+data[i].title+'"></li>');
                };
                arr.push('</ul></div><ol>');
                for (var i = 0; i < len; i++) {
                    arr.push('<li '+(i == 0 ? 'class="active"' : '')+'></li>');
                };
                arr.push('</ol>');
                $slidepic.html(arr.join(''));
                aBtn = $slidepic.find('ol').find('li');
                oUl = $slidepic.find('ul');
                aBtn.on('click',function(){
                    iNum = $(this).index();
                    move();
                });
                function move(){
                    aBtn.eq(iNum).attr('class', 'active').siblings().attr('class', '');
                    oUl.animate({left: -iLiW*iNum});
                };
                function auto(){
                    iNum++;
                    iNum %= len;
                    move()
                }
                iTimer = setInterval(auto, 8000);
                $slidepic.hover(function() {
                    clearInterval(iTimer)
                }, function() {
                    clearInterval(iTimer)
                    iTimer = setInterval(move, 8000);
                });
        },
        hotposts : function(data){
            var self = this,
                $hotposts = this.article.find('.hotposts'),
                arr = ['<ul>'];
                for (var i = 0,len = data.length; i < len; i++) {
                    arr.push('<li '+(i == 2 ? 'class="last"' : '')+'><h4><a href="/tpl/article/detail.html?pid='+data[i]._id+'" target="_blank" title="'+data.title+'">'+data[i].title+'</a></h4><p>'+data[i].description+'</p></li>');
                };
                arr.push('</ul>');
                $hotposts.html(arr.join(''));
        },
        loadList  : function(){
            var self = this;
            this.ul.empty();
            page.destroy();
            this.loading.removeClass('hide');
            this.notData.addClass('hide');
            $.ajax({
                url:RootUrl+'api/v2/web/search_article',
                type: 'POST',
                contentType : 'application/json; charset=utf-8',
                dataType: 'json',
                data : JSON.stringify({
                    "query":{
                        "articletype": self.status == -1 ? undefined : self.status+''
                    },
                    "sort":{
                        "create_at":-1
                    },
                    "from":self.toFrom,
                    "limit":9
                }),
                processData : false
            })
            .done(function(res) {
                self.loading.addClass('hide');
                if(!!res.data.total){
                    self.page(res.data)
                }else{
                    self.notData.removeClass('hide');
                }
            })
        },
        createList  :  function(data,i){
            return arr = [
                   ' <li '+(i%3 == 0 ? 'class="first"' : '')+'>',
                        '<a href="/tpl/article/detail.html?pid='+data._id+'" class="img" target="_blank"><img src="/api/v2/web/thumbnail2/388/165/'+data.cover_imageid+'" alt="'+data.title+'"></a>',
                        '<h4><a href="/tpl/article/detail.html?pid='+data._id+'" target="_blank" title="'+data.title+'">'+data.title+'</a></h4>',
                        '<p>'+_.trunc(data.description, {'length': 40})+'</p>',
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
                History.pushState({state:1}, "装修攻略--互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 第1页", "?page=1&status="+self.status);
                self.loadList();
            })
        },
        page  : function(arr){
            var self = this,
                maxElem =  Math.ceil(arr.total/9),
                current = !History.getState().url.split("?")[1] ? 0 : parseInt(this.strToJson(History.getState().url.split("?")[1]).page) - 1;
                if(current+1 > maxElem){
                    History.pushState({state:1}, "装修攻略--互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 第1页", "?page=1&status="+self.status);
                    this.toFrom = 0;
                    self.loadList();
                    return false;
                }
            page.init({
                allNumPage : arr.total,
                itemPage : 9,
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
                    for(var i=0;i<arr.articles.length;i++){
                        dataArr.push(self.createList(arr.articles[i],i));
                    }
                    self.ul.html(dataArr);
                    obj.find('.btns').on('click',function(ev){
                        ev.preventDefault();
                        if($(this).hasClass('current')){
                            return ;
                        }
                        self.top = self.list.offset().top;
                        var index = $(this).attr("href").match(/\d+(\.\d+)?/g)[0]
                        self.toFrom = (index-1)*9;
                        History.pushState({state:index}, "装修攻略--互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 第 "+index+" 页", "?page="+index+'&status='+self.status);
                        $('html,body').animate({scrollTop: self.top}, 500);
                        self.loadList();
                        return false;
                    });
                }
            });
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
        },
        ellipsis : function(string,length){
            function getLength(str) {
               var realLength = 0, len = str.length, charCode = -1;
                for (var i = 0; i < len; i++) {
                   charCode = str.charCodeAt(i);
                   if (charCode >= 0 && charCode <= 128) realLength += 1;
                   else realLength += 2;
                }
                return realLength;
            }
            function cutstr(str, len) {
                var str_length = 0,
                    str_cut = new String(),
                    str_len = str.length;
                for (var i = 0; i < str_len; i++) {
                    var a = str.charAt(i);
                    str_length++;
                    if (escape(a).length > 4) {
                        str_length++;
                    }
                    str_cut = str_cut.concat(a);
                    if (str_length >= len) {
                        str_cut = str_cut.concat("...");
                        return str_cut;
                    }
                }
                if (str_length < len) {
                    return str;
                }
            }
            if(getLength(string) > length) {
                return cutstr(string, length);
            }else{
                return string;
            }
        }
    };
    var article = new Article();
    article.init();
});
