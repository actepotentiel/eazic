/**
 * Created by lardtiste on 20/09/15.
 */
'use strict';

angular.module('core').factory('RoomService', ['Authentication','$timeout','Socket', 'MyRooms','MyPlaylists','$location','$stateParams',
    function(Authentication, $timeout, Socket, MyRooms, MyPlaylists, $location, $stateParams) {
        var _this = this;
        var authentication = Authentication;
        _this._data = {
            room: window.room,
            goToMyRoom : function(){
                if(authentication.user && authentication.user.room) {
                    $location.path('/' + authentication.user.room.conf.name);
                }
            },
            getMyRoom: function(){
                if(authentication.user){
                    MyRooms.get({userId : authentication.user._id}, function(result){
                        if(result.length === 1){
                            authentication.user.room = result[0];
                        }else{
                            //TODO Alert user has no room
                            alert("Problème d'intégrité de données, veuillez contacter un administrateur.");
                        }
                        return;
                    });
                }
            },
            hasOwnerAutorizationForCommand : function(nomCommand){
                if(this.room.conf.owner._id + "" === authentication.user._id + ""){
                    return true;
                }else{
                    //TODO checker si l'utilisateur a les droits
                    for(var i = 0 ; i < this.room.policies.length ; i++){
                        for(var j = 0 ; j < this.room.policies[i].users.length ; j++){
                            if(this.room.policies[i].users[j] + "" === authentication.user._id + ""){
                                console.log("Finded user in policies");
                                if(this.room.policies[i].name + "" === "vip" && nomCommand !== "playerStatus"){
                                    return true;
                                }
                                for(var k = 0 ; k < this.room.policies[i].allowedCommands.length ; k++){
                                    if(this.room.policies[i].allowedCommands[k].commandName + "" === nomCommand + ""){
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                    return false;
                }
            },
            processInfo : function(command){
                var __this = this;
                console.log("process info");

                console.log(command);
                if(typeof __this.room.messages === 'undefined'){
                    __this.room.messages = [];
                }

                switch(command.name){
                    case "userLeave":
                        __this.processUserLeave(command);
                        break;
                    case "joinUser":
                        __this.processJoinUser(command);
                        break;
                    case "alert":
                        __this.processAlert(command);
                        break;
                    default:
                        break;
                }
            },
            processUserLeave : function(command){
                console.log("process userLeave");

                this.room.messages.unshift({
                    text: command.user.username + "has left the room...",
                    user: {username : "Server"},
                    created: new Date()
                });
                this.room.conf.users.forEach(function(user, index){
                    if(user._id + "" === command.user._id + ""){
                        this.room.conf.users.splice(index, 1);
                    }
                });
            },
            processJoinUser: function(command){
                console.log("process addUser");

                this.room.messages.unshift({
                    text: command.user.username + "has joined the room!",
                    user: {username : "Server"},
                    created: new Date()
                });
                this.room.conf.users.push(command.user);
            },
            processAlert : function(command){
                alert("Alert : " + command.status);
            },
            instanciateDisposableRoom : function(){
                var __this = this;
                __this.room = {
                    conf: {
                        owner : authentication.user,
                        isDisposable : true
                    },
                    player : {

                    },
                    playlist: {
                        sounds : []
                    }
                };
            }
        };
        return _this._data;
    }
]);
