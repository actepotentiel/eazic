'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Deezersearch Schema
 */
var DeezersearchSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Deezersearch name',
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

mongoose.model('Deezersearch', DeezersearchSchema);