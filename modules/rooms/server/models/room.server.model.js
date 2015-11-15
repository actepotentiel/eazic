'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Room Schema
 */
var RoomSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Room name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	conf : {
		name : String,
		owner : {
			type: Schema.ObjectId,
			ref: 'User'
		},
		users : [
			{
				type: Schema.ObjectId,
				ref: 'User'
			}
		],
		isOpen : Boolean,
		allowedUsers : [
			{
				type: Schema.ObjectId,
				ref: 'User'
			}
		],
		bannedUsers : [
			{
				type: Schema.ObjectId,
				ref: 'User'
			}
		]
	},
	player : {
		isDouble : Boolean
	},
	playlist : {
		sounds: [{
			created: {
				type: Date,
				default: Date.now
			},
			title: {
				type: String,
				trim: true,
				required: 'Title cannot be blank'
			},
			order: {
				type: Number,
				required: 'Order cannot be null'
			},
			sourceName: {
				type: String,
				trim: true,
				required: 'sourceName cannot be blank'
			},
			sourceId: {
				type: String,
				default: '',
				trim: true,
				required: 'SourceId cannot be blank'
			},
			playlistId:{
				type: String,
				default: '',
				trim: true
			},
			duration:{
				type: Number,
				default:0
			},
			image:{
				type: String,
				default: '/images/sound_default.png',
				trim: true
			},
			rate:{
				type: Number,
				default: 0,
				trim: true
			},
			available: {
				type: Boolean,
				default: true
			}
		}]
	},
	policies : [
		{
			name : String,
			users : [
				{
					type: Schema.ObjectId,
					ref: 'User'
				}
			],
			allowedCommands : [
				{
					commandName : String
				}
			]
		}
	]
});

mongoose.model('Room', RoomSchema);
