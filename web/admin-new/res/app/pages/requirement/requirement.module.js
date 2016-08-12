/**
 * @author Aldis
 */
(function () {
  'use strict';

  angular.module('JfjAdmin.pages.requirement', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('requirement', {
        url: '/requirement/:detail',
        templateUrl: 'app/pages/requirement/requirement.html',
        title: '需求列表',
        controller: 'RequirementController',
        sidebarMeta: {
          icon: 'fa fa-building',
          order: 10,
        },
      }).state('requirementDetail', {
        title: '需求列表',
        url: '/requirement/detail/:id',
        templateUrl: 'app/pages/requirement/requirementDetail.html',
        controller: 'RequirementDetailController',
      })
      // 指派设计师给业主
      .state('assignDesigner', {
        title: '需求列表',
        url: '/assignDesigner/:requireId/:orderDesignerIds',
        templateUrl: 'app/pages/requirement/assignDesigner.html',
        controller: 'AssignDesignerController'
      });
  }

})();
