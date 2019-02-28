const express = require('express');
const router = express.Router();
const Cuisine = require('../models/Cuisine');

router.post('/add', async function(req, res) {
  const data = req.body;
  let result = {};
  const obj = {
    name: data.name,
    createdAt: new Date(),
    modifiedAt: new Date(),
  };
  const add = await Cuisine.create(obj);
  if (add) {
    result = {
      status: 'ok',
      info: 'Cuisine is added',
      data: {},
    };
  } else {
    result = {
      status: 'error',
      info: 'Cuisine is not added',
    };
  }
  return res.json(result);
});

router.post('/edit', async function(req, res) {
  const data = req.body;
  let result = {};
  const edit = await Cuisine.findByIdAndUpdate(data.id, {
    name: data.name,
    modifiedAt: new Date(),
  });
  if (edit) {
    result = {
      status: 'ok',
      info: 'Cuisine is edited',
      data: {},
    };
  } else {
    result = {
      status: 'error',
      info: 'Cuisine is not edited',
    };
  }
  return res.json(result);
});

router.delete('/del', async function(req, res) {
  const data = req.body;
  let result = {};
  const del = await Cuisine.findByIdAndDelete(data.id);
  if (del) {
    result = {
      status: 'ok',
      info: 'Cuisine is deleted',
      data: {},
    };
  } else {
    result = {
      status: 'error',
      info: 'Cuisine is not deleted',
    };
  }
  return res.json(result);
});

router.post('/list', async function(req, res) {
  const list = await Cuisine.find({}).select('name');
  return res.json(list);
});

module.exports = router;
