'use strict';

angular.module('users').controller('SignInController', ['$timeout', '$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator', 'PlaylistService', 'Socket','MyRooms',
    function ($timeout, $scope, $state, $http, $location, $window, Authentication, PasswordValidator, PlaylistService, Socket, MyRooms) {

        console.log('SignInController');

        $scope.authentication = Authentication;
        $scope.popoverMsg = PasswordValidator.getPopoverMsg();

        // Get an eventual error defined in the URL query string:
        $scope.error = $location.search().err;



        $scope.signin = function (isValid) {
            $scope.error = null;

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'userForm');
                return false;
            }

            $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
                // If successful we assign the response to the global user model
                location.reload();

                Socket.connect();
                $scope.authentication.user = response;
                console.log("USER AUTHENTICATE SIGNIN");
                PlaylistService.getMyPlaylists();
                MyRooms.get({userId : $scope.authentication.user._id}, function(result){
                    if(result.length === 1){
                        $scope.authentication.user.room = result[0];
                        $timeout(function(){
                            $location.path("/" + $scope.authentication.user.room.name);
                        }, 1000);
                    }else{
                        //TODO Alert user has no room
                        alert("Problème d'intégrité de données, veuillez contacter un administrateur.");
                    }
                });


                // And redirect to the previous or home page
                //$state.go($state.previous.state.name || 'home', $state.previous.params);
            }).error(function (response) {
                $scope.error = response.message;
            });
        };

        // OAuth provider request
        $scope.callOauthProvider = function (url) {
            if ($state.previous && $state.previous.href) {
                url += '?redirect_to=' + encodeURIComponent($state.previous.href);
            }

            // Effectively call OAuth authentication route:
            $window.location.href = url;
        };
    }
]);
