const express = require('express');
const router = express.Router();
const UserTokens = require('../models/UserTokens');
const Users = require('../models/Users');
const Common = require('../misc/common');

const resetUserPassword = async function(data, userId) {
  let password = await Common.hashPassword(data.password);
  let passwordError = await Common.checkPassword(data.password, data.confirmPassword);
  console.log('user id', userId);
  if (!passwordError) {
    let user = await Users.updateOne({ _id: userId }, { password: password });
    console.log('reset user', user);
    if (user) {
      return user;
    } else {
      throw new Error('Password not updated');
    }
  } else {
    throw new Error(passwordError);
  }
};

router.get('/verify-email/:token', async function(req, res, next) {
  const token = req.params.token;
  console.log('token ', token);
  let result = {};
  try {
    let checkValidToken = await UserTokens.findOne({
      token: token,
    });
    if (checkValidToken) {
      let userStatusUpdate = await Users.updateOne(
        { _id: checkValidToken.user_id },
        { status: 'active' }
      );
      if (userStatusUpdate) {
        await UserTokens.deleteOne({ _id: checkValidToken._id });
        result = {
          status: 'ok',
          info: `Success! Your Status updated.`,
          data: {},
        };
      } else {
        result = {
          status: 'error',
          error: 'Status updating process failed.',
        };
      }
    } else {
      result = {
        status: 'error',
        error: 'Token did not matched.',
      };
    }
    return res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/reset-password/:userToken', async function(req, res, next) {
  let token = req.params.userToken;
  let result = {};
  try {
    let checkValidToken = await UserTokens.findOne({
      token: token,
      expire_date: { $gt: Date.now() },
    });
    console.log('valid token', checkValidToken);
    if (checkValidToken) {
      let resetUser = await resetUserPassword(req.body, checkValidToken.user_id);
      if (resetUser) {
        await UserTokens.deleteOne({ _id: checkValidToken._id });
        result = {
          status: 'ok',
          info: 'Success! Your password has been changed.',
          data: {},
        };
      } else {
        result = {
          status: 'error',
          error: 'Password updating failed.',
        };
      }
    } else {
      result = {
        status: 'error',
        error: 'Password reset token is invalid or has expired.',
      };
    }
    return res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
