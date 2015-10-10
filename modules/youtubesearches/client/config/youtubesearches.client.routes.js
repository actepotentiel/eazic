'use strict';

//Setting up route
angular.module('youtubesearches').config(['$stateProvider',
	function($stateProvider) {
		// Youtubesearches state routing
		$stateProvider.
		state('youtubesearches', {
			abstract: true,
			url: '/youtubesearches',
			template: '<ui-view/>'
		}).
		state('youtubesearches.list', {
			url: '',
			templateUrl: 'modules/youtubesearches/client/views/list-youtubesearches.client.view.html'
		}).
		state('youtubesearches.create', {
			url: '/create',
			templateUrl: 'modules/youtubesearches/client/views/create-youtubesearch.client.view.html'
		}).
		state('youtubesearches.view', {
			url: '/:youtubesearchId',
			templateUrl: 'modules/youtubesearches/client/views/view-youtubesearch.client.view.html'
		}).
		state('youtubesearches.edit', {
			url: '/:youtubesearchId/edit',
			templateUrl: 'modules/youtubesearches/client/views/edit-youtubesearch.client.view.html'
		}).
		state('youtubesearches.search', {
			url: '/search',
			templateUrl: 'modules/youtubesearches/client/views/search-youtubesearch.client.view.html'
		});
	}
]);