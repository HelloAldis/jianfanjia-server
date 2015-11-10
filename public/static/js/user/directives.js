'use strict';
// 公用指令
angular.module('directives', [])
    .directive('myRadio',['$timeout',function($timeout){     //自定义复选框
        return {
           replace : true,
           scope: {
              myList : "=",
              myQuery : "=",
              mySelects : "@"
           },
           restrict: 'A',
           template: '<div class="radio"></div>',
           link: function($scope, iElm, iAttrs, controller) {
               var obj = angular.element(iElm),
                   oUl = obj.find('ul'),
                   list = $scope.myList,
                   query = $scope.myQuery,
                   select = $scope.mySelects,
                   str = '';
                   //query 值有三中字符串，数字，数组
                   console.log(query)
                  if(typeof query == "object" || typeof query == Object){
                      for (var i = 0,len = list.length; i < len; i++) {
                        for (var j = 0; j < query.length; j++) {
                          if(list[i].id == query[j]){
                              list[i].cur = 'active';
                          }
                        };
                      };  
                   }else{
                    for (var i = 0,len = list.length; i < len; i++) {
                      if(list[i].id == query){
                        list[i].cur = 'active';
                      }
                    };
                   }
                  for (var i = 0,len = list.length; i < len; i++) {
                     str += '<label class="'+list[i].cur+'" data-id="'+list[i].id+'"><span></span>'+list[i].name+'</label>'
                  };
                  obj.html(str);
                  obj.on('click', 'label' ,function(){
                      var id = $(this).data('id')+'',
                          This = $(this);
                      $scope.$apply(function(){
                        if(select == 1){
                          obj.find('label').attr('class', '');
                          This.attr('class', 'active').siblings('label').attr('class', '');
                          $scope.myQuery = id;
                        }else if(select == 3 || select == 0){
                          var len = $scope.myQuery.length;
                            if(This.attr('class') === 'active'){
                              if(len == 1){
                                alert('最少1项');
                                return ;
                              }
                              This.attr('class', '');
                              var index = $.inArray($scope.myQuery,id)
                              $scope.myQuery.splice(index,1)
                            }else{
                              This.attr('class', 'active');
                              $scope.myQuery.push(id);
                              if(select == 3){
                                if($scope.myQuery.length > 3){
                                  This.attr('class', '');
                                  $scope.myQuery.pop();
                                  alert('只能选择3个擅长风格');
                                  return ;
                                }
                              } 
                            }
                        }
                    });
                  })
           }
       };
    }])
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
    .directive('mySelectn',['$timeout',function($timeout){     //自定义下拉框
        return {
            replace : true,
            scope: {
                    myList : "=",
                    myQuery : "="
            },
            restrict: 'A',
            template: '<div class="k-select" ng-click="openSelect($event)" ng-mouseout="closeSelect()"><ul class="select" ng-mouseover="closeTimer()"><li ng-repeat="d in myList"><a href="javascript:;" ng-click="select(d,$event)">{{d}}</a></li></ul><div class="option"><span class="value">{{myQuery}}</span><span class="arrow"><em></em><i></i></span></div></div>',
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
            template: '<div class="stylePic"><div class="pic"><ul></ul></div><div class="toggle"><a href="javascript:;" class="btns prev"><i class="iconfont2">&#xe611;</i><span></span></a><a href="javascript:;" class="btns next"><i class="iconfont2">&#xe617;</i><span></span></a></div><p class="text">正在加载中。。。</p></div>',
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
              oUl.css({left:-$scope.myQuery*picWidth})
              oText.html(arr[$scope.myQuery].txt)
              var aLi = oUl.find('li');
                oUl.width(len*picWidth)
                oPrev.on('click',function(){
                    if(iNum == 0){
                        iNum = len
                    }
                    iNum--;
                    fnMove(iNum)
                })
                oNext.on('click',function(){
                    if(iNum == len-1){
                        iNum = -1
                    }
                    iNum++;
                    fnMove(iNum)
                })
                function fnMove(iNum){
                    oUl.stop().animate({left:-iNum*picWidth})
                    oText.html(arr[iNum].txt)
                    $scope.$apply(function(){
                        $scope.myQuery = iNum;
                    });
                } 
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
                   DefaultLen = 3,
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
                for (var i = 0; i < DefaultLen; i++) {
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
                var province = oBox.find('.province'),
                    city = oBox.find('.city'),
                    district = oBox.find('.district'),
                    body = angular.element(document),
                    listArr = [province,city,district];
                for(var i = 0; i < DefaultLen; i++) {
                  createList(Default[i].num,listArr[i]);
                  selectEvent(listArr[i]);
                  optionEvevt(listArr[i]);
                };
                // 渲染城市数据
                function createList(id,obj){
                    obj.find('.select').remove();
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
                        if(province.find('.value').html() == "请选择省"){
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
            }
        };
    }])
    .directive('myCitiesdec',['$timeout',function($timeout){     //自定义地区选择控件
        return {
            replace : true,
            scope: {
                    myList : "=",
                    myProvince : "=",
                    myCity : "=",
                    myDistrict : "=",
                    myDecdistricts : "="
            },
            restrict: 'A',
            template: '<div class="k-cities" ng-click="openSelect($event)" ng-mouseout="closeSelect()"><ul class="select" ng-mouseover="closeTimer()"><li ng-repeat="d in myList"><a href="javascript:;" ng-click="select(d.name,$event)">{{d.name}}</a></li></ul><div class="editor"><input class="value" ng-model="myQuery" /><span class="arrow"><em></em><i></i></span></div></div>',
            link: function($scope, iElm, iAttrs, controller) {
               var areaJson = $scope.myList,
                   oProvince = $scope.myProvince,
                   oCity = $scope.myCity,
                   oDistrict = $scope.myDistrict,
                   oDecdistricts = $scope.myDecdistricts,
                   oBox = angular.element(iElm),
                   bOFF = false,
                   bOff = false,
                   DefaultLen = 3,
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
                for (var i = 0; i < DefaultLen; i++) {
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
                var province = oBox.find('.province'),
                    city = oBox.find('.city'),
                    district = oBox.find('.district'),
                    body = angular.element(document),
                    listArr = [province,city,district];
                    
                for(var i = 0; i < DefaultLen; i++) {
                  createList(Default[i].num,listArr[i]);
                  selectEvent(listArr[i]);
                  optionEvevt(listArr[i]);
                };
                district.hide();
                // 渲染城市数据
                function createList(id,obj){
                    obj.find('.select').remove();
                    var sHtml = '<ul class="select">';
                    var sDec = [];
                    for (var i in areaJson) {
                      if (areaJson[i][1] == id) {
                          sHtml += '<li data-val="'+i+'"><a>'+areaJson[i][0]+'</a></li>';
                          sDec.push(areaJson[i][0])
                      }
                    }
                    sHtml += '</ul>';
                    if(obj == district){
                        $scope.myDecdistricts = sDec;
                    }
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
                        if(province.find('.value').html() == "请选择省"){
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
                    $cropCancel = $('#crop-cancel'),
                    $winW = $(window).width(),
                    $winH = $(window).height(),
                    uploaderUrl = RootUrl+'api/v2/web/image/upload',
                    croploaderUrl = RootUrl+'api/v2/web/image/crop',
                    fileTypeExts = '*.jpg;*.png',
                    fileSizeLimit = 1024,
                    destroy = true,
                    moveout = false,
                    scale = 0,
                    disX,
                    disY,
                    imgW,imgH,w,h,
                    num = 300;
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
                            h = $cropBox.find('.cropBox').height() - $cropBorder.height();
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
                        var r = num +l+1,
                            b = num + t+1;
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
                        imgW = img.width,
                        imgH = img.height;
                    if(imgW < 300){
                      alert('图片宽度小于300，请重新上传');
                      return false;
                    }else if(imgH < 300){
                      alert('图片高度小于300，请重新上传');
                      return false;
                    }
                    scale = ($winH - 286)/imgH;
                    w = imgH > $winH - 286 ? imgW*scale : imgW;
                    h = imgH > $winH - 286 ? imgH*scale : imgH;
                    if(w < 300){
                      alert('图片裁切宽度小于300，请重新上传宽高一样图片');
                      data.data = null;
                      return false;
                    }
                    num = scale*300 > 300 ? 300 : scale*300
                    $cropBorder.css({
                      width: num,
                      height: num
                    });
                    $('#cropPic2').css('clip','rect('+'0px '+num+'px '+num+'px '+'0px)')
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
                  $cropCancel.on('click',function(){
                     clearData();
                     data.data = null;
                  })
                  $('#crop-submit').on('click',function(){
                    if(data.data != null){
                      $.ajax({
                        url: RootUrl+'api/v2/web/image/crop',
                        type: "post",
                        contentType : 'application/json; charset=utf-8',
                        dataType: 'json',
                        data : JSON.stringify({
                          "_id":data.data,
                          "x":parseInt($cropBorder.css('left'))/scale,
                          "y":parseInt($cropBorder.css('top'))/scale,
                          "width":300,
                          "height":300
                        }),
                        processData : false
                      })
                      .done(function(res){
                        $scope.$apply(function(){
                            $scope.myQuery = res.data;
                            $userHead.attr('src',RootUrl+'api/v2/web/thumbnail/120/'+res.data)
                        });
                        clearData();
                        data.data = null;
                      })
                      .fail(function(){
                        console.log("error");
                      })
                    }
                  })
                }
                function clearData(){
                  $cropMask.hide();
                  $cropBox.hide();
                  $cropBorder.css({
                      left: 0,
                      top: 0
                  });
                  $('#cropPic2').css('clip','rect(0px 300px 300px 0px)')
                }
            }
        };
    }])
    .directive('myUploade',['$timeout',function($timeout){     //方案图片上传
        return {
            replace : true,
            scope: {
              myQuery : "="
            },
            restrict: 'A',
            template: '<div class="k-uploadbox f-cb"><div class="pic" id="create"><div class="fileBtn"><input class="hide" id="createUpload" type="file" name="upfile"><input type="hidden" id="sessionId" value="${pageContext.session.id}" /><input type="hidden" value="1215154" name="tmpdir" id="id_create"></div><div class="tips"><span><em></em><i></i></span><p>作品上传每张3M以内jpg</p></div></div><div class="item" ng-repeat="img in myQuery"><img ng-src="/api/v2/web/thumbnail/168/{{img}}" /></div></div>',
            link: function($scope, iElm, iAttrs, controller){
                  var uploaderUrl = RootUrl+'api/v2/web/image/upload',
                    fileTypeExts = '*.jpg;*.png',
                    fileSizeLimit = 3072;
                if(checkSupport() === "html5"){
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
                }else{
                  $('#createUpload').uploadify({
                      'auto'     : true,
                      'removeTimeout' : 1,
                        'swf'      : 'uploadify.swf',
                        'uploader' : uploaderUrl,
                        'method'   : 'post',
                        'buttonText' : '',
                        'multi'    : true,
                        'uploadLimit' : 10,
                        'width' : 168,
                        'height' : 168,
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
                    // if(img.width < 300){
                    //   alert('图片宽度小于300，请重新上传');
                    //   return false;
                    // }else if(img.height < 300){
                    //   alert('图片高度小于300，请重新上传');
                    //   return false;
                    // }
                    if(_.indexOf($scope.myQuery,data.data) == -1){
                      $scope.$apply(function(){
                        $scope.myQuery.push(data.data)
                      });
                    }else{
                      alert('已经上传过了')
                    }
                  };  
                  img.onerror=function(){alert("error!")};  
                  img.src=RootUrl+'api/v1/image/'+data.data;
                }
            }
        };
    }])
    .directive('myOtheruploade',['$timeout',function($timeout){     //其他图片上传
      return {
          replace : true,
          scope: {
            myQuery : "="
          },
          restrict: 'A',
          template: '<div class="k-otheruploade"><div class="create"><div class="fileBtn"><input class="hide" class="createUpload" type="file" name="upfile"><input type="hidden" id="sessionId" value="${pageContext.session.id}" /><input type="hidden" value="1215154" name="tmpdir" class="id_create"></div><img ng-src="/api/v2/web/thumbnail/250/{{myQuery}}" ng-if="myQuery" /><div class="tips"><span><em></em><i></i></span><p>图片上传每张3M以内jpg</p></div></div></div>',
          link: function($scope, iElm, iAttrs, controller){
              var uploaderUrl = RootUrl+'api/v2/web/image/upload',
                  fileTypeExts = '*.jpg;*.png',
                  fileSizeLimit = 3072,
                  obj = $(iElm).parent(),
                  create = obj.find('.create'),
                  createUpload = obj.find('.createUpload'),
                  boxData = obj.data('boxData');
              if(checkSupport() === "html5"){
                create.Huploadify({
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
                createUpload.uploadify({
                    'auto'     : true,
                    'removeTimeout' : 1,
                      'swf'      : 'uploadify.swf',
                      'uploader' : uploaderUrl,
                      'method'   : 'post',
                      'buttonText' : '',
                      'multi'    : true,
                      'uploadLimit' : 10,
                      'width' : boxData.width,
                      'height' : boxData.height,
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
                  // if(img.width < 300){
                  //   alert('图片宽度小于300，请重新上传');
                  //   return false;
                  // }else if(img.height < 300){
                  //   alert('图片高度小于300，请重新上传');
                  //   return false;
                  // }
                  $scope.$apply(function(){
                    $scope.myQuery = data.data
                  });
                };  
                img.onerror=function(){alert("error!")};  
                img.src=RootUrl+'api/v1/image/'+data.data;
              }
          }
      };
    }])
    .directive('myProductuploade',['$timeout',function($timeout){     //作品图片上传
        return {
            replace : true,
            scope: {
              myQuery : "=",
              mySection : "="
            },
            restrict: 'A',
            template: '<div class="k-uploadbox f-cb"><div class="pic" id="create"><div class="fileBtn"><input class="hide" id="createUpload" type="file" name="upfile"><input type="hidden" id="sessionId" value="${pageContext.session.id}" /><input type="hidden" value="1215154" name="tmpdir" id="id_create"></div><div class="tips"><span><em></em><i></i></span><p>图片上传每张3M以内jpg<strong ng-if="mySection.length">作品/照片/平面图上均不能放置个人电话号码或违反法律法规的信息。</strong></p></div></div><div class="previews-item" ng-repeat="img in myQuery"><span class="close" ng-click="removeImg($index,myQuery)"></span><div class="img"><img class="img" src="/api/v2/web/thumbnail/168/{{img.imageid}}" ng-show="mySection.length" alt=""><img class="img" src="/api/v2/web/thumbnail/168/{{img.award_imageid}}" ng-show="!mySection.length" alt=""></div><div my-selecte ng-if="mySection.length" my-list="mySection" my-query="img.section"></div><textarea class="input textarea" ng-model="img.description" name="itme_con" cols="30" rows="10"></textarea></div></div>',
            link: function($scope, iElm, iAttrs, controller){
                  var uploaderUrl = RootUrl+'api/v2/web/image/upload',
                    fileTypeExts = '*.jpg;*.png',
                    fileSizeLimit = 3072,
                    obj = angular.element(iElm);
                   
                if(checkSupport() === "html5"){
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
                }else{
                  $('#createUpload').uploadify({
                      'auto'     : true,
                      'removeTimeout' : 1,
                        'swf'      : 'uploadify.swf',
                        'uploader' : uploaderUrl,
                        'method'   : 'post',
                        'buttonText' : '',
                        'multi'    : true,
                        'uploadLimit' : 10,
                        'width' : 168,
                        'height' : 168,
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
                    // if(img.width < 300){
                    //   alert('图片宽度小于300，请重新上传');
                    //   return false;
                    // }else if(img.height < 300){
                    //   alert('图片高度小于300，请重新上传');
                    //   return false;
                    // }
                    if(_.indexOf($scope.myQuery,data.data) == -1){
                      $scope.$apply(function(){
                        if($scope.mySection.length){
                          $scope.myQuery.push({"section":"客厅","imageid":data.data,"description":""})
                        }else{
                          $scope.myQuery.push({"award_imageid":data.data,"description":""})
                        }

                      });
                    }else{
                      alert('已经上传过了')
                    }
                  };  
                  img.onerror=function(){alert("error!")};  
                  img.src=RootUrl+'api/v1/image/'+data.data;
                }
                $scope.removeImg = function(i,arr){
                  arr.splice(i,1)
                  $scope.$apply(function(){
                    $scope.myQuery = arr
                  });
                }
            }
        };
    }])
    .directive('myDate',['$timeout',function($timeout){     //自定义地区选择控件
        return {
            replace : true,
            scope: {
                myQuery : "=",
                mySet : "@"
            },
            restrict: 'A',
            template: '<div class="m-date"></div>',
            link: function($scope, iElm, iAttrs, controller) {
               var query = $scope.myQuery,
                   select = $scope.mySet.split('-'),
                   oBox = angular.element(iElm),
                   yearData = [],
                   monthData = [],
                   daysData = [],
                   hourData = [],
                   minuteData = [],
                   secondData = [],
                   newDate = new Date(),
                   sYear = '',
                   sMonth = '',
                   sDays = '',
                   sHour = '',
                   sMinute = '',
                   sSecond = '';
                  var selectData = '';
                  for (var i = 0; i < select.length; i++) {
                      selectData += '<div class="list '+select[i]+'"><div class="option"><span class="value"></span><span class="arrow"><em></em><i></i></span></div></div>';
                  };
                  oBox.html(selectData);
                  for (var i = 0; i < 12; i++) {
                    monthData[i] = i+1+'月'
                  };
                  function fnDays(){
                    for (var i = 0; i < 12; i++) {
                      if(i== 1){
                        if((sYear%4==0 && sYear%100!=0)||(sYear%400==0)){
                          daysData[i] = 29
                        }else{
                          daysData[i] = 28
                        }
                      }else if(i == 3 || i == 5 || i == 8 || i == 10){
                         daysData[i] = 30
                      }else{
                        daysData[i] = 31
                      }
                    };
                  }
                  for (var i = 0; i < 20; i++) {
                    yearData[i] = newDate.getFullYear()+i+'年'
                  };
                  for (var i = 0; i < 24; i++) {
                    hourData[i] = i + '时'
                  };
                  for (var i = 0; i < 6; i++) {
                    minuteData[i] = i*10 + '分'
                  };
                  var oYear = oBox.find('.year'),
                      oMonth = oBox.find('.month'),
                      oDays = oBox.find('.days'),
                      oHour = oBox.find('.hour'),
                      oMinute = oBox.find('.minute'),
                      oSecond = oBox.find('.second'),
                      body = angular.element(document);
                  for (var i = 0; i < select.length; i++) {
                    switch (select[i]){ 
                      case 'year' : 
                        createList(yearData,oYear);
                        sYear = setDate(oYear,newDate.getFullYear());
                        optionEvevt(oYear)
                        fnDays();
                      break; 
                      case 'month' : 
                        createList(monthData,oMonth);
                        sMonth = setDate(oMonth,newDate.getMonth()+1);
                        optionEvevt(oMonth)
                      break;
                      case 'days' : 
                        createList(daysData,oDays);
                        sDays = setDate(oDays,newDate.getDate());
                        optionEvevt(oDays)
                      break; 
                      case 'hour' : 
                        createList(hourData,oHour);
                        sHour = setDate(oHour,newDate.getHours());
                        optionEvevt(oHour)
                      break;
                      case 'minute' : 
                        createList(minuteData,oMinute);
                        sMinute = setDate(oMinute,newDate.getMinutes());
                        optionEvevt(oMinute)
                      break; 
                      case 'second' : 
                        sSecond = setDate(oSecond,newDate.getSeconds());
                        optionEvevt(oSecond)
                      break;   
                      default : 
                        alert('你书写有错！')
                      break; 
                    } 
                  }; 
                // 渲染城市数据
                function createList(arr,obj){
                    obj.find('select').remove();
                    var sHtml = '<ul class="select">',
                        len = obj == oDays ? arr[sMonth] : arr.length;
                    for (var i = 0; i < len; i++) {
                      if(obj == oDays){
                        sHtml += '<li data-val="'+(i+1)+'"><a>'+(i+1)+'日</a></li>';
                      }else{
                        sHtml += '<li data-val="'+parseInt(arr[i])+'"><a>'+arr[i]+'</a></li>';
                      }
                        
                    };
                    sHtml += '</ul>';
                    obj.append(sHtml)
                }
                function setDate(obj,str){
                  var str2 = ''
                  if(obj == oYear){
                    str2 = '年';
                  }
                  if(obj == oMonth){
                    str2 = '月';
                  }
                  if(obj == oDays){
                    str2 = '日';
                  }
                  if(obj == oHour){
                    str2 = '时';
                  }
                  if(obj == oMinute){
                    str = str+'';
                    if(str.length == 2){
                        if(parseInt(str.charAt(1)) > 5){
                          if(parseInt(str.charAt(0))+1 == 6){
                            str = '0'
                          }else{
                            str = parseInt(str.charAt(0))+1 + '0'
                          }
                        }else{
                          str = parseInt(str.charAt(0)) + '0'
                        }
                    }else{
                        if(parseInt(str.charAt(0)) > 5){
                           str = "10"
                        }else{
                           str = "0"
                        }
                    }
                    str2 = '分';
                  }
                  if(obj == oSecond){
                    str2 = '秒';
                  }
                  obj.find('.value').html(str+str2);
                  return str;
                }
                function optionEvevt(obj){
                    var self = this;
                    var option = obj.find('.option');
                    var value = option.find('.value').html();
                    option.on('click' , function(ev){
                      body.click();
                      if(obj == oDays){
                        sMonth = parseInt(oMonth.find('.value').html()) - 1;
                        createList(daysData,oDays);
                      }
                      selectShow(obj);
                      return false;
                    });
                    selectEvent(obj)
                }
                function selectEvent(obj){
                  var oOption = obj.find('.option').find('.value');
                  body.click();
                  obj.delegate('li', 'click' , function(ev){
                    ev.stopPropagation();
                    var dataVal = $(this).data('val'),
                      value = $(this).find('a').text();
                      oOption.html(value);
                      if(obj == oYear){
                        sYear = dataVal;
                        fnDays()
                      }
                      if(obj == oMonth){
                        sMonth = dataVal-1;
                        createList(daysData,oDays);
                      }
                      if(obj == oDays){
                        createList(daysData,oDays);
                        sDays = dataVal;
                      }
                      if(obj == oHour){
                        sHour = dataVal;
                      }
                      if(obj == oMinute){
                        sMinute = dataVal;
                      }
                      selectHide(obj)
                      getDate()
                  });
                }
                body.on('click', function(ev){
                    selectHide(); 
                });
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
                function getDate(){
                  $scope.$apply(function(){
                    if(_.indexOf(select,'hour') == -1){
                      var s = sYear +"/"+ (sMonth+1) +"/"+ sDays +" "+ "00:00:00";
                    }else if(_.indexOf(select,'minute') == -1){
                      var s = sYear +"/"+ (sMonth+1) +"/"+ sDays +" "+ sHour +":"+ "00:00";
                    }else{
                      var s = sYear +"/"+ (sMonth+1) +"/"+ sDays +" "+ sHour +":"+ sMinute +":"+ sSecond;
                    }
                    $scope.myQuery = (new Date(s)).getTime();
                  });
                }            
            }
        };
    }])
   .directive('checkNumber',['$timeout',function($timeout){     //检测是不是数字
        return {
            replace : true,
            require : 'ngModel',
            restrict: 'A',
            link: function($scope, iElm, iAttrs, controller) {
              var res = /^[1-9]*[1-9][0-9]*$/;
                $scope.$watch(iAttrs.ngModel, function(newValue, oldValue, scope){
                  if(!!newValue){
                    if(res.test(newValue)){
                      controller.$setValidity('number', true)
                    }else{
                      controller.$setValidity('number', false)
                    }
                  }
                });
            }
        };
    }])
    .directive('myPageing',['$timeout',function($timeout){     //分页
        return {
            replace : true,
            scope:{
              pageObject : '=pageObject'
          },
            restrict: 'A',
            template: '<div class="k-pageing"><ul class="pagination"></ul></div>',
            link: function($scope, iElm, iAttrs, controller){
                var obj = angular.element(iElm),
                    pageObj = $scope.pageObject,
                    allNumPage = (!pageObj.allNumPage || pageObj.allNumPage < 0) ? 1 : pageObj.allNumPage,
                    itemPage = (!pageObj.itemPage || pageObj.itemPage < 0) ? 1 : pageObj.itemPage;
                //生成分页显示
        //createLinks();
        //回调函数
        pageObj.callback(pageObj.currentPage,obj);
                $scope.page = {
                  createLinks : function(){
                    obj.html('');
                    var self = this,
                        interval = this.getInterval(),
                      np = this.numPages();
                    // 这个辅助函数返回一个处理函数调用有着正确pageId的pageSelected。
                    this.getClickHandler()
                    if(pageObj.pageInfo){
                      angular.element("<span>共<em>"+pageObj.allNumPage+"</em>条项目</span>").addClass('text').appendTo(obj);
                    }
                    // 产生首页按钮
                    if(pageObj.showUbwz && pageObj.currentPage > 0 ){
                      this.appendItem(0,{text:'首页', classes:"first"},np)
                    }
                    // 产生上一个按钮
                    if(pageObj.prevText && (pageObj.currentPage > 0)){
                      this.appendItem(pageObj.currentPage-1,{text:pageObj.prevText, classes:"prev"},np)
                    }
                    // 产生起始点
                    if (interval[0] > 0 && pageObj.ellipseText > 0){
                      var end = Math.min(pageObj.endPageNum, interval[0]);
                      for(var i=0; i<end; i++){
                        this.appendItem(i,{},np);
                      }
                      if(pageObj.endPageNum < interval[0] && pageObj.ellipseText){
                        angular.element("<span>"+pageObj.ellipseText+"</span>").addClass('btns').appendTo(obj);
                      }
                    }
                    // 产生内部的些链接
                    for(var i=interval[0]; i<interval[1]; i++) {
                      this.appendItem(i,{},np);
                    }
                    // 产生结束点
                    if (interval[1] < np && pageObj.endPageNum > 0){
                      if(np-pageObj.endPageNum > interval[1] && pageObj.ellipseText)
                      {
                        angular.element("<span>"+pageObj.ellipseText+"</span>").addClass('btns').appendTo(obj);
                      }
                      var begin = Math.max(np-pageObj.endPageNum, interval[1]);
                      for(var i=begin; i<np; i++) {
                        this.appendItem(i,{},np);
                      }
                    }
                    //  产生下一页按钮
                    if(pageObj.nextText && (pageObj.currentPage < np-1)){
                      this.appendItem(pageObj.currentPage+1,{text:pageObj.nextText, classes:"next"},np);
                    }
                    // 产生尾页按钮
                    if(pageObj.showUbwz && pageObj.currentPage < np-1 ){
                      this.appendItem(np,{text:'尾页', classes:"last"},np)
                    }
                    if(pageObj.pageInfo){
                      angular.element("<span>当前第<em>"+(pageObj.currentPage+1)+"</em>页/共<em>"+this.numPages()+"</em>页</span>").addClass('text').appendTo(obj);
                    }
                          },
                  getClickHandler : function(pageId){
                    var self = this;
                    return function(ev){ return self.pageSelected(pageId,ev); }
                  },
                  appendItem : function(pageId, appendopts,np){  //生成按钮  
                    pageId = pageId<0?0:(pageId<np?pageId:np-1); // 规范page id值
                    appendopts = angular.extend({text:pageId+1, classes:""}, appendopts||{});
                    if(pageId == pageObj.currentPage){
                      var lnk = angular.element("<span class='current'>"+(appendopts.text)+"</span>").addClass('btns');
                    }else{
                      var lnk = angular.element("<a>"+(appendopts.text)+"</a>")
                        .on("click", this.getClickHandler(pageId))
                        .addClass('btns')
                        .attr('href', pageObj.linkTo.replace(/__id__/,pageId+1));   
                    }
                    if(appendopts.classes){lnk.addClass(appendopts.classes);}
                    obj.append(lnk);
                  },
                  numPages : function(){   //计算最大分页显示数目
                    var self = this;
                    return Math.ceil(pageObj.allNumPage/pageObj.itemPage);
                  },
                  getInterval : function(){ //极端分页的起始和结束点，这取决于currentPage 和 showPgaeNum返回数组
                    var self = this,
                      ne_half = Math.ceil(pageObj.showPageNum/2),
                        np = this.numPages(),
                        upper_limit = np-pageObj.showPageNum,
                        start = pageObj.currentPage>ne_half?Math.max(Math.min(pageObj.currentPage-ne_half, upper_limit), 0):0,
                        end = pageObj.currentPage>ne_half?Math.min(pageObj.currentPage+ne_half, np):Math.min(pageObj.showPageNum, np);
                    return [start,end]
                  },
                  pageSelected : function(pageId,ev){  //分页链接事件处理函数  pageId 为新页码
                    var self = this;
                            pageObj.currentPage = pageId;
                    this.createLinks();
                    var continuePropagation = pageObj.callback(pageObj.currentPage,obj);
                    if (!continuePropagation) {
                      if (ev.stopPropagation) {
                        ev.stopPropagation();
                      }
                      else {
                        ev.cancelBubble = true;
                      }
                    }
                    return continuePropagation;
                  },
                  selectPage : function(pageId){ // 获得附加功能的元素
                    this.pageSelected(pageId);
                  },
                  prevPage : function(){  // 上一个按钮
                    var self = this;
                    if (pageObj.currentPage > 0) {
                      this.pageSelected(pageObj.currentPage - 1);
                      return true;
                    }else {
                      return false;
                    }
                  },
                  nextPage : function(){  // 下一个按钮
                    var self = this;
                    if(pageObj.currentPage < this.numPages()-1) {
                      this.pageSelected(pageObj.currentPage+1);
                      return true;
                    }else {
                      return false;
                    }
                  }
                }
                $scope.page.createLinks();
            }
        };
    }])