'use strict';
angular.module('controllers', [])
	.controller('SubController', [    //左侧高亮按钮
            '$scope','$location','userRequiremtne',function($scope, $location,userRequiremtne) {
                $scope.location = $location;
                $scope.$watch( 'location.url()', function( url ){
                    if(url.split('/')[1] == 'requirement' || url.split('/')[1] == 'revise'){
                        $scope.nav = 'requirementList'
                    }else{
                       $scope.nav = url.split('/')[1];  
                    }
                });
                
            }
    ])
	.controller('indexCtrl', [     //业主首页
        '$scope','$rootScope','$http','$filter','$location','userInfo','userRequiremtne','userComment',
        function($scope, $rootScope,$http,$filter,$location,userInfo,userRequiremtne,userComment) {
            $scope.userAreaOff = false;
            userComment.unread().then(function(res){
                $scope.messages = res.data.data;
                $scope.notMessages = $scope.messages.length ? true : false;
                angular.forEach($scope.messages, function(value, key){
                    value.date = $filter('date')(value.date,'yyyy-MM-dd HH:mm:ss');
                })
            },function(res){
                console.log(res)
            });
            $scope.messageClass = false;
            $scope.messageToggle = function(b){
                $scope.messageClass = b;
            }
            userRequiremtne.list().then(function(res){
                $scope.requiremtnes = res.data.data;
                 $scope.notRequiremtnes = !$scope.requiremtnes.length ? true : false;
                 angular.forEach($scope.requiremtnes, function(value, key){
                    var str = '';
                    if(!!value.province){
                        str += value.province + " "
                    }
                    if(!!value.city){
                        str += value.city + " "
                    }
                    if(!!value.district){
                        str += value.district + " "
                    }
                    if(!!value.street){
                        str += value.street + " "
                    }
                    if(!!value.cell){
                        str += value.cell + " "
                    }
                    if(!!value.cell_phase){
                        str += value.cell_phase + "期 "
                    }
                    if(!!value.cell_building){
                        str += value.cell_building + "栋 "
                    }
                    if(!!value.cell_unit){
                        str += value.cell_unit + "单元 "
                    }
                    if(!!value.cell_detail_number){
                        str += value.cell_detail_number + "室 "
                    }
                    value.property = str;
                })
            },function(res){
                console.log(res)
            });
            var statusUrl = {
                "0":"owner",
                "1":"owner",
                "2":"owner",
                "3":"owner",
                "4":"plan",
                "5":"contract",
                "6":"owner",
                "7":"contract"               
            }
            $scope.goTo = function(id,status){
                $location.path('requirement/'+id+"/"+statusUrl[status]);
            }
    }])
    .controller('requirementListCtrl', [     //装修需求列表
        '$scope','$rootScope','$http','$filter','$location','$stateParams','userRequiremtne',
        function($scope, $rootScope,$http,$filter,$location,$stateParams,userRequiremtne){
            userRequiremtne.list().then(function(res){
                $scope.requiremtnes = res.data.data;
                console.log($scope.requiremtnes)
                 angular.forEach($scope.requiremtnes, function(value, key){
                    value.dec_style = $filter('decStyleFilter')(value.dec_style);
                    value.work_type = $filter('workTypeFilter')(value.work_type);
                    value.house_type = $filter('houseTypeFilter')(value.house_type);
                })
            },function(res){
                console.log(res)
            });
            var statusUrl = {
                "0":"detail",
                "1":"owner",
                "2":"owner",
                "3":"owner",
                "4":"plan",
                "5":"contract",
                "6":"owner",
                "7":"contract"               
            }
            $scope.goTo = function(id,status){
                $location.path('requirement/'+id+"/"+statusUrl[status]);
            }
    }])
    .controller('requirementCtrl', [     //装修需求详情配置
        '$scope','$rootScope','$http','$filter','$location','$stateParams','userRequiremtne',
        function($scope, $rootScope,$http,$filter,$location,$stateParams,userRequiremtne){
            //需求id
            $rootScope.requiremtneId = $stateParams.id;
            //tab栏按钮高亮
            $scope.location = $location;
            $scope.$watch( 'location.url()', function( url ){
                $scope.tab = url.split('/')[3];
            });
            userRequiremtne.get({"_id":$stateParams.id}).then(function(res){
                $scope.requirement = res.data.data;
                $scope.$broadcast('requirementParent', res.data.data);   //父级传递
            },function(res){
                    console.log(res)
            });
            $scope.$on('requirementChildren', function(event, data) {   //父级接收 如果业主操作就需要改变状态
                $scope.requirement = data;  
            });  
    }])
    .controller('requirementDetailCtrl', [     //装修需求详情
        '$scope','$rootScope','$http','$filter','$location','$stateParams','userRequiremtne',
        function($scope, $rootScope,$http,$filter,$location,$stateParams,userRequiremtne){
            var requiremtneId = $stateParams.id;
            $scope.$on('requirementParent',function(event, data){    //子级接收 
                console.log(data.status)
                if(data.status == 0 || data.status == 1 || data.status == 2 || data.status == 3 || data.status == 4 || data.status == 5 || data.status == 6 || data.status == 7){  //预约量房、确认量房
                    myOwner()
                    console.log('响应业主')
                }
                if(data.status == 6 || data.status == 3 || data.status == 7 || data.status == 4 || data.status == 5){  //选择方案
                    myPlan()
                    console.log('提交方案')
                }
                if(data.status == 7 || data.status == 4 || data.status == 5){   //生成合同
                    myContract()
                    console.log('生成合同')
                }
            })
            function uploadParent(){    // 子级传递  如果业主操作就需要改变状态给父级传递信息
                userRequiremtne.get({"_id":$stateParams.id}).then(function(res){
                    $scope.$emit('requirementChildren', res.data.data);
                },function(res){
                    console.log(res)
                });
            }
        function myOwner(){

        }
        // 方案列表
        function myPlan(){
            userRequiremtne.plans({"requirementid":requiremtneId}).then(function(res){    //获取我的方案列表
                $scope.plans = res.data.data;
            },function(res){
                console.log(res)
            });
        }
        $scope.owenr = {
            motaiReject : false,
            motaiAnswer : false,
            rejectMessage : '',
            message : '',
            messages : [
                {
                    'id' : 0,
                    'msg' : '预算偏低，不符合预期',
                    'cur' : false
                },
                {
                    'id' : 1,
                    'msg' : '时间忙，接不过来',
                    'cur' : false
                },
            ],
            messageBtn : function(id){
                angular.forEach($scope.owenr.messages, function(value, key){
                    if(value.id == id){
                        value.cur = true;
                        $scope.owenr.rejectMessage = value.msg
                    }else{
                        value.cur = false;
                    }
                });
            },
            rejectBtn : function(){   //拒绝业主
                $scope.owenr.motaiReject = true;
            },
            answerBtn : function(){   //响应业主
                $scope.owenr.motaiAnswer = true;
            },
            answerOwenr : function(){    //响应业主提交
                userRequiremtne.answer({
                  "requirementid": requiremtneId,
                  "house_check_time": (new Date).getTime()+100000
                }).then(function(res){    //获取我的方案列表
                    $scope.owenr.motaiAnswer = false;
                },function(res){
                    console.log(res)
                });
            },
            rejectOwenr : function(){    //拒绝业主提交
                userRequiremtne.reject({
                  "requirementid": requiremtneId,
                  "reject_respond_msg": $scope.owenr.rejectMessage +" "+ $scope.owenr.message
                }).then(function(res){    //获取我的方案列表
                    $scope.owenr.motaiReject = false;
                },function(res){
                    console.log(res)
                });
            },
        }
        // 三方合同
        function myContract(){   //获取我的第三方合同
            userRequiremtne.contract({"requirementid":requiremtneId}).then(function(res){    
                $scope.contract = res.data.data;
            },function(res){
                console.log(res)
            });
        }
        $scope.contracts = {
            btnsBox : true,
            motaiStartDate : false,
            startDate : '',
            setStartDate : function(){
                $scope.contracts.btnsBox = false;
                $scope.contracts.motaiStartDate = true;
            },
            setCancelBtn : function(){
                $scope.contracts.btnsBox = true;
                $scope.contracts.motaiStartDate = false; 
            },
            setDefineBtn : function(){
                userRequiremtne.config({
                  "requirementid":requiremtneId,
                  "start_at":$scope.contracts.startDate
                }).then(function(res){
                    uploadParent();
                    $scope.contracts.btnsBox = true;
                    $scope.contracts.motaiStartDate = false;
                },function(res){
                    console.log(res)
                });
            }
        }
    }])
    .controller('historyListCtrl', [     //历史装修需求列表
        '$scope','$rootScope','$http','$filter','$location','$stateParams','userRequiremtne',
        function($scope, $rootScope,$http,$filter,$location,$stateParams,userRequiremtne){
            userRequiremtne.history().then(function(res){
                $scope.historys = res.data.data;
                console.log($scope.historys)
                 angular.forEach($scope.requiremtnes, function(value, key){
                    value.dec_style = $filter('decStyleFilter')(value.dec_style);
                    value.work_type = $filter('workTypeFilter')(value.work_type);
                    value.house_type = $filter('houseTypeFilter')(value.house_type);
                })
            },function(res){
                console.log(res)
            });
            var statusUrl = {
                "0":"owenr",
                "1":"owenr",
                "2":"owenr",
                "3":"owenr",
                "4":"plan",
                "5":"contract",
                "6":"owenr",
                "7":"contract"               
            }
            $scope.goTo = function(id,status){
                $location.path('requirement/'+id+"/detail");
            }
    }])
    .controller('favoriteProductCtrl', [     //作品收藏列表
        '$scope','$rootScope','$http','$filter','$location','userFavoriteProduct',
        function($scope, $rootScope,$http,$filter,$location,userFavoriteProduct){
            function laod(){
                userFavoriteProduct.list().then(function(res){  //获取作品收藏列表
                    $scope.products = res.data.products;
                    angular.forEach($scope.products, function(value, key){
                        value.house_type = $filter('houseTypeFilter')(value.house_type);
                        value.dec_style = $filter('decStyleFilter')(value.dec_style);
                        value.description = $filter('limitTo')(value.description,100);
                    })
                    //console.log(res.data.total);
                },function(res){
                    console.log(res)
                });
            }
            $scope.deleteFavorite = function(id){
                userFavoriteProduct.remove({'_id':id}).then(function(res){ 
                    if(res.data.msg === "success"){
                       laod(); 
                    }
                },function(res){
                    console.log(res)
                });
            }
            laod()
    }])

