'use strict';
(function () {
  // load modules
  angular.module('myJyzApp', ['ui.router', 'ui.bootstrap', 'ng.ueditor', 'controllers', 'services', 'filters'])
    .run(function ($rootScope, $state, $stateParams) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
      $rootScope.getPcUrl = function (url) {
        if (window.location.hostname == 'localhost') {
          return 'http://127.0.0.1' + window.location.port + url;
        } else if (window.location.hostname == 'devgod.jianfanjia.com') {
          return 'http://dev.jianfanjia.com' + window.location.port + url;
        } else {
          return 'http://www.jianfanjia.com' + window.location.port + url;
        }
      }
    })
    .config(function ($stateProvider, $urlRouterProvider) {
      var RootURl = '../static/';
      $urlRouterProvider.otherwise('/index');
      $stateProvider
        .state('index', {
          url: '/index',
          templateUrl: RootURl + 'views/index/index.html',
          controller: 'IndexController'
        })
        .state('requirement', {
          url: '/requirement/:detail',
          templateUrl: RootURl + 'views/requirement/requirement.html',
          controller: 'RequirementController'
        })
        .state('requirementDesigner', {
          url: '/requirement/designer/:id',
          templateUrl: RootURl + 'views/requirement/designer.html',
          controller: 'RequirementDesignerController'
        })
        .state('plans', {
          url: '/plans/:detail',
          templateUrl: RootURl + 'views/plans/plans.html',
          controller: 'PlansController'
        })
        .state('user', {
          url: '/user/:detail',
          templateUrl: RootURl + 'views/user/user.html',
          controller: 'UserController'
        })
        .state('userInfo', {
          url: '/user/info/:id',
          templateUrl: RootURl + 'views/user/info.html',
          controller: 'UserInfoController'
        })
        .state('userRequirement', {
          url: '/user/requirement/:id',
          templateUrl: RootURl + 'views/user/requirement.html',
          controller: 'UserRequirementController'
        })
        .state('userDesigner', {
          url: '/user/designer/:id',
          templateUrl: RootURl + 'views/user/designer.html',
          controller: 'UserDesignerController'
        })
        .state('designer', {
          url: '/designer/:detail',
          templateUrl: RootURl + 'views/designer/designer.html',
          controller: 'DesignerController'
        })
        .state('designerTeam', {
          url: '/designer/team/:id',
          templateUrl: RootURl + 'views/designer/team.html',
          controller: 'DesignerTeamController'
        })
        .state('designerEditorTeam', {
          url: '/designer/team/editor/:id',
          templateUrl: RootURl + 'views/designer/teamEditor.html',
          controller: 'DesignerEditorTeamController'
        })
        .state('designerInfo', {
          url: '/designer/info/:id',
          templateUrl: RootURl + 'views/designer/info.html',
          controller: 'DesignerInfoController'
        })
        .state('designerInfoAuth', {
          url: '/designer/infoauth/:id',
          templateUrl: RootURl + 'views/designer/infoauth.html',
          controller: 'DesignerInfoAuthController'
        })
        .state('designerIdAuth', {
          url: '/designer/idauth/:id',
          templateUrl: RootURl + 'views/designer/idauth.html',
          controller: 'DesignerIdAuthController'
        })
        .state('designerFieldAuth', {
          url: '/designer/fieldauth/:id',
          templateUrl: RootURl + 'views/designer/fieldauth.html',
          controller: 'DesignerFieldAuthController'
        })
        .state('product', {
          url: '/product/:detail',
          templateUrl: RootURl + 'views/product/product.html',
          controller: 'ProductController'
        })
        .state('live', {
          url: '/live/:detail',
          templateUrl: RootURl + 'views/live/live.html',
          controller: 'LiveController'
        })
        .state('liveAdd', {
          url: '/live/add',
          templateUrl: RootURl + 'views/live/add.html',
          controller: 'AddController'
        })
        .state('liveEditor', {
          url: '/live/editor/:id',
          templateUrl: RootURl + 'views/live/editor.html',
          controller: 'EditorController'
        })
        .state('liveUpdata', {
          url: '/live/updata/:id',
          templateUrl: RootURl + 'views/live/updata.html',
          controller: 'UpdataController'
        })
        .state('field', {
          url: '/field/:detail',
          templateUrl: RootURl + 'views/field/field.html',
          controller: 'FieldController'
        })
        .state('fieldMore', {
          url: '/field/:id',
          templateUrl: RootURl + 'views/field/detail.html',
          controller: 'FieldDetailController'
        })
        .state('feedback', {
          url: '/feedback/:detail',
          templateUrl: RootURl + 'views/feedback/feedback.html',
          controller: 'FeedbackController'
        })
        .state('recruit', {
          url: '/recruit/:detail',
          templateUrl: RootURl + 'views/recruit/recruit.html',
          controller: 'RecruitController'
        })
        .state('news', {
          url: '/news/:detail',
          templateUrl: RootURl + 'views/news/new.html',
          controller: 'NewsController'
        })
        .state('newsAdd', {
          url: '/news/add/:id',
          templateUrl: RootURl + 'views/news/add.html',
          controller: 'NewsAddController'
        })
        .state('pictures', {
          url: '/pictures/:detail',
          templateUrl: RootURl + 'views/pictures/pictures.html',
          controller: 'PicturesListController'
        })
        .state('picturesAdd', {
          url: '/pictures/add/:id',
          templateUrl: RootURl + 'views/pictures/add.html',
          controller: 'PicturesAddController'
        })
        .state('survey', {
          url: '/survey',
          templateUrl: RootURl + 'views/survey/list.html',
          controller: 'SurveyListController'
        })
        .state('surveyDetail', {
          url: '/survey/:id',
          templateUrl: RootURl + 'views/survey/detail.html',
          controller: 'SurveyDetailController'
        });
    });
  // angular bootstrap
  angular.bootstrap(document, ['myJyzApp']);
})();
