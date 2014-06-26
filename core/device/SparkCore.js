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
  var core1Emit;

  core1 = new spark.Core({
    accessToken: token,
    id: device1Id
  });

  core1Emit = core1.emit;

  // Pipe emitter
  // FIXME: anything better?
  core1.emit = function() {
    var args = Array.prototype.slice.call(arguments);

    // Original
    core1Emit.apply(core1, args);

    // Root emitter
    coreEmitter.emit.apply(coreEmitter, args);
  };
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
