/**
 * Created by lardtiste on 29/11/2015.
 */
'use strict';

angular.module('core').factory('PlayerService', ['Authentication','$timeout','Socket', 'RoomService','PlayerHandlerService','$location','$stateParams',
    function(Authentication, $timeout, Socket, RoomService, PlayerHandlerService, $location, $stateParams) {
        var _this = this;
        var authentication = Authentication;
        _this._data = {
            sendCommand: function(command){
                console.log("sendCommand");
                console.log(command);
                if(authentication.user){
                    if(this.haveToEmit(command)){
                        Socket.emit('player', command);
                        this.processCommand(command);
                    }
                    if(this.haveToProcess(command)){
                        this.processCommand(command);
                    }
                    if(!(this.haveToProcess(command) || this.haveToEmit(command))){
                        //TODO alert desynchro situation impossible
                    }
                }else{
                    this.processCommand(command);
                }
            },
            processCommand: function(command){
                console.log("processPlayerCommand");
                if(typeof RoomService.room.player === 'undefined'){
                    RoomService.room.player = {};
                }
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
                PlayerHandlerService.processCommand(command);
                //switch(varToSwitch.sourceName){
                //    case "youtube":
                //        console.log("processOnYoutube");
                //        break;
                //    case "dailymotion":
                //        console.log("processOnDailymotion");
                //        break;
                //    default:
                //        alert("command has no handler : " + command.name);
                //        break;
                //}
            },
            haveToProcess: function(command){
                switch(RoomService.room.role){
                    case "owner":
                        return true;
                        break;
                    case "ghost":
                        return false;
                        break;
                    case "synchro":
                        if(RoomService.hasOwnerAutorizationForCommand(command)){
                            return true;
                        }else{
                            return false;
                        }
                        break;
                    case "standalone":
                        return true;
                        break;
                    default:
                        return false;
                        break;
                }
            },
            haveToEmit: function(){
                if(Authentication.user){
                    return false;
                }
                if(RoomService.room.role == "owner"){
                    return true;
                }
                if(RoomService.room.role == "standalone"){
                    return false;
                }
                if(RoomService.hasOwnerAutorizationForCommand(command)){
                    return true;
                }
                return false;
            }
        };
        return _this._data;
    }
]);
