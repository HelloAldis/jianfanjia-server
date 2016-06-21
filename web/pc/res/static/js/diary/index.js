require.config({
    baseUrl: '/static/js/',
    paths  : {
        jquery: 'lib/jquery',
        lodash : 'lib/lodash',
        lazyload : 'lib/lazyload',
        cookie : 'lib/jquery.cookie',
        history : 'lib/jquery.history',
    },
    shim   : {
        'history': {
            deps: ['jquery']
        }
    }
});
require(['jquery','lazyload'],function($){
    $(function(){
        $("img.lazyimg").lazyload({
            effect : "fadeIn"
        });
    });
});
require(['jquery','lodash','cookie','utils/common'],function($,_,cookie,common){
    var user = new common.User();
    user.init();
    var search = new common.Search();
    search.init();
    var goto = new common.Goto();
    goto.init();
})
require(['jquery','lodash','cookie','history','utils/common','utils/page','utils/globalData'],function($,_,cookie,history,common,Pageing,globalData){
    var page = new Pageing();
    var Diary = function(){

    }
    Diary.prototype = {
        init : function(){
            var History = window.History;
            this.winHash = window.location.search.split("?")[1];   //获取URL参数，操作上下文
            this.cookie = $.cookie('usertype');
            this.toFrom = 0;  //搜索分页起始位置
            this.limit = 10;  //获取列表条数
            this.diary = $('#j-diary');
            this.list = this.diary.find('.m-diary-list');
            this.top = this.diary.offset().top+20;   //获取列表top，供分页切换跳转列表顶部位置
            this.loading = this.diary.find('.k-loading');    //获取数据加载元素
            if(this.cookie === '1'){
                this.add = this.diary.find('.m-diary-add');
                this.addDiary();
            }else{
                this.diary.find('.create-diary').attr('href', '/tpl/user/login.html?/tpl/user/owner.html#/diary/add/');
            }
            if(!!this.winHash){       //获取URL参数,设置默认值
                this.setDefault(this.winHash);
            }else{
               this.loadList();    //加载数据
            }
            this.hot(5);
        },
        addDiary : function(){
            var _this = this;
            var $write = $('<div class="m-write"><i class="iconfont">&#xe629;</i>&nbsp;&nbsp;写日记</div>');
            var $edit = $('<div class="m-edit"></div>');
            var html = '<div class="m-edit-header">\
                            <textarea rows="10" name="content" class="addContent"></textarea>\
                        </div>\
                        <div class="m-edit-body">\
                        </div>\
                        <div class="m-edit-footer">\
                        </div>';
            $edit.html(html);
            var data = [];
            $.ajax({
                url: '/api/v2/web/my_diary_set',
                type: 'POST',
                dataType: 'json',
                contentType : 'application/json; charset=utf-8',
                processData : false
            })
            .done(function(res) {
                if(!!res.data.diarySets.length){
                    data = res.data.diarySets;
                }
                _this.add.append($write).show();
            })
            .fail(function(error) {
                console.log(error);
            });
            this.add.on('click','.m-write',function(event){   //添加一条动态
                if(!data.length){
                    window.location.href = '/tpl/user/owner.html#/diary/add/';
                }else{
                    console.log(data)
                   $(this).hide();
                    _this.add.append($edit);
                }
            });
        },
        setDefault : function(defaultData){     //设置url参数默认值
            var self = this,
                urlJson = this.strToJson(defaultData);
                current = urlJson.page != undefined ? parseInt(urlJson.page)-1 : 0;
            this.toFrom = current*this.limit;  //设置分页初始化
            this.loadList();    //加载数据
        },
        loadList : function(time){
            var _this = this;
            this.list.empty();
            page.destroy();
            this.loading.removeClass('hide');
            var query = {
                    "create_at" : {
                        "$gt" : time
                    }
                };
            var oldData = {"from":this.toFrom,"limit":this.limit}
            $.ajax({
                url: '/api/v2/web/search_diary',
                type: 'POST',
                dataType: 'json',
                contentType : 'application/json; charset=utf-8',
                data : JSON.stringify(oldData),
                processData : false
            })
            .done(function(res) {
                _this.loading.addClass('hide');
                if(!!res.data.total){
                    _this.page(res.data)
                }
            })
            .fail(function(error) {
                console.log(error);
            });
        },
        page : function(arr){
            var self = this,
                maxElem =  Math.ceil(arr.total/5),
                current = !History.getState ? !this.winHash ? 0 : (parseInt(this.strToJson(this.winHash).page) - 1) : !History.getState().url.split("?")[1] ? 0 : parseInt(this.strToJson(History.getState().url.split("?")[1]).page) - 1;
                if(current+1 > maxElem){
                    History.pushState({state:1}, "装修日志--互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 第1页", "?page=1");
                    this.toFrom = 0;
                    self.loadList();
                    return false;
                }
            page.init({
                allNumPage : arr.total,
                itemPage : 10,
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
                    for(var i=0,len = arr.diaries.length;i<len;i++){
                        dataArr.push(self.createList(arr.diaries[i]));
                    }
                    self.list.html(dataArr);
                    obj.find('.btns').on('click',function(ev){
                        ev.preventDefault();
                        if($(this).hasClass('current')){
                            return ;
                        }
                        var index = $(this).attr("href").match(/\d+(\.\d+)?/g)[0];
                        self.toFrom = (index-1)*self.limit;
                        History.pushState({state:index}, "装修日志--互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 第 "+index+" 页", "?page="+index);
                        $('html,body').animate({scrollTop: self.top}, 500);
                        self.loadList();
                        return false;
                    });
                }
            });
        },
        suolve : function ( str ){
            var sub_length = 242;
            var temp1 = str.replace(/[^\x00-\xff]/g,"**");//精髓
            var temp2 = temp1.substring(0,sub_length);//找出有多少个*
            var x_length = temp2.split("\*").length - 1 ;
            var hanzi_num = x_length /2 ;
            sub_length = sub_length - hanzi_num ;//实际需要sub的长度是总长度-汉字长度
            var res = str.substring(0,sub_length);
            if(sub_length < str.length ){
            var end =res+"…" ;
            }else{
            var end = res ;
            }
            return end ;
        },
        createList  : function(data){      //创建列表
            var imgBox = '',title;
            if(!!data.images.length){
                var img = '';
                var imgLen = data.images.length > 5 ? 5 : data.images.length;
                for (var i = 0; i < imgLen; i++) {
                    img += '<img src="/api/v2/web/thumbnail2/160/160/'+data.images[i].imageid+'" alt="">'
                }
                var imgTips = !data.images.length ? '' : '<span class="tag">共'+data.images.length+'张</span>';
                imgBox = '<div class="img">'+imgTips+img+'</div>';
            }
            try{
                title = data.diarySet.title;
                imageid = '/api/v2/web/thumbnail2/34/34/'+data.author.imageid
                username = data.author.username || '简繁家业主';
            }catch(e){
                imageid = '';
                username = '简繁家业主';
            }
            var arr = [
                '<section class="m-list">',
                    '<header class="m-header f-cb">',
                        '<div class="info f-fl">',
                            '<h4><a href="/tpl/diary/book/'+data.diarySetid+'">'+title+'</a></h4>',
                        '</div>',
                        '<div class="label f-fr">'+data.section_label+'阶段</div>',
                    '</header>',
                    '<section class="m-body">',
                        imgBox,
                        '<p class="text">'+this.suolve(data.content)+'</p>',
                    '</section>',
                    '<footer class="m-footer f-cb">',
                        '<div class="f-fl author">',
                            '<img src="'+imageid+'" alt="'+username+'">',
                            '<strong>'+username+'</strong>',
                            '<span>发布于</span>',
                            '<time>'+this.format(data.create_at,'yyyy年MM月dd日 hh:mm')+'</time>',
                        '</div>',
                        '<div class="f-fr count">',
                            '<span class="view">'+ data.view_count+'</span>',
                            '<span class="favorite">'+data.favorite_count+'</span>',
                            '<span class="comment">'+data.comment_count+'</span>',
                        '</div>',
                    '</footer>',
                '</section>',
            ];
            return arr.join('');
        },
        hot : function(num){
            var oUl = this.diary.find('.m-diary-hot ul');
            $.ajax({
                url: '/api/v2/web/top_diary_set',
                type: 'POST',
                dataType: 'json',
                contentType : 'application/json; charset=utf-8',
                data : JSON.stringify({
                    "limit" : num
                }),
                processData : false
            })
            .done(function(res) {
                if(!!res.data.length){
                    create(res.data);
                }
            })
            .fail(function(error) {
                console.log(error);
            });
            function create(data){
                var str = '';
                _.forEach(data,function(v, k){
                    var img = v.cover_imageid !== undefined ? '/api/v2/web/thumbnail2/220/85/'+v.cover_imageid : '/static/img/diary/covers-default.jpg';
                    str += '<li>\
                    <h4 class="title"><a href="/tpl/diary/book/'+v._id+'">'+v.title+'</a></h4>\
                    <p class="tag">\
                        <span>'+v.house_area+'m&sup2;</span><i>|</i>\
                        <span>'+globalData.house_type(v.house_type)+'</span><i>|</i>\
                        <span>'+globalData.dec_style(v.dec_style)+'</span><i>|</i>\
                        <span>'+globalData.work_type(v.work_type)+'</span>\
                    </p>\
                    <a href="/tpl/diary/book/'+v._id+'" class="img">\
                        <img src="'+img+'" />\
                    </a>\
                    <div class="count">\
                        <span class="view">'+v.view_count+'</span>\
                    </div>\
                </li>'
                });
                oUl.html(str);
            }
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
    var diary = new Diary;
    diary.init();
});
