/*
 * Socket
 *
 * @module Socket
 */

var Logger = require('./Logger');
var io;


/*
 * Initialize
 *
 * @method init
 * @param {Object} _io - SocketIO instance
 */
exports.init = function (_io) {
  io = _io;
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
