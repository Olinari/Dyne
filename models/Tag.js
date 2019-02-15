const mongoose = require('mongoose');
const { Schema } = mongoose;

const tagSchema = new Schema({
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

class TagClass {}

tagSchema.loadClass(TagClass);

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
