(function () {
  angular.module('controllers')
    .controller('PicturesListController', ['$scope', '$rootScope', 'adminImage', '$stateParams', '$location',
      function ($scope, $rootScope, adminImage, $stateParams, $location) {
        $stateParams.detail = JSON.parse($stateParams.detail || '{}');

        //刷新页面公共方法
        function refreshPage(detail) {
          $location.path('/pictures/' + JSON.stringify(detail));
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

        //从url详情中初始化页面
        function initUI(detail) {
          if (detail.query) {
            if (detail.query.create_at) {
              if (detail.query.create_at["$gte"]) {
                $scope.startTime.time = new Date(detail.query.create_at["$gte"]);
              }

              if (detail.query.create_at["$lte"]) {
                $scope.endTime.time = new Date(detail.query.create_at["$lte"]);
              }
            }
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
          var gte = $scope.startTime.time ? $scope.startTime.time.getTime() : undefined;
          var lte = $scope.endTime.time ? $scope.endTime.time.getTime() : undefined;
          var createAt = gte && lte ? {
            "$gte": gte,
            "$lte": lte
          } : undefined;

          detail.query = detail.query || {};
          detail.query.create_at = createAt;
          detail.from = ($scope.pagination.pageSize) * ($scope.pagination.currentPage - 1);
          detail.limit = $scope.pagination.pageSize;
          detail.sort = $scope.sort;
          return detail;
        }

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
            alert('开始时间不能晚于结束时间，请重新选择。');
            return;
          }
          if (end - start < 86400000) {
            alert('结束时间必须必比开始时间大一天，请重新选择');
            return;
          }
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
        //重置清空状态
        $scope.clearStatus = function () {
          $scope.pagination.currentPage = 1;
          $scope.startTime.time = '';
          $scope.endTime.time = '';
          $stateParams.detail = {};
          refreshPage(refreshDetailFromUI($stateParams.detail));
        };
        //加载数据
        function loadList(detail) {
          adminImage.search(detail).then(function (resp) {
            if (resp.data.data.total === 0) {
              $scope.loading.loadData = true;
              $scope.loading.notData = true;
              $scope.userList = [];
            } else {
              $scope.userList = resp.data.data.beautifulImages;
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


        //更改显示状态
        $scope.changeStatus = function (id, status, image) {
          status = status == 0 ? "1" : "0";
          adminImage.upload({
            "_id": id,
            "status": status
          }).then(function (resp) {
            if (resp.data.msg === "success") {
              loadList(refreshDetailFromUI($stateParams.detail));
            }
          }, function (resp) {
            //返回错误信息
            $scope.loadData = false;
            console.log(resp);
          });
        }
      }
    ])
    .controller('PicturesAddController', ['$scope', '$rootScope', '$stateParams', '$state', 'adminImage', function ($scope, $rootScope,
      $stateParams, $state, adminImage) {
      var currentId = $stateParams.id == undefined ? "" : $stateParams.id;
      $scope.dec_type = [{
        "num": 0,
        "name": '家装'
      }, {
        "num": 1,
        "name": '商装'
      }, {
        "num": 2,
        "name": '软装'
      }];
      $scope.dec_style = [{
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
      }];
      $scope.house_type = [{
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
      }];
      $scope.section = ['厨房', '客厅', '卫生间', '卧室', '餐厅', '书房', '玄关', '阳台', '儿童房', '走廊', '储物间']
      $scope.images = {
        "title": "",
        "description": "",
        "dec_type": "0",
        "house_type": "0",
        "dec_style": "0",
        "images": [],
        "section": '厨房'
      }
      if (currentId) {
        adminImage.search({
          "query": {
            "_id": currentId
          },
          "from": 0,
          "limit": 1
        }).then(function (resp) {
          if (resp.data.data.total === 1) {
            $scope.images = resp.data.data.beautifulImages[0];
            if ($scope.images.keywords.indexOf(",") != -1) {
              $scope.images.keywords = $scope.images.keywords.split(",").join("|");
            }
          }
        }, function (resp) {
          //返回错误信息
          $scope.loadData = false;
          console.log(resp);

        });
      }
      $scope.cancel = function () {
        window.history.back();
      }
      $scope.picturesSubmit = function () {
        if ($scope.images.keywords.indexOf("|") != -1) {
          $scope.images.keywords = $scope.images.keywords.split("|").join(",");
        }
        if (!currentId) {
          adminImage.add($scope.images).then(function (resp) {
            if (resp.data.msg === "success") {
              $state.go('pictures')
            }
          }, function (resp) {
            //返回错误信息
            $scope.loadData = false;
            console.log(resp);
          });
        } else {
          adminImage.upload($scope.images).then(function (resp) {
            if (resp.data.msg === "success") {
              $state.go('pictures')
            }
          }, function (resp) {
            //返回错误信息
            $scope.loadData = false;
            console.log(resp);
          });
        }
      }
    }])
    .directive('myProductuploade', ['$timeout', function ($timeout) { //作品图片上传
      return {
        replace: true,
        scope: {
          myQuery: "="
        },
        restrict: 'A',
        template: '<div class="k-uploadbox clearfix"><div class="pic" id="create"><div class="fileBtn"><input class="hide" id="createUpload" type="file" name="upfile"><input type="hidden" id="sessionId" value="${pageContext.session.id}" /><input type="hidden" value="1215154" name="tmpdir" id="id_create"></div><div class="tips"><span><em></em><i></i></span><p>图片上传每张3M以内jpg<strong ng-if="mySection.length">作品/照片/平面图上均不能放置个人电话号码或违反法律法规的信息。</strong></p></div></div><div class="previews-item" ng-repeat="img in myQuery"><span class="close" ng-click="removeImg($index,myQuery)"></span><div class="img"><img class="img" src="/api/v2/web/thumbnail/168/{{img.imageid}}" alt=""><div><div class="selecte"><input type="text" class="form-control" ng-model="img.name" /></div></div></div>',
        link: function ($scope, iElm, iAttrs, controller) {
          var uploaderUrl = RootUrl + 'api/v2/web/image/upload',
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
              if ($scope.myQuery.indexOf(data.data) == -1) {
                $scope.$apply(function () {
                  $scope.myQuery.push({
                    "imageid": data.data,
                    "width": img.width,
                    "height": img.height
                  })
                });
              } else {
                alert('已经上传过了')
              }
            };
            img.onerror = function () {
              alert("error!")
            };
            img.src = RootUrl + 'api/v2/web/image/' + data.data;
          }
          $scope.removeImg = function (i, arr) {
            if (arr.length < 2) {
              alert('至少保留一张图片');
              return;
            }
            if (confirm("你确定要删除吗？删除不能恢复")) {
              arr.splice(i, 1)
              $timeout(function () {
                $scope.myQuery = arr
              }, 0, false);
            }
          }
        }
      };
    }])
    .directive('ellipsis', ['$timeout', function ($timeout) { //检测标题长度
      return {
        replace: true,
        require: 'ngModel',
        restrict: 'A',
        link: function ($scope, iElm, iAttrs, controller) {
          var ellipsis = function (string, length) {
            function getLength(str) {
              var realLength = 0,
                len = str.length,
                charCode = -1;
              for (var i = 0; i < len; i++) {
                charCode = str.charCodeAt(i);
                if (charCode >= 0 && charCode <= 128) realLength += 1;
                else realLength += 2;
              }
              return realLength;
            }

            function cutstr(str, len) {
              var str_length = 0,
                str_cut = new String(),
                str_len = str.length;
              for (var i = 0; i < str_len; i++) {
                var a = str.charAt(i);
                str_length++;
                if (escape(a).length > 4) {
                  str_length++;
                }
                str_cut = str_cut.concat(a);
                if (str_length >= len) {
                  str_cut = str_cut.concat("...");
                  return str_cut;
                }
              }
              if (str_length < len) {
                return str;
              }
            }
            if (getLength(string) > length) {
              return true;
            } else {
              return false;
            }
          }
          $scope.$watch(iAttrs.ngModel, function (newValue, oldValue, scope) {
            if (ellipsis(newValue, 40)) {
              controller.$setValidity('ellipsis', false)
            } else {
              controller.$setValidity('ellipsis', true)
            }
          });
        }
      };
    }])
})();
