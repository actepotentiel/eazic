/**
 * Created by lardtiste on 20/10/15.
 */
/**
 * Created by lardtiste on 20/09/15.
 */
'use strict';

angular.module('core').factory('ChatService', ['Authentication','$timeout','Socket', 'RoomService','MyPlaylists','$location','$stateParams',
    function(Authentication, $timeout, Socket, RoomService, MyPlaylists, $location, $stateParams) {
        var _this = this;
        var authentication = Authentication;
        _this._data = {
            sendMessage: function(message){
                console.log("sendMessage");
                if(authentication.user && typeof RoomService.room !== 'undefined'){
                    Socket.emit('chat', message);
                }
                this.writeMessage(message);
            },
            writeMessage : function(message){
                if(typeof RoomService.room.messages === 'undefined'){
                    RoomService.room.messages = [];
                }
                RoomService.room.messages.unshift(message);
            }
        };
        return _this._data;
    }
]);
