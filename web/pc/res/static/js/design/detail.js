require.config({
    baseUrl: '/static/js/',
    paths  : {
        jquery: 'lib/jquery',
        lodash : 'lib/lodash',
        lazyload : 'lib/lazyload',
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
require(['jquery','index/search'],function($,Search){
    var search = new Search();
    search.init();
});
require(['jquery','lazyload'],function($){
    $(function(){
        $("img.lazyimg").lazyload({
            effect : "fadeIn"
        });
    });
});
require(['jquery','lodash','cookie','utils/common','utils/tooltip','lib/jquery.mousewheel.min'],function($,_,cookie,common,Tooltip){
        var LightBox = function(){};
        LightBox.prototype = {
            init : function(pos){
                this.doc = $(document);
                this.arr = pos.arr || [];
                this.select = pos.select || '.lightBox';
                this.parent = pos.parent || this.doc;
                if(this.arr.length){
                    this.lightBoxBindEvent(this.arr);
                }
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
                    str += '<li class="'+(v===index ? 'active' : '')+'"><span></span><img src="/api/v2/web/thumbnail2/66/66/'+k.imageid+'" /></li>'
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
                            return ;
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
                            return ;
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
                obj.hide().attr('src','/api/v2/web/image/'+arr[index].imageid).fadeIn();
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
                this.detail = $("#j-detail");
                this.main = this.detail.find('.g-mn');
                this.side = this.detail.find('.g-sd');
                this.usertype = $.cookie("usertype");
                this.user = new common.User();
                this.goto = new common.Goto();
                this.user.init2();
                this.goto.init();
                new Tooltip('.tooltip');
                if($.cookie("usertype") === '1'){
                    require(['design/addIntent'],function(AddIntent){
                        (new AddIntent(this.home)).init();
                    });
                }
                this.sidepic();
                var $lightBox = this.detail.find('.lightBox');
                var img = [];
                $lightBox.each(function(index, el) {
                    img.push($(el).data());
                    img[index].index = index;
                    $(el).css('cursor', 'pointer');
                });
                lightBox.init({
                    arr : img,
                    sClass : 'lightBox',
                    parent : this.detail
                });
                this.favorite(this.main.find('.favorite').data('uid'));
            },
            sidepic : function(){
                var $planview = this.detail.find('.m-planview');
                var aBtns = $planview.find('.btns span');
                var oPrev = $planview.find('.prev');
                var oNext = $planview.find('.next');
                var oUl = $planview.find('ul');
                var length = aBtns.size();
                var iNow = 0;
                aBtns.on('click',function(){
                    iNow = $(this).index();
                    move();
                })
                oNext.on('click',function(){
                    if(iNow == length-1){
                        iNow = length-1;
                    }else{
                        iNow++;
                    }
                    move();
                })
                oPrev.on('click',function(){
                    if(iNow == 0){
                        iNow = 0;
                    }else{
                        iNow--;
                    }
                    move();
                })
                move();
                function move(){
                    oPrev.toggleClass('hide',iNow == 0);
                    oNext.toggleClass('hide',iNow == length-1);
                    aBtns.eq(iNow).addClass('active').siblings().removeClass('active');
                    oUl.stop().animate({left: -iNow*880});
                }
                $planview.hover(function() {
                    $(this).find('.toggle').removeClass('hide');
                }, function() {
                    $(this).find('.toggle').addClass('hide');
                });
            },
            favorite  : function(id){
                var _this = this;
                this.main.delegate('.favorite','click',function(ev){
                    ev.preventDefault();
                    var This = $(this);
                    if(This.html() == '收藏作品'){
                        favorite('add',function(res){
                            if(res['msg'] === "success"){
                                This.addClass(' u-btns-revise').html('取消收藏');
                            }
                        })
                    }else{
                        _this.myConfirm('您确定要取消收藏吗？',function(choose){
                            if(choose == 'yes') {
                                favorite('delete',function(res){
                                    if(res['msg'] === "success"){
                                        This.removeClass(' u-btns-revise').html('收藏作品');
                                    }
                                });
                            }
                        });
                    }
                });
                function favorite(state,fn){
                    $.ajax({
                        url:'/api/v2/web/favorite/product/'+state,
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
                        _this.user.updateData();
                    });
                }
            },
            myConfirm : function(msg,callback){
                var modat = '<div class="modal-dialog">\
                          <div class="modal-content">\
                            <div class="modal-body">\
                               <div class="icon">\
                                    <i class="iconfont">&#xe619;</i>\
                               </div>\
                               <p class="text">'+msg+'</p>\
                            </div>\
                            <div class="modal-footer">\
                              <button type="button" class="u-btns u-btns-revise cancel">取消</button>\
                              <button type="button" class="u-btns define">确定</button>\
                            </div>\
                          </div>\
                        </div>\
                      </div>';
                var _this = this;
                var $modal = $('<div class="k-modal dialog" id="j-modal"></div>'),
                    $backdrop = $('<div class="k-modal-backdrop" id="j-modal-backdrop"></div>');
                    $modal.html(modat)
                this.body.append($backdrop);
                $backdrop.fadeIn();
                this.body.append($modal);
                    $modal.fadeIn();
                $modal.find('.define').on('click',function(ev){
                    ev.preventDefault();
                    callback && callback('yes');
                    hide();
                });
                function hide(){
                    $modal.remove();
                    $backdrop.remove();
                }
                $modal.find('.cancel').on('click',function(ev){
                    ev.preventDefault();
                    callback && callback('no');
                    hide();
                });
            }
        };
        var detail = new Detail();
        detail.init();
})
