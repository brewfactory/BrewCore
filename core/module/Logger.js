/**
 * Logger
 *
 * @module Logger
 **/

'use strict';

var winston = require('winston');

var LOG = 'Logger';
var CONFIG = {

  // Winston log levels
  levels: {
    silly: 0,
    verbose: 1,
    data: 2,
    event: 3,
    info: 4,
    warn: 5,
    debug: 6,
    error: 7,
    silent: 8
  },
  colors: {
    silly: 'white',
    verbose: 'green',
    data: 'grey',
    event: 'grey',
    info: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red',
    silent: 'white'
  }
};

var Logger;


/**
 * Initialize the module
 *
 * @method init
 * @param {Object} options
 */
exports.init = function (options) {

  options = options || {};
  options.consoleLevel = options.consoleLevel || 'info';
  CONFIG.statusFrequency = options.logStatusFrequency || CONFIG.statusFrequency;

  // Init winston logger
  if (!Logger) {
    Logger = new (winston.Logger)({
      transports: [],
      levels: CONFIG.levels,
      colors: CONFIG.colors
    });
  }

  // Remove transports
  else {
    Logger.remove(winston.transports.Console);
  }

  // Add transports
  Logger.add(winston.transports.Console, {
      colorize: true,
      level: options.consoleLevel
    }
  );

  Logger.info(LOG + ' is successfully initialized', LOG);
};


/**
 * Log level: silly
 *
 * @method silly
 */
exports.silly = function () {
  var args = Array.prototype.slice.call(arguments);
  Logger.silly.apply(Logger, args);
};


/**
 * Log level: verbose
 *
 * @method verbosel
 */
exports.verbose = function () {
  var args = Array.prototype.slice.call(arguments);
  Logger.verbose.apply(Logger, args);
};


/**
 * Log level: event
 *
 * @method event
 */
exports.event = function () {
  var args = Array.prototype.slice.call(arguments);
  Logger.event.apply(Logger, args);
};


/**
 * Log level: info
 *
 * @method info
 */
exports.info = function () {
  var args = Array.prototype.slice.call(arguments);
  Logger.info.apply(Logger, args);
};


/**
 * Log level: data
 *
 * @method data
 */
exports.data = function () {
  var args = Array.prototype.slice.call(arguments);
  Logger.data.apply(Logger, args);
};


/**
 * Log level: warn
 *
 * @method warn
 */
exports.warn = function () {
  var args = Array.prototype.slice.call(arguments);
  Logger.warn.apply(Logger, args);
};


/**
 * Log level: debug
 *
 * @method debug
 */
exports.debug = function () {
  var args = Array.prototype.slice.call(arguments);
  Logger.debug.apply(Logger, args);
};


/**
 * Log level: error
 *
 * @method error
 */
exports.error = function () {
  var args = Array.prototype.slice.call(arguments);
  Logger.error.apply(Logger, args);
};
