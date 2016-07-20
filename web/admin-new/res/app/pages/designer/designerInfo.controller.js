(function () {
  angular.module('JfjAdmin.pages.designer')
    .controller('DesignerInfoController', [ //设计师个人信息
      '$scope', '$rootScope', '$http', '$stateParams', 'adminDesigner',
      function ($scope, $rootScope, $http, $stateParams, adminDesigner) {
        adminDesigner.idAuth($stateParams.id)
        .then(function (resp) {
          //返回信息
          $scope.user = resp.data.data;
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
