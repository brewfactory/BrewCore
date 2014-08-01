/*
 * Socket
 *
 * @module Socket
 */

var Logger = require('./Logger');
var core = require('../../core');
var last = {
  temp: 0,
  pwm: 0
};
var io;


/*
 * Initialize
 *
 * @method init
 * @param {Object} _io - SocketIO instance
 */
exports.init = function (_io) {
  io = _io;

  io.on('connect', function () {
    exports.emit('brew:changed', core.brew.get());
    exports.emit('temperature:changed', last.temp);
    exports.emit('pwm:changed', last.pwm);
  });
};


/*
 * Emit
 *
 * @method emit
 * @param {String} key
 * @param {Object} data
 * @param {String} socketId - to a specific client
 */
exports.emit = function (key, data, socketId) {
  if (!io) {
    return Logger.error('IO have to be initialized first.', 'Socket');
  }

  if (socketId) {
    if (!io.sockets.sockets[socketId]) {
      return Logger.warn('Socket is not resolvable.', 'Socket', { socketId: socketId });
    }
    io.sockets.sockets[socketId].emit(key, data);
  } else {
    io.emit(key, data);
  }
};


/*
 * Set core emitter
 *
 * @method setCoreEmitter
 * @param {EventEmitter} emitter
 */
exports.setCoreEmitter = function (emitter) {

  // Brew
  emitter.on('brew:changed', function (data) {
    exports.emit('brew_changed', data);
  });

  emitter.on('brew:ended', function (data) {
    exports.emit('brew_ended', data);
  });

  emitter.on('brew:status', function (data) {
    exports.emit('brew_status', data);
  });

  emitter.on('brew:phase', function (data) {
    exports.emit('brew_phase', data);
  });


  // Temperature
  emitter.on('temperature:changed', function (data) {
    last.temp = data;
    exports.emit('temperature_changed', data);
  });


  // PWM
  emitter.on('pwm:changed', function (data) {
    last.pwm = data;
    exports.emit('pwm_changed', data);
  });
};
