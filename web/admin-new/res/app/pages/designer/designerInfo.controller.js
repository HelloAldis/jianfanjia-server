(function () {
  angular.module('JfjAdmin.pages.designer')
    .controller('DesignerInfoController', [ //设计师个人信息
      '$scope', '$rootScope', '$http', '$stateParams', 'adminDesigner',
      function ($scope, $rootScope, $http, $stateParams, adminDesigner) {
        adminDesigner.idAuth($stateParams.id)
        .then(function (resp) {
          //返回信息
          $scope.user = resp.data.data;
          // $scope.uid_img1 = $scope.user.uid_image1 ? RootUrl + 'api/v2/web/thumbnail/800/' + $scope.user.uid_image1 : "";
          // $scope.uid_img2 = $scope.user.uid_image2 ? RootUrl + 'api/v2/web/thumbnail/800/' + $scope.user.uid_image2 : "";
          // $scope.bank_img1 = $scope.user.bank_card_image1 ? RootUrl + 'api/v2/web/thumbnail/800/' + $scope.user.bank_card_image1 : "";
          console.log($scope.user);
        }, function (resp) {
          //返回错误信息
          console.log(resp);
          promptMessage('获取数据失败', resp.data.msg)
        });
        $scope.getProductDetail = function (designer) {
          var detail = {
            detail: JSON.stringify({
              query: {
                designerid: designer._id
              }
            })
          };
          return detail;
        };
      }
    ]);
})();
