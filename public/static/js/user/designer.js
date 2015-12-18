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
        },
        'lib/jquery.uploadify-3.1': {
            deps: ['jquery']
        },
        'lib/jquery.Huploadify': {
            deps: ['jquery']
        }
    }
});
require(['jquery','lodash','lib/jquery.cookie','utils/search','utils/goto','utils/user','lib/jquery.uploadify-3.1','lib/jquery.Huploadify'],function($,_,cookie,Search,Goto,User){
    var search = new Search();
    search.init();
    var goto = new Goto();
    goto.init();
    var user = new User();
    user.init();
});     