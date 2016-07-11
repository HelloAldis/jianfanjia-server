(function () {
  angular.module('JfjAdmin.pages.comment')
    .controller('CommentController', [ //设计师列表
      '$scope', 'adminComment', '$stateParams', '$location', 
      function ($scope, adminComment, $stateParams, $location) {
        $stateParams.detail = JSON.parse($stateParams.detail || '{}');
        //刷新页面公共方法
        function refreshPage(detail) {
          $location.path('/commentList/' + JSON.stringify(detail));
        }

        //从url详情中初始化页面
        function initUI(detail) {
          if (detail.query) {
            if (detail.query.date) {
              if (detail.query.date["$gte"]) {
                $scope.startTime.time = new Date(detail.query.date["$gte"]);
              }

              if (detail.query.date["$lte"]) {
                $scope.endTime.time = new Date(detail.query.date["$lte"]);
              }
            }
          }

          detail.from = detail.from || 0;
          detail.limit = detail.limit || 10;
          $scope.pagination.pageSize = detail.limit;
          $scope.pagination.currentPage = (detail.from / detail.limit) + 1;
          detail.sort = detail.sort || {
            date: -1
          };
          $scope.sort = detail.sort;
        }

        //从页面获取详情
        function refreshDetailFromUI(detail) {
          var gte = $scope.startTime.time ? $scope.startTime.time.getTime() : undefined;
          var lte = $scope.endTime.time ? $scope.endTime.time.getTime() : undefined;

          var createAt = gte && lte ? {
            "$gte": gte,
            "$lte": lte
          } : undefined;

          detail.query = detail.query || {};
          detail.query.date = createAt;
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

        //加载数据
        function loadList(detail) {
          if (detail.query && detail.query.date && detail.query.date.$lte) {
            detail.query.date.$lte += 86399999;
          }
          adminComment.search(detail).then(function (resp) {
            if (resp.data.data.total === 0) {
              $scope.loading.loadData = true;
              $scope.loading.notData = true;
              $scope.userList = [];
            } else {
              $scope.userList = resp.data.data.comments;
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

        //搜索设计师
        $scope.searchBtn = function () {
          var start = new Date($scope.startTime.time).getTime();
          var end = new Date($scope.endTime.time).getTime();
          if (start > end) {
            alert('开始时间不能晚于结束时间，请重新选择。');
            return;
          }
          $scope.pagination.currentPage = 1;
          refreshPage(refreshDetailFromUI($stateParams.detail));
        }

        // 屏蔽评论
        $scope.forbidComment = function (id) {
          if (confirm("你确定要屏蔽吗？屏蔽不能恢复")) {
            adminComment.forbid({
              "commentid": id
            })
            .then(function (resp) {
              if (resp.data.msg === "success") {
                loadList(refreshDetailFromUI($stateParams.detail));
              }
            }, function (err) {
              console.log(err);
            })
          }
        }

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
          $stateParams.detail = {};
          refreshPage(refreshDetailFromUI($stateParams.detail));
        };
      }
    ]);
})();