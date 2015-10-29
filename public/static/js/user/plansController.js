'use strict';
angular.module('controllers', [])
	.controller('createCtrl', [     //方案创建和更新
        '$scope','$rootScope','$http','$filter','$location','$stateParams','userRequiremtne',
        function($scope, $rootScope,$http,$filter,$location,$stateParams,userRequiremtne) {
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
            userRequiremtne.designer({"_id":requiremtneId}).then(function(res){  //获取当前需求信息
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
            userRequiremtne.getTeam().then(function(res){  //获取该设计师施工团队
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
                    $location.path('designer.html#/requirement/'+requiremtneId+"/plan")
                },function(res){
                    console.log(res)
                });  
            }
            //$location.path('requirement/'+iasd+"/"+statusUrl[status]);
    }])
    .controller('detailCtrl', [     //方案详情
        '$scope','$rootScope','$http','$filter','$location','$cookieStore','userRequiremtne','userComment',
        function($scope, $rootScope,$http,$filter,$location,$cookieStore,userRequiremtne,userComment){
            console.log(window.location.search.split('=')[1])
            var planId = window.location.search.split('=')[1];
            var userType = $cookieStore.get('usertype');
            $scope.tab = 1;
            $scope.tabBtn = function(i){
                $scope.tab = i
            }
            $scope.comment = {
                imageid : '',
                plansTabs : false,
                plansMsg : '',
                addPlansOff : true,
                moreOff : true,
                planstabBtn : function(off){
                    $scope.comment.plansTabs = off;
                },
                addPlansMsg : function(designer,user){
                    if(!$scope.comment.addPlansOff){
                        $scope.comment.addPlansOff = false;
                        alert('你留言太快了，请稍候再提交！')
                        return ;
                    }
                    if(!_.trim($scope.comment.plansMsg)){
                        alert('留言不能为空！')
                        return ;
                    }
                    userComment.add({
                      "topicid":planId,
                      "topictype" : '0',
                      "content": $scope.comment.plansMsg,
                      "to":(userType == '1') ? user : designer
                    }).then(function(res){  //提交留言
                        load(true)
                        $scope.comment.moreOff = true;
                        $scope.comment.plansMsg = '';
                        $scope.comment.from = 0;
                    },function(res){
                        console.log(res)
                    });
                },
                moreBtn : function(total){
                    console.log($scope.comment.from)
                    console.log(total)
                    if($scope.comments.length >= total){
                        $scope.comment.moreOff = false;
                        return ;
                    }else{
                        $scope.comment.moreOff = true;
                    }
                    var cur = $scope.comment.count*$scope.comment.limit;
                    if(total - cur > 0){
                        $scope.comment.from = cur;
                    }                 
                    console.log($scope.comment.limit)
                    console.log($scope.comments.length)
                    load()
                    $scope.comment.count++;
                },
                from : 0,
                limit : 10,
                count : 1,
                parentFocus : false,
                focus : function(){
                    $scope.comment.parentFocus = true;
                },
                blur : function(){
                   $scope.comment.parentFocus = false; 
                }
            }
            $scope.comments = [];
            function load(off){          //获取留言列表
                userComment.read({
                  "topicid":planId,
                  "from": $scope.comment.from,
                  "limit":$scope.comment.limit
                }).then(function(res){
                    if(off){
                        $scope.comments = [];
                    }
                    angular.forEach(res.data.data.comments, function(value, key){
                        if(value.usertype != userType){
                            value.usertypeOff = true;
                        }
                        value.date = $filter('timeFormat')(value.date)
                        this.push(value)
                    },$scope.comments);
                    $scope.comments.total = res.data.data.total;
                    $scope.commentOff = !$scope.comments.length ? false : true;
                    $scope.comment.addPlansOff = true;
                },function(res){
                    console.log(res)
                });
            }
            load()
            userRequiremtne.plan({'_id':planId}).then(function(res){  //获取当前方案信息
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
                if($scope.plan.total_design_fee){
                    $scope.plan.discount_price = $scope.plan.total_design_fee + $scope.plan.project_price_after_discount;
                }else{
                    $scope.plan.discount_price = $scope.plan.design_fee + $scope.plan.project_price_after_discount;
                }
                $scope.comment.imageid = (userType == '1') ? $scope.plan.user.imageid : $scope.plan.designer.imageid;
                $scope.returnUrl = (userType == '1') ? 'owner.html#/requirement/'+$scope.plan.requirementid+'/plan' : 'designer.html#/requirement/'+$scope.plan.requirementid+'/plan'
                $scope.statusShow = (userType == '1') ? true : false;
            },function(res){
                console.log(res)
            });
           
    }])
