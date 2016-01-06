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
        'jquery.requestAnimationFrame.min': {
            deps: ['jquery']
        },
        'jquery.fly.min': {
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
require(['jquery','lib/jquery.cookie','utils/common','lib/jquery.requestAnimationFrame.min','lib/jquery.fly.min'],function($,cookie,common){
        var user = new common.User();
        var goto = new common.Goto();
        var Detail = function(){};
        Detail.prototype = {
            init  : function(){
                this.cacheData = {}; //全局数据缓存
                this.winHash = window.location.search.substring(1);
                this.detail = $("#j-detail");
                this.main = this.detail.find('.g-mn');
                this.side = this.detail.find('.g-sd');
                this.loading = this.detail.find('.k-loading');
                this.usertype = $.cookie("usertype");
                this.loadList();
            },
            loadList : function(){
                var self = this;
                $.ajax({
                    url:RootUrl+'api/v2/web/product_home_page',
                    type: 'POST',
                    contentType : 'application/json; charset=utf-8',
                    dataType: 'json',
                    data : JSON.stringify({
                        "_id": self.winHash
                    }),
                    processData : false
                })
                .done(function(res) {
                    self.loading.addClass('hide');
                    if(res.data != null){
                        self.loadInfo(res.data.designer._id);
                        self.createProduct(res.data);
                    }
                })
                .fail(function() {
                   window.location.href = '/404.html'
                });
            },
            createProduct : function(data){
                var arr = [
                        '<div class="m-detail-product">',
                            '<div class="m-tt">',
                                '<h2>'+data.cell+'</h2>',
                                '<a href="javascript:;" class="u-btns u-btns-revise favorite">'+(data.is_my_favorite ? '取消收藏' : '收藏作品')+'</a>',
                            '</div>',
                           ' <div class="m-ct">',
                                '<div class="info">',
                                    '<ul>',
                                        '<li>参考造价：'+data.total_price+'万</li>',
                                        '<li>包工类型：'+globalData.work_type(data.work_type)+'</li>',
                                        '<li>空间：'+globalData.house_type(data.house_type)+'</li>',
                                        '<li>面积：'+data.house_area+'平米</li>',
                                        '<li>设计风格：'+globalData.dec_style(data.dec_style)+'</li>',
                                        '<li class="last">浏览数：'+data.view_count+'</li>',
                                    '</ul>',
                                    '<div class="description">',
                                        '<span class="sub"></span><span class="sup"></span>',
                                        '<p>设计思路：'+data.description+'</p>',
                                    '</div>',
                                '</div>',
                                '<div class="images">'
                    ];
                    for (var i = 0 , len = data.images.length; i < len; i++) {
                        arr.push('<section><h3>'+data.images[i].section+'</h3><img src="/api/v2/web/watermark/880/'+data.images[i].imageid+'" alt="" />'+(!!data.images[i].description ? '<p>'+data.images[i].description+'</p>' : "")+'</section>')
                    };
                    arr.push('</div></div></div>');
                    this.main.html(arr.join('')).removeClass('hide');
                    this.favorite(data._id);
            },
            loadInfo : function(id){
                var self = this;
                $.ajax({
                    url:RootUrl+'api/v2/web/designer_home_page',
                    type: 'POST',
                    contentType : 'application/json; charset=utf-8',
                    dataType: 'json',
                    data : JSON.stringify({
                        "_id" : id
                    }),
                    processData : false
                })
                .done(function(res) {
                    self.createInfo(res.data)
                })
                .fail(function() {
                   window.location.href = '/404.html'
                });
            },
            createInfo  :  function(data){
                var arr = [
                        '<div class="m-detail-info f-tac">',
                            '<a class="head" href="/tpl/design/home.html?'+ data._id +'">',
                                '<img src="/api/v2/web/thumbnail/96/'+ data.imageid +'" alt="'+ data.username +'">',
                            '</a>',
                            '<h4><a href="/tpl/design/home.html?'+ data._id +'">'+ data.username +'</a></h4>',
                            '<div class="auth">',
                                '<i class="iconfont" title="实名认证">&#xe634;</i><i class="iconfont" title="认证设计师">&#xe62a;</i>',
                            '</div>',
                            '<div class="service f-cb">',
                                '<dl class="f-fl"><dt>'+ data.authed_product_count +'</dt><dd>作品</dd></dl>',
                                '<dl class="f-fl"><dt>'+ data.order_count +'</dt><dd>预约</dd></dl>',
                            '</div>'
                    ];
                    if(this.usertype == 1 || this.usertype == undefined){
                        if(data.is_my_favorite){
                            arr.push('<div class="btns"><a href="/tpl/user/owner.html#/designer" class="u-btns u-btns-revise">已添加</a></div>');
                        }else{
                            arr.push('<div class="btns"><a href="javascript:;" class="u-btns addIntent" data-uid="'+data._id+'">添加意向</a></div>');
                        }
                    }
                    arr.push('</div>');
                    this.side.html(arr.join('')).removeClass('hide');
                    goto.init({
                        shop : true
                    })
                    this.addIntent();
            },
            favorite  : function(id){
                var self = this;
                this.main.delegate('.favorite','click',function(ev){
                    ev.preventDefault();
                    var This = $(this);
                    if(self.usertype == undefined){
                        window.location.href = '/tpl/user/login.html?'+window.location.href;
                    }else{
                        if(This.html() == '收藏作品'){
                            favorite('add',function(res){
                                if(res['msg'] === "success"){
                                    This.html('取消收藏');
                                }
                            })
                        }else{
                            if(confirm("你确定要取消收藏吗？")){
                                favorite('delete',function(res){
                                    if(res['msg'] === "success"){
                                        This.html('收藏作品');
                                    }
                                })
                            }
                        }
                    }
                })
                function favorite(state,fn){
                    $.ajax({
                        url:RootUrl+'api/v2/web/favorite/product/'+state,
                        type: 'POST',
                        contentType : 'application/json; charset=utf-8',
                        dataType: 'json',
                        data : JSON.stringify({
                            "_id": id
                        }),
                        processData : false
                    })
                    .done(function(res) {
                        fn(res)
                        user.updateData();
                    });
                }
            },
            addIntent : function(){
                var self = this,
                    off = true;
                this.side.delegate('.addIntent','click',function(ev){
                    ev.preventDefault();
                    if(!off){
                        return ;
                    }
                    off = false;
                    var This = $(this),
                        addOffset = goto.offset();
                    if(self.usertype === '1'){
                        var uidname = $(this).data('uid'),
                            head = self.side.find('.head'),
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
                                This.html('已添加').attr('href','/tpl/user/owner.html#/designer').removeClass('addIntent').addClass('u-btns-revise');
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
                        window.location.href = '/tpl/user/login.html?/tpl/design/detail.html?'+self.winHash
                    }
                });
            }
        }
        var detail = new Detail();
        detail.init();
})
