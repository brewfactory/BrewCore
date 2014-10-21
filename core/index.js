/*
 * Core
 *
 * @module Core
 */


var Logger = require('./module/Logger');
var LOG = 'Core';

var coreEvent = require('./event');
var Emitter = coreEvent.emitter;

var temperature = require('./temperature');
var brewer = require('./brewer');
var device = require('./device');

var Status = require('./module/Status');


/*

 * Init
 *
 * @method init
 */
function init () {
  Logger.init();

  device.init();
  temperature.init();
  brewer.init();

  Logger.info('Init', LOG);
  Status.init();
}

exports.emitter = Emitter;

exports.init = init;

exports.brew = {};
exports.brew.cancel = brewer.cancelBrew;
exports.brew.set = brewer.setBrew;
exports.brew.pause = brewer.setPaused;
exports.brew.get = brewer.getActualBrew;
