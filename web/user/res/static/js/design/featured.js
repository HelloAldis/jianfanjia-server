define(['jquery'], function($){
    var Featured = function(id){
        this.id = $(id);
    }
    Featured.prototype = {
        init : function(){
            this.loadList();
        },
        loadList : function(){
            var _this = this;
            $.ajax({
                url:'/api/v2/web/top_designers',
                type: 'POST',
                contentType : 'application/json; charset=utf-8',
                dataType: 'json',
                data : JSON.stringify({
                    "limit":4
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
                            <a href="/tpl/designer/'+data[i]._id+'">\
                                <span class="arrow"><em></em><i class="iconfont2">&#xe604;</i></span>\
                                <img src="/api/v2/web/thumbnail2/258/258/'+data[i].imageid+'" alt="'+data[i].username+'">\
                                <span class="txt">'+data[i].username+'</span>\
                            </a>\
                        </li>';
            }
            this.id.find('ul').html(str);
        }
    }
    return Featured;
});
