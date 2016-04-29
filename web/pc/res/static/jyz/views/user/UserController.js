(function() {
    angular.module('controllers')
        .controller('UserController', [
            '$scope','$rootScope','adminUser',
            function($scope, $rootScope,adminUser) {
                //全局标识，解决筛选和分页问题
                $scope.phone = undefined;
                $scope.createAt = undefined;
                $scope.searchUser = undefined;
                //数据加载显示状态
                $scope.loading = {
                    loadData : false,
                    notData : false
                };
                //分页控件
                $scope.pagination = {
                    currentPage : 1,
                    totalItems : 0,
                    maxSize : 5,
                    pageChanged : function(){
                        loadList(this.currentPage,10);
                    }
                };
                //时间筛选控件
                $scope.startTime = {
                    clear : function(){
                        this.dt = null;
                    },
                    dateOptions : {
                       formatYear: 'yy',
                       startingDay: 1
                    },
                    status : {
                        opened: false
                    },
                    open : function($event) {
                        this.status.opened = true;
                    },
                    today : function(){
                        this.dt = new Date();
                    }
                };
                $scope.startTime.today();
                $scope.endTime = {
                    clear : function(){
                        this.dt = null;
                    },
                    dateOptions : {
                       formatYear: 'yy',
                       startingDay: 1
                    },
                    status : {
                        opened: false
                    },
                    open : function($event) {
                        this.status.opened = true;
                    },
                    today : function(){
                        this.dt = new Date();
                    }
                };
                $scope.endTime.today();
                $scope.searchTimeBtn = function(){
                    var start = new Date($scope.startTime.time).getTime();
                    var end = new Date($scope.endTime.time).getTime();
                    if(start > end){
                        alert('开始时间比结束时间大，请重新选择');
                        return ;
                    }if(end-start < 86400000){
                        alert('结束时间必须必比开始时间大一天，请重新选择');
                        return ;
                    }
                    $scope.phone = $scope.searchUser;
                    $scope.userList = undefined;
                    $scope.loading.loadData = false;
                    $scope.loading.notData = false;
                    $scope.pagination.currentPage = 1;
                    $scope.createAt = {
                        "$gte":start,
                        "$lte":end
                    };
                    loadList(1);
                };
                //加载数据
                function loadList(from,limit){
                    from = (limit === undefined ? 0 : limit)*(from-1);
                    limit = limit || undefined;
                    var data = {
                            "query":{
                                phone : $scope.phone,
                                create_at : $scope.createAt
                            },
                            "from": from,
                            "limit": limit
                        };
                    adminUser.search(data).then(function(resp){
                        if(resp.data.data.total === 0){
                            $scope.loading.loadData = true;
                            $scope.loading.notData = true;
                        }else{
                            $scope.userList = resp.data.data.users;
                            $scope.pagination.totalItems = resp.data.data.total;
                            $scope.loading.loadData = true;
                            $scope.loading.notData = false;
                        }
                    },function(resp){
                        //返回错误信息
                        $scope.loadData = false;
                        console.log(resp);

                    });
                }
                //初始化
                loadList(1,10);
                //搜索业主
                $scope.searchBtn = function(){
                    $scope.phone = $scope.searchUser;
                    $scope.userList = undefined;
                    $scope.pagination.currentPage = 1;
                    loadList(1);
                }
                //重置清空状态
                $scope.clearStatus = function(){
                    $scope.userList = [];
                    $scope.loadData = false;
                    $scope.phone = undefined;
                    $scope.createAt = undefined;
                    $scope.searchUser = undefined;
                    $scope.pagination.currentPage = 1;
                    $scope.startTime.time = '';
                    $scope.endTime.time = '';
                    loadList(1);
                }
            }
        ])
        .controller('UserInfoController', [
            '$scope','$rootScope','$stateParams','adminUser',
            function($scope, $rootScope, $stateParams,adminUser){
                adminUser.search({
                  "query":{
                    "_id":$stateParams.id
                  },
                  "from":0,
                  "limit":1
                }).then(function(resp){
                    if(resp.data.data.total === 1){
                        $scope.user = resp.data.data.users[0];
                        $scope.head = !!$scope.user.imageid ? RootUrl+'api/v2/web/thumbnail/200/'+resp.data.data.imageid : 'jyz/img/headpic.jpg';
                    }
                },function(resp){
                    //返回错误信息
                    console.log(resp);

                });
        	}
        ])
        .controller('UserRequirementController', [
            '$scope','$rootScope','$stateParams','adminRequirement',
            function($scope, $rootScope, $stateParams,adminRequirement) {
                adminRequirement.search({
                  "query":{
                    "userid":$stateParams.id
                  },
                  "sort":{"_id": 1},
                  "from": 0,
                  "limit":10
                }).then(function(resp){
                    if(resp.data.data.total !== 0){
                        $scope.userList = resp.data.data.requirements;
                    }
                },function(resp){
                    //返回错误信息
                    console.log(resp);

                });
        	}
        ])
        .controller('UserDesignerController', [
            '$scope','$rootScope','$stateParams','adminRequirement','adminPlan','adminDesigner',
            function($scope, $rootScope, $stateParams,adminRequirement,adminPlan,adminDesigner) {
                adminRequirement.search({
                    "query":{
                        "_id":$stateParams.id
                    },
                    "sort":{"_id": 1},
                    "from": 0,
                    "limit":10
                }).then(function(resp){
                    if(resp.data.data.total === 1){
                        $scope.user = resp.data.data.requirements[0];
                        //所有方案
                        adminPlan.search({
                            "query":{
                               "requirementid": $scope.user._id
                            },
                            "sort":{"_id": 1},
                            "from": 0
                       }).then(function(resp){
                           if(resp.data.data.total !== 0){
                               $scope.plans = resp.data.data.requirements;
                               angular.forEach($scope.plans, function(value, key){
                                   if(value.requirement.rec_designerids.indexOf(value.designerid) != -1){
                                       value.biaoshi = "匹配";
                                   }else{
                                       value.biaoshi = "自选";
                                   }
                               });
                           }
                       },function(resp){
                           //返回错误信息
                           console.log(resp);
                       });
                       //匹配设计师
                       if($scope.user.rec_designerids.length > 0){
                           adminDesigner.search({
                               "query":{
                                  "_id": {"$in":$scope.user.rec_designerids}
                               },
                               "sort":{"_id": 1},
                               "from": 0
                           }).then(function(resp){
                               if(resp.data.data.total !== 0){
                                  $scope.recDesignerList = resp.data.data.designers;
                               }
                           },function(resp){
                              //返回错误信息
                              console.log(resp);
                           });
                       }
                       //所有参与设计师
                       if($scope.user.order_designerids.length > 0){
                           adminDesigner.search({
                               "query":{
                                  "_id": {"$in":$scope.user.order_designerids}
                               },
                               "sort":{"_id": 1},
                               "from": 0
                           }).then(function(resp){
                               if(resp.data.data.total !== 0){
                                  $scope.designerList = resp.data.data.designers;
                               }
                           },function(resp){
                              //返回错误信息
                              console.log(resp);
                           });
                       }
                       //最后成交设计师
                       if($scope.user.final_designerid){
                           adminDesigner.search({
                               "query":{
                                  "_id": $scope.user.final_designerid
                               },
                               "sort":{"_id": 1},
                               "from": 0
                           }).then(function(resp){
                               if(resp.data.data.total === 1){
                                  $scope.finalDesigner = resp.data.data.designers[0];
                               }
                           },function(resp){
                              //返回错误信息
                              console.log(resp);
                           });
                       }
                    }
                },function(resp){
                    //返回错误信息
                    console.log(resp);

                });
            }
        ]);
})();
