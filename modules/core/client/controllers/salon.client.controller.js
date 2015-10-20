/**
 * Created by lardtiste on 20/09/15.
 */
'use strict';

angular.module('core').controller('SalonController', ['$scope', 'Authentication', 'Socket', '$location','PlaylistService',
    function($scope, Authentication, Socket, $location, PlaylistService) {
        console.log("SalonController");
        // This provides Authentication context.
        $scope.authentication = Authentication;

        if($scope.authentication.user){
            PlaylistService.updateRoom();
        }
    }
]);
