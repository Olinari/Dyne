const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
};
mongoose.connect('mongodb://127.0.0.1:27017/dishin', options);
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const Users = require('./models/Users');
const bodyParser = require('body-parser');
const Roles = require('./models/Roles');
// in this function check all request is with jwt token
function checkLoginToken(req, res, next) {
  //check jwt token in header if not set give error
  const ignoreRoutes = ['/user/login', '/user/signup'];
  if (!ignoreRoutes.includes(req.path)) {
    let token = req.method === 'POST' ? req.body.token : req.query.token;
    verifyJWTToken(token)
      .then(decodedToken => {
        // db.LogoutTokens.findOne({
        //   where: { token: token }
        // })
        //   .then(token => {
        //     if (token) {
        //       res.status(400).json({ message: 'Invalid auth token provided.' });
        //     } else {
        //       req.user = decodedToken;
        //       next();
        //     }
        //   })
        //   .catch(err => {
        //     res.status(400).json({ message: err });
        //   });
      })
      .catch(() => {
        res.status(400).json({ message: 'Invalid auth token provided.' });
      });
  } else {
    next();
  }
}

router.post('/user/login', async function(req, res) {
  // let demo user path
  let result = {};
  let userData = req.body;
  let response = await db.User.findOne({
    where: { username: userData.username, password: md5(userData.password) }
  })
    .then(user => {
      if (!user) {
        return { user: null, error: 'Invalid username or password' };
      } else {
        db.User.update(
          {
            lastLogin: new Date()
          },
          {
            where: { id: user.id }
          }
        )
          .then(User => {
            User.get({
              plain: true
            });
            return { fieldUpdate: true, error: null };
          })
          .catch(err => {
            return { fieldUpdate: false, error: err };
          });
      }
      return { user: user, error: null };
    })
    .catch(err => {
      return { user: null, error: err };
    });
  if (!response.error) {
    result.status = 'ok';
    result.token = genJWTToken(response.user);
  } else {
    result.status = 'error';
    result.token = '';
    result.error = response.error;
  }
  res.json(result);
});

router.post('/user/signup', async function(req, res) {
  // let demo user path
  let userData = req.body;
  let result = {};
  let alreadyUser = null;
  await Users.findOne({ email: userData.email }, '_id', function(err, user) {
    if (err || user) {
      alreadyUser = { id: user._id, error: err };
    } else {
      alreadyUser = { user: null, error: null };
    }
  });
  if (!alreadyUser.err && !alreadyUser.id) {
    let role = await Roles.findOne({ name: 'Regular User' }, '_id');
    console.log('new', role);
    let tempUserData = {
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      password: md5(userData.password),
      role: role._id,
      status: 'active',
      sign_up_from: userData.signUpWith,
      last_logged_in: '',
      createdAt: new Date(),
      modifiedAt: new Date()
    };
    Users.create(tempUserData, function(err, user) {
      if (err) {
        console.log(err);
      } else {
        result.status = 'OK';
        result.token = genJWTToken(user);
      }
    });
  }
  res.json(result);
});

router.get('/user/logout', async function(req, res) {
  let LogoutToken = req.query.token;
  let result = {};
  let response = await db.LogoutTokens.findOne({
    where: { token: LogoutToken }
  })
    .then(token => {
      return { token: token, error: null };
    })
    .catch(err => {
      return { token: null, error: err };
    });
  if (!response.error) {
    if (!response.token) {
      response = await db.LogoutTokens.create(
        {
          token: LogoutToken
        },
        {
          fields: ['token', 'email']
        }
      )
        .then(() => {
          return { createdToken: true, error: null };
        })
        .catch(err => {
          return { createdToken: false, error: err };
        });
      if (!response.error) {
        result.status = 'ok';
        result.token = null;
      } else {
        result.status = 'error';
        result.token = LogoutToken;
        result.error = response.error;
      }
    } else {
      result.status = 'ok';
      result.token = null;
    }
  } else {
    result.status = 'error';
    result.token = LogoutToken;
    result.error = response.error;
  }
  res.json(result);
});

function genJWTToken(user) {
  let payload = {
    iss: 'dishin',
    sub: user._id,
    user_id: user._id,
    role: user.role,
    email: user.email,
    exp: new Date().getTime() + 31536000
  };
  let token = jwt.sign(payload, '--Dishin--');
  return token;
}

function verifyJWTToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, '--Dishin--', (err, decodedToken) => {
      if (err || !decodedToken) {
        return reject(err);
      }
      resolve(decodedToken);
    });
  });
}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use('/api', router);

const port = 8282;
app.listen(port);

module.exports = app;
