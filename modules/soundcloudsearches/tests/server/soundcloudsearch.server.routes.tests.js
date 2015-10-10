'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Soundcloudsearch = mongoose.model('Soundcloudsearch'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, soundcloudsearch;

/**
 * Soundcloudsearch routes tests
 */
describe('Soundcloudsearch CRUD tests', function() {
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

		// Save a user to the test db and create new Soundcloudsearch
		user.save(function() {
			soundcloudsearch = {
				name: 'Soundcloudsearch Name'
			};

			done();
		});
	});

	it('should be able to save Soundcloudsearch instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Soundcloudsearch
				agent.post('/api/soundcloudsearches')
					.send(soundcloudsearch)
					.expect(200)
					.end(function(soundcloudsearchSaveErr, soundcloudsearchSaveRes) {
						// Handle Soundcloudsearch save error
						if (soundcloudsearchSaveErr) done(soundcloudsearchSaveErr);

						// Get a list of Soundcloudsearches
						agent.get('/api/soundcloudsearches')
							.end(function(soundcloudsearchesGetErr, soundcloudsearchesGetRes) {
								// Handle Soundcloudsearch save error
								if (soundcloudsearchesGetErr) done(soundcloudsearchesGetErr);

								// Get Soundcloudsearches list
								var soundcloudsearches = soundcloudsearchesGetRes.body;

								// Set assertions
								(soundcloudsearches[0].user._id).should.equal(userId);
								(soundcloudsearches[0].name).should.match('Soundcloudsearch Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Soundcloudsearch instance if not logged in', function(done) {
		agent.post('/api/soundcloudsearches')
			.send(soundcloudsearch)
			.expect(403)
			.end(function(soundcloudsearchSaveErr, soundcloudsearchSaveRes) {
				// Call the assertion callback
				done(soundcloudsearchSaveErr);
			});
	});

	it('should not be able to save Soundcloudsearch instance if no name is provided', function(done) {
		// Invalidate name field
		soundcloudsearch.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Soundcloudsearch
				agent.post('/api/soundcloudsearches')
					.send(soundcloudsearch)
					.expect(400)
					.end(function(soundcloudsearchSaveErr, soundcloudsearchSaveRes) {
						// Set message assertion
						(soundcloudsearchSaveRes.body.message).should.match('Please fill Soundcloudsearch name');
						
						// Handle Soundcloudsearch save error
						done(soundcloudsearchSaveErr);
					});
			});
	});

	it('should be able to update Soundcloudsearch instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Soundcloudsearch
				agent.post('/api/soundcloudsearches')
					.send(soundcloudsearch)
					.expect(200)
					.end(function(soundcloudsearchSaveErr, soundcloudsearchSaveRes) {
						// Handle Soundcloudsearch save error
						if (soundcloudsearchSaveErr) done(soundcloudsearchSaveErr);

						// Update Soundcloudsearch name
						soundcloudsearch.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Soundcloudsearch
						agent.put('/api/soundcloudsearches/' + soundcloudsearchSaveRes.body._id)
							.send(soundcloudsearch)
							.expect(200)
							.end(function(soundcloudsearchUpdateErr, soundcloudsearchUpdateRes) {
								// Handle Soundcloudsearch update error
								if (soundcloudsearchUpdateErr) done(soundcloudsearchUpdateErr);

								// Set assertions
								(soundcloudsearchUpdateRes.body._id).should.equal(soundcloudsearchSaveRes.body._id);
								(soundcloudsearchUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Soundcloudsearches if not signed in', function(done) {
		// Create new Soundcloudsearch model instance
		var soundcloudsearchObj = new Soundcloudsearch(soundcloudsearch);

		// Save the Soundcloudsearch
		soundcloudsearchObj.save(function() {
			// Request Soundcloudsearches
			request(app).get('/api/soundcloudsearches')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Soundcloudsearch if not signed in', function(done) {
		// Create new Soundcloudsearch model instance
		var soundcloudsearchObj = new Soundcloudsearch(soundcloudsearch);

		// Save the Soundcloudsearch
		soundcloudsearchObj.save(function() {
			request(app).get('/api/soundcloudsearches/' + soundcloudsearchObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', soundcloudsearch.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Soundcloudsearch instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Soundcloudsearch
				agent.post('/api/soundcloudsearches')
					.send(soundcloudsearch)
					.expect(200)
					.end(function(soundcloudsearchSaveErr, soundcloudsearchSaveRes) {
						// Handle Soundcloudsearch save error
						if (soundcloudsearchSaveErr) done(soundcloudsearchSaveErr);

						// Delete existing Soundcloudsearch
						agent.delete('/api/soundcloudsearches/' + soundcloudsearchSaveRes.body._id)
							.send(soundcloudsearch)
							.expect(200)
							.end(function(soundcloudsearchDeleteErr, soundcloudsearchDeleteRes) {
								// Handle Soundcloudsearch error error
								if (soundcloudsearchDeleteErr) done(soundcloudsearchDeleteErr);

								// Set assertions
								(soundcloudsearchDeleteRes.body._id).should.equal(soundcloudsearchSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Soundcloudsearch instance if not signed in', function(done) {
		// Set Soundcloudsearch user 
		soundcloudsearch.user = user;

		// Create new Soundcloudsearch model instance
		var soundcloudsearchObj = new Soundcloudsearch(soundcloudsearch);

		// Save the Soundcloudsearch
		soundcloudsearchObj.save(function() {
			// Try deleting Soundcloudsearch
			request(app).delete('/api/soundcloudsearches/' + soundcloudsearchObj._id)
			.expect(403)
			.end(function(soundcloudsearchDeleteErr, soundcloudsearchDeleteRes) {
				// Set message assertion
				(soundcloudsearchDeleteRes.body.message).should.match('User is not authorized');

				// Handle Soundcloudsearch error error
				done(soundcloudsearchDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Soundcloudsearch.remove().exec(function(){
				done();
			});
		});
	});
});
