const mongoose = require('mongoose');
const _ = require('lodash');
const { Schema } = mongoose;

const roleSchema = new Schema({
  name: String,
  createdAt: {
    type: Date,
    required: true
  },
  modifiedAt: {
    type: Date,
    required: true
  }
});

class RolesClass {}

roleSchema.loadClass(RolesClass);

const Roles = mongoose.model('Roles', roleSchema);

module.exports = Roles;
