'use strict';

// Configuring the Youtubesearches module
angular.module('youtubesearches').run(['YoutubePlayerService',
	function(YoutubePlayerService) {

		YoutubePlayerService.registerService();

	}
]);
