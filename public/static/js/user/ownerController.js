'use strict';
angular.module('controllers', [])
	.controller('SubController', [    //左侧高亮按钮
            '$scope','$location',function($scope, $location) {
                $scope.location = $location;
                $scope.$watch( 'location.url()', function( url ){
                    if(url.split('/')[1] == 'requirement'){
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
    .controller('inforCtrl', [     //业主资料
        '$scope','$rootScope','$http','$filter','$location','userInfo',
        function($scope, $rootScope,$http,$filter,$location,userInfo){
            var desArea = $('#where_area');
            $scope.usersex = [ 
                {
                    id : '0',
                    name : '男',
                    cur : '' 
                },
                {
                    id : '1',
                    name : '女',
                    cur : '' 
                }
            ]
            userInfo.get().then(function(res){  //获取个人资料
                console.log(res.data.data);
                $scope.user = res.data.data;
                desArea.empty();
                if(!!$scope.user.province){
                    var designAreaQuery = $scope.user.province+" "+$scope.user.city+" "+$scope.user.district;
                    desArea.find('input[name=where_area]').val(designAreaQuery)
                    var designArea = new CitySelect({id :'where_area',"query":designAreaQuery});
                }else{
                    desArea.find('input[name=where_area]').val("")
                    var designArea = new CitySelect({id :'where_area'});
                }
                setSex(false,$scope.user.sex)
                $scope.user.imageSrc = RootUrl+'api/v1/image/'+$scope.user.imageid;
            },function(res){
                console.log(res)
            });
            $scope.radiosex = function(id){
                setSex(false,id)
            }
            function setSex(b,id){
                var str = ''
                angular.forEach($scope.usersex, function(value, key){
                    if(b){
                       if(value.cur == 'active'){
                         str = value.id
                       } 
                    }else{
                       if(value.id == id){
                            value.cur = 'active'
                        }else{
                            value.cur = ''
                        } 
                    }
                })
                return str;
            }
            $scope.submitBtn = function(){     //修改个人资料
                $scope.user.province = desArea.find('input[name=province]').val() || $scope.user.province;
                $scope.user.city = desArea.find('input[name=city]').val() || $scope.user.city;
                $scope.user.district = desArea.find('input[name=district]').val() || $scope.user.district;
                $scope.user.sex = setSex(true)
                userInfo.update($scope.user).then(function(res){     
                    if(res.data.msg == "success"){
                        $location.path('index');
                    }
                },function(res){
                    console.log(res)
                })
            };
    }])
	.controller('releaseCtrl', [     //业主提交需求
        '$scope','$rootScope','$http','$filter','$location','$stateParams','userRequiremtne','userInfo',
        function($scope, $rootScope,$http,$filter,$location,$stateParams,userRequiremtne,userInfo){
            var desArea = $('#release_area');
            $scope.dec_style = [
                {"id" :0,"name":'欧式'},
                {"id" :1,"name":'中式'},
                {"id" :2,"name":'现代'},
                {"id" :3,"name":'地中海'},
                {"id" :4,"name":'美式'},
                {"id" :5,"name":'东南亚'},
                {"id" :6,"name":'田园'}];
            $scope.house_type = [
                {"id" :0,"name":'一室'},
                {"id" :1,"name":'二室'},
                {"id" :2,"name":'三室'},
                {"id" :3,"name":'四室'},
                {"id" :4,"name":'复式'},
                {"id" :5,"name":'别墅'},
                {"id" :6,"name":'LOFT'},
                {"id" :7,"name":'其他'}];
            $scope.work_type = [
                {"id" :0,"name":'半包'},
                {"id" :1,"name":'全包'}];
            $scope.communication_type = [
                {"id" :0,"name":'不限'},
                {"id" :1,"name":'表达型'},
                {"id" :2,"name":'倾听型'}
            ]
            $scope.family_description = [
                {"name":'单身'},
                {"name":'两个人'},
                {"name":'三个人'},
                {"name":'四个人'}
            ]
           $scope.dec_style = [
                {
                    num : '0',
                    txt : '欧式',
                    url : '../../../static/img/user/stylePic0.jpg'
                },
                {
                    num : '1',
                    txt : '中式',
                    url : '../../../static/img/user/stylePic1.jpg'
                },
                {
                    num : '2',
                    txt : '现代',
                    url : '../../../static/img/user/stylePic2.jpg'
                },
                {
                    num : '3',
                    txt : '地中海',
                    url : '../../../static/img/user/stylePic3.jpg'
                },
                {
                    num : '4',
                    txt : '美式',
                    url : '../../../static/img/user/stylePic4.jpg'
                },
                {
                    num : '5',
                    txt : '东南亚',
                    url : '../../../static/img/user/stylePic5.jpg'
                },
                {
                    num : '6',
                    txt : '田园',
                    url : '../../../static/img/user/stylePic6.jpg'
                },
                {
                    num : '7',
                    txt : '混搭',
                    url : '../../../static/img/user/stylePic7.jpg'
                }
            ]
            console.log('需求id:'+$stateParams.id)
            if($stateParams.id == ''){        //发布新需求
                userInfo.get().then(function(res){  //获取个人资料
                    console.log(res.data.data);
                    $scope.user = res.data.data;
                    desArea.empty();
                    if(!!$scope.user.province){
                        var designAreaQuery = $scope.user.province+" "+$scope.user.city+" "+$scope.user.district;
                        desArea.find('input[name=where_area]').val(designAreaQuery)
                        var designArea = new CitySelect({id :'where_area',"query":designAreaQuery});
                    }else{
                        desArea.find('input[name=where_area]').val("")
                        var designArea = new CitySelect({id :'where_area'});
                    }
                },function(res){
                    console.log(res)
                });
                $scope.requiremtne = {};
                $scope.requiremtne.dec_style = '0';
                $scope.requiremtne.house_type = '0';
                $scope.requiremtne.work_type = '0';
                $scope.requiremtne.communication_type = '0';
                $scope.submitBtn = function(){
                    console.log(stylePic())
                    userRequiremtne.add($scope.requiremtne).then(function(res){  //提交新需求
                        if(res.data.data.requirementid){
                            alert('提交需求成功前往预约设计师量房');
                            $location.path('requirement/'+res.data.data.requirementid+"/booking");
                        }
                    },function(res){
                        console.log(res)
                    });
                }
            }else{   //修改某条需求
                userRequiremtne.get({'_id':$stateParams.id}).then(function(res){  //获取个人资料
                    console.log(res.data.data);
                    $scope.requiremtne = res.data.data;
                    desArea.empty();
                    console.log($scope.requiremtne)
                    if(!!$scope.requiremtne.province){
                        var designAreaQuery = $scope.requiremtne.province+" "+$scope.requiremtne.city+" "+$scope.requiremtne.district;
                        desArea.find('input[name=where_area]').val(designAreaQuery)
                        var designArea = new CitySelect({id :'where_area',"query":designAreaQuery});
                    }else{
                        desArea.find('input[name=where_area]').val("")
                        var designArea = new CitySelect({id :'where_area'});
                    }
                    console.log($scope.requiremtne.dec_style)
                },function(res){
                    console.log(res)
                });
                $scope.submitBtn = function(){
                    $scope.requiremtne.province = desArea.find('input[name=province]').val() || $scope.requiremtne.province;
                    $scope.requiremtne.city = desArea.find('input[name=city]').val() || $scope.requiremtne.city;
                    $scope.requiremtne.district = desArea.find('input[name=district]').val() || $scope.requiremtne.district;
                    console.log($scope.requiremtne)
                    if(confirm("你确定修改了吗")){
                        userRequiremtne.update($scope.requiremtne).then(function(res){  //修改需求
                            if(res.data.msg == "success"){
                                alert('修改需求成功前往预约设计师量房');
                                $location.path('requirement/'+$stateParams.id+"/booking");
                            }
                        },function(res){
                            console.log(res)
                        });
                    }
                    
                }
                $scope.goTo = function(){
                    $location.path('requirement/'+$stateParams.id+"/detail");
                }
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
    .controller('requirementDetailCtrl', [     //装修需求详情
        '$scope','$rootScope','$http','$filter','$location','$stateParams','userRequiremtne',
        function($scope, $rootScope,$http,$filter,$location,$stateParams,userRequiremtne){
            console.log($stateParams.id)
            userRequiremtne.get({"_id":$stateParams.id}).then(function(res){
                    console.log(res.data.data)
                    $scope.requirement = res.data.data;
                },function(res){
                    console.log(res)
            });
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

    }])
    .controller('favoriteProductCtrl', [     //作品收藏列表
        '$scope','$rootScope','$http','$filter','$location','userFavoriteProduct',
        function($scope, $rootScope,$http,$filter,$location,userFavoriteProduct){
            userFavoriteProduct.list().then(function(res){  //获取作品收藏列表
                console.log(res.data);
            },function(res){
                console.log(res)
            });
    }])
    .controller('favoriteDesignerCtrl', [     //意向设计师列表
        '$scope','$rootScope','$http','$filter','$location','userFavoriteDesigner',
        function($scope, $rootScope,$http,$filter,$location,userFavoriteDesigner){
            userFavoriteDesigner.list().then(function(res){  //获取意向设计师列表
                console.log(res.data);
            },function(res){
                console.log(res)
            });
    }])
