'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider','$routeProvider',
    function ($stateProvider, $urlRouterProvider, $routeProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider.state('site', {
            url: '/:params',
            views: {
                'content@': {
                    controller: function($scope, $stateParams, Socket){
                        $scope.params = $stateParams.params;
                        console.log($scope.params);

                        // Create a new message object
                        //var message = {
                        //    text: $scope.params
                        //};
                        //if($scope.params){
                        //    Socket.join($scope.params);
                        //}

                        // Emit a 'chatMessage' message event
                        Socket.emit('room.join', $scope.params);


                    }
                }
            }
        });
    }
]);
