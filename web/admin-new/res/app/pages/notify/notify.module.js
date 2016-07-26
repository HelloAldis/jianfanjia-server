(function () {
  'use strict';

  angular.module('JfjAdmin.pages.notify', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('notify', {
        url: '/notify/:detail',
        templateUrl: 'app/pages/notify/notify.html',
        title: '消息推送',
        controller: 'NotifyController',
        sidebarMeta: {
          icon: 'fa fa-bell',
          order: 100,
        }
      })
  }

})();
