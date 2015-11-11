'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication','$translate','Socket', 'PlaylistService', 'RoomService',
  function ($scope, Authentication, $translate, Socket, PlaylistService, RoomService) {
      // This provides Authentication context.
      $scope.authentication = Authentication;
      $scope.playlistService = PlaylistService;

    $scope.changeLanguage = function (langKey) {
      console.log("changeLanguage");
      $translate.use(langKey);
    };

    Socket.on('conf.join.ack', function(data){
        console.log("conf.join.ack");
        console.log(data);
        if(data.isOk){
            $scope.authentication.room = data.room;
            if(data.isNewRoom){
                $scope.playlistService.sendCommand("playlist.newPlaylist", null, $scope.playlistService.sounds, null);
            }else{
                //TODO ici ça veut dire que le mec rejoint une room existante
                //TODO si l'utilisateur a les droits, lui demander s'il veut envoyer
                //TODO sa file de lecture courante, ou l'enregistrer, car sinon
                //TODO sa file de lecture sera perdue
                if(confirm("Voulez vous ajouter votre file de lecture courante à celle de la room?")){
                    var sounds = angular.copy($scope.playlistService.sounds);
                    $scope.playlistService.sendCommand("playlist.addSounds", null, sounds, null);
                }else{
                    if(confirm("Voulez vous enregistrer la file de lecture? Dans le cas contraire elle sera perdue")){
                        //TODO sauvegarder la playlist
                    }
                    $scope.playlistService.sounds = $scope.authentication.room.playlist.sounds;
                }
            }
        }else{
            alert("Probleme lors de la connection à la room...");
        }
    });

      Socket.on('info', function(command){
          console.log("info");
          console.log(command);
          RoomService.processInfo(command);
          if(command.isAlert){
              alert(command.message);
          }
      });

  }
]);
