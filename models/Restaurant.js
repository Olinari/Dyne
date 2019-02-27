const mongoose = require('mongoose');
const { Schema } = mongoose;

const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  country: { type: String, require: false },
  cuisines: [{ type: Schema.Types.ObjectId, ref: 'Cuisine', required: true }],
  kosher_halal: {
    type: String,
    required: true,
    enum: ['None', 'Kosher', 'Halal'],
  },
  open_days: [
    {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
  ],
  opening_hours: {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Sunday: [],
  },
  closing_hours: {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Sunday: [],
  },
  loc: {
    type: { type: String },
    coordinates: [],
  },
  createdAt: {
    type: Date,
    required: true,
  },
  modifiedAt: {
    type: Date,
    required: true,
  },
});

restaurantSchema.index({ loc: '2dsphere' });

class RestaurantClass {}

restaurantSchema.loadClass(RestaurantClass);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
