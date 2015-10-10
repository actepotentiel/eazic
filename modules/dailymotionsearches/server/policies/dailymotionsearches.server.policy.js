'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Dailymotionsearches Permissions
 */
exports.invokeRolesPolicies = function() {
	acl.allow([{
		roles: ['admin'],
		allows: [{
			resources: '/api/dailymotionsearches',
			permissions: '*'
		}, {
			resources: '/api/dailymotionsearches/:dailymotionsearchId',
			permissions: '*'
		}, {
			resources: '/api/search/dailymotion',
			permissions: '*'
		}]
	}, {
		roles: ['user'],
		allows: [{
			resources: '/api/dailymotionsearches',
			permissions: ['get', 'post']
		}, {
			resources: '/api/dailymotionsearches/:dailymotionsearchId',
			permissions: ['get']
		}, {
			resources: '/api/search/dailymotion',
			permissions: ['post']
		}]
	}, {
		roles: ['guest'],
		allows: [{
			resources: '/api/dailymotionsearches',
			permissions: ['get']
		}, {
			resources: '/api/dailymotionsearches/:dailymotionsearchId',
			permissions: ['get']
		}, {
			resources: '/api/search/dailymotion',
			permissions: ['post']
		}]
	}]);
};

/**
 * Check If Articles Policy Allows
 */
exports.isAllowed = function(req, res, next) {
	var roles = (req.user) ? req.user.roles : ['guest'];

	// If an dailymotionsearch is being processed and the current user created it then allow any manipulation
	if (req.dailymotionsearch && req.user && req.dailymotionsearch.user.id === req.user.id) {
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
					message: 'User is not authorized'
				});
			}
		}
	});
};
