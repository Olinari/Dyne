const express = require('express');

const router = express.Router();
const Dish = require('../models/Dish');

const { resultOk } = require('./helper');

router.get('/:searchTerm', function(req, res, next) {
  console.log(req.params.searchTermd);
  Dish.find({ $text: { $search: req.params.searchTerm } });

  Dish.find({
    $or: [
      { dishName: { $regex: req.params.searchTerm, $options: 'i' } },
      { restaurantName: { $regex: req.params.searchTerm, $options: 'i' } },
      { description: { $regex: req.params.searchTerm, $options: 'i' } },
    ],
  })
    .then(dish => {
      res.json(resultOk(dish));
    })
    .catch(err => {
      next(err);
      console.log(err);
    });
});

module.exports = router;
