var BrewUI = require('brew-ui');
var config = {};

config.env = process.env.NODE_ENV;
config.port =  process.env.PORT || 3000;
config.clientDir = process.env.CLIENT_DIR || BrewUI.getStaticPath();
config.mongo = {
  connect: process.env.MONGODB_URI || 'mongodb://localhost/brew'
};

config.spark = {
  token: process.env.SPARK_TOKEN || 'token',
  device1: process.env.SPARK_DEVICE1 || 'device-id'
};

config.mock = process.env.MOCK || '';
config.logFrequency = process.env.STATUS_FREQ ? parseInt(process.env.STATUS_FREQ, 10) : 30000;

module.exports = config;
