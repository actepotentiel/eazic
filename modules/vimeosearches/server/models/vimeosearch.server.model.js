'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Vimeosearch Schema
 */
var VimeosearchSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Vimeosearch name',
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

mongoose.model('Vimeosearch', VimeosearchSchema);