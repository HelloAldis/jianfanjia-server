(function () {
  angular.module('JfjAdmin.pages.user')
    .controller('UserController', [
      '$scope', '$state', 'adminUser', '$stateParams', '$location', 'adminUser',
      function ($scope, $state, adminUser, $stateParams, $location, adminUser) {
        $stateParams.detail = JSON.parse($stateParams.detail || '{}');
        $scope.config = {
          title: '业主注册时间过滤：',
          placeholder: '手机号码/用户业主/业主ID',
          search_word: $scope.search_word
        }
        $scope.delegate = {};
        // 搜索
        $scope.delegate.search = function (search_word) {
          $scope.pagination.currentPage = 1;
          refreshPage(refreshDetailFromUI($stateParams.detail));
        }
        // 清空
        $scope.delegate.clearStatus = function () {
          $scope.pagination.currentPage = 1;
          $scope.dtStart = '';
          $scope.dtEnd = '';
          $scope.config.search_word = undefined;
          $stateParams.detail = {};
          refreshPage(refreshDetailFromUI($stateParams.detail));
        }

        //刷新页面公共方法
        function refreshPage(detail) {
          $location.path('/user/' + JSON.stringify(detail));
        }

        //从url详情中初始化页面
        function initUI(detail) {
          if (detail.query) {
            if (detail.query.create_at) {
              if (detail.query.create_at["$gte"]) {
                $scope.dtStart = new Date(detail.query.create_at["$gte"]);
              }

              if (detail.query.create_at["$lte"]) {
                $scope.dtEnd = new Date(detail.query.create_at["$lte"]);
              }
            }
            $scope.config.search_word = detail.search_word;
          }

          detail.from = detail.from || 0;
          detail.limit = detail.limit || 10;
          $scope.pagination.pageSize = detail.limit;
          $scope.pagination.currentPage = (detail.from / detail.limit) + 1;
          detail.sort = detail.sort || {
            create_at: -1
          };
          $scope.sort = detail.sort;
        }

        //从页面获取详情
        function refreshDetailFromUI(detail) {
          var gte = $scope.dtStart ? $scope.dtStart.getTime() : undefined;
          var lte = $scope.dtEnd ? $scope.dtEnd.getTime() : undefined;
          var createAt = gte || lte ? {
            "$gte": gte,
            "$lte": lte
          } : undefined;

          detail.query = detail.query || {};
          detail.search_word = $scope.config.search_word || undefined;
          detail.query.create_at = createAt;
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

        //搜索业主
        $scope.searchBtn = function () {
          $scope.pagination.currentPage = 1;
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

        //加载数据
        function loadList(detail) {
          adminUser.search(detail).then(function (resp) {
            if (resp.data.data.total === 0) {
              $scope.loading.loadData = true;
              $scope.loading.notData = true;
              $scope.userList = [];
            } else {
              $scope.userList = resp.data.data.users;
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

        // 显示添加业主模态框
        $scope.showModel = function () {
          $('.activeModal').modal('show');
          $scope.user = '';
        }

        // 添加业主
        $scope.addUser = function () {
          if ($scope.user) {
            adminUser.addUser($scope.user)
            .then(function (resp) {
              if (resp.data.msg === 'success') {
                $scope.user.errMsg = '';
                $('.activeModal').modal('hide');
                loadList($stateParams.detail);
              } else {
                $scope.user.errMsg = resp.data.err_msg;
              }
            }, function (err) {
              console.log(err);
            });
          }
        }

        // 显示提交业主需求模态框
        $scope.showModel = function (userId) {
          $('.modalRequirement').modal('show');
          $scope.userId = userId;
          // console.log($scope.require);
          $scope.dataMapped = {
            city:"请选择市",
            district:"请选择县/区",
            province:"请选择省份",
            dec_style: "0",
            house_type: "0",
            work_type: "0",
            package_type: "0",
            prefer_sex: "2",
            communication_type: "0"
          };
        }

        // 户型
        $scope.house_type = [
          {
            "num": 0,
            "name": '一室'
          }, {
            "num": 1,
            "name": '二室'
          }, {
            "num": 2,
            "name": '三室'
          }, {
            "num": 3,
            "name": '四室'
          }, {
            "num": 4,
            "name": '复式'
          }, {
            "num": 5,
            "name": '别墅'
          }, {
            "num": 6,
            "name": 'LOFT'
          }, {
            "num": 7,
            "name": '其他'
          }
        ];
        // 包工类型
        $scope.work_type = [
          {
            "num": 0,
            "name": '设计＋施工(半包)'
          }, {
            "num": 1,
            "name": '设计＋施工(全包)'
          }, {
            "num": 2,
            "name": '纯设计'
          }
        ];
        // 包类型
        $scope.package_type = [
          {
            "num": 0,
            "name": '默认包'
          }, {
            "num": 1,
            "name": '365块每平米基础包'
          }, {
            "num": 2,
            "name": '匠心尊享包'
          }
        ];
        // 风格喜好
        $scope.dec_style = [
          {
            "num": 0,
            "name": '欧式'
          }, {
            "num": 1,
            "name": '中式'
          }, {
            "num": 2,
            "name": '现代'
          }, {
            "num": 3,
            "name": '地中海'
          }, {
            "num": 4,
            "name": '美式'
          }, {
            "num": 5,
            "name": '东南亚'
          }, {
            "num": 6,
            "name": '田园'
          }
        ];
        // 性别
        $scope.prefer_sex = [
          {
            "num": 0,
            "name": '男'
          }, {
            "num": 1,
            "name": '女'
          }, {
            "num": 2,
            "name": '不限'
          }
        ];
        // 倾向设计师类型
        $scope.communication_type = [
          {
            "num": 0,
            "name": '不限'
          }, {
            "num": 1,
            "name": '表达型'
          }, {
            "num": 2,
            "name": '倾听型'
          }
        ];

        // 提交业主需求
        $scope.addUserRequirement = function () {
          if ($scope.dataMapped) {
            adminUser.addRequirement(angular.merge($scope.dataMapped, {userid: $scope.userId}))
            .then(function (resp) {
              $scope.dataMapped.errMsg = '';
              $('.modalRequirement').modal('hide');
              console.log(resp);
              // loadList($stateParams.detail);
              $state.go('requirementDetail', {id: resp.data.data.requirementid})
              // $location.path('/requirementDetail/' + resp.data.data.requirementid);

              // todo
              // if (resp.data.msg === 'success') {
              //   $scope.dataMapped.errMsg = '';
              //   $('.modalRequirement').modal('hide');
              //   loadList($stateParams.detail);
              // } else {
              //   $scope.dataMapped.errMsg = resp.data.err_msg;
              // }
            }, function (err) {
              console.log(err);
            });
          }
        }
      }
    ]);
})();
