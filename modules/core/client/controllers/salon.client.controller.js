/**
 * Created by lardtiste on 20/09/15.
 */
'use strict';

angular.module('core').controller('SalonController', ['$scope', 'Authentication', 'Socket', 'ChatService','PlaylistService',
    function($scope, Authentication, Socket, ChatService, PlaylistService) {
        console.log("SalonController");
        // This provides Authentication context.
        $scope.authentication = Authentication;
        $scope.chatService = ChatService;

        if($scope.authentication.user){
            PlaylistService.updateRoom();
        }

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
    }
]);
