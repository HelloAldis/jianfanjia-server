require.config({
    baseUrl: '/static/js/',
    paths  : {
        jquery: 'lib/jquery',
        cookie : 'lib/jquery.cookie'
    }
});
require(['jquery','index/search'],function($,Search){
    var search = new Search();
    search.init();
});
require(['jquery', 'lib/jquery.cookie', 'utils/common', 'utils/tooltip'], function ($, cookie, common, Tooltip) {
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
            this.goto.init();
            if($.cookie("usertype") === '1'){
                require(['design/addIntent'],function(AddIntent){
                    (new AddIntent(this.home)).init();
                });
            }
            this.loadmore();
            this.fixed();
            this.loadList(this.toFrom);
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
        }
    };
    var home = new Home();
    home.init();
});
