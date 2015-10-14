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
                    templateUrl: RootURl+'requirement.html',
                    controller: function($scope,$location){
                        $scope.data = [
                            {
                                url : "requirement.detail",
                                name : "需求描述"
                            },
                            {
                                url : "requirement.booking",
                                name : "预约量房"
                            },
                            {
                                url : "requirement.plan",
                                name : "选择方案"
                            },
                            {
                                url : "requirement.contract",
                                name : "生成合同"
                            },
                            {
                                url : "requirement.score",
                                name : "评价设计师"
                            }
                        ]
                        function abc(str){
                            return {
                                "detail" : "需求详情",
                                "booking" : "预约量房",
                                "plan" : "选择方案",
                                "contract" : "生成合同",
                                "score" : "评价设计师"
                            }[str]
                        }
                        $scope.abcd = abc($location.$$url.split("/")[2])
                        $scope.b = function(c){
                            $scope.abcd = c
                        } 
                    }
                })
                .state('requirement.detail', {
                    url: '/detail',
                    templateUrl: RootURl+'detail.html',
                    controller : 'requirementDetailCtrl'
                })
                .state('requirement.booking', {
                    url: '/booking',
                    templateUrl: RootURl+'booking.html',
                    controller : 'requirementDetailCtrl'
                })
                .state('requirement.plan', {
                    url: '/plan',
                    templateUrl: RootURl+'plan.html',
                    controller : 'requirementDetailCtrl'
                })
                .state('requirement.contract', {
                    url: '/contract',
                    templateUrl: RootURl+'contract.html',
                    controller : 'requirementDetailCtrl'
                })
                .state('requirement.score', {
                    url: '/score',
                    templateUrl: RootURl+'score.html',
                    controller : 'requirementDetailCtrl'
                })
                .state('requirement.detail', {
                    url: '/detail',
                    templateUrl: RootURl+'detail.html',
                    controller : 'requirementDetailCtrl'
                })
                .state('requirement.booking', {
                    url: '/booking',
                    templateUrl: RootURl+'booking.html',
                    controller : 'requirementDetailCtrl'
                })
                .state('requirement.plan', {
                    url: '/plan',
                    templateUrl: RootURl+'plan.html',
                    controller : 'requirementDetailCtrl'
                })
                .state('requirement.contract', {
                    url: '/contract',
                    templateUrl: RootURl+'contract.html',
                    controller : 'requirementDetailCtrl'
                })
                .state('requirement.score', {
                    url: '/score',
                    templateUrl: RootURl+'score.html',
                    controller : 'requirementDetailCtrl'
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
