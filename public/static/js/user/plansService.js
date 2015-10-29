'use strict';
angular.module('services', [])
	.factory('userRequiremtne', ['$http', function($http){      //业主 user 获取单条信息 designer获取单条信息 plan获取方案
		var doRequest = function(url,data){
			return $http({
                method : 'POST',
                url : RootUrl+'api/v2/web/'+url,
                headers: {
					'Content-Type': 'application/json; charset=utf-8'
			    },
                data: data
            })
		};
		return {
			user : function(data){return doRequest('user_one_requirement', data)},
			designer : function(data){return doRequest('designer_one_requirement', data)},
			designers : function(data){return doRequest('designer/search' , data)},
			plan : function(data){return doRequest('one_plan' , data)},
			getTeam : function(data){return doRequest('designer/team/get' , data)},
			addPlan : function(data){return doRequest('designer/plan/add' , data)}
		}
	}])
	.factory('userComment', ['$http', function($http){     //业主 unread获取未读评论 add添加评论 delete评论并标记为已读
		var doRequest = function(url,data){
			return $http({
                method : 'POST',
                url : RootUrl+'api/v2/web/'+url,
                headers: {
					'Content-Type': 'application/json; charset=utf-8'
			    },
                data: data
            })
		};
		return {
			unread : function(){return doRequest('unread_comment')},
			add : function(data){return doRequest('add_comment', data)},
			read : function(data){return doRequest('topic_comments', data)}
		}
	}])