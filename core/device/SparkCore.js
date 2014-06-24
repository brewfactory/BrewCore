/*
 * SparkCore
 *
 * @module SparkCore
 */

var nconf = require('nconf');
var spark = require('sparknode');

var Logger = require('../module/Logger');
var LOG = 'SparkCore';

var device1Id = nconf.get('spark:device1');

var core1 = new spark.Core({
  accessToken: nconf.get('spark:token'),
  id: device1Id
});

core1.setPoint = function () {};

core1.on('error', function (err) {
  Logger.error('Error happened', LOG, {
    err: err,
    device: device1Id
  });
});

exports.core1 = core1;
