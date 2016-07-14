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
        delegate: '=',
        config: '='
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

        // 搜索
        $scope.search = function (search_word) {
          var start = new Date($scope.dtStart).getTime();
          var end = new Date($scope.dtEnd).getTime();

          if (start > end) {
            alert('开始时间不能晚于结束时间，请重新选择。');
            return;
          }

          $scope.delegate.search(search_word);
        }

        // 重置
        $scope.clearStatus = function () {
          $scope.delegate.clearStatus();
        }

        // 结束时间设置为当天最后一秒
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