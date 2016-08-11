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
require(['jquery','lib/jquery.cookie','index/goto'],function($,cookie,Goto){
    var goto = new Goto();
    $(function(){
        goto.init();
    })
    if($.cookie("usertype") !== undefined){
        require(['jquery','index/user'],function($,User){
            var user = new User('#j-user');
            $(function(){
                user.init();
            })
        });
    }
});
