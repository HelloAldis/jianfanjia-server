'use strict';
(function() {
    // load modules
    angular.module('myJyzDesigner', ['ui.router','pasvaz.bindonce','controllers', 'services', 'filters' , 'directives','ngmodel.format','my.jyz'])
        .run(['$rootScope','$state','$stateParams', '$templateCache',function($rootScope,$state,$stateParams, $templateCache) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.$on('$stateChangeStart',function(){
            });
            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
                document.documentElement.scrollTop = document.body.scrollTop = 0;
            });
            $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
                alert('An error occurred while changing states: ' + error);
            });
        }])
        .config(function($stateProvider, $urlRouterProvider) {
            var url = '/tpl/user/designer/';
            $urlRouterProvider.otherwise('/index');
            $stateProvider
                .state('index', {     //设计师首页
                    url: '/index',
                    templateUrl: url+'index.html',
                    controller : 'indexCtrl'
                })
                .state('service', {     //设计师接单服务设置
                    url: '/service',
                    templateUrl: url+'service.html',
                    controller : 'serviceCtrl',
                    title : "接单资料"
                })
                .state('infor', {     //设计师编辑资料和提交认证
                    url: '/infor',
                    templateUrl: url+'infor.html',
                    controller : 'inforCtrl',
                    title : "基本资料认证",
                    onExit :  function(){
                        if(checkSupport() === 'flash'){
                            $('#fileToUpload').uploadify('destroy');
                            $('#createUpload2').uploadify('destroy');
                        }
                    }
                })
                .state('infoshow', {     //设计师资料审核期查看
                    url: '/infoshow',
                    templateUrl: url+'infoshow.html',
                    controller : 'infoshowCtrl',
                    title : "基本资料认证"
                })
                .state('requirementList', {   //需求列表
                    url: '/requirementList',
                    templateUrl: url+'requirementList.html',
                    controller : 'requirementListCtrl'
                })
                .state('requirement', {      //需求详情
                    url: '/requirement/:id',
                    templateUrl: url+'requirement.html'
                })
                .state('requirement.detail', {    //需求详情--需求描述
                    url: '/detail',
                    templateUrl: url+'detail.html'
                })
                .state('requirement.owner', {     //需求详情--响应业主
                    url: '/owner',
                    templateUrl: url+'owner.html'
                })
                .state('requirement.plan', {      //需求详情--方案列表
                    url: '/plan',
                    templateUrl: url+'plan.html'
                })
                .state('requirement.contract', {     //需求详情--生成合同
                    url: '/contract',
                    templateUrl: url+'contract.html'
                })
                .state('requirement.field', {     //需求详情---管理工地
                    url: '/field',
                    templateUrl: url+'field.html'
                })
                .state('requirement.fulfill', {   //需求详情----已竣工
                    url: '/fulfill',
                    templateUrl: url+'fulfill.html'
                })
                .state('createPlan', {     //需求详情--提交方案/修改方案
                    url: '/create/:id?userid&username&worktype&packagetype&baseprice&storage',
                    templateUrl: url+'create.html',
                    controller : 'createCtrl'
                })
                .state('configPlan', {     //需求详情--提交方案/修改方案
                    url: '/config/:id?userid&username&worktype&packagetype&baseprice',
                    templateUrl: url+'config.html',
                    controller : 'configCtrl'
                })
                .state('history', {      //历史订单列表
                    url: '/history',
                    templateUrl: url+'history.html',
                    controller : 'historyListCtrl'
                })
                .state('historyList', {      //需求详情
                    url: '/history/:id',
                    templateUrl: url+'historyList.html'
                })
                .state('historyList.detail', {    //需求详情--需求描述
                    url: '/detail',
                    templateUrl: url+'detail.html'
                })
                .state('historyList.owner', {     //需求详情--响应业主
                    url: '/owner',
                    templateUrl: url+'owner.html'
                })
                .state('historyList.plan', {      //需求详情--方案列表
                    url: '/plan',
                    templateUrl: url+'plan.html'
                })
                .state('historyList.contract', {     //需求详情--生成合同
                    url: '/contract',
                    templateUrl: url+'contract.html'
                })
                .state('historyList.field', {     //需求详情---管理工地
                    url: '/field',
                    templateUrl: url+'field.html'
                })
                .state('historyList.fulfill', {   //需求详情----已竣工
                    url: '/fulfill',
                    templateUrl: url+'fulfill.html'
                })
                .state('products', {      //作品列表
                    url: '/products',
                    template: '<div ui-view></div>'
                })
                .state('products.list', {      //作品列表
                    url: '/{id:[0-9]{1,6}}',
                    templateUrl: url+'products.html',
                    controller : 'productsListCtrl',
                    title : '我的作品'
                })
                .state('addProduct', {    //发布作品
                    url: '/release?list',
                    templateUrl: url+'release.html',
                    controller : 'releaseCtrl',
                    title : '发布作品',
                    onExit :  function(){
                        if(checkSupport() === 'flash'){
                            $('#createUpload1').uploadify('destroy');
                            $('#createUpload2').uploadify('destroy');
                        }
                    }
                })
                .state('updateProduct', {     //修改作品
                    url: '/release/:id?list',
                    templateUrl: url+'release.html',
                    controller : 'releaseCtrl',
                    title : '编辑作品',
                    onExit :  function(){
                        if(checkSupport() === 'flash'){
                            $('#createUpload1').uploadify('destroy');
                            $('#createUpload2').uploadify('destroy');
                        }
                    }
                })
                .state('favorite', {      //收藏作品
                    url: '/favorite',
                    abstract: true,
                    template: '<div ui-view></div>'
                })
                .state('favorite.list', {      //收藏作品
                    url: '/{id:[0-9]{1,6}}',
                    templateUrl: url+'favorite.html',
                    controller : 'favoriteProductCtrl',
                    title : '收藏作品'
                })
                .state('authHeart', {      //认证中心
                    url: '/authHeart',
                    templateUrl: url+'authHeart.html',
                    title : '认证中心'
                })
                .state('idcard', {      //身份认证
                    url: '/idcard',
                    templateUrl: url+'idcard.html',
                    controller : 'idcardCtrl',
                    title : "身份认证",
                    onExit :  function(){
                        if(checkSupport() === 'flash'){
                            $('#fileToUpload1').uploadify('destroy');
                            $('#fileToUpload2').uploadify('destroy');
                            $('#fileToUpload3').uploadify('destroy');
                        }
                    }
                })
                .state('idcardshow', {      //查看身份认证
                    url: '/idcardshow',
                    templateUrl: url+'idcardshow.html',
                    controller : 'idcardShowCtrl',
                    title : "身份认证"
                })
                .state('addteam', {      //添加施工团队
                    url: '/team?contract',
                    templateUrl: url+'team.html',
                    controller : 'teamCtrl',
                    title : "添加施工团队",
                    onExit :  function(){
                        if(checkSupport() === 'flash'){
                            $('#fileToUpload1').uploadify('destroy');
                            $('#fileToUpload2').uploadify('destroy');
                        }
                    }
                })
                .state('updateteam', {      //编辑施工团队
                    url: '/team/:id',
                    templateUrl: url+'team.html',
                    controller : 'teamCtrl',
                    title : "编辑施工团队",
                    onExit :  function(){
                        if(checkSupport() === 'flash'){
                            $('#fileToUpload1').uploadify('destroy');
                            $('#fileToUpload2').uploadify('destroy');
                        }
                    }
                })
                .state('teamList', {      //施工团队认证
                    url: '/teamList',
                    templateUrl:  url+'teamList.html',
                    controller : 'teamListCtrl',
                    title : "我的施工团队"
                })
                .state('phone', {      //手机修改
                    url: '/phone',
                    templateUrl: url+'phone.html',
                    controller : 'phoneCtrl',
                    title : "手机认证"
                })
                .state('email', {      //邮箱认证
                    url: '/email',
                    templateUrl: url+'email.html',
                    controller : 'emailCtrl',
                    title : "邮箱认证"
                })
                .state('notice', {      //系统公告
                    url: '/notice',
                    template: '<div ui-view></div>'
                })
                .state('notice.list', {   //系统公告列表
                    url: '/list',
                    templateUrl: url+'notice.html',
                    controller : 'noticeCtrl'
                })
                .state('notice.list.type', {    //系统公告列表
                    url: '/{id:[0-9]{1,6}}?type&status',
                    templateUrl: url+'noticeList.html',
                    controller : 'noticeListCtrl'
                })
                .state('notice.detail', {       //系统公告详情
                    url: '/detail/:id',
                    templateUrl: url+'noticeDetail.html',
                    controller : 'noticeDetailCtrl'
                })
                .state('remind', {             //需求提醒
                    url: '/remind',
                    template: '<div ui-view></div>'
                })
                .state('remind.list', {       //需求提醒列表
                    url: '/list',
                    templateUrl: url+'remind.html',
                    controller : 'remindCtrl'
                })
                .state('remind.list.type', {     //需求提醒列表
                    url: '/{id:[0-9]{1,6}}?type&status',
                    templateUrl: url+'remindList.html',
                    controller : 'remindListCtrl'
                })
                .state('comment', {     //评论列表
                    url: '/comment',
                    template: '<div ui-view></div>'
                })
                .state('comment.list', {     //评论列表
                    url: '/{id:[0-9]{1,6}}',
                    templateUrl: url+'comment.html',
                    controller : 'commentCtrl'
                });
        });
    // angular bootstrap
    angular.bootstrap(document, ['myJyzDesigner']);
})();
