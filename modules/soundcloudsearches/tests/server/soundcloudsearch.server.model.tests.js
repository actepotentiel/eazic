'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Soundcloudsearch = mongoose.model('Soundcloudsearch');

/**
 * Globals
 */
var user, soundcloudsearch;

/**
 * Unit tests
 */
describe('Soundcloudsearch Model Unit Tests:', function() {
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
			soundcloudsearch = new Soundcloudsearch({
				name: 'Soundcloudsearch Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return soundcloudsearch.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			soundcloudsearch.name = '';

			return soundcloudsearch.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Soundcloudsearch.remove().exec(function(){
			User.remove().exec(function(){
				done();
			});	
		});
	});
});
