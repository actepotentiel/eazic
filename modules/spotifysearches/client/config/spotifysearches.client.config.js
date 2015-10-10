'use strict';

// Configuring the Spotifysearches module
angular.module('spotifysearches').run(['Menus',
	function(Menus) {
		// Add the Spotifysearches dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Spotifysearches',
			state: 'spotifysearches',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'spotifysearches', {
			title: 'List Spotifysearches',
			state: 'spotifysearches.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'spotifysearches', {
			title: 'Create Spotifysearch',
			state: 'spotifysearches.create'
		});
	}
]);