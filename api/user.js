const express = require('express');
const router = express.Router();
const jwt = require('../misc/jwt_token');
const Users = require('../models/Users');
const Roles = require('../models/Roles');
const UserTokens = require('../models/UserTokens');
const Common = require('../misc/common');
const Email = require('../misc/email');

const registerNewUser = async function(userData, suppressAlreadyExists = false) {
  const firstName = userData.firstName;
  const lastName = userData.lastName;
  const email = userData.email;
  const password = await Common.hashPassword(userData.password);
  const status = userData.status || 'pending';
  const signUpFrom = userData.signUpWith || 'Self';
  const providerId = userData.providerId || '';
  const roleName = userData.role || 'Regular User';
  const socialMeta = userData.socialMeta || '';
  let user = await Users.findOne({ email: email });
  let passwordError = await Common.checkPassword(userData.password, userData.confirmPassword);
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
        providerId,
        socialMeta
      );
    } else {
      throw new Error(passwordError);
    }
  } else if (suppressAlreadyExists) {
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

const sendVerifyEmail = async function(req, userId, email) {
  let verifyEmailToken = await Common.hashPassword(email);
  let verifyEmailTokenExpire = new Date().setFullYear(new Date().getFullYear() + 1);
  let tokenInsert = await UserTokens.insertToken(
    userId,
    'verify-email-token',
    verifyEmailToken,
    verifyEmailTokenExpire
  );
  if (tokenInsert) {
    const from = 'piyush.sharma@mind2minds.com';
    const to = email;
    const subject = 'Testing verify sing-up';
    const text =
      'Please click on the following link, or paste this into your browser to verify your email:\n\n' +
      'http://' +
      req.headers.host +
      '/api/public/verify-email/' +
      verifyEmailToken +
      '\n\n';
    const emailSend = await Email.sendEmail(from, to, subject, text, null);
    if (emailSend.messageId) {
      return emailSend;
    } else {
      throw new Error('Sending email Failed');
    }
  } else {
    throw new Error('Saving token to db failed');
  }
};

const getUsers = async function() {
  return await Users.find();
};

router.post('/sign-up', async function(req, res, next) {
  const userData = req.body;
  let result = {};
  try {
    let user = await registerNewUser(userData, true);
    if (user) {
      await Users.updateOne({ _id: user._id }, { last_logged_in: new Date() });
      user.roleName = userData.role || 'Regular User';
      let token = jwt.genJWTToken(user);
      let tokenExpires = Date.now() + 24 * 3600000;
      await sendVerifyEmail(req, user._id, user.email);
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
    //console.log('sing up result', result);
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

router.post('/social-sign-up', async function(req, res, next) {
  const userData = req.body;
  let result = {};
  let tokenExpires = Date.now() + 24 * 3600000;
  try {
    let user = await registerNewUser(userData, false);
    console.log('return user', user);
    if (user) {
      console.log('added user', user);
      if (!user.roleName) {
        const roleName = await Roles.findOne({ _id: user.role });
        user.roleName = roleName.name;
      }
      let token = await jwt.genJWTToken(user);
      //        await sendVerifyEmail(req, user._id, user.email);
      result = {
        status: 'ok',
        info: 'Logged in successfully!',
        data: {
          token: token,
        },
      };
      await UserTokens.insertToken(user._id, 'login-token', token, tokenExpires);
      await Users.updateOne({ _id: user._id }, { last_logged_in: new Date() });
      return res.json(result);
    } else {
      result = { status: 'error', data: null, info: 'User not created!' };
    }
  } catch (err) {
    next(err);
  }
});

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
      const from = 'piyush.sharma@mind2minds.com';
      const to = data.email;
      const subject = 'Testing reset password';
      const text =
        'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' +
        req.headers.host +
        '/api/public/reset-password/' +
        resetPasswordToken +
        '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n';
      const emailSend = await Email.sendEmail(from, to, subject, text, null);
      if (emailSend.messageId) {
        result = {
          status: 'ok',
          info: `To reset password a link is send to your email ${to} `,
          data: {},
        };
      }
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

module.exports = router;
