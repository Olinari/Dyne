const mongoose = require('mongoose');
const { Schema } = mongoose;

const cuisineSchema = new Schema({
  name: String,
  createdAt: {
    type: Date,
    required: true,
  },
  modifiedAt: {
    type: Date,
    required: true,
  },
});

class CuisineClass {}

cuisineSchema.loadClass(CuisineClass);

const Cuisine = mongoose.model('Cuisine', cuisineSchema);

module.exports = Cuisine;
