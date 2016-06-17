/**
 * @author Aldis
 */
(function () {
  'use strict';

  angular.module('JfjAdmin.components')
    .directive('uploadImage', uploadImage);

  /** @ngInject */
  function uploadImage() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/components/uploadImage/uploadImage.html',
      controller: function () {

      }
    };
  }

})();
