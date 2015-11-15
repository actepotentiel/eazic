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
                    });
                }
            },
            hasOwnerAutorizationForCommand : function(nomCommand){
                if(authentication.room.conf.owner._id + "" === authentication.user._id + ""){
                    return true;
                }else{
                    //TODO checker si l'utilisateur a les droits
                    for(var i = 0 ; i < authentication.room.policies.length ; i++){
                        for(var j = 0 ; j < authentication.room.policies[i].users.length ; j++){
                            if(authentication.room.policies[i].users[j] + "" === authentication.user._id + ""){
                                console.log("Finded user in policies");
                                if(authentication.room.policies[i].name + "" === "vip" && nomCommand !== "playerStatus"){
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
            processInfo : function(command){
                var __this = this;
                switch(command.name){
                    case "alert":
                        __this.processAlert(command);
                        break;
                    default:
                        break;
                }
            },
            processAlert : function(command){
                alert("Alert : " + command.status);
            },
            instanciateDisposableRoom : function(){
                var __this = this;
                __this.room = {
                    conf: {
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
