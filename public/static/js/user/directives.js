'use strict';
// 公用指令
angular.module('directives', [])
   .directive('mySelect',['$timeout',function($timeout){     //自定义下拉框
        return {
            replace : true,
            scope: {
                    myList : "=",
                    myQuery : "="
            },
            restrict: 'A',
            template: '<div class="k-select" ng-click="openSelect($event)" ng-mouseout="closeSelect()"><ul class="select" ng-mouseover="closeTimer()"><li ng-repeat="d in myList"><a href="javascript:;" val="{{d.id}}" ng-click="select(d.id,$event)">{{d.name}}</a></li></ul><div class="option"><span class="value" ng-repeat="d in myList | filter:myQuery">{{d.name}}</span><span class="arrow"><em></em><i></i></span></div></div>',
            link: function($scope, iElm, iAttrs, controller) {
                var obj = angular.element(iElm),
                    oUl = obj.find('ul');
                   angular.element(document).on('click',function(){
                        oUl.css('display','none');
                   })
                   var timer = null;
                   $scope.openSelect = function($event){
                        $event.stopPropagation()
                        oUl.css('display','block');
                        obj.css('zIndex',20);
                        clearTimeout(timer)
                   }
                   $scope.closeSelect = function(){
                        clearTimeout(timer)
                        timer = setTimeout(function(){
                          oUl.css('display','none');
                          obj.css('zIndex',10);
                        },500)
                   }
                   $scope.closeTimer = function(){
                      clearTimeout(timer)
                   }
                   $scope.select = function(id,$event){
                        $scope.myQuery = id;
                        $event.stopPropagation()
                        oUl.css('display','none');
                        obj.css('zIndex',10);
                   }
            }
        };
    }])
    .directive('mySelecte',['$timeout',function($timeout){     //自定义下拉框带编写功能
        return {
            replace : true,
            scope: {
                    myList : "=",
                    myQuery : "="
            },
            restrict: 'A',
            template: '<div class="k-select" ng-click="openSelect($event)" ng-mouseout="closeSelect()"><ul class="select" ng-mouseover="closeTimer()"><li ng-repeat="d in myList"><a href="javascript:;" ng-click="select(d.name,$event)">{{d.name}}</a></li></ul><div class="editor"><input class="value" ng-model="myQuery"><span class="arrow"><em></em><i></i></span></div></div>',
            link: function($scope, iElm, iAttrs, controller) {
                var obj = angular.element(iElm),
                       oUl = obj.find('ul');
                   angular.element(document).on('click',function(){
                        oUl.css('display','none');
                   })
                   var timer = null;
                   $scope.openSelect = function($event){
                        $event.stopPropagation()
                        oUl.css('display','block');
                        obj.css('zIndex',20);
                        clearTimeout(timer)
                   }
                   $scope.closeSelect = function(){
                        clearTimeout(timer)
                        timer = setTimeout(function(){
                          oUl.css('display','none');
                          obj.css('zIndex',10);
                        },500)
                   }
                   $scope.closeTimer = function(){
                      clearTimeout(timer)
                   }
                   $scope.select = function(name,$event){
                        $scope.myQuery = name;
                        $event.stopPropagation()
                        oUl.css('display','none');
                        obj.css('zIndex',10);
                   }
            }
        };
    }])
    .directive('myStylepic',['$timeout',function($timeout){     //装修风格
        return {
            replace : true,
            scope: {
                    myList : "=",
                    myQuery : "="
            },
            restrict: 'A',
            template: '<div class="stylePic"><div class="pic"><ul></ul></div><div class="toggle"><a href="javascript:;" class="btns prev"><i>左</i><span></span></a><a href="javascript:;" class="btns next"><i>右</i><span></span></a></div><p class="text">正在加载中。。。</p></div>',
            link: function($scope, iElm, iAttrs, controller) {
                var obj = angular.element(iElm),
                   oUl = obj.find('ul'),
                   oPrev = obj.find('.prev'),
                   oNext = obj.find('.next'),
                   oText = obj.find('.text'),
                   arr = $scope.myList,
                   len = arr.length,
                   picWidth = obj.width(),
                   str = '',
                   iNum = parseInt($scope.myQuery);
              angular.forEach(arr,function(value, key){
                  str += '<li><img src="'+value.url+'" alt="'+value.txt+'" /></li>'
              })
              oUl.html(str)
              var aLi = oUl.find('li');
                oUl.width(len*picWidth)
                oPrev.on('click',function(){
                    if(iNum == 0){
                        iNum = len
                    }
                    iNum--;
                    $scope.myQuery = iNum;
                    fnMove()
                })
                oNext.on('click',function(){
                    if(iNum == len-1){
                        iNum = -1
                    }
                    iNum++;
                    $scope.myQuery = iNum;
                    fnMove()
                })
                function fnMove(){
                    oUl.stop().animate({left:-iNum*picWidth})
                    oText.html(arr[iNum].txt)
                } 
                function fnMove2(){
                  oUl.css({left:-iNum*picWidth});
                  oText.html(arr[iNum].txt);
                  $scope.myQuery = iNum;
                }
                fnMove2()
            }
        };
    }])
    .directive('myCities',['$timeout',function($timeout){     //自定义地区选择控件
        return {
            replace : true,
            scope: {
                    myList : "=",
                    myProvince : "=",
                    myCity : "=",
                    myDistrict : "="
            },
            restrict: 'A',
            template: '<div class="k-cities" ng-click="openSelect($event)" ng-mouseout="closeSelect()"><ul class="select" ng-mouseover="closeTimer()"><li ng-repeat="d in myList"><a href="javascript:;" ng-click="select(d.name,$event)">{{d.name}}</a></li></ul><div class="editor"><input class="value" ng-model="myQuery" /><span class="arrow"><em></em><i></i></span></div></div>',
            link: function($scope, iElm, iAttrs, controller) {
               var areaJson = $scope.myList,
                   oProvince = $scope.myProvince,
                   oCity = $scope.myCity,
                   oDistrict = $scope.myDistrict,
                   oBox = angular.element(iElm),
                   bOFF = false,
                   bOff = false,
                   Default = [
                    {
                      en : 'province',
                      cn : '请选择省',
                      num : '1'
                    },
                    {
                      en : 'city',
                      cn : '请选择市',
                      num : '110000'
                    },
                    {
                      en : 'district',
                      cn : '请选择县/区',
                      num : '110100'
                    }
                  ];
               // 渲染dom
                Default[0].cn = oProvince;
                Default[1].cn = oCity;
                Default[2].cn = oDistrict;
                var selectData = '';
                for (var i = 0; i < Default.length; i++) {
                    var selectDataInput = '';
                    var selectDataOption = '';
                    for (var j = 0; j < 1; j++) {
                      selectDataInput += '<input type="hidden" name="'+Default[i].en+'" value="" />';
                      selectDataOption += '<div class="option"><span class="value">'+Default[i].cn+'</span><span class="arrow"><em></em><i></i></span></div>'
                    };
                    selectData += '<div class="list '+Default[i].en+'">'+selectDataInput+selectDataOption+'</div>';
                    if(Default[0].cn != '请选择省'){
                      for(var attr in areaJson){
                        if(Default[i].cn == areaJson[attr][0]){
                          Default[i].num = areaJson[attr][1];
                        }
                      }
                    }
                    
                };
                oBox.html(selectData)
                //oUl = obj.find('ul');
                var province = oBox.find('.province'),
                    city = oBox.find('.city'),
                    district = oBox.find('.district'),
                    body = angular.element(document),
                    listArr = [province,city,district];
                for (var i = 0; i < 3; i++) {
                  createList(Default[i].num,listArr[i]);
                  selectEvent(listArr[i]);
                  optionEvevt(listArr[i]);
                };  
                // 渲染城市数据
                function createList(id,obj){
                    obj.find('select').remove();
                    var sHtml = '<ul class="select">';
                    for (var i in areaJson) {
                      if (areaJson[i][1] == id) {
                          sHtml += '<li data-val="'+i+'"><a>'+areaJson[i][0]+'</a></li>';
                      }
                    }
                    sHtml += '</ul>';
                    obj.append(sHtml)
                }
                function optionEvevt(obj){
                    var self = this;
                    var option = obj.find('.option');
                    var value = option.find('.value').html();
                    option.on('click' , function(ev){
                      body.click();
                      if(value != "请选择省" && obj == province){
                        bOFF = true;
                        bOff = false;
                      }
                      if(obj == city && value != "请选择市"){
                        bOff = true;
                      }
                      if(!bOFF && obj == city){
                        if(self.list1.find('.value').html() == "请选择省"){
                          alert('请先选择省');
                          return false;
                        }
                      }
                      if(!bOFF && !bOff){
                        if(obj == district && city.find('.value').html() == "请选择市"){
                          alert('请先选择市');
                          return false;
                        }
                      }
                      //self.tips.addClass('hide');
                      selectShow(obj);
                      return false;
                    });
                  }
                   function selectEvent(obj){
                    var  oInput = obj.find('input'),
                       oOption = obj.find('.option').find('.value');
                    body.click();
                    obj.delegate('li', 'click' , function(ev){
                      ev.stopPropagation();
                      var dataVal = $(this).data('val'),
                        value = $(this).find('a').text();
                        oInput.val(value).data("val",dataVal);
                        oOption.html(value);
                        if(obj == province){
                          $scope.myProvince = value;
                          city.find('.select').remove();
                          createList(dataVal,city)
                          selectShow(city)
                          selectHide(district)
                          selectHide(province)
                          clearValue(city);
                          clearValue(district);
                        }
                        if(obj == city){
                          $scope.myCity = value;
                          district.find('.select').remove();
                          createList(dataVal,district)
                          selectShow(district)
                          selectHide(city)
                          clearValue(district);
                        }
                        if(obj == district){
                          $scope.myDistrict = value;
                          selectHide(district)
                        }
                    });
                  }
                  body.on('click', function(ev){
                      selectHide(); 
                  });
                  function clearValue(obj){
                    var oInput = obj.find('input'),
                      oOption = obj.find('.option').find('.value');
                      if(obj == city){
                        oInput.val('市');
                        oOption.html('请选择市');
                      }
                      if(obj == district){
                        oInput.val('县/区');
                        oOption.html('请选择县/区');
                      }
                  }
                  function selectHide(obj){
                    oBox.each(function(index, el) {
                      if(obj){
                        $(el).find(obj).find('.select').hide();
                      }else{
                        $(el).css('zIndex',5).find('.select').hide();
                      }
                    });
                  }
                  function selectShow(obj){
                    obj.find('.select').show(); 
                    oBox.css('zIndex',20)
                  }
                   /*var timer = null;
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
                   $scope.select = function(name,$event){
                        $scope.myQuery = name;
                   $scope.select = function(id,$event){
                        $scope.myQuery = id;
                        $event.stopPropagation()
                        oUl.css('display','none');
                        obj.css('zIndex',100);
                   }*/
            }
        };
    }])
    .directive('myUpload',['$timeout',function($timeout){     //头像裁切上传
        return {
            replace : true,
            scope: {
                    myQuery : "="
            },
            restrict: 'A',
            template: '<div class="pic" id="upload"><div class="fileBtn"><input class="hide" id="fileToUpload" type="file" name="upfile"><input type="hidden" id="sessionId" value="${pageContext.session.id}" /><input type="hidden" value="1215154" name="tmpdir" id="id_file"></div><img class="img" id="userHead" alt="头像" /></div>',
            link: function($scope, iElm, iAttrs, controller){
                var $userHead = $('#userHead'),
                    $cropMask = $('#j-cropMask'),
                    $cropBox = $('#j-cropBox'),
                    $cropbox = $cropBox.find('.cropBox'),
                    $cropBorder = $('#cropBorder'),
                    $winW = $(window).width(),
                    $winH = $(window).height(),
                    uploaderUrl = RootUrl+'api/v2/web/image/upload',
                    croploaderUrl = RootUrl+'api/v2/web/image/crop',
                    fileTypeExts = '*.jpg;*.png',
                    fileSizeLimit = 1024,
                    destroy = true,
                    moveout = false,
                    disX,
                    disY;
                if(!$scope.myQuery){
                  $userHead.attr('src','../../../static/img/user/headPic.png')
                }else{
                  $userHead.attr('src',RootUrl+'api/v2/web/thumbnail/120/'+$scope.myQuery)
                }
                $cropBorder.on('mousedown',function(e){
                    disX = e.clientX - parseInt($(this).css("left"));
                    disY = e.clientY - parseInt($(this).css("top"));
                    $cropBox.on('mousemove',function(e){
                        var l = e.clientX - disX,
                            t = e.clientY - disY,
                            w = $cropBox.width() - $cropBorder.width(),
                            h = $cropBox.height() - $cropBorder.height();
                        if(t<0){
                          t=0;
                        }else if(t>h){
                          t=h;
                        } 
                              if(l<0){
                           l=0;
                        }else if(l>w){
                              l=w;     
                        }
                        $cropBorder.css({
                            left: l,
                            top: t
                        });
                        var r = 300 +l,
                            b = 300 + t;
                        $('#cropPic2').css('clip','rect('+t+'px '+r+'px '+b+'px '+l+'px)')
                        moveout = false;
                    }).on('mouseout',function(e){
                        $cropBox.off() 
                    }).on('mouseup',function(e){
                        $cropBox.off()
                    });
                    return false;
                })
                if(checkSupport() === "html5"){
                  $('#upload').Huploadify({
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
                }else{
                  $('#fileToUpload').uploadify({
                      'auto'     : true,
                      'removeTimeout' : 1,
                        'swf'      : 'uploadify.swf',
                        'uploader' : uploaderUrl,
                        'method'   : 'post',
                        'buttonText' : '',
                        'multi'    : true,
                        'uploadLimit' : 10,
                        'width' : 120,
                        'height' : 120,
                        'fileTypeDesc' : 'Image Files',
                        'fileTypeExts' : fileTypeExts,
                        'fileSizeLimit' : fileSizeLimit+'KB',
                        'onUploadSuccess' : function(file, data, response) {
                            callbackImg(data)  
                        }
                    });
                }
                function callbackImg(arr){
                  var data = $.parseJSON(arr);
                  var img = new Image();
                  img.onload=function(){
                    if(img.width < 300){
                      alert('图片宽度小于300，请从新上传');
                      return false;
                    }else if(img.height < 300){
                      alert('图片高度小于300，请从新上传');
                      return false;
                    }
                    var w = img.width > 800 ? 800 : img.width;
                    $cropMask.css({
                      width:$winW,
                      height:$winH
                    }).fadeTo("slow", 0.3);
                    $cropBox.css({
                      width:w,
                      marginLeft:-(w/2)
                    }).show().animate({
                      top: 100,
                      opacity:1
                    });
                    $('#cropPic1').attr('src',img.src);
                    $('#cropPic2').attr('src',img.src);
                  };  
                  img.onerror=function(){alert("error!")};  
                  img.src=RootUrl+'api/v1/image/'+data.data; 
                  $('#crop-submit').on('click',function(){
                    $.ajax({
                      url: RootUrl+'api/v2/web/image/crop',
                      type: "post",
                      contentType : 'application/json; charset=utf-8',
                      dataType: 'json',
                      data : JSON.stringify({
                        "_id":data.data,
                        "x":parseInt($cropBorder.css('left')),
                        "y":parseInt($cropBorder.css('top')),
                        "width":300,
                        "height":300
                      }),
                      processData : false
                    })
                    .done(function(res){
                      $scope.$apply(function(){
                          $scope.myQuery = res.data;
                          $userHead.attr('src',RootUrl+'api/v2/web/thumbnail/120/'+$scope.myQuery)
                      });
                      $cropMask.hide();
                      $cropBox.hide();
                      $cropBorder.css({
                          left: 0,
                          top: 0
                      });
                      $('#cropPic2').css('clip','rect(0px 300px 300px 0px)')
                    })
                    .fail(function() {
                      console.log("error");
                    })
                  })
                }
            }
        };
    }])
    .directive('myMotai',['$timeout',function($timeout){     //头像裁切上传
        return {
            replace : true,
            scope: {
                    myQuery : "="
            },
            restrict: 'A',
            template: '<div class="k-motai"><div class="mask"></div><div class="motai"></div></div>',
            link: function($scope, iElm, iAttrs, controller){
            }
        };
    }])
    .directive('myMotaiTips',['$timeout',function($timeout){     //头像裁切上传
        return {
            replace : true,
            scope: {
                    myQuery : "="
            },
            restrict: 'A',
            template: '<div class="k-motai"><div class="mask"></div><div class="motai"></div></div>',
            link: function($scope, iElm, iAttrs, controller){
            }
        };
    }])
    .directive('myMotaiScore',['$timeout',function($timeout){     //头像裁切上传
        return {
            replace : true,
            scope: {
                    myQuery : "="
            },
            restrict: 'A',
            template: '<div class="k-motai"><div class="mask"></div><div class="motai"></div></div>',
            link: function($scope, iElm, iAttrs, controller){
            }
        };
    }])