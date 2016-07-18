(function () {
  angular.module('JfjAdmin.pages.designer')
    .controller('DesignerIdAuthController', [ //设计师身份证认证
      '$scope', '$rootScope', '$http', '$stateParams', '$location',
      'adminDesigner',
      function ($scope, $rootScope, $http, $stateParams, $location, adminDesigner) {
        adminDesigner.idAuth($stateParams.id)
        .then(function (resp) {
          //返回信息
          console.log(resp);
          $scope.user = resp.data.data;
          // $scope.uid_img1 = $scope.user.uid_image1 ? 'api/v2/web/thumbnail/800/' + $scope.user.uid_image1 : "";
          // $scope.uid_img2 = $scope.user.uid_image2 ? 'api/v2/web/thumbnail/800/' + $scope.user.uid_image2 : "";
          // $scope.bank_img1 = $scope.user.bank_card_image1 ? 'api/v2/web/thumbnail/800/' + $scope.user.bank_card_image1 : "";
        }, function (resp) {
          //返回错误信息
          console.log(resp);
          promptMessage('获取数据失败', resp.data.msg)
        })
        $scope.success = function (type) {
          if (confirm("你确定要操作吗？")) {
            if (type == "2") {
              msg = '认证成功';
            } else {
              if (!!$scope.errorMsg) {
                msg = $scope.errorMsg;
              } else {
                alert('请填写未认证通过原因');
                return;
              }
            }
            $scope.data = {
              "_id": $stateParams.id,
              "new_auth_type": type,
              "auth_message": msg
            };
            adminDesigner.idAuthOpearate($scope.data)
            .then(function (resp) {
              //返回信息
              window.history.back();
            }, function (resp) {
              //返回错误信息
              console.log(resp);
              promptMessage('获取数据失败', resp.data.msg)
            })
          }
        }
      }
    ]);
})();
