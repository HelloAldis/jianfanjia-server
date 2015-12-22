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
require(['jquery','lodash','lib/jquery.cookie','utils/user'],function($,_,cookie,User){
    var user = new User();
    user.init();
});               