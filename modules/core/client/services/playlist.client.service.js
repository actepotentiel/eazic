/**
 * Created by lardtiste on 20/09/15.
 */
'use strict';

angular.module('core').factory('PlaylistService', ['Authentication','$timeout','Socket', 'RoomService','MyPlaylists','$location','$stateParams',
    function(Authentication, $timeout, Socket, RoomService, MyPlaylists, $location, $stateParams) {
        var _this = this;
        var authentication = Authentication;
        _this._data = {
            getMyPlaylists : function(){
                if(authentication.user){
                    MyPlaylists.get({userId : authentication.user._id}, function(result){
                        authentication.user.playlists = result;
                    });
                }
            },
            sendCommand: function(command){
                console.log("sendCommand");
                console.log(command);
                if(authentication.user){
                    if(RoomService.hasOwnerAutorizationForCommand(command.name)){
                        Socket.emit('playlist', command);
                        this.processCommand(command);
                    }else{
                        var alert = {
                            name : "alert",
                            status : "notAuth"
                        };
                        RoomService.processInfo(alert);
                    }
                }else{
                    this.processCommand(command);
                }
            },
            processCommand: function(command){
                console.log("processCommand");
                if(typeof RoomService.room.playlist.sounds === 'undefined'){
                    RoomService.room.playlist.sounds = [];
                }
                switch(command.name){
                    case "addSounds":
                        this.processAddSounds(command);
                        break;
                    case "deleteSound":
                        this.processDeleteSound(command);
                        break;
                    case "reorder":
                        this.processReorder(command);
                        break;
                    case "newPlaylist":
                        this.processNewPlaylist(command);
                        break;
                    default:
                        alert("command has no handler : " + command.name);
                        break;
                }
            },
            processAddSounds: function(command){
                console.log("processAddSounds");
                RoomService.room.playlist.sounds = RoomService.room.playlist.sounds.concat(command.sounds);
            },
            processDeleteSound: function(command){
                console.log("processDeleteSound");
                var keepGoing = true;
                RoomService.room.playlist.sounds.forEach(function(sound, index){
                    if(keepGoing){
                        if(sound.sourceId === command.sound.sourceId){
                            RoomService.room.playlist.sounds.splice(index, 1);
                            keepGoing = false;
                        }
                    }
                });
            },
            processNewPlaylist: function(command){
                RoomService.room.playlist.sounds = command.playlist;
            },
            processReorder: function(command){
                //TODO process reorder
                console.log("Process reorder (todo)");
                //var indexOfSoundFirst = 0;
                //var tmp = [];
                //var tmpLast = [];
                //this.sounds.forEach(function(sound, index){
                //    if(sound.sourceId === soundFirst.url){
                //        indexOfSoundFirst = index;
                //    }
                //});
                //this.sounds.forEach(function(sound, index){
                //    if(index >= indexOfSoundFirst){
                //        tmp.push(sound);
                //    }else{
                //        tmpLast.push(sound);
                //    }
                //});
                //this.sounds = tmp.concat(tmpLast);
            }
        };
        return _this._data;
    }
]);
