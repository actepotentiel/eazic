'use strict';

// Soundcloudsearches controller
angular.module('soundcloudsearches').controller('SoundcloudsearchesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Soundcloudsearches',
	function($scope, $stateParams, $location, Authentication, Soundcloudsearches ) {
		$scope.authentication = Authentication;

		// Create new Soundcloudsearch
		$scope.create = function() {
			// Create new Soundcloudsearch object
			var soundcloudsearch = new Soundcloudsearches ({
				name: this.name
			});

			// Redirect after save
			soundcloudsearch.$save(function(response) {
				$location.path('soundcloudsearches/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Soundcloudsearch
		$scope.remove = function( soundcloudsearch ) {
			if ( soundcloudsearch ) { soundcloudsearch.$remove();

				for (var i in $scope.soundcloudsearches ) {
					if ($scope.soundcloudsearches [i] === soundcloudsearch ) {
						$scope.soundcloudsearches.splice(i, 1);
					}
				}
			} else {
				$scope.soundcloudsearch.$remove(function() {
					$location.path('soundcloudsearches');
				});
			}
		};

		// Update existing Soundcloudsearch
		$scope.update = function() {
			var soundcloudsearch = $scope.soundcloudsearch ;

			soundcloudsearch.$update(function() {
				$location.path('soundcloudsearches/' + soundcloudsearch._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Soundcloudsearches
		$scope.find = function() {
			$scope.soundcloudsearches = Soundcloudsearches.query();
		};

		// Find existing Soundcloudsearch
		$scope.findOne = function() {
			$scope.soundcloudsearch = Soundcloudsearches.get({ 
				soundcloudsearchId: $stateParams.soundcloudsearchId
			});
		};
	}
]);