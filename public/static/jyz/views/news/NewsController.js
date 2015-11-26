(function() {
    angular.module('controllers')
        .controller('NewsController', ['$scope','$rootScope','adminArticle',function($scope, $rootScope,adminArticle){
            //全局标识，解决筛选和分页问题
            $scope.phone = undefined; 
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
                    alert('开始时间比结束时间大，请重新选择');
                    return ;
                }if(end-start < 86400000){
                    alert('结束时间必须必比开始时间大一天，请重新选择');
                    return ;
                }
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
                adminArticle.search(data).then(function(resp){
                    if(resp.data.data.total === 0){
                        $scope.loading.loadData = true;
                        $scope.loading.notData = true;
                    }else{
                        $scope.userList = resp.data.data.beautifulImages;
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
            //重置清空状态
            $scope.clearStatus = function(){
                $scope.userList = [];
                $scope.loadData = false;
                $scope.phone = undefined;
                $scope.createAt = undefined;
                $scope.pagination.currentPage = 1;
                $scope.startTime.time = '';
                $scope.endTime.time = '';
                loadList(1);
            }
            //更改显示状态
            $scope.changeStatus = function(id,status){
               status = status == 0 ? "1" : "0";
               adminArticle.upload({"_id": id,"status":status}).then(function(resp){
                    if(resp.data.msg === "success"){
                       loadList(1,10);
                    }
                },function(resp){
                    //返回错误信息
                    $scope.loadData = false;
                    console.log(resp);
                });
            }
            $scope.newsUeditor = function(){
              $scope.news.Keyword = $scope.news.Keyword.split("|").join(',');
              console.log($scope.news.Keyword)
                console.log($scope.news)
            }
        }])
        .controller('PicturesAddController', ['$scope','$rootScope','$stateParams','$state','adminArticle',function($scope, $rootScope,$stateParams,$state,adminArticle){
              var currentId = $stateParams.id == undefined ? "" : $stateParams.id;
              $scope.article_type = [{"num" :0,"name":'装修攻略'}];
              $scope.news = {
                "title":"",
                "description":"",
                "dec_type":"0",
                "house_type":"0",
                "dec_style":"0",
                "images":[]
              }
              if(currentId){
                adminArticle.search({
                  "query":{
                      "_id" : currentId
                  },
                  "from": 0,
                  "limit":1
                }).then(function(resp){
                     if(resp.data.data.total === 1){
                         $scope.news = resp.data.data.beautifulImages[0];
                     }
                 },function(resp){
                     //返回错误信息
                     $scope.loadData = false;
                     console.log(resp);

                 });
              }
              $scope.picturesSubmit = function(){
                  if(!currentId){
                      adminArticle.add($scope.images).then(function(resp){
                         if(resp.data.msg === "success"){
                            $state.go('news')
                         }
                     },function(resp){
                         //返回错误信息
                         $scope.loadData = false;
                         console.log(resp);
                     });
                  }else{
                    adminArticle.upload($scope.images).then(function(resp){
                         if(resp.data.msg === "success"){
                            $state.go('news')
                         }
                     },function(resp){
                         //返回错误信息
                         $scope.loadData = false;
                          console.log(resp);
                     });
                  }
              }            
        }])
})();
