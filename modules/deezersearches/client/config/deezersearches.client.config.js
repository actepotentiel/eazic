'use strict';

// Configuring the Deezersearches module
angular.module('deezersearches').run(['Menus',
	function(Menus) {
		// Add the Deezersearches dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Deezersearches',
			state: 'deezersearches',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'deezersearches', {
			title: 'List Deezersearches',
			state: 'deezersearches.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'deezersearches', {
			title: 'Create Deezersearch',
			state: 'deezersearches.create'
		});
	}
]);