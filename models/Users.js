const mongoose = require('mongoose');
const _ = require('lodash');
const { Schema } = mongoose;

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'inactive']
  },
  sign_up_from: {
    type: String,
    enum: ['Self', 'Facebook', 'Google', 'Instagram', 'Twitter']
  },
  last_logged_in: {
    type: Date
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

class UsersClass {}

userSchema.loadClass(UsersClass);

const Users = mongoose.model('Users', userSchema);

module.exports = Users;
