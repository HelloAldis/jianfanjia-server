(function () {
  angular.module('JfjAdmin.pages.requirement')
    .controller('AssignDesignerController', [
      '$scope', '$stateParams', 'toastr', 'adminRequirement', 'adminDesigner', 'adminUser',
      function ($scope, $stateParams, toastr, adminRequirement, adminDesigner, adminUser) {
        console.log($stateParams);
        $scope.orderDesignerIds = $stateParams.orderDesignerIds.split(',');
        $scope.config = {
          title: '设计师注册时间过滤：',
          placeholder: '手机号码/设计师名字/设计师ID',
          search_word: $scope.search_word
        }

        $scope.delegate = {};

        // 搜索
        $scope.delegate.search = function (search_word) {
          $scope.pagination.currentPage = 1;
          loadList(refreshDetailFromUI($stateParams.detail));
        }

        // 重置
        $scope.delegate.clearStatus = function () {
          $scope.pagination.currentPage = 1;
          $scope.config.search_word = undefined;
          $stateParams.detail = {};
          loadList(refreshDetailFromUI($stateParams.detail));
        }


        $stateParams.detail = JSON.parse($stateParams.detail || '{}');

        //从url详情中初始化页面
        function initUI(detail) {
          if (detail.query) {
            $scope.config.search_word = detail.search_word;
          }

          detail.from = detail.from || 0;
          detail.limit = detail.limit || 10;
          $scope.pagination.pageSize = detail.limit;
          $scope.pagination.currentPage = (detail.from / detail.limit) + 1;
        }

        //从页面获取详情
        function refreshDetailFromUI(detail) {
          detail.query = detail.query || {};
          detail.search_word = $scope.config.search_word || undefined;
          detail.from = ($scope.pagination.pageSize) * ($scope.pagination.currentPage - 1);
          detail.limit = $scope.pagination.pageSize;
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
            loadList(refreshDetailFromUI($stateParams.detail));
          }
        };

        //加载数据
        function loadList(detail) {
          adminDesigner.search(detail).then(function (resp) {
            if (resp.data.data.total === 0) {
              $scope.loading.loadData = true;
              $scope.loading.notData = true;
              $scope.userList = [];
            } else {
              $scope.userList = resp.data.data.designers;
              console.log($scope.userList);
              $scope.pagination.totalItems = resp.data.data.total;
              $scope.loading.loadData = true;
              $scope.loading.notData = false;

              // 找出已指派的设计师
              $scope.userList.forEach(function(designer) {
                $scope.orderDesignerIds.forEach(function(id){
                  if (designer._id === id) {
                    designer.isAssign = true;
                  }
                })
              })
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

        // 指派设计师
        $scope.assignDesigner = function (designer) {
          adminUser.orderDesigner(
            {
              requirementid: $stateParams.requireId,
              designerids: [designer._id]
            }
          )
          .then(function (res) {
            console.log(res);
            if (res.data.msg == 'success') {
              designer.isAssign = true;
              angular.merge($stateParams.orderDesignerIds, designer._id);

            } else {
              toastr.info(res.data.err_msg);
            }
          }, function (error) {
            $scope.loadData = false;
            console.log(error);
          })
        }
      }
    ]);
})();
