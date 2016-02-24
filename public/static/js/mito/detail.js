require.config({
    baseUrl: '/static/js/',
    paths  : {
        jquery: 'lib/jquery',
        lodash : 'lib/lodash'
    }
});
require(['jquery','lodash'],function($,_){
    var Detail = function(){};
    Detail.prototype = {
        init  : function(){
            this.winHash = window.location.search.substring(1) ? this.strToJson(window.location.search.substring(1)) : undefined;
            this.detail = $("#j-detail");
            this.main = this.detail.find('.m-mn');
            this.side = this.detail.find('.g-sd');
            this.close = this.detail.find('.close');
            this.setHeight(92);
            if(this.winHash){
                this.loadImg(this.winHash);
            }
            this.bindEvent();
            this.loadList();
        },
        loadList : function(){
            var self = this;
            $.ajax({
                url:RootUrl+'api/v2/web/beautiful_image_homepage',
                type: 'POST',
                contentType : 'application/json; charset=utf-8',
                dataType: 'json',
                data : JSON.stringify(                    {
                  "_id": self.winHash.pid
                }),
                processData : false
            })
            .done(function(res) {
                self.createInfo(res.data)
            })
            .fail(function() {
               window.location.href = '/404.html';
            });
        },
        loadImg : function(data){
            if(!!data.imgid){
                this.main.find('.img').html('<img src="/api/v2/web/image/'+data.imgid+'" /><span class="zoom"></span>').hide().fadeIn(500);
            }else{
                window.location.href = '/404.html';
            }
        },
        createInfo  :  function(data){
            var self = this;
            var tags = '';
            var title = '';
            var oImg = this.main.find('.img');
            if(data.section != undefined){
                title += '<span>'+data.section+'</span>'
            }
            if(data.house_type != undefined){
                title += '<span>'+globalData.house_type(data.house_type)+'</span>'
            }
            if(data.dec_style != undefined){
                title += '<span>'+globalData.dec_style(data.dec_style)+'</span>'
            }
            /*if(data.dec_type != undefined){
                title += '<span>'+globalData.dec_type(data.dec_type)+'</span>'
            }*/
            var key = data.keywords.split(",");
            for (var i = 0; i < key.length; i++) {
                tags += '<span>'+key[i]+'</span>'
            };
            var arr = [
                '<div class="title">',
                    '<h2>'+data.title+'</h2>',
                    '<p>'+title+'</p>',
                '</div>',
                '<div class="info">',
                    '<span class="head"><img src="/static/img/design/head.jpg" alt="简繁家"></span>',
                    '<dl><dt>简繁家</dt><dd>让装修变得简单</dd></dl></div>',
                '<div class="tags">'+tags+'</div>',
                '<div class="related"><h3>相关图片</h3><ul>'
            ];
            _.forEach(data.associate_beautiful_images, function(n, key) {
                arr.push('<li><a href="/tpl/mito/detail.html?pid='+n._id+'&imgid='+n.images[0].imageid+'&imgw='+n.images[0].width+'&imgh='+n.images[0].height+'"><img src="/api/v2/web/thumbnail/106/'+n.images[0].imageid+'" alt=""></a></li>')
            });
            arr.push('</ul></div>');
            self.side.html(arr.join('')).animate({right: 0},function(){
                self.close.fadeIn();
            })
            if(data.previous.beautiful_images.length != 0){
                var left = '<a class="toggle prev" href="/tpl/mito/detail.html?pid='+data.previous.beautiful_images[0]._id+'&imgid='+data.previous.beautiful_images[0].images[0].imageid+'&imgw='+data.previous.beautiful_images[0].images[0].width+'&imgh='+data.previous.beautiful_images[0].images[0].height+'"><i class="iconfont">&#xe611;</i></a>';
                oImg.append(left);
            }
            if(data.next.beautiful_images.length != 0){
                var right = '<a class="toggle next" href="/tpl/mito/detail.html?pid='+data.next.beautiful_images[0]._id+'&imgid='+data.next.beautiful_images[0].images[0].imageid+'&imgw='+data.next.beautiful_images[0].images[0].width+'&imgh='+data.next.beautiful_images[0].images[0].height+'"><i class="iconfont">&#xe617;</i></a>';
                oImg.append(right);
            }

        },
        createStep : function(data,process){
            var arr = ['<ul class="list">'],
                li ;
                for (var i = 0 , len = data.length; i < len; i++) {
                    var img = '';
                    li = '<li><dl class="'+(i == process ? 'current' : 'active')+'"><dt>'+globalData.dec_flow(data[i].name)+'</dt><dd>'+this.format(data[i].date , 'yyyy年MM月dd日')+'</dd></dl><div class="step"><span class="arrow"><i></i></span><ul class="img f-cb">';
                    for (var j = 0 , len2 = data[i].images.length; j < len2; j++) {
                        img += '<li class="'+(j%5 === 0 ? 'first' : '')+'"><img src="/api/v2/web/thumbnail/185/'+data[i].images[j]+'" alt=""></li>';
                    }
                    li += img + '</ul>';
                    if(data[i].description){
                       li += '<p class="txt">'+data[i].description+'</p>';
                    }
                    li += '</div></li>';
                     arr.push(li);
                }
                arr.push('</ul>');
                this.step.html(arr.join(''));
                goto.init();
        },
        setHeight : function(diff){
            this.main.height($(window).height() - diff);
        },
        bindEvent : function(){
            var self = this;
            $(window).on('resize',function(){
                self.throttle(self.setHeight(92),{context : self})
            });
            this.bindZoom();
        },
        bindZoom : function(){
            var self = this;
            var zoom = this.main.find('.zoom');
            zoom.on('click',function(){
                var _this = $(this);
                if($(this).hasClass('zooming')){
                    self.side.fadeIn();
                    self.setHeight(92);
                    self.main.css('margin','46px 420px 46px 20px');
                    $(this).removeClass('zooming');
                }else{
                    self.side.fadeOut(function(){
                        _this.animate({
                            'right' : 50,
                            'bottom' : 50
                        })
                        self.main.animate({
                            'marginRight':20
                        },function(){
                            self.setHeight(0);
                            self.main.animate({
                                'marginTop':0,
                                'marginBottom':0,
                            },function(){
                                _this.addClass('zooming')
                            })
                        });
                    });


                }
            })
        },
        throttle  : function(){
            var isClear = arguments[0],fn;
            if(_.isBoolean(isClear)){
                fn = arguments[1];
                fn._throttleID && clearTimeout(fn._throttleID)
            }else{
                fn = isClear;
                param = arguments[1];
                var oP = _.assign({
                    context : null,
                    args : [],
                    time : 300
                },param);
                arguments.callee(true,fn);
                fn._throttleID = setTimeout(function(){
                    fn.apply(oP.context , oP.args)
                }, oP.time)
            }
        },
        strToJson : function(str){    // 字符串转对象
            var json = {},temp;
            if(str.indexOf("&") != -1){
                var arr = str.split("&");
                for (var i = 0,len = arr.length; i < len; i++) {
                    temp = arr[i].split("=");
                    json[temp[0]] = temp[1];
                }
            }else{
                temp = str.split("=");
                json[temp[0]] = temp[1];
            }
            return json;
        }
    };
    var detail = new Detail();
    detail.init();
})
