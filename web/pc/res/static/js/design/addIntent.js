define(['jquery','lib/jquery.cookie','utils/common','lib/jquery.fly.min'],function($,cookie,common){
    var user = new common.User();
    user.init();
    var goto = new common.Goto;
        goto.init({
                    shop : true
                })
    var user = new common.User();
        user.init();
    var AddIntent = function(){}
    AddIntent.prototype.init = function(){
        this.bindEvent();
    }
    AddIntent.prototype.bindEvent = function(){
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
                    addOffset = goto.offset();
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
                                goto.addDesigners();
                                user.updateData();
                                this.destory();
                            }
                        });
                        off = true;
                    }
                });

            });
    }
    return AddIntent;
})
