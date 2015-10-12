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