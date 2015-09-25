(function() {
    angular.module('controllers')
    	.filter('cityFilter', function () {
	        return function (data, parent) {
	            var filterData = [];
	            angular.forEach(data, function (obj) {
	                if (obj.parent == parent) {
	                    filterData.push(obj);
	                }
	            })

	            return filterData;
	        }
	    })
    	.filter('processFilter', function () {
	        return function (input) {
	             return {0:'开工',
	             		 1:'拆改',
	             		 2:'水电',
						 3:'泥木',
						 4:'油漆',
						 5:'安装',
						 6:'竣工'}[input];
	        }
	    })
	    .filter('getTimesFilter',function(){
	    	return function (input) {
	             return (new Date(input.replace(/-/g,'/'))).getTime();
	        }
	    })
	    .directive('mySelect',['$timeout',function($timeout){
		    return {
		        replace : true,
		        scope: {
		                myList : "=",
		                myQuery : "="
		        },
		        controller: function($scope, $element, $attrs, $transclude) {
		        	   var obj = angular.element($element),
		                   oUl = obj.find('ul');
		               angular.element(document).on('click',function(){
		                    oUl.css('display','none');
		               })
		               var timer = null;
		               $scope.openSelect = function($event){
		                    $event.stopPropagation()
		                    oUl.css('display','block');
		                    obj.css('zIndex',200);
		                    clearTimeout(timer)
		               }
		               $scope.closeSelect = function(){
		                    clearTimeout(timer)
		                    timer = setTimeout(function(){
		                      oUl.css('display','none');
		                      obj.css('zIndex',100);
		                    },500)
		               }
		               $scope.closeTimer = function(){
		                  clearTimeout(timer)
		               }
		               $scope.select = function(id,$event){
		                    $scope.myQuery = id;
		                    $event.stopPropagation()
		                    oUl.css('display','none');
		                    obj.css('zIndex',100);
		               }
		            },
		        restrict: 'A',
		        template: '<div class="m-select" ng-click="openSelect($event)" ng-mouseout="closeSelect()"><ul class="select" ng-mouseover="closeTimer()"><li ng-repeat="d in myList"><a href="javascript:;" val="{{d.id}}" ng-click="select(d.id,$event)">{{d.name}}</a></li></ul><div class="option"><span class="value" ng-repeat="d in myList | filter:myQuery">{{d.name}}</span><span class="arrow"><em></em><i></i></span></div></div>'
		    };
		}])
        .controller('LiveController', [    //装修直播列表
            '$scope','$rootScope','$http',
            function($scope, $rootScope,$http) {
            	function loadList(){
	            	$http({
	            		method : "GET",
	            		url : RootUrl+'api/v1/share'
	            	}).then(function(resp){
	            		//返回信息
	            		console.log(resp);
	            		$scope.liveList = resp.data.data;
	            	},function(resp){
	            		//返回错误信息
	            		console.log(resp);
	            	})
	            };
	            loadList();
            	$scope.deleteLive = function(id){
            		if(confirm("你确定要删除吗？删除不能恢复")){
            			$http({
		            		method : "DELETE",
		            		url : RootUrl+'api/v1/share',
		            		headers: {
								'Content-Type': 'application/json; charset=utf-8'
						    },
		            		data : {"_id":id}
		            	}).then(function(resp){
		            		//返回信息
		            		console.log(resp.data.msg);
		            		promptMessage('删除成功',resp.data.msg)
		            		loadList();
		            	},function(resp){
		            		//返回错误信息
		            		promptMessage('删除失败',resp.data.msg)
		            		console.log(resp);
		            	})
            		}
            	}
            }
        ])
		.controller('AddController', [    //创建装修直播
            '$scope','$rootScope','$http','$location',
            function($scope, $rootScope,$http,$location){
            	var that = this;
            	$scope.dataMapped = {};
				$scope.dec_type = [
				{"num" :-1,"name":'请选择'},
				{"num" :0,"name":'家装'},
				{"num" :1,"name":'商装'},
				{"num" :2,"name":'软装'}];
				$scope.dataMapped.dec_type = $scope.dec_type[0].name;
				$scope.dec_style = [
				{"num" :-1,"name":'请选择'},
				{"num" :0,"name":'欧式'},
				{"num" :1,"name":'中式'},
				{"num" :2,"name":'现代'},
				{"num" :3,"name":'地中海'},
				{"num" :4,"name":'美式'},
				{"num" :5,"name":'东南亚'},
				{"num" :6,"name":'田园'}];
				$scope.dataMapped.dec_style = $scope.dec_style[0].name;
				$scope.house_type = [
				{"num" :-1,"name":'请选择'},
				{"num" :0,"name":'一室'},
				{"num" :1,"name":'二室'},
				{"num" :2,"name":'三室'},
				{"num" :3,"name":'四室'},
				{"num" :4,"name":'复式'},
				{"num" :5,"name":'别墅'},
				{"num" :6,"name":'LOFT'},
				{"num" :7,"name":'其他'}];
				$scope.dataMapped.house_type = $scope.house_type[0].name;
				$scope.work_type = [
				{"num" :-1,"name":'请选择'},
				{"num" :0,"name":'半包'},
				{"num" :1,"name":'全包'}];
				$scope.dataMapped.work_type = $scope.work_type[0].name;
				$scope.dec_flow = [
				{"num" :-1,"name":'请选择'},
				{"num" :0,"name":'开工'},
				{"num" :1,"name":'拆改'},
				{"num" :2,"name":'水电'},
				{"num" :3,"name":'泥木'},
				{"num" :4,"name":'油漆'},
				{"num" :5,"name":'安装'},
				{"num" :6,"name":'竣工'}];
				$scope.dataMapped.processName = $scope.dec_flow[0].name;
            	$scope.phoneChange = function(name){
            		if(!name){
            			alert('请输入需要查找的设计师的手机号码或者名字');
            			return;
		            }else{
		            	$http({
		            		method : "POST",
		            		url : RootUrl+'api/v1/admin/search_designer',
		            		headers: {
								'Content-Type': 'application/json; charset=utf-8'
						    },
		            		data : {
		            			"query" : {
		            				'phone' : name
							    },
							    "sort":{"_id": 1},
							    "from": 0,
							    "limit":10000
		            		}
		            	}).then(function(resp){
		            		//返回信息
		            		if(resp.data.data.total){
		            			$scope.designer = [];
		            			angular.forEach(resp.data.data.designers, function(value, key) {
								  this.push({
								  	"num" : value._id,
								  	"name" : value.username +" | "+ value.phone
								 });
								}, $scope.designer);

		            		}else{
		            			$scope.designer = [];
		            			$scope.designer.push({
								  	"num" : '-1',
								  	"name" : "暂无查询数据"
								 })
		            		}
		            	},function(resp){
		            		//返回错误信息
		            		promptMessage('创建失败',resp.data.msg)
		            		console.log(resp);
		            	})
		            }
            	}
            	//城市选择器
            	$scope.cities = [];
            	angular.forEach(tdist, function(value, key) {
					  this.push({
					  	name: value[0],
		                parent: value[1],
		                id: key
					 });
				}, $scope.cities);
		        // 让城市关联使用
		        this.findCityId = function (parent) {
		            var parentId;
		            angular.forEach($scope.cities, function (city) {
		                if (city.id === parent) {
		                    parentId = city.parent;
		                    return;
		                }
		            })
		            return parentId;
		        }
		        this.initCity = function(){
		            if ($scope.dataMapped.district !== undefined) {
		                $scope.dataMapped.city = this.findCityId($scope.dataMapped.district);
		                $scope.dataMapped.province = this.findCityId($scope.dataMapped.city);
		            }
		        }
		        // 第一次打开页面 需要初始化一下
		        this.initCity.call(this);
		        findCityName = function(id){
		        	var name;
		        	angular.forEach($scope.cities, function (city) {
		                if (city.id == id) {
		                    name = city.name;
		                    return;
		                }
		            })
		            return name;
		        }
            	$scope.addLive = function(){     //提交按钮
            		var process = [];
            		var aPreviewsItem = $('#j-file-list').find('.previews-item');
					var images = []
					aPreviewsItem.each(function(i,el){
						images.push($(el).data('imgid'))
					});
            		process.push({
					  	"name" : $scope.dataMapped.processName,
					  	"description" : $scope.dataMapped.processDescription,
					  	"date" : $filter('getTimesFilter')($scope.dataMapped.processDate),
					  	"images" : images
					});
            		var data = {
            			"designerid" : $scope.dataMapped.designerid,
            			"manager" : $scope.dataMapped.manager,
            			"start_at" : $filter('getTimesFilter')($scope.dataMapped.start_at),
            			"province" : findCityName($scope.dataMapped.province),
            			"city" : findCityName($scope.dataMapped.city),
            			"district" : findCityName($scope.dataMapped.district),
            			"cell" : $scope.dataMapped.cell,
            			"house_type" : $scope.dataMapped.house_type,
            			"house_area" : $scope.dataMapped.house_area,
            			"dec_style" : $scope.dataMapped.dec_style,
            			"dec_type" :  $scope.dataMapped.dec_type,
            			"work_type" : $scope.dataMapped.work_type,
            			"total_price" : $scope.dataMapped.total_price,
            			"description" : $scope.dataMapped.description,
            			"process" : process
            		}
            		$http({
	            		method : "POST",
	            		url : RootUrl+'api/v1/share',
	            		headers: {
							'Content-Type': 'application/json; charset=utf-8'
					    },
	            		data : data
	            	}).then(function(resp){
	            		//返回信息
	            		console.log(resp.data)
	            		$location.path('live');   //设置路由跳转
	            	},function(resp){
	            		//返回错误信息
	            		console.log(resp);
	            		promptMessage('创建失败',resp.data.msg)
	            	})
            	}
            }
        ])
		.controller('EditorController', [   //编辑装修直播
            '$scope','$rootScope','$stateParams','$http','$filter','$location',
            function($scope, $rootScope, $stateParams,$http,$filter,$location) {
                $http({   //获取数据
            		method : "GET",
            		url : RootUrl+'api/v1/share/'+$stateParams.id
            	}).then(function(resp){
            		//返回信息
            		setListDate(resp.data.data)
            	},function(resp){
            		//返回错误信息
            		console.log(resp);
            		promptMessage('获取数据失败',resp.data.msg)
            	})
            	findArrId = function(id,arr){
		        	var i;
		        	angular.forEach(arr, function (data,key) {
		                if (data.name == id) {
		                    i = key;
		                    return;
		                }
		            })
		            return i+"";
		        }
            	function setListDate(data){
            		$scope.dataMapped = {};
            		$scope.dec_style = [
						{"id" :0,"name":'欧式'},
						{"id" :1,"name":'中式'},
						{"id" :2,"name":'现代'},
						{"id" :3,"name":'地中海'},
						{"id" :4,"name":'美式'},
						{"id" :5,"name":'东南亚'},
						{"id" :6,"name":'田园'}];
					$scope.dec_type = [
						{"id" :0,"name":'家装'},
						{"id" :1,"name":'商装'},
						{"id" :2,"name":'软装'}];
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
            		console.log(data)
            		//所在地区
            		var desArea = $('#where_area');
					desArea.empty();
					if(!!data.province){
						var designAreaQuery = data.province+" "+data.city+" "+data.district;
						desArea.find('input[name=where_area]').val(designAreaQuery)
						var designArea = new CitySelect({id :'where_area',"query":designAreaQuery});
					}else{
						desArea.find('input[name=where_area]').val("")
						var designArea = new CitySelect({id :'where_area'});
					}
            		angular.forEach(data, function (data,key) {
		                if(key == 'dec_type'){
		                	$scope.dataMapped.dec_type = !!data ? data : "0";
		                }else if(key == 'dec_style'){
		                	$scope.dataMapped.dec_style = data;
		                }else if(key == 'house_type'){
		                	$scope.dataMapped.house_type = data;
		                }else if(key == 'work_type'){
		                	$scope.dataMapped.work_type = data;
		                }else if(key == 'start_at'){
		                	$scope.dataMapped.start_at = $filter('date')(data , 'yyyy-MM-dd');
		                }else{
		                	$scope.dataMapped[key] = data;
		                }
		            })
		            $scope.phoneChange = function(name){    //查找设计师
	            		if(!name){
	            			alert('请输入需要查找的设计师的手机号码或者名字');
	            			return;
			            }else{
			            	$http({
			            		method : "POST",
			            		url : RootUrl+'api/v1/admin/search_designer',
			            		headers: {
									'Content-Type': 'application/json; charset=utf-8'
							    },
			            		data : {
			            			"query" : {
			            				'phone' : name
								    },
								    "sort":{"_id": 1},
								    "from": 0,
								    "limit":10000
			            		}
			            	}).then(function(resp){
			            		//返回信息
			            		if(resp.data.data.total){
			            			$scope.designer = [];
			            			angular.forEach(resp.data.data.designers, function(value, key) {
									  this.push({
									  	"num" : value._id,
									  	"name" : value.username +" | "+ value.phone
									 });
									}, $scope.designer);

			            		}else{
			            			$scope.designer = [];
			            			$scope.designer.push({
									  	"num" : '-1',
									  	"name" : "暂无查询数据"
									 })
			            		}
			            	},function(resp){
			            		//返回错误信息
			            		promptMessage('创建失败',resp.data.msg)
			            		console.log(resp);
			            	})
			            }
	            	}
		            $scope.editorLive = function(){   //编辑资料
		            	$scope.dataMapped.province = desArea.find('input[name=province]').val() || $scope.dataMapped.province;
		            	$scope.dataMapped.city = desArea.find('input[name=city]').val() || $scope.dataMapped.city;
		            	$scope.dataMapped.district = desArea.find('input[name=district]').val() || $scope.dataMapped.district;
		            	$scope.dataMapped.start_at = $filter('getTimesFilter')($scope.dataMapped.start_at);
		            	$http({   //提交数据
		            		method : "PUT",
		            		url : RootUrl+'api/v1/share',
		            		headers: {
								'Content-Type': 'application/json; charset=utf-8'
						    },
		            		data : $scope.dataMapped
		            	}).then(function(resp){
		            		//返回信息
		            		$location.path('live');   //设置路由跳转
		            	},function(resp){
		            		//返回错误信息
		            		console.log(resp);
		            		promptMessage('编辑数据失败',resp.data.msg)
		            	})
		            }
	        	}
            }
        ])
        .controller('UpdataController', [    //更新装修直播
            '$scope','$rootScope','$stateParams','$http','$filter','$location',
            function($scope, $rootScope, $stateParams,$http,$filter,$location) {
            	function getTimes(str){
					var date =  new Date(str.replace(/-/g,'/'))
					return date.getTime();
				}
                $http({   //获取数据
            		method : "GET",
            		url : RootUrl+'api/v1/share/'+$stateParams.id
            	}).then(function(resp){
            		//返回信息
            		$scope.data = resp.data.data;
            		//阶段名称
					$scope.process = [
					{"id" :0,"name":'开工'},
					{"id" :1,"name":'拆改'},
					{"id" :2,"name":'水电'},
					{"id" :3,"name":'泥木'},
					{"id" :4,"name":'油漆'},
					{"id" :5,"name":'安装'},
					{"id" :6,"name":'竣工'}];
					var getName = parseInt($scope.data.process[$scope.data.process.length - 1].name) + 1 > $scope.process[$scope.process.length - 1].id ? $scope.process[$scope.process.length - 1].id : parseInt($scope.data.process[$scope.data.process.length - 1].name) + 1
					$scope.processName = getName+"";
            		$scope.processDate = $filter('date')(new Date() , 'yyyy-MM-dd');
            		$scope.upDataLive = function(){
	            		var aPreviewsItem = $('#j-file-list').find('.previews-item');
						var images = []
						aPreviewsItem.each(function(i,el){
							images.push($(el).data('imgid'))
						});
						for (var i = 0,len = $scope.data.process.length; i < len; i++) {
							if(i != $scope.processName){
								$scope.data.process.push({
							  		"name" : $scope.processName,
								  	"description" : $scope.processDescription,
								  	"date" : $filter('getTimesFilter')($scope.processDate),
								  	"images" : images
								});
								break;
							}else{
								$scope.data.process[i].name = $scope.processName;
								$scope.data.process[i].description = $scope.processDescription;
								$scope.data.process[i].date = $filter('getTimesFilter')($scope.processDate);
								$scope.data.process[i].images = images;
								break;
							}
						};
						$scope.data.process.sort(function(n,m){
							return n.name - m.name;
						})
						submitData()
            		}
            		$scope.deleteLive = function(){
            			console.log($scope.data.process)
            			angular.forEach($scope.data.process,function(value,key){
            				if(value.name == $scope.processName){
            					this.splice(key,1)
            					return;
            				}
            			},$scope.data.process)
            			submitData();
            		}
            		function submitData(){
            			$http({   //提交数据
		            		method : "PUT",
		            		url : RootUrl+'api/v1/share',
		            		headers: {
								'Content-Type': 'application/json; charset=utf-8'
						    },
		            		data : $scope.data
		            	}).then(function(resp){
		            		//返回信息
		            		$location.path('live');   //设置路由跳转
		            	},function(resp){
		            		//返回错误信息
		            		console.log(resp);
		            		promptMessage('获取数据失败',resp.data.msg)
		            	})
            		}
            	},function(resp){
            		//返回错误信息
            		console.log(resp);
            		promptMessage('获取数据失败',resp.data.msg)
            	})
            }
        ]);
})();
