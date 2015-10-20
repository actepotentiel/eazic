'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider.state('site', {
            url: '/:params',
            views: {
                'content@': {
                    controller: function($scope, $stateParams, Socket, $location, Authentication, PlaylistService){
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
                                if(Authentication.room){
                                    $location.path('/' + Authentication.room.conf.name);
                                }else{
                                    PlaylistService.updateRoom();
                                }
                            }

                        }
                    }
                }
            }
        });
    }
]);
