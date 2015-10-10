'use strict';

// Configuring the Youtubesearches module
angular.module('youtubesearches').run(['Menus',
	function(Menus) {
		// Add the Youtubesearches dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Youtubesearches',
			state: 'youtubesearches',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'youtubesearches', {
			title: 'List Youtubesearches',
			state: 'youtubesearches.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'youtubesearches', {
			title: 'Create Youtubesearch',
			state: 'youtubesearches.create'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'youtubesearches', {
			title: 'Search Youtubesearch',
			state: 'youtubesearches.create'
		});
	}
]);