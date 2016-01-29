(function() {
    angular.module('controllers')
        .controller('NewsController', ['$scope','$rootScope','adminArticle',function($scope, $rootScope,adminArticle){
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
                adminArticle.search(data).then(function(resp){
                    if(resp.data.data.total === 0){
                        $scope.loading.loadData = true;
                        $scope.loading.notData = true;
                    }else{
                        $scope.userList = resp.data.data.articles;
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
               adminArticle.upload({"_id": id,"status":status}).then(function(resp){
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
        .controller('NewsAddController', ['$scope','$rootScope','$stateParams','$state','adminArticle',function($scope, $rootScope,$stateParams,$state,adminArticle){
              var currentId = $stateParams.id == undefined ? "" : $stateParams.id;
              $scope.article_type = [
                {"num" :0,"name":'大百科'},
                {"num" :1,"name":'小贴士'},
              ];
              $scope.news = {
                "title":"",
                "keywords":"",
                "cover_imageid": undefined,
                "description":"",
                "content":"",
                "articletype":"1"
              }
              if(currentId){
                adminArticle.search({
                  "query":{
                      "_id" : currentId
                  },
                  "from": 0,
                  "limit":1
                }).then(function(resp){
                     if(resp.data.data.total === 1){
                        $scope.news = resp.data.data.articles[0];
                        if($scope.news.keywords.indexOf(",") != -1){
                            $scope.news.keywords = $scope.news.keywords.split(",").join("|");
                        }
                     }
                 },function(resp){
                     //返回错误信息
                     $scope.loadData = false;
                     console.log(resp);

                 });
              }
              $scope.cancel = function(){
                $state.go('news');
              }
              $scope.newsUeditor = function(){
                  if($scope.news.keywords.indexOf("|") != -1){
                      $scope.news.keywords = $scope.news.keywords.split("|").join(",");
                  }
                  if(!currentId){
                      adminArticle.add($scope.news).then(function(resp){
                         if(resp.data.msg === "success"){
                            $state.go('news')
                         }
                     },function(resp){
                         //返回错误信息
                         $scope.loadData = false;
                         console.log(resp);
                     });
                  }else{
                    adminArticle.upload($scope.news).then(function(resp){
                         if(resp.data.msg === "success"){
                            $state.go('news')
                         }
                     },function(resp){
                         //返回错误信息
                         $scope.loadData = false;
                          console.log(resp);
                     });
                  }
              }            
        }])
        .directive('myNewsuploade',['$timeout',function($timeout){     //封面图片上传
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
                       if(img.width < 820){
                        alert('图片宽度小于820，请重新上传图片');
                        return ;
                      }
                      if(img.height < img.width*0.43){
                        alert('图片高度小于'+img.width*0.43+'，请重新上传图片');
                        return ;
                      }
                      $scope.$apply(function(){
                          $scope.myQuery = data.data
                       });
                    };  
                    img.onerror=function(){alert("error!")};  
                    img.src=RootUrl+'api/v1/image/'+data.data;
                  }
              }
          };
      }]);
})();
