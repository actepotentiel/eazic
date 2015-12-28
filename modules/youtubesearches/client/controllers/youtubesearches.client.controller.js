'use strict';

// Youtubesearches controller
angular.module('youtubesearches').controller('YoutubePlayerController', ['$scope', '$stateParams', '$location', 'Authentication','YoutubePlayerService','RoomService','PlayerService',
	function($scope, $stateParams, $location, Authentication, YoutubePlayerService, RoomService, PlayerService) {
		$scope.authentication = Authentication;
        $scope.youtubePlayerService = YoutubePlayerService;
        $scope.roomService = RoomService;
        $scope.playerService = PlayerService;
        $scope.playerVars = {
            controls: 0,
            autoplay: 1
        };

        $scope.$on('youtube.player.ended', function ($event, player) {
            console.log("ENDED!!!!!");
            var playerSide;
            if(player.f.offsetParent.getAttribute('id') === "playerLeftContainer"){
                playerSide = "left";
            }else{
                playerSide = "right";
            }
            $scope.playerService.sendCommand({
                name: "play",
                sound: $scope.roomService.room.playlist.sounds[1],
                player: playerSide
            });
        });

        $scope.$on('youtube.player.playing', function ($event, player) {
            console.log("PLAYING!!!!!");
            console.log(player.f.offsetParent);
        });

        $scope.$on('youtube.player.paused', function ($event, player) {
            console.log("PAUSED!!!!!");
            console.log(player.f.offsetParent.getAttribute('id'));        });

        $scope.$on('youtube.player.buffering', function ($event, player) {
            console.log("BUFFERING!!!!!");
            console.log(player.f.offsetParent);
        });


	}
]);
