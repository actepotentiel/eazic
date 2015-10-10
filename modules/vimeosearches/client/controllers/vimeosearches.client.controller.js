'use strict';

// Vimeosearches controller
angular.module('vimeosearches').controller('VimeosearchesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Vimeosearches',
	function($scope, $stateParams, $location, Authentication, Vimeosearches ) {
		$scope.authentication = Authentication;

		// Create new Vimeosearch
		$scope.create = function() {
			// Create new Vimeosearch object
			var vimeosearch = new Vimeosearches ({
				name: this.name
			});

			// Redirect after save
			vimeosearch.$save(function(response) {
				$location.path('vimeosearches/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Vimeosearch
		$scope.remove = function( vimeosearch ) {
			if ( vimeosearch ) { vimeosearch.$remove();

				for (var i in $scope.vimeosearches ) {
					if ($scope.vimeosearches [i] === vimeosearch ) {
						$scope.vimeosearches.splice(i, 1);
					}
				}
			} else {
				$scope.vimeosearch.$remove(function() {
					$location.path('vimeosearches');
				});
			}
		};

		// Update existing Vimeosearch
		$scope.update = function() {
			var vimeosearch = $scope.vimeosearch ;

			vimeosearch.$update(function() {
				$location.path('vimeosearches/' + vimeosearch._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Vimeosearches
		$scope.find = function() {
			$scope.vimeosearches = Vimeosearches.query();
		};

		// Find existing Vimeosearch
		$scope.findOne = function() {
			$scope.vimeosearch = Vimeosearches.get({ 
				vimeosearchId: $stateParams.vimeosearchId
			});
		};
	}
]);