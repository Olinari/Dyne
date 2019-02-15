const express = require('express');
const app = express();

const mongoose = require('mongoose');

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

mongoose.connect('mongodb://localhost:27017/dishin', options);

const bodyParser = require('body-parser');
const Api = require('./api');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// app.use('/api', Api);
Api(app);

const port = 8282;
app.listen(port);

module.exports = app;
