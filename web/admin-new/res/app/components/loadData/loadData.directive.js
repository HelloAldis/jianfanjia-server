/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('JfjAdmin.components')
    .directive('loadData', loadData);

  /** @ngInject */
  function loadData() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/components/loadData/loadData.html'
    };
  }

  angular.module('JfjAdmin.components')
    .directive('noData', noData);

  /** @ngInject */
  function noData() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/components/loadData/noData.html'
    };
  }

})();
