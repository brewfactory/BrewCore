/*
 * Device index
 *
 */

var Logger = require('../module/Logger');
var LOG = 'Device';

var mocked = false;
var SparkCore;

if(process.env.MOCK && process.env.MOCK.indexOf('spark') > -1) {
  mocked = true;
  SparkCore = require('./SparkCoreMock');
} else {
  SparkCore = require('./SparkCore');
}


/*
 * Initialize device
 *
 * @method init
 */
exports.init = function () {
  if(mocked === true) {
    Logger.info('Use mocked device', LOG);
  } else {
    Logger.info('Use real device', LOG);
  }

  SparkCore.init();
};


exports.coreEmitter = SparkCore.coreEmitter;
exports.setPoint = SparkCore.setPoint;
