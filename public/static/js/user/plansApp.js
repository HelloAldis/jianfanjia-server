'use strict';
(function() {
    // load modules
    angular.module('myJyzPlans', ['ui.router','pasvaz.bindonce','ngCookies','controllers', 'services', 'filters' , 'directives'])
        .config(function($stateProvider, $urlRouterProvider) {
            var RootURl = '../../../tpl/user/plans/';
            $urlRouterProvider.otherwise('/detail');
            $stateProvider
                .state('create', {
                    url: '/create',
                    templateUrl: RootURl+'create.html',
                    controller : 'createCtrl'
                })
                .state('upload', {
                    url: '/upload/:id',
                    templateUrl: RootURl+'upload.html',
                    controller : 'createCtrl'
                })
                .state('detail', {
                    url: '/detail/:id',
                    templateUrl: RootURl+'detail.html',
                    controller : 'detailCtrl'
                })
        });
    // angular bootstrap
    angular.bootstrap(document, ['myJyzPlans']);
})();
