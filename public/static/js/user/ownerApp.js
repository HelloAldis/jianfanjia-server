'use strict';
(function() {
    // load modules
    angular.module('myJyzOwner', ['ui.router','pasvaz.bindonce','controllers', 'services', 'filters' , 'directives'])
        .config(function($stateProvider, $urlRouterProvider) {
            var RootURl = '../../../tpl/user/owner/';
            $urlRouterProvider.otherwise('/index');
            $stateProvider
                .state('index', {
                    url: '/index',
                    templateUrl: RootURl+'index.html',
                    controller : 'indexCtrl'
                })
                .state('infor', {
                    url: '/infor',
                    templateUrl: RootURl+'infor.html',
                    controller : 'inforCtrl'
                })
                .state('release', {
                    url: '/release',
                    templateUrl: RootURl+'release.html',
                    controller : 'releaseCtrl'
                })
                .state('revise', {
                    url: '/revise/:id',
                    templateUrl: RootURl+'revise.html',
                    controller : 'releaseCtrl'
                })
                .state('requirementList', {
                    url: '/requirementList',
                    templateUrl: RootURl+'requirementList.html',
                    controller : 'requirementListCtrl'
                })
                .state('requirement', {
                    url: '/requirement/:id',
                    templateUrl: RootURl+'requirement.html'
                })
                .state('requirement.detail', {
                    url: '/detail',
                    templateUrl: RootURl+'detail.html'
                })
                .state('requirement.booking', {
                    url: '/booking',
                    templateUrl: RootURl+'booking.html'
                })
                .state('requirement.plan', {
                    url: '/plan',
                    templateUrl: RootURl+'plan.html'
                })
                .state('requirement.contract', {
                    url: '/contract',
                    templateUrl: RootURl+'contract.html'
                })
                .state('requirement.score', {
                    url: '/score',
                    templateUrl: RootURl+'score.html'
                })
                .state('favorite', {
                    url: '/favorite',
                    templateUrl: RootURl+'favorite.html',
                    controller : 'favoriteProductCtrl'
                })
                .state('designer', {
                    url: '/designer',
                    templateUrl: RootURl+'designer.html',
                    controller : 'favoriteDesignerCtrl'
                })
        });
    // angular bootstrap
    angular.bootstrap(document, ['myJyzOwner']);
})();
