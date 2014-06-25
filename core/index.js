/*
 * Core
 *
 * @module Core
 */


var Logger = require('./module/Logger');
var LOG = 'Core'

var Event = require('./event');
var Emitter = Event.emitter;
var Brewer = require('./Brewer');


/*
 * Init
 *
 * @method init
 */
function init () {
  Logger.init();
  Brewer.init();

  Logger.info('Init', LOG);
}

module.exports = Emitter;

exports.init = init;

exports.brew = {};
exports.brew.cancel = Brewer.cancelBrew;
exports.brew.set = Brewer.setBrew;
exports.brew.pause = Brewer.setPaused;
