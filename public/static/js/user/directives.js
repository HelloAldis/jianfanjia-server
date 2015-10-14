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
    .directive('mySelecte',['$timeout',function($timeout){     //自定义下拉框
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
                   $scope.select = function(name,$event){
                        $scope.myQuery = name;
                        $event.stopPropagation()
                        oUl.css('display','none');
                        obj.css('zIndex',100);
                   }
                },
            restrict: 'A',
            template: '<div class="m-select" ng-click="openSelect($event)" ng-mouseout="closeSelect()"><ul class="select" ng-mouseover="closeTimer()"><li ng-repeat="d in myList"><a href="javascript:;" ng-click="select(d.name,$event)">{{d.name}}</a></li></ul><div class="editor"><input class="value" ng-model="myQuery" /><span class="arrow"><em></em><i></i></span></div></div>'
        };
    }])
    .directive('mgStylepic',['$timeout',function($timeout){     //装修风格
        return {
            replace : true,
            scope: {
                    myList : "=",
                    myQuery : "="
            },
            restrict: 'A',
            template: '<div class="k-stylePic" ng-init="myQuery"><div class="pic"><ul></ul></div><div class="toggle"><a href="javascript:;" class="btns prev"><i>左</i><span></span></a><a href="javascript:;" class="btns next"><i>右</i><span></span></a></div><p class="text">欧式</p></div>',
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
                   console.log(iNum)
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
    .directive('myDates',['$timeout',function($timeout){     //自定义时间日历选择
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
            template: '<div class="m-cities"></div>'
        };
    }])