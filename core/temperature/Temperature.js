/*
 * Temperature
 *
 * @module Temperature
 */

var Logger = require('../module/Logger');
var LOG = 'Temperature';

// Core dependencies
var coreEvent = require('../event');
var device = require('../device');

var actual;
var point;

var INACTIVE_POINT = 5;

point = INACTIVE_POINT;


/*
 * Temp info handler
 *
 * @method tempInfoHandler
 * @param {Object} info
 */
function tempInfoHandler (info) {
  actual = info.data;

  Logger.silly('Temp updated', LOG, { temp: actual });

  coreEvent.temperature.changed(actual);
}



/*
 * Point info handler
 *
 * @method pointInfoHandler
 * @param {Object} info
 */
function pointInfoHandler (info) {
  Logger.silly('Point updated', LOG, { pointTemp: info.data });
}


/*
 * Init
 */
exports.init = function () {

  // Set point interval, because spark maybe restarted
  setInterval(function () {
    exports.setPoint(point);
  }, 5000);

  // Subscribe to SparkCloud events
  device.coreEmitter.on('tempInfo', tempInfoHandler);
  device.coreEmitter.on('pointInfo', pointInfoHandler);
};


/*
 * Get actual
 *
 * @method getActual
 * @return {Number}
 */
exports.getActual = function () {
  return actual;
};


/*
 * Get point
 *
 * @method getPoint
 * @return {Number}
 */
exports.getPoint = function () {
  return point;
};


/*
 * Set point
 *
 * @method setPoint
 * @param {Number} _point
 */
exports.setPoint = function (_point) {
  var strPoint;

  point = _point;

  strPoint = point.toString();

  device.setPoint(strPoint, function(err) {
    if(err) {
      return Logger.error('Set point', LOG, { err: err, point: point });
    }
  });
};


/*
 * Set point to inactive
 *
 * @method setPointToInactive
 */
exports.setPointToInactive = function () {
  exports.setPoint(INACTIVE_POINT);
};
