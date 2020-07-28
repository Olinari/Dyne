const mongoose = require('mongoose');
const { Schema } = mongoose;
var mongoosePaginate = require('mongoose-paginate');
var lastModified = require('./plugins/lastModified');

const dishSchema = new Schema({
  dishName: {
    type: String,
    required: true,
    index: true,
  },
  restaurantName: {
    type: String,
    required: true,
    index: true,
  },
  iD: {
    type: Number,
    required: true,
  },
  dyneScore: {
    type: Number,
    required: false,
  },
  slug: {
    type: String,
    required: false,
  },

  restaurant_id: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    require: false,
  },
  wolt: {
    type: String,
    require: false,
  },
  tenbis: {
    type: String,
    require: false,
  },
  mishloha: {
    type: String,
    require: false,
  },

  description: { type: String, index: true },
  price: Schema.Types.Number,
  currency: {
    type: Schema.Types.ObjectId,
    ref: 'Currency',
    require: false,
  },

  images: {
    type: Array,
    required: false,
  },

  createdAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
  modifiedAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

// dishSchema.post('findOne', function(result) {
//   console.log(this instanceof mongoose.Query); // true
//   // prints returned documents
//   console.log('find() returned ' + JSON.stringify(result));
//   // prints number of milliseconds the query took
//   console.log('find() took ' + (Date.now() - this.start) + ' millis');
// });

class DishClass {}
dishSchema.index();

dishSchema.loadClass(DishClass);

dishSchema.plugin(mongoosePaginate);

dishSchema.plugin(lastModified);

const Dish = mongoose.model('Dish', dishSchema);

module.exports = Dish;
