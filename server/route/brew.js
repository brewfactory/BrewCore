/**
 * Brew routing
 *
 * @routing brew
 **/

var core = require('../../core');


/**
 * Set
 *
 * @method set
 * @param {Function} next
 */
exports.set = function *(next) {
  var body = this.request.body;

  var name = body.name || '';
  var startTime = body.startTime || new Date();
  var phases = body.phases || [];

  // Set new Brew
  core.brew.set({
    name: name,
    phases: phases,
    startTime: startTime
  });

  // Res
  yield next;
  this.body = {
    status: 'ok'
  };
};


/**
 * Stop
 *
 * @method stop
 * @param {Function} next
 */
exports.stop = function *(next) {
  core.brew.cancel();

  // Res
  yield next;
  this.body = {
    status: 'ok'
  };
};


/**
 * Pause
 *
 * @method pause
 * @param {Function} next
 */
exports.pause = function *(next) {
  var paused = core.brew.pause();

  // Res
  yield next;
  this.body = {
    status: 'ok',
    paused: paused
  };
};
