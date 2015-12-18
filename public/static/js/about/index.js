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
require(['jquery','lib/jquery.cookie','utils/goto','utils/search'],function($,cookie,Goto,Search){
    var search = new Search();
    search.init({
        id     : '#j-sch',
        urlAPI : [
            {
                title : '设计师',
                url   : '/tpl/design/index.html',
                api   : 'api/v2/web/designer/search'
            },
            {
                title : '装修美图',
                url   : '/tpl/mito/index.html',
                api   : 'api/v2/web/search_beautiful_image'
            }
        ]
    })
    var goto = new Goto();
    goto.init();
})
