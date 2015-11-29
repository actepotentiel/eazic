/**
 * Created by lardtiste on 29/11/2015.
 */
'use strict';

angular.module('core').factory('PlayerHandlerService', [
    function() {
        var _this = this;
        _this._data = {
            services: window.services,
            processCommand: function(command){
                console.log("servcie Handler : ");
                console.log(this.services);
                var varToSwitch;
                if(command.name == "play" && typeof command.sound != "undefined"){
                    varToSwitch = command.sound;
                }else{
                    if(command.player == "left"){
                        varToSwitch = RoomService.room.player.left.currentSound;
                    }else{
                        varToSwitch = RoomService.room.player.right.currentSound;
                    }
                }
                var existSourceHandler = false;
                this.services.forEach(function(service){
                    if(service.sourceName == varToSwitch.sourceName){
                        console.log("Find player handler for : " + varToSwitch.sourceName);
                        existSourceHandler = true;
                        service.processCommand(command);
                    }
                });
                if(!existSourceHandler) {
                    alert("Cette source n'est pas encore implémenté : "+command.sound.sourceName);
                }
            }
        };
        return _this._data;
    }
]);
