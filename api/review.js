const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { authenticateToken } = require('../misc/common');
const { resultOk } = require('./helper');

/*eslint no-dupe-keys: [0]*/
router.get('/', authenticateToken, function(req, res, next) {
  let user = req.decodedToken;
  let userId = user.user_id;
  if (userId) {
    Review.find({ userId })
      .populate({
        path: 'typeId',
        populate: { path: 'restaurant_id', select: 'address' },
        populate: { path: 'images' },
      })
      .then(response => {
        res.json(resultOk(response));
      })
      .catch(err => {
        next(err);
      });
  } else {
    next('Not a valid user');
  }
});
module.exports = router;
