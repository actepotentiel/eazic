/**
 * Created by mc on 11/11/15.
 */
'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Autocomplete Permissions
 */
exports.invokeRolesPolicies = function() {
    acl.allow([{
        roles: ['admin'],
        allows: [{
            resources: '/api/autocomplete',
            permissions: ['post']
        }]
    }, {
        roles: ['user'],
        allows: [{
            resources: '/api/autocomplete',
            permissions: ['post']
        }]
    }, {
        roles: ['guest'],
        allows: [{
            resources: '/api/autocomplete',
            permissions: ['post']
        }]
    }]);
};

