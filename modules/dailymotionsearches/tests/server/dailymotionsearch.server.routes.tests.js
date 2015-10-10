'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Dailymotionsearch = mongoose.model('Dailymotionsearch'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, dailymotionsearch;

/**
 * Dailymotionsearch routes tests
 */
describe('Dailymotionsearch CRUD tests', function() {
	before(function(done) {
		// Get application
		app = express.init(mongoose);
		agent = request.agent(app);

		done();
	});

	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Dailymotionsearch
		user.save(function() {
			dailymotionsearch = {
				name: 'Dailymotionsearch Name'
			};

			done();
		});
	});

	it('should be able to save Dailymotionsearch instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dailymotionsearch
				agent.post('/api/dailymotionsearches')
					.send(dailymotionsearch)
					.expect(200)
					.end(function(dailymotionsearchSaveErr, dailymotionsearchSaveRes) {
						// Handle Dailymotionsearch save error
						if (dailymotionsearchSaveErr) done(dailymotionsearchSaveErr);

						// Get a list of Dailymotionsearches
						agent.get('/api/dailymotionsearches')
							.end(function(dailymotionsearchesGetErr, dailymotionsearchesGetRes) {
								// Handle Dailymotionsearch save error
								if (dailymotionsearchesGetErr) done(dailymotionsearchesGetErr);

								// Get Dailymotionsearches list
								var dailymotionsearches = dailymotionsearchesGetRes.body;

								// Set assertions
								(dailymotionsearches[0].user._id).should.equal(userId);
								(dailymotionsearches[0].name).should.match('Dailymotionsearch Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Dailymotionsearch instance if not logged in', function(done) {
		agent.post('/api/dailymotionsearches')
			.send(dailymotionsearch)
			.expect(403)
			.end(function(dailymotionsearchSaveErr, dailymotionsearchSaveRes) {
				// Call the assertion callback
				done(dailymotionsearchSaveErr);
			});
	});

	it('should not be able to save Dailymotionsearch instance if no name is provided', function(done) {
		// Invalidate name field
		dailymotionsearch.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dailymotionsearch
				agent.post('/api/dailymotionsearches')
					.send(dailymotionsearch)
					.expect(400)
					.end(function(dailymotionsearchSaveErr, dailymotionsearchSaveRes) {
						// Set message assertion
						(dailymotionsearchSaveRes.body.message).should.match('Please fill Dailymotionsearch name');
						
						// Handle Dailymotionsearch save error
						done(dailymotionsearchSaveErr);
					});
			});
	});

	it('should be able to update Dailymotionsearch instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dailymotionsearch
				agent.post('/api/dailymotionsearches')
					.send(dailymotionsearch)
					.expect(200)
					.end(function(dailymotionsearchSaveErr, dailymotionsearchSaveRes) {
						// Handle Dailymotionsearch save error
						if (dailymotionsearchSaveErr) done(dailymotionsearchSaveErr);

						// Update Dailymotionsearch name
						dailymotionsearch.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Dailymotionsearch
						agent.put('/api/dailymotionsearches/' + dailymotionsearchSaveRes.body._id)
							.send(dailymotionsearch)
							.expect(200)
							.end(function(dailymotionsearchUpdateErr, dailymotionsearchUpdateRes) {
								// Handle Dailymotionsearch update error
								if (dailymotionsearchUpdateErr) done(dailymotionsearchUpdateErr);

								// Set assertions
								(dailymotionsearchUpdateRes.body._id).should.equal(dailymotionsearchSaveRes.body._id);
								(dailymotionsearchUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Dailymotionsearches if not signed in', function(done) {
		// Create new Dailymotionsearch model instance
		var dailymotionsearchObj = new Dailymotionsearch(dailymotionsearch);

		// Save the Dailymotionsearch
		dailymotionsearchObj.save(function() {
			// Request Dailymotionsearches
			request(app).get('/api/dailymotionsearches')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Dailymotionsearch if not signed in', function(done) {
		// Create new Dailymotionsearch model instance
		var dailymotionsearchObj = new Dailymotionsearch(dailymotionsearch);

		// Save the Dailymotionsearch
		dailymotionsearchObj.save(function() {
			request(app).get('/api/dailymotionsearches/' + dailymotionsearchObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', dailymotionsearch.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Dailymotionsearch instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dailymotionsearch
				agent.post('/api/dailymotionsearches')
					.send(dailymotionsearch)
					.expect(200)
					.end(function(dailymotionsearchSaveErr, dailymotionsearchSaveRes) {
						// Handle Dailymotionsearch save error
						if (dailymotionsearchSaveErr) done(dailymotionsearchSaveErr);

						// Delete existing Dailymotionsearch
						agent.delete('/api/dailymotionsearches/' + dailymotionsearchSaveRes.body._id)
							.send(dailymotionsearch)
							.expect(200)
							.end(function(dailymotionsearchDeleteErr, dailymotionsearchDeleteRes) {
								// Handle Dailymotionsearch error error
								if (dailymotionsearchDeleteErr) done(dailymotionsearchDeleteErr);

								// Set assertions
								(dailymotionsearchDeleteRes.body._id).should.equal(dailymotionsearchSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Dailymotionsearch instance if not signed in', function(done) {
		// Set Dailymotionsearch user 
		dailymotionsearch.user = user;

		// Create new Dailymotionsearch model instance
		var dailymotionsearchObj = new Dailymotionsearch(dailymotionsearch);

		// Save the Dailymotionsearch
		dailymotionsearchObj.save(function() {
			// Try deleting Dailymotionsearch
			request(app).delete('/api/dailymotionsearches/' + dailymotionsearchObj._id)
			.expect(403)
			.end(function(dailymotionsearchDeleteErr, dailymotionsearchDeleteRes) {
				// Set message assertion
				(dailymotionsearchDeleteRes.body.message).should.match('User is not authorized');

				// Handle Dailymotionsearch error error
				done(dailymotionsearchDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Dailymotionsearch.remove().exec(function(){
				done();
			});
		});
	});
});
