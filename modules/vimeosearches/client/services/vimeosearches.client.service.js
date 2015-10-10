'use strict';

//Vimeosearches service used to communicate Vimeosearches REST endpoints
angular.module('vimeosearches').factory('Vimeosearches', ['$resource',
	function($resource) {
		return $resource('api/vimeosearches/:vimeosearchId', { vimeosearchId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);