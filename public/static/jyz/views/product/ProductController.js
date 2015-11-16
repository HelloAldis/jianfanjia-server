(function() {
	'use strict';
    angular.module('controllers')
    	.filter('authFilter', function () {
	        return function (input) {
	            return {
	            	"0":"未通过",
	            	"1":"审核通过",
	            	"2":"审核不通过",
	            	"3":"违规下线"
	            }[input];
	        };
	    })
        .controller('ProductController', [
            '$scope','$rootScope','$http','$uibModal','$filter','adminProduct',
            function($scope, $rootScope,$http,$uibModal,$filter,adminProduct) {
            	//全局标识，解决筛选和分页问题
            	$scope.authType = undefined; 
            	$scope.createAt = undefined;
			    //数据加载显示状态
			    $scope.loading = {
			        loadData : false,
			        notData : false
			    };
			    //分页控件
			    $scope.pagination = {      
			        currentPage : 1,
			        totalItems : 0,
			        maxSize : 5,
			        pageChanged : function(){
			            loadList(this.currentPage,10);
			        }
			    };
			    //时间筛选控件
			    $scope.startTime = {
			        clear : function(){
			            this.dt = null;
			        },
			        dateOptions : {
			           formatYear: 'yy',
			           startingDay: 1
			        },
			        status : {
			            opened: false
			        },
			        open : function($event) {
			            this.status.opened = true;
			        },
			        today : function(){
			            this.dt = new Date();
			        }
			    };
			    $scope.startTime.today();
			    $scope.endTime = {
			        clear : function(){
			            this.dt = null;
			        },
			        dateOptions : {
			           formatYear: 'yy',
			           startingDay: 1
			        },
			        status : {
			            opened: false
			        },
			        open : function($event) {
			            this.status.opened = true;
			        },
			        today : function(){
			            this.dt = new Date();
			        }
			    };
			    $scope.endTime.today();
			    $scope.searchTimeBtn = function(){
			        var start = new Date($scope.startTime.time).getTime();
			        var end = new Date($scope.endTime.time).getTime();
			        if(start > end){
			            alert('开始时间比结束时间大，请从新选择');
			            return ;
			        }if(end-start < 86400000){
			            alert('结束时间必须必比开始时间大一天，请从新选择');
			            return ;
			        }
			        $scope.loading.notData = false;
			        $scope.loading.loadData = false;
			        $scope.userList = undefined;
			        $scope.pagination.currentPage = 1;
			        $scope.createAt = {
			        	"$gte":start,
			            "$lte":end
			        };
			        loadList(1);
			    };
			    //提示消息
	            function tipsMsg(msg,time){
	            	time = time || 2000;
    	            $uibModal.open({  
    	            	size : 'sm',
    	                template: '<div class="modal-header"><h3 class="modal-title">消息提醒</h3></div><div class="modal-body"><p class="text-center">'+msg+'</p></div>',  
    	                controller: function($scope,$timeout,$modalInstance){ 
    				        $scope.ok = function () {   
    				         	$modalInstance.close();
    				        };  
    						$timeout(function(){
								$scope.ok();
							},time);
    	                } 
    	            });  
	            }
			    //加载数据
			    function loadList(from,limit,date){
			        var data = {
			              	"query":{
			              		auth_type : $scope.authType,
			              		create_at : $scope.createAt
			              	},
			              	"from": (limit === undefined ? 0 : limit)*(from-1),
			              	"limit":(limit === undefined ? undefined : limit)
			            };
			        adminProduct.search(data).then(function(resp){
			            if(resp.data.data.total === 0){
			                $scope.loading.loadData = true;
			                $scope.loading.notData = true;
			            }else{
			                $scope.userList = resp.data.data.products;
			                $scope.pagination.totalItems = resp.data.data.total;
			                $scope.loading.loadData = true;
			                $scope.loading.notData = false;
			            }
			        },function(resp){
			            //返回错误信息
			            $scope.loadData = false;
			            console.log(resp);

			        });
			    }
			    //初始化
			    loadList(1,10);
	            $scope.productAuth = function(pid,uid){
	            	if(confirm("你确定该作品合格")){
	            		adminProduct.auth({
								"_id": pid,
							    "new_auth_type":'1',
							    "designerid":uid,
							    "auth_message": '审核通过，作品合格'
								}).then(function(resp){
						            if(resp.data.msg === "success"){
						            	tipsMsg('审核成功');
		            					loadList(1,10);
						            }
				        },function(resp){
				            //返回错误信息
				            $scope.loadData = false;
				            console.log(resp);
				        });
	            	}
	            };
	            //认证筛选
	            $scope.authList = [
	            	{
	            		id : "0",
	            		name : '未通过',
	            		cur : false 
	            	},
	            	{
	            		id : "1",
	            		name : '审核通过',
	            		cur : false 
	            	},
	            	{
	            		id : "2",
	            		name : '审核不通过',
	            		cur : false 
	            	},
	            	{
	            		id : "3",
	            		name : '违规下线',
	            		cur : false 
	            	},
	            ];
	            $scope.authBtn = function(id){
					$scope.userList = undefined;
					$scope.loading.loadData = false;
					$scope.loading.notData = false;
					$scope.pagination.currentPage = 1;
	            	angular.forEach($scope.authList, function(value, key) {
					  	if(value.id == id){
                            if(value.cur){
                                value.cur = false;
                                $scope.authType = undefined;
                                loadList(1,10);
                            }else{
                                value.cur = true;
                                $scope.authType = id;
                                loadList(1);
                            }
                        }else{
                            value.cur = false;
                        }
					});
	            };
	            $scope.open = function (tips,pid,type,uid) {  
		            var modalInstance = $uibModal.open({  
		                template: '<div class="modal-header"><h3>'+tips+'</h3></div><div class="modal-body"><div class="form-group"><label for="">填写'+tips+'原因</label><textarea class="form-control" ng-model="errorMsg" rows="3"></textarea></div></div><div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">'+tips+'</button><button class="btn btn-warning" ng-click="cancel()">取消操作</button></div>',  
		                controller: function($scope, $modalInstance){ 
					         $scope.ok = function () {   
					         	if(!$scope.errorMsg){
					         		alert('请填写内容');
					         		return ;
					         	}
					         	$http({
				            		method : "POST",
				            		url : RootUrl+'api/v1/admin/update_product_auth',
				            		data: {
										"_id": pid,
									    "new_auth_type":type,
									    "designerid":uid,
									    "auth_message": $scope.errorMsg
									}
				            	}).then(function(resp){
				            		//返回信息
				            		console.log(resp);
				            		$modalInstance.close();
				            		tipsMsg('操作成功'); 
				            		loadList(1,10);
				            	},function(resp){
				            		//返回错误信息
				            		console.log(resp);
				            	});
					         };  
					         $scope.cancel = function () {  
					             $modalInstance.dismiss('取消操作');  
				           }; 
		                } 
		             });  
		             modalInstance.opened.then(function(){//模态窗口打开之后执行的函数  
		                 console.log('modal is opened');  
		            });  
		             modalInstance.result.then(function (result) {  
		                  console.log(result);  
		             }, function (reason) {  
		                 console.log(reason);//点击空白区域，总会输出backdrop click，点击取消，则会暑促cancel  
		             });  
		         };  
            }
        ]);
})();
