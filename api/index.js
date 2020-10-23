const user = require('./user');
const publicRoute = require('./public');
const restaurant = require('./restaurant');
const role = require('./role');
const tag = require('./tag');
const review = require('./review');
const dish = require('./dish');
const search = require('./search');
const systemReward = require('./systemReward');

//const whitelist = ['http://localhost:3001/'];

// const corsOptionsDelegate = function(req, callback) {
//   let corsOptions;
//   console.log('whitelist', whitelist);
//   if (whitelist.indexOf(req.header('Origin')) !== -1) {
//     corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
//   } else {
//     corsOptions = { origin: false }; // disable CORS for this request
//   }
//   callback(null, corsOptions); // callback expects two parameters: error and options
// };

/*eslint no-unused-vars: 0*/
const handleError = function(err, req, res, next) {
  if (err) {
    console.log('error', err.message);
    res.json({ status: 'error', data: null, error: err.message });
  }
};

const api = function(server) {
  server.use('/api/users', user, handleError);
  server.use('/api/public', publicRoute, handleError);
  server.use('/api/restaurants', restaurant, handleError);
  server.use('/api/roles', role, handleError);
  server.use('/api/tags', tag, handleError);
  server.use('/api/dishes', dish, handleError);
  server.use('/api/systemRewards', systemReward, handleError);
  server.use('/api/search', search, handleError);
  server.use('/api/review', review, handleError);
};

module.exports = api;
