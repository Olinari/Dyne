const user = require('./user');
const publicRoute = require('./public');

/*eslint no-unused-vars: 0*/
const handleError = function(err, req, res, next) {
  if (err) {
    //console.log('error', err.message);
    res.json({ status: 'error', data: null, error: err.message });
  }
};

const api = function(server) {
  server.use('/api/user', user, handleError);
  server.use('/api/public', publicRoute, handleError);
};

module.exports = api;
