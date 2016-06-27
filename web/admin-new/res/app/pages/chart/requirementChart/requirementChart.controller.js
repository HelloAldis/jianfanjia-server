(function () {
  angular.module('JfjAdmin.pages.chart.requirement')
    .controller('RequirementChartController', ['$scope', '$rootScope', 'adminStatistic', '$filter', 'queryUtil',
      RequirementChartController
    ]);

  function RequirementChartController($scope, $rootScope, adminStatistic, $filter, queryUtil) {
    function initChart1() {
      var now = new Date();
      $scope.timeRanges1 = [];
      $scope.labels1 = [];
      for (var i = 0; i > -12; i--) {
        var gte = queryUtil.getNMonth0Clock(i, now).getTime();
        var lte = queryUtil.getNMonth0Clock(i + 1, now).getTime()
        $scope.timeRanges1.push({
          range: {
            $gte: gte,
            $lte: lte
          }
        });
        $scope.labels1.push($filter('date')(gte, 'yyyy-MM', '+0800'));
      }
      $scope.labels1.reverse();

      $scope.querys1 = [{
        key: 'requirement',
        querys: queryUtil.genQuerys($scope.timeRanges1, 'create_at')
      }, {
        key: 'requirement',
        querys: queryUtil.genQuerys($scope.timeRanges1, 'create_at', {
          status: {
            $in: ['4', '5', '7', '8']
          }
        })
      }];

      $scope.series1 = ['新增需求数', '新增成交数'];
      adminStatistic.statistic_info({
        querys: $scope.querys1
      }).then(function (resp) {
        if (resp.data.data.total === 0) {
          // $scope.loading.loadData = true;
          // $scope.loading.notData = true;
          $scope.statistic1 = [];
        } else {
          $scope.statistic1 = resp.data.data;
          // $scope.loading.loadData = true;
          // $scope.loading.notData = false;
        }
      }, function (resp) {
        //返回错误信息
        $scope.loadData = false;
        console.log(resp);
      });
    }

    function initChart2() {
      var now = new Date();
      $scope.timeRanges2 = [];
      $scope.labels2 = [];
      for (var i = 0; i > -30; i--) {
        var gte = queryUtil.getNDay0Clock(i, now).getTime();
        var lte = queryUtil.getNDay0Clock(i + 1, now).getTime()
        $scope.timeRanges2.push({
          range: {
            $gte: gte,
            $lte: lte
          }
        });
        $scope.labels2.push($filter('date')(gte, 'MM－dd', '+0800'));
      }
      $scope.labels2.reverse();

      $scope.querys2 = [{
        key: 'requirement',
        querys: queryUtil.genQuerys($scope.timeRanges2, 'create_at')
      }, {
        key: 'requirement',
        querys: queryUtil.genQuerys($scope.timeRanges2, 'create_at', {
          status: {
            $in: ['4', '5', '7', '8']
          }
        })
      }];

      $scope.series2 = ['新增需求数', '新增成交数'];
      adminStatistic.statistic_info({
        querys: $scope.querys2
      }).then(function (resp) {
        if (resp.data.data.total === 0) {
          $scope.statistic2 = [];
        } else {
          $scope.statistic2 = resp.data.data;
        }
      }, function (resp) {
        //返回错误信息
        $scope.loadData = false;
        console.log(resp);
      });
    }

    function initChart2() {
      var now = new Date();
      $scope.timeRanges3 = [];
      $scope.labels3 = [];
      for (var i = 0; i > -30; i--) {
        var gte = queryUtil.getNDay0Clock(i, now).getTime();
        var lte = queryUtil.getNDay0Clock(i + 1, now).getTime()
        $scope.timeRanges3.push({
          range: {
            $gte: gte,
            $lte: lte
          }
        });
        $scope.labels2.push($filter('date')(gte, 'MM－dd', '+0800'));
      }
      $scope.labels2.reverse();

      $scope.querys2 = [{
        key: 'requirement',
        querys: queryUtil.genQuerys($scope.timeRanges3, 'create_at')
      }, {
        key: 'requirement',
        querys: queryUtil.genQuerys($scope.timeRanges3, 'create_at', {
          status: {
            $in: ['4', '5', '7', '8']
          }
        })
      }];

      $scope.series2 = ['新增需求数', '新增成交数'];
      adminStatistic.statistic_info({
        querys: $scope.querys2
      }).then(function (resp) {
        if (resp.data.data.total === 0) {
          $scope.statistic2 = [];
        } else {
          $scope.statistic2 = resp.data.data;
        }
      }, function (resp) {
        //返回错误信息
        $scope.loadData = false;
        console.log(resp);
      });
    }

    initChart1();
    initChart2();

  }
})();
