(function () {
  angular.module('JfjAdmin.pages.live')
    .controller('LiveAddController', [ //创建装修直播
      '$scope', '$rootScope', '$http', '$location', '$filter',
      function ($scope, $rootScope, $http, $location, $filter) {
        var that = this;
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
        $scope.processTime = {
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
        $scope.processTime.today();
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
        $scope.work_type = [{
          "num": 0,
          "name": '设计＋施工(半包)'
        }, {
          "num": 1,
          "name": '设计＋施工(全包)'
        }, {
          "num": 2,
          "name": '纯设计'
        }];
        $scope.dec_flow = [{
          "num": 0,
          "name": '量房'
        }, {
          "num": 1,
          "name": '开工'
        }, {
          "num": 2,
          "name": '拆改'
        }, {
          "num": 3,
          "name": '水电'
        }, {
          "num": 4,
          "name": '泥木'
        }, {
          "num": 5,
          "name": '油漆'
        }, {
          "num": 6,
          "name": '安装'
        }, {
          "num": 7,
          "name": '竣工'
        }];
        $scope.dataMapped = {
          dec_type: "0",
          dec_style: "0",
          house_type: "0",
          work_type: "0",
          processName: "0"
        };
        $scope.phoneChange = function (name) {
            if (!name) {
              alert('请输入需要查找的设计师的手机号码或者名字');
              return;
            } else {
              $http({
                method: "POST",
                url: 'api/v2/web/admin/search_designer',
                headers: {
                  'Content-Type': 'application/json; charset=utf-8'
                },
                data: {
                  "query": {
                    'phone': name
                  },
                  "sort": {
                    "_id": 1
                  },
                  "from": 0,
                  "limit": 10000
                }
              }).then(function (resp) {
                //返回信息
                if (resp.data.data.total) {
                  $scope.designer = [];
                  angular.forEach(resp.data.data.designers, function (value, key) {
                    this.push({
                      "num": value._id,
                      "name": value.username + " | " + value.phone
                    });
                  }, $scope.designer);

                } else {
                  $scope.designer = [];
                  $scope.designer.push({
                    "num": '-1',
                    "name": "暂无查询数据"
                  })
                }
              }, function (resp) {
                //返回错误信息
                promptMessage('创建失败', resp.data.msg)
                console.log(resp);
              })
            }
          }
          //城市选择器
        $scope.cities = [];
        angular.forEach(tdist, function (value, key) {
          this.push({
            name: value[0],
            parent: value[1],
            id: key
          });
        }, $scope.cities);
        // 让城市关联使用
        this.findCityId = function (parent) {
          var parentId;
          angular.forEach($scope.cities, function (city) {
            if (city.id === parent) {
              parentId = city.parent;
              return;
            }
          })
          return parentId;
        }
        this.initCity = function () {
            if ($scope.dataMapped.district !== undefined) {
              $scope.dataMapped.city = this.findCityId($scope.dataMapped.district);
              $scope.dataMapped.province = this.findCityId($scope.dataMapped.city);
            }
          }
          // 第一次打开页面 需要初始化一下
        this.initCity.call(this);
        findCityName = function (id) {
          var name;
          angular.forEach($scope.cities, function (city) {
            if (city.id == id) {
              name = city.name;
              return;
            }
          })
          return name;
        }
        $scope.addLive = function () { //提交按钮
          var process = [];
          var aPreviewsItem = $('#j-file-list').find('.previews-item');
          var images = []
          aPreviewsItem.each(function (i, el) {
            images.push($(el).data('imgid'))
          });
          process.push({
            "name": $scope.dataMapped.processName,
            "description": $scope.dataMapped.processDescription,
            "date": (new Date($scope.dataMapped.processDate)).getTime(),
            "images": images
          });
          var data = {
            "designerid": $scope.dataMapped.designerid,
            "manager": $scope.dataMapped.manager,
            "start_at": (new Date($scope.dataMapped.start_at)).getTime(),
            "province": findCityName($scope.dataMapped.province),
            "city": findCityName($scope.dataMapped.city),
            "district": findCityName($scope.dataMapped.district),
            "cell": $scope.dataMapped.cell,
            "house_type": $scope.dataMapped.house_type,
            "house_area": $scope.dataMapped.house_area,
            "dec_style": $scope.dataMapped.dec_style,
            "dec_type": $scope.dataMapped.dec_type,
            "work_type": $scope.dataMapped.work_type,
            "total_price": $scope.dataMapped.total_price,
            "description": $scope.dataMapped.description,
            "process": process,
            "progress": "0",
            "cover_imageid": $scope.dataMapped.cover_imageid
          }
          $http({
            method: "POST",
            url: '/api/v2/web/share/add',
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            },
            data: data
          }).then(function (resp) {
            //返回信息
            console.log(resp.data)
            $location.path('live'); //设置路由跳转
          }, function (resp) {
            //返回错误信息
            console.log(resp);
            promptMessage('创建失败', resp.data.msg)
          })
        }
      }
    ]);
})();
