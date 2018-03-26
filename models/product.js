var mongoose = require('mongoose');

var Schema = mongoose.Schema;



var productSchema = new Schema({
	name: {
		type: String
	},
	category: String,
	price: Number,
	brand: String,
	quantity: Number,
	description: String,
	status: {
		type: String,
		ENUM: ["0", "1"],
		default: "0"
	},
	color: String,
	imageName: String,
	tags: [String],
	user: {
		type: Schema.Types.ObjectId,
		ref: "user"
	}
});

var productModel = mongoose.model('Product', productSchema);
module.exports = productModel;