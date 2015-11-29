'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication','$translate','Socket', 'PlaylistService', 'RoomService',
  function ($scope, Authentication, $translate, Socket, PlaylistService, RoomService) {
      // This provides Authentication context.
      $scope.authentication = Authentication;
      $scope.playlistService = PlaylistService;
      $scope.roomService = RoomService;

    $scope.changeLanguage = function (langKey) {
      console.log("changeLanguage");
      $translate.use(langKey);
    };

    //Socket.on('conf.join.ack', function(data){
    //    console.log("conf.join.ack");
    //    console.log(data);
    //    if(data.isOk){
    //        console.log(typeof $scope.roomService.room);
    //        if(typeof $scope.roomService.room !== 'undefined'){
    //            $scope.oldRoom = angular.copy($scope.roomService.room);
    //        }
    //        $scope.roomService.room = data.room;
    //        console.log(typeof $scope.roomService.room);
    //        if(data.status === "create"){
    //            if($scope.oldRoom && $scope.oldRoom.playlist.sounds.length > 0){
    //                var commande = {
    //                    name : "newPlaylist",
    //                    playlist : $scope.oldRoom.playlist.sounds,
    //                    user : $scope.authentication.user
    //                };
    //                $scope.playlistService.sendCommand(commande);
    //            }
    //        }else{
    //            if($scope.oldRoom && $scope.oldRoom.playlist.sounds.length > 0){
    //                if($scope.roomService.hasOwnerAutorizationForCommand("addSounds")){
    //                    if(confirm("Voulez vous ajouter votre file de lecture courante à celle de la room?")){
    //                        var command = {
    //                            name : "addSounds",
    //                            sounds : $scope.oldRoom.playlist.sounds,
    //                            user : $scope.authentication.user
    //                        };
    //                        $scope.playlistService.sendCommand(command);
    //                    }else{
    //                        if(confirm("Voulez vous enregistrer la file de lecture? Dans le cas contraire elle sera perdue")){
    //                            //TODO sauvegarder la playlist
    //                        }
    //                    }
    //                }else {
    //                    if (confirm("Voulez vous enregistrer la file de lecture? Dans le cas contraire elle sera perdue")) {
    //                        //TODO sauvegarder la playlist
    //                    }
    //                }
    //            }
    //        }
    //    }else{
    //        //TODO process alert
    //        alert("Probleme lors de la connection à la room... Statut : " + data.status);
    //    }
    //});
    //
    //  Socket.on('info', function(command){
    //      console.log("info");
    //      console.log(command);
    //      if(!(command.name === "playerStatus" && $scope.roomService.room.isStandalone)){
    //          console.log("process info call");
    //          $scope.roomService.processInfo(command);
    //      }
    //  });

  }
]);
