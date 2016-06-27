/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('JfjAdmin.pages.chart', [
    'JfjAdmin.pages.chart.requirement',
    'JfjAdmin.pages.chart.user'
  ]).config(routeConfig).config(chartJsConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('chart', {
        url: '/chart',
        abstract: true,
        template: '<div ui-view></div>',
        title: '数据图表',
        sidebarMeta: {
          icon: 'ion-stats-bars',
          order: 1,
        },
      });
  }

  function chartJsConfig(ChartJsProvider, baConfigProvider) {
    var layoutColors = baConfigProvider.colors;
    // Configure all charts
    ChartJsProvider.setOptions({
      colours: [layoutColors.primary, layoutColors.danger, layoutColors.warning, layoutColors.success, layoutColors.info, layoutColors.default,
        layoutColors.primaryDark, layoutColors.successDark, layoutColors.warningLight, layoutColors.successLight, layoutColors.primaryLight
      ],
      responsive: true,
      scaleFontColor: layoutColors.defaultText,
      scaleLineColor: layoutColors.border,
      pointLabelFontColor: layoutColors.defaultText
    });
    // Configure all line charts
    // ChartJsProvider.setOptions('Line', {
    //   datasetFill: false
    // });
  }

})();
