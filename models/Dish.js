const mongoose = require('mongoose');
const _ = require('lodash');
const { Schema } = mongoose;

const dishSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	restaurant_id: {
		type: Schema.Types.ObjectId,
		ref: 'Restaurant',
		require: true
	},
	menus: [{
		type: Schema.Types.ObjectId,
		ref: 'Menu',
		require: true
	}],
	description: String,
	price: Schema.Types.Decimal128,
	currency: {
		type: Schema.Types.ObjectId,
		ref: 'Currency',
		require: true
	},
	calories: Number,
	popular_name: {
		type: Schema.Types.ObjectId,
		ref: 'PopularDish',
		required: true
	},
	vegan: Boolean,
	vegetarian: Boolean,
	gluten_free: Boolean,
	not_hot: Boolean,
	tags: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Tag',
			required: true
		}
	],
	menus: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Menu',
			required: true
		}
	],
	createdAt: {
		type: Date,
		required: true
	},
	modifiedAt: {
		type: Date,
		required: true
	}
});

class DishClass {


}

dishSchema.loadClass(DishClass);

const Dish = mongoose.model('Dish', DishSchema);

module.exports = Dish;