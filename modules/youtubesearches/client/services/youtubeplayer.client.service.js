/**
 * Created by lardtiste on 29/11/2015.
 */
'use strict';



angular.module('core').factory('YoutubePlayerService', ['PlayerHandlerService','RoomService','$rootScope','$timeout',
    function(PlayerHandlerService, RoomService, $rootScope, $timeout) {
        var _this = this;
        var scope = $rootScope;
        _this._data = {
            sourceName : "youtube",
            playerLeft : window.playerLeft,
            playerRight : window.playerRight,
            registerService: function(){
                if(typeof PlayerHandlerService.services === "undefined"){
                    PlayerHandlerService.services = [];
                }
                PlayerHandlerService.services.push(this);
            },
            processCommand: function(command){
                var self = this;
                var player;
                var playerAPI;
                if(command.player === "left"){
                    player = RoomService.room.player.left;
                    playerAPI = self.playerLeft;
                }else{
                    player = RoomService.room.player.right;
                    playerAPI = self.playerRight;
                }
                switch(command.name){
                    case "play":
                        console.log("processPlayOnYoutube");
                        if(command.sound){
                            if(typeof player === "undefined"){
                                player = {};
                            }
                            player.currentSound = command.sound;
                        }else{
                            playerAPI.playVideo();
                        }
                        RoomService.sendInfo({
                            name: 'playerStatus',
                            playerStatus: {
                                player: command.player,
                                currentSound : player.currentSound,
                                status: "playing",
                                volume: player.volume
                            }
                        });
                        break;
                    case "pause":
                        console.log("processPauseOnYoutube");
                        playerAPI.pauseVideo();
                        RoomService.sendInfo({
                            name: 'playerStatus',
                            playerStatus: {
                                player: command.player,
                                currentSound : player.currentSound,
                                status: "paused",
                                volume: player.volume
                            }
                        });
                        break;
                    case "setVolume":
                        console.log("processSetVolumeOnYoutube");
                        playerAPI.setVolume(command.volume);
                        player.volume = command.volume;
                        RoomService.sendInfo({
                            name: 'playerStatus',
                            playerStatus: {
                                player: command.player,
                                currentSound : player.currentSound,
                                status: player.status,
                                volume: player.volume
                            }
                        });
                        break;
                    case "stop":
                        console.log("processStopOnYoutube");
                        playerAPI.stopVideo();
                        RoomService.sendInfo({
                            name: 'playerStatus',
                            playerStatus: {
                                player: command.player,
                                currentSound : player.currentSound,
                                status: "stopped",
                                volume: player.volume
                            }
                        });
                        break;
                    case "seekTo":
                        console.log("processSeekToOnYoutube");
                        playerAPI.seekTo(command.seekTo, true);
                        player.seekTo = command.seekTo;
                        RoomService.sendInfo({
                            name: 'playerStatus',
                            playerStatus: {
                                player: command.player,
                                currentSound : player.currentSound,
                                status: "stopped",
                                volume: player.volume,
                                seekTo: command.seekTo
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
