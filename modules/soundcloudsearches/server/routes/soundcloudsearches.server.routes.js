'use strict';

module.exports = function(app) {
	var soundcloudsearches = require('../controllers/soundcloudsearches.server.controller');
	var soundcloudsearchesPolicy = require('../policies/soundcloudsearches.server.policy');

	// Soundcloudsearches Routes
	app.route('/api/soundcloudsearches').all()
		.get(soundcloudsearches.list).all(soundcloudsearchesPolicy.isAllowed)
		.post(soundcloudsearches.create);

	app.route('/api/soundcloudsearches/:soundcloudsearchId').all(soundcloudsearchesPolicy.isAllowed)
		.get(soundcloudsearches.read)
		.put(soundcloudsearches.update)
		.delete(soundcloudsearches.delete);

	app.route('/api/search/soundcloud').all(soundcloudsearchesPolicy.isAllowed)
		.post(soundcloudsearches.search);

	// Finish by binding the Soundcloudsearch middleware
	app.param('soundcloudsearchId', soundcloudsearches.soundcloudsearchByID);
};