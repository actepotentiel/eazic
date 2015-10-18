'use strict';

module.exports = function(app) {
	var rooms = require('../controllers/rooms.server.controller');
	var roomsPolicy = require('../policies/rooms.server.policy');

	// Rooms Routes
	app.route('/api/rooms').all()
		.get(rooms.list).all(roomsPolicy.isAllowed)
		.post(rooms.create);

	app.route('/api/rooms/:roomId').all(roomsPolicy.isAllowed)
		.get(rooms.read)
		.put(rooms.update)
		.delete(rooms.delete);

	// Finish by binding the Room middleware
	app.param('roomId', rooms.roomByID);

	app.route('/api/rooms/user/:roomUserId').all(roomsPolicy.isAllowed, roomsPolicy.hasRoomOwnerAuthorization)
		.get(rooms.read);


	// Finish by binding the Room middleware
	app.param('roomUserId', rooms.roomByUserID);
};
