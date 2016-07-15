require.config({
    baseUrl: '/static/js/',
    paths  : {
        jquery: 'lib/jquery',
        lodash : 'lib/lodash',
        lazyload : 'lib/lazyload',
        cookie : 'lib/jquery.cookie'
    }
});
require(['jquery','index/search'],function($,Search){
    var search = new Search();
    search.init();
});
require(['jquery','lib/lazyload'],function($,lazyload){
    $(function(){
        $("img.lightBox").lazyload({
            effect : "fadeIn"
        });
    });
});
require(['jquery','lib/jquery.cookie','index/goto'],function($,cookie,Goto){
    var goto = new Goto();
    $(function(){
        goto.init();
    })
    if($.cookie("usertype") !== undefined){
        require(['jquery','index/user'],function($,User){
            var user = new User('#j-user');
            $(function(){
                user.init();
            })
        });
    }
});
require(['jquery','lodash','lib/jquery.mousewheel.min'],function($,_){
        var LightBox = function(){};
        LightBox.prototype = {
        init : function(pos){
            var _this = this;
            this.doc = $(document);
            this.arr = pos.arr || [];
            this.select = pos.select || '.lightBox';
            this.parent = pos.parent || this.doc;
            _this.lightBoxBindEvent(this.arr);
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
            console.log(arr)
            obj.attr('src','').attr('src','/api/v2/web/image/'+arr[k].images[v]);
        },
        lightBoxHide : function(obj){
            obj.hide().html('');
        }
    };
    var lightBox = new LightBox();
    var dec_flow = ['量房','开工','拆改','水电','泥木','油漆','安装','竣工'];
    var Detail = function(){};
        Detail.prototype = {
            init  : function(){
                this.detail = $("#j-detail");
                this.step = this.detail.find('.m-step');
                var aLi = this.step.find('> ul > li');
                var data = [];
                aLi.each(function(index, el) {
                    var img = $(el).find('img');
                    images = [];
                    img.each(function(index, el) {
                        images.push($(el).data('imageid'));
                    })
                    data.push({
                        'index' : index,
                        'name' : dec_flow[index],
                        'images' : images,
                        'length' : images.length
                    });
                });
                lightBox.init({
                    arr : data,
                    select : '.lightBox',
                    parent : this.detail
                });
           }
        };
        var detail = new Detail();
        detail.init();
});
