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
                    userRequiremtne.list().then(function(res){
                        $scope.requiremtnes = res.data.data.length < 3 ? true : false;
                    },function(res){
                        console.log(res)
                    });
                });
                
            }
    ])
	.controller('indexCtrl', [     //业主首页
        '$scope','$rootScope','$http','$filter','$location','userInfo','userRequiremtne','userComment',
        function($scope, $rootScope,$http,$filter,$location,userInfo,userRequiremtne,userComment) {
            $scope.userAreaOff = false;
        	userInfo.get().then(function(res){
        		console.log(res.data.data)
        		$scope.user = res.data.data;
                $scope.userAreaOff = $scope.user.province == '请选择省份' ? false : true;
                $scope.user.imgPic = !$scope.user.imageid ? '../../../static/img/user/headPic.png' : RootUrl+'api/v2/web/thumbnail/120/'+$scope.user.imageid;
        	},function(res){
        		console.log(res)
        	});
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
            if($stateParams.id == undefined){        //发布新需求
                $scope.requiremtne = {};
                $scope.requiremtne.dec_style = '0';
                $scope.requiremtne.house_type = '0';
                $scope.requiremtne.work_type = '0';
                $scope.requiremtne.communication_type = '0';
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
                $scope.submitBtn = function(){
                    if($scope.requiremtne.province != "湖北省" && $scope.requiremtne.city != "武汉市"){
                        alert('您选择装修城市不是湖北省武汉市，请重新选择')
                        return ;
                    }
                    if(confirm("你确定修改了吗")){
                        userRequiremtne.add($scope.requiremtne).then(function(res){  //提交新需求
                            if(res.data.data.requirementid){
                                alert('提交需求成功前往预约设计师量房');
                                $location.path('requirement/'+res.data.data.requirementid+"/booking");
                            }
                        },function(res){
                            console.log(res)
                        });
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
                $scope.submitBtn = function(){
                    if($scope.requiremtne.province != "湖北省" && $scope.requiremtne.city != "武汉市"){
                        alert('您选择装修城市不是湖北省武汉市，请重新选择')
                        return ;
                    }
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
                                url : "requirement.booking",
                                name : "预约量房",
                                cur : ''
                            },
                            {
                                url : "requirement.score",
                                name : "确认量房",
                                cur : ''
                            },
                            {
                                url : "requirement.plan",
                                name : "选择方案",
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
                                "booking" : "预约量房",
                                "score" : "确认量房",
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
            userRequiremtne.get({"_id":requiremtneId}).then(function(res){
                    $scope.requirement = res.data.data;
                    console.log(res.data.data)
                    detail(res.data.data) //需求描述
                },function(res){
                    console.log(res)
            });
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
            }
            userRequiremtne.designers({"_id":requiremtneId}).then(function(res){    //可以预约设计师列表
                    // 匹配的设计师
                    $scope.matchs = res.data.data.rec_designer;
                    angular.forEach($scope.matchs, function(value, key){
                        value.imageSrc = value.imageid ? RootUrl+'api/v2/web/image/'+value.imageid : '../../static/img/user/headPic.png';
                        value.active = false;
                    })
                    // 自选的设计师
                    $scope.favorites = res.data.data.favorite_designer;
                    angular.forEach($scope.favorites, function(value, key){
                        value.imageSrc = value.imageid ? RootUrl+'api/v2/web/image/'+value.imageid : '../../static/img/user/headPic.png';
                        value.active = false;
                    })
                    $scope.orderDesigns = [];
                    var weeksData = {"Monday":"星期一","Tuesday":"星期二","Wednesday":"星期三","Thursday":"星期四","Friday":"星期五","Saturday":"星期六","Sunday":"星期日"};
                    userRequiremtne.order({"requirementid":requiremtneId}).then(function(res){    //已经预约设计师列表
                            $scope.orders = res.data.data;
                            angular.forEach($scope.orders, function(value, key){
                                value.imageSrc = value.imageid ? RootUrl+'api/v2/web/image/'+value.imageid : '../../static/img/user/headPic.png';
                                value.confirmSuccess = value.plan.status === "2" ? true : false;
                                value.scoreSuccess = value.plan.status === "6" ? true : false;
                                if(value.plan.house_check_time){
                                    var dates = $filter('date')(value.plan.house_check_time , 'yyyy年MM月dd日'),
                                    days = $filter('date')(value.plan.house_check_time , 'a') == 'AM' ? '上午' : '下午',
                                    weeks = weeksData[$filter('date')(value.plan.house_check_time , 'EEEE')],
                                    times = $filter('date')(value.plan.house_check_time , 'hh:mm');
                                    value.house_check_time = dates + days + times + ' ( '+ weeks + ' )';
                                }
                            })
                            angular.forEach($scope.matchs, function(value1, key1){
                                angular.forEach($scope.orders, function(value2, key2){
                                    if(value1._id == value2._id){
                                        value1.active = true;
                                    }else{
                                        value1.active = false;
                                    }
                                })
                            })
                            angular.forEach($scope.orders, function(value2, key2){
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
                            $scope.bookingSuccess = $scope.orders.length < 3 ? true : false; 
                            // 点击设计师
                            $scope.selectDesignOff = false;
                            $scope.selectDesign = function(data){
                                if($scope.orders.length > 2){
                                    return ;
                                }
                                angular.forEach($scope.orders, function(value, key){
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
                                    console.log(data._id)
                                    $scope.orderDesigns.push(data._id)
                                    console.log($scope.orderDesigns)
                                }else{
                                    data.active = false;
                                    var index = _.indexOf($scope.orderDesigns,data._id);
                                    $scope.orderDesigns.splice(index, 1);
                                    console.log($scope.orderDesigns)
                                }
                            }
                        },function(res){
                            console.log(res)
                    });
                },function(res){
                    console.log(res)
            });
            //预约量房
            $scope.bookingBtn = function(){
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
                        alert('预约成功,等待设计师响应并上门量房,确定设计师上门量房');
                        $location.path('requirement/'+requiremtneId+"/score");
                    }
                },function(res){
                    console.log(res)
                });
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
                anonymityBtn : function(){
                    $scope.score.anonymity = !$scope.score.anonymity
                },
                scoreCancelBtn : function(){
                    $scope.score.motaiScore = false;
                },
                scoreSubmitBtn : function(){
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
                            $scope.score.motaiScore = false;
                            
                        }
                    },function(res){
                        console.log(res)
                    });
                }
            }
            //确认量房
            $scope.confirmBtn = function(data){
                userRequiremtne.checked({
                  "requirementid":requiremtneId,
                  "designerid":data._id
                }).then(function(res){
                    console.log(res.data)
                    if(res.data.msg == "success"){
                        alert('确认成功，给本次服务评价设计师');
                        $scope.confirmSuccess = true;
                        $scope.score.motaiScore = true;
                        $scope.score.designerScore = data;
                    }
                },function(res){
                    console.log(res)
                });
            }
            $scope.scoreBtn = function(data){
                $scope.score.motaiScore = true;
                $scope.score.designerScore = data;
            }
        userRequiremtne.plans({"requirementid":requiremtneId}).then(function(res){    //获取我的方案列表
            $scope.plans = res.data.data;
            angular.forEach($scope.plans, function(value, key){
                value.imageSrc = value.designer.imageid ? RootUrl+'api/v2/web/image/'+value.designer.imageid : '../../static/img/user/headPic.png';
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
        $scope.definePlan = function(pid,uid){   //确定方案
            userRequiremtne.define({
              "planid": pid,
              "designerid": uid,
              "requirementid": requiremtneId
            }).then(function(res){    
                if(res.data.msg == "success"){
                    alert('您已经选定方案，等候设计师生成合同')
                }
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
