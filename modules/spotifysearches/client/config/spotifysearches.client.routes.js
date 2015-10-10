'use strict';

//Setting up route
angular.module('spotifysearches').config(['$stateProvider',
	function($stateProvider) {
		// Spotifysearches state routing
		$stateProvider.
		state('spotifysearches', {
			abstract: true,
			url: '/spotifysearches',
			template: '<ui-view/>'
		}).
		state('spotifysearches.list', {
			url: '',
			templateUrl: 'modules/spotifysearches/views/list-spotifysearches.client.view.html'
		}).
		state('spotifysearches.create', {
			url: '/create',
			templateUrl: 'modules/spotifysearches/views/create-spotifysearch.client.view.html'
		}).
		state('spotifysearches.view', {
			url: '/:spotifysearchId',
			templateUrl: 'modules/spotifysearches/views/view-spotifysearch.client.view.html'
		}).
		state('spotifysearches.edit', {
			url: '/:spotifysearchId/edit',
			templateUrl: 'modules/spotifysearches/views/edit-spotifysearch.client.view.html'
		});
	}
]);