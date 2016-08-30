(function () {
  'use strict';

  angular.module("JfjAdmin.pages.quotations", [])
    .config(routeConfig);

  function routeConfig($stateProvider) {
    $stateProvider
      .state('quotations', {
        url: '/quotations/:detail',
        templateUrl: 'app/pages/quotation/quotations.html',
        title: '报价列表',
        controller: 'quotationController',
        sidebarMeta: {
          icon: 'ion-android-clipboard',
          order: 20
        }
      });
  }

})();
