const mongoose = require('mongoose');
const { Schema } = mongoose;
var lastModified = require('./plugins/lastModified');

const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: true,
  },
  cuisines: [{ type: Schema.Types.ObjectId, ref: 'Cuisine', required: false }],
  kosher_halal: {
    type: String,
    required: false,
    enum: ['None', 'Kosher', 'Halal'],
  },
  images: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Image',
      require: false,
    },
  ],
  isSponsored: {
    type: Boolean,
    required: false,
    default: false,
  },
  createdAt: {
    type: Date,
    required: false,
    default: new Date(),
  },
  modifiedAt: {
    type: Date,
    required: false,
    default: new Date(),
  },
});

class RestaurantClass {}

restaurantSchema.loadClass(RestaurantClass);
restaurantSchema.plugin(lastModified);
const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
