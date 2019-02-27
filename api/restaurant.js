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
    next(error);
  }
});

module.exports = router;
