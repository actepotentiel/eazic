'use strict';

module.exports = function(app) {
	var deezersearches = require('../controllers/deezersearches.server.controller');
	var deezersearchesPolicy = require('../policies/deezersearches.server.policy');

	// Deezersearches Routes
	app.route('/api/deezersearches').all()
		.get(deezersearches.list).all(deezersearchesPolicy.isAllowed)
		.post(deezersearches.create);

	app.route('/api/deezersearches/:deezersearchId').all(deezersearchesPolicy.isAllowed)
		.get(deezersearches.read)
		.put(deezersearches.update)
		.delete(deezersearches.delete);

	app.route('/api/search/deezer').all(deezersearchesPolicy.isAllowed)
		.get(deezersearches.list)
		.put(deezersearches.update)
		.delete(deezersearches.delete)
		.post(deezersearches.search);

	// Finish by binding the Deezersearch middleware
	app.param('deezersearchId', deezersearches.deezersearchByID);
};