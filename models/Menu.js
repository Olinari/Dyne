const mongoose = require('mongoose');
const _ = require('lodash');
const { Schema } = mongoose;

const menuSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	restaurant_id: {
		type: Schema.Types.ObjectId,
		ref: 'Restaurant',
		require: true
	},
	open_days: [
		{
			type: String,
			enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
		}
	],
	opening_hours: {
		Monday: String,
		Tuesday: String,
		Wednesday: String,
		Thursday: String,
		Friday: String,
		Sunday: String
	},
	closing_hours: {
		Monday: String,
		Tuesday: String,
		Wednesday: String,
		Thursday: String,
		Friday: String,
		Sunday: String
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

class MenuClass {


}

menuSchema.loadClass(MenuClass);

const Menu = mongoose.model('Menu', MenuSchema);

module.exports = Menu;