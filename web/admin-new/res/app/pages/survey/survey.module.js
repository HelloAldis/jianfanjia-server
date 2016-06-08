/**
 * @author Karos
 */
(function () {
  'use strict';

  angular.module('JfjAdmin.pages.survey', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('survey', {
        url: '/survey',
        templateUrl: 'app/pages/survey/surveyList.html',
        title: '问卷调查',
        controller: 'SurveyListController',
        sidebarMeta: {
          icon: 'ion-android-home',
          order: 12,
        },
      });
  }

})();
