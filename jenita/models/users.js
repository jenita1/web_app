var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	firstName: String,
	lastName: {
		type: String
	},
	email: {
		type: String,
		unique: true,
		required: true
	},
	phoneNumber: Number,
	activeStatus: {
		type: Boolean,
		default: true
	},
	username: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	}
}, {
	timestamps: true
});

var userModel = mongoose.model('user', userSchema);
module.exports = userModel;