/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('JfjAdmin.pages', [
      'ui.router',

      'JfjAdmin.pages.index',
      'JfjAdmin.pages.news',
      'JfjAdmin.pages.pictures',
      'JfjAdmin.pages.survey',
      'JfjAdmin.pages.requirement',
      'JfjAdmin.pages.plan',
      'JfjAdmin.pages.user'
    ])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
    $urlRouterProvider.otherwise('/index');
  }

})();
