require.config({
    baseUrl: '/static/js/',
    paths  : {
        jquery: 'lib/jquery',
        lodash : 'lib/lodash',
        cookie : 'lib/jquery.cookie'
    }
});
require(['jquery','lodash','cookie','utils/common'],function($,_,cookie,common){
    $(function(){
        var user = new common.User();
        user.init();
        var search = new common.Search();
        search.init();
        var goto = new common.Goto();
        goto.init();
        var $help = $('#j-help');
        var $mn = $help.find('.g-mn');
        var $sd = $help.find('.g-sd');
        var aNav =  $sd.find('dd');
        var aDl = $mn.find('dl');
        aNav.each(function(index, el) {
            var $this = $(this);
            $this.on('click',function(){
                var index = $this.data('index');
                $this.addClass('active').siblings().removeClass();
                aDl.eq(index).removeClass().siblings().addClass('hide');
            })
        });
    })
})
