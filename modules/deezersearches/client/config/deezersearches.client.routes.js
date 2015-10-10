'use strict';

//Setting up route
angular.module('deezersearches').config(['$stateProvider',
	function($stateProvider) {
		// Deezersearches state routing
		$stateProvider.
		state('deezersearches', {
			abstract: true,
			url: '/deezersearches',
			template: '<ui-view/>'
		}).
		state('deezersearches.list', {
			url: '',
			templateUrl: 'modules/deezersearches/views/list-deezersearches.client.view.html'
		}).
		state('deezersearches.create', {
			url: '/create',
			templateUrl: 'modules/deezersearches/views/create-deezersearch.client.view.html'
		}).
		state('deezersearches.view', {
			url: '/:deezersearchId',
			templateUrl: 'modules/deezersearches/views/view-deezersearch.client.view.html'
		}).
		state('deezersearches.edit', {
			url: '/:deezersearchId/edit',
			templateUrl: 'modules/deezersearches/views/edit-deezersearch.client.view.html'
		});
	}
]);