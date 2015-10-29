'use strict';
angular.module('controllers', [])
    .controller('designerController', [    //所有设计师资料
        '$scope','$location','userInfo',function($scope, $location,userInfo) {
            userInfo.get().then(function(res){
                $scope.designer = res.data.data;
                $scope.$broadcast('designerParent', res.data.data);   //父级传递
            },function(res){
                console.log(res)
            });
            $scope.$on('designerChildren', function(event, data) {   //父级接收 如果业主操作就需要改变状态
                $scope.designer = data;  
            });  
        }
    ])
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
            function uploadDesignerInfo(){    // 子级传递  如果业主操作就需要改变状态给父级传递信息
                userRequiremtne.get().then(function(res){
                    $scope.$emit('designerChildren', res.data.data);
                },function(res){
                    console.log(res)
                });
            }
            $scope.messageClass = false;
            $scope.messageToggle = function(b){
                $scope.messageClass = b;
            }
            userRequiremtne.list().then(function(res){
                $scope.requirementList = res.data.data;
                 $scope.notRequiremtnes = !$scope.requirementList.length ? true : false;
            },function(res){
                console.log(res)
            });
            $scope.onlineSetting = function(i){   //在线设置
                if(i == 1){
                    if(confirm('您确实要设置离线，离线不能接单')){
                        userInfo.get().then(function(res){
                            console.log(res.data.data)
                            $scope.designer = res.data.data;
                        },function(res){
                            console.log(res)
                        });
                    }
                }
            }
    }])
    .controller('requirementListCtrl', [     //装修需求列表
        '$scope','$rootScope','$http','$filter','$location','$stateParams','$interval','userRequiremtne',
        function($scope, $rootScope,$http,$filter,$location,$stateParams,$interval,userRequiremtne){
            userRequiremtne.list().then(function(res){
                $scope.requiremtnes = res.data.data;
                console.log($scope.requiremtnes)
                angular.forEach($scope.requiremtnes, function(value, key){
                    value.dec_style = $filter('decStyleFilter')(value.dec_style);
                    value.work_type = $filter('workTypeFilter')(value.work_type);
                    value.house_type = $filter('houseTypeFilter')(value.house_type);
                    if(value.status == 1){
                       countDate(value,1,value.last_status_update_time)
                    }
                    if(value.status == 6){
                       countDate(value,5,value.last_status_update_time)
                    }
                })
            },function(res){
                console.log(res)
            });
            var statusUrl = {
                "0":"detail",
                "1":"owner",
                "2":"owner",
                "3":"plan",
                "4":"contract",
                "5":"contract",
                "6":"owner",
                "7":"contract"               
            }
            $scope.goTo = function(id,status){
                $location.path('requirement/'+id+"/"+statusUrl[status]);
            }
            function countDate(value,num,time){
                var days = num*60*60*24*1000,
                    endDate = time+days,
                    timer = null;
                $interval.cancel(timer)
                timer = $interval(function() {
                    var nowDate = new Date(),
                        intervalDate = endDate - nowDate.getTime(),
                        t = parseInt(intervalDate/1000),
                        day=checkTime(Math.floor(t/(60*60*24))),
                        hour=checkTime(Math.floor((t-day*24*60*60)/3600)),
                        minute=checkTime(Math.floor((t-day*24*60*60-hour*3600)/60)),
                        second=checkTime(Math.floor(t-day*24*60*60-hour*3600-minute*60));
                        //console.log(intervalDate)
                    if(intervalDate < 0){
                        console.log('已经过期')
                        $interval.cancel(timer)
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
                return  i < 10 ?  "0" + i : "" + i  
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
        // 方案列表
        function myPlan(){
            userRequiremtne.plans({"requirementid":requiremtneId}).then(function(res){    //获取我的方案列表
                $scope.plans = res.data.data;
            },function(res){
                console.log(res)
            });
        }
        $scope.owenr = {
            startDate : '',
            motaiReject : false,
            motaiAnswer : false,
            response : true,
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
                $scope.owenr.response = false;
                $scope.owenr.motaiReject = true;
            },
            answerBtn : function(){   //响应业主
                $scope.owenr.response = false;
                $scope.owenr.motaiAnswer = true;
            },
            answerCancelBtn : function(){   //取消响应业主
                $scope.owenr.response = true;
                $scope.owenr.motaiAnswer = false;
            },
            answerOwenr : function(){    //响应业主提交
                console.log($scope.owenr.startDate)
                if(!$scope.owenr.startDate){
                    alert('请设置量房时间')
                }else{
                    console.log($filter('date')($scope.owenr.startDate,'yyyy年MM月dd日 HH:mm:ss'))
                    userRequiremtne.answer({
                      "requirementid": requiremtneId,
                      "house_check_time": (new Date).getTime()+100000
                    }).then(function(res){    //获取我的方案列表
                        $scope.owenr.motaiAnswer = false;
                        uploadParent();
                    },function(res){
                        console.log(res)
                    });
                }
            },
            rejectOwenr : function(){    //拒绝业主提交
                if(!$scope.owenr.rejectMessage || !$scope.owenr.message){
                    alert('请填写拒绝接单原因')
                }else{
                     userRequiremtne.reject({
                      "requirementid": requiremtneId,
                      "reject_respond_msg": $scope.owenr.rejectMessage +" "+ $scope.owenr.message
                    }).then(function(res){    //获取我的方案列表
                        $scope.owenr.motaiReject = false;
                    },function(res){
                        console.log(res)
                    });
                }
            },
            rejectCancelBtn : function(){  //取消拒绝业主
                $scope.owenr.response = true;
                $scope.owenr.motaiReject = false;
            }
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
                if(!$scope.contracts.startDate){
                    alert('请设置开工时间')
                }else{
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
        }
    }])
    .controller('createCtrl', [     //方案创建和更新
        '$scope','$rootScope','$http','$filter','$location','$stateParams','userRequiremtne','userTeam',
        function($scope, $rootScope,$http,$filter,$location,$stateParams,userRequiremtne,userTeam) {
            console.log($stateParams.id)
            var requiremtneId = $stateParams.id;
            var res = /^[1-9]*[1-9][0-9]*$/;
            $scope.tab = true;
            $scope.tabBtn = function(i){
                $scope.tab = i
            }
            $scope.plan = {
                "userid": '',
                "requirementid":requiremtneId,
                "duration":undefined,
                "total_price":undefined,
                "total_design_fee":undefined,
                "project_price_after_discount":undefined,
                "price_detail":[
                    {
                        "description": "",
                        "price": "",
                        "item": "基础工程"
                    },
                    {
                        "description": "",
                        "price": "",
                        "item": "水电工程"
                    },
                    {
                        "description": "",
                        "price": "",
                        "item": "客餐厅及走道"
                    },
                    {
                        "description": "",
                        "price": "",
                        "item": "主卧"
                    },
                    {
                        "description": "",
                        "price": "",
                        "item": "次卧"
                    },
                    {
                        "description": "",
                        "price": "",
                        "item": "客卧"
                    },
                    {
                        "description": "",
                        "price": "",
                        "item": "衣帽间"
                    },
                    {
                        "description": "",
                        "price": "",
                        "item": "书房"
                    },
                    {
                        "description": "",
                        "price": "",
                        "item": "厨房"
                    },{
                        "description": "",
                        "price": "",
                        "item": "主卫"
                    },
                    {
                        "description": "",
                        "price": "",
                        "item": "客卫"
                    },
                    {
                        "description": "",
                        "price": "",
                        "item": "阳台一"
                    },{
                        "description": "",
                        "price": "",
                        "item": "阳台二"
                    },
                    {
                        "description": "",
                        "price": "",
                        "item": "安装工程"
                    }
                ],
                "description":"",
                "manager": "",
                "images" : []
            }
            $scope.remove_price_detail = function(id){
                $scope.plan.price_detail.splice(id,1)
            }
            $scope.add_price_detail = function(){
                if($scope.add_price_detail_name != ''){
                    $scope.plan.price_detail.push({
                        "description": "",
                        "price": "",
                        "item": $scope.add_price_detail_name
                    })
                    $scope.add_price_detail_name = '';
                }else{
                    alert('您输入新增项目名称为空');
                    return ;
                }
            }
            $scope.computePrice = function(){
                var price = 0;
                angular.forEach($scope.plan.price_detail, function(value, key){
                    if(!isNaN(parseInt(value.price))){
                        price += parseInt(value.price)
                    }
                });
                $scope.plan.total_price = price;
            }
            $scope.total_project_price = function(num1,num2){
                if(!num1){
                    num1 = 0;
                }
                if(!isNaN(parseInt(num1))){
                    num1 = parseInt(num1)
                }
                if(!isNaN(parseInt(num2))){
                    num2 = parseInt(num2)
                }
                if(!num2){
                    num2 = 0;
                }
                return parseInt(num1)+parseInt(num2);
            }
            userRequiremtne.get({"_id":requiremtneId}).then(function(res){  //获取当前需求信息
                console.log(res)
                $scope.requiremtne = res.data.data;
                $scope.plan.userid = $scope.requiremtne.userid
            },function(res){
                console.log(res)
            });
            $scope.$watch('plan.total_design_fee', function(newValue, oldValue, scope){
                if(!!newValue){
                    if(res.test(newValue)){
                      scope.plan.total_design_fee = newValue;
                    }else{
                      scope.plan.total_design_fee = oldValue;
                    }
                }
            });
            $scope.$watch('plan.project_price_after_discount', function(newValue, oldValue, scope){
                if(!!newValue){
                    if(res.test(newValue)){
                      scope.plan.project_price_after_discount = newValue;
                    }else{
                      scope.plan.project_price_after_discount = oldValue;
                    }
                }
            });
            $scope.quoteBtn = function(){
                $scope.tab = false;
            }
            $scope.createQuote = function(){
                $scope.tab = true;
            }
            $scope.managers = [];
            userTeam.list().then(function(res){  //获取该设计师施工团队
                console.log(res.data.data)
                angular.forEach(res.data.data, function(value, key){
                    this.push({
                        id : key,
                        name : value.manager
                    })
                },$scope.managers);
                $scope.plan.manager = $scope.managers[0].id;
            },function(res){
                console.log(res)
            });
            function duration(){
                var off = false;
                $scope.$watch('plan.duration', function(newValue, oldValue, scope){
                    console.log('plan.duration'+newValue)
                    if(!!newValue && res.test(newValue)){
                        scope.error_info = '';
                        off = true;
                    }else{
                        scope.error_info = '请填写工期';
                        off = false;
                    }
                });
                return off;
            }
            function images(){
                var off = false;
                $scope.$watch('plan.images', function(newValue, oldValue, scope){
                    console.log('plan.images'+newValue)
                    if(!newValue.length){
                        scope.error_info = '';
                        off = true;
                    }else{
                        scope.error_info = '请上传平面图';
                        off = false;
                    }
                });
                return off;
            }
            function description(){
                var off = false;
                $scope.$watch('plan.description', function(newValue, oldValue, scope){
                    console.log('plan.description'+newValue)
                    if(!!newValue){
                        scope.error_info = '';
                        off = true;
                    }else{
                        scope.error_info = '请填写方案说明';
                        off = false;
                    }
                });
                return off;
            }
            $scope.createPlan = function(){
                // if($scope.managers.length){
                //     $scope.plan.manager = $scope.managers[$scope.plan.manager].name;
                // }
                $scope.plan.manager = "测试项目经理"
                console.log($scope.plan)
                userRequiremtne.addPlan($scope.plan).then(function(res){  //提交方案到业主的需求
                    $location.path('requirement/'+requiremtneId+"/plan")
                },function(res){
                    console.log(res)
                });  
            }
            //$location.path('requirement/'+iasd+"/"+statusUrl[status]);
    }])
    .controller('historyListCtrl', [     //历史装修需求列表
        '$scope','$rootScope','$http','$filter','$location','$stateParams','userRequiremtne',
        function($scope, $rootScope,$http,$filter,$location,$stateParams,userRequiremtne){
            userRequiremtne.history().then(function(res){
                $scope.historys = res.data.data;
                console.log($scope.historys)
                angular.forEach($scope.historys, function(value, key){
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
                "3":"plan",
                "4":"contract",
                "5":"contract",
                "6":"owenr",
                "7":"contract"               
            }
            $scope.goTo = function(id,status){
                $location.path('requirement/'+id+"/detail");
            }
    }])
    .controller('productsListCtrl', [     //我的作品列表
        '$scope','$rootScope','$http','$filter','$location','userProduct',
        function($scope, $rootScope,$http,$filter,$location,userProduct){
            function laod(){
                userProduct.list().then(function(res){  //获取作品收藏列表
                    console.log(res.data)
                    $scope.productList = res.data.data.products;
                    angular.forEach($scope.productList, function(value, key){
                        value.house_type = $filter('houseTypeFilter')(value.house_type);
                        value.dec_style = $filter('decStyleFilter')(value.dec_style);
                        value.work_type = $filter('workTypeFilter')(value.work_type);
                    })
                    $scope.pageing = {
                        allNumPage : res.data.data.total,
                        itemPage : 10,
                        showPageNum : 5,
                        endPageNum : 3,
                        currentPage : 0,
                        linkTo:"?p=__id__",
                        prevText:"上一页",
                        nextText:"下一页",
                        ellipseText:"...",
                        showUbwz : false,
                        pageInfo : false,
                        callback : function (i,obj) {
                            console.log(i)
                            console.log(obj)
                            //console.log($location.search())
                            return false;
                        } 
                    }; 
                    //console.log(res.data.total);
                },function(res){
                    console.log(res)
                });
            }
            $scope.deleteProduct = function(id){
                if(confirm('您确定要删除吗？删除不能恢复')){
                    userProduct.remove({'_id':id}).then(function(res){ 
                        if(res.data.msg === "success"){
                           laod(); 
                        }
                    },function(res){
                        console.log(res)
                    });
                }
            }
            laod()
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
                    $scope.favoriteProduct = res.data.products;
                    angular.forEach($scope.favoriteProduct, function(value, key){
                        value.house_type = $filter('houseTypeFilter')(value.house_type);
                        value.dec_style = $filter('decStyleFilter')(value.dec_style);
                        value.description = $filter('limitTo')(value.description,100);
                    })
                    if($scope.favoriteProduct.length == 0){
                        $scope.favoriteProduct = undefined;
                        dataPage.from = current*dataPage.limit;
                        current = 0;
                        laod();
                        $location.url('/favorite?p=1')
                    }
                    $scope.pageing = {
                        allNumPage : res.data.total,
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
                    }; 
                },function(res){
                    console.log(res)
                });
            }
            $scope.deleteFavorite = function(id){
                if(confirm('您确定要删除吗？')){
                  userFavoriteProduct.remove({'_id':id}).then(function(res){ 
                        if(res.data.msg === "success"){
                           laod(); 
                        }
                    },function(res){
                        console.log(res)
                    });  
                }
            }
            laod()
    }])

