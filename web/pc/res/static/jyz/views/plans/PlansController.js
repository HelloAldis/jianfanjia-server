(function () {
  angular.module('controllers')
    .controller('PlansController', [
      '$scope', '$rootScope', 'adminPlan', '$stateParams', '$location',
      function ($scope, $rootScope, adminPlan, $stateParams, $location) {
        $scope.authList = [{
          id: "0",
          name: '已预约无响应',
          cur: false
        }, {
          id: "1",
          name: '已拒绝业主',
          cur: false
        }, {
          id: "7",
          name: '无响应过期',
          cur: false
        }, {
          id: "2",
          name: '有响应未量房',
          cur: false
        }, {
          id: "6",
          name: '已量房无方案',
          cur: false
        }, {
          id: "8",
          name: '无方案过期',
          cur: false
        }, {
          id: "3",
          name: '已提交方案',
          cur: false
        }, {
          id: "4",
          name: '方案被拒绝',
          cur: false
        }, {
          id: "5",
          name: '方案被选中',
          cur: false
        }, ];

        //获取url获取json数据
        $stateParams.detail = JSON.parse($stateParams.detail || '{}');

        //刷新页面公共方法
        function refreshPage(detail) {
          $location.path('/plans/' + JSON.stringify(detail));
        }

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

          if (detail.authType) {
            angular.forEach($scope.authList, function (value, key) {
              if (value.id == detail.authType) {
                if (value.cur) {
                  value.cur = false;
                } else {
                  value.cur = true;
                }
              } else {
                value.cur = false;
              }
            });
          }

          detail.currentPage = detail.currentPage || 1;
          $scope.pagination.currentPage = detail.currentPage;
        }

        //从页面获取详情
        function getDetailFromUI() {
          var gte = $scope.startTime.time ? $scope.startTime.time.getTime() : undefined;
          var lte = $scope.endTime.time ? $scope.endTime.time.getTime() : undefined;
          var authType = undefined;
          var createAt = gte && lte ? {
            "$gte": gte,
            "$lte": lte
          } : undefined;

          angular.forEach($scope.authList, function (value, key) {
            if (value.cur) {
              authType = value.id;
            }
          });

          return {
            currentPage: $scope.pagination.currentPage,
            authType: authType,
            createAt: createAt
          }
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
          var end = new Date($scope.endTime.time).getTime();
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
        $scope.authBtn = function (id) {
          $scope.pagination.currentPage = 1;

          angular.forEach($scope.authList, function (value, key) {
            if (value.id == id) {
              value.cur = !value.cur;
            } else {
              value.cur = false;
            }
          });

          refreshPage(getDetailFromUI());
        };

        //重置清空状态
        $scope.clearStatus = function () {
          $scope.pagination.currentPage = 1;
          $scope.startTime.time = '';
          $scope.endTime.time = '';
          angular.forEach($scope.authList, function (value, key) {
            value.cur = false;
          });
          refreshPage(getDetailFromUI());
        }

        //加载数据
        function loadList(detail) {
          var data = {
            "query": {
              status: detail.authType,
              request_date: detail.createAt
            },
            "from": ($scope.pagination.pageSize) * (detail.currentPage - 1),
            "limit": $scope.pagination.pageSize
          };
          adminPlan.search(data).then(function (resp) {
            if (resp.data.data.total === 0) {
              $scope.loading.loadData = true;
              $scope.loading.notData = true;
            } else {
              $scope.userList = resp.data.data.requirements;
              angular.forEach($scope.userList, function (value, key) {
                value.time = parseInt(value._id.substring(0, 8), 16) * 1000;
                angular.forEach($scope.userList, function (value1, key1) {
                  if (value1.requirement.rec_designerids.indexOf(value1.designerid) != -1) {
                    value1.biaoshi = "匹配";
                  } else {
                    value1.biaoshi = "自选";
                  }
                });
              });
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
