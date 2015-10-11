'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Spotifysearch = mongoose.model('Spotifysearch'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
	spotify = require('spotify');

/*
 * Search on Spotify datas
 * */
exports.search = function(req, res) {
	spotify = require('spotify');
	spotify.search({ type: 'track', query: req.body.q, limit: '2' }, function(err, results) {
		var formattedResults = [];
		var formattedMetas = {};
		formattedMetas.totalResults = results.tracks.total;
		formattedMetas.perPage = results.tracks.limit;
		formattedMetas.nextPage = results.tracks.next;
		for (var video in results.tracks.items) {
			var item = {};
			item.title = results.tracks.items[video].name;
			item.sourceName = 'deezer';
			item.sourceId = results.tracks.items[video].href;
			item.image = results.tracks.items[video].album.images[1].url || '/images/sound_default.png';
			item.kind = results.tracks.items[video].type;
			item.duration = results.tracks.items[video].duration_ms;
			//item.uri = results.tracks.items[video].uri;
			formattedResults.push(item);
		}
		var formattedResponse = {
			spotify: {
				infos : formattedMetas,
				items : formattedResults
			}
		};
		res.jsonp(formattedResponse || err);
	});
};
/**
 * Create a Spotifysearch
 */
exports.create = function(req, res) {
	var spotifysearch = new Spotifysearch(req.body);
	spotifysearch.user = req.user;

	spotifysearch.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(spotifysearch);
		}
	});
};

/**
 * Show the current Spotifysearch
 */
exports.read = function(req, res) {
	res.jsonp(req.spotifysearch);
};

/**
 * Update a Spotifysearch
 */
exports.update = function(req, res) {
	var spotifysearch = req.spotifysearch ;

	spotifysearch = _.extend(spotifysearch , req.body);

	spotifysearch.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(spotifysearch);
		}
	});
};

/**
 * Delete an Spotifysearch
 */
exports.delete = function(req, res) {
	var spotifysearch = req.spotifysearch ;

	spotifysearch.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(spotifysearch);
		}
	});
};

/**
 * List of Spotifysearches
 */
exports.list = function(req, res) { Spotifysearch.find().sort('-created').populate('user', 'displayName').exec(function(err, spotifysearches) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(spotifysearches);
		}
	});
};

/**
 * Spotifysearch middleware
 */
exports.spotifysearchByID = function(req, res, next, id) { Spotifysearch.findById(id).populate('user', 'displayName').exec(function(err, spotifysearch) {
		if (err) return next(err);
		if (! spotifysearch) return next(new Error('Failed to load Spotifysearch ' + id));
		req.spotifysearch = spotifysearch ;
		next();
	});
};
