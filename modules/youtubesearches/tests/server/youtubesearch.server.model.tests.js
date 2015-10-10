'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Youtubesearch = mongoose.model('Youtubesearch');

/**
 * Globals
 */
var user, youtubesearch;

/**
 * Unit tests
 */
describe('Youtubesearch Model Unit Tests:', function() {
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
			youtubesearch = new Youtubesearch({
				name: 'Youtubesearch Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return youtubesearch.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			youtubesearch.name = '';

			return youtubesearch.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Youtubesearch.remove().exec(function(){
			User.remove().exec(function(){
				done();
			});	
		});
	});
});
