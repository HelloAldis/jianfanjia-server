(function() {
    angular.module('controllers')
        .controller('PicturesListController', ['$scope','$rootScope','adminImage',function($scope, $rootScope,adminImage){
             //全局标识，解决筛选和分页问题
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
                 var start = new Date($scope.startTime.time).getTime();
                 var end = new Date($scope.endTime.time).getTime();
                 if(start > end){
                     alert('开始时间比结束时间大，请重新选择');
                     return ;
                 }if(end-start < 86400000){
                     alert('结束时间必须必比开始时间大一天，请重新选择');
                     return ;
                 }
                 $scope.userList = undefined;
                 $scope.loading.loadData = false;
                 $scope.loading.notData = false;
                 $scope.pagination.currentPage = 1;
                 $scope.createAt = {
                     "$gte":start,
                     "$lte":end
                 };
                 loadList(1);
             };
             //加载数据
             function loadList(from,limit){
                 from = (limit === undefined ? 0 : limit)*(from-1);
                 limit = limit || undefined;
                 var data = {
                         "query":{
                             phone : $scope.phone,
                             create_at : $scope.createAt
                         },
                         "from": from,
                         "limit": limit
                     };
                 adminImage.search(data).then(function(resp){
                     if(resp.data.data.total === 0){
                         $scope.loading.loadData = true;
                         $scope.loading.notData = true;
                     }else{
                         $scope.userList = resp.data.data.beautifulImages;
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
             //重置清空状态
             $scope.clearStatus = function(){
                 $scope.userList = [];
                 $scope.loadData = false;
                 $scope.phone = undefined;
                 $scope.createAt = undefined;
                 $scope.pagination.currentPage = 1;
                 $scope.startTime.time = '';
                 $scope.endTime.time = '';
                 loadList(1);
             }
             //更改显示状态
             $scope.changeStatus = function(id,status){
                status = status == 0 ? "1" : "0";
                adminImage.upload({"_id": id,"status":status}).then(function(resp){
                     if(resp.data.msg === "success"){
                        loadList(1,10);
                     }
                 },function(resp){
                     //返回错误信息
                     $scope.loadData = false;
                     console.log(resp);
                 });
             }
        }])
        .controller('PicturesAddController', ['$scope','$rootScope','$stateParams','$state','adminImage',function($scope, $rootScope,$stateParams,$state,adminImage){
              var currentId = $stateParams.id == undefined ? "" : $stateParams.id;
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
              $scope.section = ['厨房','客厅','卫生间','卧室','餐厅','书房','玄关','阳台','儿童房','走廊','储物间']
              $scope.images = {
                "title":"",
                "description":"",
                "dec_type":"0",
                "house_type":"0",
                "dec_style":"0",
                "images":[],
                "section" : '厨房'
              }
              if(currentId){
                adminImage.search({
                  "query":{
                      "_id" : currentId
                  },
                  "from": 0,
                  "limit":1
                }).then(function(resp){
                     if(resp.data.data.total === 1){
                        $scope.images = resp.data.data.beautifulImages[0];
                        if($scope.images.keywords.indexOf(",") != -1){
                            $scope.images.keywords = $scope.images.keywords.split(",").join("|");
                        }
                     }
                 },function(resp){
                     //返回错误信息
                     $scope.loadData = false;
                     console.log(resp);

                 });
              }
              $scope.cancel = function(){
                $state.go('pictures');
              }
              $scope.picturesSubmit = function(){
                  if($scope.images.keywords.indexOf("|") != -1){
                    $scope.images.keywords = $scope.images.keywords.split("|").join(",");
                  }
                  if(!currentId){
                      adminImage.add($scope.images).then(function(resp){
                         if(resp.data.msg === "success"){
                            $state.go('pictures')
                         }
                     },function(resp){
                         //返回错误信息
                         $scope.loadData = false;
                         console.log(resp);
                     });
                  }else{
                    adminImage.upload($scope.images).then(function(resp){
                         if(resp.data.msg === "success"){
                            $state.go('pictures')
                         }
                     },function(resp){
                         //返回错误信息
                         $scope.loadData = false;
                          console.log(resp);
                     });
                  }
              }            
        }])
      .directive('myProductuploade',['$timeout',function($timeout){     //作品图片上传
          return {
              replace : true,
              scope: {
                myQuery : "="
              },
              restrict: 'A',
              template: '<div class="k-uploadbox clearfix"><div class="pic" id="create"><div class="fileBtn"><input class="hide" id="createUpload" type="file" name="upfile"><input type="hidden" id="sessionId" value="${pageContext.session.id}" /><input type="hidden" value="1215154" name="tmpdir" id="id_create"></div><div class="tips"><span><em></em><i></i></span><p>图片上传每张3M以内jpg<strong ng-if="mySection.length">作品/照片/平面图上均不能放置个人电话号码或违反法律法规的信息。</strong></p></div></div><div class="previews-item" ng-repeat="img in myQuery"><span class="close" ng-click="removeImg($index,myQuery)"></span><div class="img"><img class="img" src="/api/v2/web/thumbnail/168/{{img.imageid}}" alt=""><div><div class="selecte"><input type="text" class="form-control" ng-model="img.name" /></div></div></div>',
              link: function($scope, iElm, iAttrs, controller){
                    var uploaderUrl = RootUrl+'api/v2/web/image/upload',
                      fileTypeExts = '*.jpg;*.png',
                      fileSizeLimit = 3072,
                      obj = angular.element(iElm);
                    $('#create').Huploadify({
                      auto:true,
                      fileTypeExts:fileTypeExts,
                      multi:true,
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
                      if($scope.myQuery.indexOf(data.data) == -1){
                        $scope.$apply(function(){
                          $scope.myQuery.push({"imageid":data.data,"width":img.width,"height":img.height})
                        });
                      }else{
                        alert('已经上传过了')
                      }
                    };  
                    img.onerror=function(){alert("error!")};  
                    img.src=RootUrl+'api/v1/image/'+data.data;
                  }
                  $scope.removeImg = function(i,arr){
                    if(arr.length < 2){
                      alert('至少保留一张图片');
                      return ;
                    }
                    if(confirm("你确定要删除吗？删除不能恢复")){
                      arr.splice(i,1)
                      $timeout(function () {
                        $scope.myQuery = arr
                      }, 0, false);
                    }
                  }
              }
          };
      }])
})();
