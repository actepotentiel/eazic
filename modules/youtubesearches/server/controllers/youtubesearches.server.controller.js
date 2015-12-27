'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Youtubesearch = mongoose.model('Youtubesearch'),
	youtubeApi = require('youtube-api'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
	moment = require('moment');

youtubeApi.authenticate({
	type: "key",
	key: 'AIzaSyBVsIBrr7VmuhNN-NvRVWw-gZA4vjj1YeA'
});

exports.getVideoDurations = function (req, res) {
	res.jsonp(req.body.formattedResponse);
};

/*
* Perform a research on youtube datas
* */
exports.search = function(req, res) {
	console.log(req.body);
	var self = this;

	youtubeApi.search.list({
		q: req.body.q,
		part: "snippet",
		maxResults: 20
	}, function(error, results) {
		if (error) res.jsonp(error);
		else {
			var formattedResults = [];
			var formattedMetas = results.pageInfo;
			formattedMetas.nextPage = results.nextPageToken;
			formattedMetas.query = req.body;
			var ids = "";
			for (var video = 0; video<results.items.length; video++) {
				var item = {};
				item.title = results.items[video].snippet.title;
				item.sourceName = 'youtube';
				item.sourceId = results.items[video].id.videoId || results.items[video].id.playlistId || results.items[video].id.channelId;
				item.image = results.items[video].snippet.thumbnails.medium.url;
				item.kind = results.items[video].id.kind.slice(8);
				if (video===results.items.length-1) {
					ids += item.sourceId;
				} else {
					ids += item.sourceId+",";
				}
				formattedResults.push(item);
			}
			youtubeApi.videos.list({
				id:ids,
				part: 'id,contentDetails',
				fields: 'items(contentDetails(duration),id)'
			}, function (err, resp) {
				if (err) {
					res.jsonp(err);
				} else {
					var idDuration = resp.items;
					formattedResults = formattedResults.map(function (video) {
						var elem = _(idDuration).find(function(idDurationItem) {
							return idDurationItem.id === video.sourceId;
						});
						if (elem && elem.hasOwnProperty('contentDetail')) {
							video.duration = moment.duration(elem.contentDetails.duration, moment.ISO_8601).asSeconds();
						}
						return video;
					});
					var formattedResponse = {
						youtube: {
							infos: formattedMetas,
							items: formattedResults
						}
					};
					res.jsonp(formattedResponse);
				}
			});
		}
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
