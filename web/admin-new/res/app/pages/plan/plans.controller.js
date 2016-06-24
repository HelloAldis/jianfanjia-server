(function () {
  angular.module('JfjAdmin.pages.plan')
    .controller('PlansController', [
      '$scope', '$rootScope', 'adminPlan', '$stateParams', '$location', 'mutiSelected',
      function ($scope, $rootScope, adminPlan, $stateParams, $location, mutiSelected) {
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
          if (detail.query) {
            if (detail.query.last_status_update_time) {
              if (detail.query.last_status_update_time["$gte"]) {
                $scope.startTime.time = new Date(detail.query.last_status_update_time["$gte"]);
              }

              if (detail.query.last_status_update_time["$lte"]) {
                $scope.endTime.time = new Date(detail.query.last_status_update_time["$lte"]);
              }
            }

            mutiSelected.initMutiSelected($scope.authList, detail.query.status);
          }

          detail.from = detail.from || 0;
          detail.limit = detail.limit || 10;
          $scope.pagination.pageSize = detail.limit;
          $scope.pagination.currentPage = (detail.from / detail.limit) + 1;
          detail.sort = detail.sort || {
            request_date: -1
          };
          $scope.sort = detail.sort;
        }

        //从页面获取详情
        function refreshDetailFromUI(detail) {
          var gte = $scope.startTime.time ? $scope.startTime.time.getTime() : undefined;
          var lte = $scope.endTime.time ? $scope.endTime.time.getTime() : undefined;

          var last_status_update_time = gte && lte ? {
            "$gte": gte,
            "$lte": lte
          } : undefined;

          detail.query = detail.query || {};
          detail.query.status = mutiSelected.getInQueryFormMutilSelected($scope.authList);
          detail.query.last_status_update_time = last_status_update_time;
          detail.from = ($scope.pagination.pageSize) * ($scope.pagination.currentPage - 1);
          detail.limit = $scope.pagination.pageSize;
          detail.sort = $scope.sort;
          return detail;
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
            refreshPage(refreshDetailFromUI($stateParams.detail));
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

          refreshPage(refreshDetailFromUI($stateParams.detail));
        };
        $scope.authBtn = function (id) {
          $scope.pagination.currentPage = 1;
          mutiSelected.curList($scope.authList, id);
          refreshPage(refreshDetailFromUI($stateParams.detail));
        };
        //排序
        $scope.sortData = function (sortby) {
          if ($scope.sort[sortby]) {
            $scope.sort[sortby] = -$scope.sort[sortby];
          } else {
            $scope.sort = {};
            $scope.sort[sortby] = -1;
          }
          $scope.pagination.currentPage = 1;
          refreshPage(refreshDetailFromUI($stateParams.detail));
        };

        //重置清空状态
        $scope.clearStatus = function () {
          $scope.pagination.currentPage = 1;
          $scope.startTime.time = '';
          $scope.endTime.time = '';
          mutiSelected.clearCur($scope.authList);
          $stateParams.detail = {};
          refreshPage(refreshDetailFromUI($stateParams.detail));
        }

        //加载数据
        function loadList(detail) {
          adminPlan.search(detail).then(function (resp) {
            if (resp.data.data.total === 0) {
              $scope.loading.loadData = true;
              $scope.loading.notData = true;
              $scope.userList = [];
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
