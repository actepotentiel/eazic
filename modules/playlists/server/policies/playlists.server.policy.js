'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl'),
	mongoose = require('mongoose'),
	Playlist = mongoose.model('Playlist');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Playlists Permissions
 */
exports.invokeRolesPolicies = function() {
	acl.allow([{
		roles: ['admin'],
		allows: [{
			resources: '/api/playlists',
			permissions: '*'
		}, {
			resources: '/api/playlists/:playlistId',
			permissions: '*'
		},  {
			resources: '/api/playlists/user/:playlistUserId',
			permissions: '*'
		}]
	}, {
		roles: ['user'],
		allows: [{
			resources: '/api/playlists',
			permissions: ['get', 'post']
		}, {
			resources: '/api/playlists/:playlistId',
			permissions: ['get']
		},  {
			resources: '/api/playlists/user/:playlistUserId',
			permissions: '*'
		}]
	}, {
		roles: ['guest'],
		allows: [{
			resources: '/api/playlists',
			permissions: ['get']
		}, {
			resources: '/api/playlists/:playlistId',
			permissions: ['get']
		}]
	}]);
};

/**
 * Check If Articles Policy Allows
 */
exports.isAllowed = function(req, res, next) {
	var roles = (req.user) ? req.user.roles : ['guest'];

	// If an playlist is being processed and the current user created it then allow any manipulation
	if (req.playlist && req.user && req.playlist.owner.id === req.user.id) {
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
					message: 'User is not authorized !!'
				});
			}
		}
	});
};


/**
 * Sound authorization middleware
 */
exports.hasPlaylistOwnerAuthorization = function(req, res, next) {
	if(req.playlists.length >= 1){
		if (req.askedPlaylistUserId === req.user._id + ""){
			return next();
		}else{
			var playlistsAllowed = [];
			for (var i in req.playlists) {
				for (var j in req.playlists[i].users) {
					if (req.playlists[i].users[j] === req.user._id + ""){
						playlistsAllowed.push(req.playlist[i]);
					}
				}
			}
			if(playlistsAllowed.length > 0){
				req.playlists = playlistsAllowed;
				return next();
			}else{
				return res.status(403).send({message: 'User is not authorized'});
			}
		}
	}
};
