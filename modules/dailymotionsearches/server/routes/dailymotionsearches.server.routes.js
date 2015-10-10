'use strict';

module.exports = function(app) {
	var dailymotionsearches = require('../controllers/dailymotionsearches.server.controller');
	var dailymotionsearchesPolicy = require('../policies/dailymotionsearches.server.policy');

	// Dailymotionsearches Routes
	app.route('/api/dailymotionsearches').all()
		.get(dailymotionsearches.list).all(dailymotionsearchesPolicy.isAllowed)
		.post(dailymotionsearches.create);

	app.route('/api/dailymotionsearches/:dailymotionsearchId').all(dailymotionsearchesPolicy.isAllowed)
		.get(dailymotionsearches.read)
		.put(dailymotionsearches.update)
		.delete(dailymotionsearches.delete);

	app.route('/api/search/dailymotion').all(dailymotionsearchesPolicy.isAllowed)
		.post(dailymotionsearches.search);

	// Finish by binding the Dailymotionsearch middleware
	app.param('dailymotionsearchId', dailymotionsearches.dailymotionsearchByID);
};