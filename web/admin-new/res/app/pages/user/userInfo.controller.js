(function () {
  angular.module('JfjAdmin.pages.user')
    .controller('UserInfoController', [
      '$scope', '$rootScope', '$stateParams', 'adminUser',
      function ($scope, $rootScope, $stateParams, adminUser) {
        console.log('hhahhhh');
        adminUser.search({
          "query": {
            "_id": $stateParams.id
          },
          "from": 0,
          "limit": 1
        }).then(function (resp) {
          if (resp.data.data.total === 1) {
            $scope.user = resp.data.data.users[0];
            $scope.head = !!$scope.user.imageid ? 'api/v2/web/thumbnail/200/' + $scope.user.imageid : 'jyz/img/headpic.jpg';
          }
        }, function (resp) {
          //返回错误信息
          console.log(resp);

        });
      }
    ]);
})();
