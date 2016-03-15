'use strict';
(function() {
    // load modules
    angular.module('myJyzOwner', ['ui.router','pasvaz.bindonce','controllers', 'services', 'filters' , 'directives','ngmodel.format','my.jyz'])
        .run(['$rootScope','$state','$stateParams',function($rootScope,$state,$stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }])
        .config(function($stateProvider, $urlRouterProvider) {
            var url = RootUrl + 'tpl/user/owner/';
            $urlRouterProvider.otherwise('/index');
            $stateProvider
                .state('index', {
                    url: '/index',
                    templateUrl: url+'index.html',
                    controller : 'indexCtrl'
                })
                .state('infor', {
                    url: '/infor',
                    templateUrl: url+'infor.html',
                    controller : 'inforCtrl'
                })
                .state('addRequirement', {
                    url: '/release',
                    templateUrl: url+'release.html',
                    controller : 'releaseCtrl'
                })
                .state('addRequirementb', {
                    url: '/releaseb',
                    templateUrl: url+'releaseb.html',
                    controller : 'releaseCtrl'
                })
                .state('bindPhone', {
                    url: '/phone',
                    templateUrl: url+'phone.html',
                    controller : 'phoneCtrl'
                })
                .state('updateRequirement', {
                    url: '/release/:id',
                    templateUrl: url+'release.html',
                    controller : 'releaseCtrl'
                })
                .state('updateRequirementb', {
                    url: '/releaseb/:id',
                    templateUrl: url+'releaseb.html',
                    controller : 'releaseCtrl'
                })
                .state('requirementList', {
                    url: '/requirementList',
                    templateUrl: url+'requirementList.html',
                    controller : 'requirementListCtrl'
                })
                .state('requirement', {
                    url: '/requirement/:id',
                    templateUrl: url+'requirement.html'
                })
                .state('requirement.detail', {
                    url: '/detail',
                    templateUrl: url+'detail.html'
                })
                .state('requirement.booking', {
                    url: '/booking',
                    templateUrl: url+'booking.html'
                })
                .state('requirement.plan', {
                    url: '/plan',
                    templateUrl: url+'plan.html'
                })
                .state('requirement.contract', {
                    url: '/contract',
                    templateUrl: url+'contract.html'
                })
                .state('requirement.field', {
                    url: '/field',
                    templateUrl: url+'field.html'
                })
                .state('requirement.fulfill', {
                    url: '/fulfill',
                    templateUrl: url+'fulfill.html'
                })
                .state('requirement.score', {
                    url: '/score',
                    templateUrl: url+'score.html'
                })
                .state('favorite', {
                    url: '/favorite',
                    template: '<div ui-view></div>'
                })
                .state('favorite.list', {
                    url: '/{id:[0-9]{1,6}}',
                    templateUrl: url+'favorite.html',
                    controller : 'favoriteProductCtrl'
                })
                .state('designer', {
                    url: '/designer',
                    template: '<div ui-view></div>'
                })
                .state('designer.list', {
                    url: '/{id:[0-9]{1,6}}',
                    templateUrl: url+'designer.html',
                    controller : 'favoriteDesignerCtrl'
                })
                .state('notice', {
                    url: '/notice',
                    template: '<div ui-view></div>'
                })
                .state('notice.list', {
                    url: '/list',
                    templateUrl: url+'notice.html',
                    controller : 'noticeCtrl'
                })
                .state('notice.list.type', {
                    url: '/{id:[0-9]{1,6}}?type&status',
                    templateUrl: url+'noticeList.html',
                    controller : 'noticeListCtrl'
                })
                .state('notice.detail', {
                    url: '/detail/:id',
                    templateUrl: url+'noticeDetail.html',
                    controller : 'noticeDetailCtrl'
                })
                .state('remind', {
                    url: '/remind',
                    template: '<div ui-view></div>'
                })
                .state('remind.list', {
                    url: '/list',
                    templateUrl: url+'remind.html',
                    controller : 'remindCtrl'
                })
                .state('remind.list.type', {
                    url: '/{id:[0-9]{1,6}}?type&status',
                    templateUrl: url+'remindList.html',
                    controller : 'remindListCtrl'
                })
                .state('comment', {
                    url: '/comment',
                    template: '<div ui-view></div>'
                })
                .state('comment.list', {
                    url: '/{id:[0-9]{1,6}}',
                    templateUrl: url+'comment.html',
                    controller : 'commentCtrl'
                })
        });
    // angular bootstrap
    angular.bootstrap(document, ['myJyzOwner']);
})();
