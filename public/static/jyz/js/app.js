'use strict';
(function() {
    // load modules
    angular.module('myJyzApp', ['ui.router','ui.bootstrap', 'controllers', 'services', 'filters'])
        .config(function($stateProvider, $urlRouterProvider) {
            var RootURl = '../../../static/jyz/';
            $urlRouterProvider.otherwise('/index');
            $stateProvider
                .state('index', {
                    url: '/index',
                    templateUrl: RootURl+'views/index/index.html',
                    controller: 'IndexController'
                })
                .state('requirement', {
                    url: '/requirement',
                    templateUrl: RootURl+'views/requirement/requirement.html',
                    controller: 'RequirementController'
                })
                .state('requirementDesigner', {
                    url: '/requirement/designer/:id',
                    templateUrl: RootURl+'views/requirement/designer.html',
                    controller: 'RequirementDesignerController'
                })
                .state('plans', {
                    url: '/plans',
                    templateUrl: RootURl+'views/plans/plans.html',
                    controller: 'PlansController'
                })
                .state('user', {
                    url: '/user',
                    templateUrl: RootURl+'views/user/user.html',
                    controller: 'UserController'
                })
                .state('userInfo', {
                    url: '/user/info/:id',
                    templateUrl: RootURl+'views/user/info.html',
                    controller: 'UserInfoController'
                })
                .state('userRequirement', {
                    url: '/user/requirement/:id',
                    templateUrl: RootURl+'views/user/requirement.html',
                    controller: 'UserRequirementController'
                })
                .state('userDesigner', {
                    url: '/user/designer/:id',
                    templateUrl: RootURl+'views/user/designer.html',
                    controller: 'UserDesignerController'
                })
                .state('designer', {
                    url: '/designer',
                    templateUrl: RootURl+'views/designer/designer.html',
                    controller: 'DesignerController'
                })
                .state('designerTeam', {
                    url: '/designer/team/:id',
                    templateUrl: RootURl+'views/designer/team.html',
                    controller: 'DesignerTeamController'
                })
                .state('designerEditorTeam', {
                    url: '/designer/team/editor/:id',
                    templateUrl: RootURl+'views/designer/teamEditor.html',
                    controller: 'DesignerEditorTeamController'
                })
                .state('designerProduct', {
                    url: '/designer/product/:id',
                    templateUrl: RootURl+'views/designer/product.html',
                    controller: 'DesignerProductController'
                })
                .state('designerInfo', {
                    url: '/designer/info/:id',
                    templateUrl: RootURl+'views/designer/info.html',
                    controller: 'DesignerInfoController'
                })
                .state('designerInfoAuth', {
                    url: '/designer/infoauth/:id',
                    templateUrl: RootURl+'views/designer/infoauth.html',
                    controller: 'DesignerInfoAuthController'
                })
                .state('designerIdAuth', {
                    url: '/designer/idauth/:id',
                    templateUrl: RootURl+'views/designer/idauth.html',
                    controller: 'DesignerIdAuthController'
                })
                .state('designerFieldAuth', {
                    url: '/designer/fieldauth/:id',
                    templateUrl: RootURl+'views/designer/fieldauth.html',
                    controller: 'DesignerFieldAuthController'
                })
                .state('product', {
                    url: '/product',
                    templateUrl: RootURl+'views/product/product.html',
                    controller: 'ProductController'
                })
                .state('live', {
                    url: '/live',
                    templateUrl: RootURl+'views/live/live.html',
                    controller: 'LiveController'
                })
                .state('liveAdd', {
                    url: '/live/add',
                    templateUrl: RootURl+'views/live/add.html',
                    controller: 'AddController'
                })
                .state('liveEditor', {
                    url: '/live/editor/:id',
                    templateUrl: RootURl+'views/live/editor.html',
                    controller: 'EditorController'
                })
                .state('liveUpdata', {
                    url: '/live/updata/:id',
                    templateUrl: RootURl+'views/live/updata.html',
                    controller: 'UpdataController'
                })
                .state('field', {
                    url: '/field',
                    templateUrl: RootURl+'views/field/field.html',
                    controller: 'FieldController'
                })
                .state('recruit', {
                    url: '/recruit',
                    templateUrl: RootURl+'views/recruit/recruit.html',
                    controller: 'RecruitController'
                });
        });
    // angular bootstrap
    angular.bootstrap(document, ['myJyzApp']);
})();
