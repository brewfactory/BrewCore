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


/*

 * Init
 *
 * @method init
 */
function init () {
  Logger.init();

  temperature.init();
  brewer.init();

  Logger.info('Init', LOG);
}

exports.emitter = Emitter;

exports.init = init;

exports.brew = {};
exports.brew.cancel = brewer.cancelBrew;
exports.brew.set = brewer.setBrew;
exports.brew.pause = brewer.setPaused;
exports.brew.get = brewer.getActualBrew;
