(function () {
  angular.module('controllers')
    .controller('DesignerController', [ //设计师列表
      '$scope', '$rootScope', '$uibModal', 'adminDesigner', '$stateParams', '$location',
      function ($scope, $rootScope, $uibModal, adminDesigner, $stateParams, $location) {
        $scope.authList = [{
          id: "0",
          name: '未提交认证',
          cur: false
        }, {
          id: "1",
          name: '审核中',
          cur: false
        }, {
          id: "2",
          name: '审核通过',
          cur: false
        }, {
          id: "3",
          name: '审核不通过',
          cur: false
        }, {
          id: "4",
          name: '违规下线',
          cur: false
        }];

        $scope.uidAuthList = [{
          id: "0",
          name: '未提交认证',
          cur: false
        }, {
          id: "1",
          name: '审核中',
          cur: false
        }, {
          id: "2",
          name: '审核通过',
          cur: false
        }, {
          id: "3",
          name: '审核不通过',
          cur: false
        }, {
          id: "4",
          name: '违规下线',
          cur: false
        }];

        $scope.workAuthList = [{
          id: "0",
          name: '未提交认证',
          cur: false
        }, {
          id: "1",
          name: '审核中',
          cur: false
        }, {
          id: "2",
          name: '审核通过',
          cur: false
        }, {
          id: "3",
          name: '审核不通过',
          cur: false
        }, {
          id: "4",
          name: '违规下线',
          cur: false
        }];

        $scope.emailAuthList = [{
          id: "0",
          name: '未提交认证',
          cur: false
        }, {
          id: "1",
          name: '审核中',
          cur: false
        }, {
          id: "2",
          name: '审核通过',
          cur: false
        }, {
          id: "3",
          name: '审核不通过',
          cur: false
        }, {
          id: "4",
          name: '违规下线',
          cur: false
        }];

        $stateParams.detail = JSON.parse($stateParams.detail || '{}');
        //刷新页面公共方法
        function refreshPage(detail) {
          $location.path('/designer/' + JSON.stringify(detail));
        }

        function initList(list, id) {
          if (!list || !id) {
            return;
          }

          angular.forEach(list, function (value, key) {
            if (value.id == id) {
              if (value.cur) {
                value.cur = false;
              } else {
                value.cur = true;
              }
            } else {
              value.cur = false;
            }
          });
        }

        function getCurId(list) {
          for (var value of list) {
            if (value.cur) {
              return value.id;
            }
          }

          return undefined;
        }

        function curList(list, id) {
          angular.forEach(list, function (value, key) {
            if (value.id == id) {
              value.cur = !value.cur;
            } else {
              value.cur = false;
            }
          });
        }

        function clearCur(list) {
          angular.forEach(list, function (value, key) {
            value.cur = false;
          });
        }

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

            initList($scope.authList, detail.query.auth_type);
            initList($scope.uidAuthList, detail.query.uid_auth_type);
            initList($scope.workAuthList, detail.query.work_auth_type);
            initList($scope.emailAuthList, detail.query.email_auth_type);

            $scope.searchDesigner = detail.query.phone;
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
          detail.query.phone = $scope.searchDesigner || undefined;
          detail.query.auth_type = getCurId($scope.authList);
          detail.query.uid_auth_type = getCurId($scope.uidAuthList);
          detail.query.work_auth_type = getCurId($scope.workAuthList);
          detail.query.email_auth_type = getCurId($scope.emailAuthList);
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
        //提示消息
        function tipsMsg(msg, time) {
          time = time || 2000;
          $uibModal.open({
            size: 'sm',
            template: '<div class="modal-header"><h3 class="modal-title">消息提醒</h3></div><div class="modal-body"><p class="text-center">' +
              msg + '</p></div>',
            controller: function ($scope, $timeout, $modalInstance) {
              $scope.ok = function () {
                $modalInstance.close();
              };
              $timeout(function () {
                $scope.ok();
              }, time);
            }
          });
        }
        //加载数据
        function loadList(detail) {
          console.log(detail);
          adminDesigner.search(detail).then(function (resp) {
            if (resp.data.data.total === 0) {
              $scope.loading.loadData = true;
              $scope.loading.notData = true;
              $scope.userList = [];
            } else {
              $scope.userList = resp.data.data.designers;
              // angular.forEach($scope.userList, function (value, key) {
              //   if ($scope.authType) {
              //     value.authDate = value.auth_date;
              //     value.status = value.auth_type;
              //   } else if ($scope.uidAuthType) {
              //     value.authDate = value.uid_auth_date;
              //     value.status = value.uid_auth_type;
              //   } else if ($scope.workAuthType) {
              //     value.authDate = value.work_auth_date;
              //     value.status = value.work_auth_type;
              //   } else if ($scope.emailAuthType) {
              //     value.authDate = value.email_auth_date;
              //     value.status = value.email_auth_type;
              //   }
              // });
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

        //搜索设计师
        $scope.searchBtn = function () {
          $scope.pagination.currentPage = 1;
          refreshPage(refreshDetailFromUI($stateParams.detail));
        }

        $scope.authBtn = function (id, list) {
          curList(list, id);

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
          clearCur($scope.authList);
          clearCur($scope.uidAuthList);
          clearCur($scope.workAuthList);
          clearCur($scope.emailAuthList);
          $scope.pagination.currentPage = 1;
          $scope.startTime.time = '';
          $scope.endTime.time = '';
          $scope.searchDesigner = undefined;
          $stateParams.detail = {};
          refreshPage(refreshDetailFromUI($stateParams.detail));
        };
        //设计师强制下线
        $scope.forcedOffline = function (id, status, designer) {
          status = status == 0 ? "1" : "0"
          if (confirm("你确定该设计师强制下线吗？")) {
            adminDesigner.online({
              "designerid": id,
              "new_oneline_status": status
            }).then(function (resp) {
              if (resp.data.msg === "success") {
                tipsMsg('操作成功');
                // designer.online_status = status;
                loadList(refreshDetailFromUI($stateParams.detail));
              }
            }, function (resp) {
              console.log(resp);
            });
          }
        };

        $scope.getProductDetail = function (designer) {
          var detail = {
            detail: JSON.stringify({
              query: {
                designerid: designer._id
              }
            })
          };
          return detail;
        };
      }
    ])
    .controller('DesignerTeamController', [ //设计师的施工团队
      '$scope', '$rootScope', '$stateParams', '$http', '$filter', '$location',
      function ($scope, $rootScope, $stateParams, $http, $filter, $location) {
        $http({ //获取数据
          method: "POST",
          url: RootUrl + 'api/v2/web/admin/search_team',
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
            console.log(data);
            data.area = !!data.province ? data.province + " " + data.city + " " + data.district : '未填写';
            data.teamid = data._id + "?" + data.designerid
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
    ])
    .controller('DesignerEditorTeamController', [ //设计师编辑施工团队
      '$scope', '$rootScope', '$stateParams', '$http', '$filter', '$location',
      function ($scope, $rootScope, $stateParams, $http, $filter, $location) {
        console.log($stateParams.id)
        $scope.teamid = $stateParams.id.split("?")[0];
        $scope.userUid = $stateParams.id.split("?")[1];
        $http({ //获取数据
          method: "POST",
          url: RootUrl + 'api/v2/web/admin/search_team',
          data: {
            "query": {
              "_id": $scope.teamid,
              "designerid": $scope.userUid
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
              uploader: RootUrl + 'api/v2/web/image/upload',
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
              url: RootUrl + 'api/v2/web/admin/update_team',
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
    ])
    .controller('DesignerInfoController', [ //设计师个人信息
      '$scope', '$rootScope', '$http', '$stateParams',
      function ($scope, $rootScope, $http, $stateParams) {
        $http({ //获取数据
          method: "POST",
          url: RootUrl + 'api/v2/web/admin/designer/' + $stateParams.id
        }).then(function (resp) {
          //返回信息
          $scope.user = resp.data.data;
          $scope.uid_img1 = $scope.user.uid_image1 ? RootUrl + 'api/v2/web/thumbnail/800/' + $scope.user.uid_image1 : "";
          $scope.uid_img2 = $scope.user.uid_image2 ? RootUrl + 'api/v2/web/thumbnail/800/' + $scope.user.uid_image2 : "";
          $scope.bank_img1 = $scope.user.bank_card_image1 ? RootUrl + 'api/v2/web/thumbnail/800/' + $scope.user.bank_card_image1 : "";
          console.log($scope.user);
        }, function (resp) {
          //返回错误信息
          console.log(resp);
          promptMessage('获取数据失败', resp.data.msg)
        })
      }
    ])
    .controller('DesignerInfoAuthController', [ //设计师信息认证
      '$scope', '$rootScope', '$http', '$stateParams', '$location',
      function ($scope, $rootScope, $http, $stateParams, $location) {
        $http({ //获取数据
          method: "POST",
          url: RootUrl + 'api/v2/web/admin/designer/' + $stateParams.id
        }).then(function (resp) {
          //返回信息
          $scope.user = resp.data.data;
          $scope.head_img1 = $scope.user.imageid ? RootUrl + 'api/v2/web/thumbnail/200/' + $scope.user.imageid : 'jyz/img/headpic.jpg';
          $scope.head_img2 = $scope.user.big_imageid ? RootUrl + 'api/v2/web/thumbnail/800/' + $scope.user.big_imageid :
            'jyz/img/headpic.jpg';
          $scope.diploma_image = $scope.user.diploma_imageid ? RootUrl + 'api/v2/web/thumbnail/800/' + $scope.user.diploma_imageid : '';
          console.log($scope.user);
        }, function (resp) {
          //返回错误信息
          console.log(resp);
          promptMessage('获取数据失败', resp.data.msg)
        })
        $scope.success = function (type) {
          if (confirm("你确定要操作吗？")) {
            if (type == "2") {
              msg = '认证成功';
            } else {
              if (!!$scope.errorMsg) {
                msg = $scope.errorMsg;
              } else {
                alert('请填写未认证通过原因');
                return;
              }
            }
            $http({ //获取数据
              method: "POST",
              url: RootUrl + 'api/v2/web/admin/update_basic_auth',
              data: {
                "_id": $stateParams.id,
                "new_auth_type": type,
                "auth_message": msg
              }
            }).then(function (resp) {
              //返回信息
              $location.path('designer'); //设置路由跳转
            }, function (resp) {
              //返回错误信息
              console.log(resp);
              promptMessage('获取数据失败', resp.data.msg)
            })
          }
        }
      }
    ])
    .controller('DesignerIdAuthController', [ //设计师身份证认证
      '$scope', '$rootScope', '$http', '$stateParams', '$location',
      function ($scope, $rootScope, $http, $stateParams, $location) {
        $http({ //获取数据
          method: "POST",
          url: RootUrl + 'api/v2/web/admin/designer/' + $stateParams.id
        }).then(function (resp) {
          //返回信息
          console.log(resp);
          $scope.user = resp.data.data;
          $scope.uid_img1 = $scope.user.uid_image1 ? RootUrl + 'api/v2/web/thumbnail/800/' + $scope.user.uid_image1 : "";
          $scope.uid_img2 = $scope.user.uid_image2 ? RootUrl + 'api/v2/web/thumbnail/800/' + $scope.user.uid_image2 : "";
          $scope.bank_img1 = $scope.user.bank_card_image1 ? RootUrl + 'api/v2/web/thumbnail/800/' + $scope.user.bank_card_image1 : "";
        }, function (resp) {
          //返回错误信息
          console.log(resp);
          promptMessage('获取数据失败', resp.data.msg)
        })
        $scope.success = function (type) {
          if (confirm("你确定要操作吗？")) {
            if (type == "2") {
              msg = '认证成功';
            } else {
              if (!!$scope.errorMsg) {
                msg = $scope.errorMsg;
              } else {
                alert('请填写未认证通过原因');
                return;
              }
            }
            $http({ //获取数据
              method: "POST",
              url: RootUrl + 'api/v2/web/admin/update_uid_auth',
              data: {
                "_id": $stateParams.id,
                "new_auth_type": type,
                "auth_message": msg
              }
            }).then(function (resp) {
              //返回信息
              $location.path('designer'); //设置路由跳转
            }, function (resp) {
              //返回错误信息
              console.log(resp);
              promptMessage('获取数据失败', resp.data.msg)
            })
          }
        }
      }
    ])
    .controller('DesignerFieldAuthController', [ //设计师实地认证
      '$scope', '$rootScope', '$http', '$stateParams', '$location',
      function ($scope, $rootScope, $http, $stateParams, $location) {
        $scope.success = function (type) {
          if (confirm("你确定要操作吗？")) {
            if (type == "2") {
              msg = '认证成功';
            } else {
              if (!!$scope.errorMsg) {
                msg = $scope.errorMsg;
              } else {
                alert('请填写未认证通过原因');
                return;
              }
            }
            $http({ //获取数据
              method: "POST",
              url: RootUrl + 'api/v2/web/admin/update_work_auth',
              data: {
                "_id": $stateParams.id,
                "new_auth_type": type,
                "auth_message": msg
              }
            }).then(function (resp) {
              //返回信息
              $location.path('designer'); //设置路由跳转
            }, function (resp) {
              //返回错误信息
              console.log(resp);
              promptMessage('获取数据失败', resp.data.msg)
            })
          }
        }
      }
    ]);
})();
