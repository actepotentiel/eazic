/**
 * Created by lardtiste on 20/09/15.
 */
'use strict';

angular.module('core').controller('PlayerController', ['$scope', 'Authentication', 'Socket', 'PlaylistService','RoomService',
    function($scope, Authentication, Socket, PlaylistService, RoomService) {
        // This provides Authentication context.
        $scope.authentication = Authentication;
        $scope.playlistService = PlaylistService;
        $scope.roomService = RoomService;


        //$scope.role = $scope.roomService.room.role;

        $scope.toggleDoublePlayer = function(){
            console.log($scope.roomService.room.player);
            $scope.roomService.sendInfo({
                name : "playerStatus",
                player : $scope.roomService.room.player
            });
        };

        $scope.toggleRole = function(){
            console.log("toggle role");
            if($scope.oldRole === "standalone"){
                console.log("EMIT REQUEST");
                Socket.emit("request", {
                    name : "playerStatus"
                });
            }
            $scope.oldRole = angular.copy($scope.roomService.room.role);
        };

    }
]);
