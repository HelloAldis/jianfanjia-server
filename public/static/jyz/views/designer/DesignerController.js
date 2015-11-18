(function() {
    angular.module('controllers')
        .controller('DesignerController', [     //设计师列表
            '$scope','$rootScope','$uibModal','adminDesigner',
            function($scope, $rootScope,$uibModal,adminDesigner) {
                //全局标识，解决筛选和分页问题
                $scope.authType = undefined; 
                $scope.uidAuthType = undefined;
                $scope.workAuthType = undefined;
                $scope.emailAuthType = undefined;
                $scope.authStatus = undefined;
                $scope.phone = undefined;
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
                    var start = new Date($scope.startTime.time+"00:00:00").getTime();
                    var end = new Date($scope.endTime.time+"00:00:00").getTime();
                    if(start > end){
                        alert('开始时间比结束时间大，请重新选择');
                        return ;
                    }if(end-start < 86400000){
                        alert('结束时间必须必比开始时间大一天，请重新选择');
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
                                phone : $scope.phone,
                                create_at : $scope.createAt
                            },
                            "from": (limit === undefined ? 0 : limit)*(from-1),
                            "limit":(limit === undefined ? undefined : limit)
                        };
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
                    adminDesigner.search(data).then(function(resp){
                        if(resp.data.data.total === 0){
                            $scope.loading.loadData = true;
                            $scope.loading.notData = true;
                        }else{
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
                //搜索设计师
                $scope.searchBtn = function(){ 
                    $scope.phone = $scope.searchDesigner;
                    $scope.userList = undefined;
                    $scope.pagination.currentPage = 1;
                    loadList(1);
                }
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
                    if(!!$scope.authStatus){
                        $scope.userList = [];
                        $scope.loadData = false;
                    }
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
                    if(!!$scope.authStatus){
                        $scope.pagination.currentPage = 1;
                        loadList(1)
                    }                   
                }
                $scope.authBtn = function(id){
                    $scope.userList = [];
                    $scope.loadData = false;
                    $scope.pagination.currentPage = 1;
                    angular.forEach($scope.authList, function(value, key) {
                        if(value.id == id){
                            if(value.cur){
                                value.cur = false;
                                $scope.authStatus = undefined;
                                loadList(1,10);
                            }else{
                                value.cur = true;
                                $scope.authStatus = id;
                                loadList(1)
                            }
                        }else{
                            value.cur = false;
                        }
                    });                    
                }
                //重置清空状态
                $scope.clearStatus = function(){
                    $scope.userList = [];
                    $scope.loadData = false;
                    $scope.authType = undefined; 
                    $scope.uidAuthType = undefined;
                    $scope.workAuthType = undefined;
                    $scope.emailAuthType = undefined;
                    $scope.authStatus = undefined;
                    $scope.phone = undefined;
                    $scope.createAt = undefined;
                    angular.forEach($scope.authList, function(value, key) {
                        value.cur = false;
                    });
                    angular.forEach($scope.authStatusList, function(value, key) {
                        value.cur = false;
                    });
                    $scope.pagination.currentPage = 1;
                    $scope.startTime.time = '';
                    $scope.endTime.time = '';
                    loadList(1,10);
                }
                //设计师强制下线
                $scope.forcedOffline = function(id,status){
                    status = status == 0 ? "1" : "0"
                    if(confirm("你确定该设计师强制下线吗？")){
                        adminDesigner.online({
                                "designerid":id,
                                "new_oneline_status":status
                            }).then(function(resp){
                                if(resp.data.msg === "success"){
                                    tipsMsg('操作成功');
                                    loadList(1,10);
                                }
                        },function(resp){
                            console.log(resp);
                        });
                    }
                };
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
                        name : '未审核',
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
                    $scope.uid_img1 = $scope.user.uid_image1 ? RootUrl+'api/v1/thumbnail/800/'+$scope.user.uid_image1 : "";
                    $scope.uid_img2 = $scope.user.uid_image2 ? RootUrl+'api/v1/thumbnail/800/'+$scope.user.uid_image2 : "";
                    $scope.bank_img1 = $scope.user.bank_card_image1 ? RootUrl+'api/v1/thumbnail/800/'+$scope.user.bank_card_image1 : "";
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
                    $scope.uid_img1 = $scope.user.uid_image1 ? RootUrl+'api/v1/thumbnail/800/'+$scope.user.uid_image1 : "";
                    $scope.uid_img2 = $scope.user.uid_image2 ? RootUrl+'api/v1/thumbnail/800/'+$scope.user.uid_image2 : "";
                    $scope.bank_img1 = $scope.user.bank_card_image1 ? RootUrl+'api/v1/thumbnail/800/'+$scope.user.bank_card_image1 : "";
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
