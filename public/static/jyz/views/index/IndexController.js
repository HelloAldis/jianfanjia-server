(function() {
    angular.module('controllers')
        .controller('IndexController', [
            '$scope',
            '$rootScope',
            function($scope, $rootScope) {
                console.log('这是首页');
            }
        ]);
})();
