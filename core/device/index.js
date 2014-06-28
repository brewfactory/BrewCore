/*
 * Device index
 *
 */

var SparkCore = require('./SparkCore');


/*
 * Initialize device
 *
 * @method init
 */
exports.init = function () {
  SparkCore.init();
};


exports.coreEmitter = SparkCore.coreEmitter;
exports.setPoint = SparkCore.setPoint;
