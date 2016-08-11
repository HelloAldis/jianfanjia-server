require.config({
    baseUrl: '/static/js/',
    paths  : {
        jquery: 'lib/jquery',
        cookie : 'lib/jquery.cookie',
        requestAnimationFrame : 'lib/jquery.requestAnimationFrame.min',
        fly : 'lib/jquery.fly.min'
    },
    shim   : {
        'jquery.requestAnimationFrame.min': {
            deps: ['jquery']
        },
        'jquery.fly.min': {
            deps: ['jquery']
        }
    }
});
require(['jquery','index/search'],function($,Search){
    var search = new Search();
    search.init();
});
require(['jquery', 'lib/jquery.cookie', 'utils/common', 'utils/tooltip','fly'], function ($, cookie, common, Tooltip) {
    var Home = function(){};
    Home.prototype = {
        init  : function(){
            this.body = $('body');
            this.home = $("#j-home");
            this.product = this.home.find('.m-home-product');
            this.toFrom = 0;
            this.toPage = 1;
            new Tooltip('.tooltip');
            this.user = new common.User();
            this.goto = new common.Goto();
            this.user.init2();
            this.goto.init({         //显示右侧菜单
                shop : true     //开启业主意向设计师菜单
            });
            this.loadmore();
            this.fixed();
            this.loadList(this.toFrom);
            this.AddIntent();
        },
        fixed : function(){
            var $follow = this.home.find('.m-follow');
            var $followTop = $follow.offset().top;
            $(window).on('scroll',function(){
                if($(this).scrollTop() >= $followTop){
                    $follow.addClass('fixed');
                }else{
                    $follow.removeClass('fixed');
                }
            });
        },
        loadmore : function(){
            var _this = this;
            var total = this.product.find('li').size();
            var limit = 6;
            var page = Math.round(total/limit);
            this.product.delegate('.loadmore','click',function(ev){
                ev.preventDefault();
                if($(this).hasClass('not')){
                    return ;
                }
                if(_this.toPage >= page){
                    $(this).addClass('not').html('没有更多了').fadeIn(500);
                }else{
                    _this.toPage++;
                }
                _this.toFrom += limit;
                _this.loadList(_this.toFrom);

            });
        },
        loadList : function(size){
            var aLi;
            if(size === 0){
               aLi = this.product.find('li:lt(6)');
            }else{
               aLi = this.product.find('li:gt('+(size-1)+'):lt(6)');
            }
            aLi.hide().removeClass('hide').fadeIn();
            aLi.find('img').each(function(index, el) {
                $(el).attr('src', $(this).data('src'));
            });
        },
        AddIntent : function(){
            var _this = this,
            off = true;
            $('.addIntent').on('click',function(ev){
                if(!$(this).hasClass('addIntent')){
                    return ;
                }
                if(!off){
                    return ;
                }
                off = false;
                var This = $(this),
                    addOffset = _this.goto.offset();
                var uidname = $(this).data('uid'),
                    head = $('.addIntentHead'),
                    img = head.find('img').attr('src')
                    state = head.offset(),
                    scrollTop = $(document).scrollTop();
                    flyer = $('<img class="u-flyer" src="'+img+'">');
                $.ajax({
                    url:'/api/v2/web/favorite/designer/add',
                    type: 'POST',
                    contentType : 'application/json; charset=utf-8',
                    dataType: 'json',
                    data : JSON.stringify({
                        "_id":uidname
                    }),
                    processData : false
                })
                .done(function(res) {
                    if(res.msg === "success"){
                        This.html('已添加').attr('href','/tpl/user/owner.html#/designer/1').removeClass('addIntent').addClass('u-btns-revise');
                        flyer.fly({
                            start: {
                                left: state.left,
                                top: state.top - scrollTop
                            },
                            end: {
                                left: addOffset.left+10,
                                top: addOffset.top+10,
                                width: 0,
                                height: 0
                            },
                            onEnd: function(){
                                _this.goto.addDesigners();
                                _this.user.updateData();
                                this.destory();
                            }
                        });
                        off = true;
                    }
                });
            });
        }
    };
    var home = new Home();
    home.init();
});
