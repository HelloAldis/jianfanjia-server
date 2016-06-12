(function () {
  angular.module('JfjAdmin.pages.designer')
    .controller('DesignerTeamListController', [ //设计师的施工团队
      '$scope', '$rootScope', '$stateParams', '$http', '$filter', '$location',
      function ($scope, $rootScope, $stateParams, $http, $filter, $location) {
        $http({ //获取数据
          method: "POST",
          url: 'api/v2/web/admin/search_team',
          data: {
            "query": {
              "designerid": $stateParams.id
            },
            "sort": {
              "_id": 1
            },
            "from": 0,
            "limit": 1000
          }
        }).then(function (resp) {
          //返回信息
          angular.forEach(resp.data.data.teams, function (data, key) {
            data.area = !!data.province ? data.province + " " + data.city + " " + data.district : '未填写';
          })
          $scope.userList = resp.data.data.teams;
          $scope.deleteTeam = function (id) {
            if (confirm("你确定要删除吗？删除不能恢复")) {
              alert('你没有权限删除');
            } else {
              // alert(id);
            }
          }
        }, function (resp) {
          //返回错误信息
          console.log(resp);
          promptMessage('获取数据失败', resp.data.msg)
        });
      }
    ]);
})();
