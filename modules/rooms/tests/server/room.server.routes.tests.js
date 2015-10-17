'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Room = mongoose.model('Room'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, room;

/**
 * Room routes tests
 */
describe('Room CRUD tests', function() {
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

		// Save a user to the test db and create new Room
		user.save(function() {
			room = {
				name: 'Room Name'
			};

			done();
		});
	});

	it('should be able to save Room instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Room
				agent.post('/api/rooms')
					.send(room)
					.expect(200)
					.end(function(roomSaveErr, roomSaveRes) {
						// Handle Room save error
						if (roomSaveErr) done(roomSaveErr);

						// Get a list of Rooms
						agent.get('/api/rooms')
							.end(function(roomsGetErr, roomsGetRes) {
								// Handle Room save error
								if (roomsGetErr) done(roomsGetErr);

								// Get Rooms list
								var rooms = roomsGetRes.body;

								// Set assertions
								(rooms[0].user._id).should.equal(userId);
								(rooms[0].name).should.match('Room Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Room instance if not logged in', function(done) {
		agent.post('/api/rooms')
			.send(room)
			.expect(403)
			.end(function(roomSaveErr, roomSaveRes) {
				// Call the assertion callback
				done(roomSaveErr);
			});
	});

	it('should not be able to save Room instance if no name is provided', function(done) {
		// Invalidate name field
		room.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Room
				agent.post('/api/rooms')
					.send(room)
					.expect(400)
					.end(function(roomSaveErr, roomSaveRes) {
						// Set message assertion
						(roomSaveRes.body.message).should.match('Please fill Room name');
						
						// Handle Room save error
						done(roomSaveErr);
					});
			});
	});

	it('should be able to update Room instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Room
				agent.post('/api/rooms')
					.send(room)
					.expect(200)
					.end(function(roomSaveErr, roomSaveRes) {
						// Handle Room save error
						if (roomSaveErr) done(roomSaveErr);

						// Update Room name
						room.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Room
						agent.put('/api/rooms/' + roomSaveRes.body._id)
							.send(room)
							.expect(200)
							.end(function(roomUpdateErr, roomUpdateRes) {
								// Handle Room update error
								if (roomUpdateErr) done(roomUpdateErr);

								// Set assertions
								(roomUpdateRes.body._id).should.equal(roomSaveRes.body._id);
								(roomUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Rooms if not signed in', function(done) {
		// Create new Room model instance
		var roomObj = new Room(room);

		// Save the Room
		roomObj.save(function() {
			// Request Rooms
			request(app).get('/api/rooms')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Room if not signed in', function(done) {
		// Create new Room model instance
		var roomObj = new Room(room);

		// Save the Room
		roomObj.save(function() {
			request(app).get('/api/rooms/' + roomObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', room.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Room instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Room
				agent.post('/api/rooms')
					.send(room)
					.expect(200)
					.end(function(roomSaveErr, roomSaveRes) {
						// Handle Room save error
						if (roomSaveErr) done(roomSaveErr);

						// Delete existing Room
						agent.delete('/api/rooms/' + roomSaveRes.body._id)
							.send(room)
							.expect(200)
							.end(function(roomDeleteErr, roomDeleteRes) {
								// Handle Room error error
								if (roomDeleteErr) done(roomDeleteErr);

								// Set assertions
								(roomDeleteRes.body._id).should.equal(roomSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Room instance if not signed in', function(done) {
		// Set Room user 
		room.user = user;

		// Create new Room model instance
		var roomObj = new Room(room);

		// Save the Room
		roomObj.save(function() {
			// Try deleting Room
			request(app).delete('/api/rooms/' + roomObj._id)
			.expect(403)
			.end(function(roomDeleteErr, roomDeleteRes) {
				// Set message assertion
				(roomDeleteRes.body.message).should.match('User is not authorized');

				// Handle Room error error
				done(roomDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Room.remove().exec(function(){
				done();
			});
		});
	});
});
