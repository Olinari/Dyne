const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag');

router.post('/add', async function(req, res) {
  const data = req.body;
  let result = {};
  const obj = {
    name: data.name,
    createdAt: new Date(),
    modifiedAt: new Date(),
  };
  const add = await Tag.create(obj);
  if (add) {
    result = {
      status: 'ok',
      info: 'Tag is added',
      data: {},
    };
  } else {
    result = {
      status: 'error',
      info: 'Tag is not added',
    };
  }
  return res.json(result);
});

router.post('/edit', async function(req, res) {
  const data = req.body;
  let result = {};
  const edit = await Tag.findByIdAndUpdate(data.id, { name: data.name, modifiedAt: new Date() });
  if (edit) {
    result = {
      status: 'ok',
      info: 'Tag is edited',
      data: {},
    };
  } else {
    result = {
      status: 'error',
      info: 'Tag is not edited',
    };
  }
  return res.json(result);
});

router.delete('/del', async function(req, res) {
  const data = req.body;
  let result = {};
  const del = await Tag.findByIdAndDelete(data.id);
  if (del) {
    result = {
      status: 'ok',
      info: 'Tag is deleted',
      data: {},
    };
  } else {
    result = {
      status: 'error',
      info: 'Tag is not deleted',
    };
  }
  return res.json(result);
});

router.post('/list', async function(req, res) {
  const list = await Tag.find({}).select('name');
  return res.json(list);
});

module.exports = router;
