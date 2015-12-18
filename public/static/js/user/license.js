require.config({
    baseUrl: '/static/js/',
    paths  : {
        jquery: 'lib/jquery-1.11.1.min',
        lodash : 'lib/lodash.min'
    },
    shim   : {
        'jquery.cookie': {
            deps: ['jquery'],
            exports: 'jQuery.fn.cookie'
        }
    }
});
require(['jquery','lodash','lib/jquery.cookie','utils/search','utils/goto','utils/user'],function($,_,cookie,Search,Goto,User){
    var search = new Search();
    search.init();
    var goto = new Goto();
    goto.init();
    var user = new User();
    user.init();
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