'use strict';

// Deezersearches controller
angular.module('deezersearches').controller('DeezersearchesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Deezersearches',
	function($scope, $stateParams, $location, Authentication, Deezersearches ) {
		$scope.authentication = Authentication;

		// Create new Deezersearch
		$scope.create = function() {
			// Create new Deezersearch object
			var deezersearch = new Deezersearches ({
				name: this.name
			});

			// Redirect after save
			deezersearch.$save(function(response) {
				$location.path('deezersearches/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Deezersearch
		$scope.remove = function( deezersearch ) {
			if ( deezersearch ) { deezersearch.$remove();

				for (var i in $scope.deezersearches ) {
					if ($scope.deezersearches [i] === deezersearch ) {
						$scope.deezersearches.splice(i, 1);
					}
				}
			} else {
				$scope.deezersearch.$remove(function() {
					$location.path('deezersearches');
				});
			}
		};

		// Update existing Deezersearch
		$scope.update = function() {
			var deezersearch = $scope.deezersearch ;

			deezersearch.$update(function() {
				$location.path('deezersearches/' + deezersearch._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Deezersearches
		$scope.find = function() {
			$scope.deezersearches = Deezersearches.query();
		};

		// Find existing Deezersearch
		$scope.findOne = function() {
			$scope.deezersearch = Deezersearches.get({ 
				deezersearchId: $stateParams.deezersearchId
			});
		};
	}
]);