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
<<<<<<< HEAD
                    templateUrl: RootURl+'index.html'
=======
                    templateUrl: RootURl+'index.html',
                    controller : 'indexCtrl'
>>>>>>> d4aa26a3f267cb3169f6a57749440d26a4564c3d
                })
                .state('infor', {
                    url: '/infor',
                    templateUrl: RootURl+'infor.html',
<<<<<<< HEAD
=======
                    controller : 'inforCtrl'
>>>>>>> d4aa26a3f267cb3169f6a57749440d26a4564c3d
                })
                .state('release', {
                    url: '/release',
                    templateUrl: RootURl+'release.html',
<<<<<<< HEAD
=======
                    controller : 'releaseCtrl'
                })
                .state('revise', {
                    url: '/revise/:id',
                    templateUrl: RootURl+'revise.html',
                    controller : 'releaseCtrl'
>>>>>>> d4aa26a3f267cb3169f6a57749440d26a4564c3d
                })
                .state('requirementList', {
                    url: '/requirementList',
                    templateUrl: RootURl+'requirementList.html',
<<<<<<< HEAD
                })
                .state('requirement', {
                    url: '/requirement',
                    templateUrl: RootURl+'requirement.html',
                    controller: function($scope,$filter,$interval,$location){
                        $scope.data = [
                            {
                                url : "requirement.detail",
                                name : "需求详情"
=======
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
>>>>>>> d4aa26a3f267cb3169f6a57749440d26a4564c3d
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
<<<<<<< HEAD
                        }  
                    }
                })
                .state('requirement.detail', {
                    url: '/detail/:id',
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
                    templateUrl: RootURl+'favorite.html'
                })
                .state('designer', {
                    url: '/designer',
                    templateUrl: RootURl+'designer.html'
=======
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
                .state('favorite', {
                    url: '/favorite',
                    templateUrl: RootURl+'favorite.html',
                    controller : 'favoriteProductCtrl'
                })
                .state('designer', {
                    url: '/designer',
                    templateUrl: RootURl+'designer.html',
                    controller : 'favoriteDesignerCtrl'
>>>>>>> d4aa26a3f267cb3169f6a57749440d26a4564c3d
                })
        });
    // angular bootstrap
    angular.bootstrap(document, ['myJyzOwner']);
})();
