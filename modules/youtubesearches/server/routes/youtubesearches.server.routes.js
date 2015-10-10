'use strict';

module.exports = function(app) {
	var youtubesearches = require('../controllers/youtubesearches.server.controller');
	var youtubesearchesPolicy = require('../policies/youtubesearches.server.policy');

	// Youtubesearches Routes
	app.route('/api/youtubesearches').all()
		.get(youtubesearches.list).all(youtubesearchesPolicy.isAllowed)
		.post(youtubesearches.create);

	app.route('/api/youtubesearches/:youtubesearchId').all(youtubesearchesPolicy.isAllowed)
		.get(youtubesearches.read)
		.put(youtubesearches.update)
		.delete(youtubesearches.delete);

	app.route('/api/search/youtube').all(youtubesearchesPolicy.isAllowed)
		.post(youtubesearches.search);

	// Finish by binding the Youtubesearch middleware
	app.param('youtubesearchId', youtubesearches.youtubesearchByID);
};