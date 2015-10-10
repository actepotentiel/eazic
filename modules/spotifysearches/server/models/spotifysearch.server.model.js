'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Spotifysearch Schema
 */
var SpotifysearchSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Spotifysearch name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Spotifysearch', SpotifysearchSchema);