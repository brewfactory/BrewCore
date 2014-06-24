/*
 * Temperature
 *
 * @module Temperature
 */

var core1 = require('../device').core1;

var Logger = require('../module/Logger');
var LOG = 'Temperature';

var Event = require('../event');

var actual;
var point;

var INACTIVE_POINT = 5;

point = INACTIVE_POINT;

// If core stopped
setInterval(function () {
  core1.setPoint(point, function(err, data) {
    if(err) {
      return Logger.error('Set point', LOG, { err: err, point: point, data: data });
    }

    console.log('data', data);
  });
}, 5000);


/*
 * On tmpinfo event from the SparkCloud
 */
core1.on('tempInfo', function(info) {
  actual = info.data;

  Logger.silly('Temp updated', LOG, { temp: actual });

  Event.temperature.changed(actual);
});


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

  core1.setPoint(point, function(err) {
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
