'use strict';

// Configuring the Soundcloudsearches module
angular.module('soundcloudsearches').run(['Menus',
	function(Menus) {
		// Add the Soundcloudsearches dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Soundcloudsearches',
			state: 'soundcloudsearches',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'soundcloudsearches', {
			title: 'List Soundcloudsearches',
			state: 'soundcloudsearches.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'soundcloudsearches', {
			title: 'Create Soundcloudsearch',
			state: 'soundcloudsearches.create'
		});
	}
]);