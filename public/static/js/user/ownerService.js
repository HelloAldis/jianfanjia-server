'use strict';
angular.module('services', [])
	.factory('userInfo', ['$http', function($http){
		var doRequest = function(type,data){
			return $http({
                method : type,
                url : RootUrl+'api/v1/user/info',
                headers: {
					'Content-Type': 'application/json; charset=utf-8'
			    },
                data: data
            })
		};
		return {
			get : function(){return doRequest('GET');},
			put : function(data){return doRequest('PUT' , data);}
		}
	}])
	