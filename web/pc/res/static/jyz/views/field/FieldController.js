(function () {
  angular.module('controllers')
    .controller('FieldController', [
      '$scope', '$rootScope', 'adminField', '$stateParams', '$location',
      function ($scope, $rootScope, adminField, $stateParams, $location) {
        $stateParams.detail = JSON.parse($stateParams.detail || '{}');

        //刷新页面公共方法
        function refreshPage(detail) {
          $location.path('/live/' + JSON.stringify(detail));
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
          detail.currentPage = detail.currentPage || 1;
          $scope.pagination.currentPage = detail.currentPage;
        }

        //从页面获取详情
        function getDetailFromUI() {
          return {
            currentPage: $scope.pagination.currentPage,
          }
        }

        function loadList(detail) {
          var data = {
            "query": {},
            "from": ($scope.pagination.pageSize) * (detail.currentPage - 1),
            "limit": $scope.pagination.pageSize
          };
          adminField.search(data).then(function (resp) {
            //返回信息
            if (resp.data.data.total === 0) {
              $scope.loading.loadData = true;
              $scope.loading.notData = true;
              $scope.userList = [];
            } else {
              $scope.processes = resp.data.data.processes;
              $scope.pagination.totalItems = resp.data.data.total;
              $scope.loading.loadData = true;
              $scope.loading.notData = false;
            }
          }, function (resp) {
            //返回错误信息
            console.log(resp);
          })
        };
        //初始化UI
        initUI($stateParams.detail);
        //初始化数据
        loadList($stateParams.detail);
      }
    ])
    .controller('FieldDetailController', [
      '$scope', '$rootScope', '$stateParams', 'adminField',
      function ($scope, $rootScope, $stateParams, adminField) {
        //数据加载显示状态
        $scope.loading = {
          loadData: false,
          notData: false
        };
        adminField.search({
          "query": {
            '_id': $stateParams.id
          },
          "from": 0,
          "limit": 1
        }).then(function (resp) {
          //返回信息
          if (resp.data.data.total === 1) {
            $scope.processes = resp.data.data.processes[0];
            console.log($scope.processes)
            $scope.loading.loadData = true;
          }
        }, function (resp) {
          //返回错误信息
          console.log(resp);
        })
      }
    ]);
})();
