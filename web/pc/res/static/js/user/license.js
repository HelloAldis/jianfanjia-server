require.config({
    baseUrl: '/static/js/',
    paths  : {
        jquery: 'lib/jquery',
        lodash : 'lib/lodash',
        cookie : 'lib/jquery.cookie'
    }
});
require(['jquery','lodash','lib/jquery.cookie','utils/common'],function($,_,cookie,common){
    var user = new common.User();
    user.init();
    var search = new common.Search();
    search.init();
    var goto = new common.Goto();
    goto.init();
});
require(['jquery','lodash','cookie'],function($,_,cookie){
    var $apply = $('#apply'),
        $agree = $('#agree');
    function loadList(url){
        $.ajax({
            url:'/api/v2/web/designer/agree',
            type: 'POST',
            contentType : 'application/json; charset=utf-8',
            dataType: 'json'
        })
        .done(function(res){
            if(res.msg === 'success'){
                window.location.href = url;
            }
        })
    }
    $agree.on('click',function(){
        if($(this).hasClass('active')){
            $(this).attr('class','');
            $apply.attr('disabled', true).addClass('u-btns-disabled');
        }else{
            $(this).attr('class','active');
            $apply.attr('disabled', false).removeClass('u-btns-disabled');
        }
    })
    $apply.on('click',function(){
        if($agree.hasClass('active')){
            loadList('designer.html#/infor');
        }
        return false;
    })
});
