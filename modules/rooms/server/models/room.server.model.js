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
		allowedUser : [
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
	playlist : {
		sounds : []
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
