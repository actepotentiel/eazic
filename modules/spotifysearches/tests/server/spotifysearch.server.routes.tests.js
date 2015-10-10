'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Spotifysearch = mongoose.model('Spotifysearch'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, spotifysearch;

/**
 * Spotifysearch routes tests
 */
describe('Spotifysearch CRUD tests', function() {
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

		// Save a user to the test db and create new Spotifysearch
		user.save(function() {
			spotifysearch = {
				name: 'Spotifysearch Name'
			};

			done();
		});
	});

	it('should be able to save Spotifysearch instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Spotifysearch
				agent.post('/api/spotifysearches')
					.send(spotifysearch)
					.expect(200)
					.end(function(spotifysearchSaveErr, spotifysearchSaveRes) {
						// Handle Spotifysearch save error
						if (spotifysearchSaveErr) done(spotifysearchSaveErr);

						// Get a list of Spotifysearches
						agent.get('/api/spotifysearches')
							.end(function(spotifysearchesGetErr, spotifysearchesGetRes) {
								// Handle Spotifysearch save error
								if (spotifysearchesGetErr) done(spotifysearchesGetErr);

								// Get Spotifysearches list
								var spotifysearches = spotifysearchesGetRes.body;

								// Set assertions
								(spotifysearches[0].user._id).should.equal(userId);
								(spotifysearches[0].name).should.match('Spotifysearch Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Spotifysearch instance if not logged in', function(done) {
		agent.post('/api/spotifysearches')
			.send(spotifysearch)
			.expect(403)
			.end(function(spotifysearchSaveErr, spotifysearchSaveRes) {
				// Call the assertion callback
				done(spotifysearchSaveErr);
			});
	});

	it('should not be able to save Spotifysearch instance if no name is provided', function(done) {
		// Invalidate name field
		spotifysearch.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Spotifysearch
				agent.post('/api/spotifysearches')
					.send(spotifysearch)
					.expect(400)
					.end(function(spotifysearchSaveErr, spotifysearchSaveRes) {
						// Set message assertion
						(spotifysearchSaveRes.body.message).should.match('Please fill Spotifysearch name');
						
						// Handle Spotifysearch save error
						done(spotifysearchSaveErr);
					});
			});
	});

	it('should be able to update Spotifysearch instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Spotifysearch
				agent.post('/api/spotifysearches')
					.send(spotifysearch)
					.expect(200)
					.end(function(spotifysearchSaveErr, spotifysearchSaveRes) {
						// Handle Spotifysearch save error
						if (spotifysearchSaveErr) done(spotifysearchSaveErr);

						// Update Spotifysearch name
						spotifysearch.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Spotifysearch
						agent.put('/api/spotifysearches/' + spotifysearchSaveRes.body._id)
							.send(spotifysearch)
							.expect(200)
							.end(function(spotifysearchUpdateErr, spotifysearchUpdateRes) {
								// Handle Spotifysearch update error
								if (spotifysearchUpdateErr) done(spotifysearchUpdateErr);

								// Set assertions
								(spotifysearchUpdateRes.body._id).should.equal(spotifysearchSaveRes.body._id);
								(spotifysearchUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Spotifysearches if not signed in', function(done) {
		// Create new Spotifysearch model instance
		var spotifysearchObj = new Spotifysearch(spotifysearch);

		// Save the Spotifysearch
		spotifysearchObj.save(function() {
			// Request Spotifysearches
			request(app).get('/api/spotifysearches')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Spotifysearch if not signed in', function(done) {
		// Create new Spotifysearch model instance
		var spotifysearchObj = new Spotifysearch(spotifysearch);

		// Save the Spotifysearch
		spotifysearchObj.save(function() {
			request(app).get('/api/spotifysearches/' + spotifysearchObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', spotifysearch.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Spotifysearch instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Spotifysearch
				agent.post('/api/spotifysearches')
					.send(spotifysearch)
					.expect(200)
					.end(function(spotifysearchSaveErr, spotifysearchSaveRes) {
						// Handle Spotifysearch save error
						if (spotifysearchSaveErr) done(spotifysearchSaveErr);

						// Delete existing Spotifysearch
						agent.delete('/api/spotifysearches/' + spotifysearchSaveRes.body._id)
							.send(spotifysearch)
							.expect(200)
							.end(function(spotifysearchDeleteErr, spotifysearchDeleteRes) {
								// Handle Spotifysearch error error
								if (spotifysearchDeleteErr) done(spotifysearchDeleteErr);

								// Set assertions
								(spotifysearchDeleteRes.body._id).should.equal(spotifysearchSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Spotifysearch instance if not signed in', function(done) {
		// Set Spotifysearch user 
		spotifysearch.user = user;

		// Create new Spotifysearch model instance
		var spotifysearchObj = new Spotifysearch(spotifysearch);

		// Save the Spotifysearch
		spotifysearchObj.save(function() {
			// Try deleting Spotifysearch
			request(app).delete('/api/spotifysearches/' + spotifysearchObj._id)
			.expect(403)
			.end(function(spotifysearchDeleteErr, spotifysearchDeleteRes) {
				// Set message assertion
				(spotifysearchDeleteRes.body.message).should.match('User is not authorized');

				// Handle Spotifysearch error error
				done(spotifysearchDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Spotifysearch.remove().exec(function(){
				done();
			});
		});
	});
});
