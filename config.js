const configs = function() {
  console.log('EENNVV()' + process.env.NODE_ENV);
  switch (process.env.NODE_ENV) {
    case 'development':
      return {
        APP_URL: 'http://localhost:3001',
        API_URL: 'http://localhost:8282/api',
        API_IMAGE_URL: 'http://localhost:8282',
        MONGO_HOST: 'localhost',
        MONGO_PORT: '27017',
        MONGO_DB_NAME: 'dishin_live',
      };

    /*    case 'production':
      return {
        APP_URL: 'http://dyne.menu',
        API_URL: 'http://backend.dyne.menu/api',
        API_IMAGE_URL: 'http://backend.dyne.menu',
        MONGO_HOST: 'localhost',
        MONGO_PORT: '28000',
        MONGO_DB_NAME: 'dishin',
      }; */

    default:
      return {
        APP_URL: 'http://ec2-13-58-25-57.us-east-2.compute.amazonaws.com',
        API_URL: 'http://api.ec2-13-58-25-57.us-east-2.compute.amazonaws.com/api',
        API_IMAGE_URL: 'http://api.ec2-13-58-25-57.us-east-2.compute.amazonaws.com',
        mongoURI:
          'mongodb+srv://dyne-admin:dadada123@dyne-0vicw.mongodb.net/dyne?retryWrites=true&w=majority',
        MONGO_HOST: 'localhost',
        MONGO_PORT: '27017',
        MONGO_DB_NAME: 'dyne_live',
      };
  }
};
const priceRanges = [
  { value: '30-50', unit: '$' },
  { value: '51-70', unit: '$' },
  { value: '71-100', unit: '$' },
  { value: '>100', unit: '$' },
];
const distanceToMe = [
  { value: '0-5', unit: 'km' },
  { value: '5-15', unit: 'km' },
  { value: '20-30', unit: 'min' },
  { value: '31-60', unit: 'min' },
  { value: '>1', unit: 'hour' },
];

const emailSetting = {
  smtpUser: 'dyne4test@gmail.com', //TODO: update smtp user
  smtpPassword: 'strongpassword', // TODO: update smtp password
  emailAddress: 'dyne4test@gmail.com', //TODO: from email address to send emails
};

const settings = {
  ...configs(),
  priceRanges,
  distanceToMe,
  emailSetting,
};

module.exports = settings;
