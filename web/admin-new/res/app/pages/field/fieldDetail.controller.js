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

        // 工地管理详情数据
        adminField.search({
          "query": {
            '_id': $stateParams.id
          },
          "from": 0,
          "limit": 1
        }).then(function (resp) {
          if (resp.data.data.total === 1) {
            $scope.processes = resp.data.data.processes[0];
            $scope.hasAssigned = $scope.processes.supervisorids;
            $scope.loading.loadData = true;
          }
        }, function (err) {
          console.log(err);
        });

        // 获取监理列表
        adminField.searchSupervisor({
          "from": 0,
          "limit": 10
        }).then(function (res) {
          $scope.dataList = res.data.data.supervisors;
          if ($scope.hasAssigned) {
            $scope.dataList.forEach(function(supervisor) {
              $scope.hasAssigned.forEach(function(id){
                if (supervisor._id === id) {
                  supervisor.isAssign = true;
                }
              })
            })
          }
        }, function (err) {
          console.log(err);
        })

        // 指派监理
        $scope.assignSupervisor = function (item) {
          adminField.assignSupervisor({
            "processid": $stateParams.id,
            "supervisorids": [item._id]
          }).then(function (res) {
            item.isAssign = true;
            console.log(res);
          }, function (err) {
            console.log(err);
          })
        }
      }
    ]);
})();
