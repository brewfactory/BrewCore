/*
 * Device index
 *
 */

var Logger = require('../module/Logger');
var config = require('../../config');
var LOG = 'Device';

var mocked = false;
var SparkCore;
var latestPWM;

if (config.mock.indexOf('spark') > -1) {
  mocked = true;
  SparkCore = require('./SparkCoreMock');
} else {
  SparkCore = require('./SparkCore');
}


/*
 * Get pwm
 *
 * @method getPWM
 * @return {Number}
 */
function getPWM() {
  return latestPWM;
}


/*
 * Initialize device
 *
 * @method init
 */
function init() {
  if (mocked === true) {
    Logger.info('Use mocked device', LOG);
  } else {
    Logger.info('Use real device', LOG);
  }

  SparkCore.init();
}


SparkCore.coreEmitter.on('pwmInfo', function (info) {
  latestPWM = info.data;
});


exports.init = init;
exports.getPWM = getPWM;
exports.coreEmitter = SparkCore.coreEmitter;
exports.setPoint = SparkCore.setPoint;
