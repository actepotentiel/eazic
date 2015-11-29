//'use strict';
//
//// Youtubesearches controller
//angular.module('youtubesearches').controller('YoutubesearchesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Youtubesearches',
//	function($scope, $stateParams, $location, Authentication, Youtubesearches ) {
//		$scope.authentication = Authentication;
//
//		// Create new Youtubesearch
//		$scope.create = function() {
//			// Create new Youtubesearch object
//			var youtubesearch = new Youtubesearches ({
//				name: this.name
//			});
//
//			// Redirect after save
//			youtubesearch.$save(function(response) {
//				$location.path('youtubesearches/' + response._id);
//
//				// Clear form fields
//				$scope.name = '';
//			}, function(errorResponse) {
//				$scope.error = errorResponse.data.message;
//			});
//		};
//
//		// Remove existing Youtubesearch
//		$scope.remove = function( youtubesearch ) {
//			if ( youtubesearch ) { youtubesearch.$remove();
//
//				for (var i in $scope.youtubesearches ) {
//					if ($scope.youtubesearches [i] === youtubesearch ) {
//						$scope.youtubesearches.splice(i, 1);
//					}
//				}
//			} else {
//				$scope.youtubesearch.$remove(function() {
//					$location.path('youtubesearches');
//				});
//			}
//		};
//
//		// Update existing Youtubesearch
//		$scope.update = function() {
//			var youtubesearch = $scope.youtubesearch ;
//
//			youtubesearch.$update(function() {
//				$location.path('youtubesearches/' + youtubesearch._id);
//			}, function(errorResponse) {
//				$scope.error = errorResponse.data.message;
//			});
//		};
//
//		// Find a list of Youtubesearches
//		$scope.find = function() {
//			$scope.youtubesearches = Youtubesearches.query();
//		};
//
//		// Find existing Youtubesearch
//		$scope.findOne = function() {
//			$scope.youtubesearch = Youtubesearches.get({
//				youtubesearchId: $stateParams.youtubesearchId
//			});
//		};
//	}
//]);
