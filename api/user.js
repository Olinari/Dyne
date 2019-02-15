const express = require('express');
const router = express.Router();
const jwt = require('./jwt_token');
const Users = require('../models/Users');
const Roles = require('../models/Roles');
const UserTokens = require('../models/UserTokens');
const Common = require('./common');

const signUpNewUser = async function(userData, suppressAlreadyExists = false) {
  //console.log('user data', userData);
  const firstName = userData.firstName;
  const lastName = userData.lastName;
  const email = userData.email;
  const password = await Common.hashPassword(userData.password);
  const status = userData.status || 'pending';
  const signUpFrom = userData.signUpWith || 'Self';
  const providerId = userData.providerId || '';
  const roleName = userData.role || 'Regular User';
  let user = await Users.findOne({ email: email }, '_id');
  let passwordError = await checkPassword(userData.password, userData.confirmPassword);
  console.log('user already', user);
  if (!user) {
    if (!passwordError) {
      const role = await Roles.findOne({ name: roleName }, '_id');
      user = await Users.signUp(
        firstName,
        lastName,
        email,
        password,
        role._id,
        status,
        signUpFrom,
        providerId
      );
    } else {
      throw new Error(passwordError);
    }
  } else if (!suppressAlreadyExists) {
    throw new Error('User Already Exists');
  }

  return user;
};

const signInUser = async function(userData) {
  const email = userData.email;
  const password = userData.password;
  const validUser = await Users.findOne({ email: email });
  if (validUser) {
    const checkPassword = await Common.comparePassword(password, validUser.password);
    if (checkPassword) {
      await Users.updateOne({ _id: validUser._id }, { last_logged_in: new Date() });
      return validUser;
    } else {
      throw new Error('Password not matched');
    }
  } else {
    throw new Error('Incorrect email address');
  }
};

const checkPassword = async function(password, confirmPassword) {
  let passwordError = null;
  if (password != confirmPassword) {
    passwordError = 'Password and Confirm password must be the same';
  } else if (password.length < 7) {
    passwordError = 'Password must be 8 character long';
  }
  return passwordError;
};

// const sendVerifyEmail = async function(email) {
//   console.log('Welcome ', email);
// };

const getUsers = async function() {
  return await Users.find();
};

const resetUserPassword = async function(data, userId) {
  let password = await Common.hashPassword(data.password);
  let passwordError = await checkPassword(data.password, data.confirmPassword);
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

router.post('/sign-up', async function(req, res, next) {
  const userData = req.body;
  let result = {};
  try {
    let user = await signUpNewUser(userData);
    if (user) {
      await Users.updateOne({ _id: user._id }, { last_logged_in: new Date() });
      user.roleName = userData.role || 'Regular User';
      let token = jwt.genJWTToken(user);
      let tokenExpires = Date.now() + 24 * 3600000;
      //let updatedStatus = await sendVerifyEmail(user.email);
      result = {
        status: 'ok',
        info: 'User successfully created!',
        data: {
          token: token,
        },
      };
      await UserTokens.insertToken(user._id, 'login-token', token, tokenExpires);
    } else {
      result = { status: 'error', data: null, info: 'User not created!' };
    }
    return res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/sign-in', async function(req, res, next) {
  const userData = req.body;
  let result = {};
  try {
    const user = await signInUser(userData);
    if (user) {
      const roleName = await Roles.findOne({ _id: user.role }, 'name');
      user.roleName = roleName.name;
      let token = jwt.genJWTToken(user);
      let tokenExpires = Date.now() + 24 * 3600000;
      result = {
        status: 'ok',
        info: 'Logged in successfully!',
        data: {
          token: token,
        },
      };
      await UserTokens.insertToken(user._id, 'login-token', token, tokenExpires);
    } else {
      result = {
        status: 'error',
        error: 'Invalid email or password!',
      };
    }
    return res.json(result);
  } catch (error) {
    next(error);
  }
});
// router.post('/social-sign-up', function(req, res) {
//   const userData = req.body;
//   let result = {};
//   try {
//     userData.password = +new Date(); //random password for social login
//     let user = signUpNewUser(userData, true);
//     if (user) {
//     }
//     return res.json(result);
//   } catch (err) {
//     next(err);
//   }
// });

router.get('/get-all-users', async function(req, res, next) {
  let users = null;
  let result = {};
  try {
    users = await getUsers();
    result = {
      status: 'ok',
      info: 'Available users',
      data: {
        users: users,
      },
    };
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/forget-password', async function(req, res, next) {
  let data = req.body;
  let result = {};
  let user = null;
  try {
    user = await Users.findOne({ email: data.email });
    if (user) {
      let resetPasswordToken = await Common.hashPassword(data.email);
      let resetPasswordExpires = Date.now() + 3600000;
      await UserTokens.insertToken(
        user._id,
        'reset-token',
        resetPasswordToken,
        resetPasswordExpires
      );
      result = {
        status: 'ok',
        info: 'reset password link',
        data: {
          link: 'http://' + req.headers.host + '/api/user/reset-password/' + resetPasswordToken,
        },
      };
    } else {
      result = {
        status: 'error',
        error: 'Email not found!',
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
    res.json(result);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
