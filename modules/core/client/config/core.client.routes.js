'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider.state('site', {
            url: '/:params',
            views: {
                'content@': {
                    controller: function($scope, $stateParams, Socket, $location, Authentication, RoomService){
                        console.log("ROUTING_CONTROLLER");
                        if(Authentication.user){
                            if($stateParams.params){
                                console.log("param:");
                                console.log($stateParams.params);

                                if (!Socket.socket) {
                                    Socket.connect();
                                }

                                Socket.emit('conf.join', $stateParams.params);
                            }else{
                                if(RoomService.room){
                                    $location.path('/' + RoomService.room.conf.name);
                                }else{
                                    RoomService.updateRoom();
                                }
                            }

                        }
                    }
                }
            }
        });
    }
]);
