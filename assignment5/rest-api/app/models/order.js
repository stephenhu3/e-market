var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
	// store JSON string of the user's cart object
	cart: String,
	// total price of order
    total: String
});

module.exports = mongoose.model('Order', OrderSchema);