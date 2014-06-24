/*
 * Event
 *
 * @module Event
 */

var core1 = require('../device').core1;

var Logger = require('../module/Logger');
var LOG = 'Event';

var Brewer = require('../brewer');

exports.brewer = {};

exports.brewer.brewChanged = function (brew) {
};

exports.brewer.ended = function () {
};


// pause
exports.brewer.statusChanged = function (status) {
};

exports.brewer.phaseChanged = function (phase) {
};

exports.temperature = {};

exports.temperature.changed = function (temperature) {
  Brewer.onTempUpdate(temperature);
};


/*
 * On tmpinfo event from the SparkCloud
 */
core1.on('pwmInfo', function(info) {
  var pwm = info.data;

  Logger.silly('PWM updated', LOG, { pwm: pwm });
});
