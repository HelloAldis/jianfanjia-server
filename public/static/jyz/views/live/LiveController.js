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
            '$scope','$rootScope','$http','$filter','adminShare',
            function($scope, $rootScope,$http,$filter,adminShare) {
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
            	function loadList(from,limit){
            		var data = {
        		      	"query":{},
        		      	"from": (limit === undefined ? 0 : limit)*(from-1),
        		      	"limit":(limit === undefined ? undefined : limit)
        		    };
	            	adminShare.search(data).then(function(resp){
	            		//返回信息
	            		if(resp.data.data.total === 0){
	            		    $scope.loading.loadData = true;
	            		    $scope.loading.notData = true;
	            		}else{
	            		   $scope.liveList = resp.data.data.shares;
	            		    $scope.pagination.totalItems = resp.data.data.total;
	            		    $scope.loading.loadData = true;
	            		    $scope.loading.notData = false;
	            		}
	            	},function(resp){
	            		//返回错误信息
	            		console.log(resp);
	            	})
	            };
	            loadList(1,10);
            	$scope.deleteLive = function(id){
            		if(confirm("你确定要删除吗？删除不能恢复")){
            			adminShare.remove({"_id":id}).then(function(resp){
		            		//返回信息
		            		if(resp.data.msg === "success"){
		            			loadList();
		            		}
		            	},function(resp){
		            		//返回错误信息
		            		console.log(resp);
		            	})
            		}
            	}
            }
        ])
		.controller('AddController', [    //创建装修直播
            '$scope','$rootScope','$http','$location','$filter',
            function($scope, $rootScope,$http,$location,$filter){
            	var that = this;
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
            	$scope.processTime = {
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
            	$scope.processTime.today();
				$scope.dec_type = [
				{"num" :0,"name":'家装'},
				{"num" :1,"name":'商装'},
				{"num" :2,"name":'软装'}];
				$scope.dec_style = [
				{"num" :0,"name":'欧式'},
				{"num" :1,"name":'中式'},
				{"num" :2,"name":'现代'},
				{"num" :3,"name":'地中海'},
				{"num" :4,"name":'美式'},
				{"num" :5,"name":'东南亚'},
				{"num" :6,"name":'田园'}];
				$scope.house_type = [
				{"num" :0,"name":'一室'},
				{"num" :1,"name":'二室'},
				{"num" :2,"name":'三室'},
				{"num" :3,"name":'四室'},
				{"num" :4,"name":'复式'},
				{"num" :5,"name":'别墅'},
				{"num" :6,"name":'LOFT'},
				{"num" :7,"name":'其他'}];
				$scope.work_type = [
				{"num" :0,"name":'设计＋施工(半包)'},
				{"num" :1,"name":'设计＋施工(全包)'},
				{"num" :2,"name":'纯设计'}];
				$scope.dec_flow = [
				{"num" :0,"name":'量房'},
				{"num" :1,"name":'开工'},
				{"num" :2,"name":'拆改'},
				{"num" :3,"name":'水电'},
				{"num" :4,"name":'泥木'},
				{"num" :5,"name":'油漆'},
				{"num" :6,"name":'安装'},
				{"num" :7,"name":'竣工'}];
				$scope.dataMapped = {
					dec_type : "0",
					dec_style : "0",
					house_type : "0",
					work_type : "0",
					processName : "0"
				};
            	$scope.phoneChange = function(name){
            		if(!name){
            			alert('请输入需要查找的设计师的手机号码或者名字');
            			return;
		            }else{
		            	$http({
		            		method : "POST",
		            		url : RootUrl+'api/v2/web/admin/search_designer',
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
					  	"date" : (new Date($scope.dataMapped.processDate)).getTime(),
					  	"images" : images
					});
            		var data = {
            			"designerid" : $scope.dataMapped.designerid,
            			"manager" : $scope.dataMapped.manager,
            			"start_at" : (new Date($scope.dataMapped.start_at)).getTime(),
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
            			"process" : process,
            			"progress" : "0",
            			"cover_imageid" : $scope.dataMapped.cover_imageid
            		}
            		$http({
	            		method : "POST",
	            		url : RootUrl+'api/v2/share',
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
            '$scope','$rootScope','$stateParams','$http','$filter','$location','adminShare',
            function($scope, $rootScope, $stateParams,$http,$filter,$location,adminShare) {
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
	    		$scope.dec_type = [
				{"num" :0,"name":'家装'},
				{"num" :1,"name":'商装'},
				{"num" :2,"name":'软装'}];
				$scope.dec_style = [
				{"num" :0,"name":'欧式'},
				{"num" :1,"name":'中式'},
				{"num" :2,"name":'现代'},
				{"num" :3,"name":'地中海'},
				{"num" :4,"name":'美式'},
				{"num" :5,"name":'东南亚'},
				{"num" :6,"name":'田园'}];
				$scope.house_type = [
				{"num" :0,"name":'一室'},
				{"num" :1,"name":'二室'},
				{"num" :2,"name":'三室'},
				{"num" :3,"name":'四室'},
				{"num" :4,"name":'复式'},
				{"num" :5,"name":'别墅'},
				{"num" :6,"name":'LOFT'},
				{"num" :7,"name":'其他'}];
				$scope.work_type = [
				{"num" :0,"name":'设计＋施工(半包)'},
				{"num" :1,"name":'设计＋施工(全包)'},
				{"num" :2,"name":'纯设计'}];
				var desArea = $('#where_area');
            	adminShare.search({
					  "query":{
					  	"_id":$stateParams.id
					  },
					  "from":0,
					  "limit":1
				}).then(function(resp){
            		//返回信息
            		if(resp.data.data.total === 1){
            			$scope.dataMapped = resp.data.data.shares[0];
						desArea.empty();
						if(!!$scope.dataMapped.province){
							var designAreaQuery = $scope.dataMapped.province+" "+$scope.dataMapped.city+" "+$scope.dataMapped.district;
							desArea.find('input[name=where_area]').val(designAreaQuery)
							var designArea = new CitySelect({id :'where_area',"query":designAreaQuery});
						}else{
							desArea.find('input[name=where_area]').val("")
							var designArea = new CitySelect({id :'where_area'});
						}
            		}
            	},function(resp){
            		//返回错误信息
            		console.log(resp);
            	});
	            $scope.phoneChange = function(name){    //查找设计师
            		if(!name){
            			alert('请输入需要查找的设计师的手机号码或者名字');
            			return;
		            }else{
		            	$http({
		            		method : "POST",
		            		url : RootUrl+'api/v2/web/admin/search_designer',
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
	            	$scope.dataMapped.start_at = (new Date($scope.dataMapped.start_at)).getTime();
        			adminShare.update($scope.dataMapped).then(function(resp){
	            		//返回信息
	            		if(resp.data.msg === "success"){
	            			$location.path('live');
	            		}
	            	},function(resp){
	            		//返回错误信息
	            		console.log(resp);
	            	})
	            }
            }
        ])
        .controller('UpdataController', [    //更新装修直播
            '$scope','$rootScope','$stateParams','$http','$filter','$location','adminShare',
            function($scope, $rootScope, $stateParams,$http,$filter,$location,adminShare) {
            	$scope.processTime = {
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
            	$scope.processTime.today();
            	$scope.dec_flow = [
					{"num" :0,"name":'量房'},
					{"num" :1,"name":'开工'},
					{"num" :2,"name":'拆改'},
					{"num" :3,"name":'水电'},
					{"num" :4,"name":'泥木'},
					{"num" :5,"name":'油漆'},
					{"num" :6,"name":'安装'},
					{"num" :7,"name":'竣工'}];
				$scope.process = {};
            	adminShare.search({
					  "query":{
					  	"_id":$stateParams.id
					  },
					  "from":0,
					  "limit":1
				}).then(function(resp){
            		//返回信息
            		if(resp.data.data.total === 1){
            			$scope.shares = resp.data.data.shares[0];
            			var curId = parseInt($scope.shares.process[$scope.shares.process.length - 1].name);
            			$scope.process.processName = curId > $scope.shares.process.length-1 ? curId : curId + 1;
            			$scope.process.processDate = $filter('date')($scope.shares.process[$scope.shares.process.length - 1].date, 'yyyy-MM-dd');
            		}
            	},function(resp){
            		//返回错误信息
            		console.log(resp);
            	})
            	$scope.upDataLive = function(){
            		var aPreviewsItem = $('#j-file-list').find('.previews-item');
					var images = []
					aPreviewsItem.each(function(i,el){
						images.push($(el).data('imgid'))
					});

					for (var i = 0,len = $scope.shares.process.length; i < len; i++) {
						if(i != $scope.process.processName){
							$scope.shares.process.push({
						  		"name" : $scope.process.processName,
							  	"description" : $scope.process.processDescription,
							  	"date" : (new Date($scope.process.processDate)).getTime(),
							  	"images" : images
							});
							break;
						}else{
							$scope.shares.process[i] = $scope.shares.process[i];
							break;
						}
					};
					$scope.shares.process.sort(function(n,m){
						return n.name - m.name;
					})
					if($scope.shares.process[$scope.shares.process.length-1].name == 7){
						$scope.shares.progress = "1";
					}
					submitData()
        		}
        		$scope.deleteLive = function(){
        			console.log($scope.shares.process)
        			angular.forEach($scope.shares.process,function(value,key){
        				if(value.name == $scope.process.processName){
        					this.splice(key,1)
        					return;
        				}
        			},$scope.shares.process)
        			submitData();
        		}
        		function submitData(){
	            	adminShare.update($scope.shares).then(function(resp){
	            		//返回信息
	            		$location.path('live');
	            	},function(resp){
	            		//返回错误信息
	            		console.log(resp);
	            	})
        		}
            }
        ])
	    .directive('myLiveuploade',['$timeout',function($timeout){     //封面图片上传
          return {
              replace : true,
              scope: {
                myQuery : "="
              },
              restrict: 'A',
              template: '<div class="k-uploadbox clearfix"><div class="pic" id="create"><div class="fileBtn"><input class="hide" id="createUpload" type="file" name="upfile"><input type="hidden" id="sessionId" value="${pageContext.session.id}" /><input type="hidden" value="1215154" name="tmpdir" id="id_create"></div><div class="tips"><span><em></em><i></i></span><p>图片上传每张3M以内jpg<strong ng-if="mySection.length">作品/照片/平面图上均不能放置个人电话号码或违反法律法规的信息。</strong></p></div></div><div class="previews-item"><div class="img"><img class="img" src="/api/v2/web/thumbnail/168/{{myQuery}}" alt=""><div></div></div>',
              link: function($scope, iElm, iAttrs, controller){
                    var uploaderUrl = RootUrl+'api/v2/web/image/upload',
                      fileTypeExts = '*.jpg;*.png',
                      fileSizeLimit = 3072,
                      obj = angular.element(iElm);
                    $('#create').Huploadify({
                      auto:true,
                      fileTypeExts:fileTypeExts,
                      multi:false,
                      formData:{},
                      fileSizeLimit:fileSizeLimit,
                      showUploadedPercent:true,//是否实时显示上传的百分比，如20%
                      showUploadedSize:true,
                      removeTimeout:1,
                      fileObjName:'Filedata',
                      buttonText : "",
                      uploader:uploaderUrl,
                      onUploadComplete:function(file, data, response){
                        callbackImg(data)
                      }
                    });
                  function callbackImg(arr){
                    var data = $.parseJSON(arr);
                    var img = new Image();
                    img.onload=function(){
                      if(img.width < 500){
                      	alert('图片宽度小于500，请重新上传图片');
                      	return ;
                      }
                      if(img.height < 500){
                      	alert('图片高度小于500，请重新上传图片');
                      	return ;
                      }
                      $scope.$apply(function(){
                          $scope.myQuery = data.data
                       });
                    };
                    img.onerror=function(){alert("error!")};
                    img.src=RootUrl+'api/v2/web/image/'+data.data;
                  }

              }
          };
      }]);
})();
