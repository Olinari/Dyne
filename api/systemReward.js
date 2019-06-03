const express = require('express');
const router = express.Router();
const SystemReward = require('../models/SystemReward');
const { resultOk } = require('./helper');

router.get('/', function(req, res, next) {
  let page = req.query.page || 1;
  let limit = req.query.limit || 10;
  SystemReward.paginate({}, { page, limit })
    .then(list => {
      res.json(resultOk(list.docs));
    })
    .catch(err => {
      next(err);
    });
});
module.exports = router;
