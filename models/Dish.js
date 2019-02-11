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
		type: String,
		enum: ['ILS', 'USD', 'EUR', 'GBP']
	},
	calories: Number,
	popular_name: {
		type: String,
		enum: [
			'Not Relevant',
			'Pizza',
			'Hamburger',
			'Noodles',
			'Sushi',
			'Dessert',
			'Pasta',
			'Fish',
			'Seafood',
			'Steak',
			'Sandwich',
			'Salad'
		]
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