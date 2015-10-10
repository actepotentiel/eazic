'use strict';

// Configuring the Vimeosearches module
angular.module('vimeosearches').run(['Menus',
	function(Menus) {
		// Add the Vimeosearches dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Vimeosearches',
			state: 'vimeosearches',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'vimeosearches', {
			title: 'List Vimeosearches',
			state: 'vimeosearches.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'vimeosearches', {
			title: 'Create Vimeosearch',
			state: 'vimeosearches.create'
		});
	}
]);