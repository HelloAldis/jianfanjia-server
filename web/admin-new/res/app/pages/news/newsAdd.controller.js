(function () {
  angular.module('JfjAdmin.pages.news')
    .controller('NewsAddController', ['$scope', '$rootScope', '$stateParams', '$state', 'adminArticle', function ($scope, $rootScope, $stateParams,
      $state, adminArticle) {
      var currentId = $stateParams.id == undefined ? "" : $stateParams.id;
      $scope.article_type = [{
        "num": 0,
        "name": '大百科'
      }, {
        "num": 1,
        "name": '小贴士'
      }, ];
      $scope.news = {
        "title": "",
        "keywords": "",
        "cover_imageid": undefined,
        "description": "",
        "content": "",
        "articletype": "1"
      }
      if (currentId) {
        adminArticle.search({
          "query": {
            "_id": currentId
          },
          "from": 0,
          "limit": 1
        }).then(function (resp) {
          if (resp.data.data.total === 1) {
            $scope.news = resp.data.data.articles[0];
            if ($scope.news.keywords.indexOf(",") != -1) {
              $scope.news.keywords = $scope.news.keywords.split(",").join("|");
            }
          }
        }, function (resp) {
          //返回错误信息
          $scope.loadData = false;
          console.log(resp);

        });
      }
      $scope.cancel = function () {
        // $state.go('news');
        window.history.back();
      }
      $scope.newsUeditor = function () {
        if ($scope.news.keywords.indexOf("|") != -1) {
          $scope.news.keywords = $scope.news.keywords.split("|").join(",");
        }
        if (!currentId) {
          adminArticle.add($scope.news).then(function (resp) {
            if (resp.data.msg === "success") {
              $state.go('news')
            }
          }, function (resp) {
            //返回错误信息
            $scope.loadData = false;
            console.log(resp);
          });
        } else {
          adminArticle.upload($scope.news).then(function (resp) {
            if (resp.data.msg === "success") {
              $state.go('news')
            }
          }, function (resp) {
            //返回错误信息
            $scope.loadData = false;
            console.log(resp);
          });
        }
      }
    }])
    .directive('myNewsuploade', ['$timeout', function ($timeout) { //封面图片上传
      return {
        replace: true,
        scope: {
          myQuery: "="
        },
        restrict: 'A',
        template: '<div class="k-uploadbox clearfix"><div class="pic" id="create"><div class="fileBtn"><input class="hide" id="createUpload" type="file" name="upfile"><input type="hidden" id="sessionId" value="${pageContext.session.id}" /><input type="hidden" value="1215154" name="tmpdir" id="id_create"></div><div class="tips"><span><em></em><i></i></span><p>图片上传每张3M以内jpg<strong ng-if="mySection.length">作品/照片/平面图上均不能放置个人电话号码或违反法律法规的信息。</strong></p></div></div><div class="previews-item"><div class="img"><img class="img" src="/api/v2/web/thumbnail/168/{{myQuery}}" alt=""><div></div></div>',
        link: function ($scope, iElm, iAttrs, controller) {
          var uploaderUrl = 'api/v2/web/image/upload',
            fileTypeExts = '*.jpg;*.png',
            fileSizeLimit = 3072,
            obj = angular.element(iElm);
          $('#create').Huploadify({
            auto: true,
            fileTypeExts: fileTypeExts,
            multi: false,
            formData: {},
            fileSizeLimit: fileSizeLimit,
            showUploadedPercent: true, //是否实时显示上传的百分比，如20%
            showUploadedSize: true,
            removeTimeout: 1,
            fileObjName: 'Filedata',
            buttonText: "",
            uploader: uploaderUrl,
            onUploadComplete: function (file, data, response) {
              callbackImg(data)
            }
          });

          function callbackImg(arr) {
            var data = $.parseJSON(arr);
            var img = new Image();
            img.onload = function () {
              if (img.width < 820) {
                alert('图片宽度小于820，请重新上传图片');
                return;
              }
              if (img.height < img.width * 0.43) {
                alert('图片高度小于' + img.width * 0.43 + '，请重新上传图片');
                return;
              }
              $scope.$apply(function () {
                $scope.myQuery = data.data
              });
            };
            img.onerror = function () {
              alert("error!")
            };
            img.src = 'api/v2/web/image/' + data.data;
          }
        }
      };
    }]);
})();
