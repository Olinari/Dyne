const express = require('express');
const router = express.Router();
const Roles = require('../models/Roles');

router.post('/add', async function(req, res) {
  const data = req.body;
  let result = {};
  const obj = {
    name: data.name,
    createdAt: new Date(),
    modifiedAt: new Date(),
  };
  const add = await Roles.create(obj);
  if (add) {
    result = {
      status: 'ok',
      info: 'Role is added',
      data: {},
    };
  } else {
    result = {
      status: 'error',
      info: 'Role not added',
    };
  }
  return res.json(result);
});
router.post('/edit', async function(req, res) {
  const data = req.body;
  let result = {};
  const obj = {
    _id: data.id,
    name: data.name,
    modifiedAt: new Date(),
  };
  const edit = await Roles.findByIdAndUpdate(obj._id, { name: data.name, modifiedAt: new Date() });
  if (edit) {
    result = {
      status: 'ok',
      info: 'Role is edited',
      data: {},
    };
  } else {
    result = {
      status: 'error',
      info: 'Role is not edited',
    };
  }
  return res.json(result);
});
router.post('/del', async function(req, res) {
  const data = req.body;
  let result = {};
  const obj = {
    _id: data.id,
    name: data.name,
    createdAt: new Date(),
    modifiedAt: new Date(),
  };
  const del = await Roles.findByIdAndDelete(obj._id);
  if (del) {
    result = {
      status: 'ok',
      info: 'Role is deleted',
      data: {},
    };
  } else {
    result = {
      status: 'error',
      info: 'Role is not deleted',
    };
  }
  return res.json(result);
});

module.exports = router;
