'use strict';
angular.module('controllers', [])
	.controller('SubController', [    //左侧高亮按钮
            '$scope','$location','userRequiremtne',function($scope, $location,userRequiremtne) {
                $scope.location = $location;
                $scope.requiremtnes = false;
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
    .controller('requirementCtrl', [     //装修需求详情配置
        '$scope','$rootScope','$http','$filter','$location','$stateParams','userRequiremtne',
        function($scope, $rootScope,$http,$filter,$location,$stateParams,userRequiremtne){
                        $scope.tabsData = [
                            {
                                url : "requirement.detail",
                                name : "需求描述",
                                cur : ''
                            },
                            {
                                url : "requirement.owenr",
                                name : "响应需求",
                                cur : ''
                            },
                            {
                                url : "requirement.plan",
                                name : "提交方案",
                                cur : ''
                            },
                            {
                                url : "requirement.contract",
                                name : "生成合同",
                                cur : ''
                            }
                        ]
                        function abc(str){
                            return {
                                "detail" : "需求详情",
                                "owenr" : "响应需求",
                                "plan" : "选择方案",
                                "contract" : "生成合同"
                            }[str]
                        }
                        $scope.location = $location;
                        $scope.$watch( 'location.url()', function( url ){
                            angular.forEach($scope.tabsData, function(value, key){
                                if(value.url.split('.')[1] == url.split('/')[3]){
                                    value.cur = "active"
                                }else{
                                    value.cur = ""
                                }
                            });
                        });
                        $scope.tabBtn = function(name){
                            angular.forEach($scope.tabsData, function(value, key){
                                if(value.name == name){
                                    value.cur = "active"
                                }else{
                                    value.cur = ""
                                }
                            });
                        } 
    }])
    .controller('requirementDetailCtrl', [     //装修需求详情
        '$scope','$rootScope','$http','$filter','$location','$stateParams','userRequiremtne',
        function($scope, $rootScope,$http,$filter,$location,$stateParams,userRequiremtne){
            var requiremtneId = $stateParams.id;
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
                $location.path('requirement/'+id+"/"+statusUrl[status]);
            }
            function load(){
                userRequiremtne.get({"_id":requiremtneId}).then(function(res){
                        $scope.requirement = res.data.data;
                        console.log(res.data.data)
                        detail(res.data.data) //需求描述
                    },function(res){
                        console.log(res)
                });
            }
            load()
            function detail(data){   //需求描述
                $scope.detail = data;
                $scope.detail.area = '';
                if(!!$scope.detail.province){
                    $scope.detail.area += $scope.detail.province + " "
                }
                if(!!$scope.detail.city){
                   $scope.detail.area += $scope.detail.city + " "
                }
                if(!!$scope.detail.district){
                    $scope.detail.area += $scope.detail.district + " "
                }
                $scope.detail.property = '';
                if(!!$scope.detail.cell){
                    $scope.detail.property += $scope.detail.cell + " "
                }
                if(!!$scope.detail.cell_phase){
                    $scope.detail.property += $scope.detail.cell_phase + "期 "
                }
                if(!!$scope.detail.cell_building){
                    $scope.detail.property += $scope.detail.cell_building + "栋 "
                }
                if(!!$scope.detail.cell_unit){
                    $scope.detail.property += $scope.detail.cell_unit + "单元 "
                }
                if(!!$scope.detail.cell_detail_number){
                    $scope.detail.property += $scope.detail.cell_detail_number + "室 "
                }
                $scope.detail.house_type = $filter('houseTypeFilter')($scope.detail.house_type);
                $scope.detail.dec_style = $filter('decStyleFilter')($scope.detail.dec_style);
                $scope.detail.work_type = $filter('workTypeFilter')($scope.detail.work_type);
                $scope.detail.communication_type = $filter('designTypeFilter')($scope.detail.communication_type);
                $scope.detail.dec_type = $filter('decTypeFilter')($scope.detail.dec_type);
            }
        userRequiremtne.plans({"requirementid":requiremtneId}).then(function(res){    //获取我的方案列表
            $scope.plans = res.data.data;
            console.log($scope.plans)
            angular.forEach($scope.plans, function(value, key){
                value.imageSrc = value.user.imageid ? RootUrl+'api/v2/web/image/'+value.user.imageid : '../../static/img/user/headPic.png';
                value.planImages = [];
                angular.forEach(value.images, function(value2, key2){
                    if(key2 < 3){
                        this.push(RootUrl+'api/v2/web/image/'+value2)
                    }
                },value.planImages)
            })
        },function(res){
            console.log(res)
        });
        $scope.answerOwenr = function(){    //响应业主
            userRequiremtne.answer({
              "requirementid": requiremtneId,
              "house_check_time": (new Date).getTime()+100000
            }).then(function(res){    //获取我的方案列表
                load()
            },function(res){
                console.log(res)
            });
        }
        $scope.rejectOwenr = function(){    //拒绝业主
            userRequiremtne.reject({
              "requirementid": requiremtneId,
              "reject_respond_msg": "这是测试拒接"
            }).then(function(res){    //获取我的方案列表
                load()
            },function(res){
                console.log(res)
            });
        }
        userRequiremtne.contract({"requirementid":requiremtneId}).then(function(res){    //获取我的方案列表
            $scope.contract = res.data.data;
            console.log(res.data.data)
        },function(res){
            console.log(res)
        });
        $scope.setStartDate = function(){
            userRequiremtne.config({
              "requirementid":requiremtneId,
              "start_at":(new Date).getTime()+100000
            }).then(function(res){    //获取我的方案列表
                console.log(res)
            },function(res){
                console.log(res)
            });
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
                userFavoriteProduct.remove({'_id':id}).then(function(res){  //获取意向设计师列表
                    if(res.data.msg === "success"){
                       laod(); 
                    }
                },function(res){
                    console.log(res)
                });
            }
            laod()
    }])
    .controller('favoriteDesignerCtrl', [     //意向设计师列表
        '$scope','$rootScope','$http','$filter','$location','userFavoriteDesigner',
        function($scope, $rootScope,$http,$filter,$location,userFavoriteDesigner){
            function laod(){
                userFavoriteDesigner.list().then(function(res){  //获取意向设计师列表
                    $scope.designers = res.data.data.designers;
                    //console.log(res.data.data.total)
                },function(res){
                    console.log(res)
                });
            }
            $scope.cancelBtn = function(id){
                userFavoriteDesigner.remove({'_id':id}).then(function(res){  //获取意向设计师列表
                    if(res.data.msg === "success"){
                       laod(); 
                    }
                },function(res){
                    console.log(res)
                });
            }
            laod()
    }])
