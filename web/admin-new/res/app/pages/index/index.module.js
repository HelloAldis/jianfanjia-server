/**
 * @author Aldis
 */
(function () {
  'use strict';

  angular.module('JfjAdmin.pages.index', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('index', {
        url: '/index',
        templateUrl: 'app/pages/index/index.html',
        title: '仪表盘',
        controller: 'IndexController',
        sidebarMeta: {
          icon: 'fa fa-home',
          order: 0,
        },
      });
  }

})();
