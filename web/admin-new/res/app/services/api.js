(function () {
  'use strict';

  angular.module('JfjAdmin.services.api', [])
    .factory('doAdminRequest', ['$http', function ($http) {
      var doAdminRequest = function (url, data) {
        return $http({
          method: 'POST',
          url: 'api/v2/web/admin/' + url,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          data: data
        });
      };
      return doAdminRequest;
    }])
    .factory('doRequest', ['$http', function ($http) {
      var doAdminRequest = function (url, data) {
        return $http({
          method: 'POST',
          url: 'api/v2/web/' + url,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          data: data
        });
      };
      return doAdminRequest;
    }])

  /**
   * [管理员创建装修直播]
   * @param  {[list]} [获取列表]
   * @param  {[get]} [获取单条数据]
   * @param  {[update]} [更新单条数据]
   * @param  {[add]} [新添加一条数据]
   * @param  {[remove]} [删除某一条数据]
   */
  .factory('adminShare', ['doAdminRequest', function (doAdminRequest) {
      return {
        search: function (data) {
          return doAdminRequest('share/search', data);
        },
        update: function (data) {
          return doAdminRequest('share/update', data);
        },
        add: function (data) {
          return doAdminRequest('share/add', data);
        },
        remove: function (data) {
          return doAdminRequest('share/delete', data);
        }
      };
    }])
    /**
     * [管理员获取业主相关]
     * @param  {[search]} [搜索业主]
     */
    .factory('adminUser', ['doAdminRequest', function (doAdminRequest) {
      return {
        search: function (data) {
          return doAdminRequest('search_user', data);
        }
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
    .factory('adminDesigner', ['doAdminRequest', function (doAdminRequest) {
      return {
        get: function (url) {
          return doAdminRequest('designer/' + url);
        },
        search: function (data) {
          return doAdminRequest('search_designer', data);
        },
        authing: function () {
          return doAdminRequest('authing_designer');
        },
        workAuth: function (data) {
          return doAdminRequest('update_work_auth', data);
        },
        uidAuth: function (data) {
          return doAdminRequest('update_uid_auth', data);
        },
        infoAuth: function (data) {
          return doAdminRequest('update_basic_auth', data);
        },
        online: function (data) {
          return doAdminRequest('update_designer_online_status', data);
        },
        editDesigner: function (data) {
          return doAdminRequest('update_designer', data);
        },
        idAuth: function (id) {
          return doAdminRequest('designer/' + id)
        },
        idAuthOpearate: function (data) {
          return doAdminRequest('update_uid_auth', data);
        }
      };
    }])
    /**
     * [管理员获取需求相关]
     * @param  {[search]} [搜索需求]
     */
    .factory('adminRequirement', ['doAdminRequest', function (doAdminRequest) {
      return {
        search: function (data) {
          return doAdminRequest('requirement/search', data);
        }
      };
    }])
    /**
     * [管理员获取方案相关]
     * @param  {[search]} [搜索方案]
     */
    .factory('adminPlan', ['doAdminRequest', function (doAdminRequest) {
      return {
        search: function (data) {
          return doAdminRequest('search_plan', data);
        }
      };
    }])
    /**
     * [管理员获取作品相关]
     * @param  {[search]} [搜索作品]
     * @param  {[auth]} [作品审核认证]
     */
    .factory('adminProduct', ['doAdminRequest', function (doAdminRequest) {
      return {
        search: function (data) {
          return doAdminRequest('product/search', data);
        },
        auth: function (data) {
          return doAdminRequest('update_product_auth', data);
        }
      };
    }])

  // 管理员日记列表
  .factory('adminDiary', ['doAdminRequest', function (doAdminRequest) {
    return {
      search: function (data) {
        return doAdminRequest('search_diary', data);
      },
      dele: function (id) {
        return doAdminRequest('delete_diary', id);
      }
    };
  }])

  // 管理员评论列表
  .factory('adminComment', ['doAdminRequest', function (doAdminRequest) {
    return {
      search: function (data) {
        return doAdminRequest('search_comment', data);
      },
      forbid: function (id) {
        return doAdminRequest('forbid_comment', id);
      }
    };
  }])

  /**
   * [管理员获取工地管理]
   * @param  {[list]} [获取列表]
   */
  .factory('adminField', ['doAdminRequest', function (doAdminRequest) {
      return {
        search: function (data) {
          return doAdminRequest('search_process', data);
        }
      };
    }])
    /**
     * [管理员获取API相关]
     * @param  {[statistic]} [API数据统计]
     */
    .factory('adminApi', ['doAdminRequest', function (doAdminRequest) {
      return {
        statistic: function () {
          return doAdminRequest('api_statistic');
        }
      };
    }])
    /**
     * [管理员获取APP相关]
     * @param  {[feedback]} [用户反馈]
     */
    .factory('adminApp', ['doAdminRequest', function (doAdminRequest) {
      return {
        feedback: function (data) {
          return doAdminRequest('feedback/search', data);
        }
      };
    }])
    /**
     * [管理员获取专题活动相关]
     * @param  {[angel]} [天使用户招募活动]
     */
    .factory('adminEvents', ['doAdminRequest', function (doAdminRequest) {
      return {
        angel: function (data) {
          return doAdminRequest('search_angel_user', data);
        },
        answer: function (data) {
          return doAdminRequest('count_answer', data);
        }
      };
    }])
    /**
     * [管理员获取文章]
     * @param  {[angel]} [装修攻略]
     */
    .factory('adminArticle', ['doAdminRequest', function (doAdminRequest) {
      return {
        search: function (data) {
          return doAdminRequest('search_article', data);
        },
        add: function (data) {
          return doAdminRequest('add_article', data);
        },
        upload: function (data) {
          return doAdminRequest('update_article', data);
        }
      };
    }])
    /**
     * [管理员获取装修美图]
     * @param  {[image]} [天使用户招募活动]
     */
    .factory('adminBeautifulImage', ['doAdminRequest', function (doAdminRequest) {
      return {
        search: function (data) {
          return doAdminRequest('search_beautiful_image', data);
        },
        add: function (data) {
          return doAdminRequest('add_beautiful_image', data);
        },
        upload: function (data) {
          return doAdminRequest('update_beautiful_image', data);
        }
      };
    }])
    /**
     * [管理员统计数据]
     */
    .factory('adminStatistic', ['doAdminRequest', function (doAdminRequest) {
      return {
        statistic_info: function (data) {
          return doAdminRequest('statistic_info', data);
        }
      };
    }])
    /**
     * [管理员统计数据]
     */
    .factory('adminImage', ['doAdminRequest', function (doAdminRequest) {
      return {
        search_image: function (data) {
          return doAdminRequest('search_image', data);
        },
        delete_image: function (data) {
          return doAdminRequest('delete_image', data);
        },
      };
    }])
    /**
     * [图片Api]
     */
    .factory('imageApi', ['doRequest', function (doRequest) {
      return {
        imagemeta: function (data) {
          return doRequest('imagemeta', data);
        }
      };
    }])
    /**
     * [登出]
     */
    .factory('userApi', ['doRequest', function (doRequest) {
      return {
        signout: function (data) {
          return doRequest('signout', data);
        }
      };
    }]);

})();
