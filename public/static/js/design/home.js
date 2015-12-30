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
require(['jquery','lib/jquery.cookie','utils/common','utils/page','lib/jquery.requestAnimationFrame.min','lib/jquery.fly.min'],function($,cookie,common,Page){
        var goto = new common.Goto;
        var Home = function(){};
        Home.prototype = {
            init  : function(){
                this.cacheData = {}; //全局数据缓存
                this.winHash = window.location.search.substring(1);
                this.home = $("#j-home");
                this.info = this.home.find('.m-home-info');
                this.service = this.home.find('.m-home-service');
                this.product = this.home.find('.m-home-product');
                this.loading = this.home.find('.k-loading');
                this.usertype = $.cookie("usertype");
                this.toFrom = 0;
                this.total = 0;
                this.loadInfo();
            },
            loadInfo : function(){
                var self = this;
                $.ajax({
                    url:RootUrl+'api/v2/web/designer_home_page',
                    type: 'POST',
                    contentType : 'application/json; charset=utf-8',
                    dataType: 'json',
                    data : JSON.stringify({
                        "_id" : self.winHash
                    }),
                    processData : false
                })
                .done(function(res) {
                    self.loading.addClass('hide');
                    self.createInfo(res.data)
                })
                .fail(function() {
                   window.location.href = '/404.html'
                });
            },
            createInfo  :  function(data){
                var self = this,
                    numStar = Math.round((data.respond_speed ? data.respond_speed : 0 + data.service_attitude ? data.service_attitude : 0)/2),
                    numStar = numStar >= 5 ? 5 : numStar,
                    strStar = '<span class="star">',
                    arr = ['<div class="banner">'];
                    /*if(this.usertype == 2 && !data.big_imageid){
                        arr.push('<div class="change"><a href="/tpl/user/designer.html#/infor"><strong><i class="iconfont2">&#xe61a;</i></strong><span>请更改您的背景图片</span></a></div>')
                    }else if(this.usertype == 2 && data.big_imageid){
                        arr.push('<div class="change" style="background:url(/api/v2/web/thumbnail/1190/'+data.big_imageid+')"><a href="/tpl/user/designer.html#/infor"><strong><i class="iconfont2">&#xe61a;</i></strong><span>请更改您的背景图片</span></a></div>')
                    }else if(!data.big_imageid){
                        arr.push('<div class="not"><h3>简繁家</h3><p>解决您的装修烦恼</p></div>')
                    }else{
                        arr.push('<img src="/api/v2/web/thumbnail/1190/'+data.big_imageid+'" alt="'+data.username+'个人主页" />')
                    }*/
                    //暂时设计师背景图功能未做
                    arr.push('<div class="not"><h3>简繁家</h3><p>解决您的装修烦恼</p></div>')
                    arr.push('</div><div class="info"><div class="head"><span><img src="/api/v2/web/thumbnail/1190/'+data.imageid+'" alt="'+data.username+'" /></span></div>')
                    arr.push('<dl><dt><strong>'+data.username+'</strong>');
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
                    arr.push('<dd class="f-cb"><span><i class="iconfont2">&#xe61f;</i> '+ data.province +' '+ data.city +'</span></dd>');
                    arr.push('<dd class="f-cb"><p>'+ data.philosophy+'</p></dd></dl>');
                    if(this.usertype == 1 || this.usertype == undefined){
                        if(data.is_my_favorite){
                            arr.push('<div class="btns"><a href="/tpl/user/owner.html#/designer" class="u-btns u-btns-revise">已添加</a></div>');
                        }else{
                            arr.push('<div class="btns"><a href="javascript:;" class="u-btns addIntent" data-uid="'+data._id+'">添加意向</a></div>');
                        }
                    }
                    arr.push('</div><div class="service f-cb"><div class="f-fl">');
                    arr.push('<dl><dt>'+data.authed_product_count+'</dt><dd>作品</dd></dl>');
                    arr.push('<dl><dt>'+data.order_count+'</dt><dd>预约</dd></dl></div>');
                    arr.push('<h4 class="f-fr"><em>设计费</em><strong>'+globalData.price_area(data.design_fee_range)+'</strong>元/m&sup2;</h4></div>');
                    this.info.html(arr.join('')).removeClass('hide');
                    this.createService(data);
            },
            createService : function(data){
                var service = [
                        {
                            'sclass' : 'half',
                            'title' : '接单类型：',
                            'content' : data.dec_types,
                            'type' : 'dec_type'
                        },
                        {
                            'sclass' : 'half',
                            'title' : '设计风格：',
                            'content' : data.dec_styles,
                            'type' : 'dec_style'
                        },
                        {
                            'sclass' : 'half',
                            'title' : '接单户型：',
                            'content' : data.dec_house_types,
                            'type' : 'house_type'
                        },
                        {
                            'sclass' : 'half',
                            'title' : '施工团队：',
                            'content' : data.team_count + '个施工队'
                        },
                        {
                            'sclass' : 'half',
                            'title' : '毕业院校：',
                            'content' : data.university
                        },
                        {
                            'sclass' : 'half',
                            'title' : '工作年限：',
                            'content' : data.work_year+'年'
                        },
                        {
                            'title' : '曾就职装饰公司：',
                            'content' : data.company
                        },
                        {
                            'title' : '设计成就：',
                            'content' : data.achievement
                        }
                    ],
                    sLi = '<ul class="f-cb">';
                    for (var i = 0 , len = service.length; i < len; i++) {
                        var span = ''
                        if($.isArray(service[i].content)){
                            for (var j = 0 , len2 = service[i].content.length; j < len2; j++){
                                span += '<span>'+ globalData[service[i].type](service[i].content[j])+'</span> ';
                            };
                        }else{
                            span = '<p>'+service[i].content+'</p>'
                        }
                        sLi += '<li class="'+(service[i].sclass ? service[i].sclass : '')+'"><strong>'+service[i].title+'</strong><div>'+span+'</div></li>';
                    };
                    sLi += '</ul>'
                    this.service.html(sLi);
                    goto.init({
                        shop : true
                    })
                    this.loadList();
                    this.product.html(this.createList()).removeClass('hide');
                    this.addIntent();
            },
            loadList : function(){
                var self = this;
                $.ajax({
                    url:RootUrl+'api/v2/web/search_designer_product',
                    type: 'POST',
                    contentType : 'application/json; charset=utf-8',
                    dataType: 'json',
                    data : JSON.stringify({
                      "query":{
                        "designerid": self.winHash
                      },
                      "from": self.toFrom,
                      "limit" : 6
                    }),
                    processData : false
                })

                .done(function(res) {
                    if(res.data.total <= 6){
                        self.product.find('.loadmore').hide();
                    }else if(self.toFrom+6 >= res.data.total ){
                        self.product.find('.loadmore').addClass('not').html('没有更多了').fadeIn(500);
                    }else{
                        self.product.find('.loadmore').fadeIn(500);
                    }
                    self.loadmore();
                    if(res.data.total){
                        self.appendList(res.data.products)
                    }
                });
            },
            appendList : function(data){
                var arr = [],
                    $list = this.product.find('.list ul');
                for (var i = 0,len = data.length; i < len; i++) {
                    arr.push('<li><a href="/tpl/design/detail.html?'+data[i]._id+'" class="img"><img src="/api/v2/web/thumbnail/389/'+data[i].images[0].imageid+'" alt="'+data[i].images[0].section+'" /></a><div class="txt"><h4><a href="/tpl/design/detail.html?'+data[i]._id+'">'+data[i].cell+'</a></h4><p><span>'+data[i].house_area+'m&sup2;</span><span>'+globalData.house_type(data[i].house_type)+'</span><span>'+globalData.dec_style(data[i].dec_style)+'</span><span>'+globalData.dec_type(data[i].dec_type)+'</span></p></div></li>')
                };
                return $list.append(arr.join(''))
            },
            createList : function(){
                return [
                        '<div class="list">',
                            '<ul class="f-cb"></ul>',
                        '</div>',
                        '<a href="javascript:;" class="loadmore">查看更多</a>'
                    ].join('');
            },
            loadmore : function(){
                var self = this;
                this.product.delegate('.loadmore','click',function(ev){
                    ev.preventDefault();
                    if($(this).hasClass('not')){
                        return ;
                    }
                    self.toFrom += 6;
                    $(this).fadeOut(500);
                    self.loadList();
                    return false;
                })
            },
            addIntent : function(){
                var self = this,
                    off = true;
                this.info.delegate('.addIntent','click',function(ev){
                    ev.preventDefault();
                    if(!off){
                        return ;
                    }
                    off = false;
                    var This = $(this),
                        addOffset = goto.offset();
                    if(self.usertype === '1'){
                        var uidname = $(this).data('uid'),
                            head = self.info.find('.head'),
                            img = head.find('img').attr('src')
                            state = head.offset(),
                            scrollTop = $(document).scrollTop();
                            flyer = $('<img class="u-flyer" src="'+img+'">');
                        $.ajax({
                            url:RootUrl+'api/v2/web/favorite/designer/add',
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
        var home = new Home();
        home.init();
})
