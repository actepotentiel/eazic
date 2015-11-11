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
                if(this.room) {
                    $location.path('/' + this.room.conf.name);
                }
            },
            updateRoom: function(){
                var __this = this;
                if(authentication.user){
                    MyRooms.get({userId : authentication.user._id}, function(result){
                        if(result.length === 1){
                            __this.room = result[0];
                            if(!$stateParams.params){
                                $location.path('/' + __this.room.conf.name);
                            }
                        }else{
                            //TODO afficher l'erreur
                            alert("Problème d'intégrité de données, veuillez contacter un administrateur.");
                        }
                    });
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
            }
        };
        return _this._data;
    }
]);
