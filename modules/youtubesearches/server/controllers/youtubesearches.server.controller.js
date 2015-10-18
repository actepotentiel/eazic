'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Youtubesearch = mongoose.model('Youtubesearch'),
	youtubeApi = require('youtube-api'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

youtubeApi.authenticate({
	type: "key",
	key: 'AIzaSyBVsIBrr7VmuhNN-NvRVWw-gZA4vjj1YeA'
});


/*
* Perform a research on youtube datas
* */
exports.search = function(req, res) {
	console.log(req.body);

	youtubeApi.search.list({
		q: req.body.q,
		part: "snippet"
	}, function(error, results) {
		var formattedResults = [];
		var formattedMetas = results.pageInfo;
		formattedMetas.nextPage = results.nextPageToken;
		formattedMetas.query = req.body;
		for (var video in results.items) {
			var item = {};
			item.title = results.items[video].snippet.title;
			item.sourceName = 'youtube';
			item.sourceId = results.items[video].id.videoId || results.items[video].id.playlistId || results.items[video].id.channelId;
			item.image = results.items[video].snippet.thumbnails.medium.url;
			item.kind = results.items[video].id.kind.slice(8);
			formattedResults.push(item);
		}
		var formattedResponse = {
			youtube: {
				infos : formattedMetas,
				items : formattedResults
			}
		};
		res.jsonp(formattedResponse || error);
	});
};

/**
 * Create a Youtubesearch
 */
exports.create = function(req, res) {
	var youtubesearch = new Youtubesearch(req.body);
	youtubesearch.user = req.user;

	youtubesearch.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(youtubesearch);
		}
	});
};

/**
 * Show the current Youtubesearch
 */
exports.read = function(req, res) {
	res.jsonp(req.youtubesearch);
};

/**
 * Update a Youtubesearch
 */
exports.update = function(req, res) {
	var youtubesearch = req.youtubesearch ;

	youtubesearch = _.extend(youtubesearch , req.body);

	youtubesearch.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(youtubesearch);
		}
	});
};

/**
 * Delete an Youtubesearch
 */
exports.delete = function(req, res) {
	var youtubesearch = req.youtubesearch ;

	youtubesearch.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(youtubesearch);
		}
	});
};

/**
 * List of Youtubesearches
 */
exports.list = function(req, res) { Youtubesearch.find().sort('-created').populate('user', 'displayName').exec(function(err, youtubesearches) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(youtubesearches);
		}
	});
};

/**
 * Youtubesearch middleware
 */
exports.youtubesearchByID = function(req, res, next, id) { Youtubesearch.findById(id).populate('user', 'displayName').exec(function(err, youtubesearch) {
		if (err) return next(err);
		if (! youtubesearch) return next(new Error('Failed to load Youtubesearch ' + id));
		req.youtubesearch = youtubesearch ;
		next();
	});
};
