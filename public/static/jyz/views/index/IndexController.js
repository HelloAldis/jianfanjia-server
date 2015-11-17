(function() {
    angular.module('controllers')
        .controller('IndexController', [
            '$scope',
            '$rootScope',
            '$state',
            function($scope, $rootScope,$state) {
                console.log('这是首页');
                $scope.btn = function(){
                	$state.go('^')
                }
            }
        ]);
})();
