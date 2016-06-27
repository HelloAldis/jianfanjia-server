(function () {
  angular.module('JfjAdmin.pages.designer')
    .controller('DesignerTeamEditorController', [ //设计师编辑施工团队
      '$scope', '$rootScope', '$stateParams', '$http', '$filter', '$location',
      function ($scope, $rootScope, $stateParams, $http, $filter, $location) {
        $http({ //获取数据
          method: "POST",
          url: 'api/v2/web/admin/search_team',
          data: {
            "query": {
              "_id": $stateParams.id,
            },
            "sort": {
              "_id": 1
            },
            "from": 0,
            "limit": 1000
          }
        }).then(function (resp) {
          //返回信息
          $scope.team = resp.data.data.teams[0];
          //所在地区
          var desArea = $('#where_area');
          desArea.empty();
          if (!!$scope.team.province) {
            var designAreaQuery = $scope.team.province + " " + $scope.team.city + " " + $scope.team.district;
            desArea.find('input[name=where_area]').val(designAreaQuery)
            var designArea = new CitySelect({
              id: 'where_area',
              "query": designAreaQuery
            });
          } else {
            desArea.find('input[name=where_area]').val("")
            var designArea = new CitySelect({
              id: 'where_area'
            });
          }
          $scope.teamSexs = [{
            "id": "0",
            "name": "男"
          }, {
            "id": "1",
            "name": "女"
          }]

          function findteamGoodAtsId(str) {
            return {
              "水电": "0",
              "木工": "1",
              "油工": "2",
              "泥工": "3"
            }[str]
          }

          function findteamGoodAtsName(str) {
            return {
              "0": "水电",
              "1": "木工",
              "2": "油工",
              "3": "泥工"
            }[str]
          }
          $scope.teamGoodAts = [{
            "id": "0",
            "name": "水电"
          }, {
            "id": "1",
            "name": "木工"
          }, {
            "id": "2",
            "name": "油工"
          }, {
            "id": "3",
            "name": "泥工"
          }]
          $scope.team.good_at = findteamGoodAtsId($scope.team.good_at)
          console.log(resp.data.data.teams[0]);
          uploadFirl($('#upload'), true);
          uploadFirl($('#upload1'), false);

          function uploadFirl(obj, off) {
            obj.Huploadify({
              auto: true,
              fileTypeExts: '*.jpg;*.jpeg;*.png;',
              multi: true,
              formData: {
                key: 123456,
                key2: 'vvvv'
              },
              fileSizeLimit: 3072,
              showUploadedPercent: false,
              showUploadedSize: true,
              removeTimeout: 1,
              fileObjName: 'Filedata',
              buttonText: "",
              uploader: 'api/v2/web/image/upload',
              onUploadComplete: function (file, data, response) {
                var data = $.parseJSON(data);
                if (off) {
                  console.log(data.data)
                  $scope.team.uid_image1 = data.data;
                  $scope.$apply()
                } else {
                  $scope.team.uid_image2 = data.data;
                  $scope.$apply()
                }
              }
            });
          }
          $scope.upDataTeam = function () {
            $scope.team.good_at = findteamGoodAtsName($scope.team.good_at)
            console.log($scope.team)
            $http({ //获取数据
              method: "POST",
              url: 'api/v2/web/admin/update_team',
              data: $scope.team
            }).then(function (resp) {
              //返回信息
              console.log(resp);
              $location.path('designer/team/' + $scope.userUid); //设置路由跳转
            }, function (resp) {
              //返回错误信息
              console.log(resp);
              promptMessage('获取数据失败', resp.data.msg)
            });
          };
        }, function (resp) {
          //返回错误信息
          console.log(resp);
          promptMessage('获取数据失败', resp.data.msg)
        });

        $scope.close = function () {
          window.history.back();
        }
      }
    ]);
})();
