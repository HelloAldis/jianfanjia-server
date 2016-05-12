require.config({
    baseUrl: '/static/js/',
    paths  : {
        jquery: 'lib/jquery',
        lodash : 'lib/lodash'
    },
    shim   : {
        'jquery.cookie': {
            deps: ['jquery']
        }
    }
});
require(['jquery','lodash','lib/jquery.cookie','utils/common','lib/jquery.mousewheel.min'],function($,_,cookie,common){
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
                this.cacheData = {}; //全局数据缓存
                this.winHash = window.location.search.substring(1);
                this.detail = $("#j-detail");
                this.info = this.detail.find('.m-info');
                this.step = this.detail.find('.m-step');
                this.loading = this.detail.find('.k-loading');
                this.loadList();
            },
            loadList : function(){
                var self = this;
                $.ajax({
                    url:RootUrl+'api/v2/web/search_share',
                    type: 'POST',
                    contentType : 'application/json; charset=utf-8',
                    dataType: 'json',
                    data : JSON.stringify({
                        "query":{
                            "_id": self.winHash
                        },
                        "from":0,
                        "limit":1
                    }),
                    processData : false
                })
                .done(function(res) {
                    self.loading.addClass('hide');
                    if(res.data.total == 1){
                        self.createInfo(res.data.shares[0]);
                    }
                })
                .fail(function() {
                   window.location.href = '/404.html';
                });
            },
            createInfo  :  function(data){
                var process = data.process[data.process.length-1].name,
                    arr = [
                        '<div class="covers f-fl">',
                            '<img src="/api/v2/web/thumbnail2/370/206/'+data.cover_imageid+'" alt="'+data.cell+'">',
                        '</div>',
                        '<div class="info f-fl">',
                            ''+(process == 7 && data.progress == 1 ? '<span class="end-icon"></span>' : "")+'',
                            '<h3>'+data.cell+(data.dec_type ? '<small>（'+globalData.dec_type(data.dec_type)+'）</small>':'')+'</h3>',
                            '<p><span>参考造价：'+data.total_price+'万元</span><span>包工类型：'+globalData.work_type(data.work_type)+'</span><span>户型：'+globalData.house_type(data.house_type)+'</span></p>',
                            '<p><span>面积：'+data.house_area+'m&sup2;</span></p>',
                            '<div class="step step'+process+'">',
                                '<div class="line"><div class="in"></div></div>',
                                '<ul class="status">'
                    ];
                    for (var i = 0; i < 8; i++) {
                        if(i < process){
                            arr.push('<li class="active"><div class="dot"></div><p>'+globalData.dec_flow(i)+'</p></li>');
                        }else if(i == process && data.progress == 0){
                            arr.push('<li class="current"><div class="dot"></div><p>'+globalData.dec_flow(i)+'</p></li>');
                        }else if(i == 7 && data.progress == 1){
                            arr.push('<li class="active"><div class="dot"></div><p>'+globalData.dec_flow(i)+'</p></li>');
                        }else{
                            arr.push('<li><div class="dot"></div><p>'+globalData.dec_flow(i)+'</p></li>');
                        }
                    }
                    arr.push('</ul></div></div>');
                    arr.push('<dl class="people f-fr"><dt>设计师</dt><dd><a href="/tpl/designer/'+data.designer._id+'"><img class="u-head u-head-w40 u-head-radius" src="/api/v2/web/thumbnail2/40/40/'+data.designer.imageid+'" alt="'+data.designer.username+'"><strong>'+data.designer.username+'</strong></a></dd>');
                    arr.push('<dt>项目经理</dt><dd><span><i class="iconfont">&#xe602;</i><strong>'+data.manager+'</strong></span></dd></dl>');
                    this.info.html(arr.join('')).removeClass('hide');
                    this.createStep(data.process,process,data.progress);
            },
            createStep : function(data,process,progress){
                var arr = ['<ul class="list '+(process == 7 && progress == 1 ? 'end' : '')+'">'],
                    li ;
                    for (var i = 0 , len = data.length; i < len; i++) {
                        var img = '';
                        li = '<li class="'+(i == process ? 'current' : 'active')+'"><dl><dt>'+globalData.dec_flow(data[i].name)+'</dt><dd>'+this.format(data[i].date , 'yyyy年MM月dd日')+'</dd></dl><div class="step"><span class="arrow"><i></i></span>';
                        for (var j = 0 , len2 = data[i].images.length; j < len2; j++) {
                            img += '<li class="'+(j%5 === 0 ? 'first' : '')+'"><img src="/api/v2/web/thumbnail2/185/185/'+data[i].images[j]+'" alt="" data-group="'+i+'" data-item="'+j+'" class="lightBox"></li>';
                        }
                        if(data[i].description){
                            li += '<h4 class="title">现场说明<span></span></h4><p class="txt">'+data[i].description+'</p>';
                        }
                        li += '<h4 class="title">直播照片<span></span></h4>';
                        li += '<ul class="img f-cb">' + img + '</ul>';
                        li += '</div></li>';
                        arr.push(li);
                    }
                    arr.push('</ul>');
                    this.step.html(arr.join('')).removeClass('hide');
                    goto.init();
                    lightBox.init({
                        arr : data,
                        select : '.lightBox',
                        parent : this.detail
                    });
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
            }
        };
        var detail = new Detail();
        detail.init();
});
