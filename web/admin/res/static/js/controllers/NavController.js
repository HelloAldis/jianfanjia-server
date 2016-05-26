(function() {
    angular.module('controllers')
        .controller('SubController', [
            '$scope',
            '$location',
            function($scope, $location) {
                $scope.location = $location;
                $scope.$watch( 'location.url()', function( url ) {
                    $scope.nav = url.split('/')[1];
                });

            }
        ]);
})();
