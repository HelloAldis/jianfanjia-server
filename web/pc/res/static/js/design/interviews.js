define(['jquery','design/interviewsData'],function($,data){
    var Interviews = function(id){
        this.id = $(id);
        this.timer = null;
        this.num = 0;
    }
    Interviews.prototype.init = function() {
        this.createList(data);
    };
    Interviews.prototype.createList = function(data) {
        var str = '<div class="sidepic">\
                        <span class="arrow"><em></em><i class="iconfont2">&#xe604;</i></span>\
                        <ul>';
        var btn = '<div class="btns">';
            for (var i = 0,len = data.length; i < len; i++) {
                str += '<li>\
                            <a href="/tpl/interviews/'+data[i]._id+'.html">\
                                <img src="/api/v2/web/thumbnail2/258/258/'+data[i].imageid+'" alt="'+data[i].username+'">\
                            </a>\
                        </li>';
                btn += '<span class="'+(i === 0 ? 'active' : '')+'"></span>'
            }
            str += '</ul></div>';
            if(data.length > 1){
                btn += '</div>';
                str += btn;
            }

            str += '<div class="title">\
                        <h4>'+data[0].username+'专访第'+data[0].number+'期：</h4>\
                        <p>'+data[0].title+'</p>\
                    </div>\
                    <a class="jump" href="/tpl/interviews/'+data[0]._id+'.html">前往查看</a>'
        this.id.find('.m-ct').html(str);
        data.length && this.bindEvent();
        data.length && this.auto();
    };
    Interviews.prototype.bindEvent = function(){
        var _this = this;
        this.id.on('click','.btns span',function(event){
            event.stopPropagation();
            _this.num = $(this).index();
            this.auto(_this.num);
        });
    };
    Interviews.prototype.auto = function(){
        var _this = this;
        var aSpan = this.id.find('.btns span');
        var oUl = this.id.find('.sidepic ul');
        var oH4 = this.id.find('.title h4');
        var oP = this.id.find('.title p');
        var oJump = this.id.find('.jump');
        function move(i){
            aSpan.eq(i).addClass('active').siblings('span').removeClass('active');
            oUl.stop().animate({'left':-i*258});
            oH4.html(data[i].username+'专访第'+data[i].number+'期：');
            oP.html(data[i].title);
            oJump.attr('href', '/tpl/interviews/'+data[i]._id+'.html');
        }
        move(this.num);
        timer = setInterval(function(){
            _this.num++;
            _this.num %= aSpan.size();
            move(_this.num);
        },5000);
        this.id.hover(function(){
            clearInterval(_this.timer);
        },function(){
            clearInterval(_this.timer);
            _this.timer = setInterval(function(){
                _this.num++;
                _this.num %= aSpan.length;
                move(_this.num);
            },5000);
        })
    }
    return Interviews;
});
