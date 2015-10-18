'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Vimeosearch = mongoose.model('Vimeosearch'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
	Vimeo = require('vimeo').Vimeo;
/*
* Search on Vimeo datas
* */
exports.search = function(req, res) {
	var lib = new Vimeo('fdfd207f8a4d8e18f98a5355f81906130e60fd35', 'gNP2iwWTv5nm+q68KWIog1bQKBGA+k3n7X9pelhhpjmYvRWw+Ks75LCezMMW/dSrubwp8yJcMxy2CFoID4z5Rua03DgFRyRTGBPanPyv25jedEBUJSmqSCs5y4i5y6k4', '3362e455675da4faa4a27a67554df2e4');
	lib.request({
		// This is the path for the videos contained within the staff picks channels
		path : '/videos',
		// This adds the parameters to request page two, and 10 items per page
		query : {
			query: req.body.q,
			per_page : 20,
			fields: 'uri,name,description,link,duration,embed,content_rating,pictures'
		}
	}, function(err, results) {
		var formattedResults = [];
		var formattedMetas = {};
		formattedMetas.totalResults = results.total;
		formattedMetas.nextPage = results.paging.next;
		formattedMetas.perPage = results.per_page;
		for (var video in results.data) {
			var item = {};
			item.title = results.data[video].name;
			item.sourceName = 'vimeo';
			item.sourceId = results.data[video].uri;
			item.image = results.data[video].pictures.sizes[3].link || '/images/sound_default.png';
			//item.embed = results.data[video].embed.html;
			formattedResults.push(item);
		}
		var formattedResponse = {
			vimeo: {
				infos : formattedMetas,
				items : formattedResults
			}
		};
		res.jsonp(formattedResponse || err);
	});
};

/**
 * Create a Vimeosearch
 */
exports.create = function(req, res) {
	var vimeosearch = new Vimeosearch(req.body);
	vimeosearch.user = req.user;

	vimeosearch.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vimeosearch);
		}
	});
};

/**
 * Show the current Vimeosearch
 */
exports.read = function(req, res) {
	res.jsonp(req.vimeosearch);
};

/**
 * Update a Vimeosearch
 */
exports.update = function(req, res) {
	var vimeosearch = req.vimeosearch ;

	vimeosearch = _.extend(vimeosearch , req.body);

	vimeosearch.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vimeosearch);
		}
	});
};

/**
 * Delete an Vimeosearch
 */
exports.delete = function(req, res) {
	var vimeosearch = req.vimeosearch ;

	vimeosearch.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vimeosearch);
		}
	});
};

/**
 * List of Vimeosearches
 */
exports.list = function(req, res) { Vimeosearch.find().sort('-created').populate('user', 'displayName').exec(function(err, vimeosearches) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vimeosearches);
		}
	});
};

/**
 * Vimeosearch middleware
 */
exports.vimeosearchByID = function(req, res, next, id) { Vimeosearch.findById(id).populate('user', 'displayName').exec(function(err, vimeosearch) {
		if (err) return next(err);
		if (! vimeosearch) return next(new Error('Failed to load Vimeosearch ' + id));
		req.vimeosearch = vimeosearch ;
		next();
	});
};
