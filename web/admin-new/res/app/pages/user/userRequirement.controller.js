(function () {
  angular.module('JfjAdmin.pages.user')
    .controller('UserRequirementController', [
      '$scope', '$rootScope', '$stateParams', 'adminRequirement',
      function ($scope, $rootScope, $stateParams, adminRequirement) {
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
            $scope.userList = resp.data.data.requirements;
          }
        }, function (resp) {
          //返回错误信息
          console.log(resp);

        });
      }
    ]);
})();
