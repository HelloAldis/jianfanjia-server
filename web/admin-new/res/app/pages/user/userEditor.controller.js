(function () {
  angular.module('JfjAdmin.pages.user')
    .controller('UserEditorController', [
      '$scope', '$rootScope', '$stateParams', 'adminUser','initData',
      function ($scope, $rootScope, $stateParams, adminUser, initData) {

        $scope.uploader1 = {};

        $scope.decStyle = initData.decStyle;

        $scope.userSex = initData.userSex;

        $scope.dec_progress = [
          {
            "num": "0",
            "txt": "我想看一看"
          },
          {
            "num": "1",
            "txt": "正在做准备"
          },
          {
            "num": "2",
            "txt": "已经开始装修"
          }
        ];

        adminUser.search({
          "query": {
            "_id": $stateParams.id
          },
          "from": 0,
          "limit": 1
        }).then(function (resp) {
          if (resp.data.data.total === 1) {
            $scope.user = resp.data.data.users[0];
          }
        }, function (resp) {
          //返回错误信息
          console.log(resp);

        });

        $scope.editorUser = function(){
          $scope.user.imageid = $scope.uploader1.uploadImageClient.getAllIds()[0];
          console.log($scope.user.imageid);
          adminUser.editorUser($scope.user).then(function(resp){
            //返回信息
            if (resp.data.msg === "success") {
              window.history.back();
            }
          },function(resp){
            //返回错误信息
            console.log(resp);
          })
        }
      }
    ]);
})();
