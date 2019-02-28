const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

router.get('/autocomplete', async function(req, res, next) {
  const name = req.query.name;
  const lat = req.query.lat;
  const lng = req.query.lng;
  let result = {};
  try {
    const regex = new RegExp(name, 'i');
    let response = null;
    // //fix loc
    // const result = await Restaurant.find();
    // result.map(async el => {
    //   await Restaurant.updateOne(
    //     { _id: el._id },
    //     { loc: { type: 'Point', coordinates: [el.loc.coordinates[1], el.loc.coordinates[0]] } });
    // });

    if (lat && lng) {
      const miles = 5 / 3963.2; //searching five miles from the user
      console.log('response', lat, lng);
      response = await Restaurant.find({
        loc: {
          $geoWithin: { $centerSphere: [[lng, lat], miles] },
        },
      })
        .where({ name: { $regex: regex } })
        .select('name address loc');
    } else {
      response = await Restaurant.find({ name: { $regex: regex } }).select('name address loc');
    }
    if (response) {
      result = {
        status: 'ok',
        info: 'matched restaurants',
        data: response,
      };
    } else {
      result = {
        status: 'error',
        error: 'no restaurant found',
        data: null,
      };
    }
    res.json(result);
  } catch (error) {
    console.log('error', error);
    next(error);
  }
});

router.get('/all-restaurants', async function(req, res) {
  const list = await Restaurant.find({});
  let result = {};
  if (list) {
    result = {
      status: 'ok',
      info: 'List of all restaurant',
      data: [],
    };
    list.map(item => {
      let restaurant = {
        id: item.id,
        name: item.name,
        address: item.address,
        country: item.country,
        couisines: item.couisines,
        kosher_halal: item.kosher_halal,
        open_days: item.open_days,
        opening_hours: item.opening_hours,
        closing_hours: item.closing_hours,
        loc: item.loc,
      };
      result.data.push(restaurant);
    });
  } else {
    result = {
      status: 'error',
      info: 'Restaurant not found',
      data: [],
    };
  }
  return res.json(result);
});

router.get('/restaurant-by-id', async function(req, res) {
  const list = await Restaurant.find({});
  let result = {};
  if (list) {
    result = {
      status: 'ok',
      info: 'List of all restaurant',
      data: [],
    };
    list.map(item => {
      let restaurant = {
        id: item.id,
        name: item.name,
        address: item.address,
        country: item.country,
        couisines: item.couisines,
        kosher_halal: item.kosher_halal,
        open_days: item.open_days,
        opening_hours: item.opening_hours,
        closing_hours: item.closing_hours,
        loc: item.loc,
      };
      result.data.push(restaurant);
    });
  } else {
    result = {
      status: 'error',
      info: 'Restaurant not found',
      data: [],
    };
  }
  return res.json(result);
});

module.exports = router;
