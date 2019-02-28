const mongoose = require('mongoose');
const { Schema } = mongoose;

const popularDishesSchema = new Schema({
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

class popularDishesClass {
  static insertPopularDishe(name) {
    return this.create({
      name: name,
      createdAt: new Date(),
      modifiedAt: new Date(),
    });
  }
}

popularDishesSchema.loadClass(popularDishesClass);

const popularDishes = mongoose.model('popularDishes', popularDishesSchema);

module.exports = popularDishes;
