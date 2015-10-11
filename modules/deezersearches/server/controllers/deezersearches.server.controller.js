'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Deezersearch = mongoose.model('Deezersearch'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
	deezer = require('node-deezer-api-client');

/*
 * Search on Deezer datas
 * */
exports.search = function(req, res) {
	deezer = require('node-deezer-api-client');
	deezer.requestData('/search?q=track:\''+req.body.q+'\'&limit=20', function(err, results) {
		var formattedResults = [];
		var formattedMetas = {};
		formattedMetas.totalResults = results.total;
		formattedMetas.nextPage = results.next;
		for (var video in results.data) {
			var item = {};
			item.title = results.data[video].title;
			item.sourceName = 'deezer';
			item.sourceId = results.data[video].id;
			item.image = results.data[video].artist.picture_medium || '/images/sound_default.png';
			item.kind = results.data[video].type;
			item.duration = results.data[video].duration;
			formattedResults.push(item);
		}
		var formattedResponse = {
			deezer: {
				infos : formattedMetas,
				items : formattedResults
			}
		};
		res.jsonp(formattedResponse || err);
	});
};

/**
 * Create a Deezersearch
 */
exports.create = function(req, res) {
	var deezersearch = new Deezersearch(req.body);
	deezersearch.user = req.user;

	deezersearch.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(deezersearch);
		}
	});
};

/**
 * Show the current Deezersearch
 */
exports.read = function(req, res) {
	res.jsonp(req.deezersearch);
};

/**
 * Update a Deezersearch
 */
exports.update = function(req, res) {
	var deezersearch = req.deezersearch ;

	deezersearch = _.extend(deezersearch , req.body);

	deezersearch.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(deezersearch);
		}
	});
};

/**
 * Delete an Deezersearch
 */
exports.delete = function(req, res) {
	var deezersearch = req.deezersearch ;

	deezersearch.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(deezersearch);
		}
	});
};

/**
 * List of Deezersearches
 */
exports.list = function(req, res) { Deezersearch.find().sort('-created').populate('user', 'displayName').exec(function(err, deezersearches) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(deezersearches);
		}
	});
};

/**
 * Deezersearch middleware
 */
exports.deezersearchByID = function(req, res, next, id) { Deezersearch.findById(id).populate('user', 'displayName').exec(function(err, deezersearch) {
		if (err) return next(err);
		if (! deezersearch) return next(new Error('Failed to load Deezersearch ' + id));
		req.deezersearch = deezersearch ;
		next();
	});
};
