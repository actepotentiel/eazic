'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Soundcloudsearch = mongoose.model('Soundcloudsearch'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
	SC = require('node-soundcloud');


SC.init({
	id: '297a1ba0221212502262213f257f0e7f'
});

/*
* Search on Soundcloud datas
* */
exports.search = function(req, res) {
	SC.get('/tracks', { q: req.body.q, limit: 20 }, function(err, results) {
		var formattedResults = [];
		var formattedMetas = {};
		formattedMetas.perPage = results.length;
		//formattedMetas.nextPage = results.nextPageToken;
		for (var video in results) {
			var item = {};
			item.title = results[video].title;
			item.type = 'soundcloud';
			item.url = results[video].stream_url;
			item.image = results[video].artwork_url || '/images/sound_default.png';
			item.kind = results[video].kind;
			item.duration = results[video].duration;
			item.waveform = results[video].waveform_url;
			formattedResults.push(item);
		}
		var formattedResponse = {
			soundcloud: {
				infos : formattedMetas,
				items : formattedResults
			}
		};
		res.jsonp(formattedResponse || err);
	});
};

/**
 * Create a Soundcloudsearch
 */
exports.create = function(req, res) {
	var soundcloudsearch = new Soundcloudsearch(req.body);
	soundcloudsearch.user = req.user;

	soundcloudsearch.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(soundcloudsearch);
		}
	});
};

/**
 * Show the current Soundcloudsearch
 */
exports.read = function(req, res) {
	res.jsonp(req.soundcloudsearch);
};

/**
 * Update a Soundcloudsearch
 */
exports.update = function(req, res) {
	var soundcloudsearch = req.soundcloudsearch ;

	soundcloudsearch = _.extend(soundcloudsearch , req.body);

	soundcloudsearch.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(soundcloudsearch);
		}
	});
};

/**
 * Delete an Soundcloudsearch
 */
exports.delete = function(req, res) {
	var soundcloudsearch = req.soundcloudsearch ;

	soundcloudsearch.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(soundcloudsearch);
		}
	});
};

/**
 * List of Soundcloudsearches
 */
exports.list = function(req, res) { Soundcloudsearch.find().sort('-created').populate('user', 'displayName').exec(function(err, soundcloudsearches) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(soundcloudsearches);
		}
	});
};

/**
 * Soundcloudsearch middleware
 */
exports.soundcloudsearchByID = function(req, res, next, id) { Soundcloudsearch.findById(id).populate('user', 'displayName').exec(function(err, soundcloudsearch) {
		if (err) return next(err);
		if (! soundcloudsearch) return next(new Error('Failed to load Soundcloudsearch ' + id));
		req.soundcloudsearch = soundcloudsearch ;
		next();
	});
};