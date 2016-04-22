/**
 * Created by Administrator on 2016/4/21.
 */
define(['app'],function (app) {
    var StrategyMode = {
        'value' : {
            validity : function(value){
                return value !== undefined;
            }
        },
        'image' : {
            validity : function(value){
                return value !== undefined;
            }
        },
        'images' : {
            validity : function(value){
                return value && value.length > 0;
            }
        },
        'number' : {
            validity : function(value,msg){
                var res;
                if(msg === 'int'){
                    res = /[^0-9]/;
                }else if(msg === 'float'){
                    res = /[^0-9.]/;
                }
                return !res.test(value);
            }
        },
        'province' : {
            validity : function(value,msg){
                return value != msg;
            }
        },
        'city' : {
            validity : function(value,msg){
                return value != msg;
            }
        }
    };
    app.directive('casualVerify',function(){
        return {
            replace : true,
            require : 'ngModel',
            restrict: 'A',
            link: function(scope, iElm, iAttrs, controller) {
                scope.$watch(iAttrs.ngModel, function(newValue){
                    controller.$setValidity(iAttrs.type, StrategyMode[iAttrs.type].validity(newValue,iAttrs.msg));
                });
            }
        };
    });
});