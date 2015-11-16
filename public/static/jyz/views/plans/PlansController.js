(function() {
    angular.module('controllers')
        .controller('PlansController', [
            '$scope','$rootScope','adminPlan',
            function($scope, $rootScope, adminPlan) {
                //全局标识，解决筛选和分页问题
                $scope.authType = undefined;
                $scope.createAt = undefined;
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
                        alert('开始时间比结束时间大，请从新选择');
                        return ;
                    }if(end-start < 86400000){
                        alert('结束时间必须必比开始时间大一天，请从新选择');
                        return ;
                    }
                    $scope.loading.notData = false;
                    $scope.loading.loadData = false;
                    $scope.userList = undefined;
                    $scope.createAt = {
                        "$gte":start,
                        "$lte":end
                    };
                    loadList(1);
                };
                //加载数据
                function loadList(from,limit,date){
                    var data = {
                            "query":{
                                status : $scope.authType,
                                request_date : $scope.createAt
                            },
                            "from": (limit === undefined ? 0 : limit)*(from-1),
                            "limit":(limit === undefined ? undefined : limit)
                        };
                    adminPlan.search(data).then(function(resp){
                        if(resp.data.data.total === 0){
                            $scope.loading.loadData = true;
                            $scope.loading.notData = true;
                        }else{
                           $scope.userList = resp.data.data.requirements;
                            angular.forEach($scope.userList, function(value, key){
                               value.time = parseInt(value._id.substring(0, 8), 16) * 1000;
                               angular.forEach($scope.userList, function(value1, key1){
                                    if(value1.requirement.rec_designerids.indexOf(value1.designerid) != -1){
                                        value1.biaoshi = "匹配";
                                    }else{
                                        value1.biaoshi = "自选";
                                    }
                                });
                            });
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
                $scope.authList = [
                    {
                        id : "0",
                        name : '已预约无响应',
                        cur : false 
                    },
                    {
                        id : "1",
                        name : '已拒绝业主',
                        cur : false 
                    },
                    {
                        id : "7",
                        name : '无响应过期',
                        cur : false 
                    },
                    {
                        id : "2",
                        name : '有响应未量房',
                        cur : false 
                    },
                    {
                        id : "6",
                        name : '已量房无方案',
                        cur : false 
                    },
                    {
                        id : "8",
                        name : '无方案过期',
                        cur : false 
                    },
                    {
                        id : "3",
                        name : '已提交方案',
                        cur : false 
                    },
                    {
                        id : "4",
                        name : '方案被拒绝',
                        cur : false 
                    },
                    {
                        id : "5",
                        name : '方案被选中',
                        cur : false 
                    },
                ];
                $scope.authBtn = function(id){
                    $scope.userList = undefined;
                    $scope.loadData = false;
                    angular.forEach($scope.authList, function(value, key) {
                        if(value.id == id){
                            if(value.cur){
                                value.cur = false;
                                $scope.authType = undefined;
                                loadList(1,10);
                            }else{
                                value.cur = true;
                                $scope.authType = id;
                                loadList(1);
                            }
                        }else{
                            value.cur = false;
                        }
                    });
                };
        	}
        ]);
})();
