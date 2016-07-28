/**
 * @author Aldis
 */
(function () {
  'use strict';

  angular.module('JfjAdmin.pages.designer', ['toastr'])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('designer', {
        url: '/designer/:detail',
        templateUrl: 'app/pages/designer/designer.html',
        title: '设计师列表',
        controller: 'DesignerController',
        sidebarMeta: {
          icon: 'ion-android-walk',
          order: 40,
        },
      })
      .state('designerTeamList', {
        title: '施工团队列表',
        url: '/designer/team/:id',
        templateUrl: 'app/pages/designer/designerTeamList.html',
        controller: 'DesignerTeamListController'
      })
      .state('designerEditorTeam', {
        url: '/team/editor/:id',
        templateUrl: 'app/pages/designer/designerTeamEditor.html',
        controller: 'DesignerTeamEditorController'
      })
      .state('designerInfo', {
        url: '/designer/info/:id',
        templateUrl: 'app/pages/designer/designerInfo.html',
        controller: 'DesignerInfoController'
      })
      .state('designerIdAuth', {
        url: '/designer/idauth/:id',
        templateUrl: 'app/pages/designer/designerIdAuth.html',
        controller: 'DesignerIdAuthController'
      })
      .state('designerWorkAuth', {
        url: '/designer/workauth/:id',
        templateUrl: 'app/pages/designer/designerWorkAuth.html',
        controller: 'DesignerWorkAuthController'
      })
      .state('designerInfoAuth', {
        url: '/designer/infoauth/:id',
        templateUrl: 'app/pages/designer/designerInfoAuth.html',
        controller: 'DesignerInfoAuthController'
      })
      .state('designerEditor', {
        url: '/designer/editor/:id',
        templateUrl: 'app/pages/designer/designerEditor.html',
        controller: 'DesignerEditorController'
      });
  }

})();
