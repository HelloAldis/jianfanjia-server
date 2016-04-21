"use strict";
angular.module('controllers', [])
    .controller('appController', ['$scope','$rootScope','userMessage',
        function($scope, $rootScope ,userMessage){
            $scope.count = {};
            userMessage.count({
                "query_array":[["4"], ["7", "8","13","9","10"],["5"]]
            }).then(function(res){
                $scope.count.notice = res.data.data[0];
                $scope.count.remind = res.data.data[1];
                $scope.count.comment = res.data.data[2];
                $scope.$broadcast('userMessageParent', $scope.count);   //父级传递
            },function(err){
                console.log(err);
            });
            $scope.$on('userMessageChildren', function(event, data) {   //父级接收 如果业主操作就需要改变状态
                $scope.count = data;
            });
    }])
	.controller('SubController', [    //左侧高亮按钮
            '$scope','$rootScope','$location','$filter','userRequiremtne','userMessage',
            function($scope, $rootScope ,$location,$filter,userRequiremtne,userMessage) {
                //全局需求列表
                $scope.location = $location;
                $scope.$watch( 'location.url()', function( url ){
                    if(url.split('/')[1] == 'requirementList' || url.split('/')[1] == 'index'){
                        requiremtne();
                    }
                });
                requiremtne();
                function requiremtne(){
                   userRequiremtne.list().then(function(res){
                        $rootScope.requirementList = res.data.data;
                        angular.forEach($rootScope.requirementList, function(value, key){
                            value.dec_type = $filter('decTypeFilter')(value.dec_type);
                            value.dec_style = $filter('decStyleFilter')(value.dec_style);
                            value.work_type = $filter('workTypeFilter')(value.work_type);
                            value.house_type = $filter('houseTypeFilter')(value.house_type);
                        });
                    },function(res){
                        console.log(res);
                    });
                }
            }
    ])
	.controller('indexCtrl', [     //业主首页
        '$scope','$rootScope','$http','$filter','$location','userInfo','userRequiremtne',
        function($scope, $rootScope,$http,$filter,$location,userInfo,userRequiremtne){
            if(userInfo.storage){
                userInfo.get().then(function(res){
                    $scope.user = res.data.data;
                    userInfo.save(res.data.data);
                },function(err){
                    console.log(err);
                });
            }else{
                $scope.user = userInfo.pull;
            }
    }])
    .controller('inforCtrl', [     //业主资料
        '$scope','$rootScope','$state','userInfo','initData',
        function($scope, $rootScope,$state,userInfo,initData){
            $scope.user = {
                province : '请选择省份',
                city : '请选择市',
                district : '请选择县/区',
                sex : "",
                email : "",
                address : ""
            };
            $scope.userInfo = {
                disabled : false,
                citiesList : initData.tdist,
                userSex : initData.userSex,
                isLoading : false
            };
            if(userInfo.storage){    //获取个人资料
                userInfo.get().then(function(res){
                    if(res.data.data !== null){
                        $scope.user = _.assign($scope.user, res.data.data);
                        $scope.userInfo.isLoading = true;
                        userInfo.save(res.data.data);
                    }
                },function(err){
                    console.log(err);
                });
            }else{
                $scope.user = userInfo.pull;
                $scope.userInfo.isLoading = true;
            }
            $scope.userInfo.submit = function(){     //修改个人资料
                if(checkSupport() !== "html5"){
                    $('#fileToUpload').uploadify('destroy');
                }
                $scope.userInfo.disabled = true;
                userInfo.update($scope.user).then(function(res){
                    if(res.data.msg == "success"){
                        userInfo.save($scope.user);
                        user.updateInfo();
                        $state.go('index');
                    }
                },function(err){
                    console.log(err);
                });
            };
    }])
    .controller('phoneCtrl', [     //绑定手机号码
        '$scope','$rootScope','$state','$stateParams','$interval','userRequiremtne',
        function($scope, $rootScope,$state,$stateParams,$interval,userRequiremtne){
            $scope.user = {
                "phone":undefined,
                "code":undefined
            };
            $scope.phone = {
                phoneMsg : "手机号码不正确",
                disabled : false,
                codeValue : '获取验证码',
                verifyCodeOff : true,
                verifyPhoneOff : false,
                isMobile : function(mobile){
                    return /^(13[0-9]{9}|15[012356789][0-9]{8}|18[0123456789][0-9]{8}|147[0-9]{8}|170[0-9]{8}|177[0-9]{8})$/.test(mobile);
                },
                isVerifyCode : function(str){
                    return (/^[\d]{6}$/.test(str));
                },
                verifyphone : function(phone){
                    var _this = this;
                    if(this.isMobile(phone)){
                        userRequiremtne.verify({'phone':phone}).then(function(res){  //提交手机
                            if(res.data.msg === "success"){
                                _this.phoneMsg = "";
                                _this.verifyPhoneOff = true;
                            }else{
                                _this.phoneMsg = res.data.msg;
                            }
                        },function(res){
                            console.log(res)
                        });
                    }
                },
                verifycode : function(code){
                    var _this = this;
                    if(!this.isVerifyCode(code)){
                        this.codeMsg = '验证码不正确';
                    }
                },
                pullcode : function(phone){
                    var _this = this;
                    if(_this.verifyCodeOff && _this.verifyPhoneOff){
                        _this.verifyCodeOff = false;
                        countdown();
                        userRequiremtne.code({'phone':phone}).then(function(res){  //提交手机
                            console.log(res)
                           //$location.path('release');
                        },function(err){
                            console.log(err);
                        });
                    }
                    function countdown(num){
                        var count = num || 60;
                        var timer = null;
                        $interval.cancel(timer);
                        timer = $interval(function(){
                            if(count <= 0){
                                $interval.cancel(timer);
                                count = num;
                                _this.verifyCodeOff = true;
                                _this.codeValue = '重新获取';
                            }else{
                               count--;
                                _this.codeValue = count+'s后重新获取';
                            }
                        }, 1000);
                    }
                },
                submit : function(){
                    userRequiremtne.phone($scope.user).then(function(res){  //提交手机
                        if(res.data.msg === "success"){
                            $state.go('release');
                        }
                    },function(res){
                        console.log(res)
                    })
                }
            }
    }])
	.controller('releaseCtrl', [     //业主提交需求
        '$scope','$rootScope','$timeout','$filter','$state','$stateParams','userRequiremtne','userInfo','initData',
        function($scope, $rootScope,$timeout,$filter,$state,$stateParams,userRequiremtne,userInfo,initData){
            var timer = null;
            $scope.userRelease = {
                isRelease : $stateParams.id == undefined ? true : false,
                releaseValue : $stateParams.id == undefined ? '  提交  ' : '  修改  ',
                citiesList : initData.tdist,
                loadData : false,
                decStyle : initData.decStyle,
                houseType : initData.houseType,
                workType : initData.workType,
                businessType : initData.businessHouseType,
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
                    $state.go('requirement.booking',{id:This.requirementid});
                },
                costserror : false,
                costsbasis : 0,
                costsdiy : 0,
                coststotal : 0
            }
            $scope.requiremtne = {
                package_type : '0',
                business_house_type : '0',
                dec_type : '0',
                work_type : '0',
                dec_style : '0',
                house_type : '0',
                communication_type :'0',
                prefer_sex : '2',
                family_description : $scope.userRelease.familyDescription[0]
            }
            function setAddress(data){
                if(!!data.province){
                    $scope.requiremtne.province = data.province === '湖北省' ? data.province : '湖北省';
                    $scope.requiremtne.city = data.city === '武汉市' ? data.city : '武汉市';
                    $scope.requiremtne.district = data.province === '湖北省' && data.city === '武汉市' ? data.district : '江岸区';
                }else{
                    $scope.requiremtne.province = '湖北省';
                    $scope.requiremtne.city = '武汉市';
                    $scope.requiremtne.district = '江岸区';
                }
                if(data.phone == undefined){
                    $state.go('phone');
                }
            }
            $scope.$watch('requiremtne.house_area',function(newValue){
                if(!!newValue && !/[^0-9.]/.test(newValue) && (newValue >= 80 && newValue <= 120) && ($scope.requiremtne.work_type == 0 || $scope.requiremtne.work_type == 1)){
                    $scope.userRelease.costsbasis = parseFloat($filter('number')(newValue*365/10000, 2));
                    if($scope.userRelease.coststotal >= $scope.userRelease.costsbasis){
                        $scope.userRelease.costsdiy = parseFloat($filter('number')($scope.userRelease.coststotal - $scope.userRelease.costsbasis, 2));
                    }else{
                        $scope.userRelease.costsdiy = 0;
                    }
                }else{
                    $scope.userRelease.costsbasis = 0;
                    $scope.userRelease.costsdiy = 0;
                }
            });
            $scope.$watch('requiremtne.work_type',function(newValue){
                if((newValue == 0 || newValue == 1) && ($scope.requiremtne.house_area >= 80 && $scope.requiremtne.house_area <= 120)){
                    $scope.userRelease.costsbasis = !!$scope.requiremtne.house_area ? parseFloat($filter('number')($scope.requiremtne.house_area*365/10000, 2)) : 0;
                    $scope.userRelease.coststotal = !!$scope.requiremtne.total_price ? parseFloat($filter('number')($scope.requiremtne.total_price, 2)) : 0;
                    if($scope.userRelease.coststotal >= $scope.userRelease.costsbasis){
                        $scope.userRelease.costserror = false;
                        $scope.userRelease.costsdiy = parseFloat($filter('number')($scope.userRelease.coststotal - $scope.userRelease.costsbasis, 2));
                    }else{
                        $scope.userRelease.costserror = true;
                        $scope.userRelease.costsdiy = 0;
                    }
                }else{
                    $scope.userRelease.coststotal = 0;
                    $scope.userRelease.costsdiy = 0;
                }
                if(newValue == 2){
                    $scope.userRelease.costsbasis = 0;
                    $scope.userRelease.coststotal = 0;
                    $scope.userRelease.costsdiy = 0;
                }
            });
            $scope.$watch('requiremtne.total_price',function(newValue){
                if(!!newValue && !/[^0-9.]/.test(newValue) && ($scope.requiremtne.house_area >= 80 && $scope.requiremtne.house_area <= 120) && ($scope.requiremtne.work_type == 0 || $scope.requiremtne.work_type == 1)){
                    $scope.userRelease.coststotal = parseFloat($filter('number')(newValue, 2));
                    if($scope.userRelease.coststotal >= $scope.userRelease.costsbasis){
                        $scope.userRelease.costserror = false;
                        $scope.userRelease.costsdiy = parseFloat($filter('number')($scope.userRelease.coststotal - $scope.userRelease.costsbasis, 2));
                    }else{
                        $scope.userRelease.costserror = true;
                        $scope.userRelease.costsdiy = 0;
                    }
                }else{
                    $scope.userRelease.coststotal = 0;
                    $scope.userRelease.costsdiy = 0;
                }
            });
            if($scope.userRelease.isRelease){        //发布新需求
                if(userInfo.storage){    //获取个人资料
                    userInfo.get().then(function(res){
                        if(res.data.data !== null){
                            userInfo.save(res.data.data);
                            setAddress(res.data.data);
                        }
                    },function(err){
                        console.log(err);
                    });
                }else{
                    setAddress(userInfo.pull);
                }
            }else{   //修改某条需求
                userRequiremtne.get({'_id':$stateParams.id}).then(function(res){  //获取需求列表
                    if(res.data.data != null){
                        $scope.requiremtne = _.assign($scope.requiremtne, res.data.data);
                    }
                    $scope.loadData = true;
                },function(res){
                    console.log(res)
                });
            }
            $scope.userRelease.submit = function(type){
                var This = this;
                //家装
                if(type == 0){
                    $scope.requiremtne.street = undefined;
                    $scope.requiremtne.business_house_type = undefined;
                    if($scope.requiremtne.house_area >= 80 && $scope.requiremtne.house_area <= 120 && $scope.requiremtne.work_type != 2){
                        $scope.requiremtne.package_type = 1;
                    }
                }
                //商装
                if(type == 1){
                    $scope.requiremtne.house_type = undefined;
                    $scope.requiremtne.family_description = undefined;
                }
                $scope.requiremtne.dec_type = type+"";
                $scope.requiremtne.total_price = $scope.requiremtne.total_price*1;
                $scope.requiremtne.house_area = $scope.requiremtne.house_area*1;
                if($scope.requiremtne.province === "湖北省" && $scope.requiremtne.city === "武汉市"){
                    This.disabled = true;
                    if($scope.userRelease.isRelease){
                        userRequiremtne.add($scope.requiremtne).then(function(res){  //提交新需求
                            if(res.data.data.requirementid){
                                This.requirementid = res.data.data.requirementid;
                                This.motaiDone = true;
                                userRequiremtne.list();
                            }
                        },function(res){
                            console.log(res)
                        });
                    }else{
                        userRequiremtne.update($scope.requiremtne).then(function(res){  //修改需求
                            if(res.data.msg == "success"){
                                This.motaiDone = true;
                                userRequiremtne.list();
                            }
                        },function(res){
                            console.log(res)
                        });
                    }
                }else{
                    //清除定时器，防止重复开启，产生bug
                    $timeout.cancel(timer);
                    //弹出超过三个设计师提示信息
                    $scope.bookingPrompt = true;
                    //3s后提示信息消失
                    timer = $timeout(function(){
                        $scope.bookingPrompt = false;
                        $timeout.cancel(timer);
                    },3000);
                    return ;
                }
            }
    }])
    .controller('requirementListCtrl', [     //装修需求列表
        '$scope','$rootScope','$location','initData',
        function($scope, $rootScope,$location,initData){
            var statusUrl = initData.statusUrl;
            $scope.goTo = function(data){
                if(data.work_type == '纯设计' && data.status == 4){
                    $location.path('requirement/'+data._id+"/"+statusUrl[8]);
                }else{
                    $location.path('requirement/'+data._id+"/"+statusUrl[data.status]);
                }
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
        '$scope','$rootScope','$timeout','$filter','$location','$stateParams','$interval','userRequiremtne','initData',
        function($scope, $rootScope,$timeout,$filter,$location,$stateParams,$interval,userRequiremtne,initData){
            var requiremtneId = $stateParams.id;
            var timer = null;
            var timerScore = null;
            $scope.$on('requirementParent',function(event, data){    //子级接收
                if(data.status == 0 || data.status == 1 || data.status == 2 || data.status == 3 || data.status == 4 || data.status == 5 || data.status == 6 || data.status == 7 || data.status == 8){  //预约量房、确认量房
                    myBooking(data.status)
                    timerScore = $interval(function(){
                        $scope.score.newDate = +new Date();
                    },1000);
                }
                if(data.status == 8 || data.status == 6 || data.status == 3 || data.status == 7 || data.status == 4 || data.status == 5){  //选择方案
                    myPlan()
                }
                if((data.status == 8 || data.status == 7 || data.status == 4 || data.status == 5) && data.work_type != 2){   //生成合同
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
            var newDesignerid = undefined;
            function myBooking(status){
                userRequiremtne.designers({"requirementid":requiremtneId}).then(function(res){    //可以预约设计师列表
                        // 匹配的设计师
                        $scope.matchs = res.data.data.rec_designer;
                        angular.forEach($scope.matchs, function(value, key){
                            value.active = false;
                        });
                        // 自选的设计师
                        $scope.favorites = res.data.data.favorite_designer;
                        angular.forEach($scope.favorites, function(value, key){
                            value.active = false;
                        });
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
                                $scope.bookingSuccess = true;
                                if(status == 0 || status == 1 || status == 2 || status == 6 || status == 3){
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
                                    $scope.bookingSuccess = false;
                                    // 点击设计师
                                    $scope.selectDesignOff = false;
                                    $scope.selectDesign = function(data){
                                        var len = $scope.ordersData.length;
                                        if(userRequiremtne.changeUId){
                                            data.active = true;
                                            $scope.booking.motaiDoneb = true;
                                            $scope.booking.isReplace = true;
                                            newDesignerid = data._id;
                                            $scope.selectDesignOff = true;
                                        }
                                        $scope.bookingSuccess = (len > 1 || len < 4);
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
                                                //清除定时器，防止重复开启，产生bug
                                                $timeout.cancel(timer);
                                                //弹出超过三个设计师提示信息
                                                $scope.bookingPrompt = true;
                                                //3s后提示信息消失
                                                timer = $timeout(function(){
                                                    $scope.bookingPrompt = false;
                                                    $timeout.cancel(timer);
                                                },3000);
                                                return ;
                                            }
                                            data.active = true;
                                            $scope.orderDesigns.push(data._id)
                                        }else{
                                            data.active = false;
                                            var index = _.indexOf($scope.orderDesigns,data._id);
                                            $scope.orderDesigns.splice(index, 1);
                                            console.log($scope.orderDesigns.length)
                                            console.log($scope.orderDesigns.length+len)
                                            $scope.bookingSuccess = ($scope.orderDesigns.length+len) === 0 ? false : true;
                                        }
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
                isReplaceb : false,
                motaiDoneb : false,
                bookingChangeStatus : false,
                bookingCancelBtn : function(){
                    if(!this.isReplace){
                        myBooking()
                        this.motaiDone = false;
                        $location.url('requirement/'+requiremtneId+"/score");
                    }
                },
                bookingBtn : function(){
                    var This = this;
                    //被废弃，不要删除，以防万一，做一个保险
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
                },
                bookingChange : function(){
                    var This = this;
                    userRequiremtne.change({
                      "requirementid":requiremtneId,
                      "old_designerid":userRequiremtne.changeUId,
                      "new_designerid":newDesignerid
                    }).then(function(res){    //更换设计师
                        if(res.data.msg == "success"){
                            This.isReplace = false;
                            $scope.ordersData = undefined;
                            myBooking();
                            This.bookingChangeStatus = false;
                            This.motaiDoneb = false;
                            userRequiremtne.changeUId = "";
                            $scope.bookingSuccess = false;
                            $location.path('requirement/'+requiremtneId+"/score")
                        }
                    },function(err){
                        console.log(err);
                    });
                },
                bookingCancelChange : function(){
                    newDesignerid = undefined;
                    this.isReplaceb = false;
                    this.motaiDoneb = false;
                    angular.forEach($scope.matchs, function(value1, key1){
                        value1.active = false;
                    });
                    angular.forEach($scope.favorites, function(value1, key1){
                        value1.active = false;
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
                            value.cur = 'active';
                        }else{
                            value.cur = '';
                        }
                    });
                }
            };
            $scope.score = {
                newDate : +new Date(),
                designerScore : {},
                scoreComment : '',
                scoreRespond : '0',
                scoreService : '0',
                scoreResponds : initData.scorea,
                scoreServices : initData.scoreb,
                respondBtn : function(i){
                    var This = this;
                    this.scoreRespond = i;
                    scoreEvent.click(This.scoreResponds,i);
                },
                serviceBtn : function(i){
                    var This = this;
                    this.scoreService = i;
                    scoreEvent.click(This.scoreServices,i);
                },
                motaiScore : false,
                anonymity : false,
                motaiDone : false,
                anonymityBtn : function(){   //匿名评价
                    this.anonymity = !this.anonymity;
                },
                scoreCancelBtn : function(){   //取消评价
                    $scope.score.motaiScore = false;
                    this.clear();
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
                            myPlan();
                            This.motaiScore = false;
                            This.clear();
                            $location.path('requirement/'+requiremtneId+"/plan");
                        }
                    },function(err){
                        console.log(err);
                    });
                },
                scoreDefineBtn : function(data){    //开启评价
                    this.clear();
                    $interval.cancel(timerScore);
                    this.motaiDone = false;
                    this.motaiScore = true;
                },
                confirmBtn : function(data){  //确认量房
                    var This = this;
                    userRequiremtne.checked({
                      "requirementid":requiremtneId,
                      "designerid":data._id
                    }).then(function(res){
                        if(res.data.msg == "success"){
                            uploadParent();
                            myBooking();
                            This.motaiDone = true;
                            This.designerScore = data;
                        }
                    },function(err){
                        console.log(err);
                    });
                },
                scoreBtn : function(data){
                    this.clear();
                    this.motaiScore = true;
                    this.designerScore = data;
                },
                clear : function(){
                    var This = this;
                    This.scoreComment = '';
                    This.anonymity = false;
                    This.scoreRespond = "0";
                    This.scoreService = "0";
                    angular.forEach(initData.scorea, function(value){
                        value.cur = '';
                    });
                    angular.forEach(initData.scoreb, function(value){
                        value.cur = '';
                    });
                },
                bookingChange : function(id){
                    $scope.bookingSuccess = true;
                    $scope.booking.bookingChangeStatus = true;
                    userRequiremtne.changeUId = id;
                    $location.path('requirement/'+requiremtneId+"/booking");
                }
            };
        // 方案列表
        function myPlan(){
            userRequiremtne.plans({"requirementid":requiremtneId}).then(function(res){    //获取我的方案列表
                $scope.plans = res.data.data;
            },function(err){
                console.log(err);
            });
        }
        var planData = {
            "planid": '',
            "designerid": '',
            "requirementid": requiremtneId
        };
        $scope.definePlan = {
            success : false,
            confirm : true,
            done  : false,
            cancel : function(){
                this.success = false;
            },
            select : function(pid,uid){
                this.success = true;
                this.confirm = true;
                planData.planid = pid;
                planData.designerid = uid;
            },
            define : function(){   //确定方案
                var _this = this;
                userRequiremtne.define(planData).then(function(res){
                    if(res.data.msg == "success"){
                        _this.confirm = false;
                        _this.done = true;
                        myPlan();   //更新方案列表
                        uploadParent();   //更新需求状态
                    }
                },function(err){
                    console.log(err);
                });
            },
            goto : function(data){
                this.success = false;
                planData = {};
                if(data.work_type == 2){
                    $location.path('requirement/'+requiremtneId+"/fulfill");
                }
                if(data.work_type != 2){
                    $location.path('requirement/'+requiremtneId+"/contract");
                }
            }
        };
        // 三方合同
        function myContract(){   //获取我的第三方合同
            userRequiremtne.contract({"requirementid":requiremtneId}).then(function(res){
                $scope.contract = res.data.data;
            },function(err){
                console.log(err);
            });
        }
        $scope.contractSuccess = true;
        $scope.contractSuccessBtn = function(){
            $scope.contractSuccess = !$scope.contractSuccess;
        };
        $scope.contractBtn = function(data){
            userRequiremtne.process({
                "requirementid": data._id,
                "final_planid": data.plan._id
            }).then(function(res){
                uploadParent();   //更新需求状态
                $location.path('requirement/'+requiremtneId+"/field");
            },function(err){
                console.log(err);
            });
        };
    }])
    .controller('favoriteProductCtrl', [     //作品收藏列表
        '$scope','$state','$filter','userFavoriteProduct',function($scope,$state,$filter,userFavoriteProduct){
            $scope.designers = undefined;
            var _index = !isNaN(parseInt($state.params.id,10)) ? parseInt($state.params.id,10) - 1 : 0,
                dataPage = {
                  "from": _index*4,
                  "limit":4
                },
                current = _index;
            function laod(){
                userFavoriteProduct.list(dataPage).then(function(res){  //获取作品收藏列表
                    $scope.favoriteProduct = res.data.data.products;
                    if($scope.favoriteProduct.length === 0 && res.data.data.total !== 0){
                        $scope.favoriteProduct = undefined;
                        dataPage.from = current*dataPage.limit;
                        current = 0;
                        $state.go('favorite.list', { id: 1 });
                    }
                    angular.forEach($scope.favoriteProduct, function(value){
                        value.house_type = $filter('houseTypeFilter')(value.house_type);
                        value.dec_style = $filter('decStyleFilter')(value.dec_style);
                        value.description = $filter('limitTo')(value.description,100);
                    });
                    $scope.pageing = {
                        allNumPage : res.data.data.total,
                        itemPage : dataPage.limit,
                        showPageNum : 5,
                        endPageNum : 3,
                        currentPage : current,
                        linkTo:"#/favorite/__id__",
                        prevText:"上一页",
                        nextText:"下一页",
                        ellipseText:"...",
                        showUbwz : false,
                        pageInfo : false,
                        callback : function (i) {
                            dataPage.from = i*this.itemPage;
                            current = i;
                            $state.go('favorite.list', { id: parseInt(i,10)+1 });
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
        '$scope','$state','userFavoriteDesigner',function($scope,$state,userFavoriteDesigner){
            $scope.designers = undefined;
            var _index = !isNaN(parseInt($state.params.id,10)) ? parseInt($state.params.id,10) - 1 : 0,
                dataPage = {
                  "from": _index*5,
                  "limit":5
                },
                current = _index;
            function laod(){
                userFavoriteDesigner.list(dataPage).then(function(res){  //获取意向设计师列表
                    $scope.designers = res.data.data.designers;
                    if($scope.designers.length == 0 && res.data.data.total != 0){
                        $scope.designers = undefined;
                        dataPage.from = current*dataPage.limit;
                        current = 0;
                        $state.go('designer.list', { id: 1 });
                    }
                    $scope.pageing = {
                        allNumPage : res.data.data.total,
                        itemPage : dataPage.limit,
                        showPageNum : 5,
                        endPageNum : 3,
                        currentPage : current,
                        linkTo:"#/designer/__id__",
                        prevText:"上一页",
                        nextText:"下一页",
                        ellipseText:"...",
                        showUbwz : false,
                        pageInfo : false,
                        callback : function (i) {
                            dataPage.from = i*this.itemPage;
                            current = i;
                            $state.go('designer.list', { id: parseInt(i,10)+1 });
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
    .controller('noticeCtrl', [     //系统通知
        '$scope','$state',function($scope,$state){
            $scope.notice = {
                name : '',
                "arr" : "4-99",
                tab : [
                    {
                        id : 0,
                        name : '全部',
                        cur : true,
                        arr : "4-99"
                    },
                    {
                        id : 1,
                        name : '官方公告',
                        cur : false,
                        arr : "99"
                    },
                    {
                        id : 2,
                        name : '系统通知',
                        cur : false,
                        arr : "4"
                    }
                ],
                goto : function(id){
                    var _this = this;
                    angular.forEach(this.tab,function(v){
                        v.cur = false;
                        _this.tab[id].cur = true;
                        _this.name = _this.tab[id].name;
                        _this.arr = _this.tab[id].arr;
                    });
                }
            };
            angular.forEach($scope.notice.tab,function(v){
                if(v.arr == $state.params.type){
                    v.cur = true;
                }else{
                    v.cur = false;
                }
            });
        }])
    .controller('noticeListCtrl', [     //系统通知列表
        '$scope','$state','userMessage',function($scope,$state,userMessage){
            var _index = !isNaN(parseInt($state.params.id,10)) ? parseInt($state.params.id,10) - 1 : 0,
                message_type = ChangeArray($state.params.type),
                status = $state.params.status,
                dataPage = {
                    "query":{
                        "message_type":{
                            "$in" : message_type
                        },
                        "status": status
                    },
                    "from": _index*10,
                    "limit":10
                },
                current = _index,
                url = {
                    '4' : 'index'
                };
            $scope.noticeList = {
                "list" : undefined,
                read : function(id,status){
                    if(status == 0){
                        userMessage.read({
                            "messageid":id
                        }).then(function(){
                            uploadParent();
                        });
                    }
                },
                goto : function(data){
                    $state.go(url[data.message_type]);
                    if(data.status == 0){
                       this.read(data._id,data.status)
                    }
                },
                remove : function(id){
                    userMessage.remove({
                        "messageid":id
                    }).then(function(res){
                        laod();
                    },function(err){
                        console.log(err);
                    });
                }
            };
            function uploadParent(){    // 子级传递  如果业主操作就需要改变状态给父级传递信息
                userMessage.count({
                    "query_array":[["4"], ["7", "8","13","9","10"],["5"]]
                }).then(function(res){
                    $scope.count.notice = res.data.data[0];
                    $scope.count.remind = res.data.data[1];
                    $scope.count.comment = res.data.data[2];
                    $scope.$emit('userMessageParent', $scope.count);   //父级传递
                    user.updateData(); //更新右上角显示下拉菜单
                },function(err){
                    console.log(err)
                });
            }
            function ChangeArray(str){
                var arr = [];
                if(str.indexOf('-') != -1){
                    arr = str.split('-');
                }else{
                    arr.push(str);

                }
                return arr;
            }
            function laod(){
                userMessage.search(JSON.stringify(dataPage)).then(function(res){  //获取意向设计师列表
                    $scope.noticeList.list = res.data.data.list;
                    if($scope.noticeList.list.length == 0 && res.data.data.total != 0){
                        $scope.noticeList.list = undefined;
                        dataPage.from = current*dataPage.limit;
                        current = 0;
                        $state.go('notice.list.type', {id:1,type:$state.params.type,status:$state.params.status});
                    }
                    $scope.pageing = {
                        allNumPage : res.data.data.total,
                        itemPage : dataPage.limit,
                        showPageNum : 5,
                        endPageNum : 3,
                        currentPage : current,
                        linkTo:"#/notice/list/__id__",
                        prevText:"上一页",
                        nextText:"下一页",
                        ellipseText:"...",
                        showUbwz : false,
                        pageInfo : false,
                        callback : function (i) {
                            dataPage.from = i*this.itemPage;
                            current = i;
                            $state.go('notice.list.type', {id:parseInt(i)+1,type:$state.params.type,status:$state.params.status});
                            return false;
                        }
                    }
                },function(res){
                    console.log(res)
                });
            }
            laod();
        }])
    .controller('noticeDetailCtrl', [     //系统通知详情
            '$scope','$state','userMessage',function($scope,$state,userMessage){
            var _index = !isNaN(parseInt($state.params.id,10)) ? parseInt($state.params.id,10) - 1 : 0,
                message_type = ChangeArray($state.params.type),
                status = $state.params.status,
                dataPage = {
                    "query":{
                        "message_type":{
                            "$in" : message_type
                        },
                        "status": status
                    },
                    "from": _index*10,
                    "limit":10
                },
                current = _index;
            $scope.remindList = {
                "list" : undefined,
                read : function(id,status){
                    if(status == 0){
                        userMessage.read({
                            "messageid":id
                        }).then(function(){
                            uploadParent();
                        });
                    }
                }
            };
            function uploadParent(){    // 子级传递  如果业主操作就需要改变状态给父级传递信息
                userMessage.count({
                    "query_array":[["4"], ["7", "8","13","9","10"],["5"]]
                }).then(function(res){
                    $scope.count.notice = res.data.data[0];
                    $scope.count.remind = res.data.data[1];
                    $scope.count.comment = res.data.data[2];
                    $scope.$emit('userMessageParent', $scope.count);   //父级传递
                    user.updateData();
                },function(err){
                    console.log(err);
                });
            }
            function ChangeArray(str){
                var arr = [];
                if(str.indexOf('-') != -1){
                    arr = str.split('-');
                }else{
                    arr.push(str);
                }
                return arr;
            }
        }])
    .controller('remindCtrl', [     //需求提醒列表
        '$scope','$state','userMessage',function($scope,$state,userMessage){
            $scope.remind = {
                "name" : '',
                "arr" : "7-8-13-9-10",
                "tab" : [
                    {
                        "id" : 0,
                        "name" : '全部',
                        "cur" : false,
                        "arr" : "7-8-13-9-10"
                    },
                    {
                        "id" : 1,
                        "name" : '响应提醒',
                        "cur" : false,
                        "arr" : "7"
                    },
                    {
                        "id" : 2,
                        "name" : '拒绝提醒',
                        "cur" : false,
                        "arr" : "8"
                    },
                    {
                        "id" : 3,
                        "name" : '确认量房',
                        "cur" : false,
                        "arr" : "13"
                    },
                    {
                        "id" : 4,
                        "name" : '方案提醒',
                        "cur" : false,
                        "arr" : "9"
                    },
                    {
                        "id" : 5,
                        "name" : '合同提醒',
                        "cur" : false,
                        "arr" : "10"
                    }
                ],
                goto : function(id){
                    var _this = this;
                    angular.forEach(this.tab,function(v,k){
                        v.cur = false;
                        _this.tab[id].cur = true;
                        _this.name = _this.tab[id].name;
                        _this.arr = _this.tab[id].arr;
                    });
                }
            };
            angular.forEach($scope.remind.tab,function(v,k){
                if(v.arr == $state.params.type){
                    v.cur = true;
                }else{
                    v.cur = false;
                }
            });
        }])
    .controller('remindListCtrl', [     //需求提醒列表
        '$scope','$state','userMessage',function($scope,$state,userMessage){
            var _index = !isNaN(parseInt($state.params.id,10)) ? parseInt($state.params.id,10) - 1 : 0,
                message_type = ChangeArray($state.params.type),
                status = $state.params.status,
                dataPage = {
                    "query":{
                        "message_type":{
                            "$in" : message_type
                        },
                        "status": status
                    },
                    "from": _index*10,
                    "limit":10
                },
                current = _index;
            $scope.remindList = {
                "list" : undefined,
                read : function(id,status){
                    if(status == 0){
                        userMessage.read({
                            "messageid":id
                        });
                        uploadParent()
                    }
                }
            };
            function uploadParent(){    // 子级传递  如果业主操作就需要改变状态给父级传递信息
                userMessage.count({
                    "query_array":[["4"], ["7", "8","9","10","13"],["5"]]
                }).then(function(res){
                    $scope.count.notice = res.data.data[0];
                    $scope.count.remind = res.data.data[1];
                    $scope.count.comment = res.data.data[2];
                    $scope.$emit('userMessageParent', $scope.count);   //父级传递
                    user.updateData(); //更新右上角显示下拉菜单
                },function(err){
                    console.log(err)
                });
            }
            function ChangeArray(str){
                var arr = [];
                if(str.indexOf('-') != -1){
                    arr = str.split('-');
                }else{
                    arr.push(str);

                }
                return arr;
            }
            function laod(){
                userMessage.search(JSON.stringify(dataPage)).then(function(res){  //获取意向设计师列表
                    $scope.remindList.list = res.data.data.list;
                    if($scope.remindList.list.length == 0 && res.data.data.total != 0){
                        $scope.remindList.list = undefined;
                        dataPage.from = current*dataPage.limit;
                        current = 0;
                        $state.go('remind.list.type', {id:1,type:$state.params.type,status:$state.params.status});
                    }
                    $scope.pageing = {
                        allNumPage : res.data.data.total,
                        itemPage : dataPage.limit,
                        showPageNum : 5,
                        endPageNum : 3,
                        currentPage : current,
                        linkTo:"#/remind/list/__id__",
                        prevText:"上一页",
                        nextText:"下一页",
                        ellipseText:"...",
                        showUbwz : false,
                        pageInfo : false,
                        callback : function (i,obj) {
                            dataPage.from = i*this.itemPage;
                            current = i;
                            $state.go('remind.list.type', {id:parseInt(i)+1,type:$state.params.type,status:$state.params.status});
                            return false;
                        }
                    }
                },function(res){
                    console.log(res)
                });
            }
            laod();
        }])
    .controller('commentCtrl', [     //评论列表
        '$scope','$state','userMessage',function($scope,$state,userMessage){
            var _index = !isNaN(parseInt($state.params.id,10)) ? parseInt($state.params.id,10) - 1 : 0,
                dataPage = {
                    "from": _index*10,
                    "limit":10
                },
                current = _index;
                $scope.count = {};
            $scope.comment = {
                "name" : '',
                "tab" : [
                    {
                        "id" : 0,
                        "name" : '全部',
                        "cur" : true
                    }
                ],
                goto : function(id){
                    var _this = this;
                    angular.forEach(this.tab,function(v){
                        v.cur = false;
                        _this.tab[id].cur = true;
                        _this.name = _this.tab[id].name;
                    });
                },
                "list" : undefined
            };
            function laod(){
                userMessage.comment(dataPage).then(function(res){  //获取意向设计师列表
                    $scope.comment.list = res.data.data.list;
                    if($scope.comment.list.length == 0 && res.data.data.total != 0){
                        $scope.comment.list = undefined;
                        dataPage.from = current*dataPage.limit;
                        current = 0;
                        $state.go('comment.list', { id: 1 });
                    }
                    $scope.pageing = {
                        allNumPage : res.data.data.total,
                        itemPage : dataPage.limit,
                        showPageNum : 5,
                        endPageNum : 3,
                        currentPage : current,
                        linkTo:"#/comment/__id__",
                        prevText:"上一页",
                        nextText:"下一页",
                        ellipseText:"...",
                        showUbwz : false,
                        pageInfo : false,
                        callback : function (i) {
                            dataPage.from = i*this.itemPage;
                            current = i;
                            $state.go('comment.list', { id: parseInt(i)+1 });
                            return false;
                        }
                    }
                },function(res){
                    console.log(res)
                });
            }
            laod()
        }]);
