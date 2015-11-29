'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Dailymotionsearch = mongoose.model('Dailymotionsearch'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
	request = require('request');

/*
* Search on Dailymotion datas
* */
exports.search = function(req,res) {
	var clientId = '9131c9633e005c22345e'; // Fill yours
	var clientSecret = '2f7e0ebbf01e3dc96609918e26a8a90426540de7'; // Fill yours
	request('https://api.dailymotion.com/videos?fields=description,duration,id,thumbnail_240_url,title,embed_html&search='+req.body.q+'&limit=20', function (error, response, body) {
		var results = JSON.parse(body);
		var formattedResults = [];
		var formattedMetas = {};
		formattedMetas.totalResults = results.total;
		formattedMetas.nextPage = results.page+1;
		formattedMetas.perPage = results.limit;
		for (var video in results.list) {
			var item = {};
			item.title = results.list[video].title;
			item.sourceName = 'dailymotion';
			item.sourceId = results.list[video].id;
			item.image = results.list[video].thumbnail_240_url || '/images/sound_default.png';
			//item.embed = results.list[video].embed_html;
			formattedResults.push(item);
		}
		var formattedResponse = {
			dailymotion: {
				infos : formattedMetas,
				items : formattedResults
			}
		};
		res.jsonp(formattedResponse || error);
	});

};

/**
 * Create a Dailymotionsearch
 */
exports.create = function(req, res) {
	var dailymotionsearch = new Dailymotionsearch(req.body);
	dailymotionsearch.user = req.user;

	dailymotionsearch.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dailymotionsearch);
		}
	});
};

/**
 * Show the current Dailymotionsearch
 */
exports.read = function(req, res) {
	res.jsonp(req.dailymotionsearch);
};

/**
 * Update a Dailymotionsearch
 */
exports.update = function(req, res) {
	var dailymotionsearch = req.dailymotionsearch ;

	dailymotionsearch = _.extend(dailymotionsearch , req.body);

	dailymotionsearch.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dailymotionsearch);
		}
	});
};

/**
 * Delete an Dailymotionsearch
 */
exports.delete = function(req, res) {
	var dailymotionsearch = req.dailymotionsearch ;

	dailymotionsearch.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dailymotionsearch);
		}
	});
};

/**
 * List of Dailymotionsearches
 */
exports.list = function(req, res) { Dailymotionsearch.find().sort('-created').populate('user', 'displayName').exec(function(err, dailymotionsearches) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dailymotionsearches);
		}
	});
};

/**
 * Dailymotionsearch middleware
 */
exports.dailymotionsearchByID = function(req, res, next, id) { Dailymotionsearch.findById(id).populate('user', 'displayName').exec(function(err, dailymotionsearch) {
		if (err) return next(err);
		if (! dailymotionsearch) return next(new Error('Failed to load Dailymotionsearch ' + id));
		req.dailymotionsearch = dailymotionsearch ;
		next();
	});
};
