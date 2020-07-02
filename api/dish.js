const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');

const { resultOk, resultError } = require('./helper');

router.post('/', function(req, res, next) {
  const data = req.body;
  const obj = {
    name: data.name,
    /*  restaurant_id: data.restaurant_id,
    menus: data.menus,
    description: data.description,
    price: data.price,
    currency: data.currency,
    calories: data.calories,
    popular_name: data.popular_name,
    tags: data.tags,
    images: data.images, */
  };
  console.log(data.name);
  Dish.find({
    /* 
          restaurant_id: data.restaurant_id,
          menus: { $in: data.menus }, 
          */
    name: data.name,
  })
    .then(dish => {
      if (dish.length === 0) {
        Dish.create(obj)
          .then(dish => {
            res.json(resultOk(dish.toJSON(), 'Dish is added successfully'));
          })
          .catch(err => {
            next(err);
          });
      } else {
        res.json(resultError(null, `Dish already exists with name "${data.name}"`));
      }
    })
    .catch(err => {
      next(err);
    });
});

router.get('/', function(req, res, next) {
  Dish.find({})

    .then(dish => {
      res.json(resultOk(dish));
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
