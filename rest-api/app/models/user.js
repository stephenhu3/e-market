var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	token: Number
});

module.exports = mongoose.model('User', UserSchema);
