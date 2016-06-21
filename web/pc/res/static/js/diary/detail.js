require.config({
    baseUrl: '/static/js/',
    paths  : {
        jquery: 'lib/jquery',
        lodash : 'lib/lodash',
        cookie : 'lib/jquery.cookie'
    }
});
require(['jquery','lodash','cookie','utils/common','lib/jquery.mousewheel.min','utils/format'],function($,_,cookie,common){
        var user = new common.User();
        user.init();
        var search = new common.Search();
        search.init();
        var goto = new common.Goto();
        var LightBox = function(){};
        LightBox.prototype = {
        init : function(pos){
            var _this = this;
            this.doc = $(document);
            this.arr = pos.arr || [];
            this.select = pos.select || '.lightBox';
            this.parent = pos.parent || this.doc;
            this.images = [];
            _.forEach(this.arr,function(k,v){
                //_this.lightBoxAjax(globalData.dec_flow(k.name),k.images);
                _this.images.push({
                    'index' : k.name*1,
                    'name' : globalData.dec_flow(k.name),
                    'images' : k.images,
                    'length' : k.images.length
                })
            });
            _this.lightBoxBindEvent(this.images);
        },
        lightBoxAjax : function(name,arr){    //获取图片对象，供大图操作
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
                _this.lightBoxShow(lightBox,arr,$(this).data('group')*1,$(this).data('item')*1);
            });
        },
        lightBoxShow : function(obj,arr,group,item){
            var timer = null;
            var win = $(window).width();
            var doc = this.doc;
            var viewW = win-200;
            var maxLen = ~~(viewW/76);
            var len = arr.length;
            var uiWidth = 0;
            _.forEach(arr,function(k,v){
                uiWidth += 56+76*k.length;
            });
            var isMove =  viewW - uiWidth < 0;
            var _this = this;
            var m = group;
            var n = item;
            var subLeft = [];
            var maxWidth = 0;
            var close = $('<span class="close">&times;</span>');
            obj.append(close);
            var togglePrev = $('<span class="toggle prev" style="display: '+(m === 0 && n === 0 ? 'none' : 'block')+'"><i class="iconfont">&#xe611;</i></span>');
            var toggleNext = $('<span class="toggle next" style="display: '+(m === len-1 && n === arr[m].length - 1 ? 'none' : 'block')+'"><i class="iconfont">&#xe617;</i></span>');
            var imgBox = $('<div class="imgBox"><img class="imgBig" /></div>');
            imgBox.append(togglePrev);
            imgBox.append(toggleNext);
            var imgTab = $('<div class="imgTab"></div>');
            obj.append(imgBox);
            var tabPrev = $('<span class="toggle prev" style="display: '+(isMove && (m === 0 && n ==! 0) ? 'block' : 'none')+'"><i class="iconfont">&#xe611;</i></span>');
            var tabNext = $('<span class="toggle next" style="display: '+(isMove && (m === len-1 && n === arr[m].length - 1)  ? 'none' : 'block')+'"><i class="iconfont">&#xe617;</i></span>');
            imgTab.append(tabPrev);
            imgTab.append(tabNext);
            var tab = $('<div class="tab"></div>');
            var str = '<ul class="list" style="width:'+uiWidth+'px">';
            _.forEach(arr,function(k,v){
                var width = (56+76*k.length);
                var left = v === 0 ? 0 : subLeft[subLeft.length-1].width + subLeft[subLeft.length-1].left;
                var subL = [];
                var sList = '<li data-index="'+k.index+'" class="father" data-width="'+width+'"><h4>'+k.name+'</h4><ul>';
                    _.forEach(arr[v].images,function(i,s){
                        var sl = left + 76*s;
                        subL.push(sl);
                        if(uiWidth - viewW >= 0){
                            if(uiWidth - viewW + 76 > sl && sl > uiWidth - viewW){
                                maxWidth = sl;
                            }
                        }
                        sList += '<li class="sub sub'+(v+"-"+s)+'" data-mark="'+(v+"-"+s)+'"><span></span><img src="/api/v2/web/thumbnail2/66/66/'+arr[v].images[s]+'" /></li>'
                    });
                subLeft.push({
                    width : width,
                    left : left,
                    subL : subL
                });
                str += sList +'</ul></li>';
            });
            str += '</ul>';
            tab.html(str);
            var imgBig = obj.find('.imgBig');
            imgTab.append(tab);
            obj.append(imgTab);
            this.lightBoxToggle(imgTab,group,item);
            this.lightBoxImgBig(imgBig,arr,group,item);
            if(obj.css('display') === 'none'){
                obj.show();
            }else{
                $('body').append(obj);
            }
            close.on('click',function(){
                _this.lightBoxHide(obj);
                doc.off('mousewheel');
            });
            imgTab.on('click','.sub',function(){
                var index = $(this).data('mark').split("-");
                var newArr = _.map(index, function(n){
                    return n*1;
                });
                m = newArr[0];
                n = newArr[1];
                moveTo()
            });
            imgBox.on('click','.prev',function(){
                moveTo('prev');
            });
            imgBox.on('click','.next',function(){
                moveTo('next');
            });
            var oUl = obj.find('.list');
            if(subLeft[m].subL[n] >= maxWidth){
                tabNext.hide();
                oUl.css({'left':-maxWidth});
            }else{
                if(isMove){
                    oUl.css({'left':-subLeft[m].subL[n]});
                }
                tabNext.show();
            }
            imgTab.on('click','.prev',function(){
                moveTo('prev');
            });
            imgTab.on('click','.next',function(){
                moveTo('next');
            });
            function moveTo(me){
                if(me === 'prev'){
                    if(n === 0){
                        if(m === 0){
                            m = 0;
                            n = 0;
                        }else{
                            m--;
                            n = arr[m].length -1;
                        }
                    }else{
                        n--;
                    }
                }else if(me === 'next'){
                    if(n === arr[m].length -1){
                        if(m === arr.length -1){
                            m =  arr.length -1;
                            n = arr[m].length -1;
                            toggleNext.hide();
                        }else{
                            m++;
                            n = 0;
                            toggleNext.show();
                        }
                    }else{
                        n++;
                    }
                }
                if(subLeft[m].subL[n] >= maxWidth){
                    tabNext.hide();
                    oUl.stop().animate({
                        left:-maxWidth
                    })
                }else{
                    if(isMove){
                        oUl.stop().animate({
                            left:-subLeft[m].subL[n]
                        });
                    }
                    tabNext.show();
                }
                togglePrev.toggle(m === 0 ? n !== 0 && m === 0 : m !== 0);
                tabPrev.toggle(m === 0 && isMove ? n !== 0 && m === 0 : m !== 0);
                toggleNext.toggle(m === len-1 ? n !== arr[m].length -1 && m === len-1 : m !== len-1);
                _this.lightBoxImgBig(imgBig,arr,m,n);
                _this.lightBoxToggle(imgTab,m,n);
            }
            doc.on('keydown',function(event){
                switch (event.keyCode) {
                    case 37:    //左
                        moveTo('prev');
                        break;
                    case 38:    //上
                        moveTo('prev');
                        break;
                    case 39:    //右
                        moveTo('next');
                        break;
                    case 40:    //下
                        moveTo('next');
                        break;
                }
            });
            doc.one('mousewheel',mousewheelFn);
            doc.on('mousewheel',function(ev){
                ev.preventDefault();
            });
            function mousewheelFn(ev,direction){
                if( direction < 1 ){  //向下滚动
                    moveTo('next');
                }else{  //向上滚动
                    moveTo('prev');
                }
                clearTimeout(timer);
                timer = setTimeout(function(){
                    doc.one("mousewheel",mousewheelFn);
                },1200);
            }
        },
        lightBoxToggle : function(obj,group,item){
            obj.find('.sub').removeClass('active');
            obj.find('.sub'+group+"-"+item).addClass('active');
        },
        lightBoxImgBig :function(obj,arr,k,v){
            obj.attr('src','').attr('src','/api/v2/web/image/'+arr[k].images[v]);
        },
        lightBoxHide : function(obj){
            obj.hide().html('');
        }
    };
        var lightBox = new LightBox();
        var Detail = function(){};
        Detail.prototype = {
            init  : function(){
                this.urlid = window.location.pathname.split("/").pop();
                this.cookie = $.cookie('usertype');
                this.body = $('body');
                this.detail = $('#j-diary');
                this.like();
                this.review();
                this.remove();
                this.sidenav();
                goto.init();
            },
            sidenav : function(){
                var start = 0;
                var $sidenav = $('#j-sidenav');
                var aLi = $sidenav.find('li');
                var win = $(window);
                var winW = win.width();
                $sidenav.css('left',parseInt((winW-1200)/2) - 70).show();
                var list = this.detail.find('.m-list');
                highlight(win.scrollTop());
                setTop(win.scrollTop());
                win.on('scroll',function(){
                    var top = win.scrollTop();
                    setTop(top);
                    if(top < 500){
                        add(0);
                    }else{
                        highlight(top);
                    }
                    start = top;
                });
                function highlight(top){
                    list.each(function(index, el) {
                        if($(el).offset().top - top < 300){
                            add(index);
                        }
                    });
                }
                function setTop(top){
                    var topic = 255 - top <= 100 ? 100 : 255 - top;
                    $sidenav.stop().animate({'top':$sidenav});
                }
                function add(n){
                    aLi.eq(n).addClass('active').siblings().removeClass('active');
                }
                $sidenav.on('click','li',function(event){
                    var index = $(this).index();
                    $('html,body').animate({scrollTop: list.eq(index).offset().top}, 500,function(){
                        add(index);
                    });
                });
            },
            remove : function(){
                this.detail.on('click','.remove',function(event){   //删除一条动态
                    var id = $(this).data('diaryid');
                    var parent = $(this).parents('.m-list');
                    $(this).hide();
                    $.ajax({
                        url: '/api/v2/web/delete_diary',
                        type: 'POST',
                        dataType: 'json',
                        contentType : 'application/json; charset=utf-8',
                        data : JSON.stringify({
                            "diaryid" : id
                        }),
                        processData : false
                    })
                    .done(function(res) {
                        if(res.msg === "success"){
                            parent.animate({width:0,height:0},function(){
                                parent.remove();
                            });
                        }
                    })
                    .fail(function(error) {
                        console.log(error);
                    });
                });
            },
            like : function(){
                var _this = this;
                this.detail.on('click','.click-like',function(event){   //点赞
                    var id = $(this).data('diaryid');
                    if(_this.cookie === undefined){
                        return _this.prevent('您还没有登录，请登录后在点赞',_this.urlid);
                    }
                    if($(this).hasClass('active')){
                        return ;
                    }
                    var id = $(this).data('diaryid');
                    $(this).addClass('active');
                    var strong = $(this).find('strong');
                    var like = $(this).find('.like');
                    var num = parseInt(like.text(),10) + 1;
                    strong.fadeIn(function(){
                        like.html(num);
                    });
                    $.ajax({
                        url: '/api/v2/web/favorite/diary/add',
                        type: 'POST',
                        dataType: 'json',
                        contentType : 'application/json; charset=utf-8',
                        data : JSON.stringify({
                            "diaryid" : id
                        }),
                        processData : false
                    })
                    .done(function(res) {
                        if(res.msg === "success"){
                            strong.delay(500).fadeOut().remove();
                        }
                    })
                    .fail(function(error) {
                        console.log(error);
                    });
                });
            },
            prevent : function(msg,id){
                this.myConfirm(msg,function(choose){
                    if(choose == 'yes') {
                        window.location.href = '/tpl/user/login.html?/tpl/diary/book/'+id;
                    }
                });
                return false;
            },
            review : function(){
                var _this = this;
                var addCommentTo = null;
                this.detail.on('click','.click-review',function(event){    //打开评论列表
                    var id = $(this).data('diaryid');
                    if(_this.cookie === undefined){
                        return _this.prevent('您还没有登录，请登录后在评论',_this.urlid);
                    }
                    var parent = $(this).parents('.m-list');
                    var review = parent.find('.m-review');
                    $(this).toggleClass('active');
                    if($(this).hasClass('active')){
                        getComment(parent,id,0,10,false,function(){
                            review.removeClass('hide');
                        });
                    }else{
                        review.addClass('hide');
                        review.find('.list ul').html();
                    }
                });
                this.detail.on('click','.reply',function(event){    //评论给谁
                    $(this).addClass('active');
                    var parent = $(this).parents('.m-list');
                    var review = parent.find('.m-review');
                    addCommentTo = {};
                    addCommentTo.byuserid = $(this).data('byuserid');
                    addCommentTo.byusername = $(this).data('byusername');
                    review.find('.find strong').html(addCommentTo.byusername);
                    review.find('.find').show();
                });
                function getComment(obj,id,form,limit,dir,fn){     //获取评论数据
                    var oUl = obj.find('.m-review .list ul');
                    var more = obj.find('.m-review .more');
                    var length = oUl.find('li').size();
                    $.ajax({
                        url: '/api/v2/web/topic_comments',
                        type: 'POST',
                        dataType: 'json',
                        contentType : 'application/json; charset=utf-8',
                        data : JSON.stringify({
                            "topicid":id,
                            "from": form,
                            "limit":limit || 10
                        }),
                        processData : false
                    })
                    .done(function(res) {
                        var total = res.data.total;
                        var szie = res.data.comments.length;
                        if(!total || !szie){fn && fn();return ;}
                        if(dir){
                            oUl.prepend(createComment(res.data.comments[0]))
                        }else{
                            for(var i=0; i < szie; i++){
                                oUl.append(createComment(res.data.comments[i]))
                            }
                            fn && fn();
                            if(length+szie >= total){
                                more.hide();
                            }else{
                                if(total > limit){
                                    more.show();
                                }
                            }
                        }
                    })
                    .fail(function(error) {
                        console.log(error);
                    });
                };
                function createComment(data){    //生成评论列表
                    var img = !!data.byUser.imageid ? '<img src="/api/v2/web/thumbnail2/50/50/'+data.byUser.imageid+'" alt="'+data.byUser.username+'">' : ''
                    return arr = [
                        '<li>',
                        '<div class="head">',
                        img ,
                        '</div>',
                        '<h4><span>'+data.byUser.username+'</span><time>'+Date.timeAgo(data.date)+'</time></h4>',
                        '<p><span>'+textareaEscaped(data.content)+'</span><i class="iconfont reply" data-byusername="'+data.byUser.username+'" data-byuserid="'+data.byUser._id+'">&#xe616;</i></p>',
                        '</li>'
                    ].join('');
                }
                function textareaEscaped(value) {
                    return value.toString().replace(/(\r)*\n/g, "<br />").replace(/\s/g, " ");
                }
                //输入框相关事件
                this.detail.on('focus','.contentMsg',function(event){   //输入框获取焦点
                    $(this).parent().addClass('focus');
                }).on('blur','.contentMsg',function(event){   //输入框失去焦点
                    var parent = $(this).parents('.m-list');
                    if(!$.trim($(this).val())){
                        reset(parent)
                    }
                }).on('input propertychange','.contentMsg',function(event){   //输入框正在输入时候
                    var parent = $(this).parents('.m-list');
                    var addMsg = parent.find('.addComment');
                    $(this).parent().addClass('focus');
                    if(!!_.trim($(this).val())){
                        addMsg.attr({'class':'u-btns addComment'});
                    }else{
                        addMsg.attr({'class':'u-btns addComment u-btns-disabled'});
                    }
                });
                this.detail.on('click','.addComment',function(event){   //添加一条评论
                    if($(this).hasClass('u-btns-disabled')){
                        return ;
                    }
                    var parent = $(this).parents('.m-list');
                    var $review = parent.find('.m-review');
                    var contentMsg = $review.find('.contentMsg');
                    if(!$.trim(contentMsg.val())){
                        return ;
                    }
                    var id = parent.data('uid');
                    var byuser,content;
                    if(addCommentTo !== null){
                        byuser = addCommentTo.byuserid;
                        content = '回复给&nbsp;&nbsp;'+addCommentTo.byusername+"：&nbsp;&nbsp;&nbsp;"+contentMsg.val();
                    }else{
                        byuser = $(this).data('topicid');
                        content = contentMsg.val();
                    }

                    var strong = parent.find('.click-review strong');
                    var review = parent.find('.click-review .review');
                    var num = parseInt(review.text(),10) + 1;
                    strong.fadeIn(function(){
                        review.html(num);
                    });
                    $.ajax({
                        url: '/api/v2/web/add_comment',
                        type: 'POST',
                        dataType: 'json',
                        contentType : 'application/json; charset=utf-8',
                        data : JSON.stringify({
                            topicid:id,
                            topictype:'2',
                            content:content,
                            to_designerid:undefined,
                            to_userid:byuser
                        }),
                        processData : false
                    })
                    .done(function(res) {
                        if(res.msg === "success"){
                            getComment(parent,id,0,10,true);
                            addCommentTo = null;
                            reset(parent);
                            $review.find('.reply').removeClass('active');
                            $review.find('.find').hide();
                            strong.delay(500).fadeOut();
                        }
                    })
                    .fail(function(error) {
                        console.log(error);
                    });
                });
                function reset(parent){   //重置评价输入
                    var addMsg = parent.find('.addComment');
                    var contentMsg = parent.find('.contentMsg');
                    contentMsg.val('');
                    contentMsg.parent().removeClass('focus');
                    addMsg.attr({'class':'u-btns addComment u-btns-disabled'});
                }
                this.detail.on('click','.more',function(event){    //加载更多评论
                    var parent = $(this).parents('.m-list');
                    var length = $(this).prevAll('.list').find('li').size();
                    var id = $(this).data('topicid');
                    getComment(parent,id,length,10,false);
                });
            },
            myConfirm : function(msg,callback){
                var modat = '<div class="modal-dialog">\
                          <div class="modal-content">\
                            <div class="modal-body">\
                               <p class="text">'+msg+'</p>\
                            </div>\
                            <div class="modal-footer">\
                              <button type="button" class="u-btns u-btns-revise cancel">看看再说</button>\
                              <button type="button" class="u-btns define">我要点赞</button>\
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
});
