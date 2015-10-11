'use strict';

//Soundcloudsearches service used to communicate Soundcloudsearches REST endpoints
angular.module('soundcloudsearches').factory('Soundcloudsearches', ['$resource',
	function($resource) {
		return $resource('api/soundcloudsearches/:soundcloudsearchId', { soundcloudsearchId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

angular.module('soundcloudsearches').factory('SoundcloudSearch', ['$resource',
	function($resource) {
		return $resource('api/search/soundcloud', {}, {
			search : {
				method : 'POST'
			}
		});
	}
]);
