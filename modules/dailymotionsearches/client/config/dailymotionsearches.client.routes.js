'use strict';

//Setting up route
angular.module('dailymotionsearches').config(['$stateProvider',
	function($stateProvider) {
		// Dailymotionsearches state routing
		$stateProvider.
		state('dailymotionsearches', {
			abstract: true,
			url: '/dailymotionsearches',
			template: '<ui-view/>'
		}).
		state('dailymotionsearches.list', {
			url: '',
			templateUrl: 'modules/dailymotionsearches/views/list-dailymotionsearches.client.view.html'
		}).
		state('dailymotionsearches.create', {
			url: '/create',
			templateUrl: 'modules/dailymotionsearches/views/create-dailymotionsearch.client.view.html'
		}).
		state('dailymotionsearches.view', {
			url: '/:dailymotionsearchId',
			templateUrl: 'modules/dailymotionsearches/views/view-dailymotionsearch.client.view.html'
		}).
		state('dailymotionsearches.edit', {
			url: '/:dailymotionsearchId/edit',
			templateUrl: 'modules/dailymotionsearches/views/edit-dailymotionsearch.client.view.html'
		});
	}
]);