'use strict';
(function() {
    // load modules
    angular.module('myJyzOwner', ['ui.router','pasvaz.bindonce','controllers', 'services', 'filters' , 'directives','ngmodel.format'])
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
                .state('requirement.score', {
                    url: '/score',
                    templateUrl: url+'score.html'
                })
                .state('favorite', {
                    url: '/favorite',
                    templateUrl: url+'favorite.html',
                    controller : 'favoriteProductCtrl'
                })
                .state('designer', {
                    url: '/designer',
                    templateUrl: url+'designer.html',
                    controller : 'favoriteDesignerCtrl'
                })
        });
    // angular bootstrap
    angular.bootstrap(document, ['myJyzOwner']);
})();
