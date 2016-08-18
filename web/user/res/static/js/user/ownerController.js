"use strict";
angular.module('controllers', [])
  .controller('appController', ['$scope', '$rootScope', 'userMessage',
    function ($scope, $rootScope, userMessage) {
      $scope.count = {};
      userMessage.count({
        "query_array": [
          ["4"],
          ["7", "8", "13", "9", "10"],
          ["5", "14"]
        ]
      }).then(function (res) {
        $scope.count.notice = res.data.data[0];
        $scope.count.remind = res.data.data[1];
        $scope.count.comment = res.data.data[2];
        $scope.$broadcast('userMessageParent', $scope.count); //父级传递
      }, function (err) {
        console.log(err);
      });
      $scope.$on('userMessageChildren', function (event, data) { //父级接收 如果业主操作就需要改变状态
        $scope.count = data;
      });
    }
  ])
  .controller('SubController', [ //左侧高亮按钮
    '$scope', '$rootScope', '$location', '$filter', 'userRequiremtne', 'userMessage',
    function ($scope, $rootScope, $location, $filter, userRequiremtne, userMessage) {
      //全局需求列表
      userRequiremtne.list().then(function (res) {
        $rootScope.requirementList = res.data.data;
        angular.forEach($rootScope.requirementList, function (value, key) {
          value.dec_type = $filter('decTypeFilter')(value.dec_type);
          value.dec_style = $filter('decStyleFilter')(value.dec_style);
          value.work_type = $filter('workTypeFilter')(value.work_type);
          value.house_type = $filter('houseTypeFilter')(value.house_type);
        });
      }, function (res) {
        console.log(res);
      });
    }
  ])
  .controller('indexCtrl', [ //业主首页
    '$scope', '$rootScope', '$http', '$filter', '$location', 'userInfo', 'userRequiremtne',
    function ($scope, $rootScope, $http, $filter, $location, userInfo, userRequiremtne) {
      if (userInfo.storage) {
        userInfo.get().then(function (res) {
          $scope.user = res.data.data;
          userInfo.save(res.data.data);
        }, function (err) {
          console.log(err);
        });
      } else {
        $scope.user = userInfo.pull;
      }
    }
  ])
  .controller('inforCtrl', [ //业主资料
    '$scope', '$rootScope', '$state', 'userInfo', 'initData',
    function ($scope, $rootScope, $state, userInfo, initData) {
      $scope.user = {};
      $scope.userInfo = {
        disabled: false,
        citiesList: initData.tdist,
        userSex: initData.userSex,
        isLoading: false
      };
      userInfo.get().then(function (res) {
        if (res.data.data !== null) {
          angular.extend($scope.user, res.data.data);
          $scope.userInfo.isLoading = true;
          userInfo.save(res.data.data);
        }
      }, function (err) {
        console.log(err);
      });
      $scope.userInfo.submit = function () { //修改个人资料
        $scope.userInfo.disabled = true;
        userInfo.update($scope.user).then(function (res) {
          if (res.data.msg == "success") {
            userInfo.save($scope.user);
            user.updateInfo();
            $state.go('index');
          }
        }, function (err) {
          console.log(err);
        });
      };
    }
  ])
  .controller('phoneCtrl', [ //绑定手机号码
    '$scope', '$rootScope', '$state', '$stateParams', '$interval', 'userRequiremtne',
    function ($scope, $rootScope, $state, $stateParams, $interval, userRequiremtne) {
      $scope.user = {
        "phone": undefined,
        "code": undefined
      };
      $scope.phone = {
        disabled: true,
        phoneMsg: "",
        condeMsg: "",
        submitMsg: "",
        codeValue: '获取验证码',
        verifyCodeOff: true,
        verifyPhoneOff: true,
        verifyCodeDid: true,
        verifyPhoneError: false,
        verifyCodeError: false,
        isMobile: function (mobile) {
          return /^(13[0-9]{9}|15[012356789][0-9]{8}|18[0123456789][0-9]{8}|147[0-9]{8}|170[0-9]{8}|177[0-9]{8})$/.test(mobile);
        },
        isVerifyCode: function (str) {
          return (/^[\d]{6}$/.test(str));
        },
        verifyphone: function (phone) {
          var _this = this;
          if (!phone) {
            _this.verifyPhoneOff = true;
            _this.phoneMsg = "手机号不能为空";
            _this.verifyPhoneError = true;
          } else if (this.isMobile(phone)) {
            userRequiremtne.verify({
              'phone': phone
            }).then(function (res) { //提交手机
              if (res.data.msg === "success") {
                _this.phoneMsg = "";
                _this.verifyPhoneOff = false;
                _this.verifyPhoneError = false;
              }
              if (res.data.err_msg) {
                _this.verifyPhoneOff = true;
                _this.phoneMsg = res.data.err_msg;
                _this.verifyPhoneError = true;
              }
            }, function (res) {
              console.log(res);
            });
          } else {
            if (phone.length >= 11) {
              _this.verifyPhoneOff = true;
              _this.verifyPhoneError = true;
              _this.phoneMsg = "手机号不正确";
            } else {
              _this.verifyPhoneOff = true;
              _this.verifyPhoneError = false;
              _this.phoneMsg = "";
            }
            this.codeMsg = '';
            this.verifyCodeError = false;
            this.verifyCodeOff = true;
            $scope.user.code = '';
          };
          isdisabled();
        },
        verifycode: function (code) {
          var _this = this;
          if (this.verifyPhoneOff) {
            this.codeMsg = '请先输入手机号获取验证码';
            this.verifyCodeError = true;
            this.verifyCodeOff = true;
            return;
          }
          if (code.length >= 6) {
            if (this.isVerifyCode(code)) {
              this.codeMsg = '';
              this.verifyCodeOff = false;
              this.verifyCodeError = false;
            } else {
              this.codeMsg = '验证码不正确';
              this.verifyCodeError = true;
              this.verifyCodeOff = true;
            }
          } else {
            this.codeMsg = '';
            this.verifyCodeError = false;
            this.verifyCodeOff = true;
          }
          isdisabled();
        },
        pullcode: function (phone) {
          var _this = this;
          if (_this.verifyCodeDid && !_this.verifyPhoneOff) {
            _this.verifyCodeDid = false;
            countdown();
            userRequiremtne.code({
              'phone': phone
            }).then(function (res) { //提交手机
            }, function (err) {
              console.log(err);
            });
          }

          function countdown(num) {
            var count = num || 60;
            var timer = null;
            $interval.cancel(timer);
            timer = $interval(function () {
              if (count <= 0) {
                $interval.cancel(timer);
                count = num;
                _this.verifyCodeDid = true;
                _this.codeValue = '重新获取';
              } else {
                count--;
                _this.codeValue = count + 's后重新获取';
              }
            }, 1000);
          }
        },
        submit: function () {
          var _this = this;
          this.verifyCodeOff = true;
          this.verifyPhoneOff = true;
          isdisabled();
          userRequiremtne.phone($scope.user).then(function (res) { //提交手机
            if (res.data.msg === "success") {
              $state.go('addRequirement');
            }
            if (res.data.err_msg) {
              _this.submitMsg = res.data.err_msg;
            }
          }, function (res) {
            console.log(res)
          })
        }
      }

      function isdisabled() {
        if (!$scope.phone.verifyCodeOff && !$scope.phone.verifyPhoneOff) {
          $scope.phone.disabled = false;
        } else {
          $scope.phone.disabled = true;
        }
      }
    }
  ])
  .controller('releaseCtrl', [ //业主提交需求
    '$scope', 'userRequiremtne',
    function ($scope, userRequiremtne) {
      function initUser() {
        $scope.user = {
          tel: undefined,
          sendRequireSuccess: false,
          errorText: false
        }
      }
      initUser()
      $scope.sendTel = function () {
        if($scope.isMobile($scope.user.tel)) {
          userRequiremtne.sendTel({
            phone: $scope.user.tel,
            district: "web业主个人中心"
          })
          .then(function (res) {
            $scope.user.errorText = false;
            if (res.data.msg == "success") {
              $scope.user.sendRequireSuccess = true;
            }
          }, function (err) {
            console.log(err);
          });
        } else {
          $scope.user.errorText = true;
        }
      }

      $scope.isMobile = function (mobile){
          return /^(13[0-9]{9}|15[012356789][0-9]{8}|18[0123456789][0-9]{8}|147[0-9]{8}|170[0-9]{8}|177[0-9]{8})$/.test(mobile);
      }

      $scope.resetPage = function () {
        initUser()
      }
    }
  ])
  .controller('requirementListCtrl', [ //装修需求列表
    '$scope', '$rootScope', '$location', 'initData',
    function ($scope, $rootScope, $location, initData) {
      var statusUrl = initData.statusUrl;
      $scope.goTo = function (data) {
        if (data.work_type == '纯设计' && data.status == 4) {
          $location.path('requirement/' + data._id + "/" + statusUrl[8]);
        } else {
          $location.path('requirement/' + data._id + "/" + statusUrl[data.status]);
        }
      }
    }
  ])
  .controller('requirementCtrl', [ //装修需求详情配置
    '$scope', '$rootScope', '$http', '$filter', '$location', '$stateParams', 'userRequiremtne',
    function ($scope, $rootScope, $http, $filter, $location, $stateParams, userRequiremtne) {
      //需求id
      $rootScope.requiremtneId = $stateParams.id;
      //tab栏按钮高亮
      $scope.location = $location;
      $scope.$watch('location.url()', function (url) {
        $scope.tab = url.split('/')[3];
      });
      userRequiremtne.detail({
        "_id": $stateParams.id
      })
      .then(function (res) {
        console.log(res);
        $scope.requirement = res.data.data;
        $scope.$broadcast('requirementParent', res.data.data); //父级传递
      }, function (res) {
        console.log(res)
      });
    }
  ])
  .controller('requirementDetailsCtrl', [ //装修需求详情
    '$scope', '$location', '$stateParams', 'userRequiremtne', 'initData',
    function ($scope,  $location, $stateParams, userRequiremtne, initData) {
      function uploadParent() { // 子级传递  如果业主操作就需要改变状态给父级传递信息
        userRequiremtne.get({
          "_id": $stateParams.id
        }).then(function (res) {
          $scope.$emit('requirementChildren', res.data.data);
        }, function (res) {
          console.log(res)
        });
      }
      var statusUrl = initData.statusUrl;
      $scope.goTo = function (id, status) {
        $location.path('requirement/' + id + "/" + statusUrl[status]);
      };
    }
  ])
  .controller('requirementFieldCtrl', [ //装修需求详情
    '$scope',
    function ($scope) {}
  ])
  .controller('requirementfulfillCtrl', [ //装修需求详情
    '$scope',
    function ($scope) {}
  ])
  .controller('favoriteProductCtrl', [ //作品收藏列表
    '$scope', '$state', '$filter', 'userFavoriteProduct',
    function ($scope, $state, $filter, userFavoriteProduct) {
      $scope.designers = undefined;
      var _index = !isNaN(parseInt($state.params.id, 10)) ? parseInt($state.params.id, 10) - 1 : 0,
        dataPage = {
          "from": _index * 4,
          "limit": 4
        },
        current = _index;

      function laod() {
        userFavoriteProduct.list(dataPage).then(function (res) { //获取作品收藏列表
          $scope.favoriteProduct = res.data.data.products;
          if ($scope.favoriteProduct.length === 0 && res.data.data.total !== 0) {
            $scope.favoriteProduct = undefined;
            dataPage.from = current * dataPage.limit;
            current = 0;
            $state.go('favorite.list', {
              id: 1
            });
          }
          angular.forEach($scope.favoriteProduct, function (value) {
            value.dec_type = $filter('decTypeFilter')(value.dec_type);
            if (value.business_house_type != undefined) {
              value.business_house_type = $filter('businessHouseTypeFilter')(value.business_house_type);
            }
            if (value.house_type != undefined) {
              value.house_type = $filter('houseTypeFilter')(value.house_type);
            }
            value.dec_style = $filter('decStyleFilter')(value.dec_style);
            value.description = $filter('limitTo')(value.description, 100);
          });
          $scope.pageing = {
            allNumPage: res.data.data.total,
            itemPage: dataPage.limit,
            showPageNum: 5,
            endPageNum: 3,
            currentPage: current,
            linkTo: "#/favorite/__id__",
            prevText: "上一页",
            nextText: "下一页",
            ellipseText: "...",
            showUbwz: false,
            pageInfo: false,
            callback: function (i) {
              dataPage.from = i * this.itemPage;
              current = i;
              $state.go('favorite.list', {
                id: parseInt(i, 10) + 1
              });
              return false;
            }
          }
        }, function (res) {
          console.log(res)
        });
      }

      function remove(id) {
        userFavoriteProduct.remove({
          '_id': id
        }).then(function (res) { //获取意向设计师列表
          if (res.data.msg === "success") {
            $scope.favoriteProduct = undefined;
            if (!!$scope.modal.id) {
              $scope.modal.id = '';
            }
            laod();
          }
        }, function (res) {
          console.log(res)
        });
      }
      $scope.deleteFavorite = function (id) {
        remove(id);
      }
      $scope.modal = {
        id: '',
        show: false,
        cancel: function () {
          this.show = false;
          this.id = '';
        },
        define: function () {
          this.show = false;
          remove(this.id);
        },
        remove: function (id) {
          this.show = true;
          this.id = id;
        }
      }
      laod();
    }
  ])
  .controller('favoriteDesignerCtrl', [ //意向设计师列表
    '$scope', '$state', 'userFavoriteDesigner',
    function ($scope, $state, userFavoriteDesigner) {
      $scope.designers = undefined;
      var _index = !isNaN(parseInt($state.params.id, 10)) ? parseInt($state.params.id, 10) - 1 : 0,
        dataPage = {
          "from": _index * 5,
          "limit": 5
        },
        current = _index;

      function laod() {
        userFavoriteDesigner.list(dataPage).then(function (res) { //获取意向设计师列表
          $scope.designers = res.data.data.designers;
          if ($scope.designers.length == 0 && res.data.data.total != 0) {
            $scope.designers = undefined;
            dataPage.from = current * dataPage.limit;
            current = 0;
            $state.go('designer.list', {
              id: 1
            });
          }
          $scope.pageing = {
            allNumPage: res.data.data.total,
            itemPage: dataPage.limit,
            showPageNum: 5,
            endPageNum: 3,
            currentPage: current,
            linkTo: "#/designer/__id__",
            prevText: "上一页",
            nextText: "下一页",
            ellipseText: "...",
            showUbwz: false,
            pageInfo: false,
            callback: function (i) {
              dataPage.from = i * this.itemPage;
              current = i;
              $state.go('designer.list', {
                id: parseInt(i, 10) + 1
              });
              return false;
            }
          }
        }, function (res) {
          console.log(res)
        });
      }
      $scope.modal = {
        id: '',
        show: false,
        cancel: function () {
          this.show = false;
          this.id = '';
        },
        define: function () {
          var _this = this;
          this.show = false;
          userFavoriteDesigner.remove({
            '_id': this.id
          }).then(function (res) { //获取意向设计师列表
            if (res.data.msg === "success") {
              $scope.designers = undefined;
              _this.id = '';
              laod();
            }
          }, function (res) {
            console.log(res)
          });
        },
        remove: function (id) {
          this.show = true;
          this.id = id;
        }
      }
      laod()
    }
  ])
  .controller('noticeCtrl', [ //系统通知
    '$scope', '$state',
    function ($scope, $state) {
      $scope.notice = {
        name: '',
        "arr": "4-99",
        tab: [{
          id: 0,
          name: '全部',
          cur: true,
          arr: "4-99"
        }, {
          id: 1,
          name: '官方公告',
          cur: false,
          arr: "99"
        }, {
          id: 2,
          name: '系统通知',
          cur: false,
          arr: "4"
        }],
        goto: function (id) {
          var _this = this;
          angular.forEach(this.tab, function (v) {
            v.cur = false;
            _this.tab[id].cur = true;
            _this.name = _this.tab[id].name;
            _this.arr = _this.tab[id].arr;
          });
        },
        status: undefined,
        setread: function () {
          if ($state.params.status === '0') {
            $state.go('notice.list.type', {
              id: 1,
              type: $state.params.type,
              status: undefined
            });
            this.getread = false;
            this.status = undefined;
          } else if ($state.params.status === undefined) {
            $state.go('notice.list.type', {
              id: 1,
              type: $state.params.type,
              status: 0
            });
            this.getread = true;
            this.status = 0;
          }
        },
        getread: false
      };
      angular.forEach($scope.notice.tab, function (v) {
        v.cur = v.arr == $state.params.type;
      });
    }
  ])
  .controller('noticeListCtrl', [ //系统通知列表
    '$scope', '$state', 'userMessage',
    function ($scope, $state, userMessage) {
      var _index = !isNaN(parseInt($state.params.id, 10)) ? parseInt($state.params.id, 10) - 1 : 0,
        message_type = ChangeArray($state.params.type),
        status = $state.params.status,
        dataPage = {
          "query": {
            "message_type": {
              "$in": message_type
            },
            "status": status
          },
          "from": _index * 10,
          "limit": 10
        },
        current = _index,
        url = {
          '4': 'index'
        };
      $scope.noticeList = {
        "list": undefined,
        read: function (id, status) {
          if (status == 0) {
            userMessage.read({
              "messageid": id
            }).then(function () {
              uploadParent();
            });
          }
        },
        goto: function (data) {
          $state.go(url[data.message_type]);
          if (data.status == 0) {
            this.read(data._id, data.status)
          }
        },
        remove: function (id) {
          $scope.modal.show = true;
          $scope.modal.id = id;
        }
      };
      $scope.modal = {
        id: '',
        show: false,
        cancel: function () {
          this.show = false;
          this.id = '';
        },
        define: function () {
          this.show = false;
          userMessage.remove({
            "messageid": this.id
          }).then(function (res) {
            laod();
          }, function (err) {
            console.log(err);
          });
        }
      }

      function uploadParent() { // 子级传递  如果业主操作就需要改变状态给父级传递信息
        userMessage.count({
          "query_array": [
            ["4"],
            ["7", "8", "13", "9", "10"],
            ["5", "14"]
          ]
        }).then(function (res) {
          $scope.count.notice = res.data.data[0];
          $scope.count.remind = res.data.data[1];
          $scope.count.comment = res.data.data[2];
          $scope.$emit('userMessageParent', $scope.count); //父级传递
          user.updateData(); //更新右上角显示下拉菜单
        }, function (err) {
          console.log(err)
        });
      }

      function ChangeArray(str) {
        var arr = [];
        if (str.indexOf('-') != -1) {
          arr = str.split('-');
        } else {
          arr.push(str);

        }
        return arr;
      }

      function laod() {
        userMessage.search(JSON.stringify(dataPage)).then(function (res) { //获取意向设计师列表
          $scope.noticeList.list = res.data.data.list;
          if ($scope.noticeList.list.length == 0 && res.data.data.total != 0) {
            $scope.noticeList.list = undefined;
            dataPage.from = current * dataPage.limit;
            current = 0;
            $state.go('notice.list.type', {
              id: 1,
              type: $state.params.type,
              status: $state.params.status
            });
          }
          $scope.pageing = {
            allNumPage: res.data.data.total,
            itemPage: dataPage.limit,
            showPageNum: 5,
            endPageNum: 3,
            currentPage: current,
            linkTo: "#/notice/list/__id__",
            prevText: "上一页",
            nextText: "下一页",
            ellipseText: "...",
            showUbwz: false,
            pageInfo: false,
            callback: function (i) {
              dataPage.from = i * this.itemPage;
              current = i;
              $state.go('notice.list.type', {
                id: parseInt(i) + 1,
                type: $state.params.type,
                status: $state.params.status
              });
              return false;
            }
          }
        }, function (res) {
          console.log(res)
        });
      }
      laod();
    }
  ])
  .controller('noticeDetailCtrl', [ //系统通知详情
    '$scope', '$state', 'userMessage',
    function ($scope, $state, userMessage) {
      $scope.detail = {};
      userMessage.detail({
        "messageid": $state.params.id
      }).then(function (res) { //获取意向设计师列表
        if (res.data.data) {
          $scope.detail = res.data.data;
        }
      }, function (res) {
        console.log(res);
      });
    }
  ])
  .controller('remindCtrl', [ //需求提醒列表
    '$scope', '$state', 'userMessage',
    function ($scope, $state, userMessage) {
      $scope.remind = {
        "name": '',
        "arr": "7-8-13-9-10",
        "tab": [{
          "id": 0,
          "name": '全部',
          "cur": false,
          "arr": "7-8-13-9-10"
        }, {
          "id": 1,
          "name": '响应提醒',
          "cur": false,
          "arr": "7"
        }, {
          "id": 2,
          "name": '拒绝提醒',
          "cur": false,
          "arr": "8"
        }, {
          "id": 3,
          "name": '确认量房',
          "cur": false,
          "arr": "13"
        }, {
          "id": 4,
          "name": '方案提醒',
          "cur": false,
          "arr": "9"
        }, {
          "id": 5,
          "name": '合同提醒',
          "cur": false,
          "arr": "10"
        }],
        goto: function (id) {
          var _this = this;
          angular.forEach(this.tab, function (v, k) {
            v.cur = false;
            _this.tab[id].cur = true;
            _this.name = _this.tab[id].name;
            _this.arr = _this.tab[id].arr;
          });
        },
        status: undefined,
        setread: function () {
          if ($state.params.status === '0') {
            $state.go('remind.list.type', {
              id: 1,
              type: $state.params.type,
              status: undefined
            });
            this.getread = false;
            this.status = undefined;
          } else if ($state.params.status === undefined) {
            $state.go('remind.list.type', {
              id: 1,
              type: $state.params.type,
              status: 0
            });
            this.getread = true;
            this.status = 0;
          }
        },
        getread: false
      };
      angular.forEach($scope.remind.tab, function (v) {
        v.cur = v.arr == $state.params.type;
      });
    }
  ])
  .controller('remindListCtrl', [ //需求提醒列表
    '$scope', '$state', 'userMessage',
    function ($scope, $state, userMessage) {
      var _index = !isNaN(parseInt($state.params.id, 10)) ? parseInt($state.params.id, 10) - 1 : 0,
        message_type = ChangeArray($state.params.type),
        status = $state.params.status,
        dataPage = {
          "query": {
            "message_type": {
              "$in": message_type
            },
            "status": status
          },
          "from": _index * 10,
          "limit": 10
        },
        current = _index;
      $scope.remindList = {
        "list": undefined,
        read: function (id, status) {
          if (status == 0) {
            userMessage.read({
              "messageid": id
            });
            uploadParent();
          }
        }
      };

      function uploadParent() { // 子级传递  如果业主操作就需要改变状态给父级传递信息
        userMessage.count({
          "query_array": [
            ["4"],
            ["7", "8", "9", "10", "13"],
            ["5", "14"]
          ]
        }).then(function (res) {
          $scope.count.notice = res.data.data[0];
          $scope.count.remind = res.data.data[1];
          $scope.count.comment = res.data.data[2];
          $scope.$emit('userMessageParent', $scope.count); //父级传递
          user.updateData(); //更新右上角显示下拉菜单
        }, function (err) {
          console.log(err)
        });
      }

      function ChangeArray(str) {
        var arr = [];
        if (str.indexOf('-') != -1) {
          arr = str.split('-');
        } else {
          arr.push(str);

        }
        return arr;
      }

      function laod() {
        userMessage.search(JSON.stringify(dataPage)).then(function (res) { //获取意向设计师列表
          $scope.remindList.list = res.data.data.list;
          if ($scope.remindList.list.length == 0 && res.data.data.total != 0) {
            $scope.remindList.list = undefined;
            dataPage.from = current * dataPage.limit;
            current = 0;
            $state.go('remind.list.type', {
              id: 1,
              type: $state.params.type,
              status: $state.params.status
            });
          }
          $scope.pageing = {
            allNumPage: res.data.data.total,
            itemPage: dataPage.limit,
            showPageNum: 5,
            endPageNum: 3,
            currentPage: current,
            linkTo: "#/remind/list/__id__",
            prevText: "上一页",
            nextText: "下一页",
            ellipseText: "...",
            showUbwz: false,
            pageInfo: false,
            callback: function (i) {
              dataPage.from = i * this.itemPage;
              current = i;
              $state.go('remind.list.type', {
                id: parseInt(i) + 1,
                type: $state.params.type,
                status: $state.params.status
              });
              return false;
            }
          }
        }, function (res) {
          console.log(res)
        });
      }
      laod();
    }
  ])
  .controller('commentCtrl', [ //评论列表
    '$scope', '$state', 'userMessage',
    function ($scope, $state, userMessage) {
      $scope.comment = {
        "name": '',
        "arr": "5-14",
        "tab": [{
          "id": 0,
          "name": '全部',
          "cur": false,
          "arr": "5-14"
        }, {
          "id": 1,
          "name": '方案评论',
          "cur": false,
          "arr": "5"
        }, {
          "id": 2,
          "name": '日记评论',
          "cur": false,
          "arr": "14"
        }],
        goto: function (id) {
          var _this = this;
          angular.forEach(this.tab, function (v) {
            v.cur = false;
            _this.tab[id].cur = true;
            _this.name = _this.tab[id].name;
          });
        },
        status: undefined,
        setread: function () {
          if ($state.params.status === '0') {
            $state.go('comment.list.type', {
              id: 1,
              type: $state.params.type,
              status: undefined
            });
            this.getread = false;
            this.status = undefined;
          } else if ($state.params.status === undefined) {
            $state.go('comment.list.type', {
              id: 1,
              type: $state.params.type,
              status: 0
            });
            this.getread = true;
            this.status = 0;
          }
        },
        getread: false
      };
      angular.forEach($scope.comment.tab, function (v) {
        v.cur = v.arr == $state.params.type;
      });
    }
  ])
  .controller('commentListCtrl', [ //评论列表
    '$scope', '$state', 'userMessage',
    function ($scope, $state, userMessage) {
      var _index = !isNaN(parseInt($state.params.id, 10)) ? parseInt($state.params.id, 10) - 1 : 0,
        message_type = ChangeArray($state.params.type),
        status = $state.params.status,
        dataPage = {
          "query": {
            "message_type": {
              "$in": message_type
            },
            "status": status
          },
          "from": _index * 10,
          "limit": 10
        },
        current = _index;
      $scope.commentList = {
        "list": undefined,
        read: function (id, status) {
          if (status == 0) {
            userMessage.read({
              "messageid": id
            });
            uploadParent();
          }
        }
      };

      function uploadParent() { // 子级传递  如果业主操作就需要改变状态给父级传递信息
        userMessage.count({
          "query_array": [
            ["4"],
            ["7", "8", "9", "10", "13"],
            ["5", "14"]
          ]
        }).then(function (res) {
          $scope.count.notice = res.data.data[0];
          $scope.count.remind = res.data.data[1];
          $scope.count.comment = res.data.data[2];
          $scope.$emit('userMessageParent', $scope.count); //父级传递
          user.updateData(); //更新右上角显示下拉菜单
        }, function (err) {
          console.log(err)
        });
      }

      function ChangeArray(str) {
        var arr = [];
        if (str.indexOf('-') != -1) {
          arr = str.split('-');
        } else {
          arr.push(str);

        }
        return arr;
      }

      function laod() {
        userMessage.comment(JSON.stringify(dataPage)).then(function (res) { //获取意向设计师列表
          $scope.commentList = res.data.data.list;
          if ($scope.commentList.length == 0 && res.data.data.total != 0) {
            $scope.commentList = undefined;
            dataPage.from = current * dataPage.limit;
            current = 0;
            $state.go('comment.list.type', {
              id: 1,
              type: $state.params.type,
              status: $state.params.status
            });
          }
          $scope.pageing = {
            allNumPage: res.data.data.total,
            itemPage: dataPage.limit,
            showPageNum: 5,
            endPageNum: 3,
            currentPage: current,
            linkTo: "#/comment/__id__",
            prevText: "上一页",
            nextText: "下一页",
            ellipseText: "...",
            showUbwz: false,
            pageInfo: false,
            callback: function (i) {
              dataPage.from = i * this.itemPage;
              current = i;
              $state.go('comment.list.type', {
                id: parseInt(i) + 1,
                type: $state.params.type,
                status: $state.params.status
              });
              return false;
            }
          }
        }, function (res) {
          console.log(res)
        });
      }
      laod()
    }
  ])
  .controller('diaryCtrl', [ //日记集列表
    '$scope', '$state', '$filter', 'userDiary',
    function ($scope, $state, $filter, userDiary) {
      $scope.diary = undefined;
      userDiary.list().then(function (res) { //获取我的日记集列表
        $scope.diary = res.data.data.diarySets;
        angular.forEach($scope.diary, function (value) {
          value.dec_type = $filter('decTypeFilter')(value.dec_type);
          if (value.business_house_type != undefined) {
            value.business_house_type = $filter('businessHouseTypeFilter')(value.business_house_type);
          }
          if (value.house_type != undefined) {
            value.house_type = $filter('houseTypeFilter')(value.house_type);
          }
          value.dec_style = $filter('decStyleFilter')(value.dec_style);
          value.work_type = $filter('workTypeFilter')(value.work_type);
        });
      })
      $scope.goShow = function (data) {
        $state.go('diary.show', data);
      }
    }
  ])
  .controller('addDiaryCtrl', [ //添加一条日记集
    '$scope', '$state', '$stateParams', '$filter', 'userDiary', 'initData',
    function ($scope, $state, $stateParams, $filter, userDiary, initData) {
      $scope.isLoading = false;
      $scope.userdiary = {
        isCreate: !$stateParams.id,
        decStyle: initData.decStyle,
        houseType: initData.houseType,
        workType: initData.workType
      };
      $scope.userdiary.releaseValue = $scope.userdiary.isCreate ? "创建日记" : "编辑日记";
      $scope.userdiary.releaseTitle = $scope.userdiary.isCreate ? "创建装修日记" : "编辑装修日记";
      $scope.diarys = {
        "title": '',
        "house_area": '',
        "house_type": '0',
        "work_type": '0',
        "dec_style": '0',
        "cover_imageid": ''
      }
      if ($scope.userdiary.isCreate) {
        $scope.isLoading = true;
      } else {
        userDiary.get({
          "query": {
            "_id": $stateParams.id
          }
        }).then(function (res) {
          if (res.data.data.total === 1) {
            $scope.diarys = angular.extend($scope.diarys, res.data.data.diarySets[0]);
            $scope.isLoading = true;
          }
        })
      }

      function jump(data) {
        var data = angular.copy(data);
        data.house_area = $filter('decTypeFilter')(data.dec_type);
        if (data.business_house_type != undefined) {
          data.business_house_type = $filter('businessHouseTypeFilter')(data.business_house_type);
        }
        if (data.house_type != undefined) {
          data.house_type = $filter('houseTypeFilter')(data.house_type);
        }
        data.dec_style = $filter('decStyleFilter')(data.dec_style);
        data.work_type = $filter('workTypeFilter')(data.work_type);
        $state.go('diary.show', data);
      }
      $scope.userdiary.submit = function () {
        if ($scope.userdiary.isCreate) {
          userDiary.add({
            "diary_set": $scope.diarys
          }).then(function (res) {
            if (res.data.data && !_.isEmpty(res.data.data)) {
              jump(res.data.data);
            }
          });
        } else {
          userDiary.update({
            "diary_set": $scope.diarys
          }).then(function (res) {
            if (res.data.msg && res.data.msg === "success") {
              jump($scope.diarys);
            }
          });
        }
      }
    }
  ])
  .controller('showDiaryCtrl', [ //一条日记集详情
    '$scope', '$state', '$stateParams', '$timeout', 'userDiary',
    function ($scope, $state, $stateParams, $timeout, userDiary) {
      $scope.isLoading = false; //加载数据
      $scope.isReview = false; //加载评论列表
      $scope.diarys = $stateParams; //加载头部数据
      $scope.replyinfo = null;

      // userDiary.get({     //加载头部数据
      //   "query":{
      //         "_id" : $stateParams.id
      //   }
      // }).then(function(res){
      //     if(res.data.data.total === 1){
      //         $scope.diarys = res.data.data.diarySets[0];

      //     }
      // });
      var section_label = [
        '准备',
        '开工',
        '拆改',
        '泥木',
        '水电',
        '油漆',
        '安装',
        '竣工',
        '软装',
        '入住'
      ]
      var VERIFY_CONTENT_REGEX_lt15 = /^[\u4e00-\u9fa5]{1,15}$|^[\dA-Za-z_]{1,30}$/ig;
      var VERIFY_CONTENT_REGEX_lte140 = /^[\u4e00-\u9fa5]{1,140}$|^[\dA-Za-z_]{1,280}$/ig;
      $scope.write = {
        'select': true,
        'size': 9,
        'loading': false,
        'complete': false,
        list: section_label,
        'show': false,
        add: function () {
          this.show = true;
        },
        data: {
          'images': [],
          'section_label': getCurrentSectionlabel($stateParams.latest_section_label) || '准备',
          'content': ''
        },
        submit: function (data) {
          var _this = this;
          if (!_.trim(data.content.length)) {
            alert('请输入内容');
            return;
          }
          if (data.section_label === '时间节点选择') {
            alert('请选择时间节点');
            return;
          }
          data.diarySetid = $stateParams._id;
          userDiary.push({
            "diary": data
          }).then(function (res) {
            _this.data.content = '';
            _this.data.images = [];
            _this.select = false;
            pull();
          }, function (res) {
            console.log(res);
          })
        }
      }
      pull();

      function getCurrentSectionlabel(label) {
        if (!label) {
          return;
        }
        var index = _.indexOf(section_label, label);
        if (index <= section_label.length - 2) {
          return section_label[index + 1];
        } else {
          return _.last(section_label);
        }
      }

      function pull() {
        $scope.diarylist = [];
        $scope.isLoadingOut = false; //侧栏
        userDiary.pull({
          "query": {
            "diarySetid": $stateParams._id
          }
        }).then(function (res) {
          $scope.diarylist = res.data.data.diaries;
          if ($scope.diarylist.length > 0) {
            $scope.write.data.section_label = getCurrentSectionlabel($scope.diarylist[0].diarySet.latest_section_label);
          }
          $scope.write.select = true;
          $scope.isLoading = true;
          timer = $timeout(function () {
            $scope.isLoadingOut = true;
            $timeout.cancel(timer);
          }, 1000);
        });
      }
      var timer = null;
      $scope.like = function (is, id) {
        if (is) {
          return;
        }
        $timeout.cancel(timer);
        var index = _.findIndex($scope.diarylist, {
          "_id": id
        });
        if (index != -1) {
          $scope.diarylist[index].is_my_favorite = true;
          $scope.diarylist[index].favorite_count += 1;
          $scope.diarylist[index].likemove = true;
          userDiary.favorite({
            'diaryid': id
          }).then(function (res) { //点赞
            if (res.data.msg === "success") {
              timer = $timeout(function () {
                $scope.diarylist[index].likemove = false;
                $timeout.cancel(timer);
              }, 1000);
            }
          }, function (res) {
            console.log(res);
          });
        } else {
          return;
        }
      }
      $scope.comment = function (is, id) {
        var index = _.findIndex($scope.diarylist, {
          "_id": id
        });
        $scope.diarylist[index].giveshow = undefined;
        $scope.diarylist[index].givename = undefined;
        $scope.diarylist[index].reviewContent = '';
        if (index != -1) {
          $scope.diarylist[index].is_review = !is;
          if ($scope.diarylist[index].is_review) {
            $scope.diarylist[index].review = [];
            getComment(id, 0, 10, false);
          }
        } else {
          return;
        }
      }
      $scope.loadmore = function (id, size) {
        getComment(id, size, 10);
      }
      $scope.addCommentTo = function (data, authorid) {
        var index = _.findIndex($scope.diarylist, {
          "_id": data.topicid
        });
        var index2 = _.findIndex($scope.diarylist[index].review, {
          "_id": data._id
        });
        _.forEach($scope.diarylist[index].review, function (n) {
          n.giveshow = false;
        });
        $scope.replyinfo = data;
        if (data.byUser._id !== authorid) {
          $scope.replyinfo.notfind = true;
          $scope.diarylist[index].giveshow = true;
          $scope.diarylist[index].review[index2].giveshow = true;
          $scope.diarylist[index].givename = data.byUser.username;
        } else {
          $scope.replyinfo.notfind = false;
          $scope.diarylist[index].giveshow = false;
          $scope.diarylist[index].givename = '';
        }
      }
      $scope.addCommentDld = false;
      $scope.addComment = function (data) {
        if ($scope.addCommentDld) { //防止重复点击
          return;
        }
        if (!$scope.addCommentDld) {
          $scope.addCommentDld = true;
        }
        var index = _.findIndex($scope.diarylist, {
          "_id": data.topicid
        });
        var index2 = _.findIndex($scope.diarylist[index].review, {
          "_id": data._id
        });
        if ($scope.replyinfo !== null) {
          if ($scope.replyinfo.notfind) {
            data.to_commentid = $scope.replyinfo._id;
            data.to_userid = $scope.replyinfo.byUser._id;
            data.content = '回复  ' + $scope.replyinfo.byUser.username + "：" + _.trim(data.content);
          }
        }
        userDiary.comment(data).then(function (res) { //获取意向设计师列表
          if (res.data.msg === "success") {
            _.forEach($scope.diarylist[index].review, function (n) {
              n.giveshow = false;
            });
            $scope.diarylist[index].giveshow = false;
            getComment(data.topicid, 0, 10, true);
            $scope.replyinfo = null;
            $scope.diarylist[index].reviewContent = '';
          }
          $scope.addCommentDld = false;
        }, function (res) {
          $scope.addCommentDld = false;
          console.log(res)
        });
      }

      function getComment(id, form, limit, dir) {
        var index = _.findIndex($scope.diarylist, {
          "_id": id
        });
        userDiary.topic({
          "topicid": id,
          "from": form,
          "limit": limit || 10
        }).then(function (res) { //获取日记本下所有日志
          if (index != -1) {
            if (dir) {
              $scope.diarylist[index].review.unshift(res.data.data.comments[0]);
            } else {
              _.forEach(res.data.data.comments, function (n) {
                $scope.diarylist[index].review.push(n);
              });
              _.forEach($scope.diarylist[index].review, function (n) {
                n.giveshow = false;
              });
              if ($scope.diarylist[index].review.length === res.data.data.total) {
                $scope.diarylist[index].moveshow = false;
              } else {
                $scope.diarylist[index].moveshow = res.data.data.total > limit;
              }
            }

          }
        }, function (res) {
          console.log(res)
        });
      }
      $scope.modal = {
        id: '',
        show: false,
        index: '',
        cancel: function () {
          this.show = false;
          this.id = '';
        },
        define: function () {
          var _this = this;
          this.show = false;
          userDiary.remove({
            'diaryid': this.id
          }).then(function (res) { //删除一条日志
            if (res.data.msg === "success") {
              $scope.diarylist = _.filter($scope.diarylist, function (n) {
                return n._id != _this.id;
              });
              _this.id = '';
            }
          }, function (res) {
            console.log(res)
          });
        },
        remove: function (id) {
          this.show = true;
          this.id = id;
        }
      }
    }
  ]);
