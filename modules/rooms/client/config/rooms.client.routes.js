'use strict';

//Setting up route
angular.module('rooms').config(['$stateProvider',
	function($stateProvider) {
		// Rooms state routing
		$stateProvider.
		state('rooms', {
			abstract: true,
			url: '/rooms',
			template: '<ui-view/>'
		}).
		state('rooms.list', {
			url: '',
			templateUrl: 'modules/rooms/views/list-rooms.client.view.html'
		}).
		state('rooms.create', {
			url: '/create',
			templateUrl: 'modules/rooms/views/create-room.client.view.html'
		}).
		state('rooms.view', {
			url: '/:roomId',
			templateUrl: 'modules/rooms/views/view-room.client.view.html'
		}).
		state('rooms.edit', {
			url: '/:roomId/edit',
			templateUrl: 'modules/rooms/views/edit-room.client.view.html'
		});
	}
]);