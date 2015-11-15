'use strict';

module.exports = function(app) {
	var playlists = require('../controllers/playlists.server.controller');
	var playlistsPolicy = require('../policies/playlists.server.policy');

	// Playlists Routes
	app.route('/api/playlists').all()
		.get(playlists.list).all(playlistsPolicy.isAllowed)
		.post(playlists.create);

	app.route('/api/playlists/:playlistId').all(playlistsPolicy.isAllowed)
		.get(playlists.read)
		.put(playlists.update)
		.delete(playlists.delete);

	app.param('playlistId', playlists.playlistByID);


	app.route('/api/playlists/user/:playlistUserId').all(playlistsPolicy.isAllowed, playlistsPolicy.hasPlaylistOwnerAuthorization)
		.get(playlists.readMyPlaylists);


	// Finish by binding the Playlist middleware
	app.param('playlistUserId', playlists.playlistByUserID);
};
