const express = require('express');
const router = express.Router();
const Currency = require('../models/Currency');

router.post('/add', async function(req, res) {
  const data = req.body;
  let result = {};
  const obj = {
    code: data.code,
    name: data.name,
    createdAt: new Date(),
    modifiedAt: new Date(),
  };
  const len_code = obj.code.length;
  if (len_code == 3) {
    var add = await Currency.create(obj);
  }
  if (add) {
    result = {
      status: 'ok',
      info: 'Currency is added',
      data: {},
    };
  } else {
    result = {
      status: 'error',
      info: 'Currency is not added',
    };
  }
  return res.json(result);
});

router.post('/edit', async function(req, res) {
  const data = req.body;
  let result = {};
  const edit = await Currency.findByIdAndUpdate(data.id, {
    code: data.code,
    name: data.name,
    modifiedAt: new Date(),
  });
  if (edit) {
    result = {
      status: 'ok',
      info: 'Currency is edited',
      data: {},
    };
  } else {
    result = {
      status: 'error',
      info: 'Currency is not edited',
    };
  }
  return res.json(result);
});

router.delete('/del', async function(req, res) {
  const data = req.body;
  let result = {};
  const del = await Currency.findByIdAndDelete(data.id);
  if (del) {
    result = {
      status: 'ok',
      info: 'Currency is deleted',
      data: {},
    };
  } else {
    result = {
      status: 'error',
      info: 'Currency is not deleted',
    };
  }
  return res.json(result);
});

router.post('/list', async function(req, res) {
  const list = await Currency.find({})
    .select('name')
    .select('code');
  return res.json(list);
});

module.exports = router;
