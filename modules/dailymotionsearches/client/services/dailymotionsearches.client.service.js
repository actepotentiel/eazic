'use strict';

//Dailymotionsearches service used to communicate Dailymotionsearches REST endpoints
angular.module('dailymotionsearches').factory('Dailymotionsearches', ['$resource',
	function($resource) {
		return $resource('api/dailymotionsearches/:dailymotionsearchId', { dailymotionsearchId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);