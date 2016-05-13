define(['jquery','index/Scrollswitch'], function($,Scrollswitch){
    var Potter = function(id){
        this.id = id;
    }
    Potter.prototype.init = function(){
        this.loadList();
        this.roll = null;
        this.doc = $(document);
    };
    Potter.prototype.loadList = function(){
        var _this = this;
        $.ajax({
            url:'/api/v2/web/designer/search',
            type: 'POST',
            contentType : 'application/json; charset=utf-8',
            dataType: 'json',
            data : JSON.stringify({
              "query":{
                "tags" : "匠心定制"
              }
            }),
            processData : false
        })
        .done(function(res){
            if(!!res.data.total){
                _this.createList(res.data);
            }
        });
    };
    Potter.prototype.createList = function(data){
        var str = '';
        for(var i=0,len = data.total; i < len; i++){
            str += '<li>\
                        <a href="/tpl/designer/'+data.designers[i]._id+'">\
                            <img class="u-head u-head-radius" src="/api/v2/web/thumbnail2/130/130/'+data.designers[i].imageid+'" alt="'+data.designers[i].username+'" >\
                            <span></span>\
                            <strong>'+data.designers[i].username+'</strong>\
                        </a>\
                    </li>';
        }
        if(data.total < 10){
            str += '<li class="not addJoin">\
                        <strong>等待加入</strong>\
                    </li>'
        }
        $(this.id).find('.roll ul').html(str);
        this.bindEvent(data.total);
        this.bindJoin();
    };
    Potter.prototype.bindEvent = function(total) {
        this.roll = new Scrollswitch({
            id :  $(this.id),
            count : 6,
            auto : total > 5,
            hover : true,
            offset :  $(this.id).offset().top
        });
        this.roll.init();
    };
    Potter.prototype.bindJoin = function() {
        var _this = this;
        this.doc.on('click','.addJoin',function(){
            _this.createJoin();
            _this.doc.find('.k-join').hide().fadeIn();
            _this.roll.stop();
        });
        this.destroyJoin();
    };
    Potter.prototype.createJoin = function(){
        var str =   '<div class="k-join">\
                        <div class="mask"></div>\
                        <div class="join">\
                            <p>大牌设计师入驻简繁家请咨询热线：4008-5151-67</p>\
                            <button class="u-btns k-join-btns">确定</button>\
                        </div>\
                    </div>';
        $('body').append(str);
    };
    Potter.prototype.destroyJoin = function(){
        var _this = this;
        this.doc.on('click','.k-join-btns',function(){
            _this.doc.find('.k-join').remove();
            _this.roll.autoPlay();
        });
    }
    return Potter;
})
