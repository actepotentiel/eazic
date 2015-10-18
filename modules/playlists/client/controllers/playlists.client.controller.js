'use strict';

// Playlists controller
angular.module('playlists').controller('PlaylistsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Playlists',
	function($scope, $stateParams, $location, Authentication, Playlists ) {
		$scope.authentication = Authentication;

		// Create new Playlist
		$scope.create = function() {
			// Create new Playlist object
			var playlist = new Playlists ({
				title: this.title,
				description : 'gniegniefgn',
				sounds : [
					{
						title : 'supersound',
						order : 0,
						sourceName : 'moncul',
						sourceId : '5168496416',
						duration : 321,
						image : '',
						rate : 1,
						available : true
					}
				]
			});

			// Redirect after save
			playlist.$save(function(response) {
				$location.path('playlists/' + response._id);

				// Clear form fields
				$scope.title = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Playlist
		$scope.remove = function( playlist ) {
			if ( playlist ) { playlist.$remove();

				for (var i in $scope.playlists ) {
					if ($scope.playlists [i] === playlist ) {
						$scope.playlists.splice(i, 1);
					}
				}
			} else {
				$scope.playlist.$remove(function() {
					$location.path('playlists');
				});
			}
		};

		// Update existing Playlist
		$scope.update = function() {
			var playlist = $scope.playlist ;

			playlist.$update(function() {
				$location.path('playlists/' + playlist._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Playlists
		$scope.find = function() {
			$scope.playlists = Playlists.query();
		};

		// Find existing Playlist
		$scope.findOne = function() {
			$scope.playlist = Playlists.get({ 
				playlistId: $stateParams.playlistId
			}, function(result){
			});
		};
	}
]);
