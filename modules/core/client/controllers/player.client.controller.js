/**
 * Created by lardtiste on 20/09/15.
 */
'use strict';

angular.module('core').controller('PlayerController', ['$scope', 'Authentication', 'Socket', 'PlaylistService','RoomService','PlayerService',
    function($scope, Authentication, Socket, PlaylistService, RoomService, PlayerService) {
        // This provides Authentication context.
        $scope.authentication = Authentication;
        $scope.playlistService = PlaylistService;
        $scope.roomService = RoomService;
        $scope.playerService = PlayerService;


        //$scope.role = $scope.roomService.room.role;

        $scope.toggleDoublePlayer = function(){
            console.log($scope.roomService.room.player);
            $scope.roomService.sendInfo({
                name : "playerStatus",
                player : $scope.roomService.room.player
            });
        };

        $scope.play = function(player){
            $scope.playerService.sendCommand({
                name: "play",
                player: player
            });
        };

        $scope.pause = function(player){
            $scope.playerService.sendCommand({
                name: "pause",
                player: player
            });
        };

        $scope.stop = function(player){
            $scope.playerService.sendCommand({
                name: "stop",
                player: player
            });
        };

        $scope.setVolume = function(player, volume){
            console.log(player, volume);
            $scope.playerService.sendCommand({
                name: "setVolume",
                player: player,
                volume: volume
            });
        };

        $scope.seekTo = function(playerSide, seekTo){
            console.log(playerSide, seekTo);
            //var player;
            //if(playerSide === 'left'){
            //    player = $scope.roomService.room.player.left.currentSound.
            //}else{
            //
            //}
            //
            //var second =

            $scope.playerService.sendCommand({
                name: "seekTo",
                player: playerSide,
                seekTo: seekTo
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
