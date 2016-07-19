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
        $scope.article_type = [{
          "num": 0,
          "name": '大百科'
        }, {
          "num": 1,
          "name": '小贴士'
        }, ];
        $scope.news = {
          "articletype": "1"
        }
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
            $scope.loading.loadData = true;
          }
        }, function (resp) {
          //返回错误信息
          console.log(resp);
        });

        // 获取监理列表
        adminField.searchSupervisor({
          "from": 0,
          "limit": 10
        }).then(function (res) {
          console.log('red', res);
        }, function (err) {
          console.log(err);
        })
      }
    ]);
})();
