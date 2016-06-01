(function () {
  'use strict';
  angular.module('directives', [])
    .directive('exportData', function () {
      console.log('hereeeeee');
      return {
        restrict: 'A',
        replace: true,
        controller: function ($scope) {
          $scope.exportCSV = function (tableid) {
            $('table').table2CSV();
          }
        },
        template: '<button type="button" class="btn btn-success" ng-click="exportCSV()">导出数据</button>'
      };
    });
})();
