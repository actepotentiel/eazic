'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Spotifysearch = mongoose.model('Spotifysearch');

/**
 * Globals
 */
var user, spotifysearch;

/**
 * Unit tests
 */
describe('Spotifysearch Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			spotifysearch = new Spotifysearch({
				name: 'Spotifysearch Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return spotifysearch.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			spotifysearch.name = '';

			return spotifysearch.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Spotifysearch.remove().exec(function(){
			User.remove().exec(function(){
				done();
			});	
		});
	});
});
