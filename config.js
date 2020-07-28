const configs = function() {
  switch (process.env.NODE_ENV) {
    case 'development':
      return {
        APP_URL: 'http://dyne.menu',
        API_URL: 'http://backend.dyne.menu/api',
        API_IMAGE_URL: 'http://backend.dyne.menu',
        MONGO_HOST: 'localhost',
        MONGO_PORT: '27017',
        MONGO_DB_NAME: 'dishin_live',
      };

    case 'production':
      return {
        APP_URL: 'http://dyne.menu',
        API_URL: 'http://backend.dyne.menu/api',
        API_IMAGE_URL: 'http://backend.dyne.menu',
        MONGO_HOST: 'localhost',
        MONGO_PORT: '28000',
        MONGO_DB_NAME: 'dishin',
      };

    default:
      return {
        APP_URL: 'http://localhost:3001',
        API_URL: 'http://localhost:8282/api',
        API_IMAGE_URL: 'http://localhost:8282',
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
  smtpUser: '', //TODO: update smtp user
  smtpPassword: '', // TODO: update smtp password
  emailAddress: '', //TODO: from email address to send emails
};

const settings = {
  ...configs(),
  priceRanges,
  distanceToMe,
  emailSetting,
};

module.exports = settings;
