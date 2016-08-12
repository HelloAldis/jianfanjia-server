(function () {
  angular.module('JfjAdmin.pages.requirement')
    .controller('RequirementDetailController', [
      '$scope', '$rootScope', '$stateParams', 'adminRequirement', 'adminPlan', 'adminDesigner',
      function ($scope, $rootScope, $stateParams, adminRequirement, adminPlan, adminDesigner) {
        adminRequirement.search({
          "query": {
            "_id": $stateParams.id
          },
          "sort": {
            "_id": 1
          },
          "from": 0,
          "limit": 10
        }).then(function (resp) {
          if (resp.data.data.total === 1) {
            $scope.user = resp.data.data.requirements[0];
            //所有方案
            adminPlan.search({
              "query": {
                "requirementid": $scope.user._id
              },
              "sort": {
                "_id": 1
              },
              "from": 0
            }).then(function (resp) {
              if (resp.data.data.total !== 0) {
                $scope.plans = resp.data.data.plans;
                angular.forEach($scope.plans, function (value, key) {
                  if (value.requirement.rec_designerids.indexOf(value.designerid) != -1) {
                    value.biaoshi = "匹配";
                  } else {
                    value.biaoshi = "自选";
                  }
                });
              }
            }, function (resp) {
              //返回错误信息
              console.log(resp);
            });
            //匹配设计师
            if ($scope.user.rec_designerids.length > 0) {
              adminDesigner.search({
                "query": {
                  "_id": {
                    "$in": $scope.user.rec_designerids
                  }
                },
                "sort": {
                  "_id": 1
                },
                "from": 0
              }).then(function (resp) {
                if (resp.data.data.total !== 0) {
                  $scope.recDesignerList = resp.data.data.designers;
                }
              }, function (resp) {
                //返回错误信息
                console.log(resp);
              });
            }
            //所有参与设计师
            if ($scope.user.order_designerids.length > 0) {
              adminDesigner.search({
                "query": {
                  "_id": {
                    "$in": $scope.user.order_designerids
                  }
                },
                "sort": {
                  "_id": 1
                },
                "from": 0
              }).then(function (resp) {
                if (resp.data.data.total !== 0) {
                  $scope.designerList = resp.data.data.designers;
                }
              }, function (resp) {
                //返回错误信息
                console.log(resp);
              });
            }
            //最后成交设计师
            if ($scope.user.final_designerid) {
              adminDesigner.search({
                "query": {
                  "_id": $scope.user.final_designerid
                },
                "sort": {
                  "_id": 1
                },
                "from": 0
              }).then(function (resp) {
                if (resp.data.data.total === 1) {
                  $scope.finalDesigner = resp.data.data.designers[0];
                }
              }, function (resp) {
                //返回错误信息
                console.log(resp);
              });
            }
          }
        }, function (resp) {
          //返回错误信息
          console.log(resp);

        });
      }
    ]);
})();
