'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Dailymotionsearch = mongoose.model('Dailymotionsearch');

/**
 * Globals
 */
var user, dailymotionsearch;

/**
 * Unit tests
 */
describe('Dailymotionsearch Model Unit Tests:', function() {
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
			dailymotionsearch = new Dailymotionsearch({
				name: 'Dailymotionsearch Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return dailymotionsearch.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			dailymotionsearch.name = '';

			return dailymotionsearch.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Dailymotionsearch.remove().exec(function(){
			User.remove().exec(function(){
				done();
			});	
		});
	});
});
