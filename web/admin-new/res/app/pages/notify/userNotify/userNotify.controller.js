(function () {
  'use strict';

  angular.module('JfjAdmin.pages.notify.user')
    .controller('UserNotifyController', UserNotifyController);

  /** @ngInject */
  function UserNotifyController($scope, adminNotify) {
    $scope.notifyUeditor = function () {
      adminNotify.pushMessageToUser($scope.notify)
      .then(function (resp) {
        alert('消息推送成功');
        $scope.notify = '';
      }, function (err) {
        console.log(err);
      });
    }
  }
})();