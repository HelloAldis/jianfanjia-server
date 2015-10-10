(function() {
    angular.module('controllers')
        .filter('sexFilter', function () {   //性别筛选
            return function (input) {
                return {
                    "0":"男",
                    "1":"女"
                }[input];
            }
        })
        .filter('authTypeFilter', function () {    //设计师认证状态
            return function (input) {
                return {
                    "0":"未提交认证",
                    "1":"审核中",
                    "2":"审核通过",
                    "3":"审核不通过",
                    "4":"违规下线"
                }[input];
            }
        })
        .filter('decTypeFilter', function () {   //装修类别
            return function (input) {
                return {
                    "0":"家装",
                    "1":"商装",
                    "2":"软装"
                }[input];
            }
        })
        .filter('decStyleFilter', function () {   //擅长风格
            return function (input) {
                return {
                    "0":"欧式",
                    "1":"中式",
                    "2":"现代",
                    "3":"地中海",
                    "4":"美式",
                    "5":"东南亚",
                    "6":"田园"
                }[input];
            }
        })
        .filter('decDistrictsFilter', function () {     //接单区域
            return function (input) {
                return {
                    "0":"江岸区",
                    "1":"江汉区",
                    "2":"硚口区",
                    "3":"汉阳区",
                    "4":"武昌区",
                    "5":"洪山区",
                    "6":"青山区"
                }[input];
            }
        })
        .filter('designFeeRangeFilter', function () {     //设计费报价
            return function (input) {
                return {
                    "0":"50-100",
                    "1":"100-200",
                    "2":"200-300",
                    "3":"300以上"
                }[input];
            }
        })
        .filter('designTypeFilter', function () {     //习惯沟通方式
            return function (input) {
                return {
                    "0":"不限",
                    "1":"表达型",
                    "2":"聆听型"
                }[input];
            }
        })
        .filter('workTypeFilter', function () {     //习惯沟通方式
            return function (input) {
                return {
                    "0":"半包",
                    "1":"全包"
                }[input];
            }
        })
        .filter('houseTypeFilter', function () {     //意向接单户型
            return function (input) {
                return {
                    "0":"一居",
                    "1":"二室",
                    "2":"三室",
                    "3":"四室",
                    "4":"复式",
                    "5":"别墅",
                    "6":"LOFT",
                    "7":"其他"
                }[input];
            }
        })
        .controller('DesignerController', [     //设计师列表
            '$scope','$rootScope','$http','$filter',
            function($scope, $rootScope,$http,$filter) {
                /*
                参数：
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
                setPage(1,0,10);
                $scope.authType = undefined;
                $scope.uidAuthType = undefined;
                $scope.workAuthType = undefined;
                $scope.emailAuthType = undefined;
                $scope.authStatus = undefined;
                $scope.searchDesigner = undefined;
                $scope.form = 0;
                $scope.list = function () {
                    $scope.userList = [];
                    $scope.loadData = false;
                    $scope.form = (this.page.pageNo-1)*10
                    loadList();
                };
                $scope.loadData = false;
                function loadList(data){
                    var data = {
                            "query":{
                            },
                            "sort":{"_id": 1},
                            "from": $scope.form,
                            "limit":10
                        }
                    console.log($scope.authType,$scope.authStatus)
                    if(!!$scope.authType && !!$scope.authStatus){
                        data.query.auth_type = $scope.authStatus;
                    }
                    if(!!$scope.uidAuthType && !!$scope.authStatus){
                        data.query.uid_auth_type = $scope.authStatus;
                    }
                    if(!!$scope.workAuthType && !!$scope.authStatus){
                        data.query.work_auth_type = $scope.authStatus;
                    }
                    if(!!$scope.emailAuthType && !!$scope.authStatus){
                        data.query.email_auth_type = $scope.authStatus;
                    }
                    if(!!$scope.startTime && !!$scope.endTime){
                        data.query.create_at = {
                            "$gte":$filter('getTimesFilter')($scope.startTime),
                            "$lte":$filter('getTimesFilter')($scope.endTime)
                        }
                    }else{
                        data.query.create_at = undefined;
                    }
                    if(!!$scope.searchDesigner){
                        data.query.phone = $scope.searchDesigner
                    }else{
                       data.query.phone = undefined;
                    }
                    console.log(data)
                    $http({
                        method : "POST",
                        url : RootUrl+'api/v1/admin/search_designer',
                        data: data
                    }).then(function(resp){
                        //返回信息
                        $scope.userList = resp.data.data.designers;
                        angular.forEach($scope.userList, function(value, key){
                            if($scope.authType){
                                value.authDate = value.auth_date;
                                value.status = value.auth_type;
                            }else if($scope.uidAuthType){
                                value.authDate = value.uid_auth_date;
                                value.status = value.uid_auth_type;
                            }else if($scope.workAuthType){
                                value.authDate = value.work_auth_date;
                                value.status = value.work_auth_type;
                            }else if($scope.emailAuthType){
                                value.authDate = value.email_auth_date;
                                value.status = value.email_auth_type;
                            }
                        });
                        $scope.loadData = true;
                        setPage(1,resp.data.data.total,data.limit);
                    },function(resp){
                        //返回错误信息
                        $scope.loadData = false;
                        console.log(resp);
                    })
                };
                $scope.authList = [
                    {
                        id : "0",
                        name : '未提交认证',
                        cur : false
                    },
                    {
                        id : "1",
                        name : '审核中',
                        cur : false 
                    },
                    {
                        id : "2",
                        name : '审核通过',
                        cur : false 
                    },
                    {
                        id : "3",
                        name : '审核不通过',
                        cur : false 
                    },
                    {
                        id : "4",
                        name : '违规下线',
                        cur : false 
                    }
                ]
                $scope.authStatusList = [
                    {
                        id : "0",
                        name : '个人资料认证',
                        cur : false,
                        auth : 'auth_type'
                    },
                    {
                        id : "1",
                        name : '身份证认证',
                        cur : false,
                        auth : 'uid_auth_type'
                    },
                    {
                        id : "2",
                        name : '实地认证',
                        cur : false,
                        auth : 'work_auth_type'
                    },
                    {
                        id : "3",
                        name : '邮箱认证',
                        cur : false,
                        auth : 'email_auth_type'
                    }
                ]
                $scope.authStatusBtn = function(id){
                    $scope.userList = [];
                    $scope.loadData = false;
                    angular.forEach($scope.authStatusList, function(value, key) {
                        if(value.id == id){
                            if(value.cur){
                                value.cur = false;
                                if(id == 0){
                                    $scope.authType = false;
                                }else if(id == 1){
                                    $scope.uidAuthType = false;
                                }else if(id == 2){
                                    $scope.workAuthType = false;
                                }else if(id == 3){
                                    $scope.emailAuthType = false;
                                }
                            }else{
                                value.cur = true;
                                if(id == 0){
                                    $scope.authType = true;
                                }else if(id == 1){
                                    $scope.uidAuthType = true;
                                }else if(id == 2){
                                    $scope.workAuthType = true;
                                }else if(id == 3){
                                    $scope.emailAuthType = true;
                                }
                            }
                        }
                    });
                    loadList()
                }
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
                    $scope.authStatus = id;
                    loadList()
                }
                $scope.forcedOffline = function(id){
                    if(confirm("你确定该设计师强制下线吗？")){
                        $http({   //获取数据
                            method : "POST",
                            url : RootUrl+'api/v1/admin/update_designer_online_status',
                            data : {
                                "designerid":id,
                                "new_oneline_status":"1"
                            }
                        }).then(function(resp){
                            //返回信息
                            console.log(resp);
                            promptMessage('强制下线成功',resp.data.msg)
                        },function(resp){
                            //返回错误信息
                            console.log(resp);
                            promptMessage('操作失败',resp.data.msg)
                        });
                    }
                };
                $scope.searchBtn = function(){   //搜索设计师
                    if(!!!$scope.searchDesigner){
                        alert('请输入名字或者手机号码')
                    }   
                    loadList()
                }
                $scope.searchTimeBtn = function(){
                    console.log(!!!$scope.startTime)
                    if(!!!$scope.startTime){
                        alert('请输入开始时间');
                    }
                    if(!!!$scope.endTime){
                        alert('请输入结束时间');
                    }
                    loadList()
                }
                loadList();
            }
        ])
        .controller('DesignerTeamController', [    //设计师的施工团队
            '$scope','$rootScope','$stateParams','$http','$filter','$location',
            function($scope, $rootScope, $stateParams,$http,$filter,$location) {
            	$http({   //获取数据
            		method : "POST",
            		url : RootUrl+'api/v1/admin/search_team',
                    data : {
                      "query":{
                        "designerid": $stateParams.id
                      },
                      "sort":{"_id": 1},
                      "from": 0,
                      "limit":1000
                    }
            	}).then(function(resp){
            		//返回信息
            		angular.forEach(resp.data.data.teams, function (data,key) {
            			console.log(data);
		               	data.area = !!data.province ? data.province+" "+data.city+" "+data.district : '未填写';
                        data.teamid = data._id+"?"+data.designerid
		            })
            		$scope.userList = resp.data.data.teams;
            		$scope.deleteTeam = function(id){
	            		if(confirm("你确定要删除吗？删除不能恢复")){
	            			alert('你没有权限删除');
	            		}else{
	            			alert(id);
	            		}
	            	}
            	},function(resp){
            		//返回错误信息
            		console.log(resp);
            		promptMessage('获取数据失败',resp.data.msg)
            	});
        	}
        ])
		.controller('DesignerEditorTeamController', [   //设计师编辑施工团队
            '$scope','$rootScope','$stateParams','$http','$filter','$location',
            function($scope, $rootScope, $stateParams,$http,$filter,$location) {
            	console.log($stateParams.id)
                $scope.teamid = $stateParams.id.split("?")[0];
                $scope.userUid = $stateParams.id.split("?")[1];
            	$http({   //获取数据
                    method : "POST",
                    url : RootUrl+'api/v1/admin/search_team',
                    data : {
                      "query":{
                        "_id" : $scope.teamid,
                        "designerid": $scope.userUid
                      },
                      "sort":{"_id": 1},
                      "from": 0,
                      "limit":1000
                    }
                }).then(function(resp){
                    //返回信息
                    $scope.team = resp.data.data.teams[0];
                    //所在地区
                    var desArea = $('#where_area');
                    desArea.empty();
                    if(!!$scope.team.province){
                        var designAreaQuery = $scope.team.province+" "+$scope.team.city+" "+$scope.team.district;
                        desArea.find('input[name=where_area]').val(designAreaQuery)
                        var designArea = new CitySelect({id :'where_area',"query":designAreaQuery});
                    }else{
                        desArea.find('input[name=where_area]').val("")
                        var designArea = new CitySelect({id :'where_area'});
                    }
                    $scope.teamSexs = [
                        {"id" : "0", "name":"男"},
                        {"id" : "1", "name":"女"}
                    ]
                    function findteamGoodAtsId(str){
                        return {"水电":"0","木工":"1","油工":"2","泥工":"3"}[str]
                    }
                    function findteamGoodAtsName(str){
                        return {"0":"水电","1":"木工","2":"油工","3":"泥工"}[str]
                    }
                    $scope.teamGoodAts = [
                        {"id" : "0", "name" : "水电"},
                        {"id" : "1", "name" : "木工"},
                        {"id" : "2", "name" : "油工"},
                        {"id" : "3", "name" : "泥工"}
                    ] 
                    $scope.team.good_at = findteamGoodAtsId($scope.team.good_at)
                    console.log(resp.data.data.teams[0]);
                    uploadFirl($('#upload'),true);
                    uploadFirl($('#upload1'),false);
                    function uploadFirl(obj,off){
                        obj.Huploadify({
                            auto:true,
                            fileTypeExts:'*.jpg;*.jpeg;*.png;',
                            multi:true,
                            formData:{key:123456,key2:'vvvv'},
                            fileSizeLimit:3072,
                            showUploadedPercent:false,
                            showUploadedSize:true,
                            removeTimeout:1,
                            fileObjName:'Filedata',
                            buttonText : "",
                            uploader:RootUrl+'api/v1/image/upload',
                            onUploadComplete:function(file, data, response){
                               var data = $.parseJSON(data);
                               if(off){
                                console.log(data.data)
                                    $scope.team.uid_image1 = data.data;
                                    $scope.$apply()
                               }else{
                                    $scope.team.uid_image2 = data.data;
                                    $scope.$apply()
                               }
                            }
                        });
                    }
                    $scope.upDataTeam = function(){
                        $scope.team.good_at = findteamGoodAtsName($scope.team.good_at)
                        console.log($scope.team)
                        $http({   //获取数据
                            method : "POST",
                            url : RootUrl+'api/v1/admin/update_team',
                            data : $scope.team
                        }).then(function(resp){
                            //返回信息
                            console.log(resp);
                            $location.path('designer/team/'+$scope.userUid);   //设置路由跳转
                        },function(resp){
                            //返回错误信息
                            console.log(resp);
                            promptMessage('获取数据失败',resp.data.msg)
                        });
                    }
                },function(resp){
                    //返回错误信息
                    console.log(resp);
                    promptMessage('获取数据失败',resp.data.msg)
                });
        	}
        ])
        .controller('DesignerProductController', [   //设计师作品集
            '$scope','$rootScope','$http','$stateParams','$modal',
            function($scope, $rootScope,$http,$stateParams,$modal) {
                $scope.authType = "1"  //全局标识，解决筛选和分页问题
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
                    loadList({
                      "from": (this.page.pageNo-1)*10,
                    })
                };
                $scope.loadData = false;
                function loadList(data){
                    var data = angular.extend({
                          "query":{
                            "auth_type": $scope.authType,
                            "designerid":$stateParams.id
                          },
                          "sort":{"_id": 1},
                          "from": 0,
                          "limit":10
                        },data)
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
                $scope.authList = [
                    {
                        id : "1",
                        name : '审核通过',
                        cur : true 
                    },
                    {
                        id : "0",
                        name : '未通过',
                        cur :  false
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
                            value.cur = true;
                        }else{
                            value.cur = false;
                        }
                    });
                    $scope.authType = id;
                    loadList({
                        "query":{
                            "auth_type": id,
                            "designerid":$stateParams.id
                        }
                    })
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
        .controller('DesignerInfoController', [  //设计师个人信息
            '$scope','$rootScope','$http','$stateParams',
            function($scope, $rootScope,$http,$stateParams) {
                $http({   //获取数据
                    method : "GET",
                    url : RootUrl+'api/v1/admin/designer/'+$stateParams.id
                }).then(function(resp){
                    //返回信息
                    $scope.user = resp.data.data;
                    $scope.head_img1 = $scope.user.imageid ? RootUrl+'api/v1/thumbnail/200/'+$scope.user.imageid : 'jyz/img/headpic.jpg';
                    $scope.head_img2 = $scope.user.big_imageid ? RootUrl+'api/v1/thumbnail/500/'+$scope.user.big_imageid : 'jyz/img/headpic.jpg';
                    $scope.uid_img1 = $scope.user.uid_image1 ? RootUrl+'api/v1/thumbnail/300/'+$scope.user.uid_image1 : "";
                    $scope.uid_img2 = $scope.user.uid_image2 ? RootUrl+'api/v1/thumbnail/300/'+$scope.user.uid_image2 : "";
                    $scope.bank_img1 = $scope.user.bank_card_image1 ? RootUrl+'api/v1/thumbnail/300/'+$scope.user.bank_card_image1 : "";
                    console.log($scope.user);
                },function(resp){
                    //返回错误信息
                    console.log(resp);
                    promptMessage('获取数据失败',resp.data.msg)
                })
            }
        ])
        .controller('DesignerInfoAuthController', [   //设计师信息认证
            '$scope','$rootScope','$http','$stateParams','$location',
            function($scope, $rootScope,$http,$stateParams,$location) {
                $http({   //获取数据
                    method : "GET",
                    url : RootUrl+'api/v1/admin/designer/'+$stateParams.id
                }).then(function(resp){
                    //返回信息
                    $scope.user = resp.data.data;
                    $scope.head_img1 = $scope.user.imageid ? RootUrl+'api/v1/thumbnail/200/'+$scope.user.imageid : 'jyz/img/headpic.jpg';
                    $scope.head_img2 = $scope.user.big_imageid ? RootUrl+'api/v1/thumbnail/500/'+$scope.user.big_imageid : 'jyz/img/headpic.jpg';
                    console.log($scope.user);
                },function(resp){
                    //返回错误信息
                    console.log(resp);
                    promptMessage('获取数据失败',resp.data.msg)
                })
                $scope.success = function(type){
                    if(confirm("你确定要操作吗？")){
                        if(type == "2"){
                            msg = '认证成功';
                        }else{
                            if(!!$scope.errorMsg){
                                msg = $scope.errorMsg;
                            }else{
                                alert('请填写未认证通过原因');
                                return;
                            }
                        }
                        $http({   //获取数据
                            method : "POST",
                            url : RootUrl+'api/v1/admin/update_basic_auth',
                            data : {
                                "_id": $stateParams.id,
                                "new_auth_type":type,
                                "auth_message" : msg 
                            }
                        }).then(function(resp){
                            //返回信息
                            $location.path('designer');   //设置路由跳转
                        },function(resp){
                            //返回错误信息
                            console.log(resp);
                            promptMessage('获取数据失败',resp.data.msg)
                        })
                    }
                }
            }
        ])
        .controller('DesignerIdAuthController', [   //设计师身份证认证
            '$scope','$rootScope','$http','$stateParams','$location',
            function($scope, $rootScope,$http,$stateParams,$location) {
                $http({   //获取数据
                    method : "GET",
                    url : RootUrl+'api/v1/admin/designer/'+$stateParams.id
                }).then(function(resp){
                    //返回信息
                    console.log(resp);
                    $scope.user = resp.data.data;
                    $scope.uid_img1 = $scope.user.uid_image1 ? RootUrl+'api/v1/thumbnail/300/'+$scope.user.uid_image1 : "";
                    $scope.uid_img2 = $scope.user.uid_image2 ? RootUrl+'api/v1/thumbnail/300/'+$scope.user.uid_image2 : "";
                    $scope.bank_img1 = $scope.user.bank_card_image1 ? RootUrl+'api/v1/thumbnail/300/'+$scope.user.bank_card_image1 : "";
                },function(resp){
                    //返回错误信息
                    console.log(resp);
                    promptMessage('获取数据失败',resp.data.msg)
                })
                $scope.success = function(type){
                    if(confirm("你确定要操作吗？")){
                        if(type == "2"){
                            msg = '认证成功';
                        }else{
                            if(!!$scope.errorMsg){
                                msg = $scope.errorMsg;
                            }else{
                                alert('请填写未认证通过原因');
                                return;
                            }
                        }
                        $http({   //获取数据
                            method : "POST",
                            url : RootUrl+'api/v1/admin/update_uid_auth',
                            data : {
                                "_id": $stateParams.id,
                                "new_auth_type":type,
                                "auth_message" : msg 
                            }
                        }).then(function(resp){
                            //返回信息
                            $location.path('designer');   //设置路由跳转
                        },function(resp){
                            //返回错误信息
                            console.log(resp);
                            promptMessage('获取数据失败',resp.data.msg)
                        })
                    }
                }
            }
        ])
        .controller('DesignerFieldAuthController', [   //设计师实地认证
            '$scope','$rootScope','$http','$stateParams','$location',
            function($scope, $rootScope,$http,$stateParams,$location) {
                $scope.success = function(type){
                    if(confirm("你确定要操作吗？")){
                        if(type == "2"){
                            msg = '认证成功';
                        }else{
                            if(!!$scope.errorMsg){
                                msg = $scope.errorMsg;
                            }else{
                                alert('请填写未认证通过原因');
                                return;
                            }
                        }
                        $http({   //获取数据
                            method : "POST",
                            url : RootUrl+'api/v1/admin/update_work_auth',
                            data : {
                                "_id": $stateParams.id,
                                "new_auth_type":type,
                                "auth_message" : msg 
                            }
                        }).then(function(resp){
                            //返回信息
                            $location.path('designer');   //设置路由跳转
                        },function(resp){
                            //返回错误信息
                            console.log(resp);
                            promptMessage('获取数据失败',resp.data.msg)
                        })
                    }    
                }
            }
        ]);
})();
