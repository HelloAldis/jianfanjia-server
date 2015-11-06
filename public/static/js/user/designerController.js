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
                var productsReg = /products\?p=/;
                var favoriteReg = /favorite\?p=/;
                $scope.$watch( 'location.url()', function( url ){
                    if(url.split('/')[1] == 'requirement'){
                        $scope.nav = 'requirementList'
                    }else if(url.split('/')[1] == 'revise' || productsReg.test(url.split('/')[1])){
                        $scope.nav = 'products'
                    }else if(favoriteReg.test(url.split('/')[1])){
                        $scope.nav = 'favorite'
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
            function uploadDesignerInfo(){
                userInfo.get().then(function(res){
                    $scope.designer = res.data.data;
                    $scope.$emit('designerChildren', res.data.data);
                },function(res){
                    console.log(res)
                });
            }
            uploadDesignerInfo();
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
                var b = true;
                if(i == 1){
                    if(confirm('您确定要设置离线，离线以后不能接单')){
                        onelineStatus(i) 
                    }
                }else if(i == 0){
                    onelineStatus(i)
                }
            }
            function onelineStatus(i){
                userInfo.online({"new_oneline_status":i}).then(function(res){
                    if(res.data.msg == "success"){
                        uploadDesignerInfo();
                    }
                },function(res){
                    console.log(res)
                });
            }
    }])
    .controller('requirementListCtrl', [     //装修需求列表
        '$scope','$rootScope','$http','$filter','$location','$stateParams','$interval','userRequiremtne','initData',
        function($scope, $rootScope,$http,$filter,$location,$stateParams,$interval,userRequiremtne,initData){
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
            var statusUrl = initData.statusUrl;
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
        '$scope','$rootScope','$http','$filter','$location','$stateParams','userRequiremtne','initData',
        function($scope, $rootScope,$http,$filter,$location,$stateParams,userRequiremtne,initData){
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
                      "house_check_time": $scope.owenr.startDate
                    }).then(function(res){    //获取我的方案列表
                        $scope.owenr.motaiAnswer = false;
                        uploadParent();
                    },function(res){
                        console.log(res)
                    });
                }
            },
            rejectOwenr : function(){    //拒绝业主提交
                if(!$scope.owenr.rejectMessage && !$scope.owenr.message){
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
                        myContract();
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
        '$scope','$rootScope','$http','$filter','$location','$stateParams','userRequiremtne','userTeam','initData',
        function($scope, $rootScope,$http,$filter,$location,$stateParams,userRequiremtne,userTeam,initData) {
            $scope.designerPlan = {
                tab : true,
                tabBtn : function(i){
                    this.tab = i
                },
                isCreate : $stateParams.id.split("&").length == 1 ? true : false,
                disabled : false,
                managers : [],
                requiremtneId : this.isCreate ? "" : $stateParams.id.split("&")[0],
                add_price_detail_name : "",
                add_price_detail_ok : false,
                total_price_discount : undefined,
                total_price_discount_ok : false,
                username : this.isCreate ? "" : $stateParams.id.split("&")[2],
            }
            $scope.$watch('designerPlan.add_price_detail_name', function(newValue, oldValue, scope){
                if(!!newValue){
                    $scope.designerPlan.add_price_detail_ok = true;
                }else{
                    $scope.designerPlan.add_price_detail_ok = false;
                }
            });
            if($scope.designerPlan.isCreate){
                //更新方案
                userRequiremtne.getPlan({'_id':$stateParams.id}).then(function(res){  //获取当前需求信息
                    console.log(res.data.data)
                    $scope.plan = res.data.data;
                    if(_.indexOf($scope.designerPlan.managers,$scope.plan.manager) == -1){
                        $scope.plan.manager = '请选择项目经理'
                    }
                    $scope.designerPlan.requiremtneId = $scope.plan.requirementid;
                    $scope.designerPlan.total_price_discount = parseInt($scope.plan.total_design_fee)+parseInt($scope.plan.project_price_after_discount);
                    $scope.designerPlan.total_price_discount_ok = true;
                    $scope.designerPlan.username = $scope.plan.user.username;
                },function(res){
                    console.log(res)
                });
            }else{
                //创建方案
                $scope.plan = {
                    "userid": $stateParams.id.split("&")[1],
                    "requirementid":$scope.designerPlan.requiremtneId,
                    "duration":undefined,
                    "total_price":undefined,
                    "total_design_fee":undefined,
                    "project_price_after_discount":undefined,
                    "price_detail":initData.priceDetail,
                    "description":"",
                    "manager": "",
                    "images" : []
                }
            }
            userTeam.list().then(function(res){  //获取该设计师施工团队
                console.log(res.data.data)
                angular.forEach(res.data.data, function(value, key){
                    $scope.designerPlan.managers.push(value.manager)
                });
                if(!$scope.designerPlan.isCreate){
                    $scope.plan.manager = $scope.designerPlan.managers[0];
                }
            },function(res){
                console.log(res)
            });
            var res = /^[1-9]*[1-9][0-9]*$/;
            $scope.designerPlan.remove_price_detail = function(id){
                if(confirm('您确定要删除吗？')){
                    $scope.plan.price_detail.splice(id,1)
                }
            }
            $scope.designerPlan.add_price_detail = function(){
                var This = this;
                if(this.add_price_detail_ok){
                    $scope.plan.price_detail.push({
                        "description": "",
                        "price": "",
                        "item": This.add_price_detail_name
                    })
                    This.add_price_detail_name = '';
                    this.add_price_detail_ok = false;
                }else{
                    alert('您输入新增项目名称为空');
                    return ;
                }
            }           
            $scope.designerPlan.computePrice = function(){
                var price = 0;
                angular.forEach($scope.plan.price_detail, function(value, key){
                    if(!isNaN(parseInt(value.price))){
                        if(value.price.length > 12){
                            price += 0
                        }else{
                            price += parseInt(value.price) 
                        }
                    }
                });
                $scope.plan.total_price = price;
            }
            $scope.$watch('plan.total_design_fee', function(newValue, oldValue, scope){

                if(!!newValue){
                    if(res.test(newValue) && newValue.length < 13){
                        console.log(1)
                      scope.plan.total_design_fee = newValue;
                      $scope.designerPlan.total_price_discount = parseInt(scope.plan.total_design_fee)+parseInt($scope.plan.project_price_after_discount);
                    }else{
                        if(oldValue == undefined){
                            scope.plan.total_design_fee = newValue
                        }else{
                            scope.plan.total_design_fee = oldValue;
                        }
                    }
                }
            });
            $scope.$watch('plan.project_price_after_discount', function(newValue, oldValue, scope){
                if(!!newValue){
                    if(res.test(newValue) && newValue.length < 13){
                      scope.plan.project_price_after_discount = newValue;
                      $scope.designerPlan.total_price_discount = parseInt($scope.plan.total_design_fee)+parseInt(scope.plan.project_price_after_discount);
                    }else{
                        if(oldValue == undefined){
                             scope.plan.project_price_after_discount = newValue;
                        }else{
                            scope.plan.project_price_after_discount = oldValue;
                        }
                      
                    }
                }
            });
            $scope.designerPlan.createQuote = function(){
                this.tabBtn(true);
                this.total_price_discount_ok = true;
            }
            $scope.designerPlan.submit = function(){
                var This = this;
                if(this.total_price_discount == 0){
                    alert('您没有方案报价');
                    return ;
                }
                if($scope.plan.images.length == 0){
                    alert('请至少上传一张平面图');
                    return ;
                }
                if($scope.plan.manager == ''){
                    alert('您没有选择项目经理');
                    return ;
                }
                this.disabled = true;
                if($scope.designerPlan.isCreate){
                    userRequiremtne.update($scope.plan).then(function(res){  //修改方案到业主的需求
                        $location.path('requirement/'+This.requiremtneId+"/plan")
                    },function(res){
                        console.log(res)
                    }); 
                }else{
                    userRequiremtne.addPlan($scope.plan).then(function(res){  //提交方案到业主的需求
                        $location.path('requirement/'+This.requiremtneId+"/plan")
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
                angular.forEach($scope.historys, function(value, key){
                    value.dec_style = $filter('decStyleFilter')(value.dec_style);
                    value.work_type = $filter('workTypeFilter')(value.work_type);
                    value.house_type = $filter('houseTypeFilter')(value.house_type);
                })
            },function(res){
                console.log(res)
            });
            $scope.goTo = function(id,status){
                $location.path('requirement/'+id+"/detail");
            }
    }])
    .controller('productsListCtrl', [     //我的作品列表
        '$scope','$rootScope','$http','$filter','$location','userProduct',
        function($scope, $rootScope,$http,$filter,$location,userProduct){
            var dataPage = {
                  "from": 0,
                  "limit":10
                },
                current = 0;
            window.onhashchange = function(){
                var url = parseInt($location.url().split('=')[1]);
                current = !isNaN(url) ? url - 1 : 0; 
                dataPage.from = current*dataPage.limit;
                $location.url('/products?p='+(current+1));
                $scope.productList = undefined;
                laod();
            }
            function laod(){
                userProduct.list().then(function(res){  //获取作品收藏列表
                    $scope.productList = res.data.data.products;
                    angular.forEach($scope.productList, function(value, key){
                        value.house_type = $filter('houseTypeFilter')(value.house_type);
                        value.dec_style = $filter('decStyleFilter')(value.dec_style);
                        value.work_type = $filter('workTypeFilter')(value.work_type);
                    })
                    if($scope.productList.length == 0 && res.data.data.total != 0){
                        $scope.productList = undefined;
                        dataPage.from = current*dataPage.limit;
                        current = 0;
                        laod();
                        $location.url('/products?p=1')
                    }
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
                            dataPage.from = i*this.itemPage;
                            laod();
                            current = i;
                            $location.url('/products?p='+(parseInt(i)+1))
                            return false;
                        } 
                    }; 
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
                    }; 
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
    .controller('inforCtrl', [     //基本资料认证
        '$scope','$rootScope','$http','$filter','$location','userInfo','initData',
        function($scope, $rootScope,$http,$filter,$location,userInfo,initData){
            $scope.designerInfo = {
                cities_list : initData.tdist,
                disabled : false,
                userSex : initData.userSex,
                isLoading : false,
                motaiDone : false,
                defineBtn : function(){
                    var This = this;
                    userInfo.auth().then(function(res){
                        if(res.data.msg === "success"){
                            This.motaiDone = true;
                            $location.url('index');
                        }
                    },function(res){
                        console.log(res)
                    });
                }
            }
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
            }
            uploadDesignerInfo()
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
                if($scope.designer.province == "请选择省份"){
                    alert('请选择省份');
                    return ;
                }
                if($scope.designer.city == "请选择市"){
                    alert('请选择市');
                    return ;
                }
                if($scope.designer.district == "请选择县/区"){
                    alert('请选择县/区');
                    return ;
                }
                if($scope.designer.imageid == ""){
                    alert('请上传头像');
                    return ;
                }
                userInfo.update($scope.designer).then(function(res){
                    if(res.data.msg === "success"){
                        $('#j-userLogin').find('a').eq(0).html('设计师 '+$scope.designer.username);
                        This.motaiDone = true;
                    }
                },function(res){
                    console.log(res)
                });
            }  
    }])
    .controller('serviceCtrl', [     //接单服务设置
        '$scope','$rootScope','$http','$filter','$location','userInfo','initData',
        function($scope, $rootScope,$http,$filter,$location,userInfo,initData){
            $scope.service = {
                motaiDone : false,
                scoreDefineBtn : function(){
                    this.motaiDone = false;
                    this.disabled = false;
                    $location.path('index');
                },
                disabled : false,
                address : initData.tdist,
                dec_districts : [],
                dec_districtsArr : [],
                dec_districtsBtn : function(i,name){
                    if(this.dec_districtsArr[i].cur == 'active'){
                        this.dec_districtsArr[i].cur = '';
                    }else{
                        this.dec_districtsArr[i].cur = 'active';
                    }
                    if(_.indexOf($scope.designerService.dec_districts,name) != -1){
                        var index = _.indexOf($scope.designerService.dec_districts,name);
                        $scope.designerService.dec_districts.splice(index,1)
                    }else{
                        $scope.designerService.dec_districts.push(name)
                    }
                },
                decType : initData.decType,
                workType : initData.workType,
                decStyle : initData.decStyle,
                houseType : initData.houseType,
                designFee : initData.designFee,
                communicationType : initData.designType,
            }
            userInfo.get().then(function(res){
                $scope.designerService = res.data.data;
                //设置默认值
                if($scope.designerService.dec_fee_half == 0){
                    $scope.designerService.dec_fee_half = ''
                }
                if($scope.designerService.dec_fee_all == 0){
                    $scope.designerService.dec_fee_all = ''
                }
                if(!$scope.designerService.province){
                    $scope.designerService.province = '请选择省份';
                    $scope.designerService.city = '请选择市';
                }
                $scope.$watch('service.dec_districts', function(newValue, oldValue, scope) {
                     if(newValue.length != 0){
                        $scope.service.dec_districtsArr = [];
                        for (var i = 0; i < newValue.length; i++){
                            var cur = ''
                            if(_.indexOf($scope.designerService.dec_districts,newValue[i]) != -1){
                                cur = 'active'
                            }else{
                                cur = ''
                            }
                            $scope.service.dec_districtsArr.push({
                                name : newValue[i],
                                cur : cur
                            })
                        };
                     }
                });
                $scope.service.decTypeObj = {
                    list : initData.decType,
                    query : $scope.designerService.dec_types,
                    select : 0 
                }
                $scope.service.workTypeObj = {
                    list : initData.workType,
                    query : $scope.designerService.work_types,
                    select : 0 
                }
                $scope.service.decStyleObj = {
                    list : initData.decStyle,
                    query : $scope.designerService.dec_styles,
                    select : 3 
                }
                $scope.service.houseTypeObj = {
                    list : initData.houseType,
                    query : $scope.designerService.dec_house_types,
                    select : 0 
                }
                $scope.service.designFeeObj = {
                    list : initData.designFee,
                    query : $scope.designerService.design_fee_range,
                    select : 1 
                }
                $scope.service.designTypeObj = {
                    list : initData.designType,
                    query : $scope.designerService.communication_type,
                    select : 1 
                }
            },function(res){
                console.log(res)
            });
            $scope.service.submit = function(){
                var This = this;
                if($scope.designerService.province === "湖北省" && $scope.designerService.city === "武汉市"){
                    This.disabled = true;
                    userInfo.update($scope.designerService).then(function(res){
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
                    alert('您选择装修城市不是湖北省武汉市，请重新选择')
                    return ;
                }
                
            }
    }])
    .controller('phoneCtrl', ['$scope','$rootScope','userInfo',function($scope, $rootScope,userInfo){  //手机认证修改
    }])
    .controller('emailCtrl', [     //邮箱认证修改
        '$scope','$rootScope','$http','$filter','$location','userInfo',
        function($scope, $rootScope,$http,$filter,$location,userInfo){
        function uploadDesignerInfo(){    // 子级传递  如果业主操作就需要改变状态给父级传递信息
            userInfo.get().then(function(res){
                $scope.designeremail = res.data.data;
                console.log($scope.designeremail)
                $scope.$emit('designerChildren', res.data.data);
            },function(res){
                console.log(res)
            });
        }
        uploadDesignerInfo()
        $scope.designerEmail = {
            status : false,
            waiting : false,
            disabled : false,
            change : function(){
                this.status = true;
            },
            send : function(){
                this.status = false;
                console.log($scope.designeremail.email)
                var date = new Date();
                if(date.getTime() - $scope.designeremail.email_auth_date < 600000){
                    alert('您点的太快了，稍后再试');
                    return ;
                }
                userInfo.emailInfo({"email":$scope.designeremail.email}).then(function(res){
                    uploadDesignerInfo()
                },function(res){
                    console.log(res)
                });
                userInfo.email().then(function(res){
                    console.log(res);
                },function(res){
                    console.log(res)
                });
            }
        }
    }])
    .controller('idcardCtrl', [     //身份证认证修改
        '$scope','$rootScope','$http','$filter','$location','userInfo','initData',
        function($scope, $rootScope,$http,$filter,$location,userInfo,initData){
        $scope.designerIdcard = {
            status : false,
            waiting : true,
            change : function(){
                this.status = true;
                this.waiting = false;
            },
            bankList : initData.bankList,
            disabled : false,
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
                alert('您没有上传身份证正面照片');
                return ;
            }
            if(!$scope.designerUId.uid_image2){
                alert('您没有上传身份证反面照片');
                return ;
            }
            if(!$scope.designerUId.bank_card_image1){
                alert('您没有上传银行卡正面照片');
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
                console.log(res)
                $scope.designerIdcard.change = false;
                $scope.designerIdcard.status = false;
                $scope.designerUId = undefined;
                uploadDesignerInfo();
            },function(res){
                console.log(res)
            });
        }
    }])
    .controller('teamCtrl', [     //施工团队认证修改
        '$scope','$rootScope','$http','$filter','$location','$stateParams','userTeam','initData',
        function($scope, $rootScope,$http,$filter,$location,$stateParams,userTeam,initData){
        function load(){
            userTeam.list().then(function(res){
                console.log(res.data.data);
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
                console.log(res);
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
        $scope.designerTeam.submit = function(){
            this.disabled = true;
            if($stateParams.id){
                userTeam.update($scope.team).then(function(res){
                    if(res.data.msg === "success"){
                        $location.path('teamList')
                    }
                },function(res){
                    console.log(res)
                })
            }else{
                userTeam.add($scope.team).then(function(res){
                    if(res.data.msg === "success"){
                        $location.path('teamList')
                    }
                },function(res){
                    console.log(res)
                });
            }
        }
    }])
    .controller('releaseCtrl', [     //作品上传
        '$scope','$rootScope','$http','$filter','$location','$stateParams','userInfo','userProduct','initData',
        function($scope, $rootScope,$http,$filter,$location,$stateParams,userInfo,userProduct,initData){ 
            $scope.product = {
              "province":"",
              "city":"",
              "district":"",
              "cell": "",
              "house_type":"0",
              "house_area": undefined,
              "dec_style":"0",
              "dec_type": "0",
              "work_type":"0",
              "total_price":undefined,
              "description":"",
              "images":[]
            }
            $scope.designerProduct = {
                isRelease : $stateParams.id == undefined ? true : false,
                address : initData.tdist,
                decType : initData.decType,
                workType : initData.workType,
                decStyle : initData.decStyle,
                houseType : initData.houseType,
                disabled : false,
                motaiDone : false,
                section : initData.section,
                isLoading : true
            }
            if($scope.designerProduct.isRelease){
                $scope.product = _.assign($scope.product,{province:'请选择省份',city:'请选择市',district:'请选择县/区',});
            }else{
                $scope.designerProduct.isLoading = false;
                userProduct.get({"_id": $stateParams.id}).then(function(res){
                    console.log(res);
                    if(res.data.data != null){
                        $scope.product = _.assign($scope.product,res.data.data);
                        $scope.designerProduct.isLoading = true;
                    }
                },function(res){
                    console.log(res)
                });
            }
            $scope.designerProduct.submit = function(){
                var This = this;
                if($scope.product.province == "请选择省份"){
                    alert('请选择省份');
                    return ;
                }
                if($scope.product.city == "请选择市"){
                    alert('请选择市');
                    return ;
                }
                if($scope.product.district == "请选择县/区"){
                    alert('请选择县/区');
                    return ;
                }
                if($scope.product.images.length == 0){
                    alert('请至少上传一张作品图片');
                    return ;
                }
                this.disabled = true;
                console.log($scope.product)
                if(this.isRelease){
                    userProduct.add($scope.product).then(function(res){
                        if(res.data.msg === "success"){
                            $location.path('products');
                        }
                    },function(res){
                        console.log(res)
                    });
                }else{
                    userProduct.update($scope.product).then(function(res){
                        if(res.data.msg === "success"){
                            $location.path('products');
                        }
                    },function(res){
                        console.log(res)
                    });
                }
            }
    }])