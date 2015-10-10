'use strict';

//Setting up route
angular.module('vimeosearches').config(['$stateProvider',
	function($stateProvider) {
		// Vimeosearches state routing
		$stateProvider.
		state('vimeosearches', {
			abstract: true,
			url: '/vimeosearches',
			template: '<ui-view/>'
		}).
		state('vimeosearches.list', {
			url: '',
			templateUrl: 'modules/vimeosearches/views/list-vimeosearches.client.view.html'
		}).
		state('vimeosearches.create', {
			url: '/create',
			templateUrl: 'modules/vimeosearches/views/create-vimeosearch.client.view.html'
		}).
		state('vimeosearches.view', {
			url: '/:vimeosearchId',
			templateUrl: 'modules/vimeosearches/views/view-vimeosearch.client.view.html'
		}).
		state('vimeosearches.edit', {
			url: '/:vimeosearchId/edit',
			templateUrl: 'modules/vimeosearches/views/edit-vimeosearch.client.view.html'
		});
	}
]);