/**
 * Created by mc on 11/11/15.
 */
'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
    DailymotionStrategy = require('passport-dailymotion').Strategy,
    users = require('../../controllers/users.server.controller');

module.exports = function (config) {
    // Use facebook strategy
    passport.use(new DailymotionStrategy({
            clientID: config.dailymotion.clientID,
            clientSecret: config.dailymotion.clientSecret,
            callbackURL: config.dailymotion.callbackURL
        },
        function(req, accessToken, refreshToken, profile, done) {
            // Set the provider data and include tokens
            console.log(profile);
            var providerData = profile._json;
            providerData.accessToken = accessToken;
            providerData.refreshToken = refreshToken;

            // Create the user OAuth profile
            var providerUserProfile = {
                firstName: profile.screenname,
                lastName: profile.username,
                displayName: profile.screenname,
                email: profile.email ? profile.email : undefined,
                username: profile.screenname || generateUsername(profile),
                profileImageURL: undefined,
                provider: 'dailymotion',
                providerIdentifierField: 'id',
                providerData: providerData
            };

            // Save the user OAuth profile
            users.saveOAuthUserProfile(req, providerUserProfile, done);

            function generateUsername(profile) {
                var username = '';

                if (profile.emails) {
                    username = profile.emails[0].value.split('@')[0];
                } else if (profile.name) {
                    username = profile.name.givenName[0] + profile.name.familyName;
                }

                return username.toLowerCase() || undefined;
            }
        }
    ));
};
