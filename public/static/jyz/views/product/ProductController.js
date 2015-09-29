(function() {
    angular.module('controllers')
    	.filter('authFilter', function () {
	        return function (input) {
	            return {
	            	"0":"未通过",
	            	"1":"审核通过",
	            	"2":"审核不通过",
	            	"3":"违规下线"
	            }[input];
	        }
	    })
        .controller('ProductController', [
            '$scope','$rootScope','$http','$modal','$filter',
            function($scope, $rootScope,$http,$modal,$filter) {
            	$scope.authType = undefined;  //全局标识，解决筛选和分页问题
            	$scope.form = 0;
                   /*
			    参数
			     pageNo为页码
			     itemsCount为记录的数量
			     pageSize为每页显示数量
			     */
			    function setPage(p,i,s){
			       $scope.pageing={
			            pageNo : p,
			            itemsCount : i,
			            pageSize : s
			        }; 
			    }
			    setPage(1,0,10)
			    $scope.list = function () {
			    	$scope.userList = [];
			    	$scope.loadData = false;
			    	$scope.form = (this.page.pageNo-1)*10;
			        loadList()
				};
				$scope.loadData = false;
                function loadList(data){
                	var data = {
						  "query":{
							"auth_type": $scope.authType
						  },
						  "sort":{"_id": 1},
						  "from": $scope.form,
						  "limit":10
						}
					if(!!$scope.startTime && !!$scope.endTime){
                        data.query.create_at = {
                            "$gte":$filter('getTimesFilter')($scope.startTime),
                            "$lte":$filter('getTimesFilter')($scope.endTime)
                        }
                    }
	            	$http({
	            		method : "POST",
	            		url : RootUrl+'api/v1/admin/product/search',
	            		data: data
	            	}).then(function(resp){
	            		//返回信息
	            		$scope.userList = resp.data.data.products;
	            		$scope.loadData = true;
	            		setPage(1,resp.data.data.total,data.limit);
	            		$scope.pagination = {
	            			pageSize : 1,
	            			pageSize : data.limit,
	            			articleList : resp.data.data.total
	            		}
	            	},function(resp){
	            		//返回错误信息
	            		$scope.loadData = false;
	            		console.log(resp);
	            	})
	            };
	            loadList()
	            $scope.productAuth = function(pid,uid){
	            	if(confirm("你确定该作品合格")){
	            		$http({
		            		method : "POST",
		            		url : RootUrl+'api/v1/admin/update_product_auth',
		            		data: {
								"_id": pid,
							    "new_auth_type":'1',
							    "designerid":uid,
							    "auth_message": '审核通过，作品合格'
							}
		            	}).then(function(resp){
		            		//返回信息
		            		console.log(resp);
		            		promptMessage('审核成功',"success");
		            		loadList()
		            	},function(resp){
		            		//返回错误信息
		            		console.log(resp);
		            	})
	            	}
	            }
	            function checking(pid,type,uid,msg){
	            	
	            }
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
	            ]
	            $scope.authBtn = function(id){
					$scope.userList = [];
					$scope.loadData = false;
	            	angular.forEach($scope.authList, function(value, key) {
					  	if(value.id == id){
                            if(value.cur){
                                value.cur = false;
                            }else{
                                value.cur = true;
                            }
                        }else{
                            value.cur = false;
                        }
					});
	            	$scope.authType = id;
	            	loadList();
	            }
	            $scope.searchTimeBtn = function(){
                    if(!!!$scope.startTime){
                        alert('请输入开始时间');
                    }
                    if(!!!$scope.endTime){
                        alert('请输入结束时间');
                    }
                    loadList()
                }
	            $scope.open = function (tips,pid,type,uid) {  
		            var modalInstance = $modal.open({  
		                template: '<div class="modal-header"><h3>'+tips+'</h3></div><div class="modal-body"><div class="form-group"><label for="">填写'+tips+'原因</label><textarea class="form-control" ng-model="errorMsg" rows="3"></textarea></div></div><div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">'+tips+'</button><button class="btn btn-warning" ng-click="cancel()">取消操作</button></div>',  
		                controller: function($scope, $modalInstance){ 
					         $scope.ok = function () {   
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
				            		$modalInstance.dismiss(tips); 
				            		loadList()
				            	},function(resp){
				            		//返回错误信息
				            		console.log(resp);
				            	})
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
        ])
		.directive('paging', function ($timeout) {
	    	return {
		        replace:true,
		        scope:{
		            page : '=pageObject',
		            query : '=clickFunction'
		        },
		        controller : function ($scope,$element) {
		            $scope.createHtml = function () {
		                var maxPage =  Math.ceil($scope.page.itemsCount/ $scope.page.pageSize) ;
		                var pageNo = $scope.page.pageNo;
		                var str = '<div class="sabrosus"><span class="page">' ;
		                if(maxPage > 10){
		                    if(pageNo > 3){//minPage + 2
		                        //str += '<a href="javascript:;">《</a>' ;
		                        str += '<a href="javascript:;">1</a>' ;
		                        str += '<i>…<i>';
		                    }
		                    for(var i= pageNo <=2?1:pageNo -2;i<= (pageNo >= maxPage-2?maxPage:pageNo + 2) ;i++ ){
		                        if(i == 1){
		                            if(pageNo == 1){
		                                //str += '<span class="disabled">《</span>';
		                                str += '<span class="current">'+i+'</span>' ;
		                            }else{
		                                //str += '<a href="javascript:;">《</a>' ;
		                                str += '<a href="javascript:;">'+i+'</a>' ;
		                            }
		                        }else if(i == maxPage){
		                            if(pageNo == maxPage){
		                                str += '<span class="current">'+i+'</span>' ;
		                                //str += '<span class="disabled">》</span>';
		                            }else{
		                                str += '<a href="javascript:;">'+i+'</a>' ;
		                                //str += '<a href="javascript:;">》</a>' ;
		                            }
		                        }else{
		                            if(pageNo == i){
		                                str += '<span class="current">'+i+'</span>' ;
		                            }else{
		                                str += '<a href="javascript:;">'+i+'</a>' ;
		                            }
		                        }
		                    }
		                    if(pageNo < maxPage - 2){
		                        str += '<i>…<i>';
		                        str += '<a href="javascript:;" >'+maxPage+'</a>';
		                        //str += '<a href="javascript:;">》</a>' ;
		                    }
		                }else{
		                    for(var i=1 ; i<=maxPage ; i++){
		                        if(i == 1){
		                            if(pageNo == 1){
		                                //str += '<span class="disabled">《</span>';
		                                str += '<span class="current">'+i+'</span>' ;
		                            }else{
		                                //str += '<a href="javascript:;">《</a>' ;
		                                str += '<a href="javascript:;">'+i+'</a>' ;
		                            }
		                        }else if(i == maxPage){
		                            if(pageNo == maxPage){
		                                str += '<span class="current">'+i+'</span>' ;
		                                //str += '<span class="disabled">》</span>';
		                            }else{
		                                str += '<a href="javascript:;">'+i+'</a>' ;
		                                //str += '<a href="javascript:;">》</a>' ;
		                            }
		                        }else{
		                            if(pageNo == i){
		                                str += '<span class="current">'+i+'</span>' ;
		                            }else{
		                                str += '<a href="javascript:;">'+i+'</a>' ;
		                            }
		                        }
		                    }
		                }
		                str += '</span><span class="info">当前 '+pageNo+' / '+maxPage+' 页 总共 '+$scope.page.itemsCount+' 条数据<span></div>';
		                $element.html(str);
		                $scope.bindEvent();
		            };
		            $scope.bindEvent = function () {
		                angular.element($element).find('a').on('click', function () {
		                    var text = angular.element(this).html();
		                    var page = $scope.page.pageNo;
		                    if(text.trim() == '《'){
		                        $scope.page.pageNo = page - 1 ;
		                    }else if(text.trim() == '》'){
		                        $scope.page.pageNo = page + 1 ;
		                    }else{
		                        $scope.page.pageNo = parseInt(text);
		                    }
		                    $scope.query();
		                    $scope.createHtml();
		                });
		            }
		            $scope.createHtml();
		            $scope.$watch('page.itemsCount', function () {
		                $scope.createHtml();
		            })
		        }
		    }
    	});
})();
