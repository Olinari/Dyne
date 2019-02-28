const configs = function() {
  console.log('env', process.env.NODE_ENV);
  switch (process.env.NODE_ENV) {
    case 'development':
      return {
        APP_URL: 'https://demo.local',
        API_URL: 'http://localhost:8282/api',
      };

    case 'production':
      return {
        APP_URL: 'https://dishin.mindzhub.com',
        API_URL: 'https://dishinapi.mindzhub.com/api',
      };

    default:
      return {
        APP_URL: 'http://localhost:3001',
        API_URL: 'http://localhost:8282/api',
      };
  }
};
module.exports = configs();
