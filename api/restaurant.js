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
    if (lat && lng) {
      response = await Restaurant.find({ name: { $regex: regex } })
        .select('name address')
        .where('loc')
        .within({ center: [lat, lng], radius: 10, unique: true, spherical: true });
    } else {
      response = await Restaurant.find({ name: { $regex: regex } }).select('name address');
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
    next(error);
  }
});

module.exports = router;
