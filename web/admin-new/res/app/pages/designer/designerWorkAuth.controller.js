(function () {
  angular.module('JfjAdmin.pages.designer')
    .controller('DesignerWorkAuthController', [ //设计师实地认证
      '$scope', '$rootScope', '$http', '$stateParams', '$location',
      function ($scope, $rootScope, $http, $stateParams, $location) {
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
              url: RootUrl + 'api/v2/web/admin/update_work_auth',
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
