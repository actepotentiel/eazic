'use strict';

module.exports = function(app) {
	var spotifysearches = require('../controllers/spotifysearches.server.controller');
	var spotifysearchesPolicy = require('../policies/spotifysearches.server.policy');

	// Spotifysearches Routes
	app.route('/api/spotifysearches').all()
		.get(spotifysearches.list).all(spotifysearchesPolicy.isAllowed)
		.post(spotifysearches.create);

	app.route('/api/spotifysearches/:spotifysearchId').all(spotifysearchesPolicy.isAllowed)
		.get(spotifysearches.read)
		.put(spotifysearches.update)
		.delete(spotifysearches.delete);

	app.route('/api/search/spotify').all(spotifysearchesPolicy.isAllowed)
		.get(spotifysearches.list)
		.put(spotifysearches.update)
		.delete(spotifysearches.delete)
		.post(spotifysearches.search);

	// Finish by binding the Spotifysearch middleware
	app.param('spotifysearchId', spotifysearches.spotifysearchByID);
};