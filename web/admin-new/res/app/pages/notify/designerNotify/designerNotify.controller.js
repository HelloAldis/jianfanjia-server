(function () {
  'use strict';

  angular.module('JfjAdmin.pages.notify.designer')
    .controller('DesignerNotifyController', DesignerNotifyController);

  /** @ngInject */
  function DesignerNotifyController($scope, adminNotify) {
    $scope.notifyUeditor = function () {
      adminNotify.pushMessageToDesigner($scope.notify)
      .then(function (resp) {
        alert('消息推送成功');
        $scope.notify = '';
      }, function (err) {
        console.log(err);
      });
    }
  }
})();