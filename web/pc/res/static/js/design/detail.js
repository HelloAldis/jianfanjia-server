require.config({
    baseUrl: '/static/js/',
    paths  : {
        jquery: 'lib/jquery',
        lodash : 'lib/lodash',
        cookie : 'lib/jquery.cookie'
    },
    shim   : {
        'jquery.requestAnimationFrame.min': {
            deps: ['jquery']
        },
        'jquery.fly.min': {
            deps: ['jquery']
        }
    }
});
require(['jquery','lodash','cookie','utils/common','lib/jquery.mousewheel.min','lib/jquery.requestAnimationFrame.min','lib/jquery.fly.min'],function($,_,cookie,common){
        var user = new common.User();
        user.init();
        var search = new common.Search();
        search.init();
        var goto = new common.Goto();
        var LightBox = function(){};
        LightBox.prototype = {
            init : function(pos){
                this.doc = $(document);
                this.arr = pos.arr || [];
                this.select = pos.select || '.lightBox';
                this.parent = pos.parent || this.doc;
                if(this.arr.length){
                    this.lightBoxAjax(this.arr);
                }
            },
            lightBoxAjax : function(arr){    //获取图片对象，供大图操作
                var _this = this;
                $.ajax({
                        url: '/api/v2/web/imagemeta',
                        type: 'POST',
                        dataType: 'json',
                        contentType : 'application/json; charset=utf-8',
                        data : JSON.stringify({
                            _ids : arr
                        }),
                        processData : false
                    })
                    .done(function(res) {
                        res.data.length && _this.lightBoxBindEvent(res.data);
                    })
                    .fail(function(error) {
                        console.log(error);
                    });
            },
            lightBoxBindEvent : function(arr){
                var _this = this;
                var lightBox = $('<div class="m-lightBox"></div>');
                this.parent.find(this.select).css('cursor','pointer');
                this.parent.on('click',this.select,function(ev) {
                    ev.preventDefault();
                    _this.lightBoxShow(lightBox,arr,$(this).data('index')*1);
                });
            },
            lightBoxShow : function(obj,arr,index){
                var timer = null;
                var win = $(window).width();
                var doc = this.doc;
                var maxLen = ~~((win-200)/76);
                var len = arr.length;
                var isMove = len > maxLen;
                var _this = this;
                var i = index;
                var k = isMove ? (index > (len - maxLen) && index < len) ? (len - maxLen) : index - maxLen > 0 ? index - maxLen+1 : 0 : index;
                var close = $('<span class="close">&times;</span>');
                obj.append(close);
                var togglePrev = $('<span class="toggle prev" style="display: '+(index == 0 ? 'none' : 'block')+'"><i class="iconfont">&#xe611;</i></span>');
                var toggleNext = $('<span class="toggle next" style="display: '+(index == len-1 ? 'none' : 'block')+'"><i class="iconfont">&#xe617;</i></span>');
                var imgBox = $('<div class="imgBox"><img class="imgBig" /></div>');
                imgBox.append(togglePrev);
                imgBox.append(toggleNext);
                var imgTab = $('<div class="imgTab"></div>');
                obj.append(imgBox);
                var tabPrev = $('<span class="toggle prev" style="display: '+(index == 0 ? 'none' : 'block')+'"><i class="iconfont">&#xe611;</i></span>');
                var tabNext = $('<span class="toggle next" style="display: '+(index <= len-1 && index > len-maxLen  ? 'none' : 'block')+'"><i class="iconfont">&#xe617;</i></span>');
                if(isMove){
                    imgTab.append(tabPrev);
                    imgTab.append(tabNext);
                }
                var tab = $('<div class="tab"></div>');
                var str = '<ul style="left:'+(isMove ? -76*k : 0)+'px;width:'+(len*76)+'px">';
                _.forEach(arr,function(k,v){
                    str += '<li class="'+(v===index ? 'active' : '')+'"><span></span><img src="/api/v2/web/thumbnail2/66/66/'+k._id+'" /></li>'
                });
                str += '</div>';
                tab.html(str);
                imgTab.append(tab);
                obj.append(imgTab);
                var imgBig = obj.find('.imgBig');
                var oUl = obj.find('ul');
                var aLi = oUl.find('li');
                this.lightBoxImgBig(imgBig,arr,index);
                if(obj.css('display') === 'none'){
                    obj.show();
                }else{
                    $('body').append(obj);
                }
                close.on('click',function(){
                    _this.lightBoxHide(obj);
                    doc.off('mousewheel');
                });
                imgBox.on('click','.prev',function(){
                    oUl.trigger("move:prev");
                });
                imgBox.on('click','.next',function(){
                    oUl.trigger("move:next");
                });
                function thumbnailMove(){
                    if(isMove){
                        oUl.stop().animate({
                            left:-76*k
                        });
                    }
                }
                imgTab.on('click','li',function(){
                    var n = $(this).index()*1;
                    moveTo(n);
                });
                imgTab.on('click','.prev',function(){
                    oUl.trigger("move:prev");
                });
                imgTab.on('click','.next',function(){
                    oUl.trigger("move:next");
                });
                oUl.on('move:prev',function(){
                    moveTo('prev');
                });
                oUl.on('move:next',function(){
                    moveTo('next');
                });
                function moveTo(m){
                    if(m === 'prev'){
                        if(i == 0){
                            i = 0
                        }else{
                            --i;
                        }
                        if(k == 0){
                            k == 0;
                        }else{
                            --k;
                        }
                    }else if(m === 'next'){
                        if(i == len - 1){
                            i = len - 1;
                        }else{
                            ++i;
                        }
                        if(k == len - maxLen){
                            k == len - maxLen;
                        }else{
                            ++k;
                        }
                    }else{
                        i = m;
                        k = i >= len - maxLen ? len - maxLen : m;
                    }
                    thumbnailMove();
                    _this.lightBoxImgBig(imgBig,arr,i);
                    _this.lightBoxToggle(aLi,i);
                    togglePrev.toggle(i !== 0);
                    toggleNext.toggle(i !== len-1);
                    tabPrev.toggle(k !== 0);
                    tabNext.toggle(k !== len - maxLen);

                }
                doc.on('keydown',function(event){
                    switch (event.keyCode) {
                        case 37:    //左
                            oUl.trigger("move:prev");
                            break;
                        case 38:    //上
                            oUl.trigger("move:prev");
                            break;
                        case 39:    //右
                            oUl.trigger("move:next");
                            break;
                        case 40:    //下
                            oUl.trigger("move:next");
                            break;
                    }
                });
                doc.one('mousewheel',mousewheelFn);
                doc.on('mousewheel',function(ev){
                    ev.preventDefault();
                });
                function mousewheelFn(ev,direction){
                    if( direction < 1 ){  //向下滚动
                        oUl.trigger("move:next");
                    }else{  //向上滚动
                        oUl.trigger("move:prev");
                    }
                    clearTimeout(timer);
                    timer = setTimeout(function(){
                        doc.one("mousewheel",mousewheelFn);
                    },1200);
                }
            },
            lightBoxToggle : function(li,index){
                li.eq(index).addClass('active').siblings().removeClass('active');
            },
            lightBoxImgBig :function(obj,arr,index){
                obj.attr('src','').attr('src','/api/v2/web/image/'+arr[index]._id);
            },
            lightBoxHide : function(obj){
                obj.hide().html('');
            }
        };
        var lightBox = new LightBox();
        var Detail = function(){};
        Detail.prototype = {
            init  : function(){
                this.body = $('body');
                this.modalStatus = false;
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
                var img = [];
                var msg = '';
                if(data.dec_type == 0){
                    msg = '装修户型：'+globalData.house_type(data.house_type);
                }else if(data.dec_type == 1){
                    msg = '商装类型：'+globalData.business_house_type(data.business_house_type === undefined ? 9999 : data.business_house_type);
                }
                var arr = [
                        '<div class="m-detail-product">',
                            '<div class="m-tt">',
                                '<h2>'+data.cell+'</h2>',
                                '<a href="javascript:;" class="u-btns u-btns-hollow favorite '+(data.is_my_favorite ? 'u-btns-revise' : '')+'">'+(data.is_my_favorite ? '取消收藏' : '收藏作品')+'</a>',
                            '</div>',
                           ' <div class="m-ct">',
                                '<div class="info">',
                                    '<ul>',
                                        '<li>参考造价：'+data.total_price+'万</li>',
                                        '<li>装修类型：'+globalData.dec_type(data.dec_type)+'</li>',
                                        '<li>包工类型：'+globalData.work_type(data.work_type)+'</li>',
                                        '<li>'+msg+'</li>',
                                        '<li>面积：'+data.house_area+'平米</li>',
                                        '<li>设计风格：'+globalData.dec_style(data.dec_style)+'</li>',
                                        '<li class="last">浏览数：'+data.view_count+'</li>',
                                    '</ul>',
                                    '<div class="description">',
                                        '<span class="sub"></span><span class="sup"></span>',
                                        '<p>'+data.description+'</p>',
                                    '</div>',
                                '</div>',
                                '<div class="images">'
                    ];
                    for (var i = 0 , len = data.images.length; i < len; i++) {
                        arr.push('<section><h3>'+data.images[i].section+'</h3><img class="lightBox" data-index="'+i+'" src="/api/v2/web/watermark/880/'+data.images[i].imageid+'" alt="" />'+(!!data.images[i].description ? '<p>'+data.images[i].description+'</p>' : "")+'</section>');
                        img.push(data.images[i].imageid)
                    };
                    arr.push('</div></div></div>');
                    this.main.html(arr.join('')).removeClass('hide');
                    this.favorite(data._id);
                    lightBox.init({
                        arr : img,
                        sClass : 'lightBox',
                        parent : this.detail
                    });
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
                            '<a class="head" href="/tpl/designer/'+ data._id +'">',
                                '<img src="/api/v2/web/thumbnail/96/'+ data.imageid +'" alt="'+ data.username +'">',
                            '</a>',
                            '<h4><a href="/tpl/designer/'+ data._id +'">'+ data.username +'</a></h4>',
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
                            arr.push('<div class="btns"><a href="/tpl/user/owner.html#/designer/1" class="u-btns u-btns-revise">已添加</a></div>');
                        }else{
                            arr.push('<div class="btns"><a href="javascript:;" class="u-btns addIntent" data-uid="'+data._id+'">添加意向</a></div>');
                        }
                    }
                    arr.push('</div>');
                    this.side.html(arr.join('')).removeClass('hide');
                    goto.init({
                        shop : true
                    });
                    this.addIntent();
            },
            favorite  : function(id){
                var self = this;
                self.modal("您确定要取消收藏吗？");
                this.main.delegate('.favorite','click',function(ev){
                    ev.preventDefault();
                    var This = $(this);
                    if(self.usertype == undefined){
                        window.location.href = '/tpl/user/login.html?'+window.location.href;
                    }else{
                        if(This.html() == '收藏作品'){
                            favorite('add',function(res){
                                if(res['msg'] === "success"){
                                    This.addClass(' u-btns-revise').html('取消收藏');
                                }
                            })
                        }else{
                            show();
                        }
                    }
                });
                var $modal = $('#j-modal'),
                    $backdrop = $('#j-modal-backdrop'),
                    $cancel = $modal.find('.cancel'),
                    $define = $modal.find('.define');
                function show(){
                    $backdrop.fadeIn();
                    $modal.fadeIn();
                }
                function hide(){
                    $backdrop.hide();
                    $modal.hide();
                }
                $cancel.on('click',function(){
                    hide();
                });
                $define.on('click',function(){
                    favorite('delete',function(res){
                        if(res['msg'] === "success"){
                            self.main.find('.favorite').removeClass(' u-btns-revise').html('收藏作品');
                        }
                    });
                    hide();
                });
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
                        fn(res);
                        user.updateData();
                    });
                }
            },
            modal : function(text){
                var arr = [
                    '<div class="k-modal dialog" id="j-modal">',
                        '<div class="modal-dialog">',
                          '<div class="modal-content">',
                            '<div class="modal-body">',
                               '<div class="icon">',
                                    '<i class="iconfont">&#xe619;</i>',
                               '</div>',
                               '<p>'+text+'</p>',
                            '</div>',
                            '<div class="modal-footer">',
                              '<button type="button" class="u-btns u-btns-revise cancel">取消</button>',
                              '<button type="button" class="u-btns define">确定</button>',
                            '</div>',
                          '</div>',
                        '</div>',
                      '</div>',
                    '</div>',
                    '<div class="k-modal-backdrop" id="j-modal-backdrop"></div>'
                ];
                this.body.append(arr.join(''));
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
                            img = head.find('img').attr('src'),
                            state = head.offset(),
                            scrollTop = $(document).scrollTop(),
                            flyer = $('<img class="u-flyer" src="'+img+'">');
                        $.ajax({
                            url:'/api/v2/web/favorite/designer/add',
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
                                This.html('已添加').attr('href','/tpl/user/owner.html#/designer/1').removeClass('addIntent').addClass('u-btns-revise');
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
        };
        var detail = new Detail();
        detail.init();
})
