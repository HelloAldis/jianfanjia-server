(function () {
  angular.module('JfjAdmin.pages.notify')
    .controller('NotifyController', [ //消息推送
      '$scope', 'adminNotify',
      function ($scope, adminNotify) {

        $scope.notifyUeditor = function () {
          adminNotify.pushMessage($scope.notify)
          .then(function (resp) {
            alert('消息推送成功');
            $scope.notify = '';
          }, function (err) {
            console.log(err);
          });
        }
      }
    ]);
})();
