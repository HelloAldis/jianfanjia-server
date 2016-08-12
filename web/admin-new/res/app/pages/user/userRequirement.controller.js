(function () {
  angular.module('JfjAdmin.pages.user')
    .controller('UserRequirementController', [
      '$scope', '$stateParams', 'adminRequirement', 'adminDesigner', 'adminUser',
      function ($scope, $stateParams, adminRequirement, adminDesigner, adminUser) {
        adminRequirement.search({
          "query": {
            "userid": $stateParams.id
          },
          "sort": {
            "_id": 1
          },
          "from": 0,
          "limit": 10
        }).then(function (resp) {
          if (resp.data.data.total !== 0) {
            $scope.requireList = resp.data.data.requirements;
            $scope.requireList.forEach(function(require) {
              $scope.getDesignerName(require);
            })
          }
        }, function (resp) {
          //返回错误信息
          console.log(resp);

        });

        // 单个需求已预约的设计师姓名列表
        $scope.getDesignerName = function (require) {
          adminDesigner.search({
            "query": {
              "_id": {
                "$in": require.order_designerids
              }
            },
            "sort": {
              "_id": 1
            },
            "from": 0
          }).then(function (resp) {
            if (resp.data.data.total !== 0) {
              require.designerList = resp.data.data.designers;
            }
            console.log(require.designerList);
          }, function (resp) {
            //返回错误信息
            console.log(resp);
          });
        }

        // 确认量房
        $scope.houseChecked = function (require, designer) {
          adminUser.houseChecked({
            designerid: designer._id,
            requirementid: require._id
          }).then(function (resp) {
            designer.hasChecked = true;
          }, function (err) {
            //返回错误信息
            console.log(err);
          });
        }
      }
    ]);
})();
