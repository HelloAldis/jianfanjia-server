(function () {
  angular.module('JfjAdmin.pages.field')
    .controller('FieldDetailController', [
      '$scope', '$rootScope', '$stateParams', 'adminField',
      function ($scope, $rootScope, $stateParams, adminField) {
        //数据加载显示状态
        $scope.loading = {
          loadData: false,
          notData: false
        };
        adminField.search({
          "query": {
            '_id': $stateParams.id
          },
          "from": 0,
          "limit": 1
        }).then(function (resp) {
          //返回信息
          if (resp.data.data.total === 1) {
            $scope.processes = resp.data.data.processes[0];
            console.log($scope.processes)
            $scope.loading.loadData = true;
          }
        }, function (resp) {
          //返回错误信息
          console.log(resp);
        })
      }
    ]);
})();
