'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Vimeosearch = mongoose.model('Vimeosearch'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, vimeosearch;

/**
 * Vimeosearch routes tests
 */
describe('Vimeosearch CRUD tests', function() {
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

		// Save a user to the test db and create new Vimeosearch
		user.save(function() {
			vimeosearch = {
				name: 'Vimeosearch Name'
			};

			done();
		});
	});

	it('should be able to save Vimeosearch instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vimeosearch
				agent.post('/api/vimeosearches')
					.send(vimeosearch)
					.expect(200)
					.end(function(vimeosearchSaveErr, vimeosearchSaveRes) {
						// Handle Vimeosearch save error
						if (vimeosearchSaveErr) done(vimeosearchSaveErr);

						// Get a list of Vimeosearches
						agent.get('/api/vimeosearches')
							.end(function(vimeosearchesGetErr, vimeosearchesGetRes) {
								// Handle Vimeosearch save error
								if (vimeosearchesGetErr) done(vimeosearchesGetErr);

								// Get Vimeosearches list
								var vimeosearches = vimeosearchesGetRes.body;

								// Set assertions
								(vimeosearches[0].user._id).should.equal(userId);
								(vimeosearches[0].name).should.match('Vimeosearch Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Vimeosearch instance if not logged in', function(done) {
		agent.post('/api/vimeosearches')
			.send(vimeosearch)
			.expect(403)
			.end(function(vimeosearchSaveErr, vimeosearchSaveRes) {
				// Call the assertion callback
				done(vimeosearchSaveErr);
			});
	});

	it('should not be able to save Vimeosearch instance if no name is provided', function(done) {
		// Invalidate name field
		vimeosearch.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vimeosearch
				agent.post('/api/vimeosearches')
					.send(vimeosearch)
					.expect(400)
					.end(function(vimeosearchSaveErr, vimeosearchSaveRes) {
						// Set message assertion
						(vimeosearchSaveRes.body.message).should.match('Please fill Vimeosearch name');
						
						// Handle Vimeosearch save error
						done(vimeosearchSaveErr);
					});
			});
	});

	it('should be able to update Vimeosearch instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vimeosearch
				agent.post('/api/vimeosearches')
					.send(vimeosearch)
					.expect(200)
					.end(function(vimeosearchSaveErr, vimeosearchSaveRes) {
						// Handle Vimeosearch save error
						if (vimeosearchSaveErr) done(vimeosearchSaveErr);

						// Update Vimeosearch name
						vimeosearch.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Vimeosearch
						agent.put('/api/vimeosearches/' + vimeosearchSaveRes.body._id)
							.send(vimeosearch)
							.expect(200)
							.end(function(vimeosearchUpdateErr, vimeosearchUpdateRes) {
								// Handle Vimeosearch update error
								if (vimeosearchUpdateErr) done(vimeosearchUpdateErr);

								// Set assertions
								(vimeosearchUpdateRes.body._id).should.equal(vimeosearchSaveRes.body._id);
								(vimeosearchUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Vimeosearches if not signed in', function(done) {
		// Create new Vimeosearch model instance
		var vimeosearchObj = new Vimeosearch(vimeosearch);

		// Save the Vimeosearch
		vimeosearchObj.save(function() {
			// Request Vimeosearches
			request(app).get('/api/vimeosearches')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Vimeosearch if not signed in', function(done) {
		// Create new Vimeosearch model instance
		var vimeosearchObj = new Vimeosearch(vimeosearch);

		// Save the Vimeosearch
		vimeosearchObj.save(function() {
			request(app).get('/api/vimeosearches/' + vimeosearchObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', vimeosearch.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Vimeosearch instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vimeosearch
				agent.post('/api/vimeosearches')
					.send(vimeosearch)
					.expect(200)
					.end(function(vimeosearchSaveErr, vimeosearchSaveRes) {
						// Handle Vimeosearch save error
						if (vimeosearchSaveErr) done(vimeosearchSaveErr);

						// Delete existing Vimeosearch
						agent.delete('/api/vimeosearches/' + vimeosearchSaveRes.body._id)
							.send(vimeosearch)
							.expect(200)
							.end(function(vimeosearchDeleteErr, vimeosearchDeleteRes) {
								// Handle Vimeosearch error error
								if (vimeosearchDeleteErr) done(vimeosearchDeleteErr);

								// Set assertions
								(vimeosearchDeleteRes.body._id).should.equal(vimeosearchSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Vimeosearch instance if not signed in', function(done) {
		// Set Vimeosearch user 
		vimeosearch.user = user;

		// Create new Vimeosearch model instance
		var vimeosearchObj = new Vimeosearch(vimeosearch);

		// Save the Vimeosearch
		vimeosearchObj.save(function() {
			// Try deleting Vimeosearch
			request(app).delete('/api/vimeosearches/' + vimeosearchObj._id)
			.expect(403)
			.end(function(vimeosearchDeleteErr, vimeosearchDeleteRes) {
				// Set message assertion
				(vimeosearchDeleteRes.body.message).should.match('User is not authorized');

				// Handle Vimeosearch error error
				done(vimeosearchDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Vimeosearch.remove().exec(function(){
				done();
			});
		});
	});
});
