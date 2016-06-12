(function () {
  angular.module('JfjAdmin.pages.designer')
    .controller('DesignerInfoAuthController', [ //设计师信息认证
      '$scope', '$rootScope', '$http', '$stateParams', '$location',
      function ($scope, $rootScope, $http, $stateParams, $location) {
        $http({ //获取数据
          method: "POST",
          url: 'api/v2/web/admin/designer/' + $stateParams.id
        }).then(function (resp) {
          //返回信息
          $scope.user = resp.data.data;
          $scope.head_img1 = $scope.user.imageid ? 'api/v2/web/thumbnail/200/' + $scope.user.imageid : 'jyz/img/headpic.jpg';
          $scope.head_img2 = $scope.user.big_imageid ? 'api/v2/web/thumbnail/800/' + $scope.user.big_imageid :
            'jyz/img/headpic.jpg';
          $scope.diploma_image = $scope.user.diploma_imageid ? 'api/v2/web/thumbnail/800/' + $scope.user.diploma_imageid : '';
          console.log($scope.user);
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
            $http({ //获取数据
              method: "POST",
              url: 'api/v2/web/admin/update_basic_auth',
              data: {
                "_id": $stateParams.id,
                "new_auth_type": type,
                "auth_message": msg
              }
            }).then(function (resp) {
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
