require.config({
    baseUrl: '/static/js/',
    paths  : {
        jquery: 'lib/jquery',
        lodash : 'lib/lodash',
        cookie : 'lib/jquery.cookie'
    }
});
require(['jquery','lodash','lib/jquery.cookie','utils/common','lib/jquery.mousewheel.min','utils/format'],function($,_,cookie,common){
        var user = new common.User();
        user.init();
        var search = new common.Search();
        search.init();
        var goto = new common.Goto();
        var Detail = function(){};
        Detail.prototype = {
            init  : function(){
                this.urlid = window.location.pathname.split("/").pop();
                this.diary = null;
                if(!!window.location.search){
                    this.diary = this.strToJson(window.location.search.substring(1));
                }
                this.cookie = $.cookie('usertype');
                this.body = $('body');
                this.detail = $('#j-diary');
                this.like();
                this.review();
                this.remove();
                this.sidenav();
                this.lightBox();
                goto.init();
            },
            sidenav : function(){
                var start = 0;
                var $sidenav = $('#j-sidenav');
                var aLi = $sidenav.find('li');
                var win = $(window);
                var winW = win.width();
                $sidenav.css('left',parseInt((winW-1200)/2) - 70).show();
                $side = this.detail.find('.g-sd');
                $main = this.detail.find('.g-mn');
                var list = this.detail.find('.m-list');
                if(this.diary !== null && $('#diary_'+this.diary.diaryid).length > 0){
                    var diary = $('#diary_'+this.diary.diaryid);
                    highlight(diary.offset().top);
                    setTop(diary.offset().top);
                    setHotTop(diary.offset().top);
                    $('html,body').animate({scrollTop: diary.offset().top}, 500,function(){
                        add(diary.index());
                    });
                }else{
                    highlight(win.scrollTop());
                    setTop(win.scrollTop());
                    setHotTop(win.scrollTop());
                }
                win.on('scroll',function(){
                    var top = win.scrollTop();
                    setHotTop(top);
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
                        if($(el).offset().top - top < 150){
                            add(index);
                        }
                    });
                }
                function setHotTop(top){
                    if($main.height() < $side.height()){
                        return ;
                    }
                    var left = $side.offset().left;
                    var position = top >= 220 ? 'fixed' : 'static';
                    var top = top < $main.height() - $side.height() + 220 ? 0 : $main.height() - $side.height() + 215 - top;
                    $side.css({
                        top : top,
                        left : left,
                        position: position
                    });
                }
                function setTop(top){
                    var topic = 255 - top <= 100 ? 100 : 255 - top;
                    $sidenav.stop().animate({'top':topic});
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
                var _this = this;
                var template = '<div class="modal-dialog">\
                                <div class="modal-content">\
                                    <div class="modal-body">\
                                        <div class="icon"><i class="iconfont">&#xe619;</i></div>\
                                        <p>您确定要删除日记吗？</p>\
                                    </div>\
                                    <div class="modal-footer">\
                                        <button type="button" class="u-btns u-btns-revise cancel">我点错了</button>\
                                        <button type="button" class="u-btns define">确定删除</button>\
                                    </div>\
                                </div>\
                            </div>';
                this.detail.on('click','.remove',function(event){   //删除一条动态
                    var $this = $(this);
                    _this.myConfirm(template,null,function(type){
                        if(type !== 'yes'){
                            return ;
                        }
                        var id = $this.data('diaryid');
                        var parent = $this.parents('.m-list');
                        $this.hide();
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
                });
            },
            like : function(){
                var _this = this;
                this.detail.on('click','.click-like',function(event){   //点赞
                    var id = $(this).data('diaryid');
                    if(_this.cookie === undefined){
                        return _this.prevent('您还没有登录，请登录后再点赞',_this.urlid);
                    }
                    if($(this).hasClass('active')){
                        return ;
                    }
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
                this.myConfirm(false,msg,function(choose){
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
                    var parent = $(this).parents('.m-list');
                    var review = parent.find('.m-review');
                    $(this).toggleClass('active');
                    if($(this).hasClass('active')){
                        getComment(parent,id,0,10,false,function(){
                            review.removeClass('hide');
                            if(_this.diary !== null && $('#diary_'+_this.diary.diaryid).length > 0){
                                var obj = $('#diary_'+_this.diary.diaryid).find('.m-review .list ul li');
                                setCommentTo(obj,_this.diary.to_userid,decodeURI(_this.diary.username),null);
                            }
                        });
                    }else{
                        review.addClass('hide');
                        review.find('.list ul').html('');
                    }
                });
                if(this.diary !== null && $('#diary_'+this.diary.diaryid).length > 0){
                    $('#diary_'+this.diary.diaryid).find('.click-review').click();
                }
                this.detail.on('click','.m-review .list ul li',function(event){    //评论给谁
                    var $reply = $(this).find('.reply');
                    setCommentTo($(this),$reply.data('byuserid'),$reply.data('byusername'))
                });
                function setCommentTo(obj,id,name,add){
                    var parent = obj.parents('.m-list');
                    var review = parent.find('.m-review');
                    var $reply = obj.find('.reply');
                    addCommentTo = {};
                    addCommentTo.byuserid = id;
                    addCommentTo.byusername = name;
                    addCommentTo.userid = review.data('userid');
                    addCommentTo.authorid = review.data('authorid');
                    var $replys = _this.detail.find('.reply');
                    $replys.removeClass('active');
                    if(addCommentTo.byuserid === addCommentTo.userid || addCommentTo.byuserid === addCommentTo.authorid){
                        addCommentTo.notfind = true;
                        addCommentTo.byusername = '';
                        review.find('.find').hide();
                    }else{
                        if(!!add){
                            $reply.addClass('active');
                        }
                        addCommentTo.notfind = false;
                        review.find('.find strong').html(addCommentTo.byusername);
                        review.find('.find').show();
                    }
                }
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
                        if(total === 0){   //清空没有评论提示信息
                            oUl.html('<li class="notList">暂无评论</li>');
                        }else{
                            oUl.find('.notList').remove();
                            if(dir){
                                oUl.prepend(createComment(res.data.comments[0]))
                            }else{
                                for(var i=0; i < szie; i++){
                                    oUl.append(createComment(res.data.comments[i]))
                                }
                                if(length+szie >= total){
                                    more.hide();
                                }else{
                                    if(total > limit){
                                        more.show();
                                    }
                                }
                            }
                        }
                        fn && fn();
                    })
                    .fail(function(error) {
                        console.log(error);
                    });
                };
                function createComment(data){    //生成评论列表
                    var img = !!data.byUser.imageid ? '<img src="/api/v2/web/thumbnail2/50/50/'+data.byUser.imageid+'" alt="'+data.byUser.username+'">' : '';
                    var reply = _this.cookie === '1' ? '<i class="iconfont reply" data-byusername="'+data.byUser.username+'" data-byuserid="'+data.byUser._id+'">&#xe616;</i>' : '';
                    return arr = [
                        '<li>',
                        '<div class="u-head u-head-radius u-head-w50">',
                        img,
                        '</div>',
                        '<h4><span>'+data.byUser.username+'</span><time>'+Date.timeAgo(data.date)+'</time></h4>',
                        '<p><span>'+textareaEscaped(data.content)+'</span>'+reply+'</p>',
                        '</li>'
                    ].join('');
                }
                function textareaEscaped(value) {
                    return value.toString().replace(/(\r)*\n/g, "<br />").replace(/\s/g, " ");
                }
                //输入框相关事件
                this.detail.on('focus','.contentMsg',function(event){   //输入框获取焦点

                }).on('blur','.contentMsg',function(event){   //输入框失去焦点
                    var parent = $(this).parents('.m-list');
                    if(!$.trim($(this).val())){
                        reset(parent)
                    }
                }).on('input propertychange keyup','.contentMsg',function(event){   //输入框正在输入时候
                    var parent = $(this).parents('.m-list');
                    var addMsg = parent.find('.addComment');
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
                        if(addCommentTo.notfind){
                            content = $.trim(contentMsg.val());
                            byuser = $(this).data('authorid');
                        }else{
                            content = '回复给  '+addCommentTo.byusername+"：  "+$.trim(contentMsg.val());
                        }
                    }else{
                        byuser = $(this).data('authorid');
                        content = $.trim(contentMsg.val());
                    }
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
                        if(!!res.err_msg){
                            var template = '<div class="modal-dialog">\
                                  <div class="modal-content">\
                                    <div class="modal-body">\
                                       <p class="text">很抱歉，'+res.err_msg+'</p>\
                                    </div>\
                                    <div class="modal-footer">\
                                      <button type="button" class="u-btns define">确定</button>\
                                    </div>\
                                  </div>\
                                </div>\
                              </div>';
                            _this.myConfirm(template,null,function(choose){
                                if(choose == 'yes') {
                                    parent.animate({width:0,height:0},function(){
                                        parent.remove();
                                    });
                                }
                            });
                        }
                        if(res.msg === "success"){
                            var strong = parent.find('.click-review strong');
                            var review = parent.find('.click-review .review');
                            var num = parseInt(review.text(),10) + 1;
                            strong.fadeIn(function(){
                                review.html(num);
                            });
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
                    addMsg.attr({'class':'u-btns addComment u-btns-disabled'});
                }
                this.detail.on('click','.more',function(event){    //加载更多评论
                    var parent = $(this).parents('.m-list');
                    var length = $(this).prevAll('.list').find('li').size();
                    var id = $(this).data('topicid');
                    getComment(parent,id,length,10,false);
                });
            },
            lightBox : function(){
                var doc = $(document);
                var timer = null;
                var _this = this;
                var images = [];
                var iNum = 0;
                var $section = this.detail.find('.m-list');
                $section.on('click','.lightBox',function(){
                    var parent = $(this).parents('.m-list');
                    var title = parent.data('label');
                    var img = parent.find('.lightBox');
                    var length = img.size();
                    iNum = $(this).index();
                    setImgarr(img);
                    lightBox(title,$(this).index(),length);
                });
                function setImgarr(arr){
                    arr.each(function(index, el) {
                        images.push({
                            imageid : $(this).data('imageid'),
                            width : $(this).data('width'),
                            height : $(this).data('height'),
                        });
                    });
                }
                function lightBox(title,index,length){
                    var winW = $(window).width();
                    var winH = $(window).height();
                    var w = winW < 1000 ? winW : 1000;
                    var h = winH - 200;
                    var str =   '<div class="lightBox-header f-cb">\
                                    <h3 class="f-fl title">'+title+'阶段</h3>\
                                    <span class="pagenum f-fl"></span>\
                                    <span class="close f-fr"><i class="iconfont">&#xe642;</i></span>\
                                </div>\
                                <div class="lightBox-body">\
                                    <div class="img">\
                                        <img alt="" />\
                                        <div class="toggle">\
                                          <span class="prev '+(index === 0 ? "hide" : '')+'"><i class="iconfont">&#xe611;</i></span>\
                                          <span class="next '+(index === length-1 ? "hide" : '')+'"><i class="iconfont">&#xe617;</i></span>\
                                        </div>\
                                    </div>\
                                </div>';
                    var lightBox = $('<div class="k-lightBox"><div class="lightBox-content">'+str+'</div></div>');
                    var mask = $('<div class="k-lightBox-mask"></div>');
                    _this.body.append(mask);
                    mask.fadeIn();
                    _this.body.append(lightBox);
                    var content = lightBox.find('.lightBox-content');
                    var body = content.find('.lightBox-body');
                    var img = body.find('img');
                    var pagenum = lightBox.find('.pagenum');
                    lightBox.fadeIn();

                    lightBox.on('click','.close',function(){
                        mask.remove();
                        lightBox.remove();
                        images = [];
                        doc.off('.moveTo');
                    });
                    var prev = content.find('.prev');
                    var next = content.find('.next');
                    lightBox.on('click','.prev',function(){
                        moveTo('prev');
                    });
                    lightBox.on('click','.next',function(){
                        moveTo('next');
                    });
                    function moveTo(me){
                        if(me === 'prev'){
                            if(iNum == 0){
                                iNum = 0;
                            }else{
                                iNum--;
                            }
                        }else if(me === 'next'){
                            if(iNum == length - 1){
                                iNum = length - 1;
                            }else{
                                iNum++;
                            }
                        }
                        prev.toggleClass('hide',iNum < 1);
                        next.toggleClass('hide',iNum > length - 2);
                        setImgSize(iNum);
                    }
                    doc.on('keydown.moveTo',function(event){
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
                    doc.one('mousewheel.moveTo',mousewheelFn);
                    doc.on('mousewheel.moveTo',function(ev){
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
                            doc.one("mousewheel.moveTo",mousewheelFn);
                        },1200);
                    }
                    body.css({
                        'width': w,
                        'height': h - 85,
                        'left' : 0,
                        'text-align':'center'
                    });
                    content.animate({
                        'height'   : h,
                        'top': 100
                    });
                    var $img = body.find('.img');
                    setImgSize(index);
                    function setImgSize(index){
                        var imgW,imgH;
                        var iW = images[index].width;
                        var iH = images[index].height;
                        var tuH = h - 85;
                        var iWs,iHs,is;
                        if(iW > w){
                            iWs = w/iW;
                        }else{
                            iWs = 1;
                        }
                        if(iH > tuH){
                            iHs = tuH/iH;
                        }else{
                            iHs = 1;
                        }
                        if(iWs > iHs){
                            is = iHs
                        }else{
                            is = iWs
                        }
                        if(is*iW > w){
                            imgW = w;
                            imgH = is*iH*(w/(is*iW));
                        }else{
                            imgW = is*iW;
                        }
                        if(is*iH > tuH){
                            imgW = is*iW*(tuH/(is*iH));
                            imgH = tuH;
                        }else{
                            imgH = is*iH
                        }
                        pagenum.html('<strong>'+(index+1)+'</strong>/'+length);
                        $img.css({
                            'position':'relative',
                            'width': imgW,
                            'height': imgH,
                            'margin-top':(tuH-imgH)/2,
                            'margin-left':(w-imgW)/2
                        })
                        img.css({
                            'width': imgW,
                            'height': imgH
                        }).attr('src', '/api/v2/web/image/'+images[index].imageid);
                    }
                }
            },
            myConfirm : function(template,msg,callback){
                var modat = template || '<div class="modal-dialog">\
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
            }
        };
        var detail = new Detail();
        detail.init();
});
