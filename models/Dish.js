const mongoose = require('mongoose');
const { Schema } = mongoose;
var mongoosePaginate = require('mongoose-paginate');
var lastModified = require('./plugins/lastModified');

const dishSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
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
  menuCategories: [
    {
      type: Schema.Types.ObjectId,
      ref: 'MenuCategory',
      require: false,
    },
  ],
  description: String,
  price: Schema.Types.Number,
  currency: {
    type: Schema.Types.ObjectId,
    ref: 'Currency',
    require: false,
  },
  calories: Number,
  popular_name: {
    type: Schema.Types.ObjectId,
    ref: 'PopularDish',
    required: false,
    default: null,
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tag',
      required: false,
    },
  ],
  images: {
    type: Array,
    required: false,
  },

  totalValueForMoneyRatings: {
    type: Number,
    required: false,
  },
  totalTasteRatings: {
    type: Number,
    required: false,
  },
  totalLookAndFeelRatings: {
    type: Number,
    required: false,
  },
  totalRatings: {
    type: Number,
    required: false,
  },
  totalReviews: {
    type: Number,
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

dishSchema.loadClass(DishClass);

dishSchema.plugin(mongoosePaginate);

dishSchema.plugin(lastModified);

const Dish = mongoose.model('Dish', dishSchema);

module.exports = Dish;
