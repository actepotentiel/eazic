'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Youtubesearch = mongoose.model('Youtubesearch'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, youtubesearch;

/**
 * Youtubesearch routes tests
 */
describe('Youtubesearch CRUD tests', function() {
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

		// Save a user to the test db and create new Youtubesearch
		user.save(function() {
			youtubesearch = {
				name: 'Youtubesearch Name'
			};

			done();
		});
	});

	it('should be able to save Youtubesearch instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Youtubesearch
				agent.post('/api/youtubesearches')
					.send(youtubesearch)
					.expect(200)
					.end(function(youtubesearchSaveErr, youtubesearchSaveRes) {
						// Handle Youtubesearch save error
						if (youtubesearchSaveErr) done(youtubesearchSaveErr);

						// Get a list of Youtubesearches
						agent.get('/api/youtubesearches')
							.end(function(youtubesearchesGetErr, youtubesearchesGetRes) {
								// Handle Youtubesearch save error
								if (youtubesearchesGetErr) done(youtubesearchesGetErr);

								// Get Youtubesearches list
								var youtubesearches = youtubesearchesGetRes.body;

								// Set assertions
								(youtubesearches[0].user._id).should.equal(userId);
								(youtubesearches[0].name).should.match('Youtubesearch Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Youtubesearch instance if not logged in', function(done) {
		agent.post('/api/youtubesearches')
			.send(youtubesearch)
			.expect(403)
			.end(function(youtubesearchSaveErr, youtubesearchSaveRes) {
				// Call the assertion callback
				done(youtubesearchSaveErr);
			});
	});

	it('should not be able to save Youtubesearch instance if no name is provided', function(done) {
		// Invalidate name field
		youtubesearch.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Youtubesearch
				agent.post('/api/youtubesearches')
					.send(youtubesearch)
					.expect(400)
					.end(function(youtubesearchSaveErr, youtubesearchSaveRes) {
						// Set message assertion
						(youtubesearchSaveRes.body.message).should.match('Please fill Youtubesearch name');
						
						// Handle Youtubesearch save error
						done(youtubesearchSaveErr);
					});
			});
	});

	it('should be able to update Youtubesearch instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Youtubesearch
				agent.post('/api/youtubesearches')
					.send(youtubesearch)
					.expect(200)
					.end(function(youtubesearchSaveErr, youtubesearchSaveRes) {
						// Handle Youtubesearch save error
						if (youtubesearchSaveErr) done(youtubesearchSaveErr);

						// Update Youtubesearch name
						youtubesearch.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Youtubesearch
						agent.put('/api/youtubesearches/' + youtubesearchSaveRes.body._id)
							.send(youtubesearch)
							.expect(200)
							.end(function(youtubesearchUpdateErr, youtubesearchUpdateRes) {
								// Handle Youtubesearch update error
								if (youtubesearchUpdateErr) done(youtubesearchUpdateErr);

								// Set assertions
								(youtubesearchUpdateRes.body._id).should.equal(youtubesearchSaveRes.body._id);
								(youtubesearchUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Youtubesearches if not signed in', function(done) {
		// Create new Youtubesearch model instance
		var youtubesearchObj = new Youtubesearch(youtubesearch);

		// Save the Youtubesearch
		youtubesearchObj.save(function() {
			// Request Youtubesearches
			request(app).get('/api/youtubesearches')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Youtubesearch if not signed in', function(done) {
		// Create new Youtubesearch model instance
		var youtubesearchObj = new Youtubesearch(youtubesearch);

		// Save the Youtubesearch
		youtubesearchObj.save(function() {
			request(app).get('/api/youtubesearches/' + youtubesearchObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', youtubesearch.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Youtubesearch instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Youtubesearch
				agent.post('/api/youtubesearches')
					.send(youtubesearch)
					.expect(200)
					.end(function(youtubesearchSaveErr, youtubesearchSaveRes) {
						// Handle Youtubesearch save error
						if (youtubesearchSaveErr) done(youtubesearchSaveErr);

						// Delete existing Youtubesearch
						agent.delete('/api/youtubesearches/' + youtubesearchSaveRes.body._id)
							.send(youtubesearch)
							.expect(200)
							.end(function(youtubesearchDeleteErr, youtubesearchDeleteRes) {
								// Handle Youtubesearch error error
								if (youtubesearchDeleteErr) done(youtubesearchDeleteErr);

								// Set assertions
								(youtubesearchDeleteRes.body._id).should.equal(youtubesearchSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Youtubesearch instance if not signed in', function(done) {
		// Set Youtubesearch user 
		youtubesearch.user = user;

		// Create new Youtubesearch model instance
		var youtubesearchObj = new Youtubesearch(youtubesearch);

		// Save the Youtubesearch
		youtubesearchObj.save(function() {
			// Try deleting Youtubesearch
			request(app).delete('/api/youtubesearches/' + youtubesearchObj._id)
			.expect(403)
			.end(function(youtubesearchDeleteErr, youtubesearchDeleteRes) {
				// Set message assertion
				(youtubesearchDeleteRes.body.message).should.match('User is not authorized');

				// Handle Youtubesearch error error
				done(youtubesearchDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Youtubesearch.remove().exec(function(){
				done();
			});
		});
	});
});
