const mongoose = require('mongoose');
//const _ = require('lodash');
const { Schema } = mongoose;

const userSchema = new Schema({
  first_name: {
    type: String,
    required: false,
  },
  last_name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'inactive'],
  },
  sign_up_from: {
    type: String,
    enum: ['Self', 'Facebook', 'Google', 'Instagram', 'Twitter'],
  },
  last_logged_in: {
    type: Date,
  },
  provider_id: {
    type: String,
    required: false,
  },
  social_meta: {
    type: Map,
    of: String,
    required: false,
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

class UsersClass {
  static async signUp(
    firstName,
    lastName,
    email,
    password,
    role,
    status,
    signUpFrom,
    providerId = null,
    socialMeta = null
  ) {
    return await this.create({
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      role: role,
      status: status,
      sign_up_from: signUpFrom,
      last_logged_in: '',
      provider_id: providerId,
      social_meta: socialMeta,
      createdAt: new Date(),
      modifiedAt: new Date(),
    });
  }
}

userSchema.loadClass(UsersClass);

const Users = mongoose.model('Users', userSchema);

module.exports = Users;
