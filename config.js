var os = require('os');
var ifaces = os.networkInterfaces();
var localIPAddress = '';

Object.keys(ifaces).forEach(function(ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function(iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (iface.address.indexOf('192.168') > -1) {
      localIPAddress = iface.address;
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      // console.log(ifname + ':' + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      // console.log(ifname, iface.address);
    }
    ++alias;
  });
});

localIPAddress = localIPAddress || 'localhost';

const configs = function() {
  switch (process.env.NODE_ENV) {
    case 'development':
      return {
        APP_URL: 'http://' + localIPAddress + ':3001',
        API_URL: 'http://' + localIPAddress + ':8282/api',
        API_IMAGE_URL: localIPAddress + ':8282',
        MONGO_HOST: 'localhost',
        MONGO_PORT: '27017',
        MONGO_DB_NAME: 'dishin_live',
      };
    case 'production':
      return {
        APP_URL: 'http://13.58.25.57:3001',
        API_URL: 'http://13.58.25.57:8282/api',
        API_IMAGE_URL: '13.58.25.57:8282',
        MONGO_HOST: 'localhost',
        MONGO_PORT: '28000',
        MONGO_DB_NAME: 'dishin',
      };
    default:
      return {
        APP_URL: 'http://localhost:3001',
        API_URL: 'http://localhost:8282/api',
        API_IMAGE_URL: 'localhost:8282',
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
