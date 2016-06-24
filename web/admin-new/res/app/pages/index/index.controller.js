(function () {
  angular.module('JfjAdmin.pages.index')
    .controller('IndexController', ['$scope', '$rootScope', 'adminStatistic', IndexController]);

  function IndexController($scope, $rootScope, adminStatistic) {
    console.log($('#dataTable'));

    function getNDay0Clock(n, date) {
      var time = date.getTime() + (n * 1000 * 60 * 60 * 24);
      date = new Date(time);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    function getNMonth0Clock(n, date) {
      var time = getNDay0Clock(0, date);
      return new Date(time.setMonth(time.getMonth() + n, 1));
    }

    function getNWeek0Clock(n, date) {
      var time = getNDay0Clock(0, date);
      var diff = date.getDay() - 1;
      diff = diff == -1 ? 6 : diff;
      return new Date(time.setDate(time.getDate() - diff + (n * 7)));
    }

    var now = new Date();
    var nowTime = now.getTime();
    var today0Clock = getNDay0Clock(0, now).getTime();
    var yesterday0Clock = getNDay0Clock(-1, now).getTime();
    var dayBeforeY0Clock = getNDay0Clock(-2, now).getTime();
    var monday0Clock = getNWeek0Clock(0, now).getTime();
    var nextMonday0Clock = getNWeek0Clock(1, now).getTime();
    var lastMonday0Clock = getNWeek0Clock(-1, now).getTime();
    var lastlastMonday0Clock = getNWeek0Clock(-2, now).getTime();
    var nextMonth0Clock = getNMonth0Clock(1, now).getTime();
    var thisMonth0Clock = getNMonth0Clock(0, now).getTime();
    var lastMonth0Clock = getNMonth0Clock(-1, now).getTime();
    var lastlastMonth0Clock = getNMonth0Clock(-2, now).getTime();

    var startDay = 1433088000000;
    var endDay = 1748707200000;

    $scope.timeRanges = [{
      name: '今天',
      range: {
        '$gte': today0Clock,
        '$lte': nowTime
      }
    }, {
      name: '昨天',
      range: {
        '$gte': yesterday0Clock,
        '$lte': today0Clock
      }
    }, {
      name: '前天',
      range: {
        '$gte': dayBeforeY0Clock,
        '$lte': yesterday0Clock
      }
    }, {
      name: '这周',
      range: {
        '$gte': monday0Clock,
        '$lte': nextMonday0Clock
      }
    }, {
      name: '上周',
      range: {
        '$gte': lastMonday0Clock,
        '$lte': monday0Clock
      }
    }, {
      name: '上上周',
      range: {
        '$gte': lastlastMonday0Clock,
        '$lte': lastMonday0Clock
      }
    }, {
      name: '这个月',
      range: {
        '$gte': thisMonth0Clock,
        '$lte': nextMonth0Clock
      }
    }, {
      name: '上个月',
      range: {
        '$gte': lastMonth0Clock,
        '$lte': thisMonth0Clock
      }
    }, {
      name: '上上月',
      range: {
        '$gte': lastlastMonth0Clock,
        '$lte': lastMonth0Clock
      }
    }, {
      name: '全部',
      range: {
        '$gte': startDay,
        '$lte': endDay
      }
    }];

    function genQuerys(timeRanges, name, obj) {
      var querys = timeRanges.map(function (o) {
        var query = {};
        query[name] = o.range;
        for (var variable in obj) {
          if (obj.hasOwnProperty(variable)) {
            query[variable] = obj[variable];
          }
        }

        return query;
      });

      return querys;
    }

    $scope.querys = [{
      name: '新增需求数',
      key: 'requirement',
      querys: genQuerys($scope.timeRanges, 'create_at')
    }, {
      name: '新增成交数',
      key: 'requirement',
      querys: genQuerys($scope.timeRanges, 'create_at', {
        status: {
          $in: ['4', '5', '7', '8']
        }
      })
    }, {
      name: '新增业主数',
      key: 'user',
      querys: genQuerys($scope.timeRanges, 'create_at')
    }, {
      name: '新增设计师数',
      key: 'designer',
      querys: genQuerys($scope.timeRanges, 'create_at')
    }, {
      name: '新方案数',
      key: 'plans',
      querys: genQuerys($scope.timeRanges, 'last_status_update_time')
    }, {
      name: '新增作品数',
      key: 'product',
      querys: genQuerys($scope.timeRanges, 'create_at')
    }, {
      name: '新增直播数',
      key: 'live',
      querys: genQuerys($scope.timeRanges, 'create_at')
    }, {
      name: '新增工地数',
      key: 'fieldList',
      querys: genQuerys($scope.timeRanges, 'create_at')
    }, {
      name: '新增天使用户数',
      key: 'recruit',
      querys: genQuerys($scope.timeRanges, 'create_at')
    }, {
      name: '新增攻略数',
      key: 'news',
      querys: genQuerys($scope.timeRanges, 'create_at')
    }, {
      name: '新增美图数',
      key: 'pictures',
      querys: genQuerys($scope.timeRanges, 'create_at')
    }];

    //数据加载显示状态
    $scope.loading = {
      loadData: false,
      notData: false
    };

    adminStatistic.statistic_info({
      querys: $scope.querys
    }).then(function (resp) {
      if (resp.data.data.total === 0) {
        $scope.loading.loadData = true;
        $scope.loading.notData = true;
        $scope.statistic = [];
      } else {
        $scope.statistic = resp.data.data;
        $scope.loading.loadData = true;
        $scope.loading.notData = false;
      }
    }, function (resp) {
      //返回错误信息
      $scope.loadData = false;
      console.log(resp);
    });

    $scope.getDetail = function (query) {
      return {
        detail: JSON.stringify({
          query: query
        })
      }
    }
  }
})();
