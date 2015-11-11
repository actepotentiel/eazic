/**
 * Created by mc on 11/11/15.
 */
'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    path = require('path'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    youtubeApi = require('youtube-api');

youtubeApi.authenticate({
    type: "key",
    key: 'AIzaSyBVsIBrr7VmuhNN-NvRVWw-gZA4vjj1YeA'
});

/**
 * Autocomplete via Youtube
 */
exports.find = function(req, res) {
    console.log(req.body);
    if (!req.body.autocomplete || req.body.autocomplete.length===0) {
        return res.status(422).send({
            message: 'Parameter [autocomplete] is undefined'
        });
    }

    youtubeApi.search.list({
        q: req.body.autocomplete,
        part: 'snippet',
        fields: 'items(snippet(title))',
        maxResults: 10
    }, function(error, results) {
        var formattedResponse = [];
        for (var video in results.items) {
            formattedResponse.push(results.items[video].snippet.title);
        }
        res.jsonp({ autocomplete : formattedResponse} || error);
    });
};


