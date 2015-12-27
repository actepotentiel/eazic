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
                        //this.processCommand(command);
                    }
                    if(this.haveToProcess(command)){
                        this.processCommand(command);
                    }
                    if(!(this.haveToProcess(command) || this.haveToEmit(command))){
                        //TODO alert desynchro situation impossible
                        alert("Vous n'avez pas le droit de lancer cette commande, passez en standalone");
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
                if(command.name === "play" && typeof command.sound !== "undefined"){
                    varToSwitch = command.sound;
                }else{
                    if(command.player === "left"){
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
                console.log("Checking if user have to process...");
                var value = false;
                switch(RoomService.room.role){
                    case "owner":
                        console.log("user is owner, return true...");
                        value = true;
                        break;
                    case "ghost":
                        console.log("user is ghost, return false...");
                        value = false;
                        break;
                    case "synchro":
                        if(RoomService.hasOwnerAutorizationForCommand(command)){
                            console.log("user is synch and have auth, return true...");
                            value = true;
                        }else{
                            console.log("user is sync and NOT have auth, return false...");
                            value = false;
                        }
                        break;
                    case "standalone":
                        console.log("user is standalone, reuturn true...");
                        value = true;
                        break;
                    default:
                        value = false;
                        break;
                }
                return value;
            },
            haveToEmit: function(command){
                console.log("checking if user have to emit...");
                if(!Authentication.user){
                    console.log("user is not auth...");
                    return false;
                }
                if(RoomService.room.role === "owner"){
                    console.log("user is owner, return true...");
                    return true;
                }
                if(RoomService.room.role === "standalone"){
                    console.log("user is standalone, aborting...");
                    return false;
                }
                if(RoomService.hasOwnerAutorizationForCommand(command.name)){
                    return true;
                }
                return false;
            }
        };
        return _this._data;
    }
]);
