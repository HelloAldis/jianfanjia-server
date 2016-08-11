require.config({
    baseUrl: '/static/js/',
    paths  : {
        jquery: 'lib/jquery',
        lodash : 'lib/lodash'
    },
    shim   : {
        'jquery.cookie': {
            deps: ['jquery']
        }
    }
});
require(
    ['jquery','lib/jquery.cookie','utils/common','design/addIntent'],
    function($,cookie,common,AddIntent){
    var search = new common.Search();
    search.init();
    var Home = function(){};
    Home.prototype = {
        init  : function(){
            this.home = $("#j-potter");
            this.product = this.home.find('.m-home-product');
            this.toFrom = 0;
            this.toPage = 1;
            var add = new AddIntent(this.home);
            add.init();
            this.loadmore();
        },
        loadList : function(){
            var self = this;
            $.ajax({
                url:'/api/v2/web/search_designer_product',
                type: 'POST',
                contentType : 'application/json; charset=utf-8',
                dataType: 'json',
                data : JSON.stringify({
                  "query":{
                    "designerid": self.winHash
                  },
                  "from": self.toFrom,
                  "limit" : 6
                }),
                processData : false
            })
            .done(function(res) {
                if(res.data.total <= 6){
                    self.product.find('.loadmore').hide();
                }else if(self.toFrom+6 >= res.data.total ){
                    self.product.find('.loadmore')
                }else{
                    self.product.find('.loadmore').fadeIn(500);
                }
                self.loadmore();
                if(res.data.total){
                    self.appendList(res.data.products)
                }
            });
        },
        loadmore : function(){
            var _this = this;
            var total = this.product.find('li').size();
            var limit = 6;
            var page = Math.round(total/limit)
            this.product.delegate('.loadmore','click',function(ev){
                ev.preventDefault();
                if(_this.toPage == page){
                    $(this).addClass('not').html('没有更多了').fadeIn(500);
                    _this.toFrom += 6;
                    _this.loadList(_this.product.find('li:gt('+_this.toFrom+'):lt('+(_this.toFrom+limit)+')'))
                }else{
                    _this.toPage++;
                }
                if($(this).hasClass('not')){
                    return ;
                }
                return false;
            })
        },
        loadList : function(li){
            li.hide().removeClass().fadeIn();
            li.find('img').attr('src', $(this).data('src'));
        }
    }
    var home = new Home();
    home.init();
})
