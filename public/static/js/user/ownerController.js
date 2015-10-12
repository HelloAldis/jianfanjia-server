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
        '$scope','$rootScope','$http','$filter','userInfo',
        function($scope, $rootScope,$http,$filter,userInfo) {
        	userInfo.get().then(function(res){
        		//console.log(res.data.data)
        		$scope.user = res.data.data
        	},function(res){
        		console.log(res)
        	})
    }])
    .controller('inforCtrl', [     //业主首页
        '$scope','$rootScope','$http','$filter','userInfo',
        function($scope, $rootScope,$http,$filter,userInfo) {
        	var desArea = $('#where_area');
        	userInfo.get().then(function(res){  //获取个人资料
        		console.log(res.data.data)
        		$scope.user = res.data.data
				desArea.empty();
				if(!!$scope.user.province){
					var designAreaQuery = $scope.user.province+" "+$scope.user.city+" "+$scope.user.district;
					desArea.find('input[name=where_area]').val(designAreaQuery)
					var designArea = new CitySelect({id :'where_area',"query":designAreaQuery});
				}else{
					desArea.find('input[name=where_area]').val("")
					var designArea = new CitySelect({id :'where_area'});
				}
	        	$scope.user.imageSrc = RootUrl+'api/v1/image/'+$scope.user.imageid;
        	},function(res){
        		console.log(res)
        	});
        	$scope.submitBtn = function(){     //修改个人资料
        		$scope.user.province = desArea.find('input[name=province]').val() || $scope.user.province;
            	$scope.user.city = desArea.find('input[name=city]').val() || $scope.user.city;
            	$scope.user.district = desArea.find('input[name=district]').val() || $scope.user.district;
        		userInfo.put($scope.user).then(function(res){     
	        		console.log(res.data.data)
	        		alert('保存成功')
	        	},function(res){
	        		console.log(res)
	        	})
        	};
    }])
	