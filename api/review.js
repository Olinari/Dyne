const express = require('express');
const router = express.Router();
const { resultOk, resultError } = require('./helper');
const Review = require('../models/Review');

/*eslint no-dupe-keys: [0]*/

router.post('/', function(req, res, next) {
  const info = req.body.review;

  const data = {
    userId: info.userId,
    dishId: info.dishId,
    reviewText: info.reviewText,
    score: info.score,
  };

  Review.find(data)
    .then(() => {
      console.log(data, 'data');
      if (data.length != 0) {
        Review.create(data)
          .then(data => {
            console.log(data);
            res.json(resultOk(data.toJSON(), 'request is added successfully'));
          })
          .catch(err => {
            next(err);
          });
      } else {
        res.json(resultError(null, `error`));
      }
    })
    .catch(err => {
      next(err);
    });
});

/* router.get('/', authenticateToken, function(req, res, next) {
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
}); */
module.exports = router;
