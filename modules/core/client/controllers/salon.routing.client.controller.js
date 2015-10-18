'use strict';

angular.module('core').controller('SalonsRoutingController', ['$scope', '$stateParams', '$location', 'Authentication','PlaylistService', 'Socket',
    function($scope, $stateParams, $location, Authentication, PlaylistService, Socket) {
        // Controller Logic
        // ...

        $scope.authentication = Authentication;
        $scope.playlistService = PlaylistService;
        //$scope.lecteurLeftService = LecteurLeftService;

        //console.log("salonRoutingController");
        //console.log($location.path());



        //this.initData = function(){
        //    var _this = this;
        //
        //    var nomSalon = $location.path().split('/')[2];
        //    if(!nomSalon || (nomSalon === "") || nomSalon === $scope.conf.room.title){
        //
        //    }
        //    else{
        //        Salons.query(function(data){
        //            $scope.salons = data;
        //            var exist = false;
        //            $scope.salons.forEach(function(salon){
        //                if(!exist){
        //                    if(salon.title === nomSalon){
        //                        console.log("join salon");
        //                        $scope.salonToJoin = salon;
        //                        exist = true;
        //                    }
        //                }
        //
        //            });
        //            if(!exist){
        //                //TODO : lancer la modale de création de salon
        //            }else{
        //                //TODO : rejoindre le salon en question
        //                _this.join($scope.salonToJoin);
        //                $timeout(function() {
        //                    angular.element('#salonViewMenuButton > a').trigger('click');
        //                }, 100);
        //            }
        //
        //        });
        //    }
        //
        //}
        //this.initData();

        //this.join = function(salon) {
        //    if($scope.authentication.user === ''){
        //        $scope.authentication.user = {
        //            displayName: 'Anonymous',
        //            firstName: 'Anonymous',
        //            lastName: 'Anonymous',
        //            username: 'Anonymous'
        //        };
        //
        //    }
        //    Socket.emit('room.join', {room: salon, user: $scope.authentication.user}, function(result){
        //        if(result.isOk){
        //            $scope.conf.room = result.room;
        //            $scope.playlistService.sounds = result.room.playlist;
        //            delete $scope.conf.room.playlist;
        //            $scope.conf.isInPublicRoom = true;
        //
        //            $scope.authentication.user.isSpeaker = false;
        //            $scope.lecteurLeftService.status = result.room.playerLeft.status;
        //            $scope.lecteurLeftService.currentSound = result.room.playerLeft.currentSound;
        //            $scope.lecteurLeftService.isLaunched = result.room.playerLeft.isLaunched;
        //            var shortUrl = 'salons/' + $scope.conf.room.title;
        //            $timeout(function(){
        //                $location.path(shortUrl);
        //                $timeout(function(){
        //                    console.log(document.location.href);
        //                    console.log($window.location.href);
        //                    $scope.conf.adresse = $window.location.href;
        //                }, 100);
        //            }, 100);
        //        }else{
        //            alert(result.message);
        //        }
        //    });
        //};



    }
]);


