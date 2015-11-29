/**
 * Created by lardtiste on 20/09/15.
 */
'use strict';

angular.module('core').controller('PlayerController', ['$scope', 'Authentication', 'Socket', 'PlaylistService','RoomService',
    function($scope, Authentication, Socket, PlaylistService, RoomService) {
        // This provides Authentication context.
        $scope.authentication = Authentication;
        $scope.playlistService = PlaylistService;
        $scope.roomService = RoomService;

    }
]);
