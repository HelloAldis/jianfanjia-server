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
require(['jquery','lodash','lib/jquery.cookie','utils/common'],function($,_,cookie,common){
    var user = new common.User();
    user.init();
    var search = new common.Search();
    search.init();
    var goto = new common.Goto();
    goto.init();
});
require(['jquery','lodash','lib/jquery.cookie'],function($,_,cookie){
    function loadList(url){
        $.ajax({
            url:RootUrl+'api/v2/web/designer/agree',
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
    $('#agree').on('click',function(){
        if($(this).hasClass('active')){
            $(this).attr('class','')
        }else{
            $(this).attr('class','active')
        }
    })
    $('#apply').on('click',function(){
        if($('#agree').hasClass('active')){
            loadList('designer.html#/infor');
        }else{
            alert('请先同意入驻协议协议')
            return false;
        }
    })
});
