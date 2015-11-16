(function() {
    angular.module('controllers')
        .filter('decDistrictsFilter', function () {
            return function (input) {
                return {
                    "0":'江岸区',
                    "1":'江汉区',
                    "2":'硚口区',
                    "3":'汉阳区',
                    "4":'武昌区',
                    "5":'洪山区',
                    "6":'青山区'
                }[input];
            };
        })
        .controller('RecruitController', [
            '$scope','$rootScope','adminEvents',
            function($scope, $rootScope,adminEvents) {
                //数据加载显示状态
                $scope.loading = {
                    loadData : false,
                    notData : false
                }
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
                    var end = new Date($scope.endTime.time).getTime()
                    if(start > end){
                        alert('开始时间比结束时间大，请从新选择');
                        return ;
                    }if(end-start < 86400000){
                        alert('结束时间必须必比开始时间大一天，请从新选择');
                        return ;
                    }
                    $scope.loading.loadData = false;
                    $scope.userList = undefined;
                    $scope.pagination.currentPage = 1;
                    loadList(1,undefined,{start:start,end:end})
                } 
                //加载数据
                function loadList(from,limit,date){
                    var data = {
                          "query":{},
                          "sort":{"phone": 1},
                          "from": (limit == undefined ? 0 : limit)*(from-1),
                          "limit":(limit == undefined ? undefined : limit)
                        }
                    if(date){
                        data.query.create_at = {
                            "$gte":date.start,
                            "$lte":date.end
                        }
                    }
                    adminEvents.angel(data).then(function(resp){
                        if(resp.data.data.total == 0){
                            $scope.loading.loadData = true;
                            $scope.loading.notData = true;
                        }else{
                            $scope.userList = resp.data.data.users;
                            $scope.pagination.totalItems = resp.data.data.total;
                            $scope.loading.loadData = true;
                            $scope.loading.notData = false;
                        }
                    },function(resp){
                        $scope.loadData = false;
                        console.log(resp);
                    });
                }
                //初始化
                loadList(1,10)
                
            }
        ]);
})();
