'use strict';

// Configuring the Rooms module
angular.module('rooms').run(['Menus',
	function(Menus) {
		// Add the Rooms dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Rooms',
			state: 'rooms',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'rooms', {
			title: 'List Rooms',
			state: 'rooms.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'rooms', {
			title: 'Create Room',
			state: 'rooms.create'
		});
	}
]);