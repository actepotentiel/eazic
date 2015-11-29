/**
 * Created by lardtiste on 29/11/2015.
 */
'use strict';

angular.module('core').factory('YoutubePlayerService', ['PlayerHandlerService','RoomService',
    function(PlayerHandlerService, RoomService) {
        var _this = this;
        _this._data = {
            sourceName : "youtube",
            registerService: function(){
                if(typeof PlayerHandlerService.services === "undefined"){
                    PlayerHandlerService.services = [];
                }
                PlayerHandlerService.services.push(this);
            },
            processCommand: function(command){
                switch(command.name){
                    case "play":
                        console.log("processPlayOnYoutube");
                        if(typeof RoomService.room.player.left === "undefined"){
                            RoomService.room.player.left = {};
                        }
                        RoomService.room.player.left.currentSound = command.sound;
                        break;
                    case "pause":
                        console.log("processPauseOnYoutube");
                        break;
                    case "setVolume":
                        console.log("processPauseOnYoutube");
                        break;
                    case "stop":
                        console.log("processPauseOnYoutube");
                        break;
                    default:
                        alert("command has no handler : " + command.name);
                        break;
                }
            }
        };
        return _this._data;
    }
]);
