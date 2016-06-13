/**
 * @author Aldis
 */
(function () {
  'use strict';

  angular.module('JfjAdmin.pages.live', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('live', {
        url: '/live/:detail',
        templateUrl: 'app/pages/live/live.html',
        title: '装修直播列表',
        controller: 'LiveController',
        sidebarMeta: {
          icon: 'ion-ios-videocam',
          order: 60,
        },
      })
      .state('liveAdd', {
        url: '/live/add',
        templateUrl: 'app/pages/live/liveAdd.html',
        controller: 'LiveAddController'
      })
      .state('liveEditor', {
        url: '/live/editor/:id',
        templateUrl: 'app/pages/live/liveEditor.html',
        controller: 'LiveEditorController'
      })
      .state('liveUpdate', {
        url: '/live/update/:id',
        templateUrl: 'app/pages/live/liveUpdate.html',
        controller: 'LiveUpdateController'
      });
  }

})();
