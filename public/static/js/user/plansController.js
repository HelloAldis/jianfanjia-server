'use strict';
angular.module('controllers', [])
	.controller('SubController', [    //左侧高亮按钮
            '$scope','$location',function($scope, $location) {
                $scope.location = $location;
                $scope.$watch( 'location.url()', function( url ){
                    if(url.split('/')[1] == 'requirement'){
                        $scope.nav = 'requirementList'
                    }else if(url.split('/')[1] == 'revise'){
                        $scope.nav = 'requirementList'
                    }else{
                       $scope.nav = url.split('/')[1];  
                    }
                });
            }
    ])
	.controller('createCtrl', [     //方案创建和更新
        '$scope','$rootScope','$http','$filter','$location','userInfo','userRequiremtne','userComment',
        function($scope, $rootScope,$http,$filter,$location,userInfo,userRequiremtne,userComment) {
        	userInfo.get().then(function(res){
        		console.log(res.data.data)
        		$scope.user = res.data.data;
                $scope.user.imgPic = RootUrl+'api/v2/web/thumbnail/120/'+$scope.user.imageid;
        	},function(res){
        		console.log(res)
        	});
            userComment.unread().then(function(res){
                console.log(res.data.data)
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
                "0":"booking",
                "1":"booking",
                "2":"booking",
                "3":"score",
                "4":"plan",
                "5":"contract",
                "6":"score",
                "7":"contract"               
            }
            $scope.goTo = function(id,status){
                $location.path('requirement/'+id+"/"+statusUrl[status]);
            }
    }])
    .controller('detailCtrl', [     //方案详情
        '$scope','$rootScope','$http','$filter','$location','$stateParams','$cookieStore','userRequiremtne','userComment',
        function($scope, $rootScope,$http,$filter,$location,$stateParams,$cookieStore,userRequiremtne,userComment){
            console.log($stateParams.id)
            var userType = $cookieStore.get('usertype');
            var planId = $stateParams.id.split('&')[0];
            var requiremtneId = $stateParams.id.split('&')[1];
            userRequiremtne.get({'_id':requiremtneId}).then(function(res){  //获取个人资料
                console.log(res.data.data)
                $scope.requiremtne = res.data.data;
                var str = '';
                /*if(!!$scope.requiremtne.province){
                    str += $scope.requiremtne.province + " "
                }
                if(!!$scope.requiremtne.city){
                    str += $scope.requiremtne.city + " "
                }
                if(!!$scope.requiremtne.district){
                    str += $scope.requiremtne.district + " "
                }
                if(!!$scope.requiremtne.street){
                    str += $scope.requiremtne.street + " "
                }*/
                if(!!$scope.requiremtne.cell){
                    str += $scope.requiremtne.cell
                }
                if(!!$scope.requiremtne.cell_phase){
                    str += $scope.requiremtne.cell_phase + "期"
                }
                /*if(!!$scope.requiremtne.cell_building){
                    str += $scope.requiremtne.cell_building + "栋"
                }
                if(!!$scope.requiremtne.cell_unit){
                    str += $scope.requiremtne.cell_unit + "单元"
                }
                if(!!$scope.requiremtne.cell_detail_number){
                    str += $scope.requiremtne.cell_detail_number + "室"
                }*/
                $scope.requiremtne.property = str;
            },function(res){
                console.log(res)
            });
            userRequiremtne.plan({'_id':planId}).then(function(res){  //获取个人资料
                console.log(res.data.data)
                $scope.plan = res.data.data;
                $scope.plan.itme_detail = [];
                angular.forEach($scope.plan.price_detail, function(value, key){
                    if(value.item == "设计费"){
                        $scope.plan.design_fee = value.price;
                    }else{
                        this.push(value)
                    }
                },$scope.plan.itme_detail)
                $scope.plan.discount_price = $scope.plan.design_fee + $scope.plan.project_price_after_discount;
                userRequiremtne.designer({
                  "query":{
                     "_id" : $scope.plan.designerid
                  }
                }).then(function(res){  //获取个人资料
                    
                    $scope.designer = res.data.data.designers[0];
                    console.log($scope.designer)
                },function(res){
                    console.log(res)
                });
                $scope.plansTabs = false;
                $scope.planstabBtn = function(off){
                    $scope.plansTabs = off;
                }
            },function(res){
                console.log(res)
            });
            $scope.from = 0;
            function load(){
                userComment.read({
                  "topicid":planId,
                  "from": $scope.from,
                  "limit":10
                }).then(function(res){  //获取个人资料
                    console.log(res.data.data)
                    $scope.comments = res.data.data.comments;
                },function(res){
                    console.log(res)
                });
            }
            load()
            $scope.plansTabs = false;
            $scope.plansMsg = '12345';
            $scope.planstabBtn = function(off){
                $scope.plansTabs = off;
            }
            $scope.addPlansMsg = function(designer,user){
                console.log($scope.plansMsg)
                if($scope.plansMsg){
                    alert(1)
                }
                userComment.add({
                  "topicid":planId,
                  "topictype" : '0',
                  "content": $scope.plansMsg,
                  "to":(userType == '1') ? user : designer
                }).then(function(res){  //获取个人资料
                    console.log(res.data.data)
                    load()
                },function(res){
                    console.log(res)
                });
            }
            $scope.moreBtn = function(len){
                alert(len)
            }
    }])
