/*
 * SparkCore
 *
 * @module SparkCore
 */

var nconf = require('nconf');
var spark = require('sparknode');

var core1 = new spark.Core({
  accessToken: nconf.get('spark:token'),
  id: nconf.get('spark:device1')
});

exports.core1 = core1;
