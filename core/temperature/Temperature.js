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
 * Init
 */
exports.init = function () {

  // Set point interval, because spark maybe restarted
  setInterval(function () {
    exports.setPoint(point);
  }, 5000);

  // SparkCloud tempInfo
  device.core1.on('tempInfo', tempInfoHandler);
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
 * Set point
 *
 * @method setPoint
 * @param {Number} _point
 */
exports.setPoint = function (_point) {
  point = _point;

  device.core1.setPoint(point, function(err) {
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
