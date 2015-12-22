require.config({
    baseUrl: '../../static/js/',
    paths  : {
        jquery: 'lib/jquery-1.11.1.min',
        lodash : 'lib/lodash.min'
    },
    shim   : {
        'jquery.cookie': {
            deps: ['jquery']
        }
    }
});
require(['jquery','lodash','lib/jquery.cookie','utils/user','utils/search','utils/goto'],function($,_,cookie,User,Search,Goto){
        var user = new User();
        user.init();
        var search = new Search();
        search.init();
        var goto = new Goto();
        goto.init();
});