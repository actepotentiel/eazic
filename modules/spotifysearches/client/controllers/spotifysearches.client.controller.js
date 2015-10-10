'use strict';

// Spotifysearches controller
angular.module('spotifysearches').controller('SpotifysearchesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Spotifysearches',
	function($scope, $stateParams, $location, Authentication, Spotifysearches ) {
		$scope.authentication = Authentication;

		// Create new Spotifysearch
		$scope.create = function() {
			// Create new Spotifysearch object
			var spotifysearch = new Spotifysearches ({
				name: this.name
			});

			// Redirect after save
			spotifysearch.$save(function(response) {
				$location.path('spotifysearches/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Spotifysearch
		$scope.remove = function( spotifysearch ) {
			if ( spotifysearch ) { spotifysearch.$remove();

				for (var i in $scope.spotifysearches ) {
					if ($scope.spotifysearches [i] === spotifysearch ) {
						$scope.spotifysearches.splice(i, 1);
					}
				}
			} else {
				$scope.spotifysearch.$remove(function() {
					$location.path('spotifysearches');
				});
			}
		};

		// Update existing Spotifysearch
		$scope.update = function() {
			var spotifysearch = $scope.spotifysearch ;

			spotifysearch.$update(function() {
				$location.path('spotifysearches/' + spotifysearch._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Spotifysearches
		$scope.find = function() {
			$scope.spotifysearches = Spotifysearches.query();
		};

		// Find existing Spotifysearch
		$scope.findOne = function() {
			$scope.spotifysearch = Spotifysearches.get({ 
				spotifysearchId: $stateParams.spotifysearchId
			});
		};
	}
]);