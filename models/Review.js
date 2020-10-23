const mongoose = require('mongoose');
const { Schema } = mongoose;
var mongoosePaginate = require('mongoose-paginate');
var lastModified = require('./plugins/lastModified');

const reviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: false, ref: 'User' },

  typeId: {
    type: Schema.Types.ObjectId,
    required: false,
    refPath: 'typeObject',
  },
  dishId: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: 'Dish',
  },
  score: {
    type: Number,
    required: false,
  },
  reviewText: {
    type: String,
    required: false,
  },
  upvotes: {
    type: String,
    required: false,
  },
  totalReviews: {
    type: Number,
    required: false,
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
class ReviewClass {}

reviewSchema.loadClass(ReviewClass);

reviewSchema.plugin(mongoosePaginate);

reviewSchema.plugin(lastModified);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
