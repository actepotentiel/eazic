/**
 * Created by lardtiste on 20/09/15.
 */
'use strict';

angular.module('core').controller('SalonController', ['$scope', 'Authentication', 'Socket', 'ChatService','RoomService',
    function($scope, Authentication, Socket, ChatService, RoomService) {
        console.log("SalonController");
        // This provides Authentication context.
        $scope.authentication = Authentication;
        $scope.chatService = ChatService;

        if (!Socket.socket) {
            Socket.connect();
        }

        //if($scope.authentication.user){
        //    RoomService.updateRoom();
        //}

        // Add an event listener to the 'chatMessage' event
        Socket.on('chat.message', function (message) {
            if(typeof $scope.chatService.messages === 'undefined'){
                $scope.chatService.messages = [];
            }
            $scope.chatService.messages.unshift(message);
            console.log(message);
        });

        Socket.on('chat.user.join', function(data){
            console.log("chat.user.join");
            console.log(data);
            if($scope.authentication.room){
                $scope.authentication.room.conf.users.push(data.user);
            }
        });

        Socket.on('chat.user.quit', function(data){
            console.log("chat.user.quit");
            console.log(data);
            if($scope.authentication.room){
                var i = $scope.authentication.room.conf.users.length;
                while(i--){
                    if($scope.authentication.room.conf.users[i]._id + "" === data.user._id + ""){
                        $scope.authentication.room.conf.users.splice(i, 1);
                        var message = {
                            type: 'status',
                            text: data.user.username + 'Has deconnected from room',
                            room: $scope.authentication.room.conf.name,
                            created: Date.now(),
                            profileImageURL: data.user.profileImageURL,
                            username: "Serveur"
                        };
                        $scope.chatService.messages.unshift(message);
                    }
                }
            }
        });

        $scope.sendMessage = function () {
            // Create a new message object
            var message = {
                text: this.messageText
            };

            // Emit a 'chatMessage' message event
            Socket.emit('chat.message', message);

            // Clear the message text
            this.messageText = '';
        };

        $scope.$on('$destroy', function () {
            Socket.removeListener('chat.message');
            Socket.removeListener('chat.user.quit');
            Socket.removeListener('chat.user.join');
        });
    }
]);
