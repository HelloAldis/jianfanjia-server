(function () {
  angular.module('JfjAdmin.pages.chart.requirement')
    .controller('RequirementChartController', ['$scope', '$rootScope', 'adminStatistic', '$filter', RequirementChartController]);

  function RequirementChartController($scope, $rootScope, adminStatistic, $filter) {
    var now = new Date();
    $scope.timeRanges = [];
    $scope.labels = [];
    for (var i = 0; i > -12; i--) {
      var gte = getNMonth0Clock(i, now).getTime();
      var lte = getNMonth0Clock(i + 1, now).getTime()
      $scope.timeRanges.push({
        range: {
          $gte: gte,
          $lte: lte
        }
      });
      $scope.labels.push($filter('date')(gte, 'yyyy-MM', '+0800'));
    }
    $scope.labels.reverse();

    $scope.querys = [{
      key: 'requirement',
      querys: genQuerys($scope.timeRanges, 'create_at')
    }, {
      key: 'requirement',
      querys: genQuerys($scope.timeRanges, 'create_at', {
        status: {
          $in: ['4', '5', '7', '8']
        }
      })
    }];

    $scope.series = ['新增需求数', '新增成交数'];
    console.log($scope.querys);
    adminStatistic.statistic_info({
      querys: $scope.querys
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

    $scope.changeData = function () {
      console.log('hahahha');
    };

    function getNMonth0Clock(n, date) {
      var time = getNDay0Clock(0, date);
      return new Date(time.setMonth(time.getMonth() + n, 1));
    }

    function getNDay0Clock(n, date) {
      var time = date.getTime() + (n * 1000 * 60 * 60 * 24);
      date = new Date(time);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

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
  }
})();
