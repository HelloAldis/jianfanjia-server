'use strict';
angular.module('services', [])
	.factory('userInfo', ['$http', function($http){   //业主 get获取资料 post修改资料
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
			get : function(){return doRequest('designer/info/get')},
			update : function(data){return doRequest('designer/info',data)},
			bank : function(data){return doRequest('designer/uid_bank_info',data)},
			email : function(data){return doRequest('designer/email_info',data)},
			online : function(data){return doRequest('designer/update_online_status',data)}
		}
	}])
	.factory('userRequiremtne', ['$http', function($http){      //设计师 list需求列表 get获取单条信息 answer响应业主 reject拒绝业主 config配置合同 plans获取方案列表  contract获取合同信息   history 历史订单  addPlan添加方案  update更新方案
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
			list : function(){return doRequest('designer_my_requirement_list')},
			get : function(data){return doRequest('designer_one_requirement',data)},
			answer : function(data){return doRequest('designer/user/ok',data)},
			reject : function(data){return doRequest('designer/user/reject',data)},
			config : function(data){return doRequest('config_contract',data)},
			plans : function(data){return doRequest('designer_requirement_plans',data)},
			contract : function(data){return doRequest('one_contract',data)},
			history : function(data){return doRequest('designer_my_requirement_history_list',data)},
			addPlan : function(data){return doRequest('designer/plan/add',data)},
			update : function(data){return doRequest('designer/plan/update',data)}
		}
	}])
	.factory('userTeam', ['$http', function($http){     //获取设计师施工团队 list列表 get获取单个 add添加 remove删除 update更新
		var doRequest = function(url,data){
			return $http({
                method : 'POST',
                url : RootUrl+'api/v2/web/designer/team/'+url,
                headers: {
					'Content-Type': 'application/json; charset=utf-8'
			    },
                data: data
            })
		};
		return {
			list : function(){return doRequest('get')},
			get : function(data){return doRequest('one',data)},
			add : function(data){return doRequest('add',data)},
			update : function(data){return doRequest('update',data)},
			remove : function(data){return doRequest('delete',data)}
		}
	}])
	.factory('userProduct', ['$http', function($http){     //获取设计师作品 list列表 get获取单个 add添加 remove删除 update更新
		var doRequest = function(url,data){
			return $http({
                method : 'POST',
                url : RootUrl+'api/v2/web/designer/product'+url,
                headers: {
					'Content-Type': 'application/json; charset=utf-8'
			    },
                data: data
            })
		};
		return {
			list : function(data){return doRequest('', data)},
			get : function(data){return doRequest('/one',data)},
			add : function(data){return doRequest('/add',data)},
			update : function(data){return doRequest('/update',data)},
			remove : function(data){return doRequest('/delete',data)}
		}
	}])
	.factory('userFavoriteProduct', ['$http', function($http){     //设计师 list收藏作品列表 add添加收藏 remove删除收藏
		var doRequest = function(url,data){
			return $http({
                method : 'POST',
                url : RootUrl+'api/v2/web/favorite/product/'+url,
                headers: {
					'Content-Type': 'application/json; charset=utf-8'
			    },
                data: data
            })
		};
		return {
			list : function(data){return doRequest('list',data)},
			add : function(data){return doRequest('add',data)},
			remove : function(data){return doRequest('delete',data)}
		}
	}])
	.factory('userComment', ['$http', function($http){     //设计师 unread获取未读评论 add添加评论 delete评论并标记为已读
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
			add : function(data){return doRequest('add_comment',data)},
			read : function(data){return doRequest('topic_comments',data)}
		}
	}])
