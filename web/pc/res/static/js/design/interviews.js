define(['jquery','design/interviewsData'],function($,data){
    var Interviews = function(id){
        this.id = $(id);
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
            str += '</ul></div>'
            if(data.length > 1){
                str += btn;
                this.bindEvent();
            }
            str += '<div class="title">\
                        <h4>'+data[0].username+'专访第'+data[0].number+'期：</h4>\
                        <p>'+data[0].title+'</p>\
                    </div>\
                    <a class="jump" href="/tpl/interviews/'+data[0]._id+'.html">前往查看</a>'
        this.id.find('.m-ct').html(str);
    };
    Interviews.prototype.bindEvent = function(){
        var oUl = this.id.find('ul');
        this.id.on('click','.btns span',function(e){
            oUl.stop.animate({left: -$(this).index()*258});
            $(this).addClass('active').siblings().removeClass('active');
            text($(this).index());
        });
        function text(i){
            this.id.find('.title h4').html(data[i].username+'专访第'+data[i].number+'期：');
            this.id.find('.title p').html(data[i].title);
            this.id.find('.jump').attr('href', '/tpl/interviews/'+data[0]._id+'.html');
        }
    };
    return Interviews;
})
