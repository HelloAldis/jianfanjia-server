(function() {
    angular.module('controllers')
        .filter('requirementFilter', function () {
            return function (input) {
                return {
                    "0":"未预约",
                    "1":"已预约但无人响应",
                    "2":"有响应但无人提交方案",
                    "3":"提交方案但无选定方案",
                    "4":"选定方案无配置工地",
                    "5":"配置工地"
                }[input];
            }
        })
        .filter('planFilter', function () {
            return function (input) {
                return {
                    "0":"已预约无响应",
                    "1":"已拒绝业主",
                    "2":"有响应无方案",
                    "3":"已提交方案",
                    "4":"方案被拒绝",
                    "5":"方案被选中"
                }[input];
            }
        })
        .controller('UserController', [
            '$scope','$rootScope','$http',
            function($scope, $rootScope,$http) {
                  /*
                参数：
                 pageNo为页码
                 itemsCount为记录的数量
                 pageSize为每页显示数量
                 */
                 $scope.form = 0;
                 $scope.searchDesigner = undefined;
                function setPage(p,i,s){
                   $scope.pageing={
                        pageNo : p,
                        itemsCount : i,
                        pageSize : s
                    }; 
                }
                setPage(1,0,10);
                $scope.list = function () {
                    $scope.userList = [];
                    $scope.loadData = false;
                    $scope.form = (this.page.pageNo-1)*10;
                    loadList()
                };
                $scope.loadData = false;
                function loadList(){
                    var data = {
                          "query":{},
                          "from": $scope.form,
                          "limit":10
                        }
                    if(!!$scope.startTime && !!$scope.endTime){
                        data.query.create_at = {
                            "$gte":$filter('getTimesFilter')($scope.startTime),
                            "$lte":$filter('getTimesFilter')($scope.endTime)
                        }
                    }
                    if(!!$scope.searchDesigner){
                        data.query.phone = $scope.searchDesigner
                    }else{
                       data.query.phone = undefined;
                    }
                    $http({
                		method : "POST",
                		url : RootUrl+'api/v1/admin/search_user',
                        data: data
                	}).then(function(resp){
                		//返回信息
                		$scope.userList = resp.data.data.users;
                        $scope.loadData = true;
                        setPage(1,resp.data.data.total,data.limit);
                	},function(resp){
                		//返回错误信息
                        $scope.loadData = false;
                		console.log(resp);
                	})
                };
                loadList()
                $scope.searchBtn = function(){   //搜索设计师
                    loadList()
                }
                $scope.searchTimeBtn = function(){
                    if(!!!$scope.startTime){
                        alert('请输入开始时间');
                    }
                    if(!!!$scope.endTime){
                        alert('请输入结束时间');
                    }
                    loadList()
                }
            }
        ])
        .controller('UserInfoController', [
            '$scope','$rootScope','$stateParams','$http','$filter','$location',
            function($scope, $rootScope, $stateParams,$http,$filter,$location) {
            	$http({   //获取数据
            		method : "GET",
            		url : RootUrl+'api/v1/user/'+$stateParams.id+'/info'
            	}).then(function(resp){
            		//返回信息
            		$scope.user = resp.data.data;
            		$scope.head = !!$scope.user.imageid ? RootUrl+'api/v1/thumbnail/200/'+resp.data.data.imageid : 'jyz/img/headpic.jpg';
            		console.log($scope.user);
            	},function(resp){
            		//返回错误信息
            		console.log(resp);
            		promptMessage('获取数据失败',resp.data.msg)
            	})
        	}
        ])
        .controller('UserRequirementController', [
            '$scope','$rootScope','$stateParams','$http','$filter','$location',
            function($scope, $rootScope, $stateParams,$http,$filter,$location) {
                $http({   //获取数据
                    method : "POST",
                    url : RootUrl+'api/v1/admin/requirement/search',
                    data : {
                          "query":{
                            "userid":$stateParams.id
                          },
                          "sort":{"_id": 1},
                          "from": 0,
                          "limit":10
                        }
                }).then(function(resp){
                    //返回信息
                    $scope.userList = resp.data.data.requirements;
                    angular.forEach($scope.userList, function(value, key){
                        value.time = parseInt(value._id.substring(0, 8), 16) * 1000;
                    });
                    console.log($scope.userList);
                },function(resp){
                    //返回错误信息
                    console.log(resp);
                    promptMessage('获取数据失败',resp.data.msg)
                })
        	}
        ])
        .controller('UserDesignerController', [
            '$scope','$rootScope','$stateParams','$http','$filter','$location',
            function($scope, $rootScope, $stateParams,$http,$filter,$location) {
                $scope.userUid = $stateParams.id
                $http({   //获取数据
                    method : "POST",
                    url : RootUrl+'api/v1/admin/requirement/search',
                    data : {
                        "query":{
                            "userid":$stateParams.id
                        },
                        "sort":{"_id": 1},
                        "from": 0,
                        "limit":10
                    }
                }).then(function(resp){
                    //返回信息
                    $scope.user = resp.data.data.requirements[0];
                    console.log($scope.user);
                    $http({   //获取数据
                        method : "POST",
                        url : RootUrl+'api/v1/admin/search_plan',
                        data : {
                            "query":{
                                "requirementid": $scope.user._id
                            },
                            "sort":{"_id": 1},
                            "from": 0,
                            "limit":100
                        }
                    }).then(function(resp){
                         console.log(resp.data.data.plans)
                         $scope.designerids = resp.data.data.plans;
                    },function(resp){
                        //返回错误信息
                        console.log(resp);
                        promptMessage('获取数据失败',"error")
                    })
                },function(resp){
                    //返回错误信息
                    console.log(resp);
                    promptMessage('获取数据失败',"error")
                })
            }
        ]);
})();
