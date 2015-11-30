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
                var player;
                if(command.player === "left"){
                    player = RoomService.room.player.left;
                }else{
                    player = RoomService.room.player.right;
                }
                switch(command.name){
                    case "play":
                        console.log("processPlayOnYoutube");
                        if(command.sound){
                            if(typeof player === "undefined"){
                                player = {};
                            }
                            player.currentSound = command.sound;
                        }
                        //TODO play current sound
                        RoomService.sendInfo({
                            name: 'playerStatus',
                            playerStatus: {
                                player: command.player,
                                currentSound : command.sound,
                                status: "playing",
                                volume: player.volume
                            }
                        });
                        break;
                    case "pause":
                        console.log("processPauseOnYoutube");
                        RoomService.sendInfo({
                            name: 'playerStatus',
                            playerStatus: {
                                player: command.player,
                                currentSound : command.sound,
                                status: "paused",
                                volume: player.volume
                            }
                        });
                        break;
                    case "setVolume":
                        console.log("processSetVolumeOnYoutube");
                        RoomService.sendInfo({
                            name: 'playerStatus',
                            playerStatus: {
                                player: command.player,
                                currentSound : command.sound,
                                status: player.status,
                                volume: player.volume
                            }
                        });
                        break;
                    case "stop":
                        console.log("processStopOnYoutube");
                        RoomService.sendInfo({
                            name: 'playerStatus',
                            playerStatus: {
                                player: command.player,
                                currentSound : command.sound,
                                status: "stopped",
                                volume: player.volume
                            }
                        });
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
