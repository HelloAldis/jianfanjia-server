'use strict';
angular.module('controllers', [])
	.controller('SubController', [    //左侧高亮按钮
            '$scope','$location',function($scope, $location) {
                $scope.location = $location;
                $scope.$watch( 'location.url()', function( url ) {
                    $scope.nav = url.split('/')[1];
                });
            }
    ])
	.controller('indexCtrl', [     //业主首页
        '$scope','$rootScope','$http','$filter',
        function($scope, $rootScope,$http,$filter) {
    }])
	