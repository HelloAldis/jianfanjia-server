(function() {
    angular.module('controllers')
        .controller('RequirementController', [
            '$scope','$rootScope','$stateParams','$http','$filter','$location',
            function($scope, $rootScope, $stateParams,$http,$filter,$location) {
                $scope.authType = undefined;  //全局标识，解决筛选和分页问题
                $scope.loadData = false;
                $scope.form = 0;
                   /*
                参数
                 pageNo为页码
                 itemsCount为记录的数量
                 pageSize为每页显示数量
                 */
                function setPage(p,i,s){
                   $scope.pageing={
                        pageNo : p,
                        itemsCount : i,
                        pageSize : s
                    }; 
                }
                setPage(1,0,10)
                $scope.list = function () {
                    $scope.userList = [];
                    $scope.loadData = false;
                    $scope.form = (this.page.pageNo-1)*10
                    loadList()
                };
                function loadList(){
                    var data = {
                          "query":{
                            "status": $scope.authType
                          },
                          "sort":{"_id": 1},
                          "from": $scope.form,
                          "limit":10
                        }
                    if(!!$scope.startTime && !!$scope.endTime){
                        data.query.create_at = {
                            "$gte":$filter('getTimesFilter')($scope.startTime),
                            "$lte":$filter('getTimesFilter')($scope.endTime)
                        }
                    }
                    $http({
                        method : "POST",
                        url : RootUrl+'api/v1/admin/requirement/search',
                        data: data
                    }).then(function(resp){
                        //返回信息
                        $scope.userList = resp.data.data.requirements;
                        angular.forEach($scope.userList, function(value, key){
                            value.time = parseInt(value._id.substring(0, 8), 16) * 1000;
                        });
                        console.log($scope.userList);
                        $scope.loadData = true;
                        setPage(1,resp.data.data.total,data.limit);
                        $scope.pagination = {
                            pageSize : 1,
                            pageSize : data.limit,
                            articleList : resp.data.data.total
                        }
                    },function(resp){
                        //返回错误信息
                        $scope.loadData = false;
                        console.log(resp);
                        promptMessage('获取数据失败',resp.data.msg)
                    })
                };
                loadList();
                $scope.authList = [
                    {
                        id : "0",
                        name : '未预约',
                        cur : false 
                    },
                    {
                        id : "1",
                        name : '已预约但无人响应',
                        cur : false 
                    },
                    {
                        id : "2",
                        name : '有响应但无人提交方案',
                        cur : false 
                    },
                    {
                        id : "3",
                        name : '提交方案但无选定方案',
                        cur : false 
                    },
                    {
                        id : "4",
                        name : '选定方案无配置工地',
                        cur : false 
                    },
                    {
                        id : "5",
                        name : '配置工地',
                        cur : false 
                    },
                ]
                $scope.authBtn = function(id){
                    $scope.userList = [];
                    $scope.loadData = false;
                    angular.forEach($scope.authList, function(value, key) {
                        if(value.id == id){
                            if(value.cur){
                                value.cur = false;
                            }else{
                                value.cur = true;
                            }
                        }else{
                            value.cur = false;
                        }
                    });
                    $scope.authType = id;
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
        .controller('RequirementDesignerController', [
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
                         console.log(resp.data.data.requirements)
                         var rec_designerids = $scope.user.rec_designerids;
                         $scope.designerids = resp.data.data.requirements;
                        angular.forEach($scope.designerids, function(value1, key1){
                            angular.forEach($scope.user.rec_designerids, function(value2, key2){
                                if($scope.user.rec_designerids == value1.designerid){
                                    $scope.designerids.biaoshi = "匹配"
                                }else{
                                    $scope.designerids.biaoshi = "自选"
                                }
                            });
                        });
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
