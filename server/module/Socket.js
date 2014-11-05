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

var EVENT = {
  BREW: {
    CHANGED: 'brew_changed',
    ENDED: 'brew_ended',
    STATUS: 'brew_status',
    PHASE: 'brew_phase'
  },
  TEMP: {
    CHANGED: 'temperature_changed'
  },
  PWM: {
    CHANGED: 'pwm_changed'
  }
};


/*
 * Initialize
 *
 * @method init
 * @param {Object} _io - SocketIO instance
 */
exports.init = function (_io) {
  io = _io;

  io.on('connect', function () {
    exports.emit(EVENT.BREW.CHANGED, core.brew.get());
    exports.emit(EVENT.TEMP.CHANGED, last.temp);
    exports.emit(EVENT.PWM.CHANGED, last.pwm);
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
 * Brew formatter
 *
 * @method brewFormatter
 * @param {Object} brew
 * @return {Object}
 */
function brewFormatter (brew) {
  return {
    id: brew.id,
    name: brew.name,
    startTime: brew.startTime,
    phases: brew.phases,
    inProgress: brew.inProgress,
    paused: brew.paused
  };
}


/*
 * Set core emitter
 *
 * @method setCoreEmitter
 * @param {EventEmitter} emitter
 */
exports.setCoreEmitter = function (emitter) {

  // Brew
  emitter.on('brew:changed', function (brew) {
    exports.emit(EVENT.BREW.CHANGED, brewFormatter(brew));
  });

  emitter.on('brew:ended', function () {
    exports.emit(EVENT.BREW.ENDED);
  });

  emitter.on('brew:status', function (status) {
    exports.emit(EVENT.BREW.STATUS, status);
  });

  emitter.on('brew:phase', function (phase) {
    exports.emit(EVENT.BREW.PHASE, phase);
  });


  // Temperature
  emitter.on('temperature:changed', function (data) {
    last.temp = data;
    exports.emit(EVENT.TEMP.CHANGED, data);
  });


  // PWM
  emitter.on('pwm:changed', function (data) {
    last.pwm = data;
    exports.emit(EVENT.PWM.CHANGED, data);
  });
};
