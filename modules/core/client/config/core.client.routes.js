'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider.state('site', {
            url: '/:params',
            views: {
                'content@': {
                    controller: function($scope, $stateParams, Socket){
                        $scope.params = $stateParams.params;
                        console.log($scope.params);

                        if (!Socket.socket) {
                            Socket.connect();
                        }
                        console.log(Socket);
                        Socket.emit('room.join', $scope.params);


                    }
                }
            }
        });
    }
]);
