(function () {
  'use strict';
  angular.module('controllers')
    .controller('FeedbackController', [
      '$scope', '$rootScope', 'adminApp', '$stateParams', '$location',
      function ($scope, $rootScope, adminApp, $stateParams, $location) {
        $stateParams.detail = JSON.parse($stateParams.detail || '{}');

        //刷新页面公共方法
        function refreshPage(detail) {
          $location.path('/feedback/' + JSON.stringify(detail));
        }

        //数据加载显示状态
        $scope.loading = {
          loadData: false,
          notData: false
        };
        //分页控件
        $scope.pagination = {
          currentPage: 1,
          totalItems: 0,
          maxSize: 5,
          pageSize: 10,
          pageChanged: function () {
            refreshPage(getDetailFromUI());
          }
        };

        //从url详情中初始化页面
        function initUI(detail) {
          if (detail.createAt) {
            if (detail.createAt["$gte"]) {
              $scope.startTime.time = new Date(detail.createAt["$gte"]);
            }

            if (detail.createAt["$lte"]) {
              $scope.endTime.time = new Date(detail.createAt["$lte"]);
            }
          }

          detail.currentPage = detail.currentPage || 1;
          $scope.pagination.currentPage = detail.currentPage;
        }

        //从页面获取详情
        function getDetailFromUI() {
          var gte = $scope.startTime.time ? $scope.startTime.time.getTime() : undefined;
          var lte = $scope.endTime.time ? $scope.endTime.time.getTime() : undefined;
          var createAt = gte && lte ? {
            "$gte": gte,
            "$lte": lte
          } : undefined;

          return {
            currentPage: $scope.pagination.currentPage,
            createAt: createAt
          }
        }

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
        $scope.searchTimeBtn = function () {
          var start = new Date($scope.startTime.time).getTime();
          var end = new Date($scope.endTime.time).getTime()
          if (start > end) {
            alert('开始时间比结束时间大，请重新选择');
            return;
          }
          if (end - start < 86400000) {
            alert('结束时间必须必比开始时间大一天，请重新选择');
            return;
          }

          $scope.pagination.currentPage = 1;
          refreshPage(getDetailFromUI());
        };
        //重置清空状态
        $scope.clearStatus = function () {
          $scope.pagination.currentPage = 1;
          $scope.startTime.time = '';
          $scope.endTime.time = '';
          refreshPage(getDetailFromUI());
        };

        //加载数据
        function loadList(detail) {
          var data = {
            "query": {
              create_at: detail.createAt
            },
            "from": ($scope.pagination.pageSize) * (detail.currentPage - 1),
            "limit": $scope.pagination.pageSize
          }
          adminApp.feedback(data).then(function (resp) {
            if (resp.data.data.total == 0) {
              $scope.loading.loadData = true;
              $scope.loading.notData = true;
            } else {
              $scope.userList = resp.data.data.requirements;
              $scope.pagination.totalItems = resp.data.data.total;
              $scope.loading.loadData = true;
              $scope.loading.notData = false;
            }
          }, function (resp) {
            //返回错误信息
            $scope.loadData = false;
            console.log(resp);
          });
        }
        //初始化UI
        initUI($stateParams.detail);
        //初始化数据
        loadList($stateParams.detail);
      }
    ]);
})();
