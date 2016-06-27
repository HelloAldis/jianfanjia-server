(function () {
  angular.module('JfjAdmin.pages.chart.requirement')
    .controller('RequirementChartController', ['$scope', '$rootScope', 'adminStatistic', '$filter', 'queryUtil',
      RequirementChartController
    ]);

  function RequirementChartController($scope, $rootScope, adminStatistic, $filter, queryUtil) {
    function initChart1(chart) {
      var now = new Date();
      chart.timeRanges = [];
      chart.labels = [];
      for (var i = 0; i > -12; i--) {
        var gte = queryUtil.getNMonth0Clock(i, now).getTime();
        var lte = queryUtil.getNMonth0Clock(i + 1, now).getTime()
        chart.timeRanges.push({
          range: {
            $gte: gte,
            $lte: lte
          }
        });
        chart.labels.push($filter('date')(gte, 'yyyy-MM', '+0800'));
      }
      chart.timeRanges.reverse();
      chart.labels.reverse();

      chart.querys = [{
        key: 'requirement',
        querys: queryUtil.genQuerys(chart.timeRanges, 'create_at')
      }, {
        key: 'requirement',
        querys: queryUtil.genQuerys(chart.timeRanges, 'create_at', {
          status: {
            $in: ['4', '5', '7', '8']
          }
        })
      }];

      chart.series = ['新增需求数', '新增成交数'];
      adminStatistic.statistic_info({
        querys: chart.querys
      }).then(function (resp) {
        if (resp.data.data.total === 0) {
          chart.statistic = [];
        } else {
          chart.statistic = resp.data.data;
        }
      }, function (resp) {
        //返回错误信息

        console.log(resp);
      });
    }

    function initChart2(chart) {
      var now = new Date();
      chart.timeRanges = [];
      chart.labels = [];
      for (var i = 0; i > -30; i--) {
        var gte = queryUtil.getNDay0Clock(i, now).getTime();
        var lte = queryUtil.getNDay0Clock(i + 1, now).getTime()
        chart.timeRanges.push({
          range: {
            $gte: gte,
            $lte: lte
          }
        });
        chart.labels.push($filter('date')(gte, 'yyyy-MM', '+0800'));
      }
      chart.timeRanges.reverse();
      chart.labels.reverse();

      chart.querys = [{
        key: 'requirement',
        querys: queryUtil.genQuerys(chart.timeRanges, 'create_at')
      }, {
        key: 'requirement',
        querys: queryUtil.genQuerys(chart.timeRanges, 'create_at', {
          status: {
            $in: ['4', '5', '7', '8']
          }
        })
      }];

      chart.series = ['新增需求数', '新增成交数'];
      adminStatistic.statistic_info({
        querys: chart.querys
      }).then(function (resp) {
        if (resp.data.data.total === 0) {
          chart.statistic = [];
        } else {
          chart.statistic = resp.data.data;
        }
      }, function (resp) {
        //返回错误信息

        console.log(resp);
      });
    }

    function initChart3(chart) {
      var now = new Date();
      chart.timeRanges = [];
      chart.labels = [];
      for (var i = 0; i > -30; i--) {
        var gte = queryUtil.getNDay0Clock(i, now).getTime();
        var lte = queryUtil.getNDay0Clock(i + 1, now).getTime()
        chart.timeRanges.push({
          range: {
            $gte: gte,
            $lte: lte
          }
        });
        chart.labels.push($filter('date')(gte, 'MM－dd', '+0800'));
      }
      chart.timeRanges.reverse();
      chart.labels.reverse();

      chart.querys = [{
        key: 'requirement',
        querys: queryUtil.genQuerys(chart.timeRanges, 'create_at')
      }, {
        key: 'requirement',
        querys: queryUtil.genQuerys(chart.timeRanges, 'create_at', {
          platform_type: '2'
        })
      }, {
        key: 'requirement',
        querys: queryUtil.genQuerys(chart.timeRanges, 'create_at', {
          platform_type: '1'
        })
      }, {
        key: 'requirement',
        querys: queryUtil.genQuerys(chart.timeRanges, 'create_at', {
          platform_type: '0'
        })
      }];

      chart.series = ['新增需求数', '来自Web', '来自iOS', '来自Android'];
      adminStatistic.statistic_info({
        querys: chart.querys
      }).then(function (resp) {
        if (resp.data.data.total === 0) {
          chart.statistic = [];
        } else {
          chart.statistic = resp.data.data;
        }
      }, function (resp) {
        //返回错误信息

        console.log(resp);
      });
    }

    function initChart4(chart) {
      var now = new Date();
      chart.timeRanges = [];
      chart.labels = [];
      for (var i = 0; i > -30; i--) {
        var gte = queryUtil.getNDay0Clock(i, now).getTime();
        var lte = queryUtil.getNDay0Clock(i + 1, now).getTime()
        chart.timeRanges.push({
          range: {
            $gte: gte,
            $lte: lte
          }
        });
        chart.labels.push($filter('date')(gte, 'MM－dd', '+0800'));
      }
      chart.timeRanges.reverse();
      chart.labels.reverse();

      chart.querys = [{
        key: 'requirement',
        querys: queryUtil.genQuerys(chart.timeRanges, 'create_at', {
          status: {
            $in: ['4', '5', '7', '8']
          }
        })
      }, {
        key: 'requirement',
        querys: queryUtil.genQuerys(chart.timeRanges, 'create_at', {
          platform_type: '2',
          status: {
            $in: ['4', '5', '7', '8']
          }
        })
      }, {
        key: 'requirement',
        querys: queryUtil.genQuerys(chart.timeRanges, 'create_at', {
          platform_type: '1',
          status: {
            $in: ['4', '5', '7', '8']
          }
        })
      }, {
        key: 'requirement',
        querys: queryUtil.genQuerys(chart.timeRanges, 'create_at', {
          platform_type: '0',
          status: {
            $in: ['4', '5', '7', '8']
          }
        })
      }];

      chart.series = ['成交增需求数', '来自Web', '来自iOS', '来自Android'];
      adminStatistic.statistic_info({
        querys: chart.querys
      }).then(function (resp) {
        if (resp.data.data.total === 0) {
          chart.statistic = [];
        } else {
          chart.statistic = resp.data.data;
        }
      }, function (resp) {
        //返回错误信息

        console.log(resp);
      });
    }

    function initChart5(chart) {
      var now = new Date();
      chart.timeRanges = [];
      chart.labels = [];
      for (var i = 0; i > -12; i--) {
        var gte = queryUtil.getNMonth0Clock(i, now).getTime();
        var lte = queryUtil.getNMonth0Clock(i + 1, now).getTime()
        chart.timeRanges.push({
          range: {
            $gte: gte,
            $lte: lte
          }
        });
        chart.labels.push($filter('date')(gte, 'yyyy-MM', '+0800'));
      }
      chart.timeRanges.reverse();
      chart.labels.reverse();

      chart.querys = [{
        key: 'requirement',
        querys: queryUtil.genQuerys(chart.timeRanges, 'create_at', {
          package_type: '0',
        })
      }, {
        key: 'requirement',
        querys: queryUtil.genQuerys(chart.timeRanges, 'create_at', {
          package_type: '1',
        })
      }, {
        key: 'requirement',
        querys: queryUtil.genQuerys(chart.timeRanges, 'create_at', {
          package_type: '2',
        })
      }];

      chart.series = ['新增默认包数', '新增365包数', '新增匠心包数'];
      adminStatistic.statistic_info({
        querys: chart.querys
      }).then(function (resp) {
        if (resp.data.data.total === 0) {
          chart.statistic = [];
        } else {
          chart.statistic = resp.data.data;
        }
      }, function (resp) {
        //返回错误信息

        console.log(resp);
      });
    }

    $scope.chart1 = {};
    initChart1($scope.chart1);

    $scope.chart2 = {};
    initChart2($scope.chart2);

    $scope.chart3 = {};
    initChart3($scope.chart3);

    $scope.chart4 = {};
    initChart4($scope.chart4);

    $scope.chart5 = {};
    initChart5($scope.chart5);

  }
})();
