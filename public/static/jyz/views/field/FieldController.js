(function() {
    angular.module('controllers')
        .controller('FieldController', [
            '$scope','$rootScope','adminField',
            function($scope, $rootScope,adminField) {
                //数据加载显示状态
                $scope.loading = {
                    loadData : false,
                    notData : false
                };
                //分页控件
                $scope.pagination = {
                    currentPage : 1,
                    totalItems : 0,
                    maxSize : 5,
                    pageChanged : function(){
                        loadList(this.currentPage,10);
                    }
                };
                function loadList(from,limit){
                  var data = {
                      "query":{},
                      "from": (limit === undefined ? 0 : limit)*(from-1),
                      "limit":(limit === undefined ? undefined : limit)
                  };
                  adminField.search(data).then(function(resp){
                    //返回信息
                    if(resp.data.data.total === 0){
                        $scope.loading.loadData = true;
                        $scope.loading.notData = true;
                    }else{
                       $scope.processes = resp.data.data.processes;
                        $scope.pagination.totalItems = resp.data.data.total;
                        $scope.loading.loadData = true;
                        $scope.loading.notData = false;
                    }
                  },function(resp){
                    //返回错误信息
                    console.log(resp);
                  })
                };
                loadList(1,10);
            }
        ])
        .controller('FieldDetailController', [
            '$scope','$rootScope','$stateParams','adminField',
            function($scope, $rootScope,$stateParams,adminField) {
                //数据加载显示状态
                $scope.loading = {
                    loadData : false,
                    notData : false
                };
                adminField.search({
                  "query":{'_id':$stateParams.id},
                  "from": 0,
                  "limit":1
                }).then(function(resp){
                  //返回信息
                  if(resp.data.data.total === 1){
                      $scope.processes = resp.data.data.processes[0];
                      console.log($scope.processes)
                      $scope.loading.loadData = true;
                  }
                },function(resp){
                  //返回错误信息
                  console.log(resp);
                })
            }
        ]);
})();
