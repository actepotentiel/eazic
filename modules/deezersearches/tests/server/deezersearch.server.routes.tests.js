'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Deezersearch = mongoose.model('Deezersearch'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, deezersearch;

/**
 * Deezersearch routes tests
 */
describe('Deezersearch CRUD tests', function() {
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

		// Save a user to the test db and create new Deezersearch
		user.save(function() {
			deezersearch = {
				name: 'Deezersearch Name'
			};

			done();
		});
	});

	it('should be able to save Deezersearch instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Deezersearch
				agent.post('/api/deezersearches')
					.send(deezersearch)
					.expect(200)
					.end(function(deezersearchSaveErr, deezersearchSaveRes) {
						// Handle Deezersearch save error
						if (deezersearchSaveErr) done(deezersearchSaveErr);

						// Get a list of Deezersearches
						agent.get('/api/deezersearches')
							.end(function(deezersearchesGetErr, deezersearchesGetRes) {
								// Handle Deezersearch save error
								if (deezersearchesGetErr) done(deezersearchesGetErr);

								// Get Deezersearches list
								var deezersearches = deezersearchesGetRes.body;

								// Set assertions
								(deezersearches[0].user._id).should.equal(userId);
								(deezersearches[0].name).should.match('Deezersearch Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Deezersearch instance if not logged in', function(done) {
		agent.post('/api/deezersearches')
			.send(deezersearch)
			.expect(403)
			.end(function(deezersearchSaveErr, deezersearchSaveRes) {
				// Call the assertion callback
				done(deezersearchSaveErr);
			});
	});

	it('should not be able to save Deezersearch instance if no name is provided', function(done) {
		// Invalidate name field
		deezersearch.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Deezersearch
				agent.post('/api/deezersearches')
					.send(deezersearch)
					.expect(400)
					.end(function(deezersearchSaveErr, deezersearchSaveRes) {
						// Set message assertion
						(deezersearchSaveRes.body.message).should.match('Please fill Deezersearch name');
						
						// Handle Deezersearch save error
						done(deezersearchSaveErr);
					});
			});
	});

	it('should be able to update Deezersearch instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Deezersearch
				agent.post('/api/deezersearches')
					.send(deezersearch)
					.expect(200)
					.end(function(deezersearchSaveErr, deezersearchSaveRes) {
						// Handle Deezersearch save error
						if (deezersearchSaveErr) done(deezersearchSaveErr);

						// Update Deezersearch name
						deezersearch.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Deezersearch
						agent.put('/api/deezersearches/' + deezersearchSaveRes.body._id)
							.send(deezersearch)
							.expect(200)
							.end(function(deezersearchUpdateErr, deezersearchUpdateRes) {
								// Handle Deezersearch update error
								if (deezersearchUpdateErr) done(deezersearchUpdateErr);

								// Set assertions
								(deezersearchUpdateRes.body._id).should.equal(deezersearchSaveRes.body._id);
								(deezersearchUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Deezersearches if not signed in', function(done) {
		// Create new Deezersearch model instance
		var deezersearchObj = new Deezersearch(deezersearch);

		// Save the Deezersearch
		deezersearchObj.save(function() {
			// Request Deezersearches
			request(app).get('/api/deezersearches')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Deezersearch if not signed in', function(done) {
		// Create new Deezersearch model instance
		var deezersearchObj = new Deezersearch(deezersearch);

		// Save the Deezersearch
		deezersearchObj.save(function() {
			request(app).get('/api/deezersearches/' + deezersearchObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', deezersearch.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Deezersearch instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Deezersearch
				agent.post('/api/deezersearches')
					.send(deezersearch)
					.expect(200)
					.end(function(deezersearchSaveErr, deezersearchSaveRes) {
						// Handle Deezersearch save error
						if (deezersearchSaveErr) done(deezersearchSaveErr);

						// Delete existing Deezersearch
						agent.delete('/api/deezersearches/' + deezersearchSaveRes.body._id)
							.send(deezersearch)
							.expect(200)
							.end(function(deezersearchDeleteErr, deezersearchDeleteRes) {
								// Handle Deezersearch error error
								if (deezersearchDeleteErr) done(deezersearchDeleteErr);

								// Set assertions
								(deezersearchDeleteRes.body._id).should.equal(deezersearchSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Deezersearch instance if not signed in', function(done) {
		// Set Deezersearch user 
		deezersearch.user = user;

		// Create new Deezersearch model instance
		var deezersearchObj = new Deezersearch(deezersearch);

		// Save the Deezersearch
		deezersearchObj.save(function() {
			// Try deleting Deezersearch
			request(app).delete('/api/deezersearches/' + deezersearchObj._id)
			.expect(403)
			.end(function(deezersearchDeleteErr, deezersearchDeleteRes) {
				// Set message assertion
				(deezersearchDeleteRes.body.message).should.match('User is not authorized');

				// Handle Deezersearch error error
				done(deezersearchDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Deezersearch.remove().exec(function(){
				done();
			});
		});
	});
});
