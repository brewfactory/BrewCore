/*
 * SparkCore
 *
 * @module SparkCore
 */


var events  = require('events');
var coreEmitter = new events.EventEmitter();

var request = require('request');
var spark = require('sparknode');

var config = require('../../config');
var Logger = require('../module/Logger');
var LOG = 'SparkCore';

var connected = false;

var lastTempEvent = new Date();
var lastPwmEvent = new Date();

var CLOUD_URL = 'https://api.spark.io/v1/devices/';

var core1;


/*
 * Initialize
 *
 * @method init
 */
exports.init = function () {
  var token = config.spark.token;
  var device1Id = config.spark.device1;

  core1 = new spark.Core({
    accessToken: token,
    id: device1Id
  });

  // Events
  core1.on('connect', function (data) {
    coreEmitter.emit('connect', data);
  });

  core1.on('tempInfo', function (data) {
    lastTempEvent = new Date();
    coreEmitter.emit('tempInfo', data);
  });

  core1.on('pwmInfo', function (data) {
    lastPwmEvent = new Date();
    coreEmitter.emit('pwmInfo', data);
  });

  core1.on('error', function (data) {
    coreEmitter.emit('error', data);
  });

  // Get variables via the REST api
  setInterval(function () {
    var now = new Date().getTime();

    // Temperature
    if(now - lastTempEvent.getTime() > 2000) {
      exports.getTemperature();
    }

    // PWM
    if(now - lastPwmEvent.getTime() > 2000) {
      exports.getPWM();
    }
  }, 3000);
};


/*
 * Get temperature
 * get variable via the REST api
 *
 * @method getTemperature
 */
exports.getTemperature = function () {
  var url = CLOUD_URL + config.spark.device1 +
    '/temperature?access_token=' + config.spark.token;

  request(url, function (err, res, body) {
    var temp;

    if(err) {
      return Logger.error('Get temperature', LOG, { err: err });
    }

    try {
      body = JSON.parse(body);
    } catch (err) {
      Logger.error('JSON parse', LOG, { err: err, body: body });
    }

    temp = parseInt(body.result, 10);

    if(!isNaN(temp)) {
      coreEmitter.emit('tempInfo', {
        data: temp
      });
    }
  });
};


/*
 * Get PWM
 * get variable via the REST api
 *
 * @method getPWM
 */
exports.getPWM = function () {
  var url = CLOUD_URL + config.spark.device1 +
    '/pwm?access_token=' + config.spark.token;

  request(url, function (err, res, body) {
    var pwm;

    if(err) {
      return Logger.error('Get PWM', LOG, { err: err });
    }

    try {
      body = JSON.parse(body);
    } catch (err) {
      Logger.error('JSON parse', LOG, { err: err, body: body });
    }

    pwm = parseInt(body.result, 10);

    if(!isNaN(pwm)) {
      coreEmitter.emit('pwmInfo', {
        data: pwm
      });
    }
  });
};


/*
 * Set point
 *
 * @method setPoint
 * @param {String} pointStr
 * @callback
 */
exports.setPoint = function (pointStr, callback) {
  if(connected === false) {
    return;
  }

  pointStr = pointStr.toString();

  Logger.silly('Should set the poit', pointStr);

  if(core1 && typeof core1.setPoint === 'function') {
    Logger.info('setPoint to core1', LOG, { point: pointStr });

    core1.setPoint(pointStr, callback);
  }
};


/*
 * Events
 *
 */

// Connect
coreEmitter.on('connect', function() {
  connected = true;
});

// Error
coreEmitter.on('error', function (err) {
  Logger.error('Error happened', LOG, {
    err: err
  });
});

exports.coreEmitter = coreEmitter;
