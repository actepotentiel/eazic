'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication','$translate','$location',
  function ($scope, Authentication, $translate, $location) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    $scope.changeLanguage = function (langKey) {
      console.log("changeLanguage");
      $translate.use(langKey);
    };
  }
]);
