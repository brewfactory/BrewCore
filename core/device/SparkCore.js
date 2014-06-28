/*
 * SparkCore
 *
 * @module SparkCore
 */

var events  = require('events');
var coreEmitter = new events.EventEmitter();

var nconf = require('nconf');
var spark = require('sparknode');

var Logger = require('../module/Logger');
var LOG = 'SparkCore';

var connected = false;

var core1;


/*
 * Initialize
 *
 * @method init
 */
exports.init = function () {
  var token = nconf.get('spark:token');
  var device1Id = nconf.get('spark:device1');

  core1 = new spark.Core({
    accessToken: token,
    id: device1Id
  });

  core1.on('connect', function (data) {
    coreEmitter.emit('connect', data);
  });

  core1.on('tempInfo', function (data) {
    coreEmitter.emit('tempInfo', data);
  });

  core1.on('pwmInfo', function (data) {
    coreEmitter.emit('pwmInfo', data);
  });

  core1.on('error', function (data) {
    coreEmitter.emit('error', data);
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
