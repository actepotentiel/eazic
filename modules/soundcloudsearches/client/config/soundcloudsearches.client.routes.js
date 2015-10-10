'use strict';

//Setting up route
angular.module('soundcloudsearches').config(['$stateProvider',
	function($stateProvider) {
		// Soundcloudsearches state routing
		$stateProvider.
		state('soundcloudsearches', {
			abstract: true,
			url: '/soundcloudsearches',
			template: '<ui-view/>'
		}).
		state('soundcloudsearches.list', {
			url: '',
			templateUrl: 'modules/soundcloudsearches/views/list-soundcloudsearches.client.view.html'
		}).
		state('soundcloudsearches.create', {
			url: '/create',
			templateUrl: 'modules/soundcloudsearches/views/create-soundcloudsearch.client.view.html'
		}).
		state('soundcloudsearches.view', {
			url: '/:soundcloudsearchId',
			templateUrl: 'modules/soundcloudsearches/views/view-soundcloudsearch.client.view.html'
		}).
		state('soundcloudsearches.edit', {
			url: '/:soundcloudsearchId/edit',
			templateUrl: 'modules/soundcloudsearches/views/edit-soundcloudsearch.client.view.html'
		});
	}
]);