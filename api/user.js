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
  const providerId = userData.providerId || +new Date();
  const roleName = userData.role || 'Regular User';
  const socialMeta = userData.socialMeta || '';
  let validateUserCondition = { email: email };
  let user = await Users.findOne(validateUserCondition);
  if (!user) {
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
  } else if (suppressAlreadyExists) {
    throw new Error('User Already Exists');
  } else {
    if (signUpFrom != 'Self' && signUpFrom != user.sign_up_from) {
      await Users.updateOne(
        { email: email },
        {
          sign_up_from: signUpFrom,
          provider_id: providerId,
          social_meta: socialMeta,
          modifiedAt: new Date(),
        }
      );
      user = await Users.findOne({ email: email });
    }
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
      throw new Error('Invalid email or password!');
    }
  } else {
    throw new Error('Invalid email or password!');
  }
};

const sendVerifyEmail = async function(req, userId, email, name = null) {
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
    const replacements = {
      emailHeading: 'Welcome to Dishin',
      headingDesc: 'Just one more step..',
      name: name,
      bodyFirstPrah: ' before you go out and eat something new, please verify your email address.',
      bodySecondPrah:
        'If you did not create a Dishin account using this address, please contact us at support@dishin.com.',
      buttonHref: 'http://' + req.headers.host + '/api/public/verify-email/' + verifyEmailToken,
      buttonText: 'Verify your account',
      verifyText: 'Or verify using link:',
      verifyHref: 'http://' + req.headers.host + '/api/public/verify-email/' + verifyEmailToken,
      verifyLinkText: 'http://' + req.headers.host + '/api/public/verify-email/' + verifyEmailToken,
    };
    const emailSend = await Email.sendEmail(from, to, subject, replacements, null);
    console.log('email send', emailSend);
    return true;
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
    let emailError = await Common.emailValidate(userData.email);
    let passwordError = await Common.checkPassword(userData.password, userData.confirmPassword);
    if (!emailError && !passwordError) {
      let user = await registerNewUser(userData, true);
      if (user) {
        await Users.updateOne({ _id: user._id }, { last_logged_in: new Date() });
        let token = jwt.genJWTToken(user);
        await sendVerifyEmail(req, user._id, user.email, user.firstName);
        result = {
          status: 'ok',
          info: 'User successfully created!',
          data: {
            token: token,
          },
        };
      } else {
        result = { status: 'error', data: null, info: 'User not created!' };
      }
      return res.json(result);
    } else {
      result = { status: 'error', data: null, info: 'Invalid email or password!' };
    }
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

router.post('/social-sign-in', async function(req, res, next) {
  const userData = req.body;
  let result = {};
  try {
    let emailError = await Common.emailValidate(userData.email);
    if (!emailError) {
      let user = await registerNewUser(userData, false);
      if (user) {
        let token = await jwt.genJWTToken(user);
        if (user.createdAt - user.modifiedAt === 0) {
          await sendVerifyEmail(req, user._id, user.email, user.first_name);
        }
        result = {
          status: 'ok',
          info: 'Logged in successfully!',
          data: {
            token: token,
          },
        };
        await Users.updateOne({ _id: user._id }, { last_logged_in: new Date() });
        return res.json(result);
      } else {
        result = { status: 'error', data: null, info: 'User not created!' };
      }
    } else {
      result = { status: 'error', data: null, info: 'Invalid email or password!' };
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
      const replacements = {
        emailHeading: 'Forgot your password',
        headingDesc: '',
        name: user.firstName,
        bodyFirstPrah: ' we got a request to reset your Dishin password.',
        bodySecondPrah: '',
        buttonHref: 'https://demo.local/reset-password?token=' + resetPasswordToken,
        buttonText: 'Reset your password',
        verifyText: '',
        verifyHref: '',
        verifyLinkText: '',
        forgotPasswordDesc: `If you ignore this message, your password won't be changed, if your don't request a password reset.tellus`,
      };
      const emailSend = await Email.sendEmail(from, to, subject, replacements);
      console.log('email send', emailSend);
      if (emailSend) {
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
