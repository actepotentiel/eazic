'use strict';

// Youtubesearches controller
angular.module('youtubesearches').controller('YoutubePlayerController', ['$scope', '$stateParams', '$location', 'Authentication','YoutubePlayerService',
	function($scope, $stateParams, $location, Authentication, YoutubePlayerService) {
		$scope.authentication = Authentication;
        $scope.youtubePlayerService = YoutubePlayerService;
        $scope.playerVars = {
            controls: 0,
            autoplay: 1
        };


	}
]);
