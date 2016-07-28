(function () {
  'use strict';

  angular.module('JfjAdmin.pages.notify.user')
    .controller('UserNotifyController', UserNotifyController);

  /** @ngInject */
  function UserNotifyController($scope, adminNotify, toastr) {
    $scope.notifyUeditor = function () {
      if ($scope.checkValidity()) {
        return;
      }
      $scope.notify && $scope.notify.query && ($scope.notify.query._id = $scope.notify.query._id || undefined);
      adminNotify.pushMessageToUser($scope.notify)
      .then(function (resp) {
        if (resp.data.msg === "success") {
          toastr.success('消息推送成功');
          $scope.notify = '';
        } else if (resp.data.err_msg) {
          toastr.error(resp.data.err_msg);
        }
      }, function (err) {
        console.log(err);
      });
    }

    $scope.checkValidity = function () {
      if (!$scope.notify) {
        toastr.info('标题不能为空');
        return true;
      } else if ($scope.notify) {
        if (!$scope.notify.title) {
          toastr.info('标题不能为空');
          return true;
        } else if (!$scope.notify.content) {
          toastr.info('标题简述不能为空');
          return true;
        } else if (!$scope.notify.html) {
          toastr.info('内容不能为空');
          return true;
        }
      }
      return false;
    }
  }
})();