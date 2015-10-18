'use strict';

//Deezersearches service used to communicate Deezersearches REST endpoints
angular.module('deezersearches').factory('Deezersearches', ['$resource',
	function($resource) {
		return $resource('api/deezersearches/:deezersearchId', { deezersearchId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

angular.module('deezersearches').factory('DeezerSearch', ['$resource',
	function($resource) {
		return $resource('api/search/deezer', {}, {
			search : {
				method : 'POST'
			}
		});
	}
]);
