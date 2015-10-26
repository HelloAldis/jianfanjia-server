'use strict';
angular.module('controllers', [])
	.controller('SubController', [    //左侧高亮按钮
            '$scope','$rootScope','$location','$filter','userRequiremtne',
            function($scope, $rootScope ,$location,$filter,userRequiremtne) {
                //全局需求列表
                requiremtne()
                function requiremtne(){
                   userRequiremtne.list().then(function(res){
                        $rootScope.requirementList = res.data.data;
                        angular.forEach($rootScope.requirementList, function(value, key){
                            value.dec_style = $filter('decStyleFilter')(value.dec_style);
                            value.work_type = $filter('workTypeFilter')(value.work_type);
                            value.house_type = $filter('houseTypeFilter')(value.house_type);
                        })
                    },function(res){
                        console.log(res)
                    }); 
                }
                $scope.location = $location;
                $scope.$watch( 'location.url()', function( url ){
                    if(url.split('/')[1] == 'requirement'){
                        $scope.nav = 'requirementList'
                    }else if(url.split('/')[1] == 'revise'){
                        $scope.nav = 'requirementList'
                    }else if(url.split('/')[1] == 'requirementList' || url.split('/')[1] == 'index'){
                        requiremtne();
                        $scope.nav = url.split('/')[1];
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
        		$scope.user = res.data.data;
        	},function(res){
        		console.log(res)
        	});
            userComment.unread().then(function(res){
                $scope.messages = res.data.data;
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
    }])
    .controller('inforCtrl', [     //业主资料
        '$scope','$rootScope','$http','$filter','$location','userInfo',
        function($scope, $rootScope,$http,$filter,$location,userInfo){
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
            ];
            userInfo.get().then(function(res){  //获取个人资料
                console.log(res.data.data);
                $scope.user = res.data.data;
                $scope.cities_list = tdist;
                if(!!$scope.user.province){
                    $scope.user.province = $scope.user.province;
                    $scope.user.city = $scope.user.city;
                    $scope.user.district = $scope.user.district;
                }else{
                    $scope.user.province = '请选择省份';
                    $scope.user.city = '请选择市';
                    $scope.user.district = '请选择县/区';
                }
                setSex(false,$scope.user.sex);
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
                if(checkSupport() !== "html5"){
                    $('#fileToUpload').uploadify('destroy');
                }
                $scope.user.sex = setSex(true)
                $scope.user.imgPic = undefined;
                console.log($scope.user.imageid)
                userInfo.update($scope.user).then(function(res){     
                    if(res.data.msg == "success"){
                        userInfo.get();
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
            $scope.cities_list = tdist;
            $scope.loadData = false;
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
                {"id" :0,"name":'设计＋施工(半包)'},
                {"id" :1,"name":'设计＋施工(全包)'},
                {"id" :2,"name":'纯设计'}];
            $scope.communication_type = [
                {"id" :0,"name":'不限'},
                {"id" :1,"name":'表达型'},
                {"id" :2,"name":'倾听型'}
            ];
            $scope.dec_type = [
                {"id" :0,"name":'家装'},
                {"id" :1,"name":'商装'},
                {"id" :2,"name":'软装'}
            ];
            $scope.prefer_sex = [
                {"id" :0,"name":'男'},
                {"id" :1,"name":'女'},
                {"id" :2,"name":'不限'}
            ];
            $scope.family_description = [
                {"name":'单身'},
                {"name":'两个人'},
                {"name":'三个人'},
                {"name":'四个人'}
            ];
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
                }
            ]
            if($stateParams.id == undefined){        //发布新需求
                $scope.requiremtne = {};
                $scope.requiremtne.dec_type = '0';
                $scope.requiremtne.dec_style = '0';
                $scope.requiremtne.house_type = '0';
                $scope.requiremtne.work_type = '0';
                $scope.requiremtne.communication_type = '0';
                $scope.requiremtne.prefer_sex = '2';
                $scope.requiremtne.family_description = $scope.family_description[0].name;
                userInfo.get().then(function(res){  //获取个人资料
                    $scope.user = res.data.data;
                    if(!!$scope.user.province){
                        $scope.requiremtne.province = $scope.user.province;
                        $scope.requiremtne.city = $scope.user.city;
                        $scope.requiremtne.district = $scope.user.district;
                    }else{
                        $scope.requiremtne.province = '请选择省份';
                        $scope.requiremtne.city = '请选择市';
                        $scope.requiremtne.district = '请选择县/区';
                    }
                },function(res){
                    console.log(res)
                });
                $scope.release = {
                    motaiDone : false,
                    requirementid : '',
                    submitBtn : function(){
                        if($scope.requiremtne.province != "湖北省" && $scope.requiremtne.city != "武汉市"){
                            alert('您选择装修城市不是湖北省武汉市，请重新选择')
                            return ;
                        }
                        userRequiremtne.add($scope.requiremtne).then(function(res){  //提交新需求
                            if(res.data.data.requirementid){
                                $scope.release.requirementid = res.data.data.requirementid;
                                $scope.release.motaiDone = true;
                            }
                        },function(res){
                            console.log(res)
                        }); 
                    },
                    submitDefineBtn : function(){
                        $scope.release.motaiDone = false;
                        $location.path('requirement/'+$scope.release.requirementid+"/booking");
                    }
                }
            }else{   //修改某条需求
                userRequiremtne.get({'_id':$stateParams.id}).then(function(res){  //获取个人资料
                    $scope.requiremtne = res.data.data;
                    $scope.requiremtne.dec_style = $scope.requiremtne.dec_style ? $scope.requiremtne.dec_style : "0";
                    $scope.requiremtne.province = !$scope.requiremtne.province ? '湖北省' : $scope.requiremtne.province;
                    $scope.loadData = true;
                },function(res){
                    console.log(res)
                });
                $scope.revise = {
                    motaiDone : false,
                    changeBtn : function(){
                        if($scope.requiremtne.province != "湖北省" && $scope.requiremtne.city != "武汉市"){
                            alert('您选择装修城市不是湖北省武汉市，请重新选择')
                            return ;
                        }
                        userRequiremtne.update($scope.requiremtne).then(function(res){  //修改需求
                            if(res.data.msg == "success"){
                                $scope.revise.motaiDone = true;
                            }
                        },function(res){
                            console.log(res)
                        });
                    },
                    changeDefineBtn : function(){
                        $scope.revise.motaiDone = false;
                        $location.path('requirement/'+$stateParams.id+"/booking");
                    }
                }
            }
    }])
    .controller('requirementListCtrl', [     //装修需求列表
        '$scope','$rootScope','$filter','$location','$stateParams',
        function($scope, $rootScope,$filter,$location,$stateParams){
            var statusUrl = {
                "0":"booking",
                "1":"booking",
                "2":"score",
                "3":"plan",
                "4":"contract",
                "5":"contract",
                "6":"plan",
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
                    myBooking()
                    console.log('预约量房')
                }
                if(data.status == 6 || data.status == 3 || data.status == 7 || data.status == 4 || data.status == 5){  //选择方案
                    myPlan()
                    console.log('选择方案')
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
            var statusUrl = {
                "0":"booking",
                "1":"booking",
                "2":"score",
                "3":"plan",
                "4":"contract",
                "5":"contract",
                "6":"plan",
                "7":"contract"               
            }
            $scope.goTo = function(id,status){
                $location.path('requirement/'+id+"/"+statusUrl[status]);
            }
            var weeksData = {"Monday":"星期一","Tuesday":"星期二","Wednesday":"星期三","Thursday":"星期四","Friday":"星期五","Saturday":"星期六","Sunday":"星期日"};
            function myBooking(){
                userRequiremtne.designers({"requirementid":requiremtneId}).then(function(res){    //可以预约设计师列表
                        // 匹配的设计师
                        $scope.matchs = res.data.data.rec_designer;
                        angular.forEach($scope.matchs, function(value, key){
                            value.active = false;
                        })
                        // 自选的设计师
                        $scope.favorites = res.data.data.favorite_designer;
                        angular.forEach($scope.favorites, function(value, key){
                            value.active = false;
                        })
                        $scope.orderDesigns = [];
                        userRequiremtne.order({"requirementid":requiremtneId}).then(function(res){    //已经预约设计师列表
                                $scope.ordersData = res.data.data;
                                angular.forEach($scope.ordersData, function(value, key){
                                    if(value.plan.house_check_time){
                                        var dates = $filter('date')(value.plan.house_check_time , 'yyyy年MM月dd日'),
                                        days = $filter('date')(value.plan.house_check_time , 'a') == 'AM' ? '上午' : '下午',
                                        weeks = weeksData[$filter('date')(value.plan.house_check_time , 'EEEE')],
                                        times = $filter('date')(value.plan.house_check_time , 'hh:mm');
                                        value.house_check_time = dates + days + times + ' ( '+ weeks + ' )';
                                    }
                                })
                                angular.forEach($scope.matchs, function(value1, key1){
                                    angular.forEach($scope.ordersData, function(value2, key2){
                                        if(value1._id == value2._id){
                                            value1.active = true;
                                        }else{
                                            value1.active = false;
                                        }
                                    })
                                })
                                angular.forEach($scope.ordersData, function(value2, key2){
                                    angular.forEach($scope.matchs, function(value1, key1){
                                        if(value1._id == value2._id){
                                            value1.active = true;
                                        }
                                    })
                                    angular.forEach($scope.favorites, function(value1, key1){
                                        if(value1._id == value2._id){
                                            value1.active = true;
                                        }
                                    })
                                })
                                $scope.bookingSuccess = $scope.ordersData.length < 3 ? true : false; 
                                // 点击设计师
                                $scope.selectDesignOff = false;
                                $scope.selectDesign = function(data){
                                    if($scope.ordersData.length > 2){
                                        return ;
                                    }
                                    angular.forEach($scope.ordersData, function(value, key){
                                        if(value._id == data._id){
                                            $scope.selectDesignOff = true;
                                            return false;
                                        }
                                    })
                                    if($scope.selectDesignOff){
                                        return ;
                                    }
                                    if(!data.active){
                                        if($scope.orderDesigns.length > 2){
                                            alert('您已经预约了3名设计师');
                                            return ;
                                        }
                                        data.active = true;
                                        $scope.orderDesigns.push(data._id)
                                    }else{
                                        data.active = false;
                                        var index = _.indexOf($scope.orderDesigns,data._id);
                                        $scope.orderDesigns.splice(index, 1);
                                    }
                                }
                            },function(res){
                                console.log(res)
                        });
                    },function(res){
                        console.log(res)
                });
            }
            //预约量房
            $scope.booking = {
                motaiDone : false,
                bookingCancelBtn : function(){
                    myBooking()
                    $scope.booking.motaiDone = false;
                    $location.path('requirement/'+requiremtneId+"/score");
                },
                bookingBtn : function(){   
                    if(!$scope.orderDesigns.length){
                        alert('您至少要预约1名设计师');
                        return ;
                    }
                    userRequiremtne.booking({
                      "requirementid":requiremtneId,
                      "designerids":$scope.orderDesigns
                    }).then(function(res){
                        console.log(res.data)
                        if(res.data.msg == "success"){
                            $scope.booking.motaiDone = true;
                            uploadParent()
                        }
                    },function(res){
                        console.log(res)
                    });
                }
            }
            //匿名评价
            var scoreEvent = {
                over : function(arr,i){

                },
                out : function(arr,i){

                },
                click : function(arr,i){
                    angular.forEach(arr, function(value, key){
                        if(key+1 <= i){
                            value.cur = 'active'
                        }else{
                            value.cur = '';
                        }
                    })
                }
            }
            $scope.score = {
                designerScore : {},
                scoreComment : '',
                scoreRespond : '0',
                scoreService : '0',
                scoreResponds : [{'id':"1",'cur':''},{'id':"2",'cur':''},{'id':"3",'cur':''},{'id':"4",'cur':''},{'id':"5",'cur':''}],
                scoreServices : [{'id':"1",'cur':''},{'id':"2",'cur':''},{'id':"3",'cur':''},{'id':"4",'cur':''},{'id':"5",'cur':''}],
                respondBtn : function(i){
                    $scope.score.scoreRespond = i;
                    scoreEvent.click($scope.score.scoreResponds,i)
                },
                serviceBtn : function(i){
                    $scope.score.scoreService = i;
                    scoreEvent.click($scope.score.scoreServices,i)
                },
                motaiScore : false,
                anonymity : false,
                motaiDone : false,
                anonymityBtn : function(){   //匿名评价
                    $scope.score.anonymity = !$scope.score.anonymity
                },
                scoreCancelBtn : function(){   //取消评价
                    $scope.score.motaiScore = false;
                },
                scoreSubmitBtn : function(){    //提交评价
                    userRequiremtne.score({
                      "requirementid": requiremtneId,
                      "designerid" :$scope.score.designerScore._id,
                      "service_attitude":$scope.score.scoreService,
                      "respond_speed":$scope.score.scoreRespond,
                      "comment":$scope.score.scoreComment,
                      "is_anonymous": $scope.score.anonymity ? "1" : "0"
                    }).then(function(res){
                        console.log(res.data)
                        if(res.data.msg == "success"){
                            uploadParent();
                            myBooking();
                            myPlan()
                            $scope.score.motaiScore = false;
                            $location.path('requirement/'+requiremtneId+"/plan");
                        }
                    },function(res){
                        console.log(res)
                    });
                },
                scoreDefineBtn : function(data){    //开启评价
                    $scope.score.motaiDone = false;
                    $scope.score.motaiScore = true;
                },
                confirmBtn : function(data){  //确认量房
                    userRequiremtne.checked({
                      "requirementid":requiremtneId,
                      "designerid":data._id
                    }).then(function(res){
                        console.log(res.data)
                        if(res.data.msg == "success"){
                            uploadParent();
                            myBooking();
                            $scope.score.motaiDone = true;
                            $scope.score.designerScore = data;
                        }
                    },function(res){
                        console.log(res)
                    });
                },
                scoreBtn : function(data){  
                    $scope.score.motaiScore = true;
                    $scope.score.designerScore = data;
                }
            }
        // 方案列表
        function myPlan(){
            userRequiremtne.plans({"requirementid":requiremtneId}).then(function(res){    //获取我的方案列表
                $scope.plans = res.data.data;
            },function(res){
                console.log(res)
            });
        }
        $scope.definePlan = function(pid,uid){   //确定方案
            userRequiremtne.define({
              "planid": pid,
              "designerid": uid,
              "requirementid": requiremtneId
            }).then(function(res){    
                if(res.data.msg == "success"){
                    alert('您已经选定方案，等候设计师生成合同')
                    myPlan()   //更新方案列表
                    uploadParent()   //更新需求状态
                }
            },function(res){
                console.log(res)
            });
        }
        // 三方合同
        function myContract(){   //获取我的第三方合同
            userRequiremtne.contract({"requirementid":requiremtneId}).then(function(res){    
                $scope.contract = res.data.data;
            },function(res){
                console.log(res)
            });
        }
    }])
   .controller('favoriteProductCtrl', [     //作品收藏列表
        '$scope','$rootScope','$http','$filter','$location','userFavoriteProduct',
        function($scope, $rootScope,$http,$filter,$location,userFavoriteProduct){
            function laod(){
                userFavoriteProduct.list({
                    "from": 0,
                    "limit":10000
                }).then(function(res){  //获取作品收藏列表
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
                userFavoriteDesigner.list({
                    "from": 0,
                    "limit":10000
                }).then(function(res){  //获取意向设计师列表
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