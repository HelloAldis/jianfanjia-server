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
    var iNum = 10;
    var timer = null;
    timer = setInterval(function(){
     iNum--;
     if(iNum == 0){
         clearInterval(timer)
         window.location.href = '/'
     }
    }, 1000)
})
