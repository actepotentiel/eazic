'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Playlist = mongoose.model('Playlist'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


/*
 *Create or Update Playlist
 *  */

exports.createPlaylist = function(req, res) {
	var playlist = new Playlist(req.body);
	playlist.owner = req.user;

	playlist.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(playlist);
		}
	});
};

/**
 * UpdatePlaylist a Playlist
 */
exports.updatePlaylist = function(req, res) {
	var playlist = req.playlist ;

	playlist = _.extend(playlist , req.body);

	playlist.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(playlist);
		}
	});
};


/**
 * Create a Playlist
 */
exports.create = function(req, res) {
	console.log(req.body);
	var playlist = new Playlist(req.body);
	playlist.owner = req.user;

	playlist.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(playlist);
		}
	});
};

/**
 * Show the current Playlist
 */
exports.read = function(req, res) {
	res.jsonp(req.playlist);
};

exports.readMyPlaylists = function(req, res) {
	res.jsonp(req.playlists);
};

/**
 * Update a Playlist
 */
exports.update = function(req, res) {
	var playlist = req.playlist ;

	playlist = _.extend(playlist , req.body);

	playlist.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(playlist);
		}
	});
};

/**
 * Delete an Playlist
 */
exports.delete = function(req, res) {
	var playlist = req.playlist ;

	playlist.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(playlist);
		}
	});
};

/**
 * List of Playlists
 */
exports.list = function(req, res) { Playlist.find().sort('-created').populate('user', 'displayName').exec(function(err, playlists) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(playlists);
		}
	});
};

/**
 * Playlist middleware
 */
exports.playlistByID = function(req, res, next, id) {
	Playlist.findById(id).populate('owner', 'displayName').exec(function(err, playlist) {
		if (err) return next(err);
		if (! playlist) return next(new Error('Failed to load Playlist ' + id));
		req.playlist = playlist ;
		next();
	});
};

exports.playlistByUserID = function(req, res, next, id) {
	Playlist.find({owner: id}).exec(function(err, playlists) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			req.askedPlaylistUserId = id;
			req.playlists = playlists;
			next();
		}
	});
};
