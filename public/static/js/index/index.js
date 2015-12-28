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
    goto.init({scroll : false});
})
require(['jquery','lodash','lib/jquery.cookie','index/banner','utils/designers','index/live','index/mito','utils/raiders'],function($,_,cookie,Banner,Designers,Live,Mito,Raiders){
	var banner = new Banner();
	banner.init({
		id       : '#j-banner',
	});
	var designers = new Designers();
	designers.init({
		id       : '#j-designers .m-list',
		template : [
			'<%_.forEach(datas, function(item) {%>',
		    '<li>',
		    '<a href="tpl/design/home.html?<%=item._id%>">',
		    '<img src="api/v2/web/thumbnail/140/<%=item.imageid%>" alt="">',
		    '<span><%=item.username%></span>',
		    '</a>',
		    '</li>',
		    '<%});%>'
		],
		limit : 6
	});
	var live = new Live();
	live.init({
		id       : '#j-live',
		limit : 10
	});
	var mito = new Mito();
	mito.init({
		id  : '#j-mito .m-ct'
	})
	var raiders = new Raiders();
	var template = [
	        '<dl>',
	            '<dt>',
	                '<div class="angle">',
	                    '<span class="white"></span>',
	                    '<span class="other"></span>',
	                '</div>',
	                '<h4><%=item.title%></h4>',
	            '</dt>',
	            '<dd>',
	                '<%_.forEach(item.data, function(arr) {%>',
	                    '<a href="/tpl/article/detail.html?pid=<%=arr._id%>">',
	                        '<img src="/api/v2/web/thumbnail/212/<%=arr.cover_imageid%>" alt="<%=arr.title%>">',
	                        '<span><%=arr.title%></span>',
	                    '</a>',
	                '<%});%>',
	            '</dd>',
	        '</dl>'
		]
	raiders.init({
		id       : '#j-raiders .m-ct',
		templatebk : template,
		templatets : template,
		limit : 5
	})
});
