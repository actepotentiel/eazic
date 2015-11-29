'use strict';

// Configuring the Dailymotionsearches module
angular.module('dailymotionsearches').run(['DailymotionPlayerService',
	function(DailymotionPlayerService) {
		DailymotionPlayerService.registerService();
	}
]);
