'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication','$translate','Socket',
  function ($scope, Authentication, $translate, Socket) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    $scope.changeLanguage = function (langKey) {
      console.log("changeLanguage");
      $translate.use(langKey);
    };

    Socket.on('conf.join.ack', function(data){
        console.log("conf.join.ack");
        console.log(data);
        if(data.isOk){
          $scope.authentication.room = data.room;
        }else{
          alert("Probleme lors de la connection à la room...");
        }
    });

  }
]);
