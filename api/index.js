const user = require('./user');
const publicRoute = require('./public');

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
    //console.log('error', err.message);
    res.json({ status: 'error', data: null, error: err.message });
  }
};

const api = function(server) {
  server.use('/api/users', user, handleError);
  server.use('/api/public', publicRoute, handleError);
};

module.exports = api;
