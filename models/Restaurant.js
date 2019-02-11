const mongoose = require('mongoose');
const _ = require('lodash');
const { Schema } = mongoose;

const restaurantSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	address: {
		type: String,
		required: true
	},
	country: { type: Schema.Types.ObjectId, ref: 'Country', require: true },
	cuisines: [{ type: Schema.Types.ObjectId, ref: 'Cuisine', required: true }],
	kosher_halal: {
		type: String,
		required: true,
		enum: ['None', 'Kosher', 'Halal']
	},
	createdAt: {
		type: Date,
		required: true
	},
	modifiedAt: {
		type: Date,
		required: true
	}
});

class RestaurantClass {


}

restaurantSchema.loadClass(RestaurantClass);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;