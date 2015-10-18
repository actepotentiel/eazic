/**
 * Created by lardtiste on 20/09/15.
 */
'use strict';

angular.module('core').controller('PlayerController', ['$scope', 'Authentication',
    function($scope, Authentication) {
        // This provides Authentication context.
        $scope.authentication = Authentication;


    }
]);
