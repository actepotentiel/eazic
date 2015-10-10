'use strict';

//Spotifysearches service used to communicate Spotifysearches REST endpoints
angular.module('spotifysearches').factory('Spotifysearches', ['$resource',
	function($resource) {
		return $resource('api/spotifysearches/:spotifysearchId', { spotifysearchId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);