const mongoose = require('mongoose');
const { Schema } = mongoose;

const userTokensSchema = new Schema({
  user_id: { type: String, required: true },
  token_type: { type: String, enum: ['login-token', 'reset-token'] },
  token: { type: String, required: true },
  expire_date: { type: Date, required: true },
  createdAt: {
    type: Date,
    required: true,
  },
  modifiedAt: {
    type: Date,
    required: true,
  },
});

class userTokensClass {
  static insertToken(userId, tokenType, token, expDate) {
    return this.create({
      user_id: userId,
      token_type: tokenType,
      token: token,
      expire_date: expDate,
      createdAt: new Date(),
      modifiedAt: new Date(),
    });
  }
}

userTokensSchema.loadClass(userTokensClass);

const userTokens = mongoose.model('userTokens', userTokensSchema);

module.exports = userTokens;
