const express = require('express');
const router = express.Router();
const PopularDishes = require('../models/PopularDishes');

router.post('/add', async function(req, res) {
  const data = req.body;
  let result = {};
  const add = await PopularDishes.insertPopularDishe(data.name);
  console.log('add popular dishes', add);
  if (add) {
    result = {
      status: 'ok',
      info: 'PopularDishes is added',
      data: {},
    };
  } else {
    result = {
      status: 'error',
      info: 'PopularDishes is not added',
    };
  }
  return res.json(result);
});

router.post('/edit', async function(req, res) {
  const data = req.body;
  let result = {};
  const edit = await PopularDishes.findByIdAndUpdate(data.id, {
    name: data.name,
    modifiedAt: new Date(),
  });
  if (edit) {
    result = {
      status: 'ok',
      info: 'PopularDishes is edited',
      data: {},
    };
  } else {
    result = {
      status: 'error',
      info: 'PopularDishes is not edited',
    };
  }
  return res.json(result);
});

router.delete('/del', async function(req, res) {
  const data = req.body;
  let result = {};
  const del = await PopularDishes.findByIdAndDelete(data.id);
  if (del) {
    result = {
      status: 'ok',
      info: 'PopularDishes is deleted',
      data: {},
    };
  } else {
    result = {
      status: 'error',
      info: 'PopularDishes is not deleted',
    };
  }
  return res.json(result);
});

router.post('/list', async function(req, res) {
  const list = await PopularDishes.find({}).select('name');
  return res.json(list);
});

module.exports = router;
