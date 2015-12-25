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
});     