const user = require('./user');

const handleError = function(err, req, res) {
  if (err) {
    res.json({ status: 'error', data: null, error: err.message });
  }
};

const api = function(server) {
  server.use('/api/user', user, handleError);
};

module.exports = api;
