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
        $scope.roomService = RoomService;
        if (!Socket.socket) {
            Socket.connect();
        }

        // Add an event listener to the 'chatMessage' event
        Socket.on('chat', function (message) {
            if(typeof $scope.chatService.messages === 'undefined'){
                $scope.chatService.messages = [];
            }
            $scope.chatService.writeMessage(message);
            console.log(message);
        });


        $scope.sendMessage = function () {
            // Create a new message object
            var message = {
                text: this.messageText,
                user: $scope.authentication.user,
                created: new Date()
            };

            $scope.chatService.writeMessage(message);
            // Emit a 'chatMessage' message event
            Socket.emit('chat', message);

            // Clear the message text
            this.messageText = '';
        };

        $scope.$on('$destroy', function () {
            Socket.removeListener('chat');
        });
    }
]);
