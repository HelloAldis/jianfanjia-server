require.config({
    baseUrl: '/static/js/',
    paths  : {
        jquery: 'lib/jquery',
        lodash : 'lib/lodash',
        lazyload : 'lib/lazyload',
        cookie : 'lib/jquery.cookie'
    }
});
require(['jquery','index/search'],function($,Search){
    var search = new Search();
    search.init();
});
require(['jquery','lazyload'],function($){
    $(function(){
        $("img.lazyimg").lazyload({
            effect : "fadeIn"
        });
    });
});
require(['jquery','cookie'],function($,cookie){
    var Home = function(){};
    Home.prototype = {
        init  : function(){
            this.home = $("#j-home");
            this.product = this.home.find('.m-home-product');
            this.toFrom = 0;
            this.toPage = 1;
            if($.cookie("usertype") !== undefined){
                require(['jquery','index/user'],function($,User){
                    (new User('#j-user')).init();
                });
            }
            if($.cookie("usertype") === '1'){
                require(['design/addIntent'],function(AddIntent){
                    (new AddIntent(this.home)).init();
                });
            }else{
                if($.cookie("usertype") !== undefined){
                    require(['jquery','index/user'],function($,User){
                        (new User('#j-user')).init();
                    });
                }
                require(['jquery','cookie',"index/goto"],function($,cookie,Goto){
                    (new Goto()).init();
                });
            }
            this.loadmore();
        },
        loadmore : function(){
            var _this = this;
            var total = this.product.find('li').size();
            var limit = 6;
            var page = Math.round(total/limit)
            this.product.delegate('.loadmore','click',function(ev){
                ev.preventDefault();
                if($(this).hasClass('not')){
                    return ;
                }
                if(_this.toPage == page){
                    $(this).addClass('not').html('没有更多了').fadeIn(500);
                }else{
                    _this.toPage++;
                }
                _this.toFrom += limit;
                _this.loadList(_this.toFrom);
            });
        },
        loadList : function(size){
            var aLi = this.product.find('li:gt('+(size-1)+'):lt(6)');
            aLi.hide().removeClass().fadeIn();
            aLi.find('img').each(function(index, el) {
                $(el).attr('src', $(this).data('src'));
            });
        }
    }
    var home = new Home();
    home.init();
});
