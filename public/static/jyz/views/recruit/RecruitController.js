(function() {
    angular.module('controllers')
        .controller('RecruitController', [
            '$scope','$rootScope','$http','$filter',
            function($scope, $rootScope,$http,$filter) {
                  /*
                参数：
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
                setPage(1,0,10);
                $scope.list = function () {
                    $scope.userList = [];
                    $scope.loadData = false;
                    loadList({
                      "from": (this.page.pageNo-1)*10,
                    })
                };
                $scope.loadData = false;
                function loadList(data){
                    var data = {
                          "query":{},
                          "sort":{"phone": 1},
                          "from": 0,
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
                		url : RootUrl+'api/v1/admin/search_angel_user',
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
                $scope.searchTimeBtn = function(){
                    console.log(!!!$scope.startTime)
                    if(!!!$scope.startTime){
                        alert('请输入开始时间');
                    }
                    if(!!!$scope.endTime){
                        alert('请输入结束时间');
                    }
                    loadList()
                }
            }
        ]);
})();
