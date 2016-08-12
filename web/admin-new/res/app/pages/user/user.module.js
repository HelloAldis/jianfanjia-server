/**
 * @author Aldis
 */
(function () {
  'use strict';

  angular.module('JfjAdmin.pages.user', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('user', {
        url: '/user/:detail',
        templateUrl: 'app/pages/user/user.html',
        title: '业主列表',
        controller: 'UserController',
        sidebarMeta: {
          icon: 'ion-android-person',
          order: 30,
        },
      })
      .state('userInfo', {
        title: '业主列表',
        url: '/user/info/:id',
        templateUrl: 'app/pages/user/userInfo.html',
        controller: 'UserInfoController'
      })
      .state('userRequirement', {
        title: '业主列表',
        url: '/user/requirement/:id',
        templateUrl: 'app/pages/user/userRequirement.html',
        controller: 'UserRequirementController'
      });
      // 指派设计师给业主
      // .state('assignDesigner', {
      //   title: '业主列表',
      //   url: '/user/requirement/assignDesigner/:requireId/:userIds',
      //   templateUrl: 'app/pages/user/assignDesigner.html',
      //   controller: 'AssignDesignerController'
      // });
  }

})();
