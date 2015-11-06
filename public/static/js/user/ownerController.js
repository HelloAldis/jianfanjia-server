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
                var designerReg = /designer\?p=/;
                var favoriteReg = /favorite\?p=/;
                $scope.location = $location;
                $scope.$watch( 'location.url()', function( url ){
                    if(url.split('/')[1] == 'requirement'){
                        $scope.nav = 'requirementList'
                    }else if(url.split('/')[1] == 'revise'){
                        $scope.nav = 'requirementList'
                    }else if(url.split('/')[1] == 'requirementList' || url.split('/')[1] == 'index'){
                        requiremtne();
                        $scope.nav = url.split('/')[1];
                    }else if(favoriteReg.test(url.split('/')[1])){
                        $scope.nav = 'favorite'
                    }else if(designerReg.test(url.split('/')[1])){
                        $scope.nav = 'designer'
                    }else{
                       $scope.nav = url.split('/')[1];  
                    }
                });
            }
    ])
	.controller('indexCtrl', [     //业主首页
        '$scope','$rootScope','$http','$filter','$location','userInfo','userRequiremtne','userComment',
        function($scope, $rootScope,$http,$filter,$location,userInfo,userRequiremtne,userComment){
            $scope.commentShow = false;
        	userInfo.get().then(function(res){
        		$scope.user = res.data.data;
        	},function(res){
        		console.log(res)
        	});
            userComment.unread().then(function(res){
                $scope.messages = res.data.data;
                $scope.commentShow = $scope.messages.length != 0 ? true : false; 
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
        '$scope','$rootScope','$location','userInfo','initData',
        function($scope, $rootScope,$location,userInfo,initData){
            $scope.user = {
                province : '请选择省份',
                city : '请选择市',
                district : '请选择县/区',
                sex : "",
                email : "",
                address : "",
            };
            $scope.userInfo = {
                disabled : false,
                citiesList : initData.tdist,
                userSex : initData.userSex,
                isLoading : false
            };
            userInfo.get().then(function(res){  //获取个人资料
                if(res.data.data != null){
                    $scope.user = _.assign($scope.user, res.data.data);
                    $scope.userInfo.isLoading = true; 
                }
            },function(res){
                console.log(res)
            });
            $scope.userInfo.submit = function(){     //修改个人资料
                if(checkSupport() !== "html5"){
                    $('#fileToUpload').uploadify('destroy');
                }
                $scope.userInfo.disabled = true;
                userInfo.update($scope.user).then(function(res){     
                    if(res.data.msg == "success"){
                        $('#j-userLogin').find('a').eq(0).html('业主 '+$scope.user.username);
                        $location.path('index');
                    }
                },function(res){
                    console.log(res)
                })
            };
    }])
	.controller('releaseCtrl', [     //业主提交需求
        '$scope','$rootScope','$http','$filter','$location','$stateParams','userRequiremtne','userInfo','initData',
        function($scope, $rootScope,$http,$filter,$location,$stateParams,userRequiremtne,userInfo,initData){
            $scope.userRelease = {
                isRelease : $stateParams.id == undefined ? true : false,
                citiesList : initData.tdist,
                loadData : false,
                decStyle : initData.decStyle,
                houseType : initData.houseType,
                workType : initData.workType,
                communicationType : initData.communicationType,
                decType : initData.decType,
                preferSex : initData.designSex,
                familyDescription : initData.familyDescription,
                disabled : false,
                requirementid : this.isRelease ? "" : $stateParams.id,
                motaiDone : false,
                submitDefine : function(){
                    var This = this;
                    This.motaiDone = false;
                    $location.path('requirement/'+This.requirementid+"/booking");
                }
            }
            $scope.requiremtne = {
                dec_type : '0',
                dec_style : '0',
                house_type : '0',
                communication_type :'0',
                prefer_sex : '2',
                family_description : $scope.userRelease.familyDescription[0].name
            }     
            if($scope.userRelease.isRelease){        //发布新需求
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
            }else{   //修改某条需求
                userRequiremtne.get({'_id':$stateParams.id}).then(function(res){  //获取个人资料
                    if(res.data.data != null){
                        $scope.requiremtne = _.assign($scope.requiremtne, res.data.data);
                        $scope.userInfo.isLoading = true; 
                    }
                    $scope.loadData = true;
                },function(res){
                    console.log(res)
                });
            }
            $scope.userRelease.submit = function(){
                var This = this;
                if(!$scope.requiremtne.family_description){
                    alert('您的计划常住成员不能为空')
                    return ;
                }
                if($scope.requiremtne.province === "湖北省" && $scope.requiremtne.city === "武汉市"){
                    This.disabled = false;
                    if($scope.userRelease.isRelease){
                        userRequiremtne.add($scope.requiremtne).then(function(res){  //提交新需求
                            if(res.data.data.requirementid){
                                This.requirementid = res.data.data.requirementid;
                                This.motaiDone = true;
                                This.disabled = true;
                            }
                        },function(res){
                            console.log(res)
                        }); 
                    }else{
                        userRequiremtne.update($scope.requiremtne).then(function(res){  //修改需求
                            if(res.data.msg == "success"){
                                This.motaiDone = true;
                            }
                        },function(res){
                            console.log(res)
                        });
                    }
                }else{
                    alert('您选择装修城市不是湖北省武汉市，请重新选择')
                    return ;
                }
            }
    }])
    .controller('requirementListCtrl', [     //装修需求列表
        '$scope','$rootScope','$location','initData',
        function($scope, $rootScope,$location,initData){
            var statusUrl = initData.statusUrl;
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
            var bookingReg = /booking/;
            $scope.$watch( 'location.url()', function( url ){
                if(bookingReg.test(url.split('/')[3])){
                    $scope.tab = 'booking';
                }else{
                    $scope.tab = url.split('/')[3]
                }
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
        '$scope','$rootScope','$http','$filter','$location','$stateParams','userRequiremtne','initData',
        function($scope, $rootScope,$http,$filter,$location,$stateParams,userRequiremtne,initData){
            var requiremtneId = $stateParams.id;
            $scope.$on('requirementParent',function(event, data){    //子级接收 
                if(data.status == 0 || data.status == 1 || data.status == 2 || data.status == 3 || data.status == 4 || data.status == 5 || data.status == 6 || data.status == 7){  //预约量房、确认量房
                    myBooking()
                }
                if(data.status == 6 || data.status == 3 || data.status == 7 || data.status == 4 || data.status == 5){  //选择方案
                    myPlan()
                }
                if(data.status == 7 || data.status == 4 || data.status == 5){   //生成合同
                    myContract()
                }
            })
            function uploadParent(){    // 子级传递  如果业主操作就需要改变状态给父级传递信息
                userRequiremtne.get({"_id":$stateParams.id}).then(function(res){
                    $scope.$emit('requirementChildren', res.data.data);
                },function(res){
                    console.log(res)
                });
            }
            var statusUrl = initData.statusUrl;
            $scope.goTo = function(id,status){
                $location.path('requirement/'+id+"/"+statusUrl[status]);
            }
            var weeksData = initData.weeksData;
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
                                //检测是否可以点击
                                $scope.bookingSuccess = $scope.ordersData.length < 3 ? true : false; 
                                // 点击设计师
                                $scope.selectDesignOff = false;
                                $scope.location = $location;
                                $scope.$watch( 'location.url()', function( url ){
                                    if(url.split('/')[3].split("?")[1]){
                                        $scope.bookingSuccess = true;
                                    }
                                });
                                $scope.selectDesign = function(data){
                                    var len = $scope.ordersData.length;
                                    if($location.url().split('/')[3].split("?")[1]){
                                        data.active = true;
                                        $scope.booking.motaiDone = true;
                                        $scope.booking.isReplace = true;
                                        userRequiremtne.change({
                                          "requirementid":requiremtneId,
                                          "old_designerid":$location.url().split('/')[3].split("?")[1],
                                          "new_designerid":data._id
                                        }).then(function(res){    //更换设计师
                                            if(res.data.msg == "success"){
                                                $scope.booking.isReplace = false;
                                                $scope.ordersData = undefined;
                                            }
                                        },function(res){
                                            console.log(res)
                                        });
                                    }
                                    if(len > 2){
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
                                        if(($scope.orderDesigns.length+len) > 2){
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
                isReplace : false,
                motaiDone : false,
                bookingCancelBtn : function(){
                    if(!this.isReplace){
                        myBooking()
                        this.motaiDone = false;
                        $location.url('requirement/'+requiremtneId+"/score");
                    }                   
                },
                bookingBtn : function(){
                    var This = this;
                    if(!$scope.orderDesigns.length){
                        alert('您至少要预约1名设计师');
                        return ;
                    }
                    userRequiremtne.booking({
                      "requirementid":requiremtneId,
                      "designerids":$scope.orderDesigns
                    }).then(function(res){
                        if(res.data.msg == "success"){
                            This.motaiDone = true;
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
                scoreResponds : initData.score,
                scoreServices : initData.score,
                respondBtn : function(i){
                    var This = this; 
                    this.scoreRespond = i;
                    scoreEvent.click(This.scoreResponds,i)
                },
                serviceBtn : function(i){
                    var This = this; 
                    this.scoreService = i;
                    scoreEvent.click(This.scoreServices,i)
                },
                motaiScore : false,
                anonymity : false,
                motaiDone : false,
                anonymityBtn : function(){   //匿名评价
                    this.anonymity = !this.anonymity
                },
                scoreCancelBtn : function(){   //取消评价
                    $scope.score.motaiScore = false;
                },
                scoreSubmitBtn : function(){    //提交评价
                    var This = this; 
                    userRequiremtne.score({
                      "requirementid": requiremtneId,
                      "designerid" :This.designerScore._id,
                      "service_attitude":This.scoreService,
                      "respond_speed":This.scoreRespond,
                      "comment":This.scoreComment,
                      "is_anonymous": This.anonymity ? "1" : "0"
                    }).then(function(res){
                        if(res.data.msg == "success"){
                            uploadParent();
                            myBooking();
                            myPlan()
                            This.motaiScore = false;
                            $location.path('requirement/'+requiremtneId+"/plan");
                        }
                    },function(res){
                        console.log(res)
                    });
                },
                scoreDefineBtn : function(data){    //开启评价
                    this.motaiDone = false;
                    this.motaiScore = true;
                },
                confirmBtn : function(data){  //确认量房
                    var This = this; 
                    userRequiremtne.checked({
                      "requirementid":requiremtneId,
                      "designerid":data._id
                    }).then(function(res){
                        console.log(res.data)
                        if(res.data.msg == "success"){
                            uploadParent();
                            myBooking();
                            This.motaiDone = true;
                            This.designerScore = data;
                        }
                    },function(res){
                        console.log(res)
                    });
                },
                scoreBtn : function(data){  
                    this.motaiScore = true;
                    this.designerScore = data;
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
            var dataPage = {
                  "from": 0,
                  "limit":4
                },
                current = 0;
            window.onhashchange = function(){
                var url = parseInt($location.url().split('=')[1]);
                current = !isNaN(url) ? url - 1 : 0; 
                dataPage.from = current*dataPage.limit;
                $location.url('/favorite?p='+(current+1));
                $scope.favoriteProduct = undefined;
                laod();
            }
            function laod(){
                userFavoriteProduct.list(dataPage).then(function(res){  //获取作品收藏列表
                    $scope.favoriteProduct = res.data.data.products;
                    angular.forEach($scope.favoriteProduct, function(value, key){
                        value.house_type = $filter('houseTypeFilter')(value.house_type);
                        value.dec_style = $filter('decStyleFilter')(value.dec_style);
                        value.description = $filter('limitTo')(value.description,100);
                    })
                    if($scope.favoriteProduct.length == 0 && res.data.data.total != 0){
                        $scope.favoriteProduct = undefined;
                        dataPage.from = current*dataPage.limit;
                        current = 0;
                        laod();
                        $location.url('/favorite?p=1')
                    }
                    $scope.pageing = {
                        allNumPage : res.data.data.total,
                        itemPage : dataPage.limit,
                        showPageNum : 5,
                        endPageNum : 3,
                        currentPage : current,
                        linkTo:"#/favorite?p=__id__",
                        prevText:"上一页",
                        nextText:"下一页",
                        ellipseText:"...",
                        showUbwz : false,
                        pageInfo : false,
                        callback : function (i,obj) {
                            dataPage.from = i*this.itemPage;
                            laod();
                            current = i;
                            $location.url('/favorite?p='+(parseInt(i)+1))
                            return false;
                        }
                    }
                },function(res){
                    console.log(res)
                });
            }
            $scope.deleteFavorite = function(id){
                if(confirm('您确定要删除吗？')){
                    userFavoriteProduct.remove({'_id':id}).then(function(res){ 
                        if(res.data.msg === "success"){
                            $scope.favoriteProduct = undefined;
                            laod(); 
                        }
                    },function(res){
                        console.log(res)
                    });
                }
            }
            laod()
    }])
    .controller('favoriteDesignerCtrl', [     //意向设计师列表
        '$scope','$rootScope','$http','$filter','$location','userFavoriteDesigner',
        function($scope, $rootScope,$http,$filter,$location,userFavoriteDesigner){
            var dataPage = {
                  "from": 0,
                  "limit":10
                },
                current = 0;
            window.onhashchange = function(){
                var url = parseInt($location.url().split('=')[1]);
                current = !isNaN(url) ? url - 1 : 0; 
                dataPage.from = current*dataPage.limit;
                $location.url('/designer?p='+(current+1));
                $scope.designers = undefined;
                laod();
            }
            function laod(){
                userFavoriteDesigner.list(dataPage).then(function(res){  //获取意向设计师列表
                    $scope.designers = res.data.data.designers;
                    if($scope.designers.length == 0 && res.data.data.total != 0){
                        $scope.designers = undefined;
                        dataPage.from = current*dataPage.limit;
                        current = 0;
                        laod();
                        $location.url('/designer?p=1')
                    }
                    $scope.pageing = {
                        allNumPage : res.data.data.total,
                        itemPage : dataPage.limit,
                        showPageNum : 5,
                        endPageNum : 3,
                        currentPage : current,
                        linkTo:"#/designer?p=__id__",
                        prevText:"上一页",
                        nextText:"下一页",
                        ellipseText:"...",
                        showUbwz : false,
                        pageInfo : false,
                        callback : function (i,obj) {
                            dataPage.from = i*this.itemPage;
                            laod();
                            current = i;
                            $location.url('/designer?p='+(parseInt(i)+1))
                            return false;
                        }
                    }
                },function(res){
                    console.log(res)
                });
            }
            $scope.cancelBtn = function(id){
                if(confirm('您确定要删除吗？')){
                    userFavoriteDesigner.remove({'_id':id}).then(function(res){  //获取意向设计师列表
                        if(res.data.msg === "success"){
                            $scope.designers = undefined;
                            laod(); 
                        }
                    },function(res){
                        console.log(res)
                    });
                }
            }
            laod()
    }])