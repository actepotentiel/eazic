/**
 * Created by mc on 11/11/15.
 */
'use strict';

module.exports = function(app) {
    var autocomplete = require('../controllers/autocomplete.server.controller');
    var autocompletePolicy = require('../policies/autocomplete.server.policy');

    // Playlists Routes
    app.route('/api/autocomplete').all()
        .post(autocomplete.find);

};
