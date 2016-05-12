define(['jquery'],function($){
    var Tabs = function(id,type,fn){
        this.id = id;
        this.type = type || 'click';
        this.fn = fn || function(){};
    };
    Tabs.prototype.init = function(){
        var tab = $(this.id).find('.tab li');
        var list = $(this.id).find('.box .list');
        this.bind(tab,list);
    }
    Tabs.prototype.bind = function(tab,list){
        var _this = this;
        tab.on(this.type,function(){
            $(this).addClass('active').siblings().removeClass('active');
            list.eq($(this).index()).removeClass('hide').siblings().addClass('hide');
            _this.fn && _this.fn($(this).index());
        });
    }
    return Tabs;
})

