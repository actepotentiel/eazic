/**
 * Created by lardtiste on 20/09/15.
 */
'use strict';

angular.module('core').factory('PlaylistService', ['Authentication','$timeout','Socket', 'MyRooms','MyPlaylists','$location','$stateParams',
    function(Authentication, $timeout, Socket, MyRooms, MyPlaylists, $location, $stateParams) {
        var _this = this;
        var authentication = Authentication;
        _this._data = {
            sounds: window.sounds,
            playlists: window.playlists,
            goToMyRoom : function(){
                if(authentication.room) {
                    $location.path('/' + authentication.room.conf.name);
                }
            },
            updateRoom: function(){
                var __this = this;
                if(authentication.user){
                    MyRooms.get({userId : authentication.user._id}, function(result){
                        if(result.length === 1){
                            //authentication.room = result[0];
                            //console.log($stateParams.params);
                            if(!$stateParams.params){
                                $location.path('/' + authentication.room.conf.name);
                            }
                        }else{
                            //TODO afficher l'erreur
                            alert("Problème d'intégrité de données, veuillez contacter un administrateur.");
                        }
                    });
                }
            },
            updatePlaylists: function(){
                var __this = this;
                if(authentication.user){
                    MyPlaylists.get({userId : authentication.user._id}, function(result){
                        __this.playlists = result;
                    });
                }
            },
            sendCommand: function(nomCommand, sound, playlist, isDouble){
                console.log("sendCommand");
                var commande = {
                    nom : nomCommand,
                    sound: sound,
                    playlist: playlist,
                    isDouble: isDouble
                };
                if(authentication.room){
                    if(this.hasRoomAutorization(nomCommand)){
                        Socket.emit(nomCommand, commande);
                        this.processCommand(commande);
                    }else{
                        alert("Vous n'êtes pas autorisé à envoyer cette commande. Demandez les droits au propriétaire de la room.");
                    }

                }else{
                    this.processCommand(commande);
                }

            },
            hasRoomAutorization : function(nomCommand){
                if(authentication.room.conf.owner._id + "" === authentication.user._id + ""){
                    return true;
                }else{
                    //TODO checker si l'utilisateur a les droits
                    for(var i = 0 ; i < authentication.room.policies.length ; i++){
                        for(var j = 0 ; j < authentication.room.policies[i].users.length ; j++){
                            if(authentication.room.policies[i].users[j] + "" === authentication.user._id + ""){
                                console.log("Finded user in policies");
                                if(authentication.room.policies[i].name + "" === "vip"){
                                    return true;
                                }
                                for(var k = 0 ; k < authentication.room.policies[i].allowedCommands.length ; k++){
                                    if(authentication.room.policies[i].allowedCommands[k].commandName + "" === nomCommand + ""){
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                    return false;
                }
            },
            processCommand: function(command){
                console.log("processCommand");
                if((command.nom === 'playlist.addSound')&&(command.sound.sourceId && (command.sound.sourceId !== ''))){
                    this.processAddSound(command.sound);
                }else if(command.nom === 'playlist.addSounds'){
                    this.processAddSounds(command.playlist);
                }else if(command.nom === 'playlist.deleteSound'){
                    this.processDeleteSound(command.sound);
                }else if(command.nom === 'playlist.newPlaylist'){
                    this.processNewPlaylist(command.playlist);
                }else if(command.nom === 'playlist.changeOrder'){
                    this.processChangeOrder(command.sound);
                }else if(command.nom === 'playlist.deleteAllSound'){
                    this.processDeleteAllSound();
                }
                //else if(command.nom === 'double'){
                //    console.log(angular.element('#'))
                //    conf.isDouble = command.isDouble;
                //    if(conf.isDouble){
                //        angular.element('#playerRightContent').addClass('doublePlayer').removeClass('displayNone');
                //        angular.element('#playerLeftContent').addClass('doublePlayer').removeClass('singlePlayer');
                //    }else{
                //        angular.element('#playerRightContent').addClass('displayNone').removeClass('doublePlayer');
                //        angular.element('#playerLeftContent').addClass('singlePlayer').removeClass('doublePlayer');
                //    }
                //}
            },
            processAddSound: function(soundToAdd){
                if(typeof this.sounds === 'undefined'){
                    this.sounds = [];
                }
                console.log("processAdSound");
                this.sounds.push(soundToAdd);
            },
            processAddSounds: function(soundsToAdd){
                if(typeof this.sounds === 'undefined'){
                    this.sounds = [];
                }
                console.log("processAddSounds");
                this.sounds = this.sounds.concat(soundsToAdd);
            },
            processDeleteSound: function(soundToDelete){
                var _this = this;
                if(typeof this.sounds === 'undefined'){
                    this.sounds = [];
                }
                var keepGoing = true;
                this.sounds.forEach(function(sound, index){
                    if(keepGoing){
                        if(sound.sourceId === soundToDelete.sourceId){
                            _this.sounds.splice(index, 1);
                            keepGoing = false;
                        }
                    }
                });
                //conf.showMessage('Element supprimé', 'warning');
            },
            processDeleteAllSound: function(){
                this.sounds = [];
            },
            processNewPlaylist: function(newPlaylist){
                if(typeof newPlaylist === 'undefined'){
                    newPlaylist = [];
                }
                this.sounds = newPlaylist;
            },
            processChangeOrder: function(soundFirst){
                var indexOfSoundFirst = 0;
                var tmp = [];
                var tmpLast = [];
                this.sounds.forEach(function(sound, index){
                    if(sound.sourceId === soundFirst.url){
                        indexOfSoundFirst = index;
                    }
                });
                this.sounds.forEach(function(sound, index){
                    if(index >= indexOfSoundFirst){
                        tmp.push(sound);
                    }else{
                        tmpLast.push(sound);
                    }
                });
                this.sounds = tmp.concat(tmpLast);
            }
        };
        return _this._data;
    }
]);
