(function(){
    'use strict';
    angular.module('services', [])
    	/**
    	 * [管理员创建装修直播]
    	 * @param  {[list]} [获取列表]
    	 * @param  {[get]} [获取单条数据]
    	 * @param  {[update]} [更新单条数据]
    	 * @param  {[add]} [新添加一条数据]
    	 * @param  {[remove]} [删除某一条数据]
    	 */
	    .factory('adminShare', ['$http', function($http){
			var doRequest = function(url,data){
				return $http({
	                method : 'POST',
	                url : RootUrl+'api/v2/web/share/'+url,
	                headers: {
						'Content-Type': 'application/json; charset=utf-8'
				    },
	                data: data
	            });
			};
			return {
				search : function(data){return doRequest('search',data);},
				update : function(data){return doRequest('update',data);},
				add : function(data){return doRequest('add',data);},
				remove : function(data){return doRequest('delete',data);}
			};
		}])
		/**
		 * [管理员获取业主相关]
		 * @param  {[search]} [搜索业主]
		 */
	    .factory('adminUser', ['$http', function($http){
			var doRequest = function(url,data){
				return $http({
	                method : 'POST',
	                url : RootUrl+'api/v2/web/admin/'+url,
	                headers: {
						'Content-Type': 'application/json; charset=utf-8'
				    },
	                data: data
	            });
			};
			return {
				search : function(data){return doRequest('search_user',data);}
			};
		}])
		/**
		 * [管理员获取设计师相关]
		 * @param  {[get]} [获取某个设计师信息]
		 * @param  {[search]} [搜索设计师]
		 * @param  {[authing]} [申请审核的设计师]
		 * @param  {[workAuth]} [设计师工地信息认证]
		 * @param  {[uidAuth]} [设计师身份证信息认证]
		 * @param  {[infoAuth]} [设计师基本信息认证]
		 */
	    .factory('adminDesigner', ['$http', function($http){
			var doRequest = function(url,data){
				return $http({
	                method : 'POST',
	                url : RootUrl+'api/v2/web/admin/'+url,
	                headers: {
						'Content-Type': 'application/json; charset=utf-8'
				    },
	                data: data
	            });
			};
			return {
				get : function(url){return doRequest('designer/'+url);},
				search : function(data){return doRequest('search_designer',data);},
				authing : function(){return doRequest('authing_designer');},
				workAuth : function(data){return doRequest('update_work_auth',data);},
				uidAuth : function(data){return doRequest('update_uid_auth',data);},
				infoAuth : function(data){return doRequest('update_basic_auth',data);},
				online : function(data){return doRequest('update_designer_online_status',data);}
			};
		}])
		/**
		 * [管理员获取需求相关]
		 * @param  {[search]} [搜索需求]
		 */
	    .factory('adminRequirement', ['$http', function($http){
			var doRequest = function(url,data){
				return $http({
	                method : 'POST',
	                url : RootUrl+'api/v2/web/admin/requirement/'+url,
	                headers: {
						'Content-Type': 'application/json; charset=utf-8'
				    },
	                data: data
	            });
			};
			return {
				search : function(data){return doRequest('search',data);}
			};
		}])
		/**
		 * [管理员获取方案相关]
		 * @param  {[search]} [搜索方案]
		 */
	    .factory('adminPlan', ['$http', function($http){
			var doRequest = function(url,data){
				return $http({
	                method : 'POST',
	                url : RootUrl+'api/v2/web/admin/'+url,
	                headers: {
						'Content-Type': 'application/json; charset=utf-8'
				    },
	                data: data
	            });
			};
			return {
				search : function(data){return doRequest('search_plan',data);}
			};
		}])
		/**
		 * [管理员获取作品相关]
		 * @param  {[search]} [搜索作品]
		 * @param  {[auth]} [作品审核认证]
		 */
	    .factory('adminProduct', ['$http', function($http){
			var doRequest = function(url,data){
				return $http({
	                method : 'POST',
	                url : RootUrl+'api/v2/web/admin/'+url,
	                headers: {
						'Content-Type': 'application/json; charset=utf-8'
				    },
	                data: data
	            });
			};
			return {
				search : function(data){return doRequest('product/search',data);},
				auth : function(data){return doRequest('update_product_auth',data);}
			};
		}])
		/**
		 * [管理员获取工地管理]
		 * @param  {[list]} [获取列表]
		 */
	    .factory('adminField', ['$http', function($http){
			var doRequest = function(url,data){
				return $http({
	                method : 'POST',
	                url : RootUrl+'api/v2/web/admin/'+url,
	                headers: {
						'Content-Type': 'application/json; charset=utf-8'
				    },
	                data: data
	            });
			};
			return {
				search : function(data){return doRequest('search_process',data);}
			};
		}])
		/**
		 * [管理员获取API相关]
		 * @param  {[statistic]} [API数据统计]
		 */
	    .factory('adminApi', ['$http', function($http){
			var doRequest = function(url,data){
				return $http({
	                method : 'POST',
	                url : RootUrl+'api/v2/web/admin/'+url,
	                headers: {
						'Content-Type': 'application/json; charset=utf-8'
				    },
	                data: data
	            });
			};
			return {
				statistic : function(){return doRequest('api_statistic');}
			};
		}])
		/**
		 * [管理员获取APP相关]
		 * @param  {[feedback]} [用户反馈]
		 */
	    .factory('adminApp', ['$http', function($http){
			var doRequest = function(url,data){
				return $http({
	                method : 'POST',
	                url : RootUrl+'api/v2/web/admin/'+url,
	                headers: {
						'Content-Type': 'application/json; charset=utf-8'
				    },
	                data: data
	            });
			};
			return {
				feedback : function(data){return doRequest('feedback/search',data);}
			};
		}])
		/**
		 * [管理员获取专题活动相关]
		 * @param  {[angel]} [天使用户招募活动]
		 */
	    .factory('adminEvents', ['$http', function($http){
			var doRequest = function(url,data){
				return $http({
	                method : 'POST',
	                url : RootUrl+'api/v2/web/admin/'+url,
	                headers: {
						'Content-Type': 'application/json; charset=utf-8'
				    },
	                data: data
	            });
			};
			return {
				angel : function(data){return doRequest('search_angel_user',data);},
				answer : function(data){return doRequest('count_answer',data);}
			};
		}])
		/**
		 * [管理员获取文章]
		 * @param  {[angel]} [装修攻略]
		 */
	    .factory('adminArticle', ['$http', function($http){
			var doRequest = function(url,data){
				return $http({
	                method : 'POST',
	                url : RootUrl+'api/v2/web/admin/'+url,
	                headers: {
						'Content-Type': 'application/json; charset=utf-8'
				    },
	                data: data
	            });
			};
			return {
				search : function(data){return doRequest('search_article',data);},
				add : function(data){return doRequest('add_article',data);},
				upload : function(data){return doRequest('update_article',data);}
			};
		}])
		/**
		 * [管理员获取装修美图]
		 * @param  {[image]} [天使用户招募活动]
		 */
	    .factory('adminImage', ['$http', function($http){
			var doRequest = function(url,data){
				return $http({
	                method : 'POST',
	                url : RootUrl+'api/v2/web/admin/'+url,
	                headers: {
						'Content-Type': 'application/json; charset=utf-8'
				    },
	                data: data
	            });
			};
			return {
				search : function(data){return doRequest('search_beautiful_image',data);},
				add : function(data){return doRequest('add_beautiful_image',data);},
				upload : function(data){return doRequest('update_beautiful_image',data);}
			};
		}])
		/**
		 * [管理员设置初始化数据]
		 * @param  {[list]} [获取列表]
		 */
	    .factory('initData', function(){
			return {
				list : []
			};
		});
 })();
