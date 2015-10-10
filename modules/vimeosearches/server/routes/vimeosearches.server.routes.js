'use strict';

module.exports = function(app) {
	var vimeosearches = require('../controllers/vimeosearches.server.controller');
	var vimeosearchesPolicy = require('../policies/vimeosearches.server.policy');

	// Vimeosearches Routes
	app.route('/api/vimeosearches').all()
		.get(vimeosearches.list).all(vimeosearchesPolicy.isAllowed)
		.post(vimeosearches.create);

	app.route('/api/vimeosearches/:vimeosearchId').all(vimeosearchesPolicy.isAllowed)
		.get(vimeosearches.read)
		.put(vimeosearches.update)
		.delete(vimeosearches.delete);

	app.route('/api/search/vimeo').all(vimeosearchesPolicy.isAllowed)
		.post(vimeosearches.search);

	// Finish by binding the Vimeosearch middleware
	app.param('vimeosearchId', vimeosearches.vimeosearchByID);
};