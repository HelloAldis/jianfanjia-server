(function () {
  'use strict';

  angular.module('JfjAdmin.components')
      .directive('dateRangePicker', dateRangePicker);

  /** @ngInject */
  function dateRangePicker() {
    return {
      scope:{
        dtStart: '=',
        dtEnd: '=',
        isButton: '='
      },
      restrict: 'E',
      templateUrl: 'app/components/dateRangePicker/dateRangePicker.html',
      controller: function( $scope, $element) {
        //时间筛选控件
        $scope.startTime = {
          clear: function () {
            this.dt = null;
          },
          dateOptions: {
            formatYear: 'yy',
            startingDay: 1
          },
          status: {
            opened: false
          },
          open: function ($event) {
            this.status.opened = true;
          },
          today: function () {
            this.dt = new Date();
          }
        };
        $scope.startTime.today();
        $scope.endTime = {
          clear: function () {
            this.dt = null;
          },
          dateOptions: {
            formatYear: 'yy',
            startingDay: 1
          },
          status: {
            opened: false
          },
          open: function ($event) {
            this.status.opened = true;
          },
          today: function () {
            this.dt = new Date();
          }
        };
        $scope.endTime.today();

        $scope.$watch('dtEnd', function (newVal, oldVal) {
          if ((!oldVal && newVal) || (oldVal && newVal && oldVal.getTime() !== newVal.getTime())) {
            newVal.setHours(23, 59, 39);
            $scope.dtEnd = newVal;
          }
        });
      }
    }
  }
})();