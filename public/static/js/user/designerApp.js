'use strict';
(function() {
    // load modules
    angular.module('myJyzDesigner', ['ui.router','pasvaz.bindonce','controllers', 'services', 'filters' , 'directives','ngmodel.format','my.jyz'])
        .run(['$rootScope','$state','$stateParams',function($rootScope,$state,$stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }])
        .config(function($stateProvider, $urlRouterProvider) {
            var url = RootUrl + 'tpl/user/designer/';
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
                    controller : 'serviceCtrl'
                })
                .state('infor', {     //设计师编辑资料和提交认证
                    url: '/infor',
                    templateUrl: url+'infor.html',
                    controller : 'inforCtrl'
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
                    url: '/create/:id',
                    templateUrl: url+'create.html',
                    controller : 'createCtrl'
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
                    controller : 'productsListCtrl'
                })
                .state('addProduct', {    //发布作品
                    url: '/release',
                    templateUrl: url+'release.html',
                    controller : 'releaseCtrl'
                })
                .state('updateProduct', {     //修改作品
                    url: '/release/:id',
                    templateUrl: url+'release.html',
                    controller : 'releaseCtrl'
                })
                .state('favorite', {      //收藏作品
                    url: '/favorite',
                    template: '<div ui-view></div>'
                })
                .state('favorite.list', {      //收藏作品
                    url: '/{id:[0-9]{1,6}}',
                    templateUrl: url+'favorite.html',
                    controller : 'favoriteProductCtrl'
                })
                .state('authHeart', {      //认证中心
                    url: '/authHeart',
                    templateUrl: url+'authHeart.html'
                })
                .state('idcard', {      //基本资料认证
                    url: '/idcard',
                    templateUrl: url+'idcard.html',
                    controller : 'idcardCtrl'
                })
                .state('addteam', {      //编辑施工团队
                    url: '/team',
                    templateUrl: url+'team.html',
                    controller : 'teamCtrl'
                })
                .state('updateteam', {      //编辑施工团队
                    url: '/team/:id',
                    templateUrl: url+'team.html',
                    controller : 'teamCtrl'
                })
                .state('teamList', {      //施工团队认证
                    url: '/teamList',
                    templateUrl: url+'teamList.html',
                    controller : 'teamCtrl'
                })
                .state('phone', {      //手机修改
                    url: '/phone',
                    templateUrl: url+'phone.html',
                    controller : 'phoneCtrl'
                })
                .state('email', {      //邮箱认证
                    url: '/email',
                    templateUrl: url+'email.html',
                    controller : 'emailCtrl'
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
                })
        });
    // angular bootstrap
    angular.bootstrap(document, ['myJyzDesigner']);
})();
