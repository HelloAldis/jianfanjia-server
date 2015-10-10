'use strict';
// 公用指令
angular.module('directives', [])
	.directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
          elm.text(version);
        };
  }]);