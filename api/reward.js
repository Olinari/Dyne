const express = require('express');
const router = express.Router();
const Reward = require('../models/Reward');
const { resultOk } = require('./helper');

router.get('/', function(req, res, next) {
  let page = req.query.page || 1;
  let limit = req.query.limit || 10;
  Reward.paginate({}, { page, limit })
    .then(list => {
      res.json(resultOk(list.docs));
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
