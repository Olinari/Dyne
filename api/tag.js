/*eslint no-unused-vars: [0]*/
const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag');
const Dish = require('../models/Dish');
const RestaurantLocation = require('../models/RestaurantLocation');
const Restaurant = require('../models/Restaurant');
const { resultOk, resultError } = require('./helper');

router.get('/', function(req, res, next) {
  let page = req.query.page || 1;
  let limit = req.query.limit || 10;
  Tag.paginate({}, { page, limit })
    .then(list => {
      const result = resultOk(list.docs);
      res.json(result);
    })
    .catch(err => {
      next(err);
    });
});

const getTmpCount = async function(model, id) {
  return await model.countDocuments({ tags: { $in: id } }).exec();
};

router.get('/with-counts', async function(req, res, next) {
  try {
    let tags = await Tag.find({}).exec();
    let newTags = [];

    for (const index in tags) {
      const tagObj = tags[index].toObject();
      tagObj.restCount = await getTmpCount(RestaurantLocation, tagObj._id);
      tagObj.dishCount = await getTmpCount(Dish, tagObj._id);
      newTags.push(tagObj);
    }
    res.json(resultOk(newTags, ''));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
