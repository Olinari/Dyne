const mongoose = require('mongoose');
const { Schema } = mongoose;

const currencySchema = new Schema({
  code: String,
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

class CurrencyClass {}

currencySchema.loadClass(CurrencyClass);

const Currency = mongoose.model('Currency', currencySchema);

module.exports = Currency;
