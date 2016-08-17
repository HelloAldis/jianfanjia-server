'use strict';
(function() {
    // load modules
    angular.module('myJyzOwner', ['ui.router','pasvaz.bindonce','controllers', 'services', 'filters' , 'directives','ngmodel.format','my.jyz'])
        .run(['$rootScope','$state','$stateParams',function($rootScope,$state,$stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.$on('$stateChangeStart',function(){
            });
            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
                document.documentElement.scrollTop = document.body.scrollTop = 0;
            });
            $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
                alert('An error occurred while changing states: ' + error);
            });
        }])
        .config(function($stateProvider, $urlRouterProvider) {
            var url = '/tpl/user/owner/';
            $urlRouterProvider.otherwise('/index');
            $stateProvider
                .state('index', {
                    url: '/index',
                    templateUrl: url+'index.html',
                    controller : 'indexCtrl'
                })
                .state('infor', {
                    url: '/infor',
                    templateUrl: url+'infor.html',
                    controller : 'inforCtrl'
                })
                .state('addRequirement', {
                    url: '/release',
                    templateUrl: url+'release.html',
                    controller : 'releaseCtrl'
                })
                .state('addRequirementb', {
                    url: '/releaseb',
                    templateUrl: url+'releaseb.html',
                    controller : 'releaseCtrl'
                })
                .state('bindPhone', {
                    url: '/phone',
                    templateUrl: url+'phone.html',
                    controller : 'phoneCtrl'
                })
                .state('updateRequirement', {
                    url: '/release/:id',
                    templateUrl: url+'release.html',
                    controller : 'releaseCtrl'
                })
                .state('updateRequirementb', {
                    url: '/releaseb/:id',
                    templateUrl: url+'releaseb.html',
                    controller : 'releaseCtrl'
                })
                .state('requirementList', {
                    url: '/requirementList',
                    templateUrl: url+'requirementList.html',
                    controller : 'requirementListCtrl'
                })
                .state('requirement', {
                    url: '/requirement/:id',
                    templateUrl: url+'requirement.html'
                })
                .state('requirement.detail', {
                    url: '/detail',
                    templateUrl: url+'detail.html',
                    controller : 'requirementCtrl'
                })
                .state('requirement.plan', {
                    url: '/plan',
                    templateUrl: url+'plan.html',
                    controller : 'requirementCtrl'
                })
                .state('requirement.field', {
                    url: '/field',
                    templateUrl: url+'field.html',
                    controller : 'requirementFieldCtrl'
                })
                .state('requirement.fulfill', {
                    url: '/fulfill',
                    templateUrl: url+'fulfill.html',
                    controller : 'requirementfulfillCtrl'
                })
                .state('favorite', {
                    url: '/favorite',
                    template: '<div ui-view></div>'
                })
                .state('favorite.list', {
                    url: '/{id:[0-9]{1,6}}',
                    templateUrl: url+'favorite.html',
                    controller : 'favoriteProductCtrl'
                })
                .state('designer', {
                    url: '/designer',
                    template: '<div ui-view></div>'
                })
                .state('designer.list', {
                    url: '/{id:[0-9]{1,6}}',
                    templateUrl: url+'designer.html',
                    controller : 'favoriteDesignerCtrl'
                })
                .state('notice', {
                    url: '/notice',
                    template: '<div ui-view></div>'
                })
                .state('notice.list', {
                    url: '/list',
                    templateUrl: url+'notice.html',
                    controller : 'noticeCtrl'
                })
                .state('notice.list.type', {
                    url: '/{id:[0-9]{1,6}}?type&status',
                    templateUrl: url+'noticeList.html',
                    controller : 'noticeListCtrl'
                })
                .state('notice.detail', {
                    url: '/detail/:id',
                    templateUrl: url+'noticeDetail.html',
                    controller : 'noticeDetailCtrl'
                })
                .state('remind', {
                    url: '/remind',
                    template: '<div ui-view></div>'
                })
                .state('remind.list', {
                    url: '/list',
                    templateUrl: url+'remind.html',
                    controller : 'remindCtrl'
                })
                .state('remind.list.type', {
                    url: '/{id:[0-9]{1,6}}?type&status',
                    templateUrl: url+'remindList.html',
                    controller : 'remindListCtrl'
                })
                .state('comment', {
                    url: '/comment',
                    template: '<div ui-view></div>'
                })
                .state('comment.list', {
                    url: '/list',
                    templateUrl: url+'comment.html',
                    controller : 'commentCtrl'
                })
                .state('comment.list.type', {
                    url: '/{id:[0-9]{1,6}}?type&status',
                    templateUrl: url+'commentList.html',
                    controller : 'commentListCtrl'
                })
                .state('diary', {
                    url: '/diary',
                    template: '<div ui-view></div>'
                })
                .state('diary.list', {
                    url: '/list',
                    templateUrl: url+'diary.html',
                    controller : 'diaryCtrl'
                })
                .state('diary.add', {
                    url: '/add/:id',
                    templateUrl: url+'addDiary.html',
                    controller : 'addDiaryCtrl'
                })
                .state('diary.show', {
                    url: '/show?_id&title&house_area&house_type&dec_style&work_type&latest_section_label&cover_imageid',
                    templateUrl: url+'showDiary.html',
                    controller : 'showDiaryCtrl'
                })
        });
    // angular bootstrap
    angular.bootstrap(document, ['myJyzOwner']);
})();
