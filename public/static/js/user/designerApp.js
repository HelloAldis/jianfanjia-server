'use strict';
(function() {
    // load modules
    angular.module('myJyzDesigner', ['ui.router','pasvaz.bindonce','controllers', 'services', 'filters' , 'directives'])
        .config(function($stateProvider, $urlRouterProvider) {
            var RootURl = '../../../tpl/user/designer/';
            $urlRouterProvider.otherwise('/index');
            $stateProvider
                .state('index', {     //设计师首页
                    url: '/index',
                    templateUrl: RootURl+'index.html',
                    controller : 'indexCtrl'
                })
                .state('infor', {     //设计师编辑资料和提交认证
                    url: '/infor',
                    templateUrl: RootURl+'infor.html',
                    controller : 'inforCtrl'
                })
                .state('requirementList', {   //需求列表
                    url: '/requirementList',
                    templateUrl: RootURl+'requirementList.html',
                    controller : 'requirementListCtrl'
                }) 
                .state('requirement', {      //需求详情
                    url: '/requirement/:id',
                    templateUrl: RootURl+'requirement.html'
                })
                .state('requirement.detail', {    //需求详情--需求描述
                    url: '/detail',
                    templateUrl: RootURl+'detail.html'
                })
                .state('requirement.owner', {     //需求详情--响应业主
                    url: '/owner',
                    templateUrl: RootURl+'owner.html'
                })
                .state('requirement.plan', {      //需求详情--方案列表
                    url: '/plan',
                    templateUrl: RootURl+'plan.html'
                })
                .state('requirement.contract', {     //需求详情--生成合同
                    url: '/contract',
                    templateUrl: RootURl+'contract.html'
                })
                .state('history', {      //历史订单列表
                    url: '/history',
                    templateUrl: RootURl+'history.html',
                    controller : 'historyListCtrl'
                })
                .state('products', {      //作品列表
                    url: '/products',
                    templateUrl: RootURl+'products.html',
                    controller : 'productsListCtrl'
                })
                .state('release', {    //发布作品
                    url: '/release',
                    templateUrl: RootURl+'release.html',
                    controller : 'releaseCtrl'
                })
                .state('revise', {     //修改作品
                    url: '/revise/:id',
                    templateUrl: RootURl+'revise.html',
                    controller : 'releaseCtrl'
                })
                .state('favorite', {      //收藏作品
                    url: '/favorite',
                    templateUrl: RootURl+'favorite.html',
                    controller : 'favoriteProductCtrl'
                })
        });
    // angular bootstrap
    angular.bootstrap(document, ['myJyzDesigner']);
})();
