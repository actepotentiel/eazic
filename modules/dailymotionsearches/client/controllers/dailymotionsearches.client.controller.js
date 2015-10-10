'use strict';

// Dailymotionsearches controller
angular.module('dailymotionsearches').controller('DailymotionsearchesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Dailymotionsearches',
	function($scope, $stateParams, $location, Authentication, Dailymotionsearches ) {
		$scope.authentication = Authentication;

		// Create new Dailymotionsearch
		$scope.create = function() {
			// Create new Dailymotionsearch object
			var dailymotionsearch = new Dailymotionsearches ({
				name: this.name
			});

			// Redirect after save
			dailymotionsearch.$save(function(response) {
				$location.path('dailymotionsearches/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Dailymotionsearch
		$scope.remove = function( dailymotionsearch ) {
			if ( dailymotionsearch ) { dailymotionsearch.$remove();

				for (var i in $scope.dailymotionsearches ) {
					if ($scope.dailymotionsearches [i] === dailymotionsearch ) {
						$scope.dailymotionsearches.splice(i, 1);
					}
				}
			} else {
				$scope.dailymotionsearch.$remove(function() {
					$location.path('dailymotionsearches');
				});
			}
		};

		// Update existing Dailymotionsearch
		$scope.update = function() {
			var dailymotionsearch = $scope.dailymotionsearch ;

			dailymotionsearch.$update(function() {
				$location.path('dailymotionsearches/' + dailymotionsearch._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Dailymotionsearches
		$scope.find = function() {
			$scope.dailymotionsearches = Dailymotionsearches.query();
		};

		// Find existing Dailymotionsearch
		$scope.findOne = function() {
			$scope.dailymotionsearch = Dailymotionsearches.get({ 
				dailymotionsearchId: $stateParams.dailymotionsearchId
			});
		};
	}
]);