'use strict';
angular.module('controllers', [])
    .controller('designerController', [    //所有设计师资料
        '$scope','$location','userInfo','userMessage',function($scope, $location,userInfo,userMessage) {
            userInfo.get().then(function(res){
                $scope.designer = res.data.data;
                $scope.$broadcast('designerParent', res.data.data);   //父级传递
            },function(res){
                console.log(res)
            });
            $scope.$on('designerChildren', function(event, data) {   //父级接收 如果设计师操作就需要改变状态
                $scope.designer = data;
            });
            $scope.count = {};
            userMessage.count({
                "query_array":[["2","5","6","7","8","9","10","11","12","13"], ["14", "15","16","17","18"],["3"]]
            }).then(function(res){
                $scope.count.notice = res.data.data[0];
                $scope.count.remind = res.data.data[1];
                $scope.count.comment = res.data.data[2];
                $scope.$broadcast('userMessageParent', $scope.count);   //父级传递
            },function(err){
                console.log(err);
            });
            $scope.$on('userMessageChildren', function(event, data) {   //父级接收 如果设计师操作就需要改变状态
                $scope.count = data;
            });
        }
    ])
	.controller('indexCtrl', [     //设计师首页
        '$scope','$rootScope','$http','$filter','$location','userInfo','userRequiremtne',
        function($scope, $rootScope,$http,$filter,$location,userInfo,userRequiremtne) {
            $scope.userAreaOff = false;
            function uploadDesignerInfo(){
                userInfo.get().then(function(res){
                    $scope.designer = res.data.data;
                    $scope.$emit('designerChildren', res.data.data);
                },function(res){
                    console.log(res)
                });
            }
            uploadDesignerInfo();
            userRequiremtne.list().then(function(res){
                $scope.requirementList = res.data.data;
                 $scope.notRequiremtnes = !$scope.requirementList.length ? true : false;
            },function(res){
                console.log(res)
            });
            $scope.onlineSetting = function(i){   //在线设置
                var b = true;
                if(i == 1){
                    if(confirm('您确定要设置离线，离线以后不能接单')){
                        onelineStatus(i)
                    }
                }else if(i == 0){
                    onelineStatus(i)
                }
            };
            function onelineStatus(i){
                userInfo.online({"new_oneline_status":i}).then(function(res){
                    if(res.data.msg == "success"){
                        uploadDesignerInfo();
                    }
                },function(res){
                    console.log(res)
                });
            };
    }])
    .controller('requirementListCtrl', [     //装修需求列表
        '$scope','$rootScope','$http','$filter','$location','$stateParams','$interval','userRequiremtne','initData',
        function($scope, $rootScope,$http,$filter,$location,$stateParams,$interval,userRequiremtne,initData){
            userRequiremtne.list().then(function(res){
                $scope.requiremtnes = res.data.data;
                angular.forEach($scope.requiremtnes, function(value, key){
                    if(value){
                        if(value.dec_type){
                            value.dec_type = $filter('decTypeFilter')(value.dec_type);
                        }
                        if(value.dec_style){
                            value.dec_style = $filter('decStyleFilter')(value.dec_style);
                        }
                        if(value.work_type){
                            value.work_type = $filter('workTypeFilter')(value.work_type);
                        }
                        if(value.house_type){
                           value.house_type = $filter('houseTypeFilter')(value.house_type);
                        }
                        /*if(value.plan.status == 0){
                           countDate(value,1,value.plan.last_status_update_time)
                        }*/
                        if(value.plan.status == 6){
                           countDate(value,5,value.plan.last_status_update_time)
                        }
                    }
                })
            },function(res){
                console.log(res)
            });
            var statusUrl = initData.statusUrl;
            $scope.goTo = function(data){
                if(data.plan.status == 5 && (data.status == 4 || data.status == 5 || data.status == 7 || data.status == 8) && data.work_type != '纯设计'){
                    $location.path('requirement/'+data._id+"/"+statusUrl[data.status]);
                }else if(data.plan.status == 5 && data.status == 4 && data.work_type == '纯设计'){
                    $location.path('requirement/'+data._id+"/"+statusUrl[8]);
                }else{
                    $location.path('requirement/'+data._id+"/"+statusUrl[data.plan.status]);
                }
            }
            function countDate(value,num,time){
                var days = num*60*60*24*1000,
                    endDate = time+days,
                    timer = null;
                $interval.cancel(timer)
                timer = $interval(function() {
                    var nowDate = new Date(),
                        intervalDate = endDate - nowDate.getTime(),
                        intervalDate = intervalDate > days ? days : intervalDate,
                        t = parseInt(intervalDate/1000),
                        day=checkTime(Math.floor(t/(60*60*24))),
                        hour=checkTime(Math.floor((t-day*24*60*60)/3600)),
                        minute=checkTime(Math.floor((t-day*24*60*60-hour*3600)/60)),
                        second=checkTime(Math.floor(t-day*24*60*60-hour*3600-minute*60));
                    if(intervalDate <= 0){
                        $interval.cancel(timer);
                        value.countdown = '已经过期';
                    }
                    if(day == 0){
                        value.countdown = hour+"小时"+minute+"分"+ second + "秒";
                    }else{
                        value.countdown = day+"天"+hour+"小时"+minute+"分"+ second + "秒";
                    }
                }, 1000);
            }
            function checkTime(i){
                return  i < 10 ?  "0" + i : "" + i;
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
        '$scope','$rootScope','$timeout','$filter','$location','$stateParams','userRequiremtne','initData','userTeam',
        function($scope, $rootScope,$timeout,$filter,$location,$stateParams,userRequiremtne,initData,userTeam){
            var requiremtneId = $stateParams.id;
            $scope.$on('requirementParent',function(event, data){    //子级接收
                setPrivileges(data);
            })
            function setPrivileges(data){    //设置显示权限
                if((data.plan.status == 3 || data.plan.status == 6 || data.plan.status == 4 || data.plan.status == 5) && (data.status == 6 || data.status == 3 || data.status == 7 || data.status == 4 || data.status == 5 || data.status == 8)){  //选择方案
                    myPlan()
                }
                if((data.status == 7 || data.status == 4 || data.status == 5 || data.status == 8) && data.work_type != 2){   //生成合同
                    myContract()
                }
            }
            function uploadParent(){    // 子级传递  如果业主操作就需要改变状态给父级传递信息
                userRequiremtne.get({"_id":$stateParams.id}).then(function(res){
                    $scope.$emit('requirementChildren', res.data.data);
                },function(res){
                    console.log(res)
                });
            }
        // 方案列表
        function myPlan(){
            userRequiremtne.plans({"requirementid":requiremtneId}).then(function(res){    //获取我的方案列表
                $scope.plans = res.data.data;
            },function(res){
                console.log(res)
            });
        }
        var owenrTimer = null;
        $scope.owenr = {
            newDate : +new Date(),
            startDate : '',
            motaiReject : false,
            motaiAnswer : false,
            response : true,
            rejectMessage : '',
            message : '',
            messages : initData.rejectMsg,
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
                $scope.owenr.response = false;
                $scope.owenr.motaiReject = true;
            },
            answerBtn : function(){   //响应业主
                userRequiremtne.answer({
                  "requirementid": requiremtneId,
                  "get_phone_time": (new Date).getTime()
                }).then(function(res){
                    $scope.owenr.response = false;
                    $scope.owenr.motaiAnswer = true;
                },function(res){
                    console.log(res)
                });
            },
            answerCancelBtn : function(){   //取消响应业主
                $scope.owenr.response = true;
                $scope.owenr.motaiAnswer = false;
            },
            /**
             * 响应业主提交
             */
            answerOwenr : function(){
                if(!$scope.owenr.startDate){
                    alert('请设置量房时间')
                }else if($scope.owenr.startDate < (new Date()).getTime()){
                    alert('设置量房不能小于当前时间')
                }else{
                    userRequiremtne.answer({
                      "requirementid": requiremtneId,
                      "house_check_time": $scope.owenr.startDate
                    }).then(function(res){
                        $scope.owenr.motaiAnswer = false;
                        uploadParent();
                    },function(res){
                        console.log(res)
                    });
                }
            },
            /**
             * 拒绝业主提交
             */
            rejectOwenr : function(){
                if(!$scope.owenr.rejectMessage && !$scope.owenr.message){
                    alert('请填写拒绝接单原因')
                }else{
                     userRequiremtne.reject({
                      "requirementid": requiremtneId,
                      "reject_respond_msg": $scope.owenr.rejectMessage +" "+ $scope.owenr.message
                    }).then(function(res){
                        $scope.owenr.motaiReject = false;
                    },function(res){
                        console.log(res)
                    });
                }
            },
            /**
             * 取消拒绝业主
             */
            rejectCancelBtn : function(){
                $scope.owenr.response = true;
                $scope.owenr.motaiReject = false;
            },
            /**
             * 提醒业主确认量房
             * @param planid  设计师标识id
             * @param userid  业主id
             */
            checkHouse : function(planid,userid){
                var _this = this;
                $timeout.cancel(owenrTimer);
                userRequiremtne.checkHouse({
                    "planid": planid,
                    "userid": userid
                }).then(function(res){
                    if(!!res.data.err_msg && res.data.err_msg === "ratelimit forbidden. limit is 1 per day."){
                        _this.checkHouseError = true;
                        owenrTimer = $timeout(function(){
                            _this.checkHouseError = false;
                            $timeout.cancel(owenrTimer);
                        },3000);
                    }else if(!!res.data.msg && res.data.msg === "success"){
                        _this.checkHouseSuccess = true;
                        owenrTimer = $timeout(function(){
                            _this.checkHouseSuccess = false;
                            $timeout.cancel(owenrTimer);
                        },3000);
                    }
                },function(res){
                    console.log(res)
                });
            },
            checkHouseSuccess : false,
            checkHouseError : false
        };
        // 三方合同
        function myContract(){   //获取我的第三方合同
            userRequiremtne.contract({"requirementid":requiremtneId}).then(function(res){
                $scope.contract = res.data.data;
            },function(res){
                console.log(res)
            });
        }
        var contractsTimer = null;
        $scope.contracts = {
            managers : [],
            manager : '',
            timer : null,
            success : false,
            btnsBox : true,
            motaiStartDate : false,
            startDate : '',
            startDateError : false,
            setStartDate : function(){
                $scope.contracts.btnsBox = false;
                $scope.contracts.motaiStartDate = true;
            },
            setCancelBtn : function(){
                $scope.contracts.btnsBox = true;
                $scope.contracts.motaiStartDate = false;
            },
            setDefineBtn : function(){
                var _this = this;
                $timeout.cancel(contractsTimer);
                _this.startDateError = false;
                if($scope.contracts.startDate < (new Date()).getTime()){
                    _this.startDateError = true;
                    contractsTimer = $timeout(function(){
                        _this.startDateError = false;
                        $timeout.cancel(contractsTimer);
                    },3000);
                    return ;
                }else{
                    userRequiremtne.config({
                      "requirementid":requiremtneId,
                      "start_at":this.startDate,
                      "manager" : this.manager
                    }).then(function(res){
                        $timeout.cancel($scope.contracts.timer)
                        uploadParent();
                        myContract();
                        $scope.contracts.btnsBox = true;
                        $scope.contracts.motaiStartDate = false;
                        $scope.contracts.success = true;
                    },function(res){
                        console.log(res)
                    });
                }
            }
        }
        userTeam.list().then(function(res){  //获取该设计师施工团队
            angular.forEach(res.data.data, function(value, key){
                if(key === 0){
                    $scope.contracts.manager = value.manager;
                }
                $scope.contracts.managers.push(value.manager)
            });
        },function(res){
            console.log(res);
        });
    }])
    .controller('createCtrl', [     //方案创建和更新
        '$scope','$rootScope','$filter','$state','$stateParams','$timeout','userRequiremtne','initData','configPlan',
        function($scope, $rootScope,$filter,$state,$stateParams,$timeout,userRequiremtne,initData,configPlan) {
            $scope.designerPlan = {
                loading : true,
                tab : true,
                totalprice : false,
                tabBtn : function(){
                    $state.go('configPlan',$stateParams);
                    configPlan.update($scope.plan);
                },
                isCreate : $state.params.username === undefined ? true : false,
                disabled : false,
                requiremtneId : $state.params.id,
                add_price_detail_name : "",
                add_price_detail_ok : false,
                total_price_discount : undefined,
                total_price_discount_ok : false,
                username : $state.params.username,
                worktype : $state.params.worktype,
                packagetype : $state.params.packagetype,
                baseprice : $state.params.baseprice,
                error : false,
                errormsg : '',
                close : function(){
                    this.error = false;
                },
                images_complete : true
            };
            $scope.$watch('designerPlan.add_price_detail_name', function(newValue){
                $scope.designerPlan.add_price_detail_ok = !!newValue
            });
            $scope.plan = {
                "userid": undefined,
                "requirementid":undefined,
                "duration":undefined,
                "total_price":undefined,
                "total_design_fee":undefined,
                "project_price_after_discount":undefined,
                "project_price_before_discount":undefined,
                "price_detail": [],
                "description":"",
                "images" : []
            };
            if($scope.designerPlan.isCreate){
                //更新方案
                userRequiremtne.getPlan({'_id':$state.params.id}).then(function(res){  //获取当前需求信息
                    if(res.data.data != null){
                        $scope.plan = angular.extend($scope.plan, res.data.data);
                        $scope.designerPlan.requiremtneId = $scope.plan.requirementid;
                        $scope.designerPlan.total_price_discount = parseInt($scope.plan.total_design_fee)+parseInt($scope.plan.project_price_after_discount);
                        $scope.designerPlan.username = $scope.plan.user.username;
                        $scope.designerPlan.packagetype = $scope.plan.requirement.package_type;
                        if($scope.designerPlan.packagetype === '1' && $scope.plan.price_detail[0].item === '365基础包'){
                            $scope.designerPlan.baseprice = $scope.plan.price_detail[0].price;
                        }
                        if(configPlan.noload){
                            angular.extend($scope.plan, configPlan.get());
                        }else{
                            configPlan.update({
                                "total_price":$scope.plan.total_price,
                                "total_design_fee":$scope.plan.total_design_fee,
                                "project_price_after_discount":$scope.plan.project_price_after_discount,
                                "project_price_before_discount":$scope.plan.project_price_before_discount,
                                "price_detail": $scope.plan.price_detail
                            });
                        }
                        $scope.designerPlan.images_complete = false;
                        $scope.designerPlan.loading = true;
                    }
                },function(res){
                    console.log(res)
                });
            }else{
                //创建方案
                $scope.plan.userid = $state.params.userid;
                $scope.plan.requirementid = $scope.designerPlan.requiremtneId;
                angular.extend($scope.plan, configPlan.get());
                $scope.designerPlan.loading = true;
            }
            function hidemsg(){
                $timeout(function(){
                    $scope.designerPlan.error = false;
                },3000)
            }
            function showmsg(msg){
                $scope.designerPlan.error = true;
                $scope.designerPlan.errormsg = msg;
                hidemsg();
            }
            $scope.designerPlan.submit = function(){
                var This = this;
                if($scope.plan.images.length == 0){
                    showmsg('请至少上传一张平面图');
                    return ;
                }
                if($scope.designerPlan.worktype != 2 && $scope.plan.total_price == undefined){
                    showmsg('请填写报价');
                    return ;
                }
                if($scope.designerPlan.worktype == 2){
                    $scope.plan.manager = '';
                    $scope.plan.duration = 0;
                    $scope.plan.total_price = 0;
                }
                this.disabled = true;
                if($scope.designerPlan.isCreate){
                    userRequiremtne.update($scope.plan).then(function(res){  //修改方案到业主的需求
                        if(!!res.data.msg && res.data.msg === "success"){
                            $state.go('requirement.plan',{id:This.requiremtneId});
                            $scope.designerPlan.loading = false;
                            configPlan.remove();
                        }
                    },function(res){
                        console.log(res)
                    });
                }else{
                    userRequiremtne.addPlan($scope.plan).then(function(res){  //提交方案到业主的需求
                        if(!!res.data.msg && res.data.msg === "success"){
                            $state.go('requirement.plan',{id:This.requiremtneId});
                            $scope.designerPlan.loading = false;
                            configPlan.remove();
                        }
                    },function(res){
                        console.log(res)
                    });
                }
            }
    }])
    .controller('configCtrl', [     //方案报价创建和更新
        '$scope','$rootScope','$filter','$state','$stateParams','$timeout','userRequiremtne','initData','configPlan',
        function($scope, $rootScope,$filter,$state,$stateParams,$timeout,userRequiremtne,initData,configPlan) {
            var priceDetail = [
                {
                    "description": "",
                    "price": undefined,
                    "item": "基础工程"
                },
                {
                    "description": "",
                    "price": undefined,
                    "item": "水电工程"
                },
                {
                    "description": "",
                    "price": undefined,
                    "item": "客餐厅及走道"
                },
                {
                    "description": "",
                    "price": undefined,
                    "item": "主卧"
                },
                {
                    "description": "",
                    "price": undefined,
                    "item": "次卧"
                },
                {
                    "description": "",
                    "price": undefined,
                    "item": "客卧"
                },
                {
                    "description": "",
                    "price": undefined,
                    "item": "衣帽间"
                },
                {
                    "description": "",
                    "price": undefined,
                    "item": "书房"
                },
                {
                    "description": "",
                    "price": undefined,
                    "item": "厨房"
                },
                {
                    "description": "",
                    "price": undefined,
                    "item": "主卫"
                },
                {
                    "description": "",
                    "price": undefined,
                    "item": "客卫"
                },
                {
                    "description": "",
                    "price": undefined,
                    "item": "阳台一"
                },
                {
                    "description": "",
                    "price": undefined,
                    "item": "阳台二"
                },
                {
                    "description": "",
                    "price": undefined,
                    "item": "安装工程"
                }
            ],
            priceDetail365 = [
                {
                    "description": "“365基础包”包含以下项目：1､基础工程；2､水电工程；3､泥工工程；4､墙面工程；5､其它工程。",
                    "price": undefined,
                    "item": "365基础包"
                },
                {
                    "description": "",
                    "price": undefined,
                    "item": "客餐厅及走道"
                },
                {
                    "description": "",
                    "price": undefined,
                    "item": "主卧"
                },
                {
                    "description": "",
                    "price": undefined,
                    "item": "次卧"
                },
                {
                    "description": "",
                    "price": undefined,
                    "item": "客卧"
                },
                {
                    "description": "",
                    "price": undefined,
                    "item": "衣帽间"
                },
                {
                    "description": "",
                    "price": undefined,
                    "item": "书房"
                },
                {
                    "description": "",
                    "price": undefined,
                    "item": "厨房"
                },
                {
                    "description": "",
                    "price": undefined,
                    "item": "主卫"
                },
                {
                    "description": "",
                    "price": undefined,
                    "item": "客卫"
                },
                {
                    "description": "",
                    "price": undefined,
                    "item": "阳台一"
                },
                {
                    "description": "",
                    "price": undefined,
                    "item": "阳台二"
                }
            ];
            $scope.designerPlan = {
                loading : false,
                packagetype : $stateParams.packagetype,  //判断不同包类型
                baseprice : undefined,   //365包基础费用
                totalprice : false,
                add_price_detail_name : "",   //新增项目名称
                add_price_detail_ok : false,  //
                total_price_discount : undefined,
                total_price_discount_ok : false,
                error : false,
                errormsg : '',
                close : function(){
                    this.error = false;
                }
            };
            $scope.$watch('designerPlan.add_price_detail_name', function(newValue){
                $scope.designerPlan.add_price_detail_ok = !!newValue
            });
            $scope.plan = {
                "total_price":undefined,
                "total_design_fee":undefined,
                "project_price_after_discount":undefined,
                "project_price_before_discount":undefined,
                "price_detail": [],
            };
            if($stateParams.packagetype === undefined && !configPlan.noload){
                userRequiremtne.getPlan({'_id':$state.params.id}).then(function(res){  //获取当前需求信息
                    if(res.data.data != null){
                        $scope.plan = angular.extend($scope.plan, res.data.data);
                        $scope.designerPlan.requiremtneId = $scope.plan.requirementid;
                        $scope.designerPlan.total_price_discount = parseInt($scope.plan.total_design_fee)+parseInt($scope.plan.project_price_after_discount);
                        $scope.designerPlan.username = $scope.plan.user.username;
                        $scope.designerPlan.packagetype = $scope.plan.requirement.package_type;
                        if($scope.designerPlan.packagetype === '1' && $scope.plan.price_detail[0].item === '365基础包'){
                            $scope.designerPlan.baseprice = $scope.plan.price_detail[0].price;
                        }
                        $scope.designerPlan.loading = true;
                    }
                },function(res){
                    console.log(res)
                });
            }else{
                if(configPlan.get().total_price === undefined){  //创建新报价
                    if($scope.designerPlan.packagetype === '1'){   //365包
                        $scope.plan.price_detail = priceDetail365.slice(0);
                        $scope.plan.price_detail[0].price = $scope.designerPlan.baseprice;
                    }else{
                        $scope.plan.price_detail = priceDetail.slice(0);
                    }
                }else{  //更新
                    angular.extend($scope.plan, configPlan.get());
                }
                $scope.designerPlan.loading = true;
            }
            $scope.designerPlan.remove_price_detail = function(id){
                if(confirm('您确定要删除吗？')){
                    $scope.plan.price_detail.splice(id,1);
                    this.computePrice()
                }
            };
            $scope.designerPlan.add_price_detail = function(){
                var This = this;
                if(this.add_price_detail_ok){
                    $scope.plan.price_detail.push({
                        "description": "",
                        "price": undefined,
                        "item": This.add_price_detail_name
                    });
                    This.add_price_detail_name = '';
                    this.add_price_detail_ok = false;
                }else{
                    this.error = true;
                    this.errormsg = '您输入新增项目名称为空';
                    return ;
                }
            };
            $scope.designerPlan.computePrice = function(){
                var price = 0;
                    angular.forEach($scope.plan.price_detail, function(value, key){
                        if(!isNaN(parseInt(value.price))){
                            price += parseInt(value.price)
                        }
                    });
                    $scope.plan.project_price_before_discount = price;
                    this.computeTotalprice();
            };
            $scope.designerPlan.computeTotalprice = function(){
                var before_discount = $scope.plan.project_price_before_discount || 0;   //工程总造价
                var after_discount = $scope.plan.project_price_after_discount || 0;  //工程折后价
                var design_fee = $scope.plan.total_design_fee || 0;  //设计费
                //如果工程折后价存在，总价 = 工程折后价+设计费；否则总价 = 工程总造价+设计费
                var discount = after_discount == 0 ? before_discount : after_discount;
                $scope.plan.total_price = discount + design_fee;
            };
            $scope.designerPlan.createQuote = function(){
                if(!$scope.plan.total_price){
                    if(!confirm('还没有工程总造价或设计费，您确定创建吗？')){
                        return ;
                    }else{
                        $scope.plan.total_price = 0;
                        $scope.plan.project_price_before_discount = 0;
                        $scope.plan.project_price_after_discount = 0;
                        $scope.plan.total_design_fee = 0;
                    }
                }
                $scope.plan.project_price_before_discount = $scope.plan.project_price_before_discount || 0;
                $scope.plan.project_price_after_discount = $scope.plan.project_price_after_discount || 0;
                $scope.plan.total_design_fee = $scope.plan.total_design_fee || 0;
                this.total_price_discount_ok = true;
                /**
                 * 清除未填写项目
                 */
                _.remove($scope.plan.price_detail, function(n) {
                   return n.price == undefined;
                });
                configPlan.update($scope.plan);
                configPlan.noload = true;
                $state.go('createPlan',$stateParams);
            };
    }])
    .controller('historyListCtrl', [     //历史装修需求列表
        '$scope','$rootScope','$http','$filter','$location','$stateParams','userRequiremtne',
        function($scope, $rootScope,$http,$filter,$location,$stateParams,userRequiremtne){
            $scope.historyTab = [
                {
                    id : 0,
                    name : '全部',
                    cur : true
                },
                {
                    id : 1,
                    name : '已完成',
                    cur : false
                },
                {
                    id : 2,
                    name : '已拒绝',
                    cur : false
                },
                {
                    id : 3,
                    name : '未响应',
                    cur : false
                },
                {
                    id : 4,
                    name : '未出方案',
                    cur : false
                },
                {
                    id : 5,
                    name : '未中标',
                    cur : false
                }
            ];
            $scope.historyName = '';
            $scope.history = function(id){
                angular.forEach($scope.historyTab,function(v,k){
                    v.cur = false;
                });
                $scope.historys = undefined;
                $scope.historyTab[id].cur = true;
                $scope.historyName = $scope.historyTab[id].name;
                loadList(id);
            }
            function loadList(id){
                userRequiremtne.history({
                    "list_type": id
                } ).then(function(res){
                    $scope.historys = res.data.data;
                    angular.forEach($scope.historys, function(value, key){
                        value.dec_type = $filter('decTypeFilter')(value.dec_type);
                        value.dec_style = $filter('decStyleFilter')(value.dec_style);
                        value.work_type = $filter('workTypeFilter')(value.work_type);
                        value.house_type = $filter('houseTypeFilter')(value.house_type);
                    })
                },function(res){
                    console.log(res)
                });
            }
            loadList(0)
            $scope.goTo = function(id,status){
                $location.path('history/'+id+"/detail");
            }
    }])
    .controller('productsListCtrl', [     //我的作品列表
        '$scope','$state','$filter','userProduct',function($scope,$state,$filter,userProduct){
            $scope.productList = undefined;
            var _index = !isNaN(parseInt($state.params.id,10)) ? parseInt($state.params.id,10) - 1 : 0,
                dataPage = {
                  "from": _index*8,
                  "limit":8
                },
                current = _index;
            function laod(){
                userProduct.list(dataPage).then(function(res){  //获取作品收藏列表
                    $scope.productList = res.data.data.products;
                    angular.forEach($scope.productList, function(value, key){
                        value.dec_type = $filter('decTypeFilter')(value.dec_type);
                        if(value.business_house_type != undefined){
                            value.business_house_type = $filter('businessHouseTypeFilter')(value.business_house_type);
                        }
                        if(value.house_type != undefined){
                            value.house_type = $filter('houseTypeFilter')(value.house_type);
                        }
                        value.dec_style = $filter('decStyleFilter')(value.dec_style);
                        value.work_type = $filter('workTypeFilter')(value.work_type);
                    });
                    if($scope.productList.length == 0 && res.data.data.total != 0){
                        $scope.productList = undefined;
                        dataPage.from = current*dataPage.limit;
                        current = 0;
                        $state.go('products.list', { id: 1 });
                    }
                    $scope.pageing = {
                        allNumPage : res.data.data.total,
                        itemPage : dataPage.limit,
                        showPageNum : 5,
                        endPageNum : 3,
                        currentPage : current,
                        linkTo:"#/products/__id__",
                        prevText:"上一页",
                        nextText:"下一页",
                        ellipseText:"...",
                        showUbwz : false,
                        pageInfo : false,
                        callback : function (i) {
                            dataPage.from = i*this.itemPage;
                            current = i;
                            $state.go('products.list', { id: parseInt(i,10)+1 });
                            return false;
                        }
                    };
                },function(res){
                    console.log(res)
                });
            }
            $scope.modal = {
                id : '',
                show : false,
                cancel : function(){
                    this.show = false;
                    this.id = '';
                },
                define : function(){
                    var _this = this;
                    this.show = false;
                    userProduct.remove({'_id':this.id}).then(function(res){  //获取意向设计师列表
                        if(res.data.msg === "success"){
                            $scope.productList = undefined;
                            _this.id = '';
                            laod();
                        }
                    },function(res){
                        console.log(res)
                    });
                },
                remove :function(id){
                    this.show = true;
                    this.id = id;
                }
            }
            laod()
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
                    if($scope.favoriteProduct.length == 0 && res.data.data.total != 0){
                        $scope.favoriteProduct = undefined;
                        dataPage.from = current*dataPage.limit;
                        current = 0;
                        $state.go('favorite.list', { id: 1 });
                    }
                    angular.forEach($scope.favoriteProduct, function(value){
                        value.dec_type = $filter('decTypeFilter')(value.dec_type);
                        if(value.business_house_type != undefined){
                            value.business_house_type = $filter('businessHouseTypeFilter')(value.business_house_type);
                        }
                        if(value.house_type != undefined){
                            value.house_type = $filter('houseTypeFilter')(value.house_type);
                        }
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
            function remove(id){
                userFavoriteProduct.remove({'_id':id}).then(function(res){  //获取意向设计师列表
                    if(res.data.msg === "success"){
                        $scope.favoriteProduct = undefined;
                        if(!!$scope.modal.id){
                            $scope.modal.id = '';
                        }
                        laod();
                    }
                },function(res){
                    console.log(res)
                });
            }
            $scope.deleteFavorite = function(id){
                remove(id);
            }
            $scope.modal = {
                id : '',
                show : false,
                cancel : function(){
                    this.show = false;
                    this.id = '';
                },
                define : function(){
                    this.show = false;
                    remove(this.id);
                },
                remove :function(id){
                    this.show = true;
                    this.id = id;
                }
            }
            laod();
    }])
    .controller('inforCtrl', [     //基本资料认证
        '$scope','$rootScope','$timeout','$filter','$state','userInfo','initData',
        function($scope, $rootScope,$timeout,$filter,$state,userInfo,initData){
            $scope.designerInfo = {
                status : false,
                change : function(){
                    this.status = true;
                },
                cities_list : initData.tdist,
                disabled : false,
                userSex : initData.userSex,
                isLoading : false,
                motaiDone : false,
                defineBtn : function(off){
                    var This = this;
                    userInfo.auth().then(function(res){
                        if(res.data.msg === "success"){
                            This.motaiDone = true;
                            if(off){
                                $state.go('infoshow');
                            }else{
                                $state.go('addProduct');
                            }
                        }
                    },function(res){
                        console.log(res);
                    });
                },
                error : false,
                errormsg : '',
                award_details_complete : true
            };
            $scope.designer = {
                username : '',
                sex : '',
                province : '',
                city : '',
                district : '',
                address : '',
                university : '',
                work_year : '',
                company : '',
                achievement : '',
                philosophy : '',
                diploma_imageid : '',
                award_details : [],
                imageid : ''
            };
            uploadDesignerInfo();
            function hidemsg(){
                $timeout(function(){
                    $scope.designerInfo.error = false;
                },3000)
            }
            function showmsg(msg){
                $scope.designerInfo.error = true;
                $scope.designerInfo.errormsg = msg;
                hidemsg();
            }
            function uploadDesignerInfo(){    // 子级传递  如果业主操作就需要改变状态给父级传递信息
                userInfo.get().then(function(res){
                    $scope.designer = _.assign($scope.designer, res.data.data);
                    $scope.designerInfo.isLoading = true;
                    if(!$scope.designer.province){
                        $scope.designer.province = '请选择省份';
                        $scope.designer.city = '请选择市';
                        $scope.designer.district = '请选择县/区';
                    }
                    $scope.$emit('designerChildren', res.data.data);
                },function(res){
                    console.log(res)
                });
            }
            $scope.designerInfo.submit = function(){
                var This = this;
                if($scope.designerInfo.award_details_complete){
                    showmsg('您的获奖照片及描述图片还未上传完成，请上传完成以后再提交申请');
                    return ;
                }
                if($scope.designer.province == "请选择省份"){
                    showmsg('请选择省份');
                    return ;
                }
                if($scope.designer.city == "请选择市"){
                    showmsg('请选择市');
                    return ;
                }
                if($scope.designer.district == "请选择县/区"){
                    showmsg('请选择县/区');
                    return ;
                }
                if($scope.designer.imageid == ""){
                    showmsg('请上传头像');
                    return ;
                }
                if($scope.designer.sex == ""){
                    showmsg('请选择性别');
                    return ;
                }
                userInfo.update($scope.designer).then(function(res){
                    if(res.data.msg === "success"){
                        user.updateInfo();
                        This.motaiDone = true;
                        $scope.$emit('designerChildren', res.data.data);
                    }
                },function(res){
                    console.log(res)
                });
            }
    }])
    .controller('infoshowCtrl', [     //基本资料审核期查看
        '$scope','$rootScope',function($scope, $rootScope){}])
    .controller('serviceCtrl', [     //接单服务设置
        '$scope','$rootScope','$http','$filter','$state','userInfo',
        function($scope, $rootScope,$http,$filter,$state,userInfo){
            $scope.service = {
                motaiDone : false,
                scoreDefineBtn : function(){
                    this.motaiDone = false;
                    this.disabled = false;
                    $state.go('index');
                },
                disabled : false
            };
            userInfo.get().then(function(res){
                $scope.designerService = res.data.data;
                //设置默认值
                if($scope.designerService.dec_house_types.length == 0){
                    $scope.designerService.dec_house_types = []
                }
                if($scope.designerService.design_fee_range == undefined){
                    $scope.designerService.design_fee_range = ''
                }
                if($scope.designerService.dec_fee_half == 0){
                    $scope.designerService.dec_fee_half = ''
                }
                if($scope.designerService.dec_fee_all == 0){
                    $scope.designerService.dec_fee_all = ''
                }
                $scope.service.province = '湖北省';
                $scope.service.city = '武汉市';
            },function(res){
                console.log(res)
            });
            $scope.service.submit = function(){
                var This = this;
                if($scope.service.province === "湖北省" && $scope.service.city === "武汉市"){
                    This.disabled = true;
                    userInfo.service($scope.designerService).then(function(res){
                        if(res.data.msg === "success"){
                            This.motaiDone = true;
                            This.dec_districts = [];
                            This.dec_districtsArr = [];
                            $scope.$emit('designerChildren', res.data.data);
                        }
                    },function(res){
                        console.log(res)
                    });
                }else{
                    alert('您选择接单区域城市不是湖北省武汉市，请重新选择')
                    return ;
                }
            }
    }])
    .controller('phoneCtrl', ['$scope','$rootScope','userInfo',function($scope, $rootScope,userInfo){  //手机认证修改
    }])
    .controller('emailCtrl', [     //邮箱认证修改
        '$scope','$rootScope','$http','$filter','$location','$timeout','userInfo',
        function($scope, $rootScope,$http,$filter,$location,$timeout,userInfo){
        function uploadDesignerInfo(){    // 子级传递  如果业主操作就需要改变状态给父级传递信息
            userInfo.get().then(function(res){
                $scope.designeremail = res.data.data;
                $scope.$emit('designerChildren', res.data.data);
            },function(res){
                console.log(res);
            });
        }
        uploadDesignerInfo();
        $scope.designerEmail = {
            status : false,
            waiting : false,
            disabled : false,
            again : false,
            prompt : false,
            change : function(){
                this.status = true;
            },
            send : function(){
                var _this = this;
                this.status = false;
                var date = new Date();
                if(date.getTime() - $scope.designeremail.email_auth_date < 600000){
                    _this.prompt = true;
                    $timeout(function(){
                        _this.prompt = false;
                    },3000);
                    return ;
                }
                userInfo.emailInfo({"email":$scope.designeremail.email}).then(function(res){
                    uploadDesignerInfo();
                    userInfo.email();
                    _this.again = true;
                    $timeout(function(){
                        _this.again = false;
                    },3000);
                },function(res){
                    console.log(res)
                });
            }
        }
    }])
    .controller('idcardCtrl', [     //身份证认证修改
        '$scope','$rootScope','$timeout','$state','userInfo','initData',
        function($scope,$rootScope, $timeout,$state,userInfo,initData){
            var timer = null;
        $scope.designerIdcard = {
            status : false,
            waiting : true,
            change : function(){
                this.status = true;
                this.waiting = false;
            },
            bankList : initData.bankList,
            disabled : false,
            error : false,
            errormsg : ''
        }
        function hidemsg(){
            timer = $timeout(function(){
                $scope.designerIdcard.error = false;
                $timeout.cancel(timer);
            },3000)
        }
        function showmsg(msg){
            $timeout.cancel(timer);
            $scope.designerIdcard.error = true;
            $scope.designerIdcard.errormsg = msg;
            hidemsg();
        }
        function uploadDesignerInfo(){    // 子级传递  如果业主操作就需要改变状态给父级传递信息
            userInfo.get().then(function(res){
                $scope.designerUId = res.data.data;
                if(!$scope.designerUId.bank){
                    $scope.designerUId.bank = $scope.designerIdcard.bankList[0];
                }
                $scope.$emit('designerChildren', res.data.data);
            },function(res){
                console.log(res)
            });
        }
        uploadDesignerInfo();
        $scope.designerIdcard.send = function(){
            if(!$scope.designerUId.uid_image1){
                showmsg('您没有上传身份证正面照片');
                return ;
            }
            if(!$scope.designerUId.uid_image2){
                showmsg('您没有上传身份证反面照片');
                return ;
            }
            if(!$scope.designerUId.bank_card_image1){
                showmsg('您没有上传银行卡正面照片');
                return ;
            }
            userInfo.bank({
              "realname":$scope.designerUId.realname,
              "uid":$scope.designerUId.uid,
              "bank": $scope.designerUId.bank,
              "bank_card": $scope.designerUId.bank_card,
              "uid_image1":$scope.designerUId.uid_image1,
              "uid_image2":$scope.designerUId.uid_image2,
              "bank_card_image1":$scope.designerUId.bank_card_image1
            }).then(function(res){
                $scope.designerIdcard.change = false;
                $scope.designerIdcard.status = false;
                $scope.designerUId = undefined;
                uploadDesignerInfo();
                $('#fileToUpload1').uploadify('destroy');
                $('#fileToUpload2').uploadify('destroy');
                $('#fileToUpload3').uploadify('destroy');
                $state.go('idcardshow');
            },function(res){
                console.log(res)
            });
        }
    }])
    .controller('idcardShowCtrl', [     //身份证认证修改
        '$scope','$rootScope','$timeout','$filter','$location','userInfo','initData',
        function($scope,$rootScope, $timeout,$filter,$location,userInfo,initData){
        $scope.designerIdcard = {
            status : false,
            waiting : true,
            change : function(){
                this.status = true;
                this.waiting = false;
            },
            bankList : initData.bankList,
            disabled : false,
            error : false,
            errormsg : ''
        }
        function hidemsg(){
            $timeout(function(){
                $scope.designerIdcard.error = false;
            },3000)
        }
        function showmsg(msg){
            $scope.designerIdcard.error = true;
            $scope.designerIdcard.errormsg = msg;
            hidemsg();
        }
        function uploadDesignerInfo(){    // 子级传递  如果业主操作就需要改变状态给父级传递信息
            userInfo.get().then(function(res){
                $scope.designerUId = res.data.data;
                if(!$scope.designerUId.bank){
                    $scope.designerUId.bank = $scope.designerIdcard.bankList[0];
                }
                $scope.$emit('designerChildren', res.data.data);
            },function(res){
                console.log(res)
            });
        }
        uploadDesignerInfo();
        $scope.designerIdcard.send = function(){
            if(!$scope.designerUId.uid_image1){
                showmsg('您没有上传身份证正面照片');
                return ;
            }
            if(!$scope.designerUId.uid_image2){
                showmsg('您没有上传身份证反面照片');
                return ;
            }
            if(!$scope.designerUId.bank_card_image1){
                showmsg('您没有上传银行卡正面照片');
                return ;
            }
            userInfo.bank({
              "username":$scope.designerUId.username,
              "uid":$scope.designerUId.uid,
              "bank": $scope.designerUId.bank,
              "bank_card": $scope.designerUId.bank_card,
              "uid_image1":$scope.designerUId.uid_image1,
              "uid_image2":$scope.designerUId.uid_image2,
              "bank_card_image1":$scope.designerUId.bank_card_image1
            }).then(function(res){
                $scope.designerIdcard.change = false;
                $scope.designerIdcard.status = false;
                $scope.designerUId = undefined;
                uploadDesignerInfo();
                $('#fileToUpload1').uploadify('destroy');
                $('#fileToUpload2').uploadify('destroy');
                $('#fileToUpload3').uploadify('destroy');
            },function(res){
                console.log(res)
            });
        }
    }])
    .controller('teamCtrl', [     //施工团队认证修改
        '$scope','$rootScope','$stateParams','$state','$timeout','userTeam','initData',
        function($scope,$rootScope,$stateParams,$state,$timeout,userTeam,initData){
        function load(){
            userTeam.list().then(function(res){
                $scope.teamList = res.data.data
            },function(res){
                console.log(res)
            });
        }
        load()
        $scope.designerTeam = {
            disabled : false,
            remove : function(id){
                if(confirm('您确定要删除吗？')){
                    userTeam.remove({"_id": id}).then(function(res){
                        if(res.data.msg === "success"){
                            $scope.teamList = undefined;
                            load();
                        }
                    },function(res){
                        console.log(res)
                    });
                }
            },
            cities_list : initData.tdist,
            goodAtList : initData.goodAtList,
            userSex : initData.userSex,
            isLoading : true,
            errormsg : '',
            errotr : false
        }
        $scope.team = {
            province : '',
            city : '',
            district : '',
            manager : '',
            uid : '',
            company : '',
            work_year : '',
            good_at : '水电',
            working_on : '',
            sex : '',
            uid_image1 : '',
            uid_image2 : ''
        }
        if($stateParams.id){
            $scope.designerTeam.isLoading = false;
            userTeam.get({"_id": $stateParams.id}).then(function(res){
                if(res.data.data != null){
                    $scope.team = _.assign($scope.team,res.data.data);
                    $scope.designerTeam.isLoading = true;
                }
            },function(res){
                console.log(res)
            });
        }else{
            $scope.team = _.assign($scope.team,{province:'请选择省份',city:'请选择市',district:'请选择县/区',});
        }
        function hidemsg(){
            $timeout(function(){
                $scope.designerTeam.error = false;
            },3000)
        }
        function showmsg(msg){
            $scope.designerTeam.error = true;
            $scope.designerTeam.errormsg = msg;
            hidemsg();
        }
        $scope.designerTeam.submit = function(){
             if($scope.team.province == "请选择省份"){
                    showmsg('请选择省份');
                    return ;
                }
                if($scope.team.city == "请选择市"){
                    showmsg('请选择市');
                    return ;
                }
                if($scope.team.district == "请选择县/区"){
                    showmsg('请选择县/区');
                    return ;
                }
                if($scope.team.uid_image1 == ""){
                    showmsg('请上传身份证正面照');
                    return ;
                }
                if($scope.team.uid_image2 == ""){
                    showmsg('请上传身份证反面照');
                    return ;
                }
                if($scope.team.sex == ""){
                    showmsg('请选择性别');
                    return ;
                }
            this.disabled = true;
            $scope.designerTeam.destroyDt = false;
            if($stateParams.id){
                userTeam.update($scope.team).then(function(res){
                    if(res.data.msg === "success"){
                        $state.go('teamList');
                    }
                },function(res){
                    console.log(res)
                })
            }else{
                userTeam.add($scope.team).then(function(res){
                    if(res.data.msg === "success"){
                        //解决到签合同没有项目经理问题，以免引起后续业务流程bug
                        if(!!$stateParams.contract){
                            $state.go('requirement.contract',{id:$stateParams.contract});
                        }else{
                            $state.go('teamList');
                        }
                    }
                },function(res){
                    console.log(res)
                });
            }
        }
    }])
    .controller('releaseCtrl', [     //作品上传
        '$scope','$state','$filter','$stateParams','$timeout','userProduct','initData',
        function($scope,$state,$filter,$stateParams,$timeout,userProduct,initData){
            $scope.product = {
              "province":undefined,
              "city":undefined,
              "district":undefined,
              "cell": undefined,
              "house_type":"0",
              "business_house_type" : "0",
              "house_area": undefined,
              "dec_style":"0",
              "dec_type": "0",
              "work_type":"0",
              "total_price":undefined,
              "description":undefined,
              "images":[],
              "plan_images" : [],
              "cover_imageid" : undefined
            };
            $scope.designerProduct = {
                isRelease : $stateParams.id == undefined ? true : false,
                decType : initData.decType,
                workType : initData.workType,
                decStyle : initData.decStyle,
                houseType : initData.houseType,
                disabled : false,
                motaiDone : false,
                section : initData.section,
                isLoading : true,
                businessHouseType : initData.businessHouseType,
                error : false,
                errormsg : '',
                plan_images_complete : true,
                images_complete : true
            };
            if($scope.designerProduct.isRelease){
                $scope.product = _.assign($scope.product,{province:'请选择省份',city:'请选择市',district:'请选择县/区'});
            }else{
                $scope.designerProduct.isLoading = false;
                userProduct.get({"_id": $stateParams.id}).then(function(res){
                    if(res.data.data != null){
                        $scope.product = _.assign($scope.product,res.data.data);
                        $scope.designerProduct.isLoading = true;
                        $scope.designerProduct.plan_images_complete = true,
                        $scope.designerProduct.images_complete = true
                    }
                },function(res){
                    console.log(res)
                });
            }
            function hidemsg(){
                $timeout(function(){
                    $scope.designerProduct.error = false;
                },3000)
            }
            function showmsg(msg){
                $scope.designerProduct.error = true;
                $scope.designerProduct.errormsg = msg;
                hidemsg();
            }
            $scope.designerProduct.submit = function(){
                var This = this;
                if($scope.product.province == "请选择省份"){
                    showmsg('请选择省份');
                    return ;
                }
                if($scope.product.city == "请选择市"){
                    showmsg('请选择市');
                    return ;
                }
                if($scope.product.district == "请选择县/区"){
                    showmsg('请选择县/区');
                    return ;
                }
                if($scope.product.images.length == 0){
                    showmsg('请至少上传一张作品图片');
                    return ;
                }
                this.disabled = true;
                if($scope.product.cover_imageid === undefined){
                    $scope.product.cover_imageid = $scope.product.images[0].imageid
                }
                if(this.isRelease){
                    userProduct.add($scope.product).then(function(res){
                        if(res.data.msg === "success"){
                            $('#createUpload').uploadify('destroy');
                            $state.go('products.list', { 'id' : 1 });
                        }
                    },function(res){
                        console.log(res);
                    });
                }else{
                    userProduct.update($scope.product).then(function(res){
                        if(res.data.msg === "success"){
                            $('#createUpload').uploadify('destroy');
                            $state.go('products.list', { 'id' : 1 });
                        }
                    },function(res){
                        console.log(res);
                    });
                }
            }
    }])
    .controller('noticeCtrl', [     //系统通知
        '$scope','$state','userMessage',function($scope,$state,userMessage){
            $scope.notice = {
                name : '',
                "arr" : "2-5-6-7-8-9-10-11-12-13-99",
                tab : [
                    {
                        id : 0,
                        name : '全部',
                        cur : true,
                        arr : "2-5-6-7-8-9-10-11-12-13-99"
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
                        arr : "2-5-6-7-8-9-10-11-12-13"
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
                },
                status : undefined,
                setread :function(){
                    if($state.params.status === '0'){
                        $state.go('notice.list.type', {id:1,type:$state.params.type,status:undefined});
                        this.getread = false;
                        this.status = undefined;
                    }else if($state.params.status === undefined){
                        $state.go('notice.list.type', {id:1,type:$state.params.type,status:0});
                        this.getread = true;
                        this.status = 0;
                    }
                },
                getread : false
            };
            angular.forEach($scope.notice.tab,function(v){
                v.cur = v.arr == $state.params.type;
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
                    '2': '',
                    '5': 'infor',
                    '6': 'infor',
                    '7': 'idcard',
                    '8': 'idcard',
                    '9': 'teamList',
                    '10': 'teamList',
                    '11': 'products.list',
                    '12': 'products.list',
                    '13': 'products.list',
                    '99': ''
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
                    if(data.message_type === '11' || data.message_type === '12' || data.message_type === '13'){
                       $state.go(url[data.message_type],{id:1});
                    }else{
                        $state.go(url[data.message_type]);
                    }
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
                    "query_array":[["2","4","5","6","7","8","9","10","11","12","13"], ["14", "15","16","17","18"],["3"]]
                }).then(function(res){
                    $scope.count.notice = res.data.data[0];
                    $scope.count.remind = res.data.data[1];
                    $scope.count.comment = res.data.data[2];
                    $scope.$emit('userMessageParent', $scope.count);   //父级传递
                    user.updateData();   //更新右上角显示下拉菜单
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
                            $state.go('notice.list.type', {id:parseInt(i,10)+1,type:$state.params.type,status:$state.params.status});
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
                    "query_array":[["2","5","6","7","8","9","10","11","12","13"], ["14", "15","16","17","18"],["3"]]
                }).then(function(res){
                    $scope.count.notice = res.data.data[0];
                    $scope.count.remind = res.data.data[1];
                    $scope.count.comment = res.data.data[2];
                    $scope.$emit('userMessageParent', $scope.count);   //父级传递
                    user.updateData();   //更新右上角显示下拉菜单
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
        '$scope','$state',function($scope,$state){
            $scope.remind = {
                "name" : '',
                "arr" : "14-15-16-17-18",
                "tab" : [
                    {
                        "id" : 0,
                        "name" : '全部',
                        "cur" : false,
                        "arr" : "14-15-16-17-18"
                    },
                    {
                        "id" : 1,
                        "name" : '预约提醒',
                        "cur" : false,
                        "arr" : "14"
                    },
                    {
                        "id" : 2,
                        "name" : '量房提醒',
                        "cur" : false,
                        "arr" : "15"
                    },
                    {
                        "id" : 3,
                        "name" : '中标提醒',
                        "cur" : false,
                        "arr" : "16"
                    },
                    {
                        "id" : 4,
                        "name" : '未中标提醒',
                        "cur" : false,
                        "arr" : "17"
                    },
                    {
                        "id" : 5,
                        "name" : '合同提醒',
                        "cur" : false,
                        "arr" : "18"
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
                },
                status : undefined,
                setread :function(){
                    if($state.params.status === '0'){
                        $state.go('remind.list.type', {id:1,type:$state.params.type,status:undefined});
                        this.getread = false;
                        this.status = undefined;
                    }else if($state.params.status === undefined){
                        $state.go('remind.list.type', {id:1,type:$state.params.type,status:0});
                        this.getread = true;
                        this.status = 0;
                    }
                },
                getread : false
            };
            angular.forEach($scope.remind.tab,function(v){
                v.cur = v.arr == $state.params.type;
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
                        }).then(function(){
                            uploadParent();
                        });
                    }
                }
            };
            function uploadParent(){    // 子级传递  如果业主操作就需要改变状态给父级传递信息
                userMessage.count({
                    "query_array":[["2","5","6","7","8","9","10","11","12","13"], ["14", "15","16","17","18"],["3"]]
                }).then(function(res){
                    $scope.count.notice = res.data.data[0];
                    $scope.count.remind = res.data.data[1];
                    $scope.count.comment = res.data.data[2];
                    $scope.$emit('userMessageParent', $scope.count);   //父级传递
                    user.updateData();   //更新右上角显示下拉菜单
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
                        callback : function (i) {
                            dataPage.from = i*this.itemPage;
                            current = i;
                            $state.go('remind.list.type', {id:parseInt(i,10)+1,type:$state.params.type,status:$state.params.status});
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
                            $state.go('comment.list', { id: parseInt(i,10)+1 });
                            return false;
                        }
                    }
                },function(res){
                    console.log(res)
                });
            }
            laod()
        }]);




