require.config({
    baseUrl: '/static/js/',
    paths  : {
        jquery: 'lib/jquery',
        lodash : 'lib/lodash',
        cookie : 'lib/jquery.cookie'
    }
});
require(['jquery','lodash','cookie','utils/common','utils/globalData'],function($,_,cookie,common,globalData){
        var user = new common.User();
        user.init();
        var search = new common.Search();
        search.init();
        var goto = new common.Goto();
        goto.init();
        var Detail = function(){};
        Detail.prototype = {
            init  : function(){
                var pathname = window.location.pathname;
                var filename = pathname.indexOf('/tpl/interviews/') != -1 ? pathname.substring(pathname.lastIndexOf('/') + 1) : undefined;
                this.cacheData = {}; //全局数据缓存
                this.winHash = !!filename && filename.indexOf('.html') != -1 ? filename.split(".html")[0] : undefined;
                this.detail = $("#j-interviews");
                this.loadList();
            },
            loadList : function(){
                var self = this;
                $.ajax({
                    url:'/api/v2/web/designer_home_page',
                    type: 'POST',
                    contentType : 'application/json; charset=utf-8',
                    dataType: 'json',
                    data : JSON.stringify({
                        "_id": self.winHash
                    }),
                    processData : false
                })
                .done(function(res) {
                    if(res.data != null){
                        self.createInfo(res.data);
                    }
                })
                .fail(function() {
                   window.location.href = '/404.html'
                });
            },
            createInfo  :  function(data){
                var str = '<a href="/tpl/designer/'+data._id+'" class="u-head u-head-radius">\
                            <img src="/api/v2/web/thumbnail2/120/120/'+data.imageid+'" alt="'+data.username+'">\
                          </a>\
                          <h3>'+data.username+'</h3>\
                          <address><i class="iconfont2">&#xe61f;</i>';
                    if(!!data.province){
                        str += data.province+'&nbsp;&nbsp;&nbsp;';
                    }
                    if(!!data.city){
                        str += data.city;
                    }
                    str += '</address>\
                            <dl>\
                                <dt>接单类型</dt>\
                                <dd>'
                    for(var i=0; i<data.dec_types.length; i++){
                        str += '<span>'+globalData.dec_type(data.dec_types[i])+'</span>';
                    }
                    str += '</dd><dt>接单户型</dt><dd>';
                    for(var i=0; i<data.dec_house_types.length; i++){
                        str += '<span>'+globalData.house_type(data.dec_house_types[i])+'</span>';
                    }
                    str += '</dd><dt>设计风格</dt><dd>';
                    for(var i=0; i<data.dec_styles.length; i++){
                        str += '<span>'+globalData.dec_style(data.dec_styles[i])+'</span>';
                    }
                    str += '</dd></dl><div class="btns"><a href="/tpl/designer/'+data._id+'" class="u-btns">查看设计师主页</a></div>';
                    this.detail.html( str );
            },
        };
        var detail = new Detail();
        detail.init();
});
