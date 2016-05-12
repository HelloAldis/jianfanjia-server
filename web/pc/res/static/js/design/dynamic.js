define(['jquery'], function($){
    var Dynamic = function(id){
        this.id = $(id);
    }
    Dynamic.prototype = {
        init : function(){
            this.loadList();
        },
        bindEvent : function(){
            var oUl = this.id.find('ul'),
                timer = null,
                auto = function(){
                    var last = oUl.find('li').last();
                    var img = last.find('img');
                    img.attr('src', img.data('src'));
                    oUl.stop().animate({top: 0},function(){
                        oUl.prepend(last).css('top',-55);
                    });
                };
                timer = setInterval(auto, 3000);
            this.id.hover(function() {
                clearInterval(timer);
            }, function() {
                clearInterval(timer);
                timer = setInterval(auto, 3000);
            });
        },
        loadList : function(){
            var _this = this;
            $.ajax({
                url:'/api/v2/web/top_designer_activity',
                type: 'POST',
                contentType : 'application/json; charset=utf-8',
                dataType: 'json',
                data : JSON.stringify({
                    "limit":20
                }),
                processData : false
            })
            .done(function(res){
                if(!!res.data.length){
                    _this.createList(res.data);
                }
            });
        },
        createList : function(data){
            var str = '';
            for(var i=0,len = data.length; i < len; i++){
                str += '<li>\
                            <img class="u-head u-head-w40 u-head-radius" data-src="/api/v2/web/thumbnail2/40/40/'+data[i].imageid+'" src="'+(i<=5 ? '/api/v2/web/thumbnail2/40/40/'+data[i].imageid : '../../static/img/public/load.gif')+'" alt="'+data[i].username+'">\
                            <h4>'+data[i].username+'</h4>\
                            <p>'+data[i].activity+'</p>\
                        </li>';
            }
            this.id.find('ul').html(str);
            if(data.length > 5){
                this.bindEvent();
            }
        }
    }
    return Dynamic;
})
