'use strict';
(function() {
    // load modules
    angular.module('myJyzPlans', ['pasvaz.bindonce','ngCookies','filters' , 'directives'])
        .factory('userPlan', ['$http', function($http){     //业主 unread获取未读评论 add添加评论 delete评论并标记为已读 plan获取方案
            var doRequest = function(url,data){
                return $http({
                    method : 'POST',
                    url : RootUrl+'api/v2/web/'+url,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: data
                })
            };
            return {
                unread : function(){return doRequest('unread_comment')},
                add : function(data){return doRequest('add_comment', data)},
                read : function(data){return doRequest('topic_comments', data)},
                plan : function(data){return doRequest('one_plan' , data)},
                final : function(data){return doRequest('user/plan/final' , data)}
            }
        }])
        .controller('detailCtrl', [     //方案详情
            '$scope','$rootScope','$http','$filter','$location','$cookieStore','userPlan',
            function($scope, $rootScope,$http,$filter,$location,$cookieStore,userPlan){
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
                            alert('您留言太快了，请稍候再提交！')
                            return ;
                        }
                        if(!_.trim($scope.comment.plansMsg)){
                            alert('留言不能为空！')
                            return ;
                        }
                        userPlan.add({
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
                    },
                    definePlan : function(rid,did){
                        if(confirm('您确定选定方案吗？')){
                            userPlan.final({
                              "planid": planId,
                              "designerid": did,
                              "requirementid": rid
                            }).then(function(res){  //提交留言
                                if(res.data.msg === "success"){
                                    window.location.href = 'owner.html#/requirement/'+rid+'/plan';
                                }
                            },function(res){
                                console.log(res)
                            });
                        }
                    }
                }
                $scope.comments = [];
                function load(off){          //获取留言列表
                    userPlan.read({
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
                userPlan.plan({'_id':planId}).then(function(res){  //获取当前方案信息
                    $scope.plan = res.data.data;
                    if($scope.plan.total_design_fee == undefined){
                       angular.forEach($scope.plan.price_detail, function(value, key){
                            if(value.item == "设计费"){
                                $scope.plan.total_design_fee = value.price;
                                $scope.plan.price_detail.splice(key,1)
                            }
                       }) 
                    }
                    if($scope.plan.project_price_before_discount == undefined){
                        $scope.plan.project_price_before_discount = $scope.plan.total_price - $scope.plan.design_fee;
                    }
                    if($scope.plan.project_price_after_discount == undefined){
                        $scope.plan.project_price_after_discount = 0;
                    }
                    $scope.comment.imageid = (userType == '1') ? $scope.plan.user.imageid : $scope.plan.designer.imageid;
                    $scope.returnUrl = (userType == '1') ? 'owner.html#/requirement/'+$scope.plan.requirementid+'/plan' : 'designer.html#/requirement/'+$scope.plan.requirementid+'/plan'
                    $scope.statusShow = (userType == '1') && ($scope.plan.status == 3 || $scope.plan.status == 6)  ? true : false;
                },function(res){
                    console.log(res)
                });
               
        }]) 
    // angular bootstrap
    angular.bootstrap(document, ['myJyzPlans']);
})();
