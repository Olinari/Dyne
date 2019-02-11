const mongoose = require('mongoose');
const _ = require('lodash');
const { Schema } = mongoose;

const popularDishSchema = new Schema({
	name: String,
	createdAt: {
		type: Date,
		required: true
	},
	modifiedAt: {
		type: Date,
		required: true
	}
});

class PopularDishClass {


}

popularDishSchema.loadClass(PopularDishClass);

const PopularDish = mongoose.model('PopularDish', popularDishSchema);

module.exports = PopularDish;