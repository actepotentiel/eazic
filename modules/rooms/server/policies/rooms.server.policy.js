'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl'),
	mongoose = require('mongoose'),
	Room = mongoose.model('Room');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Rooms Permissions
 */
exports.invokeRolesPolicies = function() {
	acl.allow([{
		roles: ['admin'],
		allows: [{
			resources: '/api/rooms',
			permissions: '*'
		}, {
			resources: '/api/rooms/:roomId',
			permissions: '*'
		},
			{
				resources: '/api/rooms/user/:roomUserId',
				permissions: '*'
			}]
	}, {
		roles: ['user'],
		allows: [{
			resources: '/api/rooms',
			permissions: ['get', 'post']
		}, {
			resources: '/api/rooms/:roomId',
			permissions: ['get']
		},
			{
				resources: '/api/rooms/user/:roomUserId',
				permissions: '*'
			}]
	}, {
		roles: ['guest'],
		allows: [{
			resources: '/api/rooms',
			permissions: []
		}, {
			resources: '/api/rooms/:roomId',
			permissions: []
		}]
	}]);
};

/**
 * Check If Articles Policy Allows
 */
exports.isAllowed = function(req, res, next) {
	var roles = (req.user) ? req.user.roles : ['guest'];

	// If an room is being processed and the current user created it then allow any manipulation
	if (req.room && req.user && req.room.user && req.room.user.id === req.user.id) {
		return next();
	}

	// Check for user roles
	acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function(err, isAllowed) {
		if (err) {
			// An authorization error occurred.
			return res.status(500).send('Unexpected authorization error');
		} else {
			if (isAllowed) {
				// Access granted! Invoke next middleware
				return next();
			} else {
				return res.status(403).json({
					message: 'User is not authorized !!!!'
				});
			}
		}
	});
};

/**
 * Room authorization middleware
 */
exports.hasRoomOwnerAuthorization = function(req, res, next) {
	if(req.room.length >= 1) {

		if (req.room[0].user.equals(req.user._id)){
			return next();
		}
		return res.status(403).send({message: 'User is not authorized !!'});
	}
	return res.status(404).send({message: 'Not found, please delete your profile and create another'});

};
