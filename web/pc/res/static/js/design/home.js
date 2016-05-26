require.config({
    baseUrl: '/static/js/',
    paths  : {
        jquery: 'lib/jquery',
        lodash : 'lib/lodash',
        cookie : 'lib/jquery.cookie'
    }
});
require(['jquery','index/search'],function($,Search){
    var search = new Search();
    search.init();
});
require(['jquery','cookie','utils/common','utils/tooltip'],function($,cookie,common,Tooltip){
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
            new Tooltip('.tooltip');
            if($.cookie("usertype") === '1'){
                require(['design/addIntent'],function(AddIntent){
                    (new AddIntent(this.home)).init();
                });
            }
            this.loadmore();
            this.fixed();
            this.remove();
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
            var page = Math.round(total/limit)
            this.product.delegate('.loadmore','click',function(ev){
                ev.preventDefault();
                if($(this).hasClass('not')){
                    return ;
                }
                if(_this.toPage >= page - 1){
                    $(this).addClass('not').html('没有更多了').fadeIn(500);
                }else{
                    _this.toPage++;
                }
                _this.toFrom += limit;
                _this.loadList(_this.toFrom);

            });
        },
        renderList : function(){
            var aLi = this.product.find('li');
            aLi.addClass('hide');
            this.loadList(this.toFrom+6,true);
            // 如果删除li多，长度不够点击就隐藏更多按钮
            if(aLi.size() < this.toFrom+7){
                this.product.find('.loadmore').hide();
            }
        },
        loadList : function(size,render){
            var aLi;
            if(size === 0){
               aLi = this.product.find('li:lt(6)');
            }else if(render){
               aLi = this.product.find('li:lt('+size+')');
            }else{
               aLi = this.product.find('li:gt('+size+'):lt(6)');
            }
            aLi.hide().removeClass('hide').fadeIn();
            aLi.find('img').each(function(index, el) {
                $(el).attr('src', $(this).data('src'));
            });
        },
        remove : function(){
            var _this = this;
            this.product.delegate('.remove','click',function(ev){
                ev.preventDefault();
                var id = $(this).data('uid');
                var parents = $(this).parents('li');
                _this.myConfirm('您确定要删除作品吗？',function(choose){
                    if(choose == 'yes') {
                        $.ajax({
                            url:'/api/v2/web/designer/product/delete',
                            type: 'POST',
                            contentType : 'application/json; charset=utf-8',
                            dataType: 'json',
                            data : JSON.stringify({
                              "_id": id
                            }),
                            processData : false
                        })
                        .done(function(res){
                            if(res.msg === "success"){
                                parents.remove();
                                _this.renderList();
                            }
                        });
                    }
                });
            });
        },
        myConfirm : function(msg,callback){
            var modat = '<div class="modal-dialog">\
                      <div class="modal-content">\
                        <div class="modal-body">\
                           <div class="icon">\
                                <i class="iconfont">&#xe619;</i>\
                           </div>\
                           <p class="text">'+msg+'</p>\
                        </div>\
                        <div class="modal-footer">\
                          <button type="button" class="u-btns u-btns-revise cancel">取消</button>\
                          <button type="button" class="u-btns define">确定</button>\
                        </div>\
                      </div>\
                    </div>\
                  </div>';
            var _this = this;
            var $modal = $('<div class="k-modal dialog" id="j-modal"></div>'),
                $backdrop = $('<div class="k-modal-backdrop" id="j-modal-backdrop"></div>');
                $modal.html(modat)
            this.body.append($backdrop);
            $backdrop.fadeIn();
            this.body.append($modal);
                $modal.fadeIn();
            $modal.find('.define').on('click',function(ev){
                ev.preventDefault();
                callback && callback('yes');
                hide()
            })
            function hide(){
                $modal.remove();
                $backdrop.remove();
            }
            $modal.find('.cancel').on('click',function(ev){
                ev.preventDefault();
                callback && callback('no');
                hide()
            })
        }
    }
    var home = new Home();
    home.init();
});
