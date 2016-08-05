define(['jquery'],function($){
    var Scrollswitch = function(ops){
        this.id = $(ops.id);
        this.count = ops.count;
        this.offset = ops.offset;
        this.hover = ops.hover === undefined ? false : ops.hover;
        this.auto = ops.auto === undefined || ops.auto;
        this.interval = this.auto && ops.interval !== undefined ? ops.interval : 5000;
    }
    Scrollswitch.prototype.init = function(){
        this.ul = this.id.find('ul');
        this.liW = this.ul.find('li').eq(0).width();
        this.timer = null;
        if(this.hover){
            this.id.find('.toggle').hide();
        }else{
            this.id.find('.toggle').show();
        }
        this.monitor();
        this.bindEvent();
        this.bindHover();
        if(this.auto){
            this.autoPlay();
        }
    }
    Scrollswitch.prototype.toggle = function(dir){
        var _this = this;
        if(dir === 'prev'){
            var first = this.ul.find('li').first();
            this.ul.stop().animate({left: -_this.liW*2},function(){
                _this.ul.append(first).css('left',-_this.liW);
            });
        }else if(dir === 'next'){
            var last = this.ul.find('li').last();
            this.ul.stop().animate({left: 0},function(){
                _this.ul.prepend(last).css('left',-_this.liW)
            });
        }
    }
    Scrollswitch.prototype.autoPlay = function(){
        var _this = this;
        clearInterval(this.timer);
        this.timer = setInterval(function(){
            _this.toggle('next');
        }, _this.interval);
    }
    Scrollswitch.prototype.bindHover = function(){
        var _this = this;
        this.id.hover(function() {
            clearInterval(_this.timer);
            if(_this.hover){
                _this.id.find('.toggle').show();
            }
        }, function() {
            if(_this.hover){
                _this.id.find('.toggle').hide();
            }
            if(_this.auto){
                _this.autoPlay();
            }
        });
    }
    Scrollswitch.prototype.bindEvent = function(){
        var _this = this;
        var aLi = this.ul.find('li');
        if(this.count >= aLi.size()){
            var str = this.ul.html();
            this.ul.append(str);
        }
        this.liW = aLi.outerWidth(true);
        this.id.on('click','.prev',function(){
            _this.toggle('next');
        });
        this.id.on('click','.next',function(){
            _this.toggle('prev');
        });
        this.ul.prepend(this.ul.find('li').last()).css('left',-this.liW);
    }
    Scrollswitch.prototype.monitor = function(){
        var _this = this;
        var winH = $(window).height();
        $(window).on('scroll',function(){
            if($(document).scrollTop()+winH >=  _this.offset){
                _this.loadimg();
            }
        });
        if($(document).scrollTop()+winH >=  _this.offset){
            _this.loadimg();
       }
    }
    Scrollswitch.prototype.loadimg = function(){
        this.ul.find('img').each(function(index, el) {
            $(el).attr('src', $(el).data('src'));
        });
        if(this.auto){
            this.autoPlay();
        }else{
            this.id.find('.toggle').hide();
        }
    }
    Scrollswitch.prototype.stop = function(){
        clearInterval(this.timer);
        this.ul.stop();
        this.id.off('hover');
    }
    return Scrollswitch;
});
