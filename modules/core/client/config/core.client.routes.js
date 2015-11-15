'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider.state('site', {
            url: '/:params',
            views: {
                'content@': {
                    controller: function($scope, $stateParams, Socket, $location, Authentication, RoomService, MyRooms){
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
                                if(Authentication.user.room){
                                    $location.path('/' + Authentication.user.room.conf.name);
                                }else{
                                    MyRooms.get({userId : Authentication.user._id}, function(result){
                                        if(result.length === 1){
                                            Authentication.user.room = result[0];
                                            $location.path('/' + Authentication.user.room.conf.name);
                                        }else{
                                            RoomService.processInfo({
                                                name : "alert",
                                                status : "user has no room"
                                            });
                                        }
                                    });
                                }
                            }

                        }else {
                            RoomService.instanciateDisposableRoom();
                            if ($stateParams.params){
                                $location.path('/');
                            }
                        }
                    }
                }
            }
        });
    }
]);
