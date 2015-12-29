require(['utils/common'],function(common){
    var user = new common.User();
    user.init();
    var search = new common.Search();
    search.init();
    var goto = new common.Goto();
    goto.init();
})
