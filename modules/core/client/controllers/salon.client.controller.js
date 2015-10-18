/**
 * Created by lardtiste on 20/09/15.
 */
'use strict';

angular.module('core').controller('SalonController', ['$scope', 'Authentication', 'Socket', '$location','MyRooms',
    function($scope, Authentication, Socket, $location, MyRooms) {
        console.log("SalonController");
        // This provides Authentication context.
        $scope.authentication = Authentication;

        if($scope.authentication.user){
            MyRooms.get({userId : $scope.authentication.user._id}, function(result){
                console.log("UPDATE ROOM SALON CONTROLLER");
                console.log(result);
                //__this.playlists = result;
            });
        }


    }
]);
