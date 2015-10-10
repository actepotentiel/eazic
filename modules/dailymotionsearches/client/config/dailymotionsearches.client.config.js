'use strict';

// Configuring the Dailymotionsearches module
angular.module('dailymotionsearches').run(['Menus',
	function(Menus) {
		// Add the Dailymotionsearches dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Dailymotionsearches',
			state: 'dailymotionsearches',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'dailymotionsearches', {
			title: 'List Dailymotionsearches',
			state: 'dailymotionsearches.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'dailymotionsearches', {
			title: 'Create Dailymotionsearch',
			state: 'dailymotionsearches.create'
		});
	}
]);