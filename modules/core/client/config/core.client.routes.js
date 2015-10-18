'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider.state('site', {
            url: '/:params',
            views: {
                'content@': {
                    controller: function($scope, $stateParams, Socket, $location, Authentication){
                        console.log("ROUTING_CONTROLLER");
                        //if(Authentication.user){
                        //    $scope.params = $stateParams.params;
                        //    console.log($scope.params);
                        //
                        //    if (!Socket.socket) {
                        //        Socket.connect();
                        //    }
                        //    Socket.emit('conf.join', $scope.params);
                        //    Socket.on('conf.join.ack', function(data){
                        //        console.log(data);
                        //        $location.path(data.conf.name);
                        //        //$route.reload();
                        //    });
                        //}




                    }
                }
            }
        });
    }
]);
