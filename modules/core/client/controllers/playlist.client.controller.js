/**
 * Created by lardtiste on 20/09/15.
 */
'use strict';

angular.module('core').controller('PlaylistController', ['$scope', 'PlaylistService', '$stateParams', 'Authentication', 'Playlists', 'Socket','PlayerService',
    function($scope, PlaylistService, $stateParams, Authentication, Playlists, Socket, PlayerService) {
        // This provides Authentication context.
        $scope.authentication = Authentication;

        $scope.playlistService = PlaylistService;

        $scope.playerService = PlayerService;

        if($scope.authentication.user){
            $scope.playlistService.getMyPlaylists();
        }

        //Socket.on('playlist', function(command){
        //    console.log("playlist event");
        //    console.log(command);
        //    $scope.playlistService.processCommand(command);
        //});

        $scope.playSound = function(sound, player){
            $scope.playerService.sendCommand({
                name : "play",
                sound: sound,
                player: player
            });
        };

        $scope.removeSound = function(soundToDelete){
            $scope.playlistService.sendCommand({
                name : 'deleteSound',
                sound : soundToDelete
            });
        };

        $scope.removeAllSound = function(){
            $scope.playlistService.sendCommand({
                name: "newPlaylist",
                playlist : []
            });
        };

        $scope.loadPlaylist = function(playlist){
            console.log(playlist);
            $scope.playlistService.sendCommand({
                name : "addSounds",
                sounds : playlist.sounds
            });
        };

        $scope.saveList = function(){
            var soundsOfPlaylist = [];
            if(typeof $scope.playlistService.sounds === 'undefined'){
                $scope.playlistService.sounds = [];
            }
            $scope.playlistService.sounds.forEach(function(currentSound, index){
                var sound = currentSound;
                sound.order = index;
                soundsOfPlaylist.push(sound);
            });
            var result = prompt("Nom de la playlist", "Nouvelle playlist");
            var playlist = {
                title : result,
                sounds : soundsOfPlaylist
            };
            $scope.create(playlist);
        };

        $scope.removePlaylist = function(playlist){
            $scope.remove(playlist);
        };

        // Create new Playlist
        $scope.create = function(newPlaylist) {
            // Create new Playlist object
            var playlist = new Playlists ({
                title: newPlaylist.title,
                description : "",
                sounds : newPlaylist.sounds
            });

            // Redirect after save
            playlist.$save(function(response) {
                console.log(response);
                $scope.playlistService.getMyPlaylists();

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Playlist
        $scope.remove = function( playlist ) {
            if ( playlist ) {
                var playlistToRemove = new Playlists();
                playlistToRemove._id = playlist._id;
                playlistToRemove.$remove(function(result){
                    console.log(result);
                    $scope.playlistService.getMyPlaylists();
                });


            }
        };

        // Update existing Playlist
        $scope.update = function() {
            var playlist = $scope.playlist ;

            playlist.$update(function() {
                //$location.path('playlists/' + playlist._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Playlists
        $scope.find = function() {
            $scope.playlists = Playlists.query();
        };

        //// Find existing Playlist
        //$scope.findOne = function() {
        //    $scope.playlist = Playlists.get({
        //        playlistId: $stateParams.playlistId
        //    });
        //};
    }
]);
