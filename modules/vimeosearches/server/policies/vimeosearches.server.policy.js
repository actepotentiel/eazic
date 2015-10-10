'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Vimeosearches Permissions
 */
exports.invokeRolesPolicies = function() {
	acl.allow([{
		roles: ['admin'],
		allows: [{
			resources: '/api/vimeosearches',
			permissions: '*'
		}, {
			resources: '/api/vimeosearches/:vimeosearchId',
			permissions: '*'
		}, {
			resources: '/api/search/vimeo',
			permissions: '*'
		}]
	}, {
		roles: ['user'],
		allows: [{
			resources: '/api/vimeosearches',
			permissions: ['get', 'post']
		}, {
			resources: '/api/vimeosearches/:vimeosearchId',
			permissions: ['get']
		}, {
			resources: '/api/search/vimeo',
			permissions: ['post']
		}]
	}, {
		roles: ['guest'],
		allows: [{
			resources: '/api/vimeosearches',
			permissions: ['get']
		}, {
			resources: '/api/vimeosearches/:vimeosearchId',
			permissions: ['get']
		}, {
			resources: '/api/search/vimeo',
			permissions: ['post']
		}]
	}]);
};

/**
 * Check If Articles Policy Allows
 */
exports.isAllowed = function(req, res, next) {
	var roles = (req.user) ? req.user.roles : ['guest'];

	// If an vimeosearch is being processed and the current user created it then allow any manipulation
	if (req.vimeosearch && req.user && req.vimeosearch.user.id === req.user.id) {
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
