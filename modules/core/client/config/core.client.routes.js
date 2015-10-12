'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider','$routeProvider',
    function ($stateProvider, $urlRouterProvider, $routeProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider.state('site', {
            url: '/:params',
            views: {
                'content@': {
                    controller: function($scope, $stateParams){
                        $scope.params = $stateParams;
                        console.log('ici');
                    }
                }
            }
        });
    }
]);
