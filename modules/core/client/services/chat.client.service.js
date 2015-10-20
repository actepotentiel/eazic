/**
 * Created by lardtiste on 20/10/15.
 */
/**
 * Created by lardtiste on 20/09/15.
 */
'use strict';

angular.module('core').factory('ChatService', ['Authentication','$timeout','Socket', 'MyRooms','MyPlaylists','$location','$stateParams',
    function(Authentication, $timeout, Socket, MyRooms, MyPlaylists, $location, $stateParams) {
        var _this = this;
        var authentication = Authentication;
        _this._data = {
            messages: window.messages,


            sendMessage: function(messageText){
                console.log("sendCommand");
                var message = {
                    text : messageText
                };
                if(authentication.room){
                    Socket.emit('chat.message', message);
                }
            }
        };
        return _this._data;
    }
]);
